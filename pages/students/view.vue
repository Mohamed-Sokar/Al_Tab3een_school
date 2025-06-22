<script setup lang="ts">
const route = useRoute();
const isOpen = ref<Boolean>(false);

const links = [
  {
    label: "جدول الطلاب",
    icon: "i-lucide-user",
    to: "/students/view/students_table",
  },
  {
    label: "المخالفات السلوكية",
    icon: "i-lucide-user",
    to: "/students/view/behavioral_issues",
  },
  {
    label: "كشف الدرجات",
    icon: "i-lucide-user",
    to: "/students/view/grades",
  },
];
// onMounted(() => {
//   watch(
//     route,
//     () => {
//       route.path === "/students/view"
//         ? navigateTo(`/students/view/students_table`)
//         : navigateTo(route.path);
//     },
//     { immediate: true }
//   );
// });
</script>

<template>
  <div>
    <BaseHeader
      title="الطلاب"
      description="إدارة بيانات الطلاب والمعلومات الأكاديمية"
    >
      <template #actions>
        <UButton
          active
          color="secondary"
          variant="outline"
          active-color="secondary"
          size="lg"
          active-variant="solid"
          icon="heroicons-plus-circle-20-solid"
          class="bg-secondary-600 font-bold"
          to="/students/add"
          @click="isOpen = !isOpen"
          >إضافة طالب</UButton
        >
      </template>
    </BaseHeader>

    <div
      class="text-sm grid grid-cols-3 gap-1 p-1 bg-secondary-50 border border-secondary-200 dark:bg-secondary-950 dark:border-secondary-500 mt-2 mb-8 rounded-sm"
    >
      <NuxtLink
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        class="w-full h-full rounded-md text-center p-2 hover:bg-secondary hover:dark:bg-secondary-600 hover:text-white hover:font-bold"
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

<style scoped></style>
