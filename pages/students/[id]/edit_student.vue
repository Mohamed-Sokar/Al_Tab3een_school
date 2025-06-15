<template>
  <UCard class="max-w-3xl mx-auto mt-15">
    <UForm
      ref="form"
      :schema="schema"
      :state="newStudent"
      class="grid grid-cols-2 gap-4"
      @submit="updateStudent"
    >
      <UFormField label="الاسم رباعي" name="full_name">
        <UInput
          v-model="newStudent.full_name"
          placeholder="الاسم رباعي"
          label="الاسم"
          class="w-full"
          :disabled="isDisabled"
        />
      </UFormField>

      <UFormField label="رقم الهوية" name="identity_number">
        <UInput
          v-model="newStudent.identity_number"
          placeholder="رقم الهوية"
          label="رقم الهوية"
          class="w-full"
          :disabled="isDisabled"
        />
      </UFormField>

      <UFormField label="رقم الجوال" name="phone_number">
        <UInput
          v-model="newStudent.phone_number"
          placeholder="05xxxxxxxx"
          label="رقم الجوال"
          class="w-full"
          :disabled="isDisabled"
        />
      </UFormField>
      <UFormField label="تاريخ الميلاد" name="birth_date">
        <UInput
          v-model="newStudent.birth_date"
          type="date"
          class="w-full"
          :disabled="isDisabled"
          placeholder="تاريخ الميلاد"
          icon="heroicons-calendar-days-solid"
        />
      </UFormField>
      <UFormField label="المستوى الدراسي" name="level">
        <USelect
          v-model="newStudent.level"
          :items="level_options"
          type="text"
          class="w-full"
          :disabled="isDisabled"
          placeholder="المستوى الدراسي"
        />
      </UFormField>

      <UFormField label="حالة الحفظ" name="memorization_status">
        <USelect
          v-model="newStudent.memorization_status"
          :items="memorization_status_options"
          type="text"
          class="w-full"
          :disabled="isDisabled"
          placeholder="حالة الحفظ"
        />
      </UFormField>
      <UFormField label="الأجزاء المحفوظة" name="memorized_juz">
        <UInput
          v-model.number="newStudent.memorized_juz"
          type="number"
          placeholder="الأجزاء المحفوظة"
          label="الأجزاء المحفوظة"
          class="w-full"
          :disabled="isDisabled"
        />
      </UFormField>
      <UFormField label="التسميع اليومي" name="daily_recitation">
        <UInput
          v-model="newStudent.daily_recitation"
          placeholder="التسميع اليومي"
          label="التسميع اليومي"
          class="w-full"
          :disabled="isDisabled"
        />
      </UFormField>
      <UFormField label="المستوى الأكاديمي العام" name="academic_level">
        <USelect
          v-model="newStudent.academic_level"
          :items="academic_level_options"
          placeholder="المستوى الأكاديمي العام"
          label="المستوى الأكاديمي العام"
          class="w-full"
          :disabled="isDisabled"
        />
      </UFormField>
      <UFormField label="المخالفات السلوكية" name="behavioral_issues">
        <UInput
          v-model="newStudent.behavioral_issues"
          placeholder="المخالفات السلوكية"
          label="المخالفات السلوكية"
          class="w-full"
          :disabled="isDisabled"
        />
      </UFormField>
      <UFormField label="الشعبة" name="section">
        <UInput
          v-model="newStudent.section"
          placeholder="الشعبة"
          label="الشعبة"
          class="w-full"
          :disabled="isDisabled"
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

<script setup lang="ts">
import { object, string } from "yup";
import {
  memorization_status_options,
  level_options,
  academic_level_options,
  students,
} from "~/constants";
import { type Student } from "~/types";

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
  id: Math.random(),
  full_name: "Mohamed Sokar",
  identity_number: "123456",
  phone_number: "123456",
  birth_date: new Date().toISOString().split("T")[0],
  level: "الصف التاسع",
  memorization_status: "حافظ قوي",
  // payments_status: { يناير: "مدفوعة" },
  memorized_juz: "30",
  daily_recitation: "جزء",
  academic_level: "ممتاز",
  behavioral_issues: "لا يوجد",
  section: "1",
});

const isDisabled = ref(false);
const supabase = useSupabaseClient();
const route = useRoute();
const { toastSuccess, toastError } = useAppToast();
const isLoading = ref(false);
const form = ref();
const newStudent = ref();
const studentsData = ref(students);
// const isEditing = computed(() => !!props.student);

const targetedStudent = studentsData.value.find(
  (student) => student.id.toString() === route.params.id.toString()
);
newStudent.value = targetedStudent;

const updateStudent = async () => {
  isLoading.value = true;
  const studentIndex = studentsData.value.findIndex(
    (student) => student.id.toString() === route.params.id.toString()
  );
  studentsData.value[studentIndex] = newStudent.value;

  setTimeout(() => {
    isLoading.value = false;
    toastSuccess({
      title: "تم تحديث بيانات الطالب بنجاح",
    });
    navigateTo("/students/view");
  }, 500);
};

const resetForm = () => {
  //   Object.assign(state, initialState);
  isLoading.value = false;
  form.value.clear(); // clear the errors from the form
};
</script>

<style scoped></style>
