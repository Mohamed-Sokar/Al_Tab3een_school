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

    <div :class="wrraperLinksClasses">
      <NuxtLink
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        class="w-full h-full text-center p-2 rounded-md hover:bg-secondary hover:dark:bg-secondary-600 hover:text-white hover:font-bold"
        :class="{
          'bg-secondary dark:bg-secondary-600 text-white font-bold':
            link.to === route.path,
        }"
      >
        {{ link.label }}
      </NuxtLink>
    </div>
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
    label: "القروض",
    icon: "i-lucide-user",
    to: "/teachers/view/loans",
  },
  {
    label: "المخالفات الإدارية",
    icon: "i-lucide-user",
    to: "/teachers/view/behavioral_issues",
  },
  {
    label: "الحضور والغياب",
    icon: "i-lucide-user",
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
