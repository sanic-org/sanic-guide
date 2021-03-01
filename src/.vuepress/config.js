const path = require("path");

module.exports = {
  title: "Sanic Framework",
  subtitle: "Build fast. Run fast.",
  description:
    "Sanic is a Python 3.6+ web server and web framework that's written to go fast. It allows the usage of the async/await syntax added in Python 3.5, which makes your code non-blocking and speedy.",
  markdown: {
    anchor: { permalink: true },
    extendMarkdown: (md) => {
      // use more markdown-it plugins!
      // md.use(require('markdown-it-multicolumn'))
      md.use(require("markdown-it-multicolumn").default);
    },
  },
  plugins: [
    "tabs",
    "@vuepress/back-to-top",
    "@vuepress/last-updated",
    "@vuepress/active-header-links",
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
          "/": "NEW",
          "/zh/": "新的",
        },
      },
    ],
  ],
  themeConfig: {
    repo: "sanic-org/sanic",
    docsRepo: "sanic-org/sanic-guide",
    docsDir: "docs",
    docsBranch: "master",
    editLinks: true,
    smoothScroll: true,
    nextLinks: true,
    prevLinks: true,
    lastUpdated: "Last Updated",
    logo:
      "https://raw.githubusercontent.com/huge-success/sanic-assets/master/png/sanic-framework-logo-simple-400x97.png",
    nav: [
      { text: "Home", link: "/" },
      // { text: "Announcements", link: "/announcements" },
      {
        text: "Docs",
        items: [
          {
            text: "User Guide",
            items: [
              { text: "General", link: "/guide/getting-started.md" },
              { text: "Basics", link: "/guide/basics/app.md" },
              {
                text: "Advanced",
                link: "/guide/advanced/class-based-views.md",
              },
              {
                text: "Best Practices",
                link: "/guide/best-practices/blueprints.md",
              },
              {
                text: "Running & Deploying",
                link: "/guide/deployment/configuration.md",
              },
            ],
          },
          {
            text: "API Docs",
            items: [
              { text: "Legacy Docs", link: "https://sanic.readthedocs.io" },
            ],
          },
        ],
      },
      {
        text: "Community",
        items: [
          { text: "Forums", link: "https://community.sanicframework.org/" },
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
    sidebar: [
      {
        title: "General",
        sidebarDepth: 1,
        children: ["/guide/", "/guide/getting-started.md"],
      },
      {
        title: "Basics",
        sidebarDepth: 1,
        children: [
          "/guide/basics/app.md",
          "/guide/basics/handlers.md",
          "/guide/basics/request.md",
          "/guide/basics/response.md",
          "/guide/basics/routing.md",
          "/guide/basics/listeners.md",
          "/guide/basics/middleware.md",
          "/guide/basics/headers.md",
          "/guide/basics/cookies.md",
          "/guide/basics/tasks.md",
        ],
      },
      {
        title: "Advanced",
        sidebarDepth: 1,
        children: [
          "/guide/advanced/class-based-views.md",
          "/guide/advanced/proxy-headers.md",
          "/guide/advanced/streaming.md",
          "/guide/advanced/websockets.md",
          "/guide/advanced/versioning.md",
        ],
      },
      {
        title: "Best Practices",
        sidebarDepth: 1,
        children: [
          "/guide/best-practices/blueprints.md",
          "/guide/best-practices/exceptions.md",
          "/guide/best-practices/decorators.md",
          "/guide/best-practices/logging.md",
          "/guide/best-practices/testing.md",
        ],
      },
      {
        title: "Running & Deploying",
        sidebarDepth: 2,
        children: [
          "/guide/deployment/configuration.md",
          "/guide/deployment/development.md",
          // "/guide/deployment/server-choice.md",
          // "/guide/deployment/asgi.md",
          "/guide/deployment/nginx.md",
          // "/guide/deployment/docker.md",
          // "/guide/deployment/kubernetes.md",
        ],
      },
      {
        title: "How to...",
        sidebarDepth: 1,
        children: [
          // "/guide/how-to/db.md",
          // "/guide/how-to/decorators.md",
          // "/guide/how-to/validation.md",
          // "/guide/how-to/authentication.md",
          // "/guide/how-to/cors.md",
          // "/guide/how-to/csrf.md",
          // "/guide/how-to/autodiscovery.md",
          // "/guide/how-to/serialization.md",
          // "/guide/how-to/task-queue.md",
          // "/guide/how-to/websocket-feed.md",
          // "/guide/how-to/server-sent-events.md",
        ],
      },
    ],
  },
  configureWebpack: {
    resolve: {
      alias: {
        "@assets": path.resolve(__dirname, "../assets"),
      },
    },
  },
};
