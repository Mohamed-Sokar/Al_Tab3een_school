import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE!
  );

  const { data, error } = await supabase.auth.admin.createUser({
    email: body.email,
    password: body.password,
    user_metadata: {
      role: body.role || "manager",
    },
  });

  //   Check if error occurred during user creation
  if (error) {
    console.error("Error creating user:", error);
    return { error };
  }

  if (data.user) {
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: data.user.id,
        full_name: "مدير جديد",
        role: "manager",
      });

    if (profileError) {
      console.error("Error creating user in profile Table:", profileError);
      return { profileError };
    }
  }
  //   const { data, error } = await supabase.auth.admin.deleteUser(
  //     "f5b59119-55a2-4428-9b74-e105b311b20d"
  //   );

  return { user: data.user };
});
