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
import { useTeacherStore } from "@/stores/teachers";

const { teachersData, addTeacherBehavioralIssue, getSpesificTeacher } =
  useTeacherStore();
const { toastSuccess } = useAppToast();
const route = useRoute();
const isLoading = ref(false);
const form = ref();

const schema = object({
  description: string().required("وصف المخالفة الإدارية مطلوب"),
});

const state = reactive({
  description: undefined,
});

const onSubmit = () => {
  // add issue to database
  isLoading.value = true;
  const teacher_id = route.params.id;
  addTeacherBehavioralIssue(teacher_id, state);

  setTimeout(() => {
    isLoading.value = false;
    toastSuccess({
      title: "تم إضافة المخالفة السلوكية",
    });
    navigateTo("/teachers/view/behavioral_issues");
  }, 500);
};
</script>

<style scoped></style>
