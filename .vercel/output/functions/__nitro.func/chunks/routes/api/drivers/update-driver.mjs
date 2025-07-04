import { d as defineEventHandler, r as readBody, c as createError } from '../../../nitro/nitro.mjs';
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

const updateDriver = defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event);
  const body = await readBody(event);
  const { studentIds, driverId } = body;
  if (!Array.isArray(studentIds) || !driverId) {
    throw createError({
      statusCode: 400,
      message: "studentIds array and driverId are required"
    });
  }
  const { data, error } = await client.from("students").update({ driver_id: driverId }).in("id", studentIds);
  if (error) {
    throw createError({ statusCode: 500, message: error.message });
  }
  return { success: true, updated: data };
});

export { updateDriver as default };
//# sourceMappingURL=update-driver.mjs.map
