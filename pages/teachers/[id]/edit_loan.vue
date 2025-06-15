<template>
  <UCard class="max-w-3xl mx-auto mt-15">
    <UForm
      ref="form"
      :schema="schema"
      :state="state"
      class="grid grid-cols-1 gap-4"
      @submit="onSubmit"
    >
      <UFormField label="قيمة السلفة" name="loan">
        <UInput
          type="number"
          v-model.number="state.loan"
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
import { object, string } from "yup";
import { behavioralIssuesTeacher, teachersLoans } from "~/constants";

const { toastSuccess } = useAppToast();
const route = useRoute();
const isLoading = ref(false);
const form = ref();

const schema = object({
  loan: string().required("قيمة السلفة مطلوبة"),
});

const targetedLoan = teachersLoans.find(
  (loan) => loan.id?.toString() === route.params.id.toString()
);

const state = ref({
  loan: targetedLoan?.loanValue,
});

const onSubmit = () => {
  // add issue to database
  isLoading.value = true;
  const loanIndex = teachersLoans.findIndex(
    (loan) => loan.id?.toString() === route.params.id.toString()
  );

  teachersLoans[loanIndex] = {
    ...teachersLoans[loanIndex],
    loanValue: state.value.loan,
  };

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
