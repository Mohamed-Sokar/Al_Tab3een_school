<template>
  <NuxtLink class="hover:translate-y-1 transition-all" :to="to">
    <u-card class="relative pb-15 h-full">
      <div
        class="absolute -top-1.5 right-[2.5%] w-[95%] h-1.5 rounded-tl-full rounded-tr-full bg-gradient-to-l from-blue-800 to-purple-500 dark:from-gray-900 dark:to-gray-800"
      ></div>

      <div class="flex justify-between">
        <div class="flex gap-2 items-center">
          <u-icon name="i-lucide-users" size="lg" />
          <div>
            {{ props.title }}
          </div>
        </div>
        <div class="font-bold text-lg">{{ value }}</div>
      </div>
    </u-card>
  </NuxtLink>
</template>

<script setup lang="ts">
const props = defineProps<{
  to: string;
  title: string;
  value: number | string;
}>();
</script>

<style scoped></style>
