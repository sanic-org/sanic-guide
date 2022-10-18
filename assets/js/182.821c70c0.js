(window.webpackJsonp=window.webpackJsonp||[]).push([[182],{503:function(t,s,a){"use strict";a.r(s);var n=a(4),e=Object(n.a)({},(function(){var t=this,s=t._self._c;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("h1",{attrs:{id:"httpメソッド"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#httpメソッド"}},[t._v("#")]),t._v(" HTTPメソッド")]),t._v(" "),s("h2",{attrs:{id:"自動エンドポイント"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#自動エンドポイント"}},[t._v("#")]),t._v(" 自動エンドポイント")]),t._v(" "),s("p",[t._v("デフォルトの動作は、すべての"),s("code",[t._v("GET")]),t._v("ルートに"),s("code",[t._v("HEAD")]),t._v("エンドポイントを、そして全ルートに"),s("code",[t._v("OPTIONS")]),t._v("エンドポイントを自動的に生成することです。\nさらに、"),s("code",[t._v("TRACE")]),t._v("エンドポイントを自動的に生成するオプションもあります。しかし、これらは初期状態では有効ではありません。")]),t._v(" "),s("tabs",[s("tab",{attrs:{name:"HEAD"}},[s("ul",[s("li",[s("strong",[t._v("Configuration")]),t._v(": "),s("code",[t._v("AUTO_HEAD")]),t._v(" (default "),s("code",[t._v("True")]),t._v(")")]),t._v(" "),s("li",[s("strong",[t._v("MDN")]),t._v(": "),s("a",{attrs:{href:"https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/HEAD",target:"_blank",rel:"noopener noreferrer"}},[t._v("Read more"),s("OutboundLink")],1)])]),t._v(" "),s("p",[s("code",[t._v("HEAD")]),t._v(" リクエストはヘッダーを提供し、それ以外は "),s("code",[t._v("GET")]),t._v(" リクエストが提供するものと同じレスポンスを提供します。\nしかし、実際にはボディを返しません。")]),t._v(" "),s("div",{staticClass:"language-python extra-class"},[s("pre",{pre:!0,attrs:{class:"language-python"}},[s("code",[s("span",{pre:!0,attrs:{class:"token decorator annotation punctuation"}},[t._v("@app"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("get")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"/"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("async")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("def")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("hello_world")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("request"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" text"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"Hello, world."')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n")])])]),s("p",[t._v("上記のルート定義があれば、Sanic Extensionsはここで見られるように"),s("code",[t._v("HEAD")]),t._v("レスポンスを有効にします。")]),t._v(" "),s("div",{staticClass:"language- extra-class"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[t._v("$ curl localhost:8000 --head\nHTTP/1.1 200 OK\naccess-control-allow-origin: *\ncontent-length: 13\nconnection: keep-alive\ncontent-type: text/plain; charset=utf-8\n")])])])]),t._v(" "),s("tab",{attrs:{name:"OPTIONS"}},[s("ul",[s("li",[s("strong",[t._v("Configuration")]),t._v(": "),s("code",[t._v("AUTO_OPTIONS")]),t._v(" (default "),s("code",[t._v("True")]),t._v(")")]),t._v(" "),s("li",[s("strong",[t._v("MDN")]),t._v(": "),s("a",{attrs:{href:"https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/OPTIONS",target:"_blank",rel:"noopener noreferrer"}},[t._v("Read more"),s("OutboundLink")],1)])]),t._v(" "),s("p",[s("code",[t._v("OPTIONS")]),t._v(" リクエストは、クライアントが与えられたエンドポイントとの通信をどのように許可されるかの詳細を受信者に提供します。")]),t._v(" "),s("div",{staticClass:"language-python extra-class"},[s("pre",{pre:!0,attrs:{class:"language-python"}},[s("code",[s("span",{pre:!0,attrs:{class:"token decorator annotation punctuation"}},[t._v("@app"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("get")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"/"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("async")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("def")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("hello_world")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("request"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" text"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"Hello, world."')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n")])])]),s("p",[t._v("上記のルート定義があれば、Sanic Extensionsはここで見られるように"),s("code",[t._v("HEAD")]),t._v("レスポンスを有効にします。")]),t._v(" "),s("p",[t._v("この例では、"),s("code",[t._v("access-control-allow-origins")]),t._v("も表示されていることに注意することが重要です。\nこれは、"),s("RouterLink",{attrs:{to:"/ja/plugins/sanic-ext/http/cors.html"}},[t._v("CORS保護")]),t._v("がデフォルトで有効になっているためです。")],1),t._v(" "),s("div",{staticClass:"language- extra-class"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[t._v("$ curl localhost:8000 -X OPTIONS -i\nHTTP/1.1 204 No Content\nallow: GET,HEAD,OPTIONS\naccess-control-allow-origin: *\nconnection: keep-alive\n")])])]),s("div",{staticClass:"custom-block tip"},[s("p",{staticClass:"custom-block-title"},[t._v("Sanic Extensionsがこれらのルートを自動的にセットアップしてくれるとしても、手動で `@app.options` ルートを作成することにした場合、それは オーバーライド**されません**。")])])]),t._v(" "),s("tab",{attrs:{name:"TRACE"}},[s("ul",[s("li",[s("strong",[t._v("Configuration")]),t._v(": "),s("code",[t._v("AUTO_TRACE")]),t._v(" (default "),s("code",[t._v("False")]),t._v(")")]),t._v(" "),s("li",[s("strong",[t._v("MDN")]),t._v(": "),s("a",{attrs:{href:"https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/TRACE",target:"_blank",rel:"noopener noreferrer"}},[t._v("Read more"),s("OutboundLink")],1)])]),t._v(" "),s("p",[t._v("デフォルトでは、"),s("code",[t._v("TRACE")]),t._v("エンドポイントは自動的に作成"),s("strong",[t._v("されません")]),t._v("。しかし、Sanic Extensions では、必要であれば作成することができます。これはバニラSanicでは許可されていないことである。")]),t._v(" "),s("div",{staticClass:"language-python extra-class"},[s("pre",{pre:!0,attrs:{class:"language-python"}},[s("code",[s("span",{pre:!0,attrs:{class:"token decorator annotation punctuation"}},[t._v("@app"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("route")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"/"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" methods"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"trace"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("async")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("def")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("handler")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("request"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("\n")])])]),s("p",[t._v("これらのエンドポイントの自動作成を有効にするには、まずSanicを拡張する際に有効にする必要があります。")]),t._v(" "),s("div",{staticClass:"language-python extra-class"},[s("pre",{pre:!0,attrs:{class:"language-python"}},[s("code",[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("from")]),t._v(" sanic_ext "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" Extend"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" Config\n\nExtend"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("app"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" config"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v("Config"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("auto_trace"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),s("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("True")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n")])])]),s("p",[t._v("さて、いくつかのエンドポイントが設定されていると仮定して、以下のようにトレースすることができます。")]),t._v(" "),s("div",{staticClass:"language- extra-class"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[t._v("$ curl localhost:8000 -X TRACE\nTRACE / HTTP/1.1\nHost: localhost:9999\nUser-Agent: curl/7.76.1\nAccept: */*\n")])])]),s("div",{staticClass:"custom-block tip"},[s("p",{staticClass:"custom-block-title"},[t._v("`AUTO_TRACE` を設定すると、特にアプリケーションがプロキシの後ろに配置されている場合、非常に便利です。")]),t._v(" "),s("p",[t._v("は、プロキシがどのように動作しているかを判断するのに役立ちます。")])])])],1),t._v(" "),s("h2",{attrs:{id:"メソッドの追加サポート"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#メソッドの追加サポート"}},[t._v("#")]),t._v(" メソッドの追加サポート")]),t._v(" "),s("p",[t._v("バニラSanicでは、以下のHTTPメソッドでエンドポイントを構築することができます。")]),t._v(" "),s("ul",[s("li",[s("RouterLink",{attrs:{to:"/en/guide/basics/routing.html#get"}},[t._v("GET")])],1),t._v(" "),s("li",[s("RouterLink",{attrs:{to:"/en/guide/basics/routing.html#post"}},[t._v("POST")])],1),t._v(" "),s("li",[s("RouterLink",{attrs:{to:"/en/guide/basics/routing.html#put"}},[t._v("PUT")])],1),t._v(" "),s("li",[s("RouterLink",{attrs:{to:"/en/guide/basics/routing.html#head"}},[t._v("HEAD")])],1),t._v(" "),s("li",[s("RouterLink",{attrs:{to:"/en/guide/basics/routing.html#options"}},[t._v("OPTIONS")])],1),t._v(" "),s("li",[s("RouterLink",{attrs:{to:"/en/guide/basics/routing.html#patch"}},[t._v("PATCH")])],1),t._v(" "),s("li",[s("RouterLink",{attrs:{to:"/en/guide/basics/routing.html#delete"}},[t._v("DELETE")])],1)]),t._v(" "),s("p",[t._v("もっと見たい場合は"),s("a",{attrs:{href:"https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods",target:"_blank",rel:"noopener noreferrer"}},[t._v("MDN Web Docs"),s("OutboundLink")],1),t._v(" を見てください。")]),t._v(" "),s("div",{staticClass:"multicolumn",staticStyle:{display:"flex","flex-direction":"row","align-items":"flex-start"}},[s("div",{staticClass:"multicolumn-column",staticStyle:{"flex-grow":"1","flex-basis":"0"}},[s("p",[t._v("しかし、さらに2つの「標準的な」HTTPメソッドがあります: "),s("code",[t._v("TRACE")]),t._v(" と "),s("code",[t._v("CONNECT")]),t._v(" です。\nSanic Extensions は、これらのメソッドを使用したエンドポイントの構築を可能にするもので、他の方法では許可されません。")]),t._v(" "),s("p",[t._v("これは便利なメソッドである "),s("code",[t._v("@app.trace")]),t._v(" や "),s("code",[t._v("@app.connect")]),t._v(" を有効にするものではないことに注意してください。\nこの例で示されているように、"),s("code",[t._v("@app.route")]),t._v("を使用する必要があります。")])]),t._v(" "),s("div",{staticClass:"multicolumn-column",staticStyle:{"flex-grow":"1","flex-basis":"0"}},[s("div",{staticClass:"language-python extra-class"},[s("pre",{pre:!0,attrs:{class:"language-python"}},[s("code",[s("span",{pre:!0,attrs:{class:"token decorator annotation punctuation"}},[t._v("@app"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("route")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"/"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" methods"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"trace"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"connect"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("async")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("def")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("handler")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("_"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" empty"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n")])])])])])],1)}),[],!1,null,null,null);s.default=e.exports}}]);