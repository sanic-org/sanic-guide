module.exports = [
  {
    text: "Página Inicial",
    link: "/pt/",
  },
  // { text: "Anúncios", link: "/announcements" },
  {
    text: "Documentação",
    items: [
      {
        text: "Guia de Usuário",
        items: [
          {
            text: "Geral",
            link: "/pt/guide/getting-started.md",
          },
          {
            text: "Básicos",
            link: "/pt/guide/basics/app.md",
          },
          {
            text: "Avançados",
            link: "/pt/guide/advanced/class-based-views.md",
          },
          {
            text: "Boas Práticas",
            link: "/pt/guide/best-practices/blueprints.md",
          },
          {
            text: "Executando e Desdobrando",
            link: "/pt/guide/deployment/configuration.md",
          },
          {
            text: "Como...",
            link: "/pt/guide/how-to/toc.md",
          },
          {
            text: "Notas do Último Lançamento",
            link: "/pt/guide/release-notes/v21.12.md",
          },
        ],
      },
      {
        text: "Plugins Oficiais",
        items: [
          {
            text: "Extensões de Sanic",
            link: "/pt/plugins/sanic-ext/getting-started.md",
          },
          {
            text: "Testando a Sanic",
            link: "/pt/plugins/sanic-testing/getting-started.md",
          },
        ],
      },
      {
        text: "Documentação da API",
        items: [
          {
            text: "Ver a Documentação da API",
            link: "https://sanic.readthedocs.io",
          },
        ],
      },
      {
        text: "Documentação da Organização",
        items: [
          {
            text: "Políticas",
            link: "/pt/org/policies.md",
          },
          {
            text: "D.O.M.Í.N.I.O",
            link: "/pt/org/scope.md",
          },
        ],
      },
    ],
  },
  {
    text: "Comunidade",
    items: [
      {
        text: "Fóruns",
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
        text: "Patrocínio",
        link: "https://opencollective.com/sanic-org/",
      },
    ],
  },
];
