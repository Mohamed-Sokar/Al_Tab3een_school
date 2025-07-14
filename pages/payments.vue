<template>
  <BaseFadeTransition>
    <NuxtPage />
  </BaseFadeTransition>
</template>

<script setup lang="ts">
useHead({ title: "المدفوعات الشهرية" });
useSeoMeta({
  title: "المدفوعات الشهرية",
  description: "متابعة وتحليل جميع المدفوعات الشهرية والفواتير الخاصة بالمدرسة",
  ogTitle: "المدفوعات",
  ogDescription: "إدارة المدفوعات الشهرية",
  ogImage: "/seo/payments.png",
  twitterCard: "summary",
});
</script>

<style scoped></style>
