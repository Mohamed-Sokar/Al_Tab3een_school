<script setup lang="ts">
import { useLevelsStore } from "@/stores/levels";
import { useStudentStore } from "@/stores/students";

const route = useRoute();
// definePageMeta({
//   // middleware: ["check-setup"],
// });
watch(
  route,
  () => {
    if (route.query.alert) {
      useAppToast().toastError({
        title: decodeURIComponent(route.query.alert as string),
      });
    }
  },
  { immediate: true }
);

useHead({ title: "المراحل الدراسية" });
useSeoMeta({
  title: "المراحل الدراسية",
  description: "إدارة وتحديد المراحل الدراسية للطلاب",
  ogTitle: "المراحل الدراسية",
  ogDescription: "نظام لإدارة مستويات الدراسة حسب الصفوف",
  ogImage: "/seo/levels.png",
  twitterCard: "summary",
});

const levelsStore = useLevelsStore();
// const studentsStore = useStudentStore();

// const levelsWithStudentsCount = computed(() => {
//   return levelsStore.levelsData.map((level) => {
//     const count = studentsStore.studentsData.filter(
//       (s) => s.level === level.title
//     ).length;
//     return { ...level, studentsCount: count };
//   });
// });
</script>

<template>
  <div>
    <BaseHeader
      title="المستويات"
      description="إدارة المراحل التعليمية والصفوف الدراسية"
    >
      <template #actions>
        <UButton
          icon="heroicons-plus-circle-20-solid"
          size="md"
          color="secondary"
          class="bg-blue-600 px-3 py-2 font-bold"
          variant="solid"
          to="/levels/add"
          >إضافة مستوى جديد</UButton
        >
      </template>
    </BaseHeader>
    <div>
      <div class="grid lg:grid-cols-3 gap-4 mt-5">
        <LevelsCard
          v-if="levelsStore.levelsData"
          v-for="level in levelsStore.levelsData"
          :key="level.id"
          :level="level"
        />
        <div v-else>لا يوجد مستويات</div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
