<template>
  <page-header title="الإعدادات" description="تخصيص وإدارة إعدادات النظام">
  </page-header>
  <div class="grid grid-cols-6 gap-8 mt-5">
    <UNavigationMenu orientation="vertical" :items="links" class="col-span-2" />
    <div class="col-span-4">
      <NuxtPage />
    </div>
  </div>
</template>

<script setup lang="ts">
const links = [
  {
    label: "الإعدادات",
    icon: "i-lucide-cog",
    to: "/settings",
  },
  {
    label: "الملف الشخصي",
    icon: "i-lucide-user",
    to: "/settings/profile",
  },
  {
    label: "الصورة الشخصية",
    icon: "i-lucide-image",
    to: "/settings/avatar",
  },
];
</script>

<style scoped></style>
