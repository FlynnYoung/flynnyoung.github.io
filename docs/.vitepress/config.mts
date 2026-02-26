import { defineConfig } from 'vitepress'

// 导入主题的配置
import { blogTheme } from './blog-theme'

// 如果使用 GitHub/Gitee Pages 等公共平台部署
// 通常需要修改 base 路径，通常为“/仓库名/”
// 如果项目名已经为 name.github.io 域名，则不需要修改！
// const base = process.env.GITHUB_ACTIONS === 'true'
//   ? '/vitepress-blog-sugar-template/'
//   : '/'

// Vitepress 默认配置
// 详见文档：https://vitepress.dev/reference/site-config
export default defineConfig({
  // 继承博客主题(@sugarat/theme)
  extends: blogTheme,
  // base,
  srcDir: 'press',
  lang: 'zh-cn',
  title: "Flynn's",
  description: "Flynn的博客",
  // lastUpdated: true,
  // 详见：https://vitepress.dev/zh/reference/site-config#head
  head: [
    // 配置网站的图标（显示在浏览器的 tab 上）
    // ['link', { rel: 'icon', href: `${base}favicon.ico` }], // 修改了 base 这里也需要同步修改
    ['link', { rel: 'icon', href: '/favicon.ico' }]
  ],
  themeConfig: {
    // 展示 2,3 级标题在目录中
    outline: {
      level: [2, 3],
      label: '目录'
    },
    // 默认文案修改
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '相关文章',
    lastUpdatedText: '上次更新于',

    // 设置logo
    logo: '/logo.jpg',
    // editLink: {
    //   pattern:
    //     'https://github.com/ATQQ/sugar-blog/tree/master/packages/blogpress/:path',
    //   text: '去 GitHub 上编辑内容'
    // },
    nav: [
      { text: '生活随笔', link: '/life/' },
      {
        text: '编程笔记',
        items: [
          {text: '后端', link: '#'},
          {text: 'php', link: '/programming/php/'},
          {text: 'python', link: '/programming/python/'},
          {text: 'golang', link: '/programming/golang/'},
          {text: 'nodejs', link: '/programming/nodejs/'},
          // -------分割线 -------
          {text: '前端', link: '#'},
          {text: 'vue', link: '/programming/vue/'},
          {text: 'js', link: '/programming/js/'},
          {text: 'html', link: '/programming/html/'},
          {text: 'css', link: '/programming/css/'},
          // -------分割线 -------
          // {text: '原生端', link: '#'},
          // {text: 'swift', link: '/programming/vue/'},
          // {text: 'kotlin', link: '/programming/kotlin/'},
          // {text: 'Android', link: '/programming/android/'},
          // {text: 'IOS', link: '/programming/ios/'},
        ]
      },
      { text: '自媒体', link: '/we-media/' },
      { text: '命令大全', link: '/command/' },
      // {
      //   text: '自媒体',
      //   items: [
      //     { text: '文案技巧', link: '/we-media/copy/' },
      //     { text: '剪辑技巧', link: '/we-media/editing/' },
      //   ]
      // },
      { text: '关于', link: '/about/index' },
      // { text: '关于作者', link: 'https://sugarat.top/aboutme.html' }
    ],
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/flynnyoung'
      }
    ]
  }
})
