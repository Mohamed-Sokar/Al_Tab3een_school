<template>
  <div class="flex">
    <!-- Sidebar -->
    <AppSidebar />

    <!-- Page content -->
    <div
      class="lg:w-[calc(100%-190px)] min-h-screen w-full bg-gray-50 dark:bg-gray-950"
    >
      <!-- <app-header class="h-10" /> -->
      <div class="w-full px-4 pt-4 pb-10">
        <main>
          <slot />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: "Al Tabeen School",
  htmlAttrs: {
    dir: "rtl",
    lang: "ar",
  },
});
const colorMode = useColorMode();
colorMode.preference = "system"; // Set default color mode
// const user = useSupabaseUser();

// watch(
//   user,
//   () => (colorMode.preference = user.value?.user_metadata?.color_mode),
//   { immediate: true }
// );
const supabase = useSupabaseClient();

// create user in both users and profiles tables
// const createUser = async () => {
//   const response = await $fetch("/api/admin/create-user", {
//     method: "POST",
//     body: {
//       email: "aboomarsokar@gmail.com",
//       password: "strongpassword123",
//       role: "manager", // or 'admin'
//     },
//   });
//   console.log(response);
// };

// const { success, response } = await $fetch("/api/send-telegram", {
//   method: "POST",
//   body: { message: "🔔 تمت إضافة طالب جديد في المدرسة!" },
// });
// console.log(success, response);

// await createUser();
</script>

<style>
body {
  font-family: "Cairo", sans-serif;
}
</style>
