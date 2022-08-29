# Nginx Deployment

## イントロダクション


Sanicはインターネット上で直接実行できますが、プロキシを使用すると便利な場合があります。 Nginxのようなサーバーを目の前にします。 これは、同じIP上で複数の仮想ホストを実行したり、単一のSanicアプリに加えてNodeJSやその他のサービスを提供したり、静的ファイルを効率的に提供したりする場合に特に便利です。 SSLとHTTP/2も、このようなプロキシに簡単に実装できます。 SSL and HTTP/2 are also easily implemented on such proxy.

私たちはSanicのアプリを`127.0.0.1:8000`でローカルのみにサービスを提供するように設定していますが、Nginxのインストールはドメイン`example.com`上のパブリックインターネットにサービスを提供する責任があります。 静的ファイルは`/var/www/`。


## プロキシSanicアプリ

信頼できるプロキシを識別するために使用される秘密キーを使用してアプリを設定し、実際のクライアントIPおよびその他の情報を識別できるようにする必要があります。 これにより、IPアドレスやその他の詳細を偽装するために、インターネット上で偽のヘッダーを送信するすべてのユーザーを保護できます。 任意のランダムな文字列を選択し、アプリとNginx configの両方で設定します。

```python
from sanic import Sanic
from sanic.response import text

app = Sanic("proxied_example")
app.config.FORWARDED_SECRET = "YOUR SECRET"

@app.get("/")
def index(request):
    # This should display external (public) addresses:
    return text(
        f"{request.remote_addr} connected to {request.url_for('index')}\n"
        f"Forwarded: {request.forwarded}\n"
    )

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8000, workers=8, access_log=False)
```

これはシステムサービスになるので、コードを次の場所に保存します。 `/srv/sanicexample/sanicexample.py`

テストでは、ターミナルでアプリを実行します。

## Nginxの設定

高速透過プロキシを可能にするためにはかなり多くの設定が必要ですが、これらの大部分は修正する必要がないので、私に我慢してください。

HTTPキープアライブを有効にするには、アップストリームサーバを個別の`upstream`ブロックで設定する必要があります。 これにより、パフォーマンスが大幅に向上します。 そこで、`proxy_pass`ディレクティブでアップストリームアドレスを直接指定する代わりに、これを使用します。 この例では、アップストリーム・セクションの名前`server_name`、つまりパブリック・ドメイン名であり、これも`Host`ヘッダーでSanicに渡されます。 必要に応じて名前を変更できます。 ロード・バランシングとフェイルオーバーのために、複数のサーバを用意することもできます。

`example.com`の2つの出現箇所を実際のドメイン名に変更し、`YOUR SECRET`の代わりにアプリ用に選択したシークレットを使用します。

```nginx
upstream example.com {
  keepalive 100;
  server 127.0.0.1:8000;
  #server unix:/tmp/sanic.sock;
}

server {
  server_name example.com;
  listen 443 ssl http2 default_server;
  listen [::]:443 ssl http2 default_server;
  # Serve static files if found, otherwise proxy to Sanic
  location / {
    root /var/www;
    try_files $uri @sanic;
  }
  location @sanic {
    proxy_pass http://$server_name;
    # Allow fast streaming HTTP/1.1 pipes (keep-alive, unbuffered)
    proxy_http_version 1.1;
    proxy_request_buffering off;
    proxy_buffering off;
    # Proxy forwarding (password configured in app.config.FORWARDED_SECRET)
    proxy_set_header forwarded "$proxy_forwarded;secret=\"YOUR SECRET\"";
    # Allow websockets and keep-alive (avoid connection: close)
    proxy_set_header connection "upgrade";
    proxy_set_header upgrade $http_upgrade;
  }
}
```

Cookieの可視性の問題および検索エンジンでのアドレスの一貫性を回避するには、次の手順を実行します。 すべての訪問者を1つの真のドメインにリダイレクトすることをお勧めします。 HTTPS:

```nginx
# Redirect all HTTP to HTTPS with no-WWW
server {
  listen 80 default_server;
  listen [::]:80 default_server;
  server_name ~^(?:www\.)?(.*)$;
  return 301 https://$1$request_uri;
}

# Redirect WWW to no-WWW
server {
  listen 443 ssl http2;
  listen [::]:443 ssl http2;
  server_name ~^www\.(.*)$;
  return 301 $scheme://$1$request_uri;
}
```

上記の設定セクションは、`/etc/nginx/sites-available/default`または他のサイト設定に配置できます (新しい設定セクションを作成する場合は、必ず`sites-enabled`にシンボリックリンクしてください) 。

