<template>
  <UCard class="max-w-3xl mx-auto mt-15">
    <UForm
      ref="form"
      :schema="schema"
      :state="state"
      class="grid grid-cols-1 gap-4"
      @submit="onSubmit"
    >
      <UFormField label="وصف المخالفة السلوكية" name="description">
        <UTextarea
          v-model="state.description"
          placeholder="أدخل وصف المخالفة السلوكية..."
          label="وصف المخالفة السلوكية"
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
          :loading="studentsStore.loading"
        />
        <UButton
          variant="soft"
          class="flex w-20 py-2 justify-center font-bold lg:col-span-2 hover:cursor-pointer"
          color="secondary"
          @click="navigateTo({ name: 'students-view' })"
          label="إلغاء"
        />
      </div>
    </UForm>
  </UCard>
</template>

<script setup lang="ts">
import { object, string } from "yup";
import { useStudentStore } from "@/stores/students";

const studentsStore = useStudentStore();
const studentBehavioralIssuesStore = useStudentBehavioralIssues();

const route = useRoute();
const form = ref();

const schema = object({
  description: string().required("وصف المخالفة السلوكية مطلوب"),
});

const state = reactive({
  description: undefined,
});

const studentId = typeof route.params.id === "string" ? route.params.id : "";
// get student based on his id
const onSubmit = async () => {
  const newReport = {
    student_id: studentId,
    description: state.description + "",
  };
  // add issue to database
  await studentBehavioralIssuesStore.saveBehavioralIssue(newReport);
  navigateTo({ name: "students-view-behavioral_issues" });
};
</script>

<style scoped></style>
