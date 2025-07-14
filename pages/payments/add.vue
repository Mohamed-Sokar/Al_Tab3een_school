<script setup lang="ts">
import { number, object, string, date } from "yup";
import { payment_type_options } from "~/constants";
import type { Payment } from "~/types";
import { usePaymentsStore } from "@/stores/paymnets";

const paymentsStore = usePaymentsStore();

const schema = object({
  type: string().required("نوع الدفعة مطلوب"),
  invoice_number: string().required("رقم الوصل مطلوب"),
  description: string().required("وصف الدفعة مطلوب"),
  date: date().required("تاريخ الدفعة مطلوب"),
  amount: number().required("القيمة مطلوبة"),
});

const state = reactive<Payment>({
  type: undefined,
  description: undefined,
  date: new Date(),
  amount: undefined,
  invoice_number: undefined,
});

const form = ref();

const onSubmit = async () => {
  await paymentsStore.addPayment(state);
  navigateTo({ name: "payments" });
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
      <UFormField label="نوع الدفعة" name="type">
        <USelect
          :items="payment_type_options"
          v-model="state.type"
          placeholder="نوع الدفعة"
          label="نوع الدفعة"
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

      <UFormField label="تاريخ الدفعة" name="date">
        <UInput
          type="date"
          v-model="date_string"
          placeholder="تاريخ الدفعة"
          label="تاريخ الدفعة"
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

      <UFormField label="القيمة" name="amount">
        <UInput
          type="number"
          v-model.number="state.amount"
          placeholder="القيمة"
          label="القيمة"
          class="w-full"
        />
      </UFormField>

      <div class="col-span-2 flex gap-2 mt-5">
        <UButton
          type="submit"
          class="flex w-40 py-2 justify-center font-bold lg:col-span-2 hover:cursor-pointer"
          color="secondary"
          label="إضافة"
          :loading="paymentsStore.loading"
        />
        <UButton
          variant="soft"
          class="flex w-20 py-2 justify-center font-bold lg:col-span-2 hover:cursor-pointer"
          color="secondary"
          @click="navigateTo({ name: 'payments' })"
          label="إلغاء"
        />
      </div>
    </UForm>
  </UCard>
</template>

<style scoped></style>
