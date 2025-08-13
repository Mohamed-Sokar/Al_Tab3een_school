<script setup lang="ts">
import { number, object, string, date } from "yup";
import { invoiceTypes, months } from "~/constants";
import { type Payment } from "~/types";

import { usePaymentsStore } from "@/stores/paymnets";

const paymentsStore = usePaymentsStore();

const { toastError } = useAppToast();
const schema = object({
  type_id: number().required("نوع الدفعة مطلوب"),
  description: string().required("وصف الدفعة مطلوب"),
  created_at: date().required("تاريخ الدفعة مطلوب"),
  amount: number().required("القيمة مطلوبة"),
});

const state = reactive<Payment>({
  type_id: undefined,
  month_id: undefined,
  invoice_number: undefined,
  description: undefined,
  amount: undefined,
});
const targetedReport = ref<Payment>();
const client = useSupabaseClient();
const route = useRoute();
const form = ref();
const isLoading = ref(false);

const fetchReport = async () => {
  const reportId = Number(route.params.id);

  if (isNaN(reportId)) {
    toastError({ title: "معرف التقرير غير صالح" });
    navigateTo({ name: "financial-payments" });
    return;
  }
  try {
    isLoading.value = true;

    const { data: report, error: reportError } = await client
      .from("payments")
      .select(
        `id, amount, month_id, type_id, description, created_at, invoice_number
          `
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

    targetedReport.value = report as Payment;
  } catch (err) {
    toastError({
      title: "خطأ في جلب التقرير",
      description: (err as Error).message || "حدث خطأ غير متوقع",
    });
    setTimeout(() => {
      navigateTo({ name: "financial-payments" });
    }, 1000);
  } finally {
    isLoading.value = false;
  }
};

const onSubmit = async () => {
  state.month_id = (state?.created_at?.getMonth() ?? 0) + 1;
  await paymentsStore.updatePayment(+route.params.id, state);
  navigateTo({ name: "financial-payments" });
};

const date_string = computed({
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

onMounted(async () => {
  await fetchReport();
  Object.assign(state, targetedReport.value);
});
</script>

<template>
  <UCard class="max-w-3xl mx-auto mt-15">
    <div v-if="paymentsStore.loading">Loading</div>
    <UForm
      v-else
      ref="form"
      :schema="schema"
      :state="state"
      class="grid grid-cols-2 gap-4"
      @submit="onSubmit"
    >
      <!-- <UFormField label="الشهر" name="month_id" size="md">
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
      </UFormField> -->
      <UFormField label="نوع الدفعات" name="type_id" size="md">
        <USelect
          class="w-full"
          v-model="state.type_id"
          :items="[
            { label: 'اختر نوع الدفعات', value: undefined },
            ...invoiceTypes.map((m) => ({
              label: `${m.label}`,
              value: m.value,
            })),
          ]"
          placeholder="اختر نوع الدفعات"
          icon="i-lucide-credit-card"
        />
      </UFormField>
      <UFormField label="تاريخ الدفعة" name="created_at">
        <UInput
          type="date"
          v-model="date_string"
          placeholder="تاريخ الدفعة"
          label="تاريخ الدفعة"
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
      <UFormField label="وصف الدفعة" name="description">
        <UInput
          v-model="state.description"
          placeholder="وصف الدفعة"
          label="وصف الدفعة"
          class="w-full"
        />
      </UFormField>
      <UFormField label="رقم الوصل" name="invoice_number">
        <UInput
          v-model="state.invoice_number"
          placeholder="رقم الوصل"
          label="رقم الوصل"
          class="w-full"
        />
      </UFormField>

      <div class="col-span-2 flex gap-2 mt-5">
        <UButton
          type="submit"
          class="flex w-40 py-2 justify-center font-bold lg:col-span-2 hover:cursor-pointer"
          color="secondary"
          label="تعديل"
          :loading="paymentsStore.loading"
        />
        <UButton
          variant="soft"
          class="flex w-20 py-2 justify-center font-bold lg:col-span-2 hover:cursor-pointer"
          color="secondary"
          @click="navigateTo({ name: 'financial-payments' })"
          label="إلغاء"
        />
      </div>
    </UForm>
  </UCard>
</template>

<style scoped></style>
