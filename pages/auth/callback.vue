<script setup>
const route = useRoute();
const client = useSupabaseClient();

onMounted(async () => {
  await client.auth.getSession();
  navigateTo("/");
});

definePageMeta({
  layout: "auth",
});
// const user = useSupabaseUser();
// watch(user, () => {
//   if (user.value) {
//     return navigateTo("/");
//   }
// });
</script>

<template>
  <UCard class="max-w-3xl mx-auto mt-20">
    <p class="font-bold text-3xl">جاري التحقق من تسجيل الدخول...</p>
  </UCard>
</template>
