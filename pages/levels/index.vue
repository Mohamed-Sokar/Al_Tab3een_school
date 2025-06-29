<script setup lang="ts">
import { useLevelsStore } from "@/stores/levels";
import { useStudentStore } from "@/stores/students";
const levelsStore = useLevelsStore();
const studentsStore = useStudentStore();

const levelsWithStudentsCount = computed(() => {
  return levelsStore.levelsData.map((level) => {
    const count = studentsStore.studentsData.filter(
      (s) => s.level === level.title
    ).length;
    return { ...level, studentsCount: count };
  });
});
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
    <div class="grid lg:grid-cols-3 gap-4 mt-5">
      <LevelsCard
        v-for="level in levelsWithStudentsCount"
        :key="level.id"
        :level="level"
      />
    </div>
  </div>
</template>

<style scoped></style>
