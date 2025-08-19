// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  sitemap: { xsl: false },
  routeRules: {
    "/sitemap.xml": {
      cors: true,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    },
  },
  app: {
    head: {
      // google-site-verification=C-UKtSnT0hK7aUzO337wOFBNWVZoqi-DRR5ep1wSOQM
      // <meta name="google-site-verification" content="us9703idIc3jQXdDeC4boohCsP9hUNsfBVWcI__Uvt0" />
      meta: [
        {
          name: "google-site-verification",
          content: "us9703idIc3jQXdDeC4boohCsP9hUNsfBVWcI__Uvt0",
        },
      ],
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
    redirect: false,
  },
  ssr: true,
  // nitro: {
  //   preset: "netlify",
  // },
  runtimeConfig: {
    public: {
      baseUrl: process.env.BASE_URL ?? "http://localhost:3000",
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    },
  },
  build: {
    transpile: ["xlsx", "file-saver"], // Force transpilation
  },
  vite: {
    optimizeDeps: {
      include: ["xlsx", "file-saver"],
    },
  },
});
