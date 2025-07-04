<template>
  <div>
    <BaseHeader title="خطط الطلاب" description="إدارة خطط الطلاب الشهرية">
      <template #actions>
        <UButton
          icon="heroicons-plus-circle-20-solid"
          size="lg"
          color="secondary"
          class="bg-blue-600 px-3 py-2 font-bold"
          variant="solid"
          to="/plans/add"
          >إضافة خطة جديدة</UButton
        >
      </template>
      <UBadge color="neutral" />
    </BaseHeader>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
