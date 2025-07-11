<script setup lang="ts">
import { courses_options } from "~/constants";
import { type Teacher } from "~/types";
import { useTeachersStore } from "@/stores/teachers";

const teachersStore = useTeachersStore();

const teacherState = reactive<Teacher>({
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
});

const route = useRoute();
const teacherId = Array.isArray(route.params.id)
  ? route.params.id[0]
  : route.params.id;

const targetedTeacher = ref<Teacher | undefined>(
  teachersStore.getSpesificTeacher(teacherId)
);

watchEffect(() => {
  // if (teachersStore.sortedTeachers.length > 0) {
  //   targetedTeacher.value = teachersStore.getSpesificTeacher(teacherId);
  //   Object.assign(teacherState, targetedTeacher.value);
  // }
  if (teachersStore.sortedTeachers.length > 0) {
    targetedTeacher.value = teachersStore.getSpesificTeacher(teacherId);

    const teacherData = { ...targetedTeacher.value };

    // ✅ تأكد أن subject يتحول من نص إلى مصفوفة
    if (typeof teacherData.subject === "string") {
      try {
        teacherData.subject = JSON.parse(teacherData.subject);
      } catch (e) {
        teacherData.subject = [];
      }
    }

    Object.assign(teacherState, teacherData);
  }
});
const { getArabicDayName, getDate } = useDateUtils();

const createdAtString = computed({
  get() {
    if (!teacherState.created_at) return "";
    if (typeof teacherState.created_at === "string") {
      // If already in YYYY-MM-DD format, return as is
      if (/^\d{4}-\d{2}-\d{2}$/.test(teacherState.created_at)) {
        return teacherState.created_at;
      }
      // Try to parse and format
      const d = new Date(teacherState.created_at);
      if (!isNaN(d.getTime())) {
        return d.toISOString().slice(0, 10);
      }
      return "";
    }
    if (teacherState.created_at instanceof Date) {
      return teacherState.created_at.toISOString().slice(0, 10);
    }
    return "";
  },
  set(val: string) {
    teacherState.created_at = val;
  },
});
const birth_date_string = computed({
  get() {
    if (!teacherState.birth_date) return "";
    if (typeof teacherState.birth_date === "string") {
      // If already in YYYY-MM-DD format, return as is
      if (/^\d{4}-\d{2}-\d{2}$/.test(teacherState.birth_date)) {
        return teacherState.birth_date;
      }
      // Try to parse and format
      const d = new Date(teacherState.birth_date);
      if (!isNaN(d.getTime())) {
        return d.toISOString().slice(0, 10);
      }
      return "";
    }
    if (teacherState.birth_date instanceof Date) {
      return teacherState.birth_date.toISOString().slice(0, 10);
    }
    return "";
  },
  set(val: Date) {
    teacherState.birth_date = val;
  },
});
const enrollment_date_string = computed(() => {
  if (!targetedTeacher.value?.enrollment_date) return "";
  if (typeof targetedTeacher.value?.enrollment_date === "string") {
    // If already in YYYY-MM-DD format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(targetedTeacher.value.enrollment_date)) {
      return targetedTeacher.value.enrollment_date;
    }
    // Try to parse and format
    const d = new Date(targetedTeacher.value.enrollment_date);
    if (!isNaN(d.getTime())) {
      return d.toISOString().slice(0, 10);
    }
    return "";
  }
  if (targetedTeacher.value?.enrollment_date instanceof Date) {
    return targetedTeacher.value.enrollment_date.toISOString().slice(0, 10);
  }
  return "";
});
</script>

