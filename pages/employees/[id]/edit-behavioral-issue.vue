<script setup lang="ts">
import { object, string } from "yup";
// import { useemployeesStore } from "@/stores/teachers";

const employeesStore = useEmployeesStore();

const route = useRoute();
const form = ref();

const schema = object({
  description: string().required("وصف المخالفة السلوكية مطلوب"),
});

const targetedIssue = employeesStore.getSpesificAdministrativeIssue(
  +route.params.id
);

const state = reactive({
  description: targetedIssue?.description,
});

const onSubmit = async () => {
  // add issue to database
  await employeesStore.editAdministrativeIssue(
    +route.params.id,
    state.description + ""
  );
  navigateTo({ name: "teachers-view-behavioral_issues" });
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
          label="تعديل"
          :loading="employeesStore.loading"
        />
        <UButton
          variant="soft"
          class="flex w-20 py-2 justify-center font-bold lg:col-span-2 hover:cursor-pointer"
          color="secondary"
          @click="navigateTo({ name: 'employees-view-behavioral-issues' })"
          label="إلغاء"
        />
      </div>
    </UForm>
  </UCard>
</template>

<style scoped></style>
