<script setup lang="ts">
import { number, object } from "yup";
import type { Plan, QuranAchievementReport } from "~/types";

const route = useRoute();
const plansStore = usePlansStore();
const studentsStore = useStudentStore();

const plan = ref<Plan | undefined>();
const studentIdParam = route.params.id;

const studentId = Array.isArray(studentIdParam)
  ? studentIdParam[0]
  : studentIdParam;

const generalPlanIdParam = route.query.general_plan_id;

const generalPlanId = Array.isArray(generalPlanIdParam)
  ? Number(generalPlanIdParam[0])
  : Number(generalPlanIdParam);

const schema = object({
  monthly_plan_id: number().required("الشهر مطلوب"),
  achieved_pages: number().required("عدد الصفحات مطلوبة"),
});

const state = reactive({
  student_id: studentIdParam,
  monthly_plan_id: undefined,
  achieved_pages: undefined as number | undefined,
  status: undefined as string | undefined,
});

const onSubmit = async () => {
  const requiredPages = plan.value?.months_plans?.find(
    (mp) => mp.id === state.monthly_plan_id
  )?.pages;

  state.status =
    Number(state.achieved_pages) >= Number(requiredPages)
      ? "مكتمل"
      : "غير مكتمل";

  await studentsStore.addQuranQuranAchievementReport(
    generalPlanId,
    newReport as QuranAchievementReport
  );
  // navigateTo({ name: "students-view" }); //=> I do that in the store action
};

onMounted(async () => {
  plan.value = await plansStore.getPlanById(generalPlanId);
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
      <UFormField label="الشهر" name="monthly_plan_id" size="md">
        <USelect
          class="w-full"
          v-model="state.monthly_plan_id"
          :items="[
            { label: 'اختر الشهر', value: undefined },
            ...(plan?.months_plans ?? []).map((mp) => ({
              label: `${mp.month?.name} - ${mp.month?.id}   (${mp.pages} صفحة)`,
              value: mp.id,
            })),
          ]"
          placeholder="اختر الشهر"
          icon="i-heroicons-calendar"
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
