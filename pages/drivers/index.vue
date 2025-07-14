<template>
  <div>
    <BaseHeader title="السائقين" description="إدارة السائقين">
      <template #actions>
        <UButton
          icon="heroicons-plus-circle-20-solid"
          size="md"
          color="secondary"
          class="bg-blue-600 px-3 py-2 font-bold"
          variant="solid"
          to="/drivers/add"
          >إضافة سائق جديد</UButton
        >
      </template>
    </BaseHeader>

    <div
      class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 mt-5"
    >
      <DriversCard
        v-for="driver in driversStore.driversWithStudentsCount"
        :key="driver.id"
        :driver="driver"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({ title: "السائقون" });
useSeoMeta({
  title: "السائقون",
  description: "إدارة السائقين وتوزيعهم على الطلاب",
  ogTitle: "إدارة السائقين",
  ogDescription: "تحكم كامل في معلومات السائقين والرحلات",
  ogImage: "/seo/drivers.png",
  twitterCard: "summary",
});
import { useDriversStore } from "@/stores/drivers";
const driversStore = useDriversStore();
</script>

<style scoped></style>
