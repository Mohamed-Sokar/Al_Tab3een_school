import { d as defineEventHandler, c as createError } from '../../../nitro/nitro.mjs';
import { s as serverSupabaseClient } from '../../../_/serverSupabaseClient.mjs';
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

const _id__get = defineEventHandler(async (event) => {
  var _a;
  const client = await serverSupabaseClient(event);
  const id = (_a = event.context.params) == null ? void 0 : _a.id;
  const { data, error } = await client.from("payments").select().eq("id", id != null ? id : "");
  if (error) {
    console.error("Error fetching payment", error.message);
    throw createError({ statusCode: 500, message: error.message });
  }
  return data;
});

export { _id__get as default };
//# sourceMappingURL=_id_.get.mjs.map
