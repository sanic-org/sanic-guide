module.exports = {
  "/ko/guide/": [
    {
      title: "일반 (General)",
      sidebarDepth: 1,
      children: ["/ko/guide/", "/ko/guide/getting-started.md"],
    },
    {
      title: "기초 (Basics)",
      sidebarDepth: 1,
      children: [
        "/ko/guide/basics/app.md",
        "/ko/guide/basics/handlers.md",
        "/ko/guide/basics/request.md",
        "/ko/guide/basics/response.md",
        "/ko/guide/basics/routing.md",
        "/ko/guide/basics/listeners.md",
        "/ko/guide/basics/middleware.md",
        "/ko/guide/basics/headers.md",
        "/ko/guide/basics/cookies.md",
        "/ko/guide/basics/tasks.md",
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
        // "/en/guide/how-to/sqlalchemy.md",
        "/en/guide/how-to/orm.md",
        "/en/guide/how-to/static-redirects.md",
        // "/guide/how-to/task-queue.md",
        "/en/guide/how-to/tls.md",
        // "/guide/how-to/websocket-feed.md",
        // "/guide/how-to/server-sent-events.md",
      ],
    },
    {
      title: "Release Notes",
      sidebarDepth: 1,
      children: [
        "/en/guide/release-notes/v21.9.md",
        "/en/guide/release-notes/v21.6.md",
        "/en/guide/release-notes/v21.3.md",
      ],
    },
    {
      title: "Plugins",
      sidebarDepth: 1,
      children: [
        ["/en/plugins/sanic-ext/getting-started.md", "Sanic Extensions"],
        ["/en/plugins/sanic-testing/getting-started.md", "Sanic Testing"],
      ],
    },
    {
      title: "Organization",
      sidebarDepth: 1,
      children: ["/en/org/policies.md", "/en/org/scope.md"],
    },
  ],

  "/en/plugins/": [
    {
      title: "User Guide",
      sidebarDepth: 1,
      children: [
        ["/en/guide/", "General"],
        ["/en/guide/basics/app.md", "Basics"],
        ["/en/guide/advanced/class-based-views.md", "Advanced"],
        ["/en/guide/best-practices/blueprints.md", "Best Practices"],
        ["/en/guide/deployment/configuration.md", "Running & Deploying"],
        ["/en/guide/how-to/toc.md", "How to..."],
      ],
    },
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
          ],
        },
        "/en/plugins/sanic-ext/validation.md",
        "/en/plugins/sanic-ext/configuration.md",
      ],
    },
    {
      title: "Sanic Testing",
      sidebarDepth: 1,
      children: ["/en/plugins/sanic-testing/getting-started.md"],
    },
    {
      title: "Organization",
      sidebarDepth: 1,
      children: ["/en/org/policies.md", "/en/org/scope.md"],
    },
  ],

  "/en/org/": [
    {
      title: "User Guide",
      sidebarDepth: 1,
      children: [
        ["/en/guide/", "General"],
        ["/en/guide/basics/app.md", "Basics"],
        ["/en/guide/advanced/class-based-views.md", "Advanced"],
        ["/en/guide/best-practices/blueprints.md", "Best Practices"],
        ["/en/guide/deployment/configuration.md", "Running & Deploying"],
        ["/en/guide/how-to/toc.md", "How to..."],
      ],
    },
    {
      title: "Plugins",
      sidebarDepth: 1,
      children: [
        ["/en/plugins/sanic-ext/getting-started.md", "Sanic Extensions"],
        ["/en/plugins/sanic-testing/getting-started.md", "Sanic Testing"],
      ],
    },
    {
      title: "Organization",
      sidebarDepth: 1,
      collapsable: false,
      children: ["/en/org/policies.md", "/en/org/scope.md"],
    },
  ],
};
