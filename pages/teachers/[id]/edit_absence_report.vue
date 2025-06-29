<script setup lang="ts">
import { object, string } from "yup";
import { useTeachersStore } from "@/stores/teachers";
import type { TeacherAbsenceReport } from "~/types";

const teachersStore = useTeachersStore();

const route = useRoute();
const form = ref();
const reportId = Array.isArray(route.params.id)
  ? route.params.id[0]
  : route.params.id ?? "";

const excuse_status_options = ["بعذر", "بغير عذر"];

const schema = object({
  reason: string(),
  date: string().required("التاريخ مطلوب"),
  excuse_status: string().required("حالة العذر مطلوبة"),
});

const targetedReport = teachersStore.getSpesificTeacherAbsenceReport(+reportId);

const state = reactive<TeacherAbsenceReport>({
  reason: targetedReport?.reason,
  date: targetedReport?.date,
  excuse_status: targetedReport?.excuse_status,
});

const onSubmit = async () => {
  await teachersStore.editTeacherAbsenceReport(+reportId, state);
  navigateTo({ name: "teachers-view-absence" });
};
</script>

<template>
  <UCard class="max-w-3xl mx-auto mt-15">
    <UForm
      ref="form"
      :schema="schema"
      :state="state"
      class="grid grid-cols-2 gap-4"
      @submit="onSubmit"
    >
      <UFormField label="حالة العذر" name="excuse_status" required>
        <USelect
          :items="excuse_status_options"
          v-model="state.excuse_status"
          placeholder="أدخل حالة العذر..."
          label="حالة العذر"
          class="w-full mt-2"
        />
      </UFormField>
      <UFormField label="التاريخ" name="date" required>
        <UInput
          type="date"
          v-model="state.date"
          placeholder="أدخل التاريخ..."
          label="التاريخ"
          class="w-full mt-2"
          icon="heroicons-calendar-days-solid"
        />
      </UFormField>
      <UFormField label="سبب الغياب" name="reason">
        <UInput
          v-model="state.reason"
          placeholder="أدخل سبب الغياب..."
          label="سبب الغياب"
          class="w-full mt-2"
        />
      </UFormField>

      <div class="col-span-2 flex gap-2 mt-5">
        <UButton
          type="submit"
          class="flex w-40 py-2 justify-center font-bold lg:col-span-2 hover:cursor-pointer"
          color="secondary"
          label="تعديل"
          :loading="teachersStore.loading"
        />
        <UButton
          variant="soft"
          class="flex w-20 py-2 justify-center font-bold lg:col-span-2 hover:cursor-pointer"
          color="secondary"
          @click="navigateTo({ name: 'teachers-view-teachers_table' })"
          label="إلغاء"
        />
      </div>
    </UForm>
  </UCard>
</template>

<style scoped></style>
