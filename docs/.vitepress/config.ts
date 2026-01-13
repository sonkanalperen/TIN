import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Speed Insights Documentation',
  description: 'Getting started with Vercel Speed Insights',
  base: '/docs/',
  markdown: {
    breaks: true
  },
  themeConfig: {
    sidebar: [
      {
        text: 'Guides',
        items: [
          { text: 'Getting started', link: '/speed-insights/getting-started' }
        ]
      }
    ],
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Getting Started', link: '/speed-insights/getting-started' }
    ]
  },
  ignoreDeadLinks: true
})

