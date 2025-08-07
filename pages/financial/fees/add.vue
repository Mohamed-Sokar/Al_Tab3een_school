<script setup lang="ts">
import { object, number } from "yup";
import { useStudentStore } from "@/stores/students";
import { useAcademicClassesStore } from "@/stores/academic_classes";

import type { Student, FeesReport, Semester } from "~/types";
import { months } from "@/constants";
import { useFeesStore } from "@/stores/fees";

// SEO
useHead({ title: "إضافة رسوم الطلاب" });

// init
const studentsStore = useStudentStore();
const academicClassesStore = useAcademicClassesStore();
const gradesStore = useGradsStore();
const feesStore = useFeesStore();
const { toastError, toastSuccess } = useAppToast();
const schema = object({
  academic_class_id: number().required("الشعبة الدراسية مطلوبة"),
  month_id: number().required("الشهر مطلوب"),
  semester_id: number().required("الفصل الدراسي مطلوب"),
});
enum FEES {
  VALUE = 100,
}

// state
const state = reactive<{
  academic_class_id: number | undefined;
  month_id: number | undefined;
  semester_id: number | undefined;
  student_name: string | undefined;
}>({
  academic_class_id: undefined,
  month_id: undefined,
  semester_id: undefined,
  student_name: undefined,
});
const isLoading = ref(false);
const students = ref<Student[]>([]);
const studentsCount = ref(0);
const allStudentCount = ref(0);
const reports = ref<FeesReport[]>([]);
const pageErrors = ref<string[]>([]);

// search for students
const search = async () => {
  if (!state.academic_class_id || !state.month_id) {
    toastError({ title: "يرجى اختيار الشعبة الدراسية والشهر" });
    return;
  }

  try {
    isLoading.value = true;

    // get count of all students belong to specific academicClassId
    allStudentCount.value =
      (await studentsStore.getStudentsCountByAcademicClassId(
        Number(state.academic_class_id)
      )) ?? 0;

    // Bring students, excluding those who paied fees for this month
    students.value =
      (await feesStore.fetchStudentsByAcademicClassIdAndMonthId(
        Number(state.academic_class_id),
        Number(state.month_id)
      )) ?? [];

    studentsCount.value = students.value.length;

    if (students.value.length === 0) {
      toastError({
        title: "لا يوجد طلاب متاحين",
        description:
          ".جميع الطلاب سددوا رسوم هذا الشهر أو لا يوجد طلاب في هذه الشعبة",
      });
      return;
    }

    // prepare reports array
    reports.value = students.value.map((student: Student) => {
      return {
        student_id: student.id,
        semester_id: state.semester_id,
        month_id: state.month_id,
        fees: FEES.VALUE,
        amount: 0,
        status: "غير مسدد",
        notes: "",
      };
    });

    // prepare errors array
    pageErrors.value = students.value.map(() => "");
  } finally {
    isLoading.value = false;
  }
};

// check achieved pages
const validateFees = (index: number) => {
  const amount = Number(reports.value[index].amount);
  const fees = Number(reports.value[index].fees);
  if (isNaN(amount) || amount < 0 || isNaN(fees) || fees < 0) {
    pageErrors.value[index] = "قيمة الرسوم غير صالحة";
  } else if (amount > fees) {
    pageErrors.value[index] =
      "يجب أن تكون الرسوم المدفوعة أقل أو يساوي الرسوم المستحقة";
  } else if (fees > FEES.VALUE) {
    pageErrors.value[
      index
    ] = `يجب أن تكون الرسوم المستحقة أقل من أو يساوي ${FEES.VALUE}`;
  } else {
    pageErrors.value[index] = "";

    reports.value[index].status =
      amount >= fees
        ? "مسدد"
        : amount < fees && amount > 0
        ? "متأخر"
        : "غير مسدد";
  }
};
// check page inputs
const checkPageInputs = () => {
  let hasError = false;

  reports.value.forEach((_, index: number) => {
    validateFees(index);
    if (pageErrors.value[index]) {
      hasError = true;
    }
  });

  return { hasError };
};

// function removeFees(reports: FeesReport[]) {
//   return reports.map((report) => {
//     const { fees, ...rest } = report; // Destructure to exclude fees
//     return rest; // Return object without fees
//   });
// }

