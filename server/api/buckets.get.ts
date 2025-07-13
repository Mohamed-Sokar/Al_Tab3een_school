import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async () => {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // Service role key
  );

  const { data, error } = await supabase.storage.listBuckets();

  if (error) return { error: error.message };

  return { buckets: data };
});
