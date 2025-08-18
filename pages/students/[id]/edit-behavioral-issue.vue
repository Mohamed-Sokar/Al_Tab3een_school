<script setup lang="ts">
import { object, string } from "yup";
import type { BehavioralIssue } from "~/types";

const behavioralIssuesStore = useStudentBehavioralIssues();

const route = useRoute();
const reportId = +route.params.id;
const form = ref();

const schema = object({
  description: string().required("وصف المخالفة السلوكية مطلوب"),
});

const state = reactive<{
  id: number | undefined;
  description: string | undefined;
}>({
  id: undefined,
  description: undefined,
});

const updateIssue = async () => {
  // add issue to database
  await behavioralIssuesStore.saveBehavioralIssue(state);
  navigateTo({ name: "students-view-behavioral_issues" });
};

onMounted(async () => {
  const report = await behavioralIssuesStore.getReportById(reportId);
  state.id = report?.id;
  state.description = (report as BehavioralIssue).description;
});
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
          :loading="behavioralIssuesStore.loading"
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
          :loading="behavioralIssuesStore.loading"
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
