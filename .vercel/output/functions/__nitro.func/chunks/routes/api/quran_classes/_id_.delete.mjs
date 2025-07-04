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

const _id__delete = defineEventHandler(async (event) => {
  var _a;
  const client = await serverSupabaseClient(event);
  const id = (_a = event.context.params) == null ? void 0 : _a.id;
  const { data, error } = await client.from("quran_classes").delete().eq("id", id != null ? id : "").select();
  if (error) {
    throw createError({ statusCode: 500, message: error.message });
  }
  return data;
});

export { _id__delete as default };
//# sourceMappingURL=_id_.delete.mjs.map
