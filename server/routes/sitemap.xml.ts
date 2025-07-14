// import { defineEventHandler } from "h3";
// // import { useRuntimeConfig } from "#imports";

// export default defineEventHandler(async (event) => {
//   // (1) Fetch dynamic routes from your API
//   const dynamicRoutes = await $fetch("/api/sitemap"); // Your existing dynamic route logic

//   // (2) Get Nuxt's auto-generated static routes (no need to redefine them)
//   //   const { sitemap } = useRuntimeConfig();
//   //   const nuxtStaticRoutes = sitemap?.routes || [];

//   // (3) Combine them (avoid duplicates)
//   const allRoutes = [
//     // ...nuxtStaticRoutes,  // Auto-included static routes
//     ...dynamicRoutes, // Your dynamic routes
//   ];

//   // (4) Generate XML
//   let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
//   xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

//   for (const route of allRoutes) {
//     xml += "  <url>\n";
//     xml += `    <loc>http://localhost:3000${route.loc}</loc>\n`;
//     xml += `    <lastmod>${
//       route.lastmod || new Date().toISOString()
//     }</lastmod>\n`;
//     xml += "  </url>\n";
//   }

//   xml += "</urlset>";

//   // Set XML header
//   event.node.res.setHeader("content-type", "text/xml");
//   return xml;
// });

// server/routes/sitemap.xml.ts
export default defineEventHandler(async (event) => {
  // Fetch your dynamic URLs here
  const urls = [
    { url: "/", lastmod: "2024-12-10" },
    { url: "/about", lastmod: "2024-12-15" },
  ];

  setResponseHeader(event, "content-type", "application/xml");
  return `<?xml version="1.0" encoding="UTF-8"?>
 <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
   ${urls
     .map(
       (page) => `
<url>
<loc>https://mysite.com${page.url}</loc>
<lastmod>${page.lastmod}</lastmod>
</url>
`
     )
     .join("\n")}
</urlset>`;
});
