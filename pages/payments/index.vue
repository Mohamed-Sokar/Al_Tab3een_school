<template>
  <div>
    <BaseHeader title="المصروفات" description="إدارة المصروفات الشهرية للطلاب">
      <template #actions>
        <UButton
          icon="heroicons-plus-circle-20-solid"
          size="lg"
          color="secondary"
          class="bg-blue-600 px-3 py-2 font-bold"
          variant="solid"
          to="/payments/add"
          >إضافة دفعة جديدة</UButton
        >
      </template>
      <UBadge color="neutral" />
    </BaseHeader>

    <PaymentMain />
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
