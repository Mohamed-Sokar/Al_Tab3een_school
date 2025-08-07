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
          :to="{ name: 'financial-payments-add' }"
          >إضافة دفعة جديدة</UButton
        >
      </template>
      <UBadge color="neutral" />
    </BaseHeader>

    <PaymentMain />
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
useHead({ title: "الصادر والوارد" });
useSeoMeta({
  title: "المدفوعات الشهرية",
  description: "متابعة وتحليل جميع المدفوعات الشهرية والفواتير الخاصة بالمدرسة",
  ogTitle: "المدفوعات",
  ogDescription: "إدارة المدفوعات الشهرية",
  ogImage: "/seo/payments.png",
  twitterCard: "summary",
});
onMounted(() => {
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
});
</script>

<style scoped></style>
