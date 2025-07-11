<script setup lang="ts">
const isOpen = ref<Boolean>(false);

const links = [
  {
    label: "جدول الطلاب",
    icon: "i-lucide-user",
    to: "/students/view/students_table",
  },
  {
    label: "المخالفات السلوكية",
    icon: "i-heroicons-exclamation-triangle",
    to: "/students/view/behavioral_issues",
  },
  // {
  //   label: "كشف الدرجات",
  //   icon: "i-lucide-user",
  //   to: "/students/view/grades",
  // },
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

    <BaseTabs :links="links" />

    <BaseFadeTransition>
      <NuxtPage />
    </BaseFadeTransition>
  </div>
</template>

<style scoped></style>
