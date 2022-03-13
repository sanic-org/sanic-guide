module.exports = [
  { text: "主页", link: "/zh/" },
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
          {
            text: "如何...",
            link: "/zh/guide/how-to/toc.md",
          },
        ],
      },
      {
        text: "官方插件",
        items: [
          {
            text: "Sanic Extensions",
            link: "/zh/plugins/sanic-ext/getting-started.md",
          },
          {
            text: "Sanic Testing",
            link: "/zh/plugins/sanic-testing/testing.md",
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
            text: "政策",
            link: "/zh/org/policies.md",
          },
          {
            text: "S.C.O.P.E.",
            link: "/zh/org/scope.md",
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
];
