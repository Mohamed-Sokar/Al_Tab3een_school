<template>
  <div>
    <BaseHeader title="التقارير" description="تقارير شاملة وإحصائيات مفصلة">
    </BaseHeader>
  </div>
</template>

<script setup lang="ts">
useHead({ title: "التقارير" });
useSeoMeta({
  title: "التقارير",
  description: "توليد تقارير عن أداء الطلاب والمعلمين",
  ogTitle: "تقارير المدرسة",
  ogDescription: "لوحة تحكم تقارير الأداء والحضور",
  ogImage: "/seo/reports.png",
  twitterCard: "summary_large_image",
});
</script>

<style scoped></style>
