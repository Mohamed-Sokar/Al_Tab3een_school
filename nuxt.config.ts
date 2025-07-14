// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  app: {
    head: {
      meta: [{ name: "google-site-verification", content: "0d0189358504d035" }],
    },
  },
  modules: [
    "@nuxt/ui",
    "@nuxtjs/supabase",
    "@pinia/nuxt",
    "nuxt-charts",
    "@nuxtjs/sitemap",
    "@nuxtjs/seo",
  ],
  // sitemap: { xsl: false },
  site: {
    url: "https://altab3een-schoole.netlify.app",
    name: "مدرسة التابعين الشرعية",
    enabled: true,
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