<template>
  <div class="max-w-3xl mx-auto space-y-10 mt-10">
    <!-- main info. -->
    <div class="border-b border-dashed border-accented pb-10">
      <div class="flex justify-between items-center mb-5">
        <h2 class="text-xl mb-5 font-bold text-info">المعلومات الأساسية</h2>
        <div>
          <UButton
            :to="`/teachers/${teacherId}/edit_teacher`"
            class="bg-secondary text-white hover:bg-primary-dark"
          >
            تعديل
          </UButton>
        </div>
      </div>

      <UCard>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <UFormField label="الاسم الأول" name="first_name">
            <UInput
              disabled
              v-model="teacherState.first_name"
              placeholder="الاسم الأول"
              label="الاسم الأول"
              class="w-full"
            />
          </UFormField>
          <UFormField label="الاسم الثاني" name="second_name">
            <UInput
              disabled
              v-model="teacherState.second_name"
              placeholder="الاسم الثاني"
              label="الاسم الثاني"
              class="w-full"
            />
          </UFormField>
          <UFormField label="الاسم الثالث" name="third_name">
            <UInput
              disabled
              v-model="teacherState.third_name"
              placeholder="الاسم الثالث"
              label="الاسم الثالث"
              class="w-full"
            />
          </UFormField>
          <UFormField label="الاسم الرابع" name="last_name">
            <UInput
              disabled
              v-model="teacherState.last_name"
              placeholder="الاسم الرابع"
              label="الاسم الرابع"
              class="w-full"
            />
          </UFormField>
          <UFormField label="رقم الهوية" name="identity_number">
            <UInput
              disabled
              v-model="teacherState.identity_number"
              placeholder="رقم الهوية"
              label="رقم الهوية"
              class="w-full"
            />
          </UFormField>
          <UFormField label="رقم الجوال" name="phone_number">
            <UInput
              disabled
              v-model="teacherState.phone_number"
              placeholder="05xxxxxxxx"
              label="رقم الجوال"
              class="w-full"
            />
          </UFormField>
          <UFormField label="رقم الواتس" name="whatsapp_number">
            <UInput
              disabled
              v-model="teacherState.whatsapp_number"
              type="number"
              placeholder="97xxxxxxxxxx"
              label="رقم الواتس"
              class="w-full"
            />
          </UFormField>
          <UFormField label="تاريخ الميلاد" name="birth_date">
            <UInput
              disabled
              v-model="birth_date_string"
              type="date"
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
              disabled
              v-model="teacherState.subject"
              :items="courses_options"
              type="text"
              class="w-full"
              placeholder="المواد التي يتم تدريسها"
            />
          </UFormField>
          <UFormField label="الحالة الاجتماعية" name="marital_status">
            <USelect
              disabled
              v-model="teacherState.marital_status"
              :options="['أعزب', 'متزوج', 'مطلق', 'أرمل']"
              placeholder="الحالة الاجتماعية"
              label="الحالة الاجتماعية"
              class="w-full"
            />
          </UFormField>
          <UFormField label="العنوان" name="address">
            <UInput
              disabled
              v-model="teacherState.address"
              placeholder="العنوان"
              label="العنوان"
              class="w-full"
            />
          </UFormField>
          <UFormField label="عدد الأطفال" name="children_count">
            <UInput
              disabled
              v-model="teacherState.children_count"
              placeholder="عدد الأطفال"
              label="عدد الأطفال"
              class="w-full"
            />
          </UFormField>
        </div>
      </UCard>
    </div>

    <!-- behavioral issues -->
    <div>
      <h2 class="text-xl mb-5 font-bold text-info">المخالفات السلوكية</h2>
      <UCard>
        <div>
          <div v-if="targetedTeacher?.behavioral_issues?.length">
            <ul>
              <li
                class="grid grid-cols-3 justify-between items-center gap-2 border-b py-2"
              >
                <span class="font-bold">اليوم</span>
                <span class="font-bold">التاريخ</span>
                <span class="font-bold">المخالفة</span>
              </li>
              <li
                v-for="(issue, index) in targetedTeacher.behavioral_issues"
                :key="index"
                class="grid grid-cols-3 justify-between items-center gap-2 border-b border-dashed border-gray-200 py-2 mb-2"
              >
                <span>
                  {{ getArabicDayName(issue.created_at + "") }}
                </span>
                <span>
                  {{ getDate(issue.created_at ?? "") }}
                </span>
                <span> {{ issue.description }} </span>
              </li>
            </ul>
            <div class="pt-3">
              <span> المجموع: </span>
              <span class="font-bold">
                {{ targetedTeacher.behavioral_issues.length }}
              </span>
            </div>
          </div>

          <p v-else>لا توجد مخالفات.</p>
        </div>
      </UCard>
    </div>
  </div>
</template>

<style scoped></style>
