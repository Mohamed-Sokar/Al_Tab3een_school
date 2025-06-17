<template>
  <UCard class="max-w-3xl mx-auto mt-15">
    <UForm
      ref="form"
      :schema="schema"
      :state="state"
      class="grid grid-cols-1 gap-4"
      @submit="onSubmit"
    >
      <UFormField label="قيمة السلفة" name="amount">
        <UInput
          type="number"
          v-model.number="state.amount"
          placeholder="أدخل قيمة السلفة"
          label="إضافة سلفة"
          class="w-full mt-2"
          :rows="5"
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
          @click="navigateTo('/teachers/view')"
          label="إلغاء"
        />
      </div>
    </UForm>
  </UCard>
</template>

<script setup lang="ts">
import { number, object, string } from "yup";
import { teachersLoans } from "~/constants";
import { useTeacherStore } from "@/stores/teachers";

const { getSpesificTeacherLoan, getSpesificTeacherLoanIndex, editTeacherLoan } =
  useTeacherStore();

const { toastSuccess } = useAppToast();
const route = useRoute();
const isLoading = ref(false);
const form = ref();

const schema = object({
  amount: number().required("قيمة السلفة مطلوبة"),
});

const loanId = route.params.id;
const targetedLoan = getSpesificTeacherLoan(loanId);

const state = reactive({
  amount: targetedLoan?.amount,
});

const onSubmit = () => {
  // add issue to database
  isLoading.value = true;

  editTeacherLoan(loanId, state.amount);

  setTimeout(() => {
    isLoading.value = false;
    toastSuccess({
      title: "تم تعديل السلفة بنجاح",
    });
    navigateTo("/teachers/view/loans");
  }, 500);
};
</script>

<style scoped></style>
