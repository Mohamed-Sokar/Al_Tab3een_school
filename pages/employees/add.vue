<script setup lang="ts">
import { array, date, object, string } from "yup";
import {
  courses_options,
  gender_options,
  job_title_options,
  marital_status_options,
} from "~/constants";
import type { Employee } from "~/types";

const employeesStore = useEmployeesStore();
const { convertArabicToEnglishNumbers } = useNumberConverter();

const form = ref();

const schema = object({
  // full_name: string().required("الاسم مطلوب"),
  first_name: string().required("الاسم الأول مطلوب"),
  second_name: string().required("اسم الوالد مطلوب"),
  third_name: string().required("اسم الجد مطلوب"),
  last_name: string().required("اسم العائلة مطلوب"),
  identity_number: string()
    .required("رقم الهوية مطلوب")
    .matches(
      /^[0-9٠-٩]{9}$/,
      "يجب إدخال 9 رقمًا فقط بالأرقام العربية أو الإنجليزية"
    ),
  whatsapp_number: string()
    .required("رقم الواتس مطلوب")
    .matches(
      /^[0-9٠-٩]{12}$/,
      "يجب إدخال 12 رقمًا فقط بالأرقام العربية أو الإنجليزية"
    ),
  salary: string()
    .required("الراتب مطلوب")
    .matches(
      /^[0-9٠-٩]+$/,
      "يجب إدخال أرقام صحيحة فقط بالأرقام العربية أو الإنجليزية"
    ),
  phone_number: string()
    .required("رقم الجوال مطلوب")
    .matches(
      /^[0-9٠-٩]{10}$/,
      "يجب إدخال 10 رقمًا فقط بالأرقام العربية أو الإنجليزية"
    ),
  enrollment_date: date().required("تاريخ التسجيل مطلوب"),
  birth_date: date().required("تاريخ الميلاد مطلوب"),
  subject: array().nullable(),
  masjed: string().required("المسجد مطلوب"),
  address: string().required("العنوان مطلوب"),
  job_title: string().required("المسمى الوظيفي مطلوب"),
  children_count: string()
    .required("عدد الأطفال مطلوب")
    .matches(/^[0-9٠-٩]/, "يجب إدخال أرقام عربية أو إنجليزية"),
  marital_status: string().required("الحالة الاجتماعية مطلوبة"),
  gender: string().required("الجنس مطلوب"),
});

const state = reactive<Employee>({
  first_name: undefined,
  second_name: undefined,
  third_name: undefined,
  last_name: undefined,
  identity_number: undefined,
  phone_number: undefined,
  birth_date: undefined,
  enrollment_date: undefined,
  job_title: undefined,
  subject: undefined,
  masjed: undefined,
  whatsapp_number: undefined,
  children_count: undefined,
  marital_status: undefined,
  address: undefined,
  salary: undefined,
  gender: undefined,
});

const createTeacher = async () => {
  state.whatsapp_number = convertArabicToEnglishNumbers(state.whatsapp_number);
  state.phone_number = convertArabicToEnglishNumbers(state.phone_number);
  state.identity_number = convertArabicToEnglishNumbers(state.identity_number);
  state.children_count = convertArabicToEnglishNumbers(state.children_count);
  state.salary = convertArabicToEnglishNumbers(state.salary);

  console.log(state);
  await employeesStore.addEmployee(state);
  navigateTo({ name: "employees-view" });
};

// Getters
const birth_date_string = computed({
  get() {
    if (!state.birth_date) return "";
    if (typeof state.birth_date === "string") {
      // If already in YYYY-MM-DD format, return as is
      if (/^\d{4}-\d{2}-\d{2}$/.test(state.birth_date)) {
        return state.birth_date;
      }
      // Try to parse and format
      const d = new Date(state.birth_date);
      if (!isNaN(d.getTime())) {
        return d.toISOString().slice(0, 10);
      }
      return "";
    }
    if (state.birth_date instanceof Date) {
      return state.birth_date.toISOString().slice(0, 10);
    }
    return "";
  },
  set(val: Date) {
    state.birth_date = val;
  },
});
const enrollment_date_string = computed({
  get() {
    if (!state.enrollment_date) return "";
    if (typeof state.enrollment_date === "string") {
      // If already in YYYY-MM-DD format, return as is
      if (/^\d{4}-\d{2}-\d{2}$/.test(state.enrollment_date)) {
        return state.enrollment_date;
      }
      // Try to parse and format
      const d = new Date(state.enrollment_date);
      if (!isNaN(d.getTime())) {
        return d.toISOString().slice(0, 10);
      }
      return "";
    }
    if (state.enrollment_date instanceof Date) {
      return state.enrollment_date.toISOString().slice(0, 10);
    }
    return "";
  },
  set(val: Date) {
    state.enrollment_date = val;
  },
});
</script>

