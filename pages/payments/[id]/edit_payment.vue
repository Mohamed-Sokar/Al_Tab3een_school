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
          :loading="isLoading"
        />
        <UButton
          variant="soft"
          class="flex w-20 py-2 justify-center font-bold lg:col-span-2 hover:cursor-pointer"
          color="secondary"
          @click="navigateTo('/payments')"
          label="إلغاء"
        />
      </div>
    </UForm>
  </UCard>
</template>

<script setup lang="ts">
import { number, object, string } from "yup";
import { payment_type_options, payments } from "~/constants";
import { type Payment } from "~/types";

import { usePaymentsStore } from "@/stores/paymnets";

const { updatePayment, getSpecificPayment } = usePaymentsStore();

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
const { toastSuccess } = useAppToast();
const isLoading = ref(false);
const form = ref();

const targetedPayment = getSpecificPayment(+route.params.id);

Object.assign(state, targetedPayment);

const onSubmit = async () => {
  isLoading.value = true;
  updatePayment(+route.params.id, state);

  setTimeout(() => {
    isLoading.value = false;
    toastSuccess({
      title: "تم تحديث الدفعة بنجاح",
    });
    navigateTo("/payments");
  }, 500);
};
</script>

<style scoped></style>
