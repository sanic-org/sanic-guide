const path = require("path");
zh_locales = {
    lang: 'zh-CN',
    title: 'Sanic 框架',
    description: 'Sanic 是 Python 3.6+ Web 服务器和 Web 框架，旨在提高性能。它允许使用 Python 3.5 中添加的 `async`/`await`等待语法，这使得您的代码有效的避免阻塞从而达到提升响应速度的目的。'
};

zh_themeConfig_locales = {
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
    sidebar: {}
};

module.exports = {
    zh_locales,
    zh_themeConfig_locales
}
