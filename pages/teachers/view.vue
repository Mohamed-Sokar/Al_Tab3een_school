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
          :to="{ name: 'teachers-add' }"
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
    to: "/teachers/view/teachers_table",
  },
  {
    label: "المخالفات الإدارية",
    icon: "i-heroicons-exclamation-triangle",
    to: "/teachers/view/behavioral_issues",
  },
  {
    label: "القروض",
    icon: "i-heroicons-banknotes",
    to: "/teachers/view/loans",
  },
  {
    label: "الحضور والغياب",
    icon: "i-lucide-user-minus",
    to: "/teachers/view/absence",
  },
];

const wrraperLinksClasses = computed(() => {
  return `text-sm grid grid-cols-4 gap-1 p-1 bg-secondary-50 border border-secondary-200 dark:bg-secondary-950 dark:border-secondary-500 rounded-sm mt-2 mb-8 `;
});

onMounted(() => {
  watch(
    route,
    () => {
      route.path === "/teachers/view"
        ? navigateTo("/teachers/view/teachers_table")
        : navigateTo(route.path);
    },
    { immediate: true }
  );
});
</script>

<style scoped></style>
