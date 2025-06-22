// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  modules: ["@nuxt/ui", "@nuxtjs/supabase", "@pinia/nuxt", "nuxt-charts"],
  css: [
    "~/assets/css/main.css",
    "nprogress/nprogress.css",
    "@/assets/css/nprogress-custom.css",
  ],
  devtools: { enabled: true },
  supabase: {
    redirect: false,
  },
});
