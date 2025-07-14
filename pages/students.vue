<template>
  <BaseFadeTransition>
    <NuxtPage />
  </BaseFadeTransition>
</template>

<script setup lang="ts">
useHead({
  title: "الطلاب",
  meta: [
    {
      name: "description",
      content: "شاهد معلومات الطلاب، وقم بإدارتهم بسهولة من خلال لوحة التحكم.",
    },
    {
      name: "keywords",
      content: "إدارة الطلاب، طلاب، معلومات، المدرسة، النظام",
    },
  ],
});
useSeoMeta({
  title: "الطلاب",
  description: "إدارة بيانات الطلاب، الصفوف، التقارير، والمدفوعات",
  ogTitle: "إدارة الطلاب",
  ogDescription: "إضافة وتحديث بيانات الطلاب ومتابعة أدائهم",
  ogImage: "/seo/students.png",
  twitterCard: "summary",
});
</script>

<style scoped></style>
