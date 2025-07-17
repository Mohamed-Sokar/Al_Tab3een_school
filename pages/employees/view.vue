<template>
  <div>
    <BaseHeader
      title="المعلمون"
      description="إدارة بيانات المعلمون والمعلومات الأكاديمية"
    >
      <template #actions>
        <UButton
          icon="heroicons-plus-circle-20-solid"
          size="lg"
          color="secondary"
          class="bg-blue-600 px-3 py-2 font-bold"
          variant="solid"
          :to="{ name: 'employees-add' }"
          >إضافة معلم</UButton
        >
      </template>
    </BaseHeader>

    <BaseTabs :links="links" />

    <BaseFadeTransition>
      <NuxtPage />
    </BaseFadeTransition>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();

const links = [
  {
    label: "المعلمون",
    icon: "i-lucide-user",
    to: "/employees/view",
  },
  {
    label: "المخالفات الإدارية",
    icon: "i-heroicons-exclamation-triangle",
    to: "/employees/view/behavioral-issues",
  },
  {
    label: "القروض",
    icon: "i-heroicons-banknotes",
    to: "/employees/view/loans",
  },
  {
    label: "الحضور والغياب",
    icon: "i-lucide-user-minus",
    to: "/employees/view/absence",
  },
  {
    label: "الزيارات الإشرافية",
    icon: "i-heroicons-calendar-days",
    to: "/employees/view/supervisory-visits",
  },
];

const wrraperLinksClasses = computed(() => {
  return `text-sm grid grid-cols-5 gap-1 p-1 bg-secondary-50 border border-secondary-200 dark:bg-secondary-950 dark:border-secondary-500 rounded-sm mt-2 mb-8 `;
});
</script>

<style scoped></style>
