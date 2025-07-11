<template>
  <div :class="wrraperLinksClasses">
    <NuxtLink
      v-for="link in links"
      :key="link.to"
      :to="link.to"
      class="flex items-center justify-center gap-2 w-full h-full p-2 rounded-md hover:bg-secondary hover:dark:bg-secondary-600 hover:text-white"
      :class="{
        'bg-secondary dark:bg-secondary-600 text-white font-bold':
          link.to === route.path,
      }"
    >
      <span>
        {{ link.label }}
      </span>
      <UIcon :name="link.icon" class="text-lg" />
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import type { LinkItem } from "~/types";
const props = defineProps<{
  links: LinkItem[];
}>();
const route = useRoute();
const wrraperLinksClasses = computed(() => {
  return `text-sm grid grid-cols-${props.links.length} gap-1 p-1 bg-secondary-50 border border-secondary-200 dark:bg-secondary-950 dark:border-secondary-500 rounded-sm mt-2 mb-8 `;
});
</script>

<style scoped></style>
