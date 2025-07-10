<script setup lang="ts">
import { object, string } from "yup";
import { courses_options } from "~/constants";
import type { Teacher } from "~/types";
import { useTeachersStore } from "@/stores/teachers";
const teachersStore = useTeachersStore();

const form = ref();

const schema = object({
  // full_name: string().required("الاسم مطلوب"),
  first_name: string().required("الاسم الأول مطلوب"),
  second_name: string().required("اسم الوالد مطلوب"),
  third_name: string().required("اسم الجد مطلوب"),
  last_name: string().required("اسم العائلة مطلوب"),
  identity_number: string()
    .required("رقم الهوية مطلوب")
    .min(12, "رقم الهوية يجب أن يتكون من 9 أرقام"),
  whatsapp_number: string()
    .required("رقم الواتس مطلوب")
    .min(12, "رقم الهوية يجب أن يتكون من 12 أرقام"),
  phone_number: string()
    .required("رقم الجوال مطلوب")
    .min(9, "رقم الهوية يجب أن يتكون من 9 أرقام"),
  birth_date: string().required("تاريخ الميلاد مطلوب"),
  subject: string().required("المادة التي يتم تدريسها مطلوبة"),
});

const state = reactive<Teacher>({
  // id: undefined,
  full_name: undefined,
  first_name: undefined,
  second_name: undefined,
  third_name: undefined,
  last_name: undefined,
  identity_number: undefined,
  phone_number: undefined,
  birth_date: undefined,
  subject: undefined,
  // has_behavioral_issues: undefined,
  // ubsent_days_count: undefined,
  // loans: undefined,
});

const createTeacher = async () => {
  await teachersStore.addTeacher({ ...state, manager_id: null });
  navigateTo({ name: "teachers-view-teachers_table" });
};
</script>

<template>
  <UCard class="max-w-3xl mx-auto mt-15">
    <UForm
      ref="form"
      :schema="schema"
      :state="state"
      class="grid grid-cols-1 lg:grid-cols-2 gap-4"
      @submit="createTeacher"
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
      <UFormField label="المادة" name="subject">
        <USelect
          v-model="state.subject"
          :items="courses_options"
          type="text"
          class="w-full"
          placeholder="المواد التي يتم تدريسها"
        />
      </UFormField>

      <div class="lg:col-span-2 flex gap-2 mt-5">
        <UButton
          type="submit"
          class="flex w-40 py-2 justify-center font-bold lg:col-span-2 hover:cursor-pointer"
          color="secondary"
          :loading="teachersStore.loading"
          label="إضافة"
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

<style scoped></style>
