<script setup lang="ts">
import { number, object, string } from "yup";
import type { AchievmentReport, Student } from "~/types";
import { useStudentStore } from "@/stores/students";
import { months } from "~/constants";

const route = useRoute();
const plansStore = usePlansStore();
const studentsStore = useStudentStore();
const studentIdParam = route.params.id;

const studentId = Array.isArray(studentIdParam)
  ? studentIdParam[0]
  : studentIdParam;

const targetedStudent = ref<Student | undefined>(
  studentsStore.getSpesificStudent(studentId)
);
const generalPlanIdParam = route.query.general_plan_id;

const generalPlanId = Array.isArray(generalPlanIdParam)
  ? Number(generalPlanIdParam[0])
  : Number(generalPlanIdParam);

const schema = object({
  month: string().required("الشهر مطلوب"),
  achieved_pages: number().required("عدد الصفحات مطلوبة"),
});

const state = reactive({
  month: months[new Date().getMonth()],
  achieved_pages: undefined as number | undefined,
});

watchEffect(() => {
  if (studentsStore.studentsData.length > 0) {
    targetedStudent.value = studentsStore.getSpesificStudent(studentId);
  }
});

const onSubmit = async () => {
  const monthlyPlanId = targetedStudent.value?.plan?.months_plans?.find(
    (plan) => plan.month === state.month && plan?.plan_id === +generalPlanId
  )?.id;

  const newReport = {
    ...state,
    student_id: studentId,
    monthly_plan_id: monthlyPlanId,
  };

  await studentsStore.addQuranAchievmentReport(
    generalPlanId,
    newReport as AchievmentReport
  );

  // navigateTo({ name: "students-view-students_table" }); => I do that in the store action
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
      <UFormField label="الشهر" name="month">
        <USelect
          :items="months"
          v-model="state.month"
          placeholder="الشهر"
          label="الشهر"
          class="w-full"
        />
      </UFormField>
      <UFormField label="عدد الصفحات" name="pages">
        <UInput
          type="number"
          v-model="state.achieved_pages"
          placeholder="عدد الصفحات"
          label="عدد الصفحات"
          class="w-full"
        />
      </UFormField>

      <div class="md:col-span-2 flex gap-2 mt-5">
        <UButton
          type="submit"
          class="flex w-40 py-2 justify-center font-bold lg:col-span-2 hover:cursor-pointer"
          color="secondary"
          label="إضافة"
          :loading="studentsStore.loading || plansStore.loading"
        />
        <UButton
          variant="soft"
          class="flex w-20 py-2 justify-center font-bold lg:col-span-2 hover:cursor-pointer"
          color="secondary"
          @click="navigateTo({ name: 'students-view' })"
          label="إلغاء"
        />
      </div>
    </UForm>
  </UCard>
</template>

<style scoped></style>
