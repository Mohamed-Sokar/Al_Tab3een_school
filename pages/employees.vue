<template>
  <BaseFadeTransition>
    <NuxtPage />
  </BaseFadeTransition>
</template>

<script setup lang="ts">
const route = useRoute();

definePageMeta({
  // middleware: ["check-setup"],
});
watch(
  route,
  () => {
    if (route.query.alert) {
      useAppToast().toastError({
        title: decodeURIComponent(route.query.alert as string),
      });
    }
  },
  { immediate: true }
);

useHead({
  title: "المعلمون",
  meta: [
    {
      name: "description",
      content:
        "شاهد معلومات المعلمين، وقم بإدارتهم بسهولة من خلال لوحة التحكم.",
    },
    {
      name: "keywords",
      content: "إدارة المعلمين، معلمين، معلومات، المدرسة، النظام",
    },
  ],
});

useSeoMeta({
  title: "المعلمون",
  description:
    "إدارة المعلمين والمراحل الدراسية المرتبطين بها و المخالفات الإدارية والسلف والحضور والغياب",
  ogTitle: "إدارة المعلمين",
  ogDescription: "أضف أو عدل بيانات المعلمين والغياب والسلوكيات",
  ogImage: "/seo/teachers.png",
  twitterCard: "summary",
});
</script>

<style scoped></style>
