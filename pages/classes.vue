<template>
  <BaseFadeTransition>
    <NuxtPage />
  </BaseFadeTransition>
</template>

<script setup lang="ts">
const route = useRoute();

definePageMeta({
  middleware: ["check-setup"],
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
