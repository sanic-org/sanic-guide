(window.webpackJsonp=window.webpackJsonp||[]).push([[168],{625:function(t,s,a){"use strict";a.r(s);var n=a(19),e=Object(n.a)({},(function(){var t=this,s=t.$createElement,a=t._self._c||s;return a("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[a("h1",{attrs:{id:"スタートアップ"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#スタートアップ"}},[t._v("#")]),t._v(" スタートアップ")]),t._v(" "),a("p",[t._v("Sanic Extensionsは、SCOが開発し、保守している"),a("em",[t._v("公式サポート")]),t._v("のプラグインです。このプロジェクトの主な目的は、Web API と Web アプリケーションの開発を容易にするための追加機能を提供することです。")]),t._v(" "),a("h2",{attrs:{id:"機能"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#機能"}},[t._v("#")]),t._v(" 機能")]),t._v(" "),a("ul",[a("li",[t._v("自動で"),a("code",[t._v("HEAD")]),t._v("、"),a("code",[t._v("OPTIONS")]),t._v("、"),a("code",[t._v("TRACE")]),t._v("エンドポイントを作成")]),t._v(" "),a("li",[t._v("CORSによる保護")]),t._v(" "),a("li",[t._v("あらかじめ定義されたエンドポイント固有のレスポンスシリアライザー")]),t._v(" "),a("li",[t._v("ルートハンドラへの引数挿入")]),t._v(" "),a("li",[t._v("RedocやSwaggerを使ったOpenAPIドキュメンテーション")]),t._v(" "),a("li",[t._v("リクエストのクエリ引数とボディ入力のバリデーション")])]),t._v(" "),a("h2",{attrs:{id:"最低要件"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#最低要件"}},[t._v("#")]),t._v(" 最低要件")]),t._v(" "),a("ul",[a("li",[a("strong",[t._v("Python")]),t._v(": 3.8+")]),t._v(" "),a("li",[a("strong",[t._v("Sanic")]),t._v(": 21.9+")])]),t._v(" "),a("h2",{attrs:{id:"インストール"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#インストール"}},[t._v("#")]),t._v(" インストール")]),t._v(" "),a("p",[t._v("一番良い方法は、Sanic本体と一緒にSanic Extensionsをインストールするだけです。")]),t._v(" "),a("div",{staticClass:"language-bash extra-class"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[t._v("pip "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("install")]),t._v(" sanic"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("ext"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v("\n")])])]),a("p",[t._v("もちろん、単体でインストールすることも可能です。")]),t._v(" "),a("div",{staticClass:"language-bash extra-class"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[t._v("pip "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("install")]),t._v(" sanic-ext\n")])])]),a("h2",{attrs:{id:"アプリケーションを拡張"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#アプリケーションを拡張"}},[t._v("#")]),t._v(" アプリケーションを拡張")]),t._v(" "),a("p",[t._v("Sanic Extensionsは、特別な操作なしに、たくさんの機能を有効にしてくれます。")]),t._v(" "),a("div",{staticClass:"custom-block new"},[a("p",{staticClass:"custom-block-title"},[t._v("NEW in v21.12")]),t._v(" "),a("div",{staticClass:"multicolumn",staticStyle:{display:"flex","flex-direction":"row","align-items":"flex-start"}},[a("div",{staticClass:"multicolumn-column",staticStyle:{"flex-grow":"1","flex-basis":"0"}},[a("p",[t._v("Sanic Extensions (v21.12+) をセットアップするために必要なこと: "),a("strong",[t._v("何もない")]),t._v("。環境にインストールされていれば、セットアップが完了し、すぐに使えるようになっています。")]),t._v(" "),a("p",[t._v("このコードは、"),a("RouterLink",{attrs:{to:"/ja/guide/getting-started.html"}},[t._v("Sanic Getting Started page")]),t._v(" にある Hello, world アプリを変更せずにそのまま使用しています_。")],1)]),t._v(" "),a("div",{staticClass:"multicolumn-column",staticStyle:{"flex-grow":"1","flex-basis":"0"}},[a("div",{staticClass:"language-python extra-class"},[a("pre",{pre:!0,attrs:{class:"language-python"}},[a("code",[a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("from")]),t._v(" sanic "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" Sanic\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("from")]),t._v(" sanic"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("response "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" text\n\napp "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" Sanic"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"MyHelloWorldApp"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n\n"),a("span",{pre:!0,attrs:{class:"token decorator annotation punctuation"}},[t._v("@app"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("get")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"/"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("async")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("def")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("hello_world")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("request"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" text"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"Hello, world."')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n")])])])])])]),t._v(" "),a("div",{staticClass:"multicolumn",staticStyle:{display:"flex","flex-direction":"row","align-items":"flex-start"}},[a("div",{staticClass:"multicolumn-column",staticStyle:{"flex-grow":"1","flex-basis":"0"}},[a("p",[a("strong",[t._v("古い非推奨の設定")])]),t._v(" "),a("p",[t._v("v21.9 では、"),a("code",[t._v("Extend")]),t._v(" でインスタンス化するのが最も簡単な方法です。")]),t._v(" "),a("p",[t._v("Sanic Getting Started page](../../guide/getting-started.md) の Hello, world アプリを見返してみると、ここで追加されているのはハイライトした2行だけであることがわかると思います。")])]),t._v(" "),a("div",{staticClass:"multicolumn-column",staticStyle:{"flex-grow":"1","flex-basis":"0"}},[a("div",{staticClass:"language-python extra-class"},[a("div",{staticClass:"highlight-lines"},[a("br"),a("br"),a("div",{staticClass:"highlighted"},[t._v(" ")]),a("br"),a("br"),a("div",{staticClass:"highlighted"},[t._v(" ")]),a("br"),a("br"),a("br"),a("br"),a("br")]),a("pre",{pre:!0,attrs:{class:"language-python"}},[a("code",[a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("from")]),t._v(" sanic "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" Sanic\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("from")]),t._v(" sanic"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("response "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" text\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("from")]),t._v(" sanic_ext "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" Extend\n\napp "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" Sanic"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"MyHelloWorldApp"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\nExtend"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("app"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n\n"),a("span",{pre:!0,attrs:{class:"token decorator annotation punctuation"}},[t._v("@app"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("get")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"/"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("async")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("def")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("hello_world")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("request"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" text"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"Hello, world."')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n")])])])])]),t._v(" "),a("p",[t._v("どのように設定されているかに関わらず、これでOpenAPIのドキュメントを閲覧し、機能の一部を確認することができるはずです。"),a("a",{attrs:{href:"http://localhost:8000/docs",target:"_blank",rel:"noopener noreferrer"}},[t._v("http://localhost:8000/docs"),a("OutboundLink")],1)])])}),[],!1,null,null,null);s.default=e.exports}}]);