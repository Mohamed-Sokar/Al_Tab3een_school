<script setup lang="ts">
import type { StudentFilters } from "~/types";
import { useAcademicClassesStore } from "@/stores/academic_classes";
import { useQuranClassesStore } from "@/stores/quran_classes";
import { usePlansStore } from "@/stores/plans";
import { useLevelsStore } from "@/stores/levels";

// init props
defineProps<{
  filters: StudentFilters;
  //   academicClasses: ReturnType<typeof useAcademicClassesStore>["classesData"];
  //   quranClasses: ReturnType<typeof useQuranClassesStore>["classesData"];
  //   plans: ReturnType<typeof usePlansStore>["plansData"];
  //   levels: ReturnType<typeof useLevelsStore>["levelsData"];
}>();

// تعريف emits
const emit = defineEmits<{
  (e: "submit"): void;
  (e: "reset"): void;
}>();
</script>

<template>
  <div class="mb-5">
    <UForm :state="filters" @submit="emit('submit')">
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
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
        <!-- quran class filter -->
        <UFormField required name="quranClassFilter">
          <USelect
            class="w-full"
            icon="i-lucide-book-open"
            v-model="filters.quranClassFilter"
            :items="[
              { label: 'الكل', value: undefined },
              ...useQuranClassesStore().classesData.map((c) => ({
                label: `${c.title} - شعبة ${c.group}`,
                value: c.id,
              })),
            ]"
            placeholder="اختر الشعبة القرآنية"
          />
        </UFormField>
        <!-- plan class filter -->
        <UFormField required name="planClassFilter">
          <USelect
            v-model="filters.planFilter"
            class="w-full"
            icon="i-lucide-map"
            :items="[
              { label: 'الكل', value: undefined },
              ...usePlansStore().plansData.map((plan) => ({
                label: `${plan.semester} ${plan.year} - ${plan.students_type} - ${plan.stage} - عدد الصفحات: ( ${plan.total_pages} )`,
                value: plan.id,
              })),
            ]"
            placeholder="اختر خطة القرآن"
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
