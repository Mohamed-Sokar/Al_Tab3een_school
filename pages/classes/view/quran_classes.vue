<template>
  <div class="grid lg:grid-cols-3 gap-4 mt-5">
    <ClassesCard
      v-for="_class in numberedClasses"
      :key="_class.id || Math.random()"
      :_class="_class"
    />
  </div>
</template>

<script setup lang="ts">
import { useQuranClassesStore } from "@/stores/quran_classes";
const quranClassesStore = useQuranClassesStore();
const numberedClasses = computed(() =>
  quranClassesStore.classesWithStudentsCount.map((_class, index) => ({
    ..._class,
    rowNumber: index + 1,
  }))
);
</script>

<style scoped></style>
