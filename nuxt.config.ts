// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  modules: [
    "@nuxt/ui",
    "@nuxtjs/supabase",
    "@pinia/nuxt",
    "nuxt-charts",
    "@nuxtjs/sitemap",
    "@nuxtjs/seo",
  ],

  site: {
    enabled: true,
    url: process.env.BASE_URL ?? "http://localhost:3000",
    name: "مدرسة التابعين الشرعية",
  },

  // plugins: ["~/plugins/axios"],
  css: [
    "~/assets/css/main.css",
    "nprogress/nprogress.css",
    "@/assets/css/nprogress-custom.css",
  ],
  devtools: { enabled: true },
  supabase: {
    redirect: true,
  },
  ssr: true,
  nitro: {
    preset: "netlify",
  },
  runtimeConfig: {
    public: {
      baseUrl: process.env.BASE_URL ?? "http://localhost:3000",
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    },
  },
});
