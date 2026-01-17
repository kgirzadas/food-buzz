// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  modules: [
    '@nuxt/ui',
    '@vite-pwa/nuxt'
  ],

  // Static site generation for GitHub Pages
  ssr: false,

  app: {
    // Base URL for GitHub Pages - will be /food-buzz/
    baseURL: process.env.NODE_ENV === 'production' ? '/food-buzz/' : '/',
    buildAssetsDir: 'assets',
    head: {
      title: 'Maisto Dienoraštis',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Maisto produktų ir pilvo simptomų stebėjimo aplikacija' },
        { name: 'theme-color', content: '#4f46e5' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Maisto Dienoraštis',
      short_name: 'Maisto',
      description: 'Maisto produktų ir pilvo simptomų stebėjimo aplikacija',
      theme_color: '#4f46e5',
      background_color: '#ffffff',
      display: 'standalone',
      orientation: 'portrait',
      scope: process.env.NODE_ENV === 'production' ? '/food-buzz/' : '/',
      start_url: process.env.NODE_ENV === 'production' ? '/food-buzz/' : '/',
      icons: [
        {
          src: 'icons/icon-72x72.png',
          sizes: '72x72',
          type: 'image/png'
        },
        {
          src: 'icons/icon-96x96.png',
          sizes: '96x96',
          type: 'image/png'
        },
        {
          src: 'icons/icon-128x128.png',
          sizes: '128x128',
          type: 'image/png'
        },
        {
          src: 'icons/icon-144x144.png',
          sizes: '144x144',
          type: 'image/png'
        },
        {
          src: 'icons/icon-152x152.png',
          sizes: '152x152',
          type: 'image/png'
        },
        {
          src: 'icons/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: 'icons/icon-384x384.png',
          sizes: '384x384',
          type: 'image/png'
        },
        {
          src: 'icons/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico}']
    },
    client: {
      installPrompt: true
    },
    devOptions: {
      enabled: true,
      type: 'module'
    }
  }
})
