(window.webpackJsonp=window.webpackJsonp||[]).push([[60],{391:function(t,s,a){"use strict";a.r(s);var e=a(5),n=Object(e.a)({},(function(){var t=this,s=t._self._c;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("h1",{attrs:{id:"nginx-deployment"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#nginx-deployment"}},[t._v("#")]),t._v(" Nginx Deployment")]),t._v(" "),s("h2",{attrs:{id:"introduction"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#introduction"}},[t._v("#")]),t._v(" Introduction")]),t._v(" "),s("p",[t._v("Although Sanic can be run directly on Internet, it may be useful to use a proxy\nserver such as Nginx in front of it. This is particularly useful for running\nmultiple virtual hosts on the same IP, serving NodeJS or other services beside\na single Sanic app, and it also allows for efficient serving of static files.\nTLS and HTTP/2 are also easily implemented on such proxy.")]),t._v(" "),s("p",[t._v("We are setting the Sanic app to serve only locally at 127.0.0.1:8001, while the\nNginx installation is responsible for providing the service to public Internet\non domain example.com. Static files will be served by Nginx for maximal\nperformance.")]),t._v(" "),s("h2",{attrs:{id:"proxied-sanic-app"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#proxied-sanic-app"}},[t._v("#")]),t._v(" Proxied Sanic app")]),t._v(" "),s("div",{staticClass:"language-python extra-class"},[s("pre",{pre:!0,attrs:{class:"language-python"}},[s("code",[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("from")]),t._v(" sanic "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" Sanic\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("from")]),t._v(" sanic"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("response "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" text\n\napp "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" Sanic"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"proxied_example"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token decorator annotation punctuation"}},[t._v("@app"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("get")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"/"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("def")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("index")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("request"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# This should display external (public) addresses:")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" text"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token string-interpolation"}},[s("span",{pre:!0,attrs:{class:"token string"}},[t._v('f"')]),s("span",{pre:!0,attrs:{class:"token interpolation"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("request"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("remote_addr"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")])]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v(" connected to ")]),s("span",{pre:!0,attrs:{class:"token interpolation"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("request"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("url_for"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'index'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")])]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('\\n"')])]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token string-interpolation"}},[s("span",{pre:!0,attrs:{class:"token string"}},[t._v('f"Forwarded: ')]),s("span",{pre:!0,attrs:{class:"token interpolation"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("request"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("forwarded"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")])]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('\\n"')])]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n")])])]),s("p",[t._v("Since this is going to be a system service, save your code to\n"),s("code",[t._v("/srv/sanicservice/proxied_example.py")]),t._v(".")]),t._v(" "),s("p",[t._v("For testing, run your app in a terminal using the "),s("code",[t._v("sanic")]),t._v(" CLI in the folder where you saved the file.")]),t._v(" "),s("div",{staticClass:"language-bash extra-class"},[s("pre",{pre:!0,attrs:{class:"language-bash"}},[s("code",[s("span",{pre:!0,attrs:{class:"token assign-left variable"}},[t._v("SANIC_FORWARDED_SECRET")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v("_hostname sanic proxied_example "),s("span",{pre:!0,attrs:{class:"token parameter variable"}},[t._v("--port")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("8001")]),t._v("\n")])])]),s("p",[t._v("We provide Sanic config "),s("code",[t._v("FORWARDED_SECRET")]),t._v(" to identify which proxy it gets\nthe remote addresses from. Note the "),s("code",[t._v("_")]),t._v(" in front of the local hostname.\nThis gives basic protection against users spoofing these headers and faking\ntheir IP addresses and more.")]),t._v(" "),s("h2",{attrs:{id:"ssl-certificates"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#ssl-certificates"}},[t._v("#")]),t._v(" SSL certificates")]),t._v(" "),s("p",[t._v("Install Certbot and obtain a certicate for all your domains. This will spin up its own webserver on port 80 for a moment to verify you control the given domain names.")]),t._v(" "),s("div",{staticClass:"language-bash extra-class"},[s("pre",{pre:!0,attrs:{class:"language-bash"}},[s("code",[t._v("certbot "),s("span",{pre:!0,attrs:{class:"token parameter variable"}},[t._v("-d")]),t._v(" example.com "),s("span",{pre:!0,attrs:{class:"token parameter variable"}},[t._v("-d")]),t._v(" www.example.com\n")])])]),s("h2",{attrs:{id:"nginx-configuration"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#nginx-configuration"}},[t._v("#")]),t._v(" Nginx configuration")]),t._v(" "),s("p",[t._v("Quite much configuration is required to allow fast transparent proxying, but\nfor the most part these don't need to be modified, so bear with me.")]),t._v(" "),s("div",{staticClass:"custom-block tip"},[s("p",{staticClass:"custom-block-title"},[t._v("Note")]),t._v(" "),s("p",[t._v("Separate upstream section, rather than simply adding the IP after "),s("code",[t._v("proxy_pass")]),t._v("\nas in most tutorials, is needed for HTTP keep-alive. We also enable streaming,\nWebSockets and Nginx serving static files.")])]),t._v(" "),s("p",[t._v("The following config goes inside the "),s("code",[t._v("http")]),t._v(" section of "),s("code",[t._v("nginx.conf")]),t._v(" or if your\nsystem uses multiple config files, "),s("code",[t._v("/etc/nginx/sites-available/default")]),t._v(" or\nyour own files (be sure to symlink them to "),s("code",[t._v("sites-enabled")]),t._v("):")]),t._v(" "),s("div",{staticClass:"language-nginx extra-class"},[s("pre",{pre:!0,attrs:{class:"language-nginx"}},[s("code",[s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# Files managed by Certbot")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("ssl_certificate")]),t._v(" /etc/letsencrypt/live/example.com/fullchain.pem")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("ssl_certificate_key")]),t._v(" /etc/letsencrypt/live/example.com/privkey.pem")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# Sanic service")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("upstream")]),t._v(" example.com")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("keepalive")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("100")])]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("server")]),t._v(" 127.0.0.1:8001")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("#server unix:/tmp//sanic.sock;")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("server")])]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("server_name")]),t._v(" example.com")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("listen")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("443")]),t._v(" ssl http2 default_server")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("listen")]),t._v(" [::]:443 ssl http2 default_server")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# Serve static files if found, otherwise proxy to Sanic")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("location")]),t._v(" /")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("root")]),t._v(" /srv/sanicexample/static")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("try_files")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token variable"}},[t._v("$uri")]),t._v(" @sanic")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("location")]),t._v(" @sanic")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("proxy_pass")]),t._v(" http://"),s("span",{pre:!0,attrs:{class:"token variable"}},[t._v("$server_name")])]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# Allow fast streaming HTTP/1.1 pipes (keep-alive, unbuffered)")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("proxy_http_version")]),t._v(" 1.1")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("proxy_request_buffering")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("off")])]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("proxy_buffering")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("off")])]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("proxy_set_header")]),t._v(' forwarded by=\\"_'),s("span",{pre:!0,attrs:{class:"token variable"}},[t._v("$hostname")]),t._v('\\"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("$for_addr"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("proto=$scheme"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v('host=\\"$http_host\\"'),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# Allow websockets and keep-alive (avoid connection: close)")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("proxy_set_header")]),t._v(" connection "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"upgrade"')])]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("proxy_set_header")]),t._v(" upgrade "),s("span",{pre:!0,attrs:{class:"token variable"}},[t._v("$http_upgrade")])]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# Redirect WWW to no-WWW")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("server")])]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("listen")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("443")]),t._v(" ssl http2")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("listen")]),t._v(" [::]:443 ssl http2")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("server_name")]),t._v(" ~^www\\.(.*)$")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("308")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token variable"}},[t._v("$scheme")]),t._v("://"),s("span",{pre:!0,attrs:{class:"token variable"}},[t._v("$1")]),s("span",{pre:!0,attrs:{class:"token variable"}},[t._v("$request_uri")])]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# Redirect all HTTP to HTTPS with no-WWW")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("server")])]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("listen")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("80")]),t._v(" default_server")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("listen")]),t._v(" [::]:80 default_server")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("server_name")]),t._v(" ~^(?:www\\.)?(.*)$")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("308")]),t._v(" https://"),s("span",{pre:!0,attrs:{class:"token variable"}},[t._v("$1")]),s("span",{pre:!0,attrs:{class:"token variable"}},[t._v("$request_uri")])]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# Forwarded for= client IP address formatting")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("map")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token variable"}},[t._v("$remote_addr")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token variable"}},[t._v("$for_addr")])]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v('\n  ~^[0-9.]+$          "for=$remote_addr"'),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("        "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# IPv4 client address")]),t._v('\n  ~^[0-9A-Fa-f:.]+$   "for=\\"[$remote_addr]\\""'),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("  "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# IPv6 bracketed and quoted")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("default")]),t._v("             "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"for=unknown"')])]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("             "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# Unix socket")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("p",[t._v("Start or restart Nginx for changes to take effect. E.g.")]),t._v(" "),s("div",{staticClass:"language-bash extra-class"},[s("pre",{pre:!0,attrs:{class:"language-bash"}},[s("code",[t._v("systemctl restart nginx\n")])])]),s("p",[t._v("You should be able to connect your app on "),s("code",[t._v("https://example.com")]),t._v(". Any 404\nerrors and such will be handled by Sanic's error pages, and whenever a static\nfile is present at a given path, it will be served by Nginx.")]),t._v(" "),s("h2",{attrs:{id:"running-as-a-service"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#running-as-a-service"}},[t._v("#")]),t._v(" Running as a service")]),t._v(" "),s("p",[t._v("This part is for Linux distributions based on "),s("code",[t._v("systemd")]),t._v(". Create a unit file\n"),s("code",[t._v("/etc/systemd/system/sanicexample.service")])]),t._v(" "),s("div",{staticClass:"language-systemd extra-class"},[s("pre",{pre:!0,attrs:{class:"language-systemd"}},[s("code",[s("span",{pre:!0,attrs:{class:"token section"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),s("span",{pre:!0,attrs:{class:"token section-name selector"}},[t._v("Unit")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")])]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token key attr-name"}},[t._v("Description")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("=")]),s("span",{pre:!0,attrs:{class:"token value attr-value"}},[t._v("Sanic Example")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token section"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),s("span",{pre:!0,attrs:{class:"token section-name selector"}},[t._v("Service")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")])]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token key attr-name"}},[t._v("DynamicUser")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("=")]),s("span",{pre:!0,attrs:{class:"token value attr-value"}},[t._v("Yes")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token key attr-name"}},[t._v("WorkingDirectory")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("=")]),s("span",{pre:!0,attrs:{class:"token value attr-value"}},[t._v("/srv/sanicservice")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token key attr-name"}},[t._v("Environment")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("=")]),s("span",{pre:!0,attrs:{class:"token value attr-value"}},[t._v("SANIC_PROXY_SECRET=_hostname")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token key attr-name"}},[t._v("ExecStart")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("=")]),s("span",{pre:!0,attrs:{class:"token value attr-value"}},[t._v("sanic proxied_example --port 8001 --fast")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token key attr-name"}},[t._v("Restart")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("=")]),s("span",{pre:!0,attrs:{class:"token value attr-value"}},[t._v("always")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token section"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),s("span",{pre:!0,attrs:{class:"token section-name selector"}},[t._v("Install")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")])]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token key attr-name"}},[t._v("WantedBy")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("=")]),s("span",{pre:!0,attrs:{class:"token value attr-value"}},[t._v("multi-user.target")]),t._v("\n")])])]),s("p",[t._v("Then reload service files, start your service and enable it on boot:")]),t._v(" "),s("div",{staticClass:"language-bash extra-class"},[s("pre",{pre:!0,attrs:{class:"language-bash"}},[s("code",[t._v("systemctl daemon-reload\nsystemctl start sanicexample\nsystemctl "),s("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v("enable")]),t._v(" sanicexample\n")])])]),s("div",{staticClass:"custom-block tip"},[s("p",{staticClass:"custom-block-title"},[t._v("Note")]),t._v(" "),s("p",[t._v("For brevity we skipped setting up a separate user account and a Python virtual environment or installing your app as a Python module. There are good tutorials on those topics elsewhere that easily apply to Sanic as well. The DynamicUser setting creates a strong sandbox which basically means your application cannot store its data in files, so you may consider setting "),s("code",[t._v("User=sanicexample")]),t._v(" instead if you need that.")])])])}),[],!1,null,null,null);s.default=n.exports}}]);