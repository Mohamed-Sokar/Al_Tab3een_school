<script setup lang="ts">
import { object, number } from "yup";
import { useTeachersStore } from "@/stores/teachers";

const teachersStore = useTeachersStore();

const route = useRoute();
const form = ref();
let teacher_id =
  route.params.id instanceof Array ? route.params.id[0] : route.params.id ?? 0;

const schema = object({
  amount: number().required("قيمة السلفة مطلوبة"),
});

const state = reactive({
  amount: undefined,
});

const onSubmit = async () => {
  await teachersStore.addTeacherLoan(teacher_id || "", state.amount || 0);
  navigateTo({ name: "teachers-view-loans" });
};
</script>

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
          label="إضافة"
          :loading="teachersStore.loading"
        />
        <UButton
          variant="soft"
          class="flex w-20 py-2 justify-center font-bold lg:col-span-2 hover:cursor-pointer"
          color="secondary"
          @click="navigateTo({ name: 'teachers-view-teachers_table' })"
          label="إلغاء"
        />
      </div>
    </UForm>
  </UCard>
</template>

<style scoped></style>
