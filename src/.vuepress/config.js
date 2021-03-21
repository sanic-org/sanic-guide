const path = require("path");

/*
----------------------------------------------------------------------------------------------------------------
    please add language base config here, after that, please add it to locales.
    请在此处声明语言基础配置, 声明完成之后, 请将其添加到 locales 配置中。
----------------------------------------------------------------------------------------------------------------
*/

let en = {
  lang: "en-US",
  title: "Sanic Framework",
  description:
    "Sanic is a Python 3.7+ web server and web framework that's written to go fast. It allows the usage of the async/await syntax added in Python 3.5, which makes your code non-blocking and speedy.",
};

let zh = {
  lang: "zh-hans",
  title: "Sanic 框架",
  description:
    "Sanic 是 Python 3.7+ Web 服务器和 Web 框架，旨在提高性能。它允许使用 Python 3.5 中添加的 `async`/`await`等待语法，这使得您的代码有效的避免阻塞从而达到提升响应速度的目的。",
};

/*
----------------------------------------------------------------------------------------------------------------
    please add language detailed config here, after that, please add it to site_config.themeConfig.locales .
    请在此处声明语言基础配置, 声明完成之后, 请将其添加到 site_config.themeConfig.locales 配置中。
----------------------------------------------------------------------------------------------------------------
*/

