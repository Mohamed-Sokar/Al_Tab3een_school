<script setup lang="ts">
import { object, string, date, bool } from "yup";
import type { EmployeeAbsenceReport } from "~/types";

const employeeStore = useEmployeesStore();

const route = useRoute();
const form = ref();
const teacherId = Array.isArray(route.params.id)
  ? route.params.id[0]
  : route.params.id ?? "";

const excuse_status_options = ["بعذر", "بغير عذر"];

const schema = object({
  reason: string(),
  date: date().required("التاريخ مطلوب"),
  excuse_status: string().required("حالة العذر مطلوبة"),
});

const state = reactive<EmployeeAbsenceReport>({
  reason: undefined,
  date: new Date(),
  excuse_status: excuse_status_options[0],
});

const onSubmit = async () => {
  await employeeStore.addAbsenceReport(teacherId, state);
  // navigateTo({ name: "employees-view-absence" });
};

const date_string = computed({
  get() {
    if (!state.date) return "";
    if (typeof state.date === "string") {
      // If already in YYYY-MM-DD format, return as is
      if (/^\d{4}-\d{2}-\d{2}$/.test(state.date)) {
        return state.date;
      }
      // Try to parse and format
      const d = new Date(state.date);
      if (!isNaN(d.getTime())) {
        return d.toISOString().slice(0, 10);
      }
      return "";
    }
    if (state.date instanceof Date) {
      return state.date.toISOString().slice(0, 10);
    }
    return "";
  },
  set(val: Date) {
    state.date = val;
  },
});
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
          v-model="date_string"
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
          label="إضافة"
          :loading="employeeStore.loading"
        />
        <UButton
          variant="soft"
          class="flex w-20 py-2 justify-center font-bold lg:col-span-2 hover:cursor-pointer"
          color="secondary"
          @click="navigateTo({ name: 'employees-view' })"
          label="إلغاء"
        />
      </div>
    </UForm>
  </UCard>
</template>

<style scoped></style>
