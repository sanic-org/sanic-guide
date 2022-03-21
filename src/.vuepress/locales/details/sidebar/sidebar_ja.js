module.exports = {
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
        // "/guide/how-to/validtion.md",
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
        ["/ja/plugins/sanic-testing/getting-started.md", "Sanic Testing"],
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
            "/ja/plugins/sanic-ext/openapi/security.md",
          ],
        },
        "/ja/plugins/sanic-ext/validation.md",
        "/ja/plugins/sanic-ext/configuration.md",
      ],
     },
     {
       title: "Sanic テスト",
       sidebarDepth: 1,
       children: [
        "/ja/plugins/sanic-testing/getting-started.md",
        "/ja/plugins/sanic-testing/clients.md",
      ],
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
         ["/ja/plugins/sanic-testing/getting-started.md", "Sanic Testing"],
       ],
     },
     {
       title: "組織",
       sidebarDepth: 1,
       collapsable: false,
       children: ["/ja/org/policies.md", "/ja/org/scope.md"],
     },
   ],
};
