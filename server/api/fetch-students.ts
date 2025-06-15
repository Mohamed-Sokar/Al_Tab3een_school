import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async () => {
  //   const body = await readBody(event);

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
  );

  const { data, error } = await supabase.from("students").select();

  if (error) {
    console.error("Error fetching students:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: "Failed to fetch students",
    });
  }

  return { data };
});
