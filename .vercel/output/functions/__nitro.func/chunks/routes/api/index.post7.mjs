import { d as defineEventHandler, r as readBody, c as createError } from '../../nitro/nitro.mjs';
import { s as serverSupabaseClient } from '../../_/serverSupabaseClient.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@iconify/utils';
import 'consola';
import 'node:module';
import '@supabase/ssr';

const index_post = defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event);
  const body = await readBody(event);
  const { data, error } = await client.from("teachers").insert(body).select();
  if (error) {
    throw createError({ statusCode: 500, message: error.message });
  }
  return data;
});

export { index_post as default };
//# sourceMappingURL=index.post7.mjs.map
