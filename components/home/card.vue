<script setup lang="ts">
const props = defineProps<{
  color: string;
  to: string;
  title: string;
  value: number | string;
  iconName: string;
  loading: boolean;
}>();
</script>

<template>
  <div>
    <div class="grid gap-2" v-if="loading">
      <USkeleton class="h-8 w-[350px]" />
      <USkeleton class="h-8 w-[350px]" />
      <USkeleton class="h-8 w-[350px]" />
    </div>
    <NuxtLink v-else class="hover:translate-y-1 transition-all" :to="to">
      <u-card
        class="h-full border-t-4"
        :class="`border-${color || 'secondary'}`"
      >
        <div class="flex justify-between mb-3">
          <div class="flex gap-2 items-center">
            <div class="font-bold">
              {{ props.title }}
            </div>
          </div>
          <div class="font-bold text-lg">
            <UIcon
              :name="iconName || 'i-lucide-lightbulb'"
              class="size-7"
              :class="`text-${color ? color : 'primary'}`"
            />
          </div>
        </div>

        <div
          class="font-bold text-2xl border w-30 p-1 rounded-md flex justify-center items-center"
          :class="`text-${
            typeof value === 'number' && value < 0
              ? 'error'
              : color
              ? color
              : 'secondary'
          }`"
        >
          {{ value }}
        </div>
      </u-card>
    </NuxtLink>
  </div>
</template>

<style scoped></style>