SSL証明書がメイン設定で設定されていることを確認します。 それぞれに`ssl_certificate`ディレクティブと`ssl_certificate_key`ディレクティブを追加します。 SSLでリスニングする`server`セクション。

さらに、これらすべてを`nginx/conf.d/forwarded.conf`にコピー&ペーストします。

```nginx
# RFC 7239 Forwarded header for Nginx proxy_pass

# Add within your server or location block:
#    proxy_set_header forwarded "$proxy_forwarded;secret=\"YOUR SECRET\"";

# Configure your upstream web server to identify this proxy by that password
# because otherwise anyone on the Internet could spoof these headers and fake
# their real IP address and other information to your service.


# Provide the full proxy chain in $proxy_forwarded
map $proxy_add_forwarded $proxy_forwarded {
  default "$proxy_add_forwarded;by=\"_$hostname\";proto=$scheme;host=\"$http_host\";path=\"$request_uri\"";
}

# The following mappings are based on
# https://www.nginx.com/resources/wiki/start/topics/examples/forwarded/

map $remote_addr $proxy_forwarded_elem {
  # IPv4 addresses can be sent as-is
  ~^[0-9.]+$          "for=$remote_addr";

  # IPv6 addresses need to be bracketed and quoted
  ~^[0-9A-Fa-f:.]+$   "for=\"[$remote_addr]\"";

  # Unix domain socket names cannot be represented in RFC 7239 syntax
  default             "for=unknown";
}

map $http_forwarded $proxy_add_forwarded {
  # If the incoming Forwarded header is syntactically valid, append to it
  "~^(,[ \\t]*)*([!#$%&'*+.^_`|~0-9A-Za-z-]+=([!#$%&'*+.^_`|~0-9A-Za-z-]+|\"([\\t \\x21\\x23-\\x5B\\x5D-\\x7E\\x80-\\xFF]|\\\\[\\t \\x21-\\x7E\\x80-\\xFF])*\"))?(;([!#$%&'*+.^_`|~0-9A-Za-z-]+=([!#$%&'*+.^_`|~0-9A-Za-z-]+|\"([\\t \\x21\\x23-\\x5B\\x5D-\\x7E\\x80-\\xFF]|\\\\[\\t \\x21-\\x7E\\x80-\\xFF])*\"))?)*([ \\t]*,([ \\t]*([!#$%&'*+.^_`|~0-9A-Za-z-]+=([!#$%&'*+.^_`|~0-9A-Za-z-]+|\"([\\t \\x21\\x23-\\x5B\\x5D-\\x7E\\x80-\\xFF]|\\\\[\\t \\x21-\\x7E\\x80-\\xFF])*\"))?(;([!#$%&'*+.^_`|~0-9A-Za-z-]+=([!#$%&'*+.^_`|~0-9A-Za-z-]+|\"([\\t \\x21\\x23-\\x5B\\x5D-\\x7E\\x80-\\xFF]|\\\\[\\t \\x21-\\x7E\\x80-\\xFF])*\"))?)*)?)*$" "$http_forwarded, $proxy_forwarded_elem";

  # Otherwise, replace it
  default "$proxy_forwarded_elem";
}
```

::: tip Note `conf.d`と`sites-available`を使用しないインストールの場合、上記の設定はすべて、メインの`nginx.conf`の`http`セクション内に配置することもできます。 :::
:::

変更後にNginxの設定をリロード:

```bash
sudo nginx -s reload
```

これで、`https://example.com/`でアプリを接続できるようになります。 404エラーなどはすべてSanicのエラーページで処理され、静的ファイルが与えられたパスに存在する時はいつでもNginxによって提供されます。

## SSL certificates

サーバで有効な証明書をまだ設定していない場合は、ここで設定します。 `certbot`と`python 3-certbot-nginx`をインストールしてください。

```bash
certbot --nginx -d example.com -d www.example.com
```

`<https://www.nginx.com/blog/using-free-ssltls-certificates-from-lets-encrypt-with-nginx/>`_

## サービスとして実行

このパートは`systemd`に基づくLinuxディストリビューション用です。 ユニットファイル`/etc/systemd/system/sanicexample.service`を作成します。

```text
[Unit]
Description=Sanic Example

[Service]
User=nobody
WorkingDirectory=/srv/sanicexample
ExecStart=/usr/bin/env python3 sanicexample.py
Restart=always

[Install]
WantedBy=multi-user.target
```

次に、サービスファイルをリロードし、サービスを起動してブート時に有効にします。

```bash
sudo systemctl daemon-reload
sudo systemctl start sanicexample
sudo systemctl enable sanicexample
```
