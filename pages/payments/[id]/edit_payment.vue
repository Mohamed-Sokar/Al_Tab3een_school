<script setup lang="ts">
import { number, object, string } from "yup";
import { payment_type_options } from "~/constants";
import { type Payment } from "~/types";

import { usePaymentsStore } from "@/stores/paymnets";

const paymentsStore = usePaymentsStore();
let targetedPayment;

const schema = object({
  type: string().required("نوع الدفعة مطلوب"),
  description: string().required("وصف الدفعة مطلوب"),
  date: string().required("تاريخ الدفعة مطلوب"),
  amount: number().required("القيمة مطلوبة"),
});

const state = reactive<Payment>({
  id: undefined,
  type: undefined,
  description: undefined,
  date: undefined,
  amount: undefined,
});

const route = useRoute();
const form = ref();

targetedPayment = paymentsStore.getSpecificPayment(+route.params.id);
Object.assign(state, targetedPayment);

if (!targetedPayment) {
  targetedPayment = await paymentsStore.getPaymentById(+route.params.id);
  Object.assign(state, targetedPayment);
  console.log(targetedPayment);
}

const onSubmit = async () => {
  await paymentsStore.updatePayment(+route.params.id, state);
  navigateTo({ name: "payments" });
};
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
      <UFormField label="نوع الدفعة" name="type">
        <USelect
          :items="payment_type_options"
          v-model="state.type"
          placeholder="نوع الدفعة"
          label="نوع الدفعة"
          class="w-full"
        />
      </UFormField>

      <UFormField label="تاريخ الدفعة" name="date">
        <UInput
          type="date"
          v-model="state.date"
          placeholder="تاريخ الدفعة"
          label="تاريخ الدفعة"
          class="w-full"
        />
      </UFormField>

      <UFormField label="القيمة" name="value">
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
          @click="navigateTo({ name: 'payments' })"
          label="إلغاء"
        />
      </div>
    </UForm>
  </UCard>
</template>

<style scoped></style>
