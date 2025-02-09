// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: 'src',
  modules: ['@pinia/nuxt'],
  css: ['~/assets/styles/main.scss'],
  compatibilityDate: '2025-02-08',
})