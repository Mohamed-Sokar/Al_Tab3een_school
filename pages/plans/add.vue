<script setup lang="ts">
import { number, object, string } from "yup";
import type { Plan } from "~/types";
import { usePlansStore } from "@/stores/plans";
import { useStudentStore } from "@/stores/students";
import {
  plan_stage_options,
  semesterOptions,
  students_type_options,
} from "~/constants";
import { USelect } from "#components";

const plansStore = usePlansStore();
const studentsStore = useStudentStore();

const schema = object({
  year: number().required("السنة الدراسية مطلوبة"),
  stage: string().required("المرحلة مطلوبة"),
  semester: string().required("الفصل الدراسي مطلوب"),
  total_pages: number().required("عدد الصفحات مطلوبة"),
  students_type: string().required("نوع الطلاب مطلوب"),
});

const state = reactive<Plan>({
  year: new Date().getFullYear() as number | undefined,
  stage: undefined as string | undefined,
  semester: undefined as string | undefined,
  total_pages: undefined as number | undefined,
  students_type: students_type_options[0],
});

const form = ref();

const onSubmit = async () => {
  await plansStore.addPlan(state);
  await navigateTo({ name: "plans" });
};
</script>

<template>
  <UCard class="max-w-3xl mx-auto mt-15">
    <UForm
      ref="form"
      :schema="schema"
      :state="state"
      class="grid grid-cols-1 md:grid-cols-2 gap-4"
      @submit="onSubmit"
    >
      <UFormField label="السنة الدراسية" name="year">
        <UInput
          type="number"
          v-model.number="state.year"
          placeholder="السنة الدراسية"
          label="السنة الدراسية"
          class="w-full"
        />
      </UFormField>
      <UFormField label="الفصل الدراسي" name="semester">
        <USelect
          :items="semesterOptions"
          v-model="state.semester"
          placeholder="الفصل الدراسي"
          label="الفصل الدراسي"
          class="w-full"
        />
      </UFormField>
      <UFormField label="المرحلة" name="stage">
        <USelect
          :items="plan_stage_options"
          v-model="state.stage"
          placeholder="المرحلة"
          label="المرحلة"
          class="w-full"
        />
      </UFormField>
      <UFormField label="نوع الطلاب" name="students_type">
        <USelect
          :items="students_type_options"
          v-model="state.students_type"
          placeholder="نوع الطلاب"
          label="نوع الطلاب"
          class="w-full"
        />
      </UFormField>
      <UFormField label="عدد الصفحات الكلية" name="total_pages">
        <UInput
          type="number"
          v-model="state.total_pages"
          placeholder="عدد الصفحات الكلية"
          label="عدد الصفحات الكلية"
          class="w-full"
        />
      </UFormField>

      <div class="md:col-span-2 flex gap-2 mt-5">
        <UButton
          type="submit"
          class="flex w-40 py-2 justify-center font-bold lg:col-span-2 hover:cursor-pointer"
          color="secondary"
          label="إضافة"
          :loading="plansStore.loading"
        />
        <UButton
          variant="soft"
          class="flex w-20 py-2 justify-center font-bold lg:col-span-2 hover:cursor-pointer"
          color="secondary"
          @click="navigateTo({ name: 'plans' })"
          label="إلغاء"
        />
      </div>
    </UForm>
  </UCard>
</template>

<style scoped></style>
