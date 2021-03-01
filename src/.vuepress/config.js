const path = require("path");

/*
----------------------------------------------------------------------------------------------------------------
    please add language base config here, after that, please add it to locales.
    请在此处声明语言基础配置, 声明完成之后, 请将其添加到 locales 配置中。
----------------------------------------------------------------------------------------------------------------
*/

let en = {
    lang: 'en-US',
    title: 'Sanic Framework',
    description: 'Sanic is a Python 3.6+ web server and web framework that\'s written to go fast. It allows the usage of the async/await syntax added in Python 3.5, which makes your code non-blocking and speedy.'
};

let zh = {
    lang: 'zh-hans',
    title: 'Sanic 框架',
    description: 'Sanic 是 Python 3.6+ Web 服务器和 Web 框架，旨在提高性能。它允许使用 Python 3.5 中添加的 `async`/`await`等待语法，这使得您的代码有效的避免阻塞从而达到提升响应速度的目的。'
};


/*
----------------------------------------------------------------------------------------------------------------
    please add language detailed config here, after that, please add it to site_config.themeConfig.locales .
    请在此处声明语言基础配置, 声明完成之后, 请将其添加到 site_config.themeConfig.locales 配置中。
----------------------------------------------------------------------------------------------------------------
*/


let en_locales = {
    selectText: 'Languages',
    label: 'English',
    editLinkText: 'Edit this page on GitHub',
    algolia: {},
    nav: [
        {
            text: "Home",
            link: "/"
        },
        // { text: "Announcements", link: "/announcements" },
        {
            text: "Docs",
            items: [
                {
                    text: "User Guide",
                    items: [
                        {
                            text: "General",
                            link: "/guide/getting-started.md"
                        },
                        {
                            text: "Basics",
                            link: "/guide/basics/app.md"
                        },
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
                        {
                            text: "Legacy Docs",
                            link: "https://sanic.readthedocs.io"
                        },
                    ],
                },
            ],
        },
        {
            text: "Community",
            items: [
                {
                    text: "Forums",
                    link: "https://community.sanicframework.org/"
                },
                {
                    text: "Gitter",
                    link: "https://gitter.im/sanic-python/Lobby",
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
    sidebar: {
        "/guide/": [
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
        ]
    }
};

let zh_locales = {
    selectText: '选择语言',
    label: '简体中文',
    editLinkText: '在 GitHub 上编辑此页',

    algolia: {},
    nav: [
        {
            text: "主页",
            link: "/zh/"
        },
        // { text: "Announcements", link: "/announcements" },
        {
            text: "文档",
            items: [
                {
                    text: "用户指南",
                    items: [
                        {
                            text: "介绍",
                            link: "/zh/guide/getting-started.md"
                        },
                        {
                            text: "入门",
                            link: "/zh/guide/basics/app.md"
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
                    ],
                },
                {
                    text: "API 文档",
                    items: [
                        {
                            text: "Legacy Docs",
                            link: "https://sanic.readthedocs.io"
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
                    link: "https://community.sanicframework.org/"
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
    ],
    sidebar: {
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
                    // "/zh/guide/how-to/db.md",
                    // "/zh/guide/how-to/decorators.md",
                    // "/zh/guide/how-to/validation.md",
                    // "/zh/guide/how-to/authentication.md",
                    // "/zh/guide/how-to/cors.md",
                    // "/zh/guide/how-to/csrf.md",
                    // "/zh/guide/how-to/autodiscovery.md",
                    // "/zh/guide/how-to/serialization.md",
                    // "/zh/guide/how-to/task-queue.md",
                    // "/zh/guide/how-to/websocket-feed.md",
                    // "/zh/guide/how-to/server-sent-events.md",
                ],
            },
        ],

    }
};

/*
----------------------------------------------------------------------------------------------------------------
    here is site_config
    站点配置
----------------------------------------------------------------------------------------------------------------
*/

let site_config = {

    locales: {
        '/': en,
        '/zh/': zh
    },

    markdown: {
        anchor: {
            permalink: true
        },
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
    ],

    configureWebpack: {
        resolve: {
            alias: {
                "@assets": path.resolve(__dirname, "../assets"),
            },
        },
    },

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
        logo: "https://raw.githubusercontent.com/huge-success/sanic-assets/master/png/sanic-framework-logo-simple-400x97.png",
        locales: {
            '/': en_locales,
            '/zh/': zh_locales
        }
    },
};

module.exports = site_config;


