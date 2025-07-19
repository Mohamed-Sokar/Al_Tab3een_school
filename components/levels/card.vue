<script setup lang="ts">
import type { Level } from "~/types";
const levelsStore = useLevelsStore();
defineProps<{
  level: Level;
}>();
</script>

<template>
  <UCard
    class="h-full border-t-4 border-secondary hover:shadow-xl transition-all"
  >
    <div class="flex justify-between">
      <div class="flex items-center gap-1">
        <UIcon
          name="heroicons-academic-cap-16-solid"
          class="text-secondary w-8 h-8"
        />
        <span class="text-secondary-600 font-semibold">
          {{ level.title }}
        </span>
      </div>
      <div>
        <UBadge
          :label="`${level.students[0].count} طالب`"
          variant="soft"
          color="secondary"
          class="text-secondary-600 font-bold"
        />
      </div>
    </div>

    <div class="flex flex-col gap-5 mt-5">
      <div
        class="flex justify-between items-center px-4 py-2 rounded-sm bg-gray-50 dark:bg-secondary-950"
      >
        <div class="flex items-center gap-1">
          <UIcon
            name="heroicons-user-group-solid"
            class="text-secondary w-5 h-5"
          />
          <span class="text-xs font-bold">عدد الطلاب</span>
        </div>
        <div class="font-bold text-secondary-600">
          {{ level.students[0].count }}
        </div>
      </div>
      <div
        class="flex justify-between items-center px-4 py-2 rounded-sm bg-gray-50 dark:bg-secondary-950"
      >
        <div class="flex items-center gap-1">
          <UIcon
            name="i-heroicons-user-group-solid"
            class="text-error w-5 h-5"
          />
          <span class="text-xs font-bold">السعة القصوى</span>
        </div>
        <div class="text-error text-sm flex items-center gap-1">
          <div class="font-bold">
            {{ level.maximum_capacity }}
          </div>
          <div class="font-semibold">طالب</div>
        </div>
      </div>
      <div
        class="flex justify-between items-center px-4 py-2 rounded-sm bg-gray-50 dark:bg-secondary-950"
      >
        <div class="flex items-center gap-1">
          <UIcon
            name="heroicons-currency-dollar-20-solid"
            class="text-warning w-5 h-5"
          />
          <span class="text-xs font-bold">الرسوم الشهرية</span>
        </div>
        <div class="text-warning text-sm flex items-center gap-1">
          <div class="font-bold">
            {{ level.fees }}
          </div>
          <div class="font-semibold">شيكل</div>
        </div>
      </div>

      <div
        class="flex justify-between items-center px-4 py-2 rounded-sm bg-gray-50 dark:bg-secondary-950"
      >
        <div class="flex items-center gap-1">
          <UIcon name="i-heroicons-cube" class="text-gray-400 w-5 h-5" />
          <span class="text-xs font-bold">المقاعد الفارغة</span>
        </div>
        <div
          class="text-sm flex items-center gap-1"
          :class="`text-${
            (level.maximum_capacity ?? 0) - (level.students[0].count ?? 0) > 0
              ? 'success'
              : 'error'
          }`"
        >
          <div class="font-bold">
            {{ (level.maximum_capacity ?? 0) - (level.students[0].count ?? 0) }}
          </div>
          <div class="font-semibold">مقعد</div>
        </div>
      </div>

      <div class="grid grid-cols-5 gap-2 text-center">
        <UButton
          label="عرض الطلاب"
          class="hover:cursor-pointer col-span-5 xl:col-span-3 flex justify-center"
          color="secondary"
          variant="subtle"
          size="sm"
          @click="
            navigateTo({
              name: 'students-view-students_table',
              query: { level: level.title },
            })
          "
        />
        <UButton
          label="تعديل"
          class="hover:cursor-pointer flex justify-center col-span-5 xl:col-span-1"
          color="secondary"
          size="sm"
          variant="solid"
          @click="
            navigateTo({
              name: 'levels-id-edit_level',
              params: { id: level.id },
            })
          "
        />
        <UButton
          label="حذف"
          class="hover:cursor-pointer flex justify-center col-span-5 xl:col-span-1"
          color="error"
          variant="solid"
          :loading="levelsStore.loading"
          size="sm"
          @click="levelsStore.deleteLevel(level.id ?? 0)"
        />
      </div>
    </div>
  </UCard>
</template>

<style scoped></style>
