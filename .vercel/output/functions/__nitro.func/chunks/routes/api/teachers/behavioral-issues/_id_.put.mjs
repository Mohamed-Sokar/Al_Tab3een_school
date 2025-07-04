import { d as defineEventHandler, g as getRouterParam, r as readBody, c as createError } from '../../../../nitro/nitro.mjs';
import { s as serverSupabaseClient } from '../../../../_/serverSupabaseClient.mjs';
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

const _id__put = defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event);
  const id = getRouterParam(event, "id");
  const updates = await readBody(event);
  const { data, error } = await client.from("teachers_behavioral_issues").update(updates).eq("id", id != null ? id : "").select();
  if (error) {
    throw createError({ statusCode: 500, message: error.message });
  }
  return data;
});

export { _id__put as default };
//# sourceMappingURL=_id_.put.mjs.map
