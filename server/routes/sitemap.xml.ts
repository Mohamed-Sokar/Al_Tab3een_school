// server/routes/sitemap.xml.ts
export default defineEventHandler(() => {
  return '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>http://localhost:3000/test</loc></url></urlset>';
});
