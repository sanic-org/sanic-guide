(window.webpackJsonp=window.webpackJsonp||[]).push([[1],{252:function(t,e,n){"use strict";n.d(e,"d",(function(){return s})),n.d(e,"a",(function(){return r})),n.d(e,"i",(function(){return a})),n.d(e,"f",(function(){return l})),n.d(e,"g",(function(){return u})),n.d(e,"h",(function(){return c})),n.d(e,"b",(function(){return p})),n.d(e,"e",(function(){return h})),n.d(e,"k",(function(){return d})),n.d(e,"l",(function(){return f})),n.d(e,"c",(function(){return m})),n.d(e,"j",(function(){return v}));n(97);const s=/#.*$/,i=/\.(md|html)$/,r=/\/$/,a=/^[a-z]+:/i;function o(t){return decodeURI(t).replace(s,"").replace(i,"")}function l(t){return a.test(t)}function u(t){return/^mailto:/.test(t)}function c(t){return/^tel:/.test(t)}function p(t){if(l(t))return t;const e=t.match(s),n=e?e[0]:"",i=o(t);return r.test(i)?t:i+".html"+n}function h(t,e){const n=decodeURIComponent(t.hash),i=function(t){const e=t.match(s);if(e)return e[0]}(e);if(i&&n!==i)return!1;return o(t.path)===o(e)}function d(t,e,n){if(l(e))return{type:"external",path:e};n&&(e=function(t,e,n){const s=t.charAt(0);if("/"===s)return t;if("?"===s||"#"===s)return e+t;const i=e.split("/");n&&i[i.length-1]||i.pop();const r=t.replace(/^\//,"").split("/");for(let t=0;t<r.length;t++){const e=r[t];".."===e?i.pop():"."!==e&&i.push(e)}""!==i[0]&&i.unshift("");return i.join("/")}(e,n));const s=o(e);for(let e=0;e<t.length;e++)if(o(t[e].regularPath)===s)return Object.assign({},t[e],{type:"page",path:p(t[e].path)});return console.error(`[vuepress] No matching page found for sidebar item "${e}"`),{}}function f(t,e,n,s){const{pages:i,themeConfig:r}=n,a=s&&r.locales&&r.locales[s]||r;if("auto"===(t.frontmatter.sidebar||a.sidebar||r.sidebar))return g(t);const o=a.sidebar||r.sidebar;if(o){const{base:n,config:s}=function(t,e){if(Array.isArray(e))return{base:"/",config:e};for(const s in e)if(0===(n=t,/(\.html|\/)$/.test(n)?n:n+"/").indexOf(encodeURI(s)))return{base:s,config:e[s]};var n;return{}}(e,o);return"auto"===s?g(t):s?s.map(t=>function t(e,n,s,i=1){if("string"==typeof e)return d(n,e,s);if(Array.isArray(e))return Object.assign(d(n,e[0],s),{title:e[1]});{const r=e.children||[];return 0===r.length&&e.path?Object.assign(d(n,e.path,s),{title:e.title}):{type:"group",path:e.path,title:e.title,sidebarDepth:e.sidebarDepth,initialOpenGroupIndex:e.initialOpenGroupIndex,children:r.map(e=>t(e,n,s,i+1)),collapsable:!1!==e.collapsable}}}(t,i,n)):[]}return[]}function g(t){const e=m(t.headers||[]);return[{type:"group",collapsable:!1,title:t.title,path:null,children:e.map(e=>({type:"auto",title:e.title,basePath:t.path,path:t.path+"#"+e.slug,children:e.children||[]}))}]}function m(t){let e;return(t=t.map(t=>Object.assign({},t))).forEach(t=>{2===t.level?e=t:e&&(e.children||(e.children=[])).push(t)}),t.filter(t=>2===t.level)}function v(t){return Object.assign(t,{type:t.items&&t.items.length?"links":"link"})}},269:function(t,e,n){"use strict";var s=n(252),i={name:"NavLink",props:{item:{required:!0}},computed:{link(){return Object(s.b)(this.item.link)},exact(){return this.$site.locales?Object.keys(this.$site.locales).some(t=>t===this.link):"/"===this.link},isNonHttpURI(){return Object(s.g)(this.link)||Object(s.h)(this.link)},isBlankTarget(){return"_blank"===this.target},isInternal(){return!Object(s.f)(this.link)&&!this.isBlankTarget},target(){return this.isNonHttpURI?null:this.item.target?this.item.target:Object(s.f)(this.link)?"_blank":""},rel(){return this.isNonHttpURI||!1===this.item.rel?null:this.item.rel?this.item.rel:this.isBlankTarget?"noopener noreferrer":null}},methods:{focusoutAction(){this.$emit("focusout")}}},r=n(5),a=Object(r.a)(i,(function(){var t=this,e=t._self._c;return t.isInternal?e("RouterLink",{staticClass:"nav-link",attrs:{to:t.link,exact:t.exact},nativeOn:{focusout:function(e){return t.focusoutAction.apply(null,arguments)}}},[t._v("\n  "+t._s(t.item.text)+"\n")]):e("a",{staticClass:"nav-link external",attrs:{href:t.link,target:t.target,rel:t.rel},on:{focusout:t.focusoutAction}},[t._v("\n  "+t._s(t.item.text)+"\n  "),t.isBlankTarget?e("OutboundLink"):t._e()],1)}),[],!1,null,null,null);e.a=a.exports},276:function(t,e,n){"use strict";n.r(e);var s=n(252),i={name:"SidebarGroup",components:{DropdownTransition:n(306).a},props:["item","open","collapsable","depth"],beforeCreate(){this.$options.components.SidebarLinks=n(276).default},methods:{isActive:s.e}},r=(n(322),n(5)),a=Object(r.a)(i,(function(){var t=this,e=t._self._c;return e("section",{staticClass:"sidebar-group",class:[{collapsable:t.collapsable,"is-sub-group":0!==t.depth},"depth-"+t.depth]},[t.item.path?e("RouterLink",{staticClass:"sidebar-heading clickable",class:{open:t.open,active:t.isActive(t.$route,t.item.path)},attrs:{to:t.item.path},nativeOn:{click:function(e){return t.$emit("toggle")}}},[e("span",[t._v(t._s(t.item.title))]),t._v(" "),t.collapsable?e("span",{staticClass:"arrow",class:t.open?"down":"right"}):t._e()]):e("p",{staticClass:"sidebar-heading",class:{open:t.open},on:{click:function(e){return t.$emit("toggle")}}},[e("span",[t._v(t._s(t.item.title))]),t._v(" "),t.collapsable?e("span",{staticClass:"arrow",class:t.open?"down":"right"}):t._e()]),t._v(" "),e("DropdownTransition",[t.open||!t.collapsable?e("SidebarLinks",{staticClass:"sidebar-group-items",attrs:{items:t.item.children,"sidebar-depth":t.item.sidebarDepth,"initial-open-group-index":t.item.initialOpenGroupIndex,depth:t.depth+1}}):t._e()],1)],1)}),[],!1,null,null,null).exports;function o(t,e,n,s,i){const r={props:{to:e,activeClass:"",exactActiveClass:""},class:{active:s,"sidebar-link":!0}};return i>2&&(r.style={"padding-left":i+"rem"}),t("RouterLink",r,n)}function l(t,e,n,i,r,a=1){return!e||a>r?null:t("ul",{class:"sidebar-sub-headers"},e.map(e=>{const u=Object(s.e)(i,n+"#"+e.slug);return t("li",{class:"sidebar-sub-header"},[o(t,n+"#"+e.slug,e.title,u,e.level-1),l(t,e.children,n,i,r,a+1)])}))}var u={functional:!0,props:["item","sidebarDepth"],render(t,{parent:{$page:e,$site:n,$route:i,$themeConfig:r,$themeLocaleConfig:a},props:{item:u,sidebarDepth:c}}){const p=Object(s.e)(i,u.path),h="auto"===u.type?p||u.children.some(t=>Object(s.e)(i,u.basePath+"#"+t.slug)):p,d="external"===u.type?function(t,e,n){return t("a",{attrs:{href:e,target:"_blank",rel:"noopener noreferrer"},class:{"sidebar-link":!0}},[n,t("OutboundLink")])}(t,u.path,u.title||u.path):o(t,u.path,u.title||u.path,h),f=[e.frontmatter.sidebarDepth,c,a.sidebarDepth,r.sidebarDepth,1].find(t=>void 0!==t),g=a.displayAllHeaders||r.displayAllHeaders;if("auto"===u.type)return[d,l(t,u.children,u.basePath,i,f)];if((h||g)&&u.headers&&!s.d.test(u.path)){return[d,l(t,Object(s.c)(u.headers),u.path,i,f)]}return d}};n(323);function c(t,e){if("group"===e.type){const n=e.path&&Object(s.e)(t,e.path),i=e.children.some(e=>"group"===e.type?c(t,e):"page"===e.type&&Object(s.e)(t,e.path));return n||i}return!1}var p={name:"SidebarLinks",components:{SidebarGroup:a,SidebarLink:Object(r.a)(u,void 0,void 0,!1,null,null,null).exports},props:["items","depth","sidebarDepth","initialOpenGroupIndex"],data(){return{openGroupIndex:this.initialOpenGroupIndex||0}},watch:{$route(){this.refreshIndex()}},created(){this.refreshIndex()},methods:{refreshIndex(){const t=function(t,e){for(let n=0;n<e.length;n++){const s=e[n];if(c(t,s))return n}return-1}(this.$route,this.items);t>-1&&(this.openGroupIndex=t)},toggleGroup(t){this.openGroupIndex=t===this.openGroupIndex?-1:t},isActive(t){return Object(s.e)(this.$route,t.regularPath)}}},h=Object(r.a)(p,(function(){var t=this,e=t._self._c;return t.items.length?e("ul",{staticClass:"sidebar-links"},t._l(t.items,(function(n,s){return e("li",{key:s},["group"===n.type?e("SidebarGroup",{attrs:{item:n,open:s===t.openGroupIndex,collapsable:n.collapsable||n.collapsible,depth:t.depth},on:{toggle:function(e){return t.toggleGroup(s)}}}):e("SidebarLink",{attrs:{"sidebar-depth":t.sidebarDepth,item:n}})],1)})),0):t._e()}),[],!1,null,null,null);e.default=h.exports},281:function(t,e,n){},282:function(t,e){var n=TypeError;t.exports=function(t,e){if(t<e)throw n("Not enough arguments");return t}},283:function(t,e,n){},284:function(t,e,n){},285:function(t,e,n){},286:function(t,e,n){},287:function(t,e,n){},288:function(t,e){t.exports=function(t){return null==t}},289:function(t,e,n){},290:function(t,e,n){},291:function(t,e,n){},292:function(t,e,n){},293:function(t,e,n){},299:function(t,e,n){"use strict";var s=n(288),i=n.n(s),r=n(252),a={name:"PageEdit",computed:{lastUpdated(){return this.$page.lastUpdated},lastUpdatedText(){return"string"==typeof this.$themeLocaleConfig.lastUpdated?this.$themeLocaleConfig.lastUpdated:"string"==typeof this.$site.themeConfig.lastUpdated?this.$site.themeConfig.lastUpdated:"Last Updated"},editLink(){const t=i()(this.$page.frontmatter.editLink)?this.$site.themeConfig.editLinks:this.$page.frontmatter.editLink,{repo:e,docsDir:n="",docsBranch:s="master",docsRepo:r=e}=this.$site.themeConfig;return t&&r&&this.$page.relativePath?this.createEditLink(e,r,n,s,this.$page.relativePath):null},editLinkText(){return this.$themeLocaleConfig.editLinkText||this.$site.themeConfig.editLinkText||"Edit this page"}},methods:{createEditLink(t,e,n,s,i){if(/bitbucket.org/.test(e)){return e.replace(r.a,"")+"/src"+`/${s}/`+(n?n.replace(r.a,"")+"/":"")+i+`?mode=edit&spa=0&at=${s}&fileviewer=file-view-default`}if(/gitlab.com/.test(e)){return e.replace(r.a,"")+"/-/edit"+`/${s}/`+(n?n.replace(r.a,"")+"/":"")+i}return(r.i.test(e)?e:"https://github.com/"+e).replace(r.a,"")+"/edit"+`/${s}/`+(n?n.replace(r.a,"")+"/":"")+i}}},o=(n(318),n(5)),l=Object(o.a)(a,(function(){var t=this,e=t._self._c;return e("footer",{staticClass:"page-edit"},[t.editLink?e("div",{staticClass:"edit-link"},[e("a",{attrs:{href:t.editLink,target:"_blank",rel:"noopener noreferrer"}},[t._v(t._s(t.editLinkText))]),t._v(" "),e("OutboundLink")],1):t._e(),t._v(" "),t.lastUpdated?e("div",{staticClass:"last-updated"},[e("span",{staticClass:"prefix"},[t._v(t._s(t.lastUpdatedText)+":")]),t._v(" "),e("span",{staticClass:"time"},[t._v(t._s(t.lastUpdated))])]):t._e()])}),[],!1,null,null,null).exports,u=(n(97),n(319)),c=n.n(u),p={name:"PageNav",props:["sidebarItems"],computed:{prev(){return d(h.PREV,this)},next(){return d(h.NEXT,this)}}};const h={NEXT:{resolveLink:function(t,e){return f(t,e,1)},getThemeLinkConfig:({nextLinks:t})=>t,getPageLinkConfig:({frontmatter:t})=>t.next},PREV:{resolveLink:function(t,e){return f(t,e,-1)},getThemeLinkConfig:({prevLinks:t})=>t,getPageLinkConfig:({frontmatter:t})=>t.prev}};function d(t,{$themeConfig:e,$page:n,$route:s,$site:a,sidebarItems:o}){const{resolveLink:l,getThemeLinkConfig:u,getPageLinkConfig:p}=t,h=u(e),d=p(n),f=i()(d)?h:d;return!1===f?void 0:c()(f)?Object(r.k)(a.pages,f,s.path):l(n,o)}function f(t,e,n){const s=[];!function t(e,n){for(let s=0,i=e.length;s<i;s++)"group"===e[s].type?t(e[s].children||[],n):n.push(e[s])}(e,s);for(let e=0;e<s.length;e++){const i=s[e];if("page"===i.type&&i.path===decodeURIComponent(t.path))return s[e+n]}}var g=p,m=(n(320),{components:{PageEdit:l,PageNav:Object(o.a)(g,(function(){var t=this,e=t._self._c;return t.prev||t.next?e("div",{staticClass:"page-nav"},[e("p",{staticClass:"inner"},[t.prev?e("span",{staticClass:"prev"},[t._v("\n      ←\n      "),"external"===t.prev.type?e("a",{staticClass:"prev",attrs:{href:t.prev.path,target:"_blank",rel:"noopener noreferrer"}},[t._v("\n        "+t._s(t.prev.title||t.prev.path)+"\n\n        "),e("OutboundLink")],1):e("RouterLink",{staticClass:"prev",attrs:{to:t.prev.path}},[t._v("\n        "+t._s(t.prev.title||t.prev.path)+"\n      ")])],1):t._e(),t._v(" "),t.next?e("span",{staticClass:"next"},["external"===t.next.type?e("a",{attrs:{href:t.next.path,target:"_blank",rel:"noopener noreferrer"}},[t._v("\n        "+t._s(t.next.title||t.next.path)+"\n\n        "),e("OutboundLink")],1):e("RouterLink",{attrs:{to:t.next.path}},[t._v("\n        "+t._s(t.next.title||t.next.path)+"\n      ")]),t._v("\n      →\n    ")],1):t._e()])]):t._e()}),[],!1,null,null,null).exports},props:["sidebarItems"]}),v=(n(321),Object(o.a)(m,(function(){var t=this._self._c;return t("main",{staticClass:"page"},[this._t("top"),this._v(" "),t("Content",{staticClass:"theme-default-content"}),this._v(" "),t("PageEdit"),this._v(" "),t("PageNav",this._b({},"PageNav",{sidebarItems:this.sidebarItems},!1)),this._v(" "),this._t("bottom")],2)}),[],!1,null,null,null));e.a=v.exports},300:function(t,e,n){"use strict";n(97);var s=n(101),i=n.n(s),r=(t,e,n=null)=>{let s=i()(e,"title","");return i()(e,"frontmatter.tags")&&(s+=" "+e.frontmatter.tags.join(" ")),n&&(s+=" "+n),a(t,s)};const a=(t,e)=>{const n=t=>t.replace(/[-/\\^$*+?.()|[\]{}]/g,"\\$&"),s=new RegExp("[^\0-]"),i=t.split(/\s+/g).map(t=>t.trim()).filter(t=>!!t);if(s.test(t))return i.some(t=>e.toLowerCase().indexOf(t)>-1);{const s=t.endsWith(" ");return new RegExp(i.map((t,e)=>i.length!==e+1||s?`(?=.*\\b${n(t)}\\b)`:`(?=.*\\b${n(t)})`).join("")+".+","gi").test(e)}};var o={name:"SearchBox",data:()=>({query:"",focused:!1,focusIndex:0,placeholder:void 0}),computed:{showSuggestions(){return this.focused&&this.suggestions&&this.suggestions.length},suggestions(){const t=this.query.trim().toLowerCase();if(!t)return;const{pages:e}=this.$site,n=this.$site.themeConfig.searchMaxSuggestions||5,s=this.$localePath,i=[];for(let a=0;a<e.length&&!(i.length>=n);a++){const o=e[a];if(this.getPageLocalePath(o)===s&&this.isSearchable(o))if(r(t,o))i.push(o);else if(o.headers)for(let e=0;e<o.headers.length&&!(i.length>=n);e++){const n=o.headers[e];n.title&&r(t,o,n.title)&&i.push(Object.assign({},o,{path:o.path+"#"+n.slug,header:n}))}}return i},alignRight(){return(this.$site.themeConfig.nav||[]).length+(this.$site.repo?1:0)<=2}},mounted(){this.placeholder=this.$site.themeConfig.searchPlaceholder||"",document.addEventListener("keydown",this.onHotkey)},beforeDestroy(){document.removeEventListener("keydown",this.onHotkey)},methods:{getPageLocalePath(t){for(const e in this.$site.locales||{})if("/"!==e&&0===t.path.indexOf(e))return e;return"/"},isSearchable(t){let e=null;return null===e||(e=Array.isArray(e)?e:new Array(e),e.filter(e=>t.path.match(e)).length>0)},onHotkey(t){t.srcElement===document.body&&["s","/"].includes(t.key)&&(this.$refs.input.focus(),t.preventDefault())},onUp(){this.showSuggestions&&(this.focusIndex>0?this.focusIndex--:this.focusIndex=this.suggestions.length-1)},onDown(){this.showSuggestions&&(this.focusIndex<this.suggestions.length-1?this.focusIndex++:this.focusIndex=0)},go(t){this.showSuggestions&&(this.$router.push(this.suggestions[t].path),this.query="",this.focusIndex=0)},focus(t){this.focusIndex=t},unfocus(){this.focusIndex=-1}}},l=(n(314),n(5)),u=Object(l.a)(o,(function(){var t=this,e=t._self._c;return e("div",{staticClass:"search-box"},[e("input",{ref:"input",class:{focused:t.focused},attrs:{"aria-label":"Search",placeholder:t.placeholder,autocomplete:"off",spellcheck:"false"},domProps:{value:t.query},on:{input:function(e){t.query=e.target.value},focus:function(e){t.focused=!0},blur:function(e){t.focused=!1},keyup:[function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter")?null:t.go(t.focusIndex)},function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"up",38,e.key,["Up","ArrowUp"])?null:t.onUp.apply(null,arguments)},function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"down",40,e.key,["Down","ArrowDown"])?null:t.onDown.apply(null,arguments)}]}}),t._v(" "),t.showSuggestions?e("ul",{staticClass:"suggestions",class:{"align-right":t.alignRight},on:{mouseleave:t.unfocus}},t._l(t.suggestions,(function(n,s){return e("li",{key:s,staticClass:"suggestion",class:{focused:s===t.focusIndex},on:{mousedown:function(e){return t.go(s)},mouseenter:function(e){return t.focus(s)}}},[e("a",{attrs:{href:n.path},on:{click:function(t){t.preventDefault()}}},[e("span",{staticClass:"page-title"},[t._v(t._s(n.title||n.path))]),t._v(" "),n.header?e("span",{staticClass:"header"},[t._v("> "+t._s(n.header.title))]):t._e()])])})),0):t._e()])}),[],!1,null,null,null);e.a=u.exports},303:function(t,e,n){"use strict";var s={name:"Home",components:{NavLink:n(269).a},computed:{data(){return this.$page.frontmatter},actionLink(){return{link:this.data.actionLink,text:this.data.actionText}}}},i=(n(308),n(5)),r=Object(i.a)(s,(function(){var t=this,e=t._self._c;return e("main",{staticClass:"home",attrs:{"aria-labelledby":null!==t.data.heroText?"main-title":null}},[e("header",{staticClass:"hero"},[t.data.heroImage?e("img",{attrs:{src:t.$withBase(t.data.heroImage),alt:t.data.heroAlt||"hero"}}):t._e(),t._v(" "),null!==t.data.heroText?e("h1",{attrs:{id:"main-title"}},[t._v("\n      "+t._s(t.data.heroText||t.$title||"Hello")+"\n    ")]):t._e(),t._v(" "),null!==t.data.tagline?e("p",{staticClass:"description"},[t._v("\n      "+t._s(t.data.tagline||t.$description||"Welcome to your VuePress site")+"\n    ")]):t._e(),t._v(" "),t.data.actionText&&t.data.actionLink?e("p",{staticClass:"action"},[e("NavLink",{staticClass:"action-button",attrs:{item:t.actionLink}})],1):t._e()]),t._v(" "),t.data.features&&t.data.features.length?e("div",{staticClass:"features"},t._l(t.data.features,(function(n,s){return e("div",{key:s,staticClass:"feature"},[e("h2",[t._v(t._s(n.title))]),t._v(" "),e("p",[t._v(t._s(n.details))])])})),0):t._e(),t._v(" "),e("Content",{staticClass:"theme-default-content custom"}),t._v(" "),t.data.footer?e("div",{staticClass:"footer"},[t._v("\n    "+t._s(t.data.footer)+"\n  ")]):e("Content",{staticClass:"footer",attrs:{"slot-key":"footer"}})],1)}),[],!1,null,null,null);e.a=r.exports},304:function(t,e,n){"use strict";n(309),n(310),n(311),n(97);var s={name:"AlgoliaSearchBox",props:["options"],data:()=>({placeholder:void 0}),watch:{$lang(t){this.update(this.options,t)},options(t){this.update(t,this.$lang)}},mounted(){this.initialize(this.options,this.$lang),this.placeholder=this.$site.themeConfig.searchPlaceholder||""},methods:{initialize(t,e){Promise.all([Promise.all([n.e(0),n.e(3)]).then(n.t.bind(null,340,7)),Promise.all([n.e(0),n.e(3)]).then(n.t.bind(null,341,7))]).then(([n])=>{n=n.default;const{algoliaOptions:s={}}=t;n(Object.assign({},t,{inputSelector:"#algolia-search-input",algoliaOptions:{...s,facetFilters:["lang:"+e].concat(s.facetFilters||[])},handleSelected:(t,e,n)=>{const{pathname:s,hash:i}=new URL(n.url),r=s.replace(this.$site.base,"/"),a=decodeURIComponent(i);this.$router.push(`${r}${a}`)}}))})},update(t,e){this.$el.innerHTML='<input id="algolia-search-input" class="search-query">',this.initialize(t,e)}}},i=(n(313),n(5)),r=Object(i.a)(s,(function(){var t=this._self._c;return t("form",{staticClass:"algolia-search-wrapper search-box",attrs:{id:"search-form",role:"search"}},[t("input",{staticClass:"search-query",attrs:{id:"algolia-search-input",placeholder:this.placeholder}})])}),[],!1,null,null,null);e.a=r.exports},305:function(t,e,n){"use strict";var s=n(269),i=n(306),r=n(102),a=n.n(r),o={name:"DropdownLink",components:{NavLink:s.a,DropdownTransition:i.a},props:{item:{required:!0}},data:()=>({open:!1}),computed:{dropdownAriaLabel(){return this.item.ariaLabel||this.item.text}},watch:{$route(){this.open=!1}},methods:{setOpen(t){this.open=t},isLastItemOfArray:(t,e)=>a()(e)===t,handleDropdown(){0===event.detail&&this.setOpen(!this.open)}}},l=(n(317),n(5)),u=Object(l.a)(o,(function(){var t=this,e=t._self._c;return e("div",{staticClass:"dropdown-wrapper",class:{open:t.open}},[e("button",{staticClass:"dropdown-title",attrs:{type:"button","aria-label":t.dropdownAriaLabel},on:{click:t.handleDropdown}},[e("span",{staticClass:"title"},[t._v(t._s(t.item.text))]),t._v(" "),e("span",{staticClass:"arrow down"})]),t._v(" "),e("button",{staticClass:"mobile-dropdown-title",attrs:{type:"button","aria-label":t.dropdownAriaLabel},on:{click:function(e){return t.setOpen(!t.open)}}},[e("span",{staticClass:"title"},[t._v(t._s(t.item.text))]),t._v(" "),e("span",{staticClass:"arrow",class:t.open?"down":"right"})]),t._v(" "),e("DropdownTransition",[e("ul",{directives:[{name:"show",rawName:"v-show",value:t.open,expression:"open"}],staticClass:"nav-dropdown"},t._l(t.item.items,(function(n,s){return e("li",{key:n.link||s,staticClass:"dropdown-item"},["links"===n.type?e("h4",[t._v("\n          "+t._s(n.text)+"\n        ")]):t._e(),t._v(" "),"links"===n.type?e("ul",{staticClass:"dropdown-subitem-wrapper"},t._l(n.items,(function(s){return e("li",{key:s.link,staticClass:"dropdown-subitem"},[e("NavLink",{attrs:{item:s},on:{focusout:function(e){t.isLastItemOfArray(s,n.items)&&t.isLastItemOfArray(n,t.item.items)&&t.setOpen(!1)}}})],1)})),0):e("NavLink",{attrs:{item:n},on:{focusout:function(e){t.isLastItemOfArray(n,t.item.items)&&t.setOpen(!1)}}})],1)})),0)])],1)}),[],!1,null,null,null);e.a=u.exports},306:function(t,e,n){"use strict";var s={name:"DropdownTransition",methods:{setHeight(t){t.style.height=t.scrollHeight+"px"},unsetHeight(t){t.style.height=""}}},i=(n(316),n(5)),r=Object(i.a)(s,(function(){return(0,this._self._c)("transition",{attrs:{name:"dropdown"},on:{enter:this.setHeight,"after-enter":this.unsetHeight,"before-leave":this.setHeight}},[this._t("default")],2)}),[],!1,null,null,null);e.a=r.exports},307:function(t,e,n){"use strict";n(315);var s=n(5),i=Object(s.a)({},(function(){var t=this,e=t._self._c;return e("div",{staticClass:"sidebar-button",on:{click:function(e){return t.$emit("toggle-sidebar")}}},[e("svg",{staticClass:"icon",attrs:{xmlns:"http://www.w3.org/2000/svg","aria-hidden":"true",role:"img",viewBox:"0 0 448 512"}},[e("path",{attrs:{fill:"currentColor",d:"M436 124H12c-6.627 0-12-5.373-12-12V80c0-6.627 5.373-12 12-12h424c6.627 0 12 5.373 12 12v32c0 6.627-5.373 12-12 12zm0 160H12c-6.627 0-12-5.373-12-12v-32c0-6.627 5.373-12 12-12h424c6.627 0 12 5.373 12 12v32c0 6.627-5.373 12-12 12zm0 160H12c-6.627 0-12-5.373-12-12v-32c0-6.627 5.373-12 12-12h424c6.627 0 12 5.373 12 12v32c0 6.627-5.373 12-12 12z"}})])])}),[],!1,null,null,null);e.a=i.exports},308:function(t,e,n){"use strict";n(281)},309:function(t,e,n){"use strict";var s=n(98),i=n(2),r=n(99),a=n(282),o=URLSearchParams,l=o.prototype,u=i(l.append),c=i(l.delete),p=i(l.forEach),h=i([].push),d=new o("a=1&a=2");d.delete("a",1),d+""!="a=2"&&s(l,"delete",(function(t){var e=arguments.length,n=e<2?void 0:arguments[1];if(e&&void 0===n)return c(this,t);var s=[];p(this,(function(t,e){h(s,{key:e,value:t})})),a(e,1);for(var i,o=r(t),l=r(n),d=0,f=0,g=!1,m=s.length;d<m;)i=s[d++],g||i.key===o?(g=!0,c(this,i.key)):f++;for(;f<m;)(i=s[f++]).key===o&&i.value===l||u(this,i.key,i.value)}),{enumerable:!0,unsafe:!0})},310:function(t,e,n){"use strict";var s=n(98),i=n(2),r=n(99),a=n(282),o=URLSearchParams,l=o.prototype,u=i(l.getAll),c=i(l.has);new o("a=1").has("a",2)&&s(l,"has",(function(t){var e=arguments.length,n=e<2?void 0:arguments[1];if(e&&void 0===n)return c(this,t);var s=u(this,t);a(e,1);for(var i=r(n),o=0;o<s.length;)if(s[o++]===i)return!0;return!1}),{enumerable:!0,unsafe:!0})},311:function(t,e,n){"use strict";var s=n(6),i=n(2),r=n(312),a=URLSearchParams.prototype,o=i(a.forEach);s&&!("size"in a)&&r(a,"size",{get:function(){var t=0;return o(this,(function(){t++})),t},configurable:!0,enumerable:!0})},312:function(t,e,n){var s=n(100),i=n(16);t.exports=function(t,e,n){return n.get&&s(n.get,e,{getter:!0}),n.set&&s(n.set,e,{setter:!0}),i.f(t,e,n)}},313:function(t,e,n){"use strict";n(283)},314:function(t,e,n){"use strict";n(284)},315:function(t,e,n){"use strict";n(285)},316:function(t,e,n){"use strict";n(286)},317:function(t,e,n){"use strict";n(287)},318:function(t,e,n){"use strict";n(289)},319:function(t,e,n){var s=n(13),i=n(7),r=n(12);t.exports=function(t){return"string"==typeof t||!i(t)&&r(t)&&"[object String]"==s(t)}},320:function(t,e,n){"use strict";n(290)},321:function(t,e,n){"use strict";n(291)},322:function(t,e,n){"use strict";n(292)},323:function(t,e,n){"use strict";n(293)}}]);