<script setup lang="ts">
import { object, string } from "yup";
import type { EmployeeAdministrativeIssue } from "~/types";

const issuesStore = useEmployeeAdministrativeIssues();

const route = useRoute();
const form = ref();
const employeeId = Array.isArray(route.params.id)
  ? route.params.id[0]
  : route.params.id ?? "";

const schema = object({
  description: string().required("وصف المخالفة الإدارية مطلوب"),
});

const state = reactive<EmployeeAdministrativeIssue>({
  employee_id: employeeId,
  description: undefined,
});

const onSubmit = async () => {
  // add issue to databases
  await issuesStore.saveEmployeeAdministrativeIssue(state);
  // navigateTo({ name: "employees-view-behavioral-issues" });
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
      <UFormField label="وصف المخالفة الإدارية" name="description">
        <UTextarea
          v-model="state.description"
          placeholder="أدخل وصف المخالفة الإدارية..."
          label="وصف المخالفة الإدارية"
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
          :loading="issuesStore.loading"
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
