import { defineEventHandler } from "h3";
import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event);

  const { data: students } = (await client.from("students").select("id")) as {
    data: { id: number | string }[];
  };

  const routes =
    students?.map((student) => ({
      loc: `/students/${student.id}/add_behavioral_issue`,
      lastmod: new Date().toISOString(),
    })) || [];

  // روابط أخرى ثابتة في الموقع
  const staticRoutes = [
    { loc: "/", lastmod: new Date().toISOString() },
    { loc: "/login", lastmod: new Date().toISOString() },
    { loc: "/students/add", lastmod: new Date().toISOString() },
    { loc: "/students/view/students_table", lastmod: new Date().toISOString() },
    {
      loc: "/students/view/behavioral_issues",
      lastmod: new Date().toISOString(),
    },
    { loc: "/teachers/view/teachers_table", lastmod: new Date().toISOString() },
    {
      loc: "/teachers/view/behavioral_issues",
      lastmod: new Date().toISOString(),
    },
    { loc: "/teachers/view/loans", lastmod: new Date().toISOString() },
    { loc: "/teachers/view/absence", lastmod: new Date().toISOString() },
    { loc: "/payments", lastmod: new Date().toISOString() },
    {
      loc: "/classes/view/academic_classes",
      lastmod: new Date().toISOString(),
    },
    {
      loc: "/classes/view/quran_classes",
      lastmod: new Date().toISOString(),
    },
    { loc: "/drivers", lastmod: new Date().toISOString() },
    { loc: "/levels", lastmod: new Date().toISOString() },
    { loc: "/plans", lastmod: new Date().toISOString() },
    { loc: "/settings/general", lastmod: new Date().toISOString() },
    { loc: "/settings/profile", lastmod: new Date().toISOString() },
    { loc: "/settings/avatar", lastmod: new Date().toISOString() },
    { loc: "/settings/change_email", lastmod: new Date().toISOString() },
    { loc: "/settings/change_password", lastmod: new Date().toISOString() },
  ];

  return [...staticRoutes, ...routes];
});

// server/routes/sitemap.xml.ts
// export default defineEventHandler(async (event) => {
//   // Fetch your dynamic URLs here
//   const urls = [
//     { url: "/", lastmod: "2024-12-10" },
//     { url: "/about", lastmod: "2024-12-15" },
//   ];

//   setResponseHeader(event, "content-type", "application/xml");
//   return `<?xml version="1.0" encoding="UTF-8"?>
//  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
//    ${urls
//      .map(
//        (page) => `
// <url>
// <loc>https://mysite.com${page.url}</loc>
// <lastmod>${page.lastmod}</lastmod>
// </url>
// `
//      )
//      .join("\n")}
// </urlset>`;
// });
