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
      <LevelsCard v-for="level in levels" :key="level.id" :level="level" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { levels } from "~/constants";
</script>

<style scoped></style>