let en_locales = {
  selectText: "Languages",
  label: "English",
  editLinkText: "Edit this page on GitHub",
  algolia: {},
  nav: [
    {
      text: "Home",
      link: "/en/",
    },
    // { text: "Announcements", link: "/announcements" },
    {
      text: "Docs",
      items: [
        {
          text: "User Guide",
          items: [
            {
              text: "General",
              link: "/en/guide/getting-started.md",
            },
            {
              text: "Basics",
              link: "/en/guide/basics/app.md",
            },
            {
              text: "Advanced",
              link: "/en/guide/advanced/class-based-views.md",
            },
            {
              text: "Best Practices",
              link: "/en/guide/best-practices/blueprints.md",
            },
            {
              text: "Running & Deploying",
              link: "/en/guide/deployment/configuration.md",
            },
            {
              text: "How to...",
              link: "/en/guide/how-to/toc.md",
            },
          ],
        },
        {
          text: "API Docs",
          items: [
            {
              text: "View API Docs",
              link: "https://sanic.readthedocs.io",
            },
          ],
        },
        {
          text: "Org Docs",
          items: [
            {
              text: "Policies",
              link: "/en/guide/project/policies.md",
            },
            {
              text: "S.C.O.P.E.",
              link: "/en/guide/project/scope.md",
            },
          ],
        },
      ],
    },
    {
      text: "Community",
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
    "/en/guide/": [
      {
        title: "General",
        sidebarDepth: 1,
        children: ["/en/guide/", "/en/guide/getting-started.md"],
      },
      {
        title: "Basics",
        sidebarDepth: 1,
        children: [
          "/en/guide/basics/app.md",
          "/en/guide/basics/handlers.md",
          "/en/guide/basics/request.md",
          "/en/guide/basics/response.md",
          "/en/guide/basics/routing.md",
          "/en/guide/basics/listeners.md",
          "/en/guide/basics/middleware.md",
          "/en/guide/basics/headers.md",
          "/en/guide/basics/cookies.md",
          "/en/guide/basics/tasks.md",
        ],
      },
      {
        title: "Advanced",
        sidebarDepth: 1,
        children: [
          "/en/guide/advanced/class-based-views.md",
          "/en/guide/advanced/proxy-headers.md",
          "/en/guide/advanced/streaming.md",
          "/en/guide/advanced/websockets.md",
          "/en/guide/advanced/versioning.md",
          "/en/guide/advanced/signals.md",
        ],
      },
      {
        title: "Best Practices",
        sidebarDepth: 1,
        children: [
          "/en/guide/best-practices/blueprints.md",
          "/en/guide/best-practices/exceptions.md",
          "/en/guide/best-practices/decorators.md",
          "/en/guide/best-practices/logging.md",
          "/en/guide/best-practices/testing.md",
        ],
      },
      {
        title: "Running & Deploying",
        sidebarDepth: 2,
        children: [
          "/en/guide/deployment/configuration.md",
          "/en/guide/deployment/development.md",
          "/en/guide/deployment/running.md",
          // "/guide/deployment/server-choice.md",
          "/en/guide/deployment/nginx.md",
          // "/guide/deployment/docker.md",
          // "/guide/deployment/kubernetes.md",
        ],
      },
      {
        title: "How to...",
        sidebarDepth: 1,
        children: [
          "/en/guide/how-to/toc.md",
          "/en/guide/how-to/mounting.md",
          "/en/guide/how-to/authentication.md",
          "/en/guide/how-to/autodiscovery.md",
          "/en/guide/how-to/cors.md",
          // "/guide/how-to/db.md",
          // "/guide/how-to/decorators.md",
          // "/guide/how-to/validation.md",
          // "/guide/how-to/csrf.md",
          // "/guide/how-to/serialization.md",
          // "/guide/how-to/task-queue.md",
          "/en/guide/how-to/tls.md",
          // "/guide/how-to/websocket-feed.md",
          // "/guide/how-to/server-sent-events.md",
        ],
      },
      {
        title: "Release Notes",
        sidebarDepth: 1,
        children: ["/en/guide/release-notes/v21.3.md"],
      },
      {
        title: "Organization",
        sidebarDepth: 1,
        children: [
          "/en/guide/project/policies.md",
          "/en/guide/project/scope.md",
        ],
      },
    ],
  },
};

let zh_locales = {
  selectText: "选择语言",
  label: "简体中文",
  editLinkText: "在 GitHub 上编辑此页",

  algolia: {},
  nav: [
    {
      text: "主页",
      link: "/zh/",
    },
    // { text: "Announcements", link: "/announcements" },
    {
      text: "文档",
      items: [
        {
          text: "用户指南",
          items: [
            {
              text: "介绍",
              link: "/zh/guide/getting-started.md",
            },
            {
              text: "入门",
              link: "/zh/guide/basics/app.md",
            },
            {
              text: "进阶",
              link: "/zh/guide/advanced/class-based-views.md",
            },
            {
              text: "最佳实践",
              link: "/zh/guide/best-practices/blueprints.md",
            },
            {
              text: "运行和部署",
              link: "/zh/guide/deployment/configuration.md",
            },
          ],
        },
        {
          text: "API 文档",
          items: [
            {
              text: "查看API文档",
              link: "https://sanic.readthedocs.io",
            },
          ],
        },
        {
          text: "Org 文档",
          items: [
            {
              text: "Policies",
              link: "/zh/guide/project/policies.md",
            },
            {
              text: "S.C.O.P.E.",
              link: "/zh/guide/project/scope.md",
            },
          ],
        },
      ],
    },
    {
      text: "社区",
      items: [
        {
          text: "论坛",
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
    "/zh/guide/": [
      {
        title: "概览",
        sidebarDepth: 1,
        children: ["/zh/guide/", "/zh/guide/getting-started.md"],
      },
      {
        title: "入门",
        sidebarDepth: 1,
        children: [
          "/zh/guide/basics/app.md",
          "/zh/guide/basics/handlers.md",
          "/zh/guide/basics/request.md",
          "/zh/guide/basics/response.md",
          "/zh/guide/basics/routing.md",
          "/zh/guide/basics/listeners.md",
          "/zh/guide/basics/middleware.md",
          "/zh/guide/basics/headers.md",
          "/zh/guide/basics/cookies.md",
          "/zh/guide/basics/tasks.md",
        ],
      },
      {
        title: "进阶",
        sidebarDepth: 1,
        children: [
          "/zh/guide/advanced/class-based-views.md",
          "/zh/guide/advanced/proxy-headers.md",
          "/zh/guide/advanced/streaming.md",
          "/zh/guide/advanced/websockets.md",
          "/zh/guide/advanced/versioning.md",
          "/zh/guide/advanced/signals.md",
        ],
      },
      {
        title: "最佳实践",
        sidebarDepth: 1,
        children: [
          "/zh/guide/best-practices/blueprints.md",
          "/zh/guide/best-practices/exceptions.md",
          "/zh/guide/best-practices/decorators.md",
          "/zh/guide/best-practices/logging.md",
          "/zh/guide/best-practices/testing.md",
        ],
      },
      {
        title: "运行和部署",
        sidebarDepth: 2,
        children: [
          "/zh/guide/deployment/configuration.md",
          "/zh/guide/deployment/development.md",
          "/zh/guide/deployment/running.md",
          // "/zh/guide/deployment/server-choice.md",
          // "/zh/guide/deployment/asgi.md",
          "/zh/guide/deployment/nginx.md",
          // "/zh/guide/deployment/docker.md",
          // "/zh/guide/deployment/kubernetes.md",
        ],
      },
      {
        title: "如何...",
        sidebarDepth: 1,
        children: [
          "/zh/guide/how-to/toc.md",
          "/zh/guide/how-to/mounting.md",
          "/zh/guide/how-to/authentication.md",
          "/zh/guide/how-to/autodiscovery.md",
          "/zh/guide/how-to/cors.md",
          // "/zh/guide/how-to/db.md",
          // "/zh/guide/how-to/decorators.md",
          // "/zh/guide/how-to/validation.md",
          // "/zh/guide/how-to/csrf.md",
          // "/zh/guide/how-to/serialization.md",
          // "/zh/guide/how-to/task-queue.md",
          "/zh/guide/how-to/tls.md",
          // "/zh/guide/how-to/websocket-feed.md",
          // "/zh/guide/how-to/server-sent-events.md",
        ],
      },
      {
        title: "发行记录",
        sidebarDepth: 1,
        children: ["/zh/guide/release-notes/v21.3.md"],
      },
      {
        title: "组织",
        sidebarDepth: 1,
        children: [
          "/zh/guide/project/policies.md",
          "/zh/guide/project/scope.md",
        ],
      },
    ],
  },
};

/*
----------------------------------------------------------------------------------------------------------------
    here is site_config
    站点配置
----------------------------------------------------------------------------------------------------------------
*/

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
    "/en/": en,
    "/zh/": zh,
  },

  markdown: {
    anchor: {
      permalink: true,
    },
    extendMarkdown: (md) => {
      md.use(require("markdown-it-multicolumn").default);
    },
  },

  plugins: [
    "tabs",
    "@vuepress/back-to-top",
    "@vuepress/last-updated",
    "@vuepress/active-header-links",
    "vuepress-plugin-mermaidjs",
    [
      "seo",
      {
        image: () =>
          "/images/sanic-framework-social-media-preview-1280x640.png",
      },
    ],
    ["sitemap", { hostname: "https://sanicframework.org" }],
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
    docsBranch: "master",
    editLinks: true,
    smoothScroll: true,
    nextLinks: true,
    prevLinks: true,
    lastUpdated: "Last Updated",
    logo:
      "https://raw.githubusercontent.com/sanic-org/sanic-assets/master/png/sanic-framework-logo-simple-400x97.png",
    locales: {
      "/en/": en_locales,
      "/zh/": zh_locales,
    },
    author: {
      name: "Sanic Community Organization",
      twitter: "@sanicframework",
    },
  },
};

module.exports = site_config;
