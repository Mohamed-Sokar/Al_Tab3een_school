<script setup lang="ts">
import { number, object, string } from "yup";
import type { Plan } from "~/types";
import { usePlansStore } from "@/stores/plans";
import { months, plan_stage_options, semesterOptions } from "~/constants";
import { USelect } from "#components";

const plansStore = usePlansStore();

const schema = object({
  year: number().required("السنة الدراسية مطلوبة"),
  stage: string().required("المرحلة مطلوبة"),
  semester: string().required("الفصل الدراسي مطلوب"),
  total_pages: number().required("عدد الصفحات مطلوبة"),
});

const state = reactive<Plan>({
  year: new Date().getFullYear() as number | undefined,
  stage: undefined as string | undefined,
  semester: undefined as string | undefined,
  total_pages: undefined as number | undefined,
});

const form = ref();

const onSubmit = async () => {
  console.log(state);
  await plansStore.addPlan(state);
  navigateTo({ name: "plans" });
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
