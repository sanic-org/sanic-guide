const userGuideFull = [
  {
      title: "全般",
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
      title: "ベストプラクティス",
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
        "/ja/guide/deployment/manager.md",
        "/ja/guide/deployment/app-loader.md",
        "/ja/guide/deployment/inspector.md",
        // "/guide/deployment/server-choice.md",
        "/ja/guide/deployment/nginx.md",
        "/ja/guide/deployment/docker.md",
        // "/guide/deployment/kubernetes.md",
      ],
    },
    {
      title: "ハウツー集",
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
    }
]
const userGuideShort = [
        ["/ja/guide/", "全般"],
        ["/ja/guide/basics/app.md", "ベーシック"],
        ["/ja/guide/advanced/class-based-views.md", "アドバンス"],
        ["/ja/guide/best-practices/blueprints.md", "ベストプラクティス"],
        ["/ja/guide/deployment/configuration.md", "実行とデプロイ"],
        ["/ja/guide/how-to/toc.md", "ハウツー集"],
      ]
const pluginsFull = [
  {
      title: "Sanic Extensions",
      sidebarDepth: 1,
      children: [
        "/ja/plugins/sanic-ext/getting-started.md",
        {
          title: "HTTP goodies",
          children: [
            "/ja/plugins/sanic-ext/http/methods.md",
            "/ja/plugins/sanic-ext/http/cors.md",
          ],
        },
        {
          title: "OpenAPI",
          sidebarDepth: 2,
          children: [
            "/ja/plugins/sanic-ext/openapi/basic.md",
            "/ja/plugins/sanic-ext/openapi/ui.md",
            "/ja/plugins/sanic-ext/openapi/decorators.md",
            "/ja/plugins/sanic-ext/openapi/advanced.md",
            "/ja/plugins/sanic-ext/openapi/autodoc.md",
            "/ja/plugins/sanic-ext/openapi/security.md",
          ],
        },
        "/ja/plugins/sanic-ext/convenience.md",
        "/ja/plugins/sanic-ext/templating.md",
        "/ja/plugins/sanic-ext/injection.md",
        "/ja/plugins/sanic-ext/validation.md",
        "/ja/plugins/sanic-ext/health-monitor.md",
        "/ja/plugins/sanic-ext/logger.md",
        "/ja/plugins/sanic-ext/configuration.md",
        "/ja/plugins/sanic-ext/custom.md",
      ],
    },
    {
      title: "Sanic Testing",
      sidebarDepth: 1,
      children: [
        "/ja/plugins/sanic-testing/getting-started.md",
        "/ja/plugins/sanic-testing/clients.md",
      ],
    }
]
const pluginsShort = [
    ["/ja/plugins/sanic-testing/getting-started.md", "Sanic Testing"],
    ["/ja/plugins/sanic-ext/getting-started.md", "Sanic Extensions"],
]
const org = [
        "/ja/org/feature_requests.md",
        "/ja/org/policies.md",
        "/ja/org/scope.md"
      ]
const releaseNotes = [
        {
          title: "2022",
          sidebarDepth: 2,
          children: [
            "/ja/guide/release-notes/v22.12.md",
            "/ja/guide/release-notes/v22.9.md",
            "/ja/guide/release-notes/v22.6.md",
            "/ja/guide/release-notes/v22.3.md",
          ]
        },

        {
          title: "2021",
          sidebarDepth: 2,
          children: [
            "/ja/guide/release-notes/v21.12.md",
            "/ja/guide/release-notes/v21.9.md",
            "/ja/guide/release-notes/v21.6.md",
            "/ja/guide/release-notes/v21.3.md",
          ]
        },
      ]

module.exports = {
  "/ja/guide/": [
    {"title": "ユーザーガイド", children: userGuideFull, collapsable: false},
    {"title": "プラグイン", children: pluginsFull, collapsable: false},
    {"title": "リリースノート", children: releaseNotes},
    {"title": "組織", children: org},
  ],

  "/ja/guide/release-notes/": [
    {"title": "ユーザーガイド", children: userGuideShort, initialOpenGroupIndex: -1},
    {"title": "プラグイン", children: pluginsShort, initialOpenGroupIndex: -1},
    {"title": "リリースノート", children: releaseNotes, collapsable: false},
    {"title": "組織", children: org},
  ],

  "/ja/plugins/": [
    {"title": "ユーザーガイド", children: userGuideFull, collapsable: false, initialOpenGroupIndex: -1},
    {"title": "プラグイン", children: pluginsFull, collapsable: false},
    {"title": "リリースノート", children: releaseNotes},
    {"title": "組織", children: org},
  ],

  "/ja/org/": [
    {"title": "ユーザーガイド", children: userGuideShort},
    {"title": "プラグイン", children: pluginsShort},
    {"title": "リリースノート", children: releaseNotes},
    {"title": "組織", children: org, collapsable: false},
  ],
};
