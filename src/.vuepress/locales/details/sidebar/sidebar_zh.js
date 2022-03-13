module.exports = {
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
        // "/zh/guide/how-to/sqlalchemy.md",
        "/zh/guide/how-to/orm.md",
        // "/zh/guide/how-to/task-queue.md",
        "/zh/guide/how-to/tls.md",
        // "/zh/guide/how-to/websocket-feed.md",
        // "/zh/guide/how-to/server-sent-events.md",
      ],
    },
    {
      title: "发行记录",
      sidebarDepth: 1,
      children: [
        "/zh/guide/release-notes/v21.9.md",
        "/zh/guide/release-notes/v21.6.md",
        "/zh/guide/release-notes/v21.3.md",
      ],
    },
    {
      title: "插件",
      sidebarDepth: 1,
      children: [
        ["/zh/plugins/sanic-ext/getting-started.md", "Sanic 拓展"],
        ["/zh/plugins/sanic-testing/testing.md", "Sanic Testing"],
      ],
    },
    {
      title: "组织",
      sidebarDepth: 1,
      children: ["/zh/org/policies.md", "/zh/org/scope.md"],
    },
  ],

  "/zh/plugins/": [
    {
      title: "用户指南",
      sidebarDepth: 1,
      children: [
        ["/zh/guide/", "概览"],
        ["/zh/guide/basics/app.md", "入门"],
        ["/zh/guide/advanced/class-based-views.md", "进阶"],
        ["/zh/guide/best-practices/blueprints.md", "最佳实践"],
        ["/zh/guide/deployment/configuration.md", "运行和部署"],
        ["/zh/guide/how-to/toc.md", "如何..."],
      ],
    },
    {
      title: "Sanic 拓展",
      sidebarDepth: 1,
      children: [
        "/zh/plugins/sanic-ext/getting-started.md",
        {
          title: "HTTP goodies",
          children: [
            "/zh/plugins/sanic-ext/http/methods.md",
            "/zh/plugins/sanic-ext/http/cors.md",
          ],
        },
        "/zh/plugins/sanic-ext/convenience.md",
        "/zh/plugins/sanic-ext/injection.md",
        {
          title: "OpenAPI",
          sidebarDepth: 2,
          children: [
            "/zh/plugins/sanic-ext/openapi/basic.md",
            "/zh/plugins/sanic-ext/openapi/ui.md",
            "/zh/plugins/sanic-ext/openapi/decorators.md",
            "/zh/plugins/sanic-ext/openapi/advanced.md",
            "/zh/plugins/sanic-ext/openapi/autodoc.md",
            "/zh/plugins/sanic-ext/openapi/validation.md",
          ],
        },
        "/zh/plugins/sanic-ext/configuration.md",
      ],
    },
    {
      title: "Sanic Testing",
      sidebarDepth: 1,
      children: ["/zh/plugins/sanic-testing/testing.md"],
    },
    {
      title: "组织",
      sidebarDepth: 1,
      children: ["/zh/org/policies.md", "/zh/org/scope.md"],
    },
  ],

  "/zh/org/": [
    {
      title: "用户指南",
      sidebarDepth: 1,
      children: [
        ["/zh/guide/", "概览"],
        ["/zh/guide/basics/app.md", "入门"],
        ["/zh/guide/advanced/class-based-views.md", "进阶"],
        ["/zh/guide/best-practices/blueprints.md", "最佳实践"],
        ["/zh/guide/deployment/configuration.md", "运行和部署"],
        ["/zh/guide/how-to/toc.md", "如何..."],
      ],
    },
    {
      title: "插件",
      sidebarDepth: 1,
      children: [
        ["/zh/plugins/sanic-ext/getting-started.md", "Sanic Extensions"],
        ["/zh/plugins/sanic-testing/testing.md", "Sanic Testing"],
      ],
    },
    {
      title: "组织",
      sidebarDepth: 1,
      collapsable: false,
      children: ["/zh/org/policies.md", "/zh/org/scope.md"],
    },
  ],
};
