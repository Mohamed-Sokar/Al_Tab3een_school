<template>
  <UCard class="max-w-3xl mx-auto mt-15">
    <UForm
      ref="form"
      :schema="schema"
      :state="state"
      class="grid grid-cols-1 lg:grid-cols-2 gap-4"
      @submit="updateTeacher"
    >
      <UFormField label="الاسم رباعي" name="full_name">
        <UInput
          v-model="state.full_name"
          placeholder="الاسم رباعي"
          label="الاسم"
          class="w-full"
        />
      </UFormField>
      <UFormField label="رقم الهوية" name="identity_number">
        <UInput
          v-model.number="state.identity_number"
          placeholder="رقم الهوية"
          label="رقم الهوية"
          class="w-full"
        />
      </UFormField>
      <UFormField label="رقم الجوال" name="phone_number">
        <UInput
          v-model.number="state.phone_number"
          placeholder="05xxxxxxxx"
          label="رقم الجوال"
          class="w-full"
        />
      </UFormField>
      <UFormField label="تاريخ الميلاد" name="birth_date">
        <UInput
          type="date"
          v-model="state.birth_date"
          class="w-full"
          placeholder="تاريخ الميلاد"
          icon="heroicons-calendar-days-solid"
        />
      </UFormField>
      <UFormField label="المواد التي يتم تدريسها" name="courses">
        <USelect
          v-model="state.courses"
          :items="courses_options"
          multiple
          type="text"
          class="w-full"
          placeholder="المواد التي يتم تدريسها"
        />
      </UFormField>

      <div class="col-span-2 flex gap-2 mt-5">
        <UButton
          type="submit"
          class="flex w-40 py-2 justify-center font-bold lg:col-span-2 hover:cursor-pointer"
          color="secondary"
          :loading="isLoading"
          label="تعديل"
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
import { array, object, string } from "yup";
import { courses_options, teachers } from "~/constants";
import { type Teacher } from "~/types";

const schema = object({
  full_name: string().required("الاسم مطلوب"),
  identity_number: string()
    .required("رقم الهوية مطلوب")
    .matches(/^\d{9}$/, "رقم الهوية يجب أن يتكون من 9 أرقام"),
  phone_number: string()
    .required("رقم الجوال مطلوب")
    .matches(/^\d{10}$/, "رقم الجوال يجب أن يتكون من 10 أرقام"),
  birth_date: string().required("تاريخ الميلاد مطلوب"),
  courses: array().required("المواد التي يتم تدريسها مطلوبة"),
});

const state = reactive<Teacher>({
  id: undefined,
  full_name: undefined,
  identity_number: undefined,
  phone_number: undefined,
  birth_date: undefined,
  courses: undefined,
});

const route = useRoute();
const { toastSuccess } = useAppToast();
const isLoading = ref(false);
const form = ref();

const targetedTeacher = teachers.find(
  (student) => student.id.toString() === route.params.id.toString()
);

Object.assign(state, targetedTeacher);

const updateTeacher = async () => {
  isLoading.value = true;
  const teacherIndex = teachers.findIndex(
    (teacher) => teacher.id.toString() === route.params.id.toString()
  );

  teachers[teacherIndex] = state ?? {
    id: 0,
    identity_number: "123456789",
    full_name: "",
    phone_number: "1234567891",
    birth_date: new Date().toISOString(),
    courses: [],
  };

  setTimeout(() => {
    isLoading.value = false;
    toastSuccess({
      title: "تم تحديث بيانات المعلم بنجاح",
    });
    navigateTo("/teachers/view");
  }, 500);
};
</script>

<style scoped></style>
