<script setup lang="ts">
import { number, object, string, date } from "yup";
import { months } from "~/constants";
import { type EmployeeLoan, type Semester } from "~/types";

const loansStore = useLoansStore();
const { toastError, toastSuccess } = useAppToast();
const route = useRoute();
const client = useSupabaseClient();
const isLoading = ref(false);
const form = ref();

const schema = object({
  month_id: number().required("الشهر مطلوب"),
  semester_id: number().required("الفصل مطلوب"),
  amount: number().required("القيمة مطلوبة"),
  notes: string(),
  created_at: date().required("تاريخ الدفعة مطلوب"),
  updated_at: date().required("تاريخ الاسترداد مطلوب"),
});

const state = reactive<EmployeeLoan>({
  employee_id: String(route.params.id),
  month_id: undefined,
  semester_id: undefined,
  notes: undefined,
  amount: undefined,
  created_at: undefined,
  updated_at: new Date(),
  status: "غير مدفوع",
});

const fetchReport = async () => {
  const reportId = Number(route.params.id);

  if (isNaN(reportId)) {
    toastError({ title: "معرف التقرير غير صالح" });
    navigateTo({ name: "financial-employee-loans" });
    return;
  }
  try {
    isLoading.value = true;

    const { data: report, error: reportError } = await client
      .from("employees_loans")
      .select(
        `id, employee_id, semester_id, amount, notes, status, created_at,month_id`
      )
      .eq("id", reportId)
      .single();

    if (reportError) {
      throw new Error(reportError.message);
    }
    console.log(report);
    if (!report) {
      throw new Error("التقرير غير موجود");
    }

    Object.assign(state, report);
  } catch (err) {
    toastError({
      title: "خطأ في جلب التقرير",
      description: (err as Error).message || "حدث خطأ غير متوقع",
    });
    setTimeout(() => {
      navigateTo({ name: "financial-employee-loans" });
    }, 1000);
  } finally {
    isLoading.value = false;
  }
};

const onSubmit = async () => {
  await loansStore.saveLoanReport(state);
  navigateTo({ name: "financial-employee-loans" });
};

const created_at_string = computed({
  get() {
    if (!state.created_at) return "";
    if (typeof state.created_at === "string") {
      // If already in YYYY-MM-DD format, return as is
      if (/^\d{4}-\d{2}-\d{2}$/.test(state.created_at)) {
        return state.created_at;
      }
      // Try to parse and format
      const d = new Date(state.created_at);
      if (!isNaN(d.getTime())) {
        return d.toISOString().slice(0, 10);
      }
      return "";
    }
    if (state.created_at instanceof Date) {
      return state.created_at.toISOString().slice(0, 10);
    }
    return "";
  },
  set(val: Date) {
    state.created_at = val;
  },
});
const updated_at_string = computed({
  get() {
    if (!state.updated_at) return "";
    if (typeof state.updated_at === "string") {
      // If already in YYYY-MM-DD format, return as is
      if (/^\d{4}-\d{2}-\d{2}$/.test(state.updated_at)) {
        return state.updated_at;
      }
      // Try to parse and format
      const d = new Date(state.updated_at);
      if (!isNaN(d.getTime())) {
        return d.toISOString().slice(0, 10);
      }
      return "";
    }
    if (state.updated_at instanceof Date) {
      return state.updated_at.toISOString().slice(0, 10);
    }
    return "";
  },
  set(val: Date) {
    state.updated_at = val;
  },
});

onMounted(async () => await fetchReport());
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
      <UFormField label="تاريخ السلفة" name="created_at">
        <UInput
          disabled
          type="date"
          v-model="created_at_string"
          placeholder="تاريخ السلفة"
          label="تاريخ السلفة"
          class="w-full"
        />
      </UFormField>
      <UFormField label="تاريخ الاسترداد" name="updated_at">
        <UInput
          type="date"
          v-model="updated_at_string"
          placeholder="تاريخ الاسترداد"
          label="تاريخ الاسترداد"
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
      <UFormField label="الحالة" name="status" size="md">
        <USelect
          class="w-full"
          v-model="state.status"
          :items="['مدفوع', 'غير مدفوع']"
          placeholder="اختر الحالة"
          icon="i-heroicons-calendar"
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
          @click="navigateTo({ name: 'financial-employee-loans' })"
          label="إلغاء"
        />
      </div>
    </UForm>
  </UCard>
</template>

<style scoped></style>
