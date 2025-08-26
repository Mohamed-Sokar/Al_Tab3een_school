<script setup lang="ts">
import { number, object, string, date } from "yup";
import {
  memorization_status_options,
  guardian_name_kinship_options,
  daily_recitation_options,
} from "~/constants";
import type { Student } from "~/types";
import { useStudentStore } from "@/stores/students";

const studentsStore = useStudentStore();
const { convertArabicToEnglishNumbers } = useNumberConverter();
const form = ref();

const schema = object({
  first_name: string().required("الاسم الأول مطلوب"),
  second_name: string().required("اسم الوالد مطلوب"),
  third_name: string().required("اسم الجد مطلوب"),
  last_name: string().required("اسم العائلة مطلوب"),
  guardian_name: string().required("اسم ولي الأمر مطلوب"),
  guardian_name_kinship: string().required("صلة قرابة ولي الأمر مطلوبة"),
  whatsapp_number: string()
    .required("رقم الواتس مطلوب")
    .matches(
      /^[0-9٠-٩]{12}$/,
      "يجب إدخال 12 رقمًا فقط بالأرقام العربية أو الإنجليزية"
    ),
  // .matches(/^\d{12}$/, "رقم الواتس يجب أن يتكون من 12 أرقام"),
  identity_number: string()
    .required("رقم الهوية مطلوب")
    .matches(
      /^[0-9٠-٩]{9}$/,
      "يجب إدخال 9 رقمًا فقط بالأرقام العربية أو الإنجليزية"
    ),
  father_identity_number: string()
    .required("رقم هوية الأب مطلوب")
    .matches(
      /^[0-9٠-٩]{9}$/,
      "يجب إدخال 9 رقمًا فقط بالأرقام العربية أو الإنجليزية"
    ),
  phone_number: string()
    .required("رقم الجوال مطلوب")
    .matches(
      /^[0-9٠-٩]{10}$/,
      "يجب إدخال 10 رقمًا فقط بالأرقام العربية أو الإنجليزية"
    ),
  birth_date: date()
    .required("تاريخ الميلاد مطلوب")
    .min(new Date("2009-01-01"), "يجب أن يكون التاريخ بعد عام 2009"),
  // birth_date: string().required("تاريخ الميلاد مطلوب"),
  address: string().required("العنوان مطلوب"),
  masjed: string().required("المسجد مطلوب"),
  level_id: number().required("الصف الدراسي مطلوب"),
  memorization_status: string().required("حالة الحفظ مطلوبة"),
  memorized_juz: number().required("الأجزاء المحفوظة مطلوبة"),
  daily_recitation: string().required("التسميع اليومي مطلوب"),
});

const state = reactive<Student>({
  // id: undefined,
  // full_name: undefined,
  first_name: undefined,
  second_name: undefined,
  third_name: undefined,
  last_name: undefined,
  level_id: undefined,
  guardian_name: undefined,
  guardian_name_kinship: guardian_name_kinship_options[0],
  whatsapp_number: undefined,
  identity_number: undefined,
  father_identity_number: undefined,
  phone_number: undefined,
  birth_date: undefined,
  masjed: undefined,
  address: undefined,
  memorization_status: undefined,
  memorized_juz: undefined as number | undefined,
  daily_recitation: undefined,
  // class_group: undefined,
});

