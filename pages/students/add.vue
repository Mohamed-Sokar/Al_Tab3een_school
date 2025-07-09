<script setup lang="ts">
import { number, object, string } from "yup";
import {
  memorization_status_options,
  guardian_name_kinship_options,
  daily_recitation_options,
} from "~/constants";
import type { Student } from "~/types";
import { useStudentStore } from "@/stores/students";

const studentsStore = useStudentStore();
const form = ref();

const schema = object({
  // full_name: string().required("الاسم مطلوب"),
  first_name: string().required("الاسم الأول مطلوب"),
  second_name: string().required("اسم الوالد مطلوب"),
  third_name: string().required("اسم الجد مطلوب"),
  last_name: string().required("اسم العائلة مطلوب"),
  guardian_name: string().required("اسم ولي الأمر مطلوب"),
  guardian_name_kinship: string().required("صلة قرابة ولي الأمر مطلوبة"),
  whatsapp_number: string()
    .required("رقم الواتس مطلوب")
    .matches(/^\d{12}$/, "رقم الواتس يجب أن يتكون من 12 أرقام"),
  identity_number: string()
    .required("رقم الهوية مطلوب")
    .matches(/^\d{9}$/, "رقم الهوية يجب أن يتكون من 9 أرقام"),
  father_identity_number: string()
    .required("رقم هوية الأب مطلوب")
    .matches(/^\d{9}$/, "رقم الهوية يجب أن يتكون من 9 أرقام"),
  phone_number: string()
    .required("رقم الجوال مطلوب")
    .matches(/^\d{10}$/, "رقم الجوال يجب أن يتكون من 10 أرقام"),
  birth_date: string().required("تاريخ الميلاد مطلوب"),
  address: string().required("العنوان مطلوب"),
  masjed: string().required("المسجد مطلوب"),
  level_id: number().required("الصف الدراسي مطلوب"),
  memorization_status: string().required("حالة الحفظ مطلوبة"),
  memorized_juz: number().required("الأجزاء المحفوظة مطلوبة"),
  daily_recitation: string().required("التسميع اليومي مطلوب"),
  // class_group: string().required("الشعبة مطلوبة"),
});

const newStudentState = reactive<Student>({
  // id: undefined,
  // full_name: undefined,
  first_name: undefined,
  second_name: undefined,
  third_name: undefined,
  last_name: undefined,
  guardian_name: undefined,
  guardian_name_kinship: guardian_name_kinship_options[0],
  whatsapp_number: undefined,
  identity_number: undefined,
  father_identity_number: undefined,
  phone_number: undefined,
  birth_date: undefined,
  level_id: undefined,
  masjed: undefined,
  address: undefined,
  memorization_status: undefined,
  memorized_juz: undefined as number | undefined,
  daily_recitation: undefined,
  // class_group: undefined,
});

const createStudent = async () => {
  console.log(newStudentState);
  await studentsStore.addStudent({ ...newStudentState });
  navigateTo("/students/view/students_table");
};
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
      <UFormField label="الاسم الأول" name="first_name">
        <UInput
          v-model="newStudentState.first_name"
          placeholder="الاسم الأول"
          label="الاسم الأول"
          class="w-full"
        />
      </UFormField>
      <UFormField label="الاسم الثاني" name="second_name">
        <UInput
          v-model="newStudentState.second_name"
          placeholder="الاسم الثاني"
          label="الاسم الثاني"
          class="w-full"
        />
      </UFormField>
      <UFormField label="الاسم الثالث" name="third_name">
        <UInput
          v-model="newStudentState.third_name"
          placeholder="الاسم الثالث"
          label="الاسم الثالث"
          class="w-full"
        />
      </UFormField>
      <UFormField label="الاسم الرابع" name="last_name">
        <UInput
          v-model="newStudentState.last_name"
          placeholder="الاسم الرابع"
          label="الاسم الرابع"
          class="w-full"
        />
      </UFormField>
      <UFormField label="اسم ولي الأمر" name="guardian_name">
        <UInput
          v-model="newStudentState.guardian_name"
          placeholder="اسم ولي الأمر"
          label="اسم ولي الأمر"
          class="w-full"
        />
      </UFormField>
      <UFormField label="صلة قرابة ولي الأمر" name="guardian_name_kinship">
        <USelect
          :items="guardian_name_kinship_options"
          v-model="newStudentState.guardian_name_kinship"
          placeholder="صلة قرابة ولي الأمر"
          label="صلة قرابة ولي الأمر"
          class="w-full"
        />
      </UFormField>
      <UFormField label="رقم الواتس" name="whatsapp_number">
        <UInput
          v-model="newStudentState.whatsapp_number"
          type="number"
          placeholder="97xxxxxxxxxx"
          label="رقم الواتس"
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
      <UFormField label="رقم هوية الأب" name="father_identity_number">
        <UInput
          v-model="newStudentState.father_identity_number"
          placeholder="رقم هوية الأب"
          label="رقم هوية الأب"
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
      <UFormField label="رقم الجوال" name="phone_number">
        <UInput
          v-model="newStudentState.phone_number"
          placeholder="05xxxxxxxx"
          label="رقم الجوال"
          class="w-full"
        />
      </UFormField>
      <UFormField label="العنوان" name="address">
        <UInput
          v-model="newStudentState.address"
          placeholder="العنوان"
          label="العنوان"
          class="w-full"
        />
      </UFormField>
      <UFormField label="المسجد" name="masjed">
        <UInput
          v-model="newStudentState.masjed"
          placeholder="المسجد"
          label="المسجد"
          class="w-full"
        />
      </UFormField>

      <UFormField label="المستوى الدراسي" name="level_id">
        <USelect
          v-model="newStudentState.level_id"
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
        <USelect
          :items="
            Array.from({ length: 30 }, (_, i) => ({
              label: `${i + 1} جزء`,
              value: i + 1,
            }))
          "
          v-model="newStudentState.memorized_juz"
          type="number"
          placeholder="الأجزاء المحفوظة"
          label="الأجزاء المحفوظة"
          class="w-full"
        />
      </UFormField>
      <UFormField label="التسميع اليومي" name="daily_recitation">
        <USelect
          :items="daily_recitation_options"
          v-model="newStudentState.daily_recitation"
          placeholder="التسميع اليومي"
          label="التسميع اليومي"
          class="w-full"
        />
      </UFormField>
      <!-- <UFormField label="المستوى الأكاديمي العام" name="academic_level">
        <USelect
          v-model="newStudentState.academic_level"
          :items="academic_level_options"
          placeholder="المستوى الأكاديمي العام"
          label="المستوى الأكاديمي العام"
          class="w-full"
        />
      </UFormField> -->
      <!-- <UFormField label="الشعبة" name="class_group">
        <UInput
          v-model="newStudentState.class_group"
          placeholder="الشعبة"
          label="الشعبة"
          class="w-full"
        />
      </UFormField> -->
      <div class="col-span-2 flex gap-2 mt-5">
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
          @click="navigateTo('/students/view/students_table')"
          label="إلغاء"
        />
      </div>
    </UForm>
  </UCard>
</template>

<style scoped></style>
