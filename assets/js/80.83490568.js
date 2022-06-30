(window.webpackJsonp=window.webpackJsonp||[]).push([[80],{391:function(t,e,a){"use strict";a.r(e);var r=a(3),s=Object(r.a)({},(function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[a("h1",{attrs:{id:"version-22-6"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#version-22-6"}},[t._v("#")]),t._v(" Version 22.6")]),t._v(" "),a("p"),a("div",{staticClass:"table-of-contents"},[a("ul",[a("li",[a("a",{attrs:{href:"#introduction"}},[t._v("Introduction")])]),a("li",[a("a",{attrs:{href:"#what-to-know"}},[t._v("What to know")]),a("ul",[a("li",[a("a",{attrs:{href:"#automatic-tls-setup-in-debug-mode"}},[t._v("Automatic TLS setup in DEBUG mode")])]),a("li",[a("a",{attrs:{href:"#http-3-server-rocket"}},[t._v("HTTP/3 Server 🚀")])]),a("li",[a("a",{attrs:{href:"#consistent-exception-naming"}},[t._v("Consistent exception naming")])]),a("li",[a("a",{attrs:{href:"#current-request-getter"}},[t._v("Current request getter")])]),a("li",[a("a",{attrs:{href:"#improved-api-support-for-setting-cache-control-headers"}},[t._v("Improved API support for setting cache control headers")])]),a("li",[a("a",{attrs:{href:"#custom-loads-function"}},[t._v("Custom loads function")])]),a("li",[a("a",{attrs:{href:"#deprecations-and-removals"}},[t._v("Deprecations and Removals")])])])]),a("li",[a("a",{attrs:{href:"#thank-you"}},[t._v("Thank you")])])])]),a("p"),t._v(" "),a("h2",{attrs:{id:"introduction"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#introduction"}},[t._v("#")]),t._v(" Introduction")]),t._v(" "),a("p",[t._v("This is the second release of the version 22 "),a("RouterLink",{attrs:{to:"/en/org/policies.html#release-schedule"}},[t._v("release cycle")]),t._v('. Version 22 will be "finalized" in the December long-term support version release.')],1),t._v(" "),a("h2",{attrs:{id:"what-to-know"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#what-to-know"}},[t._v("#")]),t._v(" What to know")]),t._v(" "),a("p",[t._v("More details in the "),a("a",{attrs:{href:"https://sanic.readthedocs.io/en/stable/sanic/changelog.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("Changelog"),a("OutboundLink")],1),t._v(". Notable new or breaking features, and what to upgrade...")]),t._v(" "),a("h3",{attrs:{id:"automatic-tls-setup-in-debug-mode"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#automatic-tls-setup-in-debug-mode"}},[t._v("#")]),t._v(" Automatic TLS setup in "),a("code",[t._v("DEBUG")]),t._v(" mode")]),t._v(" "),a("p",[t._v("The Sanic server can automatically setup a TLS certificate using either "),a("a",{attrs:{href:"https://github.com/FiloSottile/mkcert",target:"_blank",rel:"noopener noreferrer"}},[t._v("mkcert"),a("OutboundLink")],1),t._v(" or "),a("a",{attrs:{href:"https://github.com/python-trio/trustme",target:"_blank",rel:"noopener noreferrer"}},[t._v("trustme"),a("OutboundLink")],1),t._v(". This certificate will enable "),a("code",[t._v("https://localhost")]),t._v(" (or another local address) for local development environments. You must install either "),a("code",[t._v("mkcert")]),t._v(" or "),a("code",[t._v("trustme")]),t._v(" on your own for this to work.")]),t._v(" "),a("div",{staticClass:"multicolumn",staticStyle:{display:"flex","flex-direction":"row","align-items":"flex-start"}},[a("div",{staticClass:"multicolumn-column",staticStyle:{"flex-grow":"1","flex-basis":"0"}},[a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[t._v("$ sanic path.to.server:app --auto-tls --debug\n")])])])]),t._v(" "),a("div",{staticClass:"multicolumn-column",staticStyle:{"flex-grow":"1","flex-basis":"0"}},[a("div",{staticClass:"language-python extra-class"},[a("pre",{pre:!0,attrs:{class:"language-python"}},[a("code",[t._v("app"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("run"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("debug"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),a("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("True")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" auto_tls"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),a("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("True")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n")])])])])]),t._v(" "),a("p",[t._v("This feature is not available when running in "),a("code",[t._v("ASGI")]),t._v(" mode, or in "),a("code",[t._v("PRODUCTION")]),t._v(" mode. When running Sanic in production, you should be using a real TLS certificate either purchased through a legitimate vendor, or using "),a("a",{attrs:{href:"https://letsencrypt.org/",target:"_blank",rel:"noopener noreferrer"}},[t._v("Let's Encrypt"),a("OutboundLink")],1),t._v(".")]),t._v(" "),a("h3",{attrs:{id:"http-3-server"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#http-3-server"}},[t._v("#")]),t._v(" HTTP/3 Server 🚀")]),t._v(" "),a("p",[t._v("In June 2022, the IETF finalized and published "),a("a",{attrs:{href:"https://www.rfc-editor.org/rfc/rfc9114.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("RFC 9114"),a("OutboundLink")],1),t._v(", the specification for HTTP/3. In short, HTTP/3 is a "),a("strong",[t._v("very")]),t._v(" different protocol than HTTP/1.1 and HTTP/2 because it implements HTTP over UDP instead of TCP. The new HTTP protocol promises faster webpage load times and solving some of the problems of the older standards. You are encouraged to "),a("a",{attrs:{href:"https://http3-explained.haxx.se/",target:"_blank",rel:"noopener noreferrer"}},[t._v("read more about"),a("OutboundLink")],1),t._v(" this new web technology. You likely will need to install a "),a("a",{attrs:{href:"https://curl.se/docs/http3.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("capable client"),a("OutboundLink")],1),t._v(" as traditional tooling will not work.")]),t._v(" "),a("p",[t._v("Sanic server offers HTTP/3 support using "),a("a",{attrs:{href:"https://github.com/aiortc/%60aioquic%60",target:"_blank",rel:"noopener noreferrer"}},[t._v("aioquic"),a("OutboundLink")],1),t._v(". This "),a("strong",[t._v("must")]),t._v(" be installed:")]),t._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[t._v("pip install sanic aioquic\n")])])]),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[t._v("pip install sanic[http3]\n")])])]),a("p",[t._v("To start HTTP/3, you must explicitly request it when running your application.")]),t._v(" "),a("div",{staticClass:"multicolumn",staticStyle:{display:"flex","flex-direction":"row","align-items":"flex-start"}},[a("div",{staticClass:"multicolumn-column",staticStyle:{"flex-grow":"1","flex-basis":"0"}},[a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[t._v("$ sanic path.to.server:app --http=3\n")])])]),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[t._v("$ sanic path.to.server:app -3\n")])])])]),t._v(" "),a("div",{staticClass:"multicolumn-column",staticStyle:{"flex-grow":"1","flex-basis":"0"}},[a("div",{staticClass:"language-python extra-class"},[a("pre",{pre:!0,attrs:{class:"language-python"}},[a("code",[t._v("app"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("run"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("version"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("3")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n")])])])])]),t._v(" "),a("p",[t._v("To run both an HTTP/3 and HTTP/1.1 server simultaneously, you can use "),a("a",{attrs:{href:"http://localhost:8080/en/guide/release-notes/v22.3.html#application-multi-serve",target:"_blank",rel:"noopener noreferrer"}},[t._v("application multi-serve"),a("OutboundLink")],1),t._v(" introduced in v22.3.")]),t._v(" "),a("div",{staticClass:"multicolumn",staticStyle:{display:"flex","flex-direction":"row","align-items":"flex-start"}},[a("div",{staticClass:"multicolumn-column",staticStyle:{"flex-grow":"1","flex-basis":"0"}},[a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[t._v("$ sanic path.to.server:app --http=3 --http=1\n")])])]),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[t._v("$ sanic path.to.server:app -3 -1\n")])])])]),t._v(" "),a("div",{staticClass:"multicolumn-column",staticStyle:{"flex-grow":"1","flex-basis":"0"}},[a("div",{staticClass:"language-python extra-class"},[a("pre",{pre:!0,attrs:{class:"language-python"}},[a("code",[t._v("app"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("prepre"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("version"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("3")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\napp"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("prepre"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("version"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("1")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\nSanic"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("serve"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n")])])])])]),t._v(" "),a("p",[t._v("Because HTTP/3 requires TLS, you cannot start a HTTP/3 server without a TLS certificate. You should "),a("a",{attrs:{href:"http://localhost:8080/en/guide/how-to/tls.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("set it up yourself"),a("OutboundLink")],1),t._v(" or use "),a("code",[t._v("mkcert")]),t._v(" if in "),a("code",[t._v("DEBUG")]),t._v(" mode. Currently, automatic TLS setup for HTTP/3 is not compatible with "),a("code",[t._v("trustme")]),t._v(".")]),t._v(" "),a("p",[a("strong",[t._v("👶 This feature is being released as an "),a("em",[t._v("EARLY RELEASE FEATURE")]),t._v(".")]),t._v(" It is "),a("strong",[t._v("not")]),t._v(" yet fully compliant with the HTTP/3 specification, lacking some features like "),a("a",{attrs:{href:"https://websockets.spec.whatwg.org/",target:"_blank",rel:"noopener noreferrer"}},[t._v("websockets"),a("OutboundLink")],1),t._v(", "),a("a",{attrs:{href:"https://w3c.github.io/webtransport/",target:"_blank",rel:"noopener noreferrer"}},[t._v("webtransport"),a("OutboundLink")],1),t._v(", and "),a("a",{attrs:{href:"https://http3-explained.haxx.se/en/h3/h3-push",target:"_blank",rel:"noopener noreferrer"}},[t._v("push responses"),a("OutboundLink")],1),t._v(". Instead the intent of this release is to bring the existing HTTP request/response cycle towards feature parity with HTTP/3. Over the next several releases, more HTTP/3 features will be added and the API for it finalized.")]),t._v(" "),a("h3",{attrs:{id:"consistent-exception-naming"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#consistent-exception-naming"}},[t._v("#")]),t._v(" Consistent exception naming")]),t._v(" "),a("p",[t._v("Some of the Sanic exceptions have been renamed to be more compliant with standard HTTP response names.")]),t._v(" "),a("ul",[a("li",[a("code",[t._v("InvalidUsage")]),t._v(" >> "),a("code",[t._v("BadRequest")])]),t._v(" "),a("li",[a("code",[t._v("MethodNotSupported")]),t._v(" >> "),a("code",[t._v("MethodNotAllowed")])]),t._v(" "),a("li",[a("code",[t._v("ContentRangeError")]),t._v(" >> "),a("code",[t._v("RangeNotSatisfiable")])])]),t._v(" "),a("p",[t._v("All old names have been aliased and will remain backwards compatible.")]),t._v(" "),a("h3",{attrs:{id:"current-request-getter"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#current-request-getter"}},[t._v("#")]),t._v(" Current request getter")]),t._v(" "),a("p",[t._v("Similar to the API to access an application ("),a("code",[t._v("Sanic.get_app()")]),t._v("), there is a new method for retrieving the current request when outside of a request handler.")]),t._v(" "),a("div",{staticClass:"language-python extra-class"},[a("pre",{pre:!0,attrs:{class:"language-python"}},[a("code",[a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("from")]),t._v(" sanic "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" Request\n\nRequest"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("get_current"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n")])])]),a("h3",{attrs:{id:"improved-api-support-for-setting-cache-control-headers"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#improved-api-support-for-setting-cache-control-headers"}},[t._v("#")]),t._v(" Improved API support for setting cache control headers")]),t._v(" "),a("p",[t._v("The "),a("code",[t._v("file")]),t._v(" response helper has some added parameters to make it easier to handle setting of the "),a("a",{attrs:{href:"https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control",target:"_blank",rel:"noopener noreferrer"}},[t._v("Cache-Control"),a("OutboundLink")],1),t._v(" header.")]),t._v(" "),a("div",{staticClass:"language-python extra-class"},[a("pre",{pre:!0,attrs:{class:"language-python"}},[a("code",[a("span",{pre:!0,attrs:{class:"token builtin"}},[t._v("file")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    last_modified"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    max_age"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    no_store"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n")])])]),a("h3",{attrs:{id:"custom-loads-function"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#custom-loads-function"}},[t._v("#")]),t._v(" Custom "),a("code",[t._v("loads")]),t._v(" function")]),t._v(" "),a("p",[t._v("Just like Sanic supports globally setting a custom "),a("code",[t._v("dumps")]),t._v(", you can now set a global custom "),a("code",[t._v("loads")]),t._v(".")]),t._v(" "),a("div",{staticClass:"language-python extra-class"},[a("pre",{pre:!0,attrs:{class:"language-python"}},[a("code",[a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("from")]),t._v(" orjson "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" loads\n\napp "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" Sanic"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"Test"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" loads"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v("loads"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n")])])]),a("h3",{attrs:{id:"deprecations-and-removals"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#deprecations-and-removals"}},[t._v("#")]),t._v(" Deprecations and Removals")]),t._v(" "),a("ol",[a("li",[a("em",[t._v("REMOVED")]),t._v(" - Applications may no longer opt-out of the application registry")]),t._v(" "),a("li",[a("em",[t._v("REMOVED")]),t._v(" - Custom exception handlers will no longer run after some part of an exception has been sent")]),t._v(" "),a("li",[a("em",[t._v("REMOVED")]),t._v(" - Fallback error formats cannot be set on the "),a("code",[t._v("ErrorHandler")]),t._v(" and must "),a("strong",[t._v("only")]),t._v(" be set in the "),a("code",[t._v("Config")])]),t._v(" "),a("li",[a("em",[t._v("REMOVED")]),t._v(" - Setting a custom "),a("code",[t._v("LOGO")]),t._v(" for startup is no longer allowed")]),t._v(" "),a("li",[a("em",[t._v("REMOVED")]),t._v(" - The old "),a("code",[t._v("stream")]),t._v(" response convenience method has been removed")]),t._v(" "),a("li",[a("em",[t._v("REMOVED")]),t._v(" - "),a("code",[t._v("AsyncServer.init")]),t._v(" is removed and no longer an alias of "),a("code",[t._v("AsyncServer.app.state.is_started")])])]),t._v(" "),a("h2",{attrs:{id:"thank-you"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#thank-you"}},[t._v("#")]),t._v(" Thank you")]),t._v(" "),a("p",[t._v("Thank you to everyone that participated in this release: 👏")]),t._v(" "),a("p",[a("a",{attrs:{href:"https://github.com/ahopkins",target:"_blank",rel:"noopener noreferrer"}},[t._v("@ahopkins"),a("OutboundLink")],1),t._v(" "),a("a",{attrs:{href:"https://github.com/amitay87",target:"_blank",rel:"noopener noreferrer"}},[t._v("@amitay87"),a("OutboundLink")],1),t._v(" "),a("a",{attrs:{href:"https://github.com/ashleysommer",target:"_blank",rel:"noopener noreferrer"}},[t._v("@ashleysommer"),a("OutboundLink")],1),t._v(" "),a("a",{attrs:{href:"https://github.com/azimovMichael",target:"_blank",rel:"noopener noreferrer"}},[t._v("@azimovMichael"),a("OutboundLink")],1),t._v(" "),a("a",{attrs:{href:"https://github.com/ChihweiLHBird",target:"_blank",rel:"noopener noreferrer"}},[t._v("@ChihweiLHBird"),a("OutboundLink")],1),t._v(" "),a("a",{attrs:{href:"https://github.com/kijk2869",target:"_blank",rel:"noopener noreferrer"}},[t._v("@kijk2869"),a("OutboundLink")],1),t._v(" "),a("a",{attrs:{href:"https://github.com/prryplatypus",target:"_blank",rel:"noopener noreferrer"}},[t._v("@prryplatypus"),a("OutboundLink")],1),t._v(" "),a("a",{attrs:{href:"https://github.com/SaidBySolo",target:"_blank",rel:"noopener noreferrer"}},[t._v("@SaidBySolo"),a("OutboundLink")],1),t._v(" "),a("a",{attrs:{href:"https://github.com/sjsadowski",target:"_blank",rel:"noopener noreferrer"}},[t._v("@sjsadowski"),a("OutboundLink")],1),t._v(" "),a("a",{attrs:{href:"https://github.com/timmo001",target:"_blank",rel:"noopener noreferrer"}},[t._v("@timmo001"),a("OutboundLink")],1),t._v(" "),a("a",{attrs:{href:"https://github.com/zozzz",target:"_blank",rel:"noopener noreferrer"}},[t._v("@zozzz"),a("OutboundLink")],1)]),t._v(" "),a("hr"),t._v(" "),a("p",[t._v("If you enjoy the project, please consider contributing. Of course we love code contributions, but we also love contributions in any form. Consider writing some documentation, showing off use cases, joining conversations and making your voice known, and if you are able: "),a("a",{attrs:{href:"https://opencollective.com/sanic-org/",target:"_blank",rel:"noopener noreferrer"}},[t._v("financial contributions"),a("OutboundLink")],1),t._v(".")])])}),[],!1,null,null,null);e.default=s.exports}}]);