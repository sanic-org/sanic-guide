const userGuideFull = [
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
        "/en/guide/deployment/manager.md",
        // "/guide/deployment/server-choice.md",
        "/en/guide/deployment/nginx.md",
        "/en/guide/deployment/docker.md",
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
        // "/en/guide/how-to/sqlalchemy.md",
        "/en/guide/how-to/orm.md",
        "/en/guide/how-to/static-redirects.md",
        // "/guide/how-to/task-queue.md",
        "/en/guide/how-to/tls.md",
        // "/guide/how-to/websocket-feed.md",
        // "/guide/how-to/server-sent-events.md",
      ],
    }
]
const userGuideShort = [
        ["/en/guide/", "General"],
        ["/en/guide/basics/app.md", "Basics"],
        ["/en/guide/advanced/class-based-views.md", "Advanced"],
        ["/en/guide/best-practices/blueprints.md", "Best Practices"],
        ["/en/guide/deployment/configuration.md", "Running & Deploying"],
        ["/en/guide/how-to/toc.md", "How to..."],
      ]
const pluginsFull = [
  {
      title: "Sanic Extensions",
      sidebarDepth: 1,
      children: [
        "/en/plugins/sanic-ext/getting-started.md",
        {
          title: "HTTP goodies",
          children: [
            "/en/plugins/sanic-ext/http/methods.md",
            "/en/plugins/sanic-ext/http/cors.md",
          ],
        },
        "/en/plugins/sanic-ext/convenience.md",
        "/en/plugins/sanic-ext/templating.md",
        "/en/plugins/sanic-ext/injection.md",
        {
          title: "OpenAPI",
          sidebarDepth: 2,
          children: [
            "/en/plugins/sanic-ext/openapi/basic.md",
            "/en/plugins/sanic-ext/openapi/ui.md",
            "/en/plugins/sanic-ext/openapi/decorators.md",
            "/en/plugins/sanic-ext/openapi/advanced.md",
            "/en/plugins/sanic-ext/openapi/autodoc.md",
            "/en/plugins/sanic-ext/openapi/security.md",
          ],
        },
        "/en/plugins/sanic-ext/validation.md",
        "/en/plugins/sanic-ext/configuration.md",
      ],
    },
    {
      title: "Sanic Testing",
      sidebarDepth: 1,
      children: [
        "/en/plugins/sanic-testing/getting-started.md",
        "/en/plugins/sanic-testing/clients.md",
      ],
    }
]
const pluginsShort = [
    ["/en/plugins/sanic-testing/getting-started.md", "Sanic Testing"],
    ["/en/plugins/sanic-ext/getting-started.md", "Sanic Extensions"],
]
const org = [
        "/en/org/feature_requests.md",
        "/en/org/policies.md",
        "/en/org/scope.md"
      ]
const releaseNotes = [
        {
          title: "2022",
          sidebarDepth: 2,
          children: [
            "/en/guide/release-notes/v22.9.md",
            "/en/guide/release-notes/v22.6.md",
            "/en/guide/release-notes/v22.3.md",
          ]
        },

        {
          title: "2021",
          sidebarDepth: 2,
          children: [
            "/en/guide/release-notes/v21.12.md",
            "/en/guide/release-notes/v21.9.md",
            "/en/guide/release-notes/v21.6.md",
            "/en/guide/release-notes/v21.3.md",
          ]
        },
      ]

module.exports = {
  "/en/guide/": [
    {"title": "User Guide", children: userGuideFull, collapsable: false},
    {"title": "Plugins", children: pluginsFull, collapsable: false},
    {"title": "Release Notes", children: releaseNotes},
    {"title": "Organization", children: org},
  ],

  "/en/guide/release-notes/": [
    {"title": "User Guide", children: userGuideShort, initialOpenGroupIndex: -1},
    {"title": "Plugins", children: pluginsShort, initialOpenGroupIndex: -1},
    {"title": "Release Notes", children: releaseNotes, collapsable: false},
    {"title": "Organization", children: org},
  ],

  "/en/plugins/": [
    {"title": "User Guide", children: userGuideFull, collapsable: false, initialOpenGroupIndex: -1},
    {"title": "Plugins", children: pluginsFull, collapsable: false},
    {"title": "Release Notes", children: releaseNotes},
    {"title": "Organization", children: org},
  ],

  "/en/org/": [
    {"title": "User Guide", children: userGuideShort},
    {"title": "Plugins", children: pluginsShort},
    {"title": "Release Notes", children: releaseNotes},
    {"title": "Organization", children: org, collapsable: false},
  ],
};
