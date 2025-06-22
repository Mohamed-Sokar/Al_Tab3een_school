<script setup lang="ts">
import { object, string } from "yup";
import {
  memorization_status_options,
  level_options,
  academic_level_options,
} from "~/constants";
import type { Student } from "~/types";
import { useStudentStore } from "@/stores/students";

const { addStudent } = useStudentStore();

// const supabase = useSupabaseClient();
const route = useRoute();
const { toastSuccess, toastError } = useAppToast();
const isLoading = ref(false);
const form = ref();

const schema = object({
  full_name: string().required("الاسم مطلوب"),
  identity_number: string()
    .required("رقم الهوية مطلوب")
    .matches(/^\d{9}$/, "رقم الهوية يجب أن يتكون من 9 أرقام"),
  phone_number: string()
    .required("رقم الجوال مطلوب")
    .matches(/^\d{10}$/, "رقم الجوال يجب أن يتكون من 10 أرقام"),
  birth_date: string().required("تاريخ الميلاد مطلوب"),
  level: string().required("الصف الدراسي مطلوب"),
  memorization_status: string().required("حالة الحفظ مطلوبة"),
  //   payments_status: Object(),
  memorized_juz: string().required("الأجزاء المحفوظة مطلوبة"),
  daily_recitation: string().required("التسميع اليومي مطلوب"),
  // academic_level: string(),
  // behavioral_issues: string(),
  section: string().required("الشعبة مطلوبة"),
});

// const initialState = {
//   id: undefined,
//   full_name: undefined,
//   identity_number: undefined,
//   phone_number: undefined,
//   birth_date: undefined,
//   level: undefined,
//   memorization_status: undefined,
//   payments_status: undefined,
//   memorized_juz: undefined,
//   daily_recitation: undefined,
//   //   academic_level: undefined,
//   //   behavioral_issues: undefined,
//   section: undefined,
// };

const newStudentState = reactive<Student>({
  id: undefined,
  full_name: undefined,
  identity_number: undefined,
  phone_number: undefined,
  birth_date: undefined,
  level: undefined,
  memorization_status: undefined,
  // payments_status: undefined,
  memorized_juz: undefined,
  daily_recitation: undefined,
  academic_level: undefined,
  behavioral_issues_count: undefined,
  section: undefined,
});

const createStudent = async () => {
  addStudent({ ...newStudentState, id: Math.random() });
  setTimeout(() => {
    navigateTo("/students/view");
  }, 500);
  // resetForm();
  // try {
  //   const { error } = await supabase.from("students").insert({
  //     ...newStudentState,
  //   });
  //   if (error) throw error;
  //   toastSuccess({
  //     title: "تم إضافة الطالب بنجاح",
  //   });
  //   // إعادة ضبط النموذج
  //   Object.keys(newStudentState).forEach((key) => {
  //     newStudentState[key] = key === "payments_status" ? {} : undefined;
  //   });
  // } catch (err) {
  //   toastError({
  //     title: "حدث خطأ أثناء إضافة الطالب",
  //     description: err.message,
  //   });
  // }
};

// const resetForm = () => {
//   Object.assign(newStudentState, initialState);
//   isLoading.value = false;
//   form.value.clear(); // clear the errors from the form
// };
</script>

<template>
  <UCard class="max-w-3xl mx-auto mt-15">
    <UForm
      ref="form"
      :schema="schema"
      :state="newStudentState"
      class="grid grid-cols-1 lg:grid-cols-2 gap-4"
      @submit="createStudent"
    >
      <UFormField label="الاسم رباعي" name="full_name">
        <UInput
          v-model="newStudentState.full_name"
          placeholder="الاسم رباعي"
          label="الاسم"
          class="w-full"
        />
      </UFormField>

      <UFormField label="رقم الهوية" name="identity_number">
        <UInput
          v-model="newStudentState.identity_number"
          placeholder="رقم الهوية"
          label="رقم الهوية"
          class="w-full"
        />
      </UFormField>

      <UFormField label="رقم الجوال" name="phone_number">
        <UInput
          v-model="newStudentState.phone_number"
          placeholder="05xxxxxxxx"
          label="رقم الجوال"
          class="w-full"
        />
      </UFormField>
      <UFormField label="تاريخ الميلاد" name="birth_date">
        <UInput
          v-model="newStudentState.birth_date"
          type="date"
          class="w-full"
          placeholder="تاريخ الميلاد"
          icon="heroicons-calendar-days-solid"
        />
      </UFormField>
      <UFormField label="المستوى الدراسي" name="level">
        <USelect
          v-model="newStudentState.level"
          :items="level_options"
          type="text"
          class="w-full"
          placeholder="المستوى الدراسي"
        />
      </UFormField>

      <UFormField label="حالة الحفظ" name="memorization_status">
        <USelect
          v-model="newStudentState.memorization_status"
          :items="memorization_status_options"
          type="text"
          class="w-full"
          placeholder="حالة الحفظ"
        />
      </UFormField>
      <UFormField label="الأجزاء المحفوظة" name="memorized_juz">
        <UInput
          v-model.number="newStudentState.memorized_juz"
          type="number"
          placeholder="الأجزاء المحفوظة"
          label="الأجزاء المحفوظة"
          class="w-full"
        />
      </UFormField>
      <UFormField label="التسميع اليومي" name="daily_recitation">
        <UInput
          v-model="newStudentState.daily_recitation"
          placeholder="التسميع اليومي"
          label="التسميع اليومي"
          class="w-full"
        />
      </UFormField>
      <!-- <UFormField label="المستوى الأكاديمي العام" name="academic_level">
        <USelect
          disabled
          v-model="newStudentState.academic_level"
          :items="academic_level_options"
          placeholder="المستوى الأكاديمي العام"
          label="المستوى الأكاديمي العام"
          class="w-full"
        />
      </UFormField> -->
      <!-- <UFormField label="المخالفات السلوكية" name="behavioral_issues">
        <UInput
          disabled
          v-model="newStudentState.behavioral_issues"
          placeholder="المخالفات السلوكية"
          label="المخالفات السلوكية"
          class="w-full"
        />
      </UFormField> -->
      <UFormField label="الشعبة" name="section">
        <UInput
          v-model="newStudentState.section"
          placeholder="الشعبة"
          label="الشعبة"
          class="w-full"
        />
      </UFormField>
      <div class="col-span-2 flex gap-2 mt-5">
        <UButton
          type="submit"
          class="flex w-40 py-2 justify-center font-bold lg:col-span-2 hover:cursor-pointer"
          color="secondary"
          label="إضافة"
        />
        <UButton
          variant="soft"
          class="flex w-20 py-2 justify-center font-bold lg:col-span-2 hover:cursor-pointer"
          color="secondary"
          @click="navigateTo('/students/view')"
          label="إلغاء"
        />
      </div>
    </UForm>
  </UCard>
</template>

<style scoped></style>
