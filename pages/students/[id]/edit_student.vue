<script setup lang="ts">
import { object, string } from "yup";
import {
  memorization_status_options,
  level_options,
  academic_level_options,
} from "~/constants";
import { type Student } from "~/types";
import { useStudentStore } from "@/stores/students";

const { getSpesificStudent, editStudent } = useStudentStore();

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
  // payments_status: Object(),
  memorized_juz: string(),
  daily_recitation: string(),
  academic_level: string(),
  behavioral_issues: string(),
  section: string(),
});

const state = reactive<Student>({
  id: undefined,
  full_name: undefined,
  identity_number: undefined,
  phone_number: undefined,
  birth_date: undefined,
  level: undefined,
  memorization_status: undefined,
  memorized_juz: undefined,
  daily_recitation: undefined,
  academic_level: undefined,
  behavioral_issues_count: 0,
  section: undefined,
});

const route = useRoute();
const { toastSuccess, toastError } = useAppToast();
const isLoading = ref(false);
const form = ref();

const targetedStudent = getSpesificStudent(+route.params.id);
Object.assign(state, targetedStudent);

const updateStudent = async () => {
  isLoading.value = true;
  editStudent(+route.params.id, state);

  setTimeout(() => {
    isLoading.value = false;
    toastSuccess({
      title: "تم تحديث بيانات الطالب بنجاح",
    });
    navigateTo("/students/view");
  }, 500);
};
</script>

<template>
  <UCard class="max-w-3xl mx-auto mt-15">
    <UForm
      ref="form"
      :schema="schema"
      :state="state"
      class="grid grid-cols-2 gap-4"
      @submit="updateStudent"
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
          v-model="state.identity_number"
          placeholder="رقم الهوية"
          label="رقم الهوية"
          class="w-full"
        />
      </UFormField>

      <UFormField label="رقم الجوال" name="phone_number">
        <UInput
          v-model="state.phone_number"
          placeholder="05xxxxxxxx"
          label="رقم الجوال"
          class="w-full"
        />
      </UFormField>
      <UFormField label="تاريخ الميلاد" name="birth_date">
        <UInput
          v-model="state.birth_date"
          type="date"
          class="w-full"
          placeholder="تاريخ الميلاد"
          icon="heroicons-calendar-days-solid"
        />
      </UFormField>
      <UFormField label="المستوى الدراسي" name="level">
        <USelect
          v-model="state.level"
          :items="level_options"
          type="text"
          class="w-full"
          placeholder="المستوى الدراسي"
        />
      </UFormField>

      <UFormField label="حالة الحفظ" name="memorization_status">
        <USelect
          v-model="state.memorization_status"
          :items="memorization_status_options"
          type="text"
          class="w-full"
          placeholder="حالة الحفظ"
        />
      </UFormField>
      <UFormField label="الأجزاء المحفوظة" name="memorized_juz">
        <UInput
          v-model.number="state.memorized_juz"
          type="number"
          placeholder="الأجزاء المحفوظة"
          label="الأجزاء المحفوظة"
          class="w-full"
        />
      </UFormField>
      <UFormField label="التسميع اليومي" name="daily_recitation">
        <UInput
          v-model="state.daily_recitation"
          placeholder="التسميع اليومي"
          label="التسميع اليومي"
          class="w-full"
        />
      </UFormField>
      <UFormField label="المستوى الأكاديمي العام" name="academic_level">
        <USelect
          v-model="state.academic_level"
          :items="academic_level_options"
          placeholder="المستوى الأكاديمي العام"
          label="المستوى الأكاديمي العام"
          class="w-full"
        />
      </UFormField>
      <UFormField label="المخالفات السلوكية" name="behavioral_issues">
        <UInput
          v-model="state.behavioral_issues"
          placeholder="المخالفات السلوكية"
          label="المخالفات السلوكية"
          class="w-full"
        />
      </UFormField>
      <UFormField label="الشعبة" name="section">
        <UInput
          v-model="state.section"
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
          label="تعديل"
          :loading="isLoading"
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
