import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Speed Insights Documentation",
  description: "Getting started with Vercel Speed Insights",
  ignoreDeadLinks: true,
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Speed Insights', link: '/speed-insights' }
    ],
    sidebar: [
      {
        text: 'Getting Started',
        items: [
          { text: 'Speed Insights', link: '/speed-insights' }
        ]
      }
    ]
  }
})
