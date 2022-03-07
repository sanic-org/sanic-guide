module.exports = [
  {
    text: "홈 (Home)",
    link: "/ko/",
  },
  // { text: "Announcements", link: "/announcements" },
  {
    text: "문서 (Docs)",
    items: [
      {
        text: "User Guide",
        items: [
          {
            text: "일반 (General)",
            link: "/ko/guide/getting-started.md",
          },
          {
            text: "기초 (Basics)",
            link: "/ko/guide/basics/app.md",
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
        text: "공식 플러그인들",
        items: [
          {
            text: "Sanic Extensions",
            link: "/en/plugins/sanic-ext/getting-started.md",
          },
          {
            text: "Sanic Testing",
            link: "/en/plugins/sanic-testing/getting-started.md",
          },
        ],
      },
      {
        text: "API 문서",
        items: [
          {
            text: "API 문서 보기",
            link: "https://sanic.readthedocs.io",
          },
        ],
      },
      {
        text: "Org 문서",
        items: [
          {
            text: "정책",
            link: "/en/org/policies.md",
          },
          {
            text: "S.C.O.P.E.",
            link: "/en/org/scope.md",
          },
        ],
      },
    ],
  },
  {
    text: "커뮤니티",
    items: [
      {
        text: "포럼",
        link: "https://community.sanicframework.org/",
      },
      {
        text: "디스코드",
        link: "https://discord.gg/FARQzAEMAA",
      },
      {
        text: "트위터",
        link: "https://twitter.com/sanicframework",
      },
      {
        text: "스폰서쉽",
        link: "https://opencollective.com/sanic-org/",
      },
    ],
  },
];
