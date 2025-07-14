<template>
  <div class="ps-13 lg:ps-0">
    <div
      class="flex flex-wrap gap-4 p-7 shadow-sm rounded-md bg-gradient-to-l from-blue-800 to-purple-500 dark:from-gray-900 dark:to-gray-800 items-center justify-between bg-blue-600 dark:bg-gray-800 text-white"
    >
      <div>
        <h1 class="text-2xl font-bold">
          {{ title }}
        </h1>
        <p class="text-sm text-blue-200 dark:text-gray-400">
          {{ description }}
        </p>
      </div>
      <div class="flex gap-1">
        <slot name="actions"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },
});
</script>

<style scoped></style>
