<script setup lang="ts">
import {
  courses_options,
  gender_options,
  job_title_options,
  marital_status_options,
} from "~/constants";
import { type Employee } from "~/types";

// init
const employeesStore = useEmployeesStore();
const { getArabicDayName, getDate } = useDateUtils();

// Data
const route = useRoute();
const employeeId = Array.isArray(route.params.id)
  ? route.params.id[0]
  : route.params.id;

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
  isShared: undefined,
});

// Computed Properties
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
const enrollment_date_string = computed(() => {
  if (!state?.enrollment_date) return "";
  if (typeof state?.enrollment_date === "string") {
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
  if (state?.enrollment_date instanceof Date) {
    return state.enrollment_date.toISOString().slice(0, 10);
  }
  return "";
});

watchEffect(async () => {
  const employee = await employeesStore.fetchEmployeeById(employeeId);
  Object.assign(state, employee);
});
</script>

<template>
  <div class="max-w-3xl mx-auto space-y-10 mt-10">
    <div class="flex justify-between items-center mb-5">
      <h2 class="text-xl font-bold text-info">المعلومات الأساسية</h2>
      <div class="flex gap-2">
        <UButton
          :to="{ name: 'employees-id-edit', params: { id: employeeId } }"
          icon="heroicons-pencil"
          variant="subtle"
          color="secondary"
        />
        <UButton
          :to="{ name: 'employees-view' }"
          icon="heroicons-arrow-left-16-solid"
          variant="subtle"
          color="secondary"
        />
      </div>
    </div>
    <!-- main info. -->
    <div class="border-b border-dashed border-accented pb-10">
      <UCard>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <UFormField label="الاسم الأول" name="first_name">
            <UInput
              disabled
              v-model="state.first_name"
              placeholder="الاسم الأول"
              label="الاسم الأول"
              class="w-full"
            />
          </UFormField>
          <UFormField label="الاسم الثاني" name="second_name">
            <UInput
              disabled
              v-model="state.second_name"
              placeholder="الاسم الثاني"
              label="الاسم الثاني"
              class="w-full"
            />
          </UFormField>
          <UFormField label="الاسم الثالث" name="third_name">
            <UInput
              disabled
              v-model="state.third_name"
              placeholder="الاسم الثالث"
              label="الاسم الثالث"
              class="w-full"
            />
          </UFormField>
          <UFormField label="الاسم الرابع" name="last_name">
            <UInput
              disabled
              v-model="state.last_name"
              placeholder="الاسم الرابع"
              label="الاسم الرابع"
              class="w-full"
            />
          </UFormField>
          <UFormField label="الجنس" name="gender">
            <USelect
              disabled
              v-model="state.gender"
              :items="gender_options"
              placeholder="الجنس"
              label="الجنس"
              class="w-full"
            />
          </UFormField>
          <UFormField label="رقم الهوية" name="identity_number">
            <UInput
              disabled
              v-model.number="state.identity_number"
              placeholder="رقم الهوية"
              label="رقم الهوية"
              class="w-full"
            />
          </UFormField>
          <UFormField label="رقم الجوال" name="phone_number">
            <UInput
              disabled
              v-model="state.phone_number"
              placeholder="05xxxxxxxx"
              label="رقم الجوال"
              class="w-full"
            />
          </UFormField>
          <UFormField label="رقم الواتس" name="whatsapp_number">
            <UInput
              disabled
              v-model="state.whatsapp_number"
              placeholder="97xxxxxxxxxx"
              label="رقم الواتس"
              class="w-full"
            />
          </UFormField>
          <UFormField label="تاريخ الميلاد" name="birth_date">
            <UInput
              disabled
              type="date"
              v-model="birth_date_string"
              class="w-full"
              placeholder="تاريخ الميلاد"
              icon="heroicons-calendar-days-solid"
            />
          </UFormField>
          <UFormField label="تاريخ التسجيل في المدرسة" name="enrollment_date">
            <UInput
              disabled
              type="date"
              v-model="enrollment_date_string"
              class="w-full"
              placeholder="تاريخ التسجيل"
              icon="heroicons-calendar-days-solid"
            />
          </UFormField>
          <UFormField label="الحالة الاجتماعية" name="marital_status">
            <USelect
              disabled
              v-model="state.marital_status"
              :items="marital_status_options"
              placeholder="الحالة الاجتماعية"
              label="الحالة الاجتماعية"
              class="w-full"
            />
          </UFormField>
          <UFormField label="المسمى الوظيفي" name="job_title">
            <USelect
              disabled
              v-model="state.job_title"
              :items="job_title_options"
              placeholder="المسمى الوظيفي"
              label="المسمى الوظيفي"
              class="w-full"
            />
          </UFormField>
          <UFormField label="العنوان" name="address">
            <UInput
              disabled
              v-model="state.address"
              placeholder="العنوان"
              label="العنوان"
              class="w-full"
            />
          </UFormField>
          <UFormField label="المسجد" name="masjed">
            <UInput
              disabled
              v-model="state.masjed"
              placeholder="المسجد"
              label="المسجد"
              class="w-full"
            />
          </UFormField>
          <UFormField label="عدد الأطفال" name="children_count">
            <UInput
              disabled
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
            <UInput
              disabled
              v-model="state.salary"
              class="w-full"
              placeholder="الراتب"
            />
          </UFormField>
          <UFormField label="هل الموظف مشترك؟" name="isShared">
            <USelect
              v-model="state.isShared"
              :items="[
                { label: 'نعم', value: true },
                { label: 'لا', value: false },
              ]"
              placeholder="هل الموظف مشترك؟"
              label="هل الموظف مشترك؟"
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
          <div v-if="state?.administrative_issues?.length">
            <ul>
              <li
                class="grid grid-cols-3 justify-between items-center gap-2 border-b py-2"
              >
                <span class="font-bold">اليوم</span>
                <span class="font-bold">التاريخ</span>
                <span class="font-bold">المخالفة</span>
              </li>
              <li
                v-for="(issue, index) in state.administrative_issues"
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
                {{ state?.administrative_issues?.length }}
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
