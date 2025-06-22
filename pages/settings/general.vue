<template>
  <UCard>
    <div class="flex justify-between">
      <div>
        <p>الوضع المظلم</p>
        <p class="text-muted text-sm">تفعيل الوضع المظلم للنظام</p>
      </div>
      <USwitch
        color="secondary"
        unchecked-icon="i-lucide-sun"
        checked-icon="i-lucide-moon"
        :default-value="isDark"
        v-model:model-value="isDark"
      />
    </div>
  </UCard>
</template>

<script setup lang="ts">
const colorMode = useColorMode();
const isDark = computed({
  get() {
    return colorMode.value === "dark";
  },
  set(_isDark) {
    colorMode.preference = _isDark ? "dark" : "light";
  },
});
</script>

<style scoped></style>
