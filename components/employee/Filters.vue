<script setup lang="ts">
import type { Filters } from "~/types";
import { usePlansStore } from "@/stores/plans";

// init props
defineProps<{
  filters: Filters;
}>();

// init emits
const emit = defineEmits<{
  (e: "submit"): void;
  (e: "reset"): void;
}>();

onMounted(async () => {
  await usePlansStore().fetchPlans();
});
</script>

<template>
  <div class="mb-5">
    <UForm :state="filters" @submit="emit('submit')">
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        <!-- first_name filter -->
        <UFormField required name="firstNameFilter">
          <UInput
            class="w-full"
            icon="i-lucide-users"
            v-model="filters.firstNameFilter"
            placeholder="أدخل الاسم الأول"
          />
        </UFormField>
        <!-- second name filter -->
        <UFormField required name="secondNameFilter">
          <UInput
            class="w-full"
            icon="i-lucide-users"
            v-model="filters.secondNameFilter"
            placeholder="أدخل الاسم الثاني"
          />
        </UFormField>
        <!-- third name filter -->
        <UFormField required name="thirdNameFilter">
          <UInput
            class="w-full"
            icon="i-lucide-users"
            v-model="filters.thirdNameFilter"
            placeholder="أدخل الاسم الثالث"
          />
        </UFormField>
        <!-- last name filter -->
        <UFormField required name="lastNameFilter">
          <UInput
            class="w-full"
            icon="i-lucide-users"
            v-model="filters.lastNameFilter"
            placeholder="أدخل الاسم الأخير"
          />
        </UFormField>
        <!-- job title filter -->
        <UFormField required name="jobTitleFilter">
          <USelect
            :items="['معلم', 'آذن', 'سكرتير', 'مدير']"
            class="w-full"
            icon="heroicons-briefcase-20-solid"
            v-model="filters.jobTitleFilter"
            placeholder="أدخل المسمى الوظيفي"
          />
        </UFormField>
      </div>
      <div class="flex items-center gap-2 mt-3">
        <UButton
          type="submit"
          label="بحث"
          icon="i-lucide-search"
          color="secondary"
          class="w-full md:w-fit hover:cursor-pointer"
        />
        <UButton
          label="إعادة تعيين"
          color="secondary"
          variant="soft"
          class="w-full md:w-fit hover:cursor-pointer"
          @click="emit('reset')"
        />
      </div>
    </UForm>
  </div>
</template>