<template>
  <div class="max-w-3xl mx-auto mt-10">
    <div class="flex justify-between items-center mb-5">
      <h2 class="text-xl font-bold text-info">المعلومات الأساسية</h2>
      <div>
        <UButton
          :to="{ name: 'employees-view' }"
          icon="heroicons-arrow-left-16-solid"
          variant="subtle"
          color="secondary"
        />
      </div>
    </div>
    <UCard>
      <UForm
        ref="form"
        :schema="schema"
        :state="state"
        class="grid grid-cols-1 lg:grid-cols-2 gap-4"
        @submit="createTeacher"
      >
        <UFormField label="الاسم الأول" name="first_name">
          <UInput
            v-model="state.first_name"
            placeholder="الاسم الأول"
            label="الاسم الأول"
            class="w-full"
          />
        </UFormField>
        <UFormField label="الاسم الثاني" name="second_name">
          <UInput
            v-model="state.second_name"
            placeholder="الاسم الثاني"
            label="الاسم الثاني"
            class="w-full"
          />
        </UFormField>
        <UFormField label="الاسم الثالث" name="third_name">
          <UInput
            v-model="state.third_name"
            placeholder="الاسم الثالث"
            label="الاسم الثالث"
            class="w-full"
          />
        </UFormField>
        <UFormField label="الاسم الرابع" name="last_name">
          <UInput
            v-model="state.last_name"
            placeholder="الاسم الرابع"
            label="الاسم الرابع"
            class="w-full"
          />
        </UFormField>
        <UFormField label="الجنس" name="gender">
          <USelect
            v-model="state.gender"
            :items="gender_options"
            placeholder="الجنس"
            label="الجنس"
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
            v-model="state.phone_number"
            placeholder="05xxxxxxxx"
            label="رقم الجوال"
            class="w-full"
          />
        </UFormField>
        <UFormField label="رقم الواتس" name="whatsapp_number">
          <UInput
            v-model="state.whatsapp_number"
            placeholder="97xxxxxxxxxx"
            label="رقم الواتس"
            class="w-full"
          />
        </UFormField>
        <UFormField label="تاريخ الميلاد" name="birth_date">
          <UInput
            type="date"
            v-model="birth_date_string"
            class="w-full"
            placeholder="تاريخ الميلاد"
            icon="heroicons-calendar-days-solid"
          />
        </UFormField>
        <UFormField label="تاريخ التسجيل في المدرسة" name="enrollment_date">
          <UInput
            type="date"
            v-model="enrollment_date_string"
            class="w-full"
            placeholder="تاريخ التسجيل"
            icon="heroicons-calendar-days-solid"
          />
        </UFormField>
        <UFormField label="الحالة الاجتماعية" name="marital_status">
          <USelect
            v-model="state.marital_status"
            :items="marital_status_options"
            placeholder="الحالة الاجتماعية"
            label="الحالة الاجتماعية"
            class="w-full"
          />
        </UFormField>
        <UFormField label="المسمى الوظيفي" name="job_title">
          <USelect
            v-model="state.job_title"
            :items="job_title_options"
            placeholder="المسمى الوظيفي"
            label="المسمى الوظيفي"
            class="w-full"
          />
        </UFormField>
        <UFormField label="العنوان" name="address">
          <UInput
            v-model="state.address"
            placeholder="العنوان"
            label="العنوان"
            class="w-full"
          />
        </UFormField>
        <UFormField label="المسجد" name="masjed">
          <UInput
            v-model="state.masjed"
            placeholder="المسجد"
            label="المسجد"
            class="w-full"
          />
        </UFormField>
        <UFormField label="عدد الأطفال" name="children_count">
          <UInput
            v-model="state.children_count"
            placeholder="عدد الأطفال"
            label="عدد الأطفال"
            class="w-full"
          />
        </UFormField>
        <UFormField label="المادة" name="subject">
          <USelect
            :disabled="state.job_title !== 'معلم'"
            multiple
            v-model="state.subject"
            :items="courses_options"
            type="text"
            class="w-full"
            placeholder="المواد التي يتم تدريسها"
          />
        </UFormField>
        <UFormField label="الراتب" name="salary">
          <UInput v-model="state.salary" class="w-full" placeholder="الراتب" />
        </UFormField>

        <div class="lg:col-span-2 flex gap-2 mt-5">
          <UButton
            type="submit"
            class="flex w-40 py-2 justify-center font-bold lg:col-span-2 hover:cursor-pointer"
            color="secondary"
            :loading="employeesStore.loading"
            label="إضافة"
          />
          <UButton
            variant="soft"
            class="flex w-20 py-2 justify-center font-bold lg:col-span-2 hover:cursor-pointer"
            color="secondary"
            @click="navigateTo('/employees/view')"
            label="إلغاء"
          />
        </div>
      </UForm>
    </UCard>
  </div>
</template>

<style scoped></style>
