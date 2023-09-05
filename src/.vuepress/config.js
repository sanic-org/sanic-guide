const path = require("path");

const locales = require("./locales");

let site_config = {
  head: [
    [
      "link",
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
    ],
    [
      "link",
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png",
      },
    ],
    [
      "link",
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png",
      },
    ],
    ["link", { rel: "manifest", href: "/site.webmanifest" }],
    [
      "link",
      { rel: "mask-icon", href: "/safari-pinned-tab.svg", color: "#fd0d68" },
    ],
    ["meta", { name: "msapplication-TileColor", content: "#444444" }],
    ["meta", { name: "theme-color", content: "#fd0d68" }],
  ],
  locales: {
    "/en/": locales.locale_abstract_en,
    "/zh/": locales.locale_abstract_zh,
    "/ja/": locales.locale_abstract_ja,
    "/ko/": locales.locale_abstract_ko,
    "/pt/": locales.locale_abstract_pt,
  },

  markdown: {
    anchor: {
      permalink: true,
    },
    extendMarkdown: (md) => {
      md.use(require("markdown-it-multicolumn").default);
    },
    config: (md) => {
      md.use(require("markdown-it-footnote"));
    },
  },

  plugins: [
    "tabs",
    "@vuepress/back-to-top",
    [
      "@vuepress/last-updated",
      {
        transformer: (timestamp, lang) => {
          return new Date(timestamp).toUTCString();
        },
      },
    ],
    "@vuepress/active-header-links",
    "vuepress-plugin-mermaidjs",
    [
      "seo",
      {
        image: () =>
          "/images/sanic-framework-social-media-preview-1280x640.png",
      },
    ],
    ["sitemap", { hostname: "https://sanic.dev" }],
    [
      "umami",
      {
        trackerUrl: "https://analytics.sanicframework.org",
        siteId: "0131e426-4d6d-476b-a84b-34a45e0be6de",
      },
    ],
    [
      "vuepress-plugin-container",
      {
        type: "new",
        defaultTitle: {
          "/en/": "NEW",
          "/zh/": "新的",
          "/ja/": "新しい",
          "/ko/": "새로운",
          "/pt/": "NOVO",
        },
      },
    ],
    [
      "vuepress-plugin-redirect",
      {
        locales: true,
      },
    ],
    [
      "vuepress-plugin-code-copy",
      { color: "#ff0d68", backgroundTransition: false },
    ],
  ],

  configureWebpack: {
    resolve: {
      alias: {
        "@assets": path.resolve(__dirname, "../assets"),
      },
    },
  },

  themeConfig: {
    repo: "sanic-org/sanic",
    docsRepo: "sanic-org/sanic-guide",
    docsDir: "src",
    docsBranch: "main",
    editLinks: true,
    smoothScroll: true,
    nextLinks: true,
    prevLinks: true,
    lastUpdated: "Last Updated",
    helpLink: "help.md",
    helpTextFallback: "Help",
    logo: "https://raw.githubusercontent.com/sanic-org/sanic-assets/main/png/sanic-framework-logo-simple-400x97.png",
    locales: {
      "/en/": locales.locale_detail_en,
      "/zh/": locales.locale_detail_zh,
      "/ja/": locales.locale_detail_ja,
      "/ko/": locales.locale_detail_ko,
      "/pt/": locales.locale_detail_pt,
    },
    author: {
      name: "Sanic Community Organization",
      twitter: "@sanicframework",
    },
  },
};

module.exports = site_config;
