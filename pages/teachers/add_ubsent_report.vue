<template>
  <UCard class="max-w-3xl mx-auto mt-15">
    <UForm
      ref="form"
      :schema="schema"
      :state="state"
      class="grid grid-cols-1 gap-4"
      @submit="onSubmit"
    >
      <UFormField label="أسماء المدرسين الغياب" name="teachers">
        <USelect
          :items="fiteredTeachers"
          multiple
          v-model="state.teachers"
          placeholder="أدخل أسماء المدرسين الغياب"
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
import { array, object } from "yup";
import { teachers } from "~/constants";

const { toastSuccess } = useAppToast();
const isLoading = ref(false);
const form = ref();

const schema = object({
  teachers: array().required("أسماء المدرسين مطلوب"),
});

const state = reactive({
  teachers: undefined,
});

const fiteredTeachers = computed(() =>
  teachers.map((teacher) => teacher.full_name)
);

const onSubmit = () => {
  // add issue to database
  // isLoading.value = true;
  // behavioralIssuesTeacher.unshift({
  //   id: Math.random(),
  //   teacher_name: targetedTeacher?.full_name,
  //   teacher_id: targetedTeacher?.id,
  //   date: new Date().toISOString().split("T")[0],
  //   description: state.description,
  // });
  // setTimeout(() => {
  //   isLoading.value = false;
  //   toastSuccess({
  //     title: "تم إضافة الكشف بنجاح",
  //   });
  //   navigateTo("/teachers/view/ubsent");
  // }, 500);
};
</script>

<style scoped></style>
