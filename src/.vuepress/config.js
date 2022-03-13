const path = require("path");

let ja = {
  lang: "ja-JA",
  title: "Sanic フレームワーク",
  description:
    "SanicはPython3.7以上で書かれており、処理速度が速いWebサーバーとウェブフレームワークです。Python 3.5で追加された非同期/待機構文の使用が可能になり、コードがノンブロッキングでスピーディーになります。",
};

let ja_locales = {
  selectText: "Languages",
  label: "Japanese",
  editLinkText: "Edit this page on GitHub",
  algolia: {},
  nav: [
    {
      text: "Home",
      link: "/ja/",
    },
    // { text: "Announcements", link: "/announcements" },
    {
      text: "Docs",
      items: [
        {
          text: "ユーザーガイド",
          items: [
            {
              text: "ジェネラル",
              link: "/ja/guide/getting-started.md",
            },
            {
              text: "ベーシック",
              link: "/ja/guide/basics/app.md",
            },
            {
              text: "アドバンス",
              link: "/ja/guide/advanced/class-based-views.md",
            },
            {
              text: "ベストプラクティス",
              link: "/ja/guide/best-practices/blueprints.md",
            },
            {
              text: "実行とデプロイ",
              link: "/ja/guide/deployment/configuration.md",
            },
            {
              text: "どうやって。。。",
              link: "/ja/guide/how-to/toc.md",
            },
          ],
        },
        {
          text: "公式プラグイン",
          items: [
            {
              text: "sanic拡張",
              link: "/ja/plugins/sanic-ext/getting-started.md",
            },
            {
              text: "Sanic テスト",
              link: "/ja/plugins/sanic-testing/testing.md",
            },
          ],
        },
        {
          text: "APIドキュメント",
          items: [
            {
              text: "APIドキュメントを見る",
              link: "https://sanic.readthedocs.io",
            },
          ],
        },
        {
          text: "非政府組織ドキュメント",
          items: [
            {
              text: "ポリシー",
              link: "/ja/org/policies.md",
            },
            {
              text: "S.C.O.P.E.",
              link: "/ja/org/scope.md",
            },
          ],
        },
      ],
    },
    {
      text: "コミュニティー",
      items: [
        {
          text: "Forums",
          link: "https://community.sanicframework.org/",
        },
        {
          text: "Discord",
          link: "https://discord.gg/FARQzAEMAA",
        },
        {
          text: "Twitter",
          link: "https://twitter.com/sanicframework",
        },
        {
          text: "Sponsorship",
          link: "https://opencollective.com/sanic-org/",
        },
      ],
    },
  ],
  sidebar: {
    "/ja/guide/": [
      {
        title: "ジェネラル",
        sidebarDepth: 1,
        children: ["/ja/guide/", "/ja/guide/getting-started.md"],
      },
      {
        title: "ベーシック",
        sidebarDepth: 1,
        children: [
          "/ja/guide/basics/app.md",
          "/ja/guide/basics/handlers.md",
          "/ja/guide/basics/request.md",
          "/ja/guide/basics/response.md",
          "/ja/guide/basics/routing.md",
          "/ja/guide/basics/listeners.md",
          "/ja/guide/basics/middleware.md",
          "/ja/guide/basics/headers.md",
          "/ja/guide/basics/cookies.md",
          "/ja/guide/basics/tasks.md",
        ],
      },
      {
        title: "アドバンス",
        sidebarDepth: 1,
        children: [
          "/ja/guide/advanced/class-based-views.md",
          "/ja/guide/advanced/proxy-headers.md",
          "/ja/guide/advanced/streaming.md",
          "/ja/guide/advanced/websockets.md",
          "/ja/guide/advanced/versioning.md",
          "/ja/guide/advanced/signals.md",
        ],
      },
      {
        title: "いい練習",
        sidebarDepth: 1,
        children: [
          "/ja/guide/best-practices/blueprints.md",
          "/ja/guide/best-practices/exceptions.md",
          "/ja/guide/best-practices/decorators.md",
          "/ja/guide/best-practices/logging.md",
          "/ja/guide/best-practices/testing.md",
        ],
      },
      {
        title: "実行とデプロイ",
        sidebarDepth: 2,
        children: [
          "/ja/guide/deployment/configuration.md",
          "/ja/guide/deployment/development.md",
          "/ja/guide/deployment/running.md",
          // "/guide/deployment/server-choice.md",
          "/ja/guide/deployment/nginx.md",
          // "/guide/deployment/docker.md",
          // "/guide/deployment/kubernetes.md",
        ],
      },
      {
        title: "どうやって。。。",
        sidebarDepth: 1,
        children: [
          "/ja/guide/how-to/toc.md",
          "/ja/guide/how-to/mounting.md",
          "/ja/guide/how-to/authentication.md",
          "/ja/guide/how-to/autodiscovery.md",
          "/ja/guide/how-to/cors.md",
          // "/guide/how-to/db.md",
          // "/guide/how-to/decorators.md",
          // "/guide/how-to/validation.md",
          // "/guide/how-to/csrf.md",
          // "/guide/how-to/serialization.md",
          // "/ja/guide/how-to/sqlalchemy.md",
          "/ja/guide/how-to/orm.md",
          "/ja/guide/how-to/static-redirects.md",
          // "/guide/how-to/task-queue.md",
          "/ja/guide/how-to/tls.md",
          // "/guide/how-to/websocket-feed.md",
          // "/guide/how-to/server-sent-events.md",
        ],
      },
      {
        title: "リリースノート",
        sidebarDepth: 1,
        children: [
          "/ja/guide/release-notes/v21.9.md",
          "/ja/guide/release-notes/v21.6.md",
          "/ja/guide/release-notes/v21.3.md",
        ],
      },
      {
        title: "プラグイン",
        sidebarDepth: 1,
        children: [
          ["/ja/plugins/sanic-ext/getting-started.md", "Sanic Extensions"],
          ["/ja/plugins/sanic-testing/testing.md", "Sanic Testing"],
        ],
      },
      {
        title: "組織",
        sidebarDepth: 1,
        children: ["/ja/org/policies.md", "/ja/org/scope.md"],
      },
    ],

    "/ja/plugins/": [
      {
        title: "ユーザーガイド",
        sidebarDepth: 1,
        children: [
          ["/ja/guide/", "General"],
          ["/ja/guide/basics/app.md", "Basics"],
          ["/ja/guide/advanced/class-based-views.md", "Advanced"],
          ["/ja/guide/best-practices/blueprints.md", "Best Practices"],
          ["/ja/guide/deployment/configuration.md", "Running & Deploying"],
          ["/ja/guide/how-to/toc.md", "How to..."],
        ],
      },
      {
        title: "Sanic拡張",
        sidebarDepth: 1,
        children: [
          "/ja/plugins/sanic-ext/getting-started.md",
          {
            title: "HTTP グッズ",
            children: [
              "/ja/plugins/sanic-ext/http/methods.md",
              "/ja/plugins/sanic-ext/http/cors.md",
            ],
          },
          "/ja/plugins/sanic-ext/convenience.md",
          "/ja/plugins/sanic-ext/injection.md",
          {
            title: "OpenAPI",
            sidebarDepth: 2,
            children: [
              "/ja/plugins/sanic-ext/openapi/basic.md",
              "/ja/plugins/sanic-ext/openapi/ui.md",
              "/ja/plugins/sanic-ext/openapi/decorators.md",
              "/ja/plugins/sanic-ext/openapi/advanced.md",
              "/ja/plugins/sanic-ext/openapi/autodoc.md",
            ],
          },
          "/ja/plugins/sanic-ext/validation.md",
          "/ja/plugins/sanic-ext/configuration.md",
        ],
      },
      {
        title: "Sanic テスト",
        sidebarDepth: 1,
        children: ["/ja/plugins/sanic-testing/testing.md"],
      },
      {
        title: "組織",
        sidebarDepth: 1,
        children: ["/ja/org/policies.md", "/ja/org/scope.md"],
      },
    ],

    "/ja/org/": [
      {
        title: "ユーザーガイド",
        sidebarDepth: 1,
        children: [
          ["/ja/guide/", "General"],
          ["/ja/guide/basics/app.md", "Basics"],
          ["/ja/guide/advanced/class-based-views.md", "Advanced"],
          ["/ja/guide/best-practices/blueprints.md", "Best Practices"],
          ["/ja/guide/deployment/configuration.md", "Running & Deploying"],
          ["/ja/guide/how-to/toc.md", "How to..."],
        ],
      },
      {
        title: "プラグイン",
        sidebarDepth: 1,
        children: [
          ["/ja/plugins/sanic-ext/getting-started.md", "Sanic Extensions"],
          ["/ja/plugins/sanic-testing/testing.md", "Sanic Testing"],
        ],
      },
      {
        title: "組織",
        sidebarDepth: 1,
        collapsable: false,
        children: ["/ja/org/policies.md", "/ja/org/scope.md"],
      },
    ],
  },
};

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
    "/ja/": ja,
    "/ko/": locales.locale_abstract_ko,
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
      "/ja/": ja_locales,
      "/ko/": locales.locale_detail_ko,
    },
    author: {
      name: "Sanic Community Organization",
      twitter: "@sanicframework",
    },
  },
};

module.exports = site_config;
