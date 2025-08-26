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
        />
      </UFormField>

      <div class="col-span-2 flex gap-2 mt-5">
        <UButton
          type="submit"
          class="flex w-40 py-2 justify-center font-bold lg:col-span-2 hover:cursor-pointer"
          color="secondary"
          label="تعديل"
          :loading="employeesStore.loading"
        />
        <UButton
          variant="soft"
          class="flex w-20 py-2 justify-center font-bold lg:col-span-2 hover:cursor-pointer"
          color="secondary"
          @click="navigateTo({ name: 'teachers-view-loans' })"
          label="إلغاء"
        />
      </div>
    </UForm>
  </UCard>
</template>

<script setup lang="ts">
import { number, object } from "yup";
// import { useemployeesStore } from "@/stores/teachers";

const employeesStore = useEmployeesStore();

const form = ref();
const route = useRoute();
const loanId =
  route.params.id instanceof Array ? route.params.id[0] : route.params.id ?? 0;

const targetedLoan = employeesStore.getSpesificLoan(+loanId);

const schema = object({
  amount: number().required("قيمة السلفة مطلوبة"),
});

const state = reactive({
  amount: targetedLoan?.amount,
});

const onSubmit = () => {
  employeesStore.editLoan(+loanId, state.amount || 0);
  navigateTo({ name: "employees-view-loans" });
};
</script>

<style scoped></style>
