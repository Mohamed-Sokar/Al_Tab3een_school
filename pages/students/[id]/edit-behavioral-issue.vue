<script setup lang="ts">
import { object, string } from "yup";
import { useStudentStore } from "@/stores/students";
import type { BehavioralIssue } from "~/types";

const studentsStore = useStudentStore();

const route = useRoute();
const issueId = +route.params.id;
const isLoading = ref(false);
const form = ref();

const targetedIssue = ref<BehavioralIssue | undefined>(
  studentsStore.getSpesificStudentBehavioralIssue(issueId)
);
const schema = object({
  description: string().required("وصف المخالفة السلوكية مطلوب"),
});
const state = reactive<{
  description: string | undefined;
}>({
  description: undefined,
});
// Assign targeted issue description to description state
state.description = targetedIssue.value?.description;

watchEffect(() => {
  if (studentsStore.behavioralIssuesStudentData.length > 0) {
    targetedIssue.value =
      studentsStore.getSpesificStudentBehavioralIssue(issueId);
    // Assign targeted issue description to description state
    state.description = targetedIssue.value?.description;
  }
});

const updateIssue = async () => {
  // add issue to database
  await studentsStore.editStudentBehavioralIssue(
    issueId,
    state.description + ""
  );
  navigateTo({ name: "students-view-behavioral_issues" });
};
</script>

<template>
  <UCard class="max-w-3xl mx-auto mt-15">
    <UForm
      ref="form"
      :schema="schema"
      :state="state"
      class="grid grid-cols-1 gap-4"
      @submit="updateIssue"
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
          label="تعديل"
          :loading="isLoading"
        />
        <UButton
          variant="soft"
          class="flex w-20 py-2 justify-center font-bold lg:col-span-2 hover:cursor-pointer"
          color="secondary"
          @click="navigateTo({ name: 'students-view-behavioral-issues' })"
          label="إلغاء"
        />
      </div>
    </UForm>
  </UCard>
</template>

<style scoped></style>
