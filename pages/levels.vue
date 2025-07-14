<template>
  <BaseFadeTransition>
    <NuxtPage />
  </BaseFadeTransition>
</template>

<script setup lang="ts">
useHead({ title: "المراحل الدراسية" });
useSeoMeta({
  title: "المراحل الدراسية",
  description: "إدارة وتحديد المراحل الدراسية للطلاب",
  ogTitle: "المراحل الدراسية",
  ogDescription: "نظام لإدارة مستويات الدراسة حسب الصفوف",
  ogImage: "/seo/levels.png",
  twitterCard: "summary",
});
</script>

<style scoped></style>
