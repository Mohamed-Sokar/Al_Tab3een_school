<script setup lang="ts">
import type { Driver } from "~/types";

defineProps<{
  driver: Driver;
}>();
</script>

<template>
  <UCard
    class="h-full border-t-4 border-secondary hover:shadow-xl transition-all"
  >
    <div class="flex justify-between">
      <div class="flex items-center gap-1">
        <UIcon
          name="heroicons-identification-solid"
          class="text-secondary w-8 h-8"
        />
        <span class="text-secondary-600 font-semibold">
          {{ driver.name }}
        </span>
      </div>
      <div>
        <UBadge
          :label="`عدد الطلاب: ${driver.studentsCount}`"
          variant="soft"
          color="secondary"
          class="text-secondary-600 font-bold"
        />
      </div>
    </div>

    <div class="flex flex-col gap-2 mt-5">
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
          {{ driver.studentsCount }}
        </div>
      </div>
      <div
        class="flex justify-between items-center px-4 py-2 rounded-sm bg-gray-50 dark:bg-secondary-950"
      >
        <div class="flex items-center gap-1">
          <UIcon name="heroicons-truck" class="text-info w-5 h-5" />
          <span class="text-xs font-bold">نوع السيارة</span>
        </div>
        <div class="text-info">
          {{ driver.car_type }}
        </div>
      </div>
      <div
        class="flex justify-between items-center px-4 py-2 rounded-sm bg-gray-50 dark:bg-secondary-950"
      >
        <div class="flex items-center gap-1">
          <UIcon name="heroicons-eye-dropper" class="text-info w-5 h-5" />
          <span class="text-xs font-bold">لون السيارة</span>
        </div>
        <div class="text-info">
          {{ driver.car_color }}
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
            {{ driver.maximum_capacity }}
          </div>
          <div class="font-semibold">طالب</div>
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
            (driver.maximum_capacity ?? 0) - (driver.studentsCount ?? 0) > 0
              ? 'success'
              : 'error'
          }`"
        >
          <div class="font-bold">
            {{ (driver.maximum_capacity ?? 0) - (driver.studentsCount ?? 0) }}
          </div>
          <div class="font-semibold">مقعد</div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-2 mt-5 text-center">
        <UButton
          label="عرض الطلاب"
          class="hover:cursor-pointer md:col-span-3 flex justify-center"
          color="secondary"
          variant="subtle"
          @click="
            navigateTo({
              name: 'students-view-students_table',
              query: { driver_id: driver.id },
            })
          "
        />
        <UButton
          label="تعديل"
          class="hover:cursor-pointer flex justify-center"
          color="secondary"
          variant="solid"
          @click="
            navigateTo({
              name: 'drivers-id-edit_driver',
              params: { id: driver.id },
            })
          "
        />
      </div>
    </div>
  </UCard>
</template>

<style scoped></style>
