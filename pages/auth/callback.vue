<script setup>
definePageMeta({
  layout: "auth",
  middleware: "guest", // Only allow guests
});
</script>

<template>
  <UCard class="max-w-3xl mx-auto mt-20">
    <p class="font-bold text-3xl">جاري التحقق من تسجيل الدخول...</p>
  </UCard>
</template>
