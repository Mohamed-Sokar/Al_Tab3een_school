<script setup lang="ts">
import { array, date, object, string } from "yup";
import { courses_options, marital_status_options } from "~/constants";
import { type Employee } from "~/types";

const employeesStore = useEmployeesStore();

const schema = object({
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
  phone_number: string()
    .required("رقم الجوال مطلوب")
    .matches(
      /^[0-9٠-٩]{10}$/,
      "يجب إدخال 10 رقمًا فقط بالأرقام العربية أو الإنجليزية"
    ),
  enrollment_date: date().required("تاريخ التسجيل مطلوب"),
  birth_date: date().required("تاريخ الميلاد مطلوب"),
  subject: array().required("المادة التي يتم تدريسها مطلوبة"),
  children_count: string()
    .required("عدد الأطفال مطلوب")
    .matches(/^[0-9٠-٩]/, "يجب إدخال أرقام عربية أو إنجليزية"),
  marital_status: string().required("الحالة الاجتماعية مطلوبة"),
});

const state = reactive<Employee>({
  first_name: undefined,
  second_name: undefined,
  third_name: undefined,
  last_name: undefined,
  whatsapp_number: undefined,
  identity_number: undefined,
  phone_number: undefined,
  marital_status: undefined,
  enrollment_date: undefined,
  subject: undefined,
  birth_date: undefined,
  address: undefined,
  created_at: undefined,
  masjed: undefined,
});

const route = useRoute();
const form = ref();

const teacherId = Array.isArray(route.params.id)
  ? route.params.id[0]
  : route.params.id ?? "";

const targetedTeacher = ref<Employee | undefined>(
  employeesStore.getSpesificEmployee(teacherId)
);

watchEffect(() => {
  if (employeesStore.sortedEmployees.length > 0) {
    targetedTeacher.value = employeesStore.getSpesificEmployee(teacherId);

    const teacherData = { ...targetedTeacher.value };
    console.log(teacherData);
    // ✅ تأكد أن subject يتحول من نص إلى مصفوفة
    if (typeof teacherData.subject === "string") {
      console.log("string");
      try {
        teacherData.subject = JSON.parse(teacherData.subject);
      } catch (e) {
        teacherData.subject = [];
      }
    }
    Object.assign(state, teacherData);
  }
});

const updateTeacher = async () => {
  console.log(state);
  await employeesStore.updateEmployee(teacherId, state);
  navigateTo({ name: "employees-view" });
};

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
  <UCard class="max-w-3xl mx-auto mt-15">
    <UForm
      ref="form"
      :schema="schema"
      :state="state"
      class="grid grid-cols-1 lg:grid-cols-2 gap-4"
      @submit="updateTeacher"
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
      <UFormField label="تاريخ التسجيل" name="enrollment_date">
        <UInput
          type="date"
          v-model="enrollment_date_string"
          class="w-full"
          placeholder="تاريخ التسجيل"
          icon="heroicons-calendar-days-solid"
        />
      </UFormField>
      <UFormField label="المادة" name="subject">
        <USelect
          multiple
          v-model="state.subject"
          :items="courses_options"
          type="text"
          class="w-full"
          placeholder="المواد التي يتم تدريسها"
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
      <UFormField label="العنوان" name="address">
        <UInput
          v-model="state.address"
          placeholder="العنوان"
          label="العنوان"
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

      <div class="col-span-2 flex gap-2 mt-5">
        <UButton
          type="submit"
          class="flex w-40 py-2 justify-center font-bold lg:col-span-2 hover:cursor-pointer"
          color="secondary"
          :loading="employeesStore.loading"
          label="تعديل"
        />
        <UButton
          variant="soft"
          class="flex w-20 py-2 justify-center font-bold lg:col-span-2 hover:cursor-pointer"
          color="secondary"
          @click="navigateTo({ name: 'employees-view' })"
          label="إلغاء"
        />
      </div>
    </UForm>
  </UCard>
</template>

<style scoped></style>