const createStudent = async () => {
  state.whatsapp_number = convertArabicToEnglishNumbers(state.whatsapp_number);
  state.phone_number = convertArabicToEnglishNumbers(state.phone_number);
  state.identity_number = convertArabicToEnglishNumbers(state.identity_number);
  state.father_identity_number = convertArabicToEnglishNumbers(
    state.father_identity_number
  );

  await studentsStore.addStudent({ ...state });
  navigateTo("/students/view");
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
</script>

<template>
  <UCard class="max-w-3xl mx-auto mt-15">
    <UForm
      ref="form"
      :schema="schema"
      :state="state"
      class="grid grid-cols-1 lg:grid-cols-2 gap-4"
      @submit="createStudent"
    >
      <UFormField required label="الاسم الأول" name="first_name">
        <UInput
          v-model="state.first_name"
          placeholder="الاسم الأول"
          label="الاسم الأول"
          class="w-full"
        />
      </UFormField>
      <UFormField required label="الاسم الثاني" name="second_name">
        <UInput
          v-model="state.second_name"
          placeholder="الاسم الثاني"
          label="الاسم الثاني"
          class="w-full"
        />
      </UFormField>
      <UFormField required label="الاسم الثالث" name="third_name">
        <UInput
          v-model="state.third_name"
          placeholder="الاسم الثالث"
          label="الاسم الثالث"
          class="w-full"
        />
      </UFormField>
      <UFormField required label="الاسم الرابع" name="last_name">
        <UInput
          v-model="state.last_name"
          placeholder="الاسم الرابع"
          label="الاسم الرابع"
          class="w-full"
        />
      </UFormField>
      <UFormField required label="المستوى الدراسي" name="level_id">
        <USelect
          v-model="state.level_id"
          :items="
            useLevelsStore().levelsData.map((level) => ({
              label: level.title,
              value: level.id,
            }))
          "
          type="text"
          class="w-full"
          placeholder="المستوى الدراسي"
        />
      </UFormField>
      <UFormField required label="اسم ولي الأمر" name="guardian_name">
        <UInput
          v-model="state.guardian_name"
          placeholder="اسم ولي الأمر"
          label="اسم ولي الأمر"
          class="w-full"
        />
      </UFormField>
      <UFormField
        required
        label="صلة قرابة ولي الأمر"
        name="guardian_name_kinship"
      >
        <USelect
          :items="guardian_name_kinship_options"
          v-model="state.guardian_name_kinship"
          placeholder="صلة قرابة ولي الأمر"
          label="صلة قرابة ولي الأمر"
          class="w-full"
        />
      </UFormField>
      <UFormField required label="رقم الواتس" name="whatsapp_number">
        <UInput
          v-model="state.whatsapp_number"
          placeholder="97xxxxxxxxxx"
          label="رقم الواتس"
          class="w-full"
        />
      </UFormField>
      <UFormField required label="رقم الهوية" name="identity_number">
        <UInput
          v-model="state.identity_number"
          placeholder="رقم الهوية"
          label="رقم الهوية"
          class="w-full"
        />
      </UFormField>
      <UFormField required label="رقم هوية الأب" name="father_identity_number">
        <UInput
          v-model="state.father_identity_number"
          placeholder="رقم هوية الأب"
          label="رقم هوية الأب"
          class="w-full"
        />
      </UFormField>
      <UFormField required label="تاريخ الميلاد" name="birth_date">
        <UInput
          v-model="birth_date_string"
          type="date"
          class="w-full"
          placeholder="تاريخ الميلاد"
          icon="heroicons-calendar-days-solid"
        />
      </UFormField>
      <UFormField required label="رقم الجوال" name="phone_number">
        <UInput
          v-model="state.phone_number"
          placeholder="05xxxxxxxx"
          label="رقم الجوال"
          class="w-full"
        />
      </UFormField>
      <UFormField required label="العنوان" name="address">
        <UInput
          v-model="state.address"
          placeholder="العنوان"
          label="العنوان"
          class="w-full"
        />
      </UFormField>
      <UFormField required label="المسجد" name="masjed">
        <UInput
          v-model="state.masjed"
          placeholder="المسجد"
          label="المسجد"
          class="w-full"
        />
      </UFormField>
      <UFormField required label="حالة الحفظ" name="memorization_status">
        <USelect
          v-model="state.memorization_status"
          :items="memorization_status_options"
          type="text"
          class="w-full"
          placeholder="حالة الحفظ"
        />
      </UFormField>
      <UFormField required label="الأجزاء المحفوظة" name="memorized_juz">
        <USelect
          :items="
            Array.from({ length: 30 }, (_, i) => ({
              label: `${i + 1} جزء`,
              value: i + 1,
            }))
          "
          v-model="state.memorized_juz"
          type="number"
          placeholder="الأجزاء المحفوظة"
          label="الأجزاء المحفوظة"
          class="w-full"
        />
      </UFormField>
      <UFormField required label="التسميع اليومي" name="daily_recitation">
        <USelect
          :items="daily_recitation_options"
          v-model="state.daily_recitation"
          placeholder="التسميع اليومي"
          label="التسميع اليومي"
          class="w-full"
        />
      </UFormField>
      <!-- <UFormField required label="المستوى الأكاديمي العام" name="academic_level">
        <USelect
          v-model="state.academic_level"
          :items="academic_level_options"
          placeholder="المستوى الأكاديمي العام"
          label="المستوى الأكاديمي العام"
          class="w-full"
        />
      </UFormField> -->
      <!-- <UFormField required label="الشعبة" name="class_group">
        <UInput
          v-model="state.class_group"
          placeholder="الشعبة"
          label="الشعبة"
          class="w-full"
        />
      </UFormField> -->
      <div class="lg:col-span-2 flex gap-2 mt-5">
        <UButton
          type="submit"
          class="flex w-40 py-2 justify-center font-bold lg:col-span-2 hover:cursor-pointer"
          color="secondary"
          label="إضافة"
          :loading="studentsStore.loading"
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
