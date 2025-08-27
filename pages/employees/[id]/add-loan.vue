<script setup lang="ts">
import { number, object, string, date } from "yup";
import { months } from "~/constants";
import { type EmployeeLoan, type Semester } from "~/types";

const loansStore = useLoansStore();
const route = useRoute();
const form = ref();
const currentMonth = months.find((m) => m.value === new Date().getMonth() + 1);

const schema = object({
  month_id: number().required("الشهر مطلوب"),
  semester_id: number().required("الفصل مطلوب"),
  amount: number().required("القيمة مطلوبة"),
  notes: string(),
  date: date().required("تاريخ الدفعة مطلوب"),
});
const state = reactive<EmployeeLoan>({
  employee_id: String(route.params.id),
  month_id: currentMonth?.value,
  semester_id: useGradsStore().semestersData[0]?.id,
  date: new Date(),
  notes: undefined,
  amount: undefined,
  status: "غير مدفوع",
});

const onSubmit = async () => {
  await loansStore.saveLoanReport(state);
  navigateTo({ name: "financial-employee-loans" });
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
    <div v-if="loansStore.loading">Loading</div>
    <UForm
      v-else
      ref="form"
      :schema="schema"
      :state="state"
      class="grid grid-cols-2 gap-4"
      @submit="onSubmit"
    >
      <UFormField label="الشهر" name="month_id" size="md">
        <USelect
          class="w-full"
          v-model="state.month_id"
          :items="[
            { label: 'اختر الشهر', value: undefined },
            ...months.map((m) => ({
              label: `${m.label} - ${m.value}`,
              value: m.value,
            })),
          ]"
          placeholder="اختر الشهر"
          icon="i-heroicons-calendar"
        />
      </UFormField>
      <UFormField label="الفصل الدراسي" required name="semester_id" size="md">
        <USelect
          class="w-full"
          v-model="state.semester_id"
          :items="
                useGradsStore().semestersData.map((s:Semester) => ({
                label: `${s.year} - ${s.name}`,
                value: s.id,
              }))
            "
          placeholder="اختر الفصل الدراسي"
        />
      </UFormField>
      <UFormField label="تاريخ السلفة" name="date">
        <UInput
          type="date"
          v-model="date_string"
          placeholder="تاريخ السلفة"
          label="تاريخ السلفة"
          class="w-full"
        />
      </UFormField>
      <UFormField label="القيمة" name="amount">
        <UInput
          type="number"
          v-model.number="state.amount"
          placeholder="القيمة"
          label="القيمة"
          class="w-full"
        />
      </UFormField>
      <UFormField label="وصف الدفعة" name="notes">
        <UInput
          v-model="state.notes"
          placeholder="وصف الدفعة"
          label="وصف الدفعة"
          class="w-full"
        />
      </UFormField>

      <div class="col-span-2 flex gap-2 mt-5">
        <UButton
          type="submit"
          class="flex w-40 py-2 justify-center font-bold lg:col-span-2 hover:cursor-pointer"
          color="secondary"
          label="حفظ"
          :loading="loansStore.loading"
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
