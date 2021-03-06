import colors from 'vuetify/es5/util/colors'

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',
  fallback: true,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - pos-market',
    title: 'pos-market',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [{
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        hid: 'description',
        name: 'description',
        content: ''
      }
    ],
    link: [{
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico'
    }]
  },
  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    "~/assets/style.css"
  ],
  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    "~/plugins/vue-randomcolor.js",
    "~/plugins/vue-lodash.js",
    "~/plugins/vue-particles.js",
    "~/plugins/vue-the-mask.js",
    "~/plugins/vue-sweetalert2.js",
    "~/plugins/vue-notification.js"
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,
  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    '@nuxtjs/netlify-files',
    '@nuxtjs/moment'
  ],
  netlifyFiles: {
    netlifyToml: {
      //  build: {
      //    environment: {
      //      FOO: process.env.FOO
      //    }
      //  },
      //  headers: [{
      //    for: '/*',
      //    values: {
      //      'X-XSS-Protection': '1; mode=block'
      //    }
      //  }],
      redirects: [{
        from: '/*',
        to: '/index.html',
        status: 302
      }]
    }
  },
  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/recaptcha',
  ],
  recaptcha: {
    /* reCAPTCHA options */
    siteKey: "6Ldd-cYaAAAAAIingHQ0q6cVD-EhkeeslAJ2s_PK",
    version: 2,
    size: 'normal'
  },
  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    baseURL: 'http://localhost:8080',

  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {}
}
