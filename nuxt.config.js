module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'ruined-world',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Ruined world, gestion game is a free game around gestion of a base and an army and ressources production' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    ]
  },

  css: [
    'ribs-popup/dist/css/style.min.css',
    'ribs-flash-message/dist/css/style.css',
    '~assets/style.scss'
  ],

  modules: [
    '@nuxts/manifest',
    '@nuxts/icon',
  ],

  manifest: {
    name: 'Ruined World',
    short_name: "RWold",
    description: "Ruined World est un jeu de stratégie, reconstruisez votre base après la dévastation du monde et reignez dessus !",
    start_url: 'login',
    display: "standalone",
    lang: 'fr'
  },

  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */
  build: {
    extractCSS: true,
    transpile: ['ribs-api', 'ribs-flash-message', 'ribs-core'],
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
};
