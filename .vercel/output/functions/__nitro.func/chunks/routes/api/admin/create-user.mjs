import { d as defineEventHandler, r as readBody } from '../../../nitro/nitro.mjs';
import { createClient } from '@supabase/supabase-js';
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

const createUser = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE
  );
  const { data, error } = await supabase.auth.admin.createUser({
    email: body.email,
    password: body.password,
    user_metadata: {
      role: body.role || "manager"
    }
  });
  if (error) {
    console.error("Error creating user:", error);
    return { error };
  }
  if (data.user) {
    const { data: profileData, error: profileError } = await supabase.from("profiles").insert({
      id: data.user.id,
      full_name: "\u0645\u062F\u064A\u0631 \u062C\u062F\u064A\u062F",
      role: "manager"
    });
    if (profileError) {
      console.error("Error creating user in profile Table:", profileError);
      return { profileError };
    }
  }
  return { user: data.user };
});

export { createUser as default };
//# sourceMappingURL=create-user.mjs.map
