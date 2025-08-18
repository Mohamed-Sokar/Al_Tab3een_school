<script setup lang="ts">
import type { Filters } from "~/types";
import { useAcademicClassesStore } from "@/stores/academic_classes";
import { usePlansStore } from "@/stores/plans";
import { useLevelsStore } from "@/stores/levels";

// init props
defineProps<{
  filters: Filters;
  loading: boolean;
}>();

// emits
const emit = defineEmits<{
  (e: "submit"): void;
  (e: "reset"): void;
}>();

onMounted(async () => {
  // await useAcademicClassesStore().fetchClasses();
  // await useQuranClassesStore().fetchClasses();
  // await useLevelsStore().fetchLevels();
  await usePlansStore().fetchPlans();
});
</script>

<template>
  <div class="mb-5">
    <UForm :state="filters" @submit="emit('submit')">
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        <!-- academic class filter -->
        <UFormField required name="academicClassFilter">
          <USelect
            class="w-full"
            icon="i-heroicons-presentation-chart-bar"
            v-model="filters.academicClassFilter"
            :items="[
              { label: 'الكل', value: undefined },
              ...useAcademicClassesStore().classesData.map((c) => ({
                label: `${c.title} - شعبة ${c.group}`,
                value: c.id,
              })),
            ]"
            placeholder="اختر الشعبة الدراسية"
          />
        </UFormField>
        <!-- level class filter -->
        <UFormField required name="levelFilter">
          <USelect
            class="w-full"
            icon="i-heroicons-calendar-days"
            v-model="filters.levelFilter"
            :items="[
              { label: 'الكل', value: undefined },
              ...useLevelsStore().levelsData.map((level) => ({
                label: level.title,
                value: level.id,
              })),
            ]"
            placeholder="اختر المستوى الدراسي"
          />
        </UFormField>
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
        <!-- identity filter -->
        <UFormField required name="identityNumberFilter">
          <UInput
            type="number"
            class="w-full"
            icon="heroicons-identification-20-solid"
            v-model="filters.identityNumberFilter"
            placeholder="أدخل رقم الهوية"
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
          :loading="loading"
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
