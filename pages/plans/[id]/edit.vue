<script setup lang="ts">
import { number, object, string } from "yup";
import type { Level, Plan, Semester } from "~/types";
import { usePlansStore } from "@/stores/plans";
import { students_type_options } from "~/constants";
import { USelect } from "#components";

const plansStore = usePlansStore();
const route = useRoute();
const planId = route.params.id;

// const targetedPlan = plansStore.getSpecificPlan(+planId);

const schema = object({
  level_id: number().required("المرحلة مطلوبة"),
  semester_id: number().required("الفصل الدراسي مطلوب"),
  total_pages: number().required("عدد الصفحات مطلوبة"),
  students_type: string().required("نوع الطلاب مطلوب"),
});

const state = reactive<Plan>({
  level_id: undefined as number | undefined,
  semester_id: undefined as number | undefined,
  total_pages: undefined as number | undefined,
  students_type: students_type_options[0],
});

const form = ref();

const onSubmit = async () => {
  await plansStore.updatePlan(+planId, state);
  navigateTo({ name: "plans", query: { planId } });
};

const fetchPlan = async () => {
  const plan = await plansStore.getPlanById(Number(planId));
  // const { months_plans, ...rest } = plan as Plan;
  console.log(plan);
  Object.assign(state, plan);
};

onMounted(async () => {
  await fetchPlan();
});
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
      <UFormField label="الفصل الدراسي" required name="semester_id" size="md">
        <USelect
          class="w-full"
          v-model="state.semester_id"
          :items="
                [{ label: 'اختر الفصل الدراسي', value: undefined },
                ...useGradsStore().semestersData.map((s:Semester) => ({
                label: `${s.year} - ${s.name}`,
                value: s.id,
              }))]
            "
          placeholder="اختر الفصل الدراسي"
        />
      </UFormField>
      <UFormField label="المرحلة الدراسية" name="level_id" size="md">
        <USelect
          class="w-full"
          v-model="state.level_id"
          :items="[{ label: 'اختر المرحلة الدراسية', value: undefined }
              ,...useLevelsStore().levelsData.map((s:Level) => ({
                label: s.title,
                value: s.id,
              }))]
            "
          placeholder="اختر المرحلة الدراسية"
        />
      </UFormField>
      <UFormField label="نوع الطلاب" name="students_type" size="md">
        <USelect
          class="w-full"
          v-model="state.students_type"
          :items="[
            { label: 'اختر نوع الطلاب', value: undefined },
            { label: 'طلاب قدامى', value: 'طلاب قدامى' },
            { label: 'طلاب جدد', value: 'طلاب جدد' },
          ]"
          placeholder="اختر نوع الطلاب"
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
          @click="navigateTo({ name: 'plans', query: { planId } })"
          label="إلغاء"
        />
      </div>
    </UForm>
  </UCard>
</template>

<style scoped></style>
