module.exports = {
  "/pt/guide/": [
    {
      title: "Geral",
      sidebarDepth: 1,
      children: ["/pt/guide/", "/pt/guide/getting-started.md"],
    },
    {
      title: "Básicos",
      sidebarDepth: 1,
      children: [
        "/pt/guide/basics/app.md",
        "/pt/guide/basics/handlers.md",
        "/pt/guide/basics/request.md",
        "/pt/guide/basics/response.md",
        "/pt/guide/basics/routing.md",
        "/pt/guide/basics/listeners.md",
        "/pt/guide/basics/middleware.md",
        "/pt/guide/basics/headers.md",
        "/pt/guide/basics/cookies.md",
        "/pt/guide/basics/tasks.md",
      ],
    },
    {
      title: "Avançado",
      sidebarDepth: 1,
      children: [
        "/pt/guide/advanced/class-based-views.md",
        "/pt/guide/advanced/proxy-headers.md",
        "/pt/guide/advanced/streaming.md",
        "/pt/guide/advanced/websockets.md",
        "/pt/guide/advanced/versioning.md",
        "/pt/guide/advanced/signals.md",
      ],
    },
    {
      title: "Boas Práticas",
      sidebarDepth: 1,
      children: [
        "/pt/guide/best-practices/blueprints.md",
        "/pt/guide/best-practices/exceptions.md",
        "/pt/guide/best-practices/decorators.md",
        "/pt/guide/best-practices/logging.md",
        "/pt/guide/best-practices/testing.md",
      ],
    },
    {
      title: "Executando e Desdobrando",
      sidebarDepth: 2,
      children: [
        "/pt/guide/deployment/configuration.md",
        "/pt/guide/deployment/development.md",
        "/pt/guide/deployment/running.md",
        // "/guide/deployment/server-choice.md",
        "/pt/guide/deployment/nginx.md",
        // "/guide/deployment/docker.md",
        // "/guide/deployment/kubernetes.md",
      ],
    },
    {
      title: "Como...",
      sidebarDepth: 1,
      children: [
        "/pt/guide/how-to/toc.md",
        "/pt/guide/how-to/mounting.md",
        "/pt/guide/how-to/authentication.md",
        "/pt/guide/how-to/autodiscovery.md",
        "/pt/guide/how-to/cors.md",
        // "/guide/how-to/db.md",
        // "/guide/how-to/decorators.md",
        // "/guide/how-to/validation.md",
        // "/guide/how-to/csrf.md",
        // "/guide/how-to/serialization.md",
        // "/pt/guide/how-to/sqlalchemy.md",
        "/pt/guide/how-to/orm.md",
        "/pt/guide/how-to/static-redirects.md",
        // "/guide/how-to/task-queue.md",
        "/pt/guide/how-to/tls.md",
        // "/guide/how-to/websocket-feed.md",
        // "/guide/how-to/server-sent-events.md",
      ],
    },
    {
      title: "Notas de Lançamanto",
      sidebarDepth: 1,
      children: [
        "/pt/guide/release-notes/v22.3.md",
        "/pt/guide/release-notes/v21.12.md",
        "/pt/guide/release-notes/v21.9.md",
        "/pt/guide/release-notes/v21.6.md",
        "/pt/guide/release-notes/v21.3.md",
      ],
    },
    {
      title: "Plugins",
      sidebarDepth: 1,
      children: [
        ["/pt/plugins/sanic-ext/getting-started.md", "Extensões de Sanic"],
        ["/pt/plugins/sanic-testing/getting-started.md", "Testes da Sanic"],
      ],
    },
    {
      title: "Organização",
      sidebarDepth: 1,
      children: ["/pt/org/policies.md", "/pt/org/scope.md"],
    },
  ],

  "/pt/plugins/": [
    {
      title: "Guia de Usuário",
      sidebarDepth: 1,
      children: [
        ["/pt/guide/", "Geral"],
        ["/pt/guide/basics/app.md", "Básicos"],
        ["/pt/guide/advanced/class-based-views.md", "Avançado"],
        ["/pt/guide/best-practices/blueprints.md", "Boas Práticas"],
        ["/pt/guide/deployment/configuration.md", "Executando e Desdobrando"],
        ["/pt/guide/how-to/toc.md", "Como..."],
      ],
    },
    {
      title: "Extensões de Sanic",
      sidebarDepth: 1,
      children: [
        "/pt/plugins/sanic-ext/getting-started.md",
        {
          title: "Recursos da HTTP",
          children: [
            "/pt/plugins/sanic-ext/http/methods.md",
            "/pt/plugins/sanic-ext/http/cors.md",
          ],
        },
        "/pt/plugins/sanic-ext/convenience.md",
        "/pt/plugins/sanic-ext/injection.md",
        {
          title: "OpenAPI",
          sidebarDepth: 2,
          children: [
            "/pt/plugins/sanic-ext/openapi/basic.md",
            "/pt/plugins/sanic-ext/openapi/ui.md",
            "/pt/plugins/sanic-ext/openapi/decorators.md",
            "/pt/plugins/sanic-ext/openapi/advanced.md",
            "/pt/plugins/sanic-ext/openapi/autodoc.md",
            "/pt/plugins/sanic-ext/openapi/security.md",
          ],
        },
        "/pt/plugins/sanic-ext/validation.md",
        "/pt/plugins/sanic-ext/configuration.md",
      ],
    },
    {
      title: "Testes da Sanic",
      sidebarDepth: 1,
      children: [
        "/pt/plugins/sanic-testing/getting-started.md",
        "/pt/plugins/sanic-testing/clients.md",
      ],
    },
    {
      title: "Organização",
      sidebarDepth: 1,
      children: ["/pt/org/policies.md", "/pt/org/scope.md"],
    },
  ],

  "/pt/org/": [
    {
      title: "Guia de Usuário",
      sidebarDepth: 1,
      children: [
        ["/pt/guide/", "Geral"],
        ["/pt/guide/basics/app.md", "Básicos"],
        ["/pt/guide/advanced/class-based-views.md", "Avançado"],
        ["/pt/guide/best-practices/blueprints.md", "Boas Práticas"],
        ["/pt/guide/deployment/configuration.md", "Executando e Desdobrando"],
        ["/pt/guide/how-to/toc.md", "Como..."],
      ],
    },
    {
      title: "Plugins",
      sidebarDepth: 1,
      children: [
        ["/pt/plugins/sanic-ext/getting-started.md", "Extensões de Sanic"],
        ["/pt/plugins/sanic-testing/getting-started.md", "Testes da Sanic"],
      ],
    },
    {
      title: "Organização",
      sidebarDepth: 1,
      collapsable: false,
      children: ["/pt/org/policies.md", "/pt/org/scope.md"],
    },
  ],
};
