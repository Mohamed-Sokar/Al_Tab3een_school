<template>
  <div>
    <BaseHeader
      title="الدرجات"
      description="إدارة درجات الطلاب الشهرية والنصفية والنهائية"
    >
    </BaseHeader>
  </div>
</template>

<script setup lang="ts">
useHead({ title: "الدرجات" });
useSeoMeta({
  title: "الدرجات",
  description: "توليد تقارير عن درجات الطلاب",
  ogTitle: "درجات الطلاب",
  ogDescription: "لوحة تحكم تقارير درجات الطلاب",
  ogImage: "/seo/grads.png",
  twitterCard: "summary_large_image",
});
</script>

<style scoped></style>