// save reports
const saveReports = async () => {
  isLoading.value = true;
  try {
    const { hasError } = checkPageInputs();
    if (hasError) {
      toastError({
        title: "يرجى تصحيح الأخطاء قبل الحفظ",
      });
      return;
    }
    // remove reports that doesn't contain fees amount
    const newReports = reports.value.filter((r) => r.amount !== 0);
    // // save reports in DB
    await feesStore.saveFeesReports(newReports);

    toastSuccess({ title: "تم حفظ تقارير الرسوم بنجاح" });
    // navigateTo({ name: "financial-fees" });

    // reset arrays

    students.value = [];
    reports.value = [];
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await Promise.all([
    academicClassesStore.fetchClasses(),
    gradesStore.fetchSemesters(),
  ]);
});
</script>

<template>
  <div class="max-w-4xl mx-auto mt-15">
    <UCard>
      <template #header>
        <div class="flex justify-between">
          <div class="flex justify-start items-center gap-2">
            <h1>إضافة رسوم الطلاب</h1>
            <UIcon
              name="i-heroicons-book-open"
              size="xl"
              class="text-secondary text-2xl"
            />
          </div>
          <div>
            <UButton
              icon="i-heroicons-arrow-left"
              color="secondary"
              size="sm"
              class="w-10 flex justify-center items-center hover:cursor-pointer"
              @click="navigateTo({ name: 'financial-fees' })"
            />
          </div>
        </div>
      </template>
      <template #default>
        <UForm
          :state="state"
          :schema="schema"
          @submit="search"
          class="flex gap-2 flex-col justify-between items-start lg:items-start mb-5"
        >
          <div class="w-full grid grid-cols-1 lg:grid-cols-3 gap-2 mb-5">
            <UFormField
              label="الفصل الدراسي"
              required
              name="semester_id"
              size="md"
            >
              <USelect
                class="w-full"
                v-model="state.semester_id"
                :items="
                gradesStore.semestersData.map((s:Semester) => ({
                label: `${s.year} - ${s.name}`,
                value: s.id,
              }))
            "
                placeholder="اختر الفصل الدراسي"
              />
            </UFormField>
            <UFormField
              label="الشعبة الدراسية"
              required
              name="academic_class_id"
              size="md"
            >
              <USelect
                class="w-full"
                v-model="state.academic_class_id"
                :items="[
                  { label: 'اختر الشعبة الدراسية', value: undefined },
                  ...academicClassesStore.classesData.map((c) => ({
                    label: `${c.title} - شعبة ${c.group}`,
                    value: c.id,
                  })),
                ]"
                placeholder="اختر الشعبة الدراسية"
                icon="i-heroicons-presentation-chart-bar"
              />
            </UFormField>
            <UFormField label="الشهر" required name="month_id" size="md">
              <USelect
                class="w-full"
                v-model="state.month_id"
                :items="[
                  { label: 'اختر الشهر', value: undefined },
                  ...months.map((m) => ({
                    label: `${m.label} - ${m.value}`,
                    value: m.value,
                  })),
                ]"
                placeholder="اختر الشهر"
                icon="i-heroicons-calendar"
              />
            </UFormField>
          </div>
          <UButton
            icon="i-lucide-search"
            color="secondary"
            type="submit"
            label="بحث"
            class="hover:cursor-pointer rounded-sm"
            :loading="isLoading"
          />
        </UForm>
        <!-- required fees and studentsCount -->
        <div class="flex flex-wrap gap-2 mb-5" v-if="students.length">
          <div class="p-3 bg-secondary/15 rounded-md flex gap-3">
            <span class="font-bold">الرسوم المطلوبة</span>
            <UBadge color="secondary" size="lg" class="font-bold">
              {{ FEES.VALUE }}
            </UBadge>
          </div>
          <div class="p-3 bg-info/15 rounded-md flex gap-3 items-center">
            <span class="font-bold">الطلاب الغير مسددين</span>
            <UBadge
              color="info"
              size="lg"
              class="font-bold"
              :label="studentsCount"
            />
            <span class="font-bold text-xl text-gray-500"> / </span>
            <span class="font-bold text-xl text-gray-500">
              {{ allStudentCount }}
            </span>
          </div>
        </div>
        <!-- جدول الطلاب -->
        <table class="w-full">
          <thead>
            <tr
              class="grid grid-cols-5 font-bold bg-secondary text-white place-items-center border-t border-b border-accented"
            >
              <!-- <th class="border-x border-accented p-2 w-full">هوية الطالب</th> -->
              <th class="border-x border-accented p-2 w-full">الاسم رباعي</th>
              <th class="border-x border-accented p-2 w-full">
                الرسوم المستحقة
              </th>
              <th class="border-x border-accented p-2 w-full">
                الرسوم المدفوعة
              </th>
              <th class="border-x border-accented p-2 w-full">الحالة</th>
              <th class="border-x border-accented p-2 w-full">ملاحظات</th>
            </tr>
          </thead>
          <tbody v-if="!isLoading">
            <tr
              v-if="students.length"
              class="grid grid-cols-5 place-items-center"
              v-for="(student, index) in students"
              :key="student.id"
            >
              <!-- <td
                class="w-full h-full p-2 text-center border-x border-b border-accented flex justify-center items-center"
              >
                {{ student.identity_number ?? "غير متوفر" }}
              </td> -->
              <td
                class="w-full h-full p-2 text-center border-x border-b border-accented flex justify-center items-center"
              >
                {{
                  [
                    student.first_name,
                    student.second_name,
                    student.third_name,
                    student.last_name,
                  ]
                    .filter(Boolean)
                    .join(" ")
                }}
              </td>
              <td
                class="w-full h-full p-2 border-x border-b border-accented flex flex-col justify-center"
              >
                <UInput
                  :color="pageErrors[index] ? 'error' : 'secondary'"
                  :highlight="pageErrors[index] ? true : false"
                  v-model.number="reports[index].fees"
                  @update:model-value="validateFees(index)"
                  @input="validateFees(index)"
                  type="number"
                />
                <p v-if="pageErrors[index]" class="text-error text-xs mt-1">
                  {{ pageErrors[index] }}
                </p>
              </td>
              <td
                class="w-full h-full p-2 border-x border-b border-accented flex flex-col justify-center"
              >
                <UInput
                  :color="pageErrors[index] ? 'error' : 'secondary'"
                  :highlight="pageErrors[index] ? true : false"
                  v-model.number="reports[index].amount"
                  @update:model-value="validateFees(index)"
                  @input="validateFees(index)"
                  type="number"
                />
                <p v-if="pageErrors[index]" class="text-error text-xs mt-1">
                  {{ pageErrors[index] }}
                </p>
              </td>
              <td
                class="w-full h-full p-2 text-center border-x border-b border-accented flex justify-center items-center"
              >
                <UBadge
                  :color="
                    reports[index].status === 'مسدد'
                      ? 'success'
                      : reports[index].status === 'متأخر'
                      ? 'warning'
                      : 'error'
                  "
                  :label="reports[index].status"
                />
              </td>
              <td
                class="w-full h-full p-2 text-center border-x border-b border-accented flex justify-center items-center"
              >
                <UInput v-model="reports[index].notes" />
              </td>
            </tr>
            <tr
              v-else
              class="flex justify-center p-2 border border-accented mt-2"
            >
              لا يوجد بيانات للعرض
            </tr>
          </tbody>
          <tbody v-else>
            <USkeleton class="h-8 w-full my-2" />
            <USkeleton class="h-8 w-full my-2" />
            <USkeleton class="h-8 w-full my-2" />
            <USkeleton class="h-8 w-full my-2" />
          </tbody>
        </table>
      </template>
      <template #footer v-if="students.length">
        <div class="gap-2 flex">
          <UButton
            label="حفظ"
            color="secondary"
            class="w-20 flex justify-center"
            :loading="isLoading"
            @click="saveReports"
          />
          <UButton
            label="إلغاء"
            variant="soft"
            color="neutral"
            :loading="isLoading"
            :to="{ name: 'financial-fees' }"
          />
        </div>
      </template>
    </UCard>
  </div>
</template>
