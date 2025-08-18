<script setup lang="ts">
import { object, number } from "yup";
import { useStudentStore } from "@/stores/students";
import { useAcademicClassesStore } from "@/stores/academic_classes";
import { usePlansStore } from "@/stores/plans";
import type {
  Student,
  MonthlyPlan,
  QuranAchievementReport,
  Semester,
} from "~/types";

// SEO
useHead({ title: "إضافة تقارير إنجاز القرآن" });

// init
const studentsStore = useStudentStore();
const academicClassesStore = useAcademicClassesStore();
const plansStore = usePlansStore();
const quranAchievementReportsStore = useQuranAcheivementReport();
const client = useSupabaseClient();
const { toastError, toastSuccess } = useAppToast();

const schema = object({
  academic_class_id: number().required("الشعبة الدراسية مطلوبة"),
  monthly_plan_id: number().required("الشهر مطلوب"),
  semester_id: number().required("الفصل الدراسي مطلوب"),
});

// state
const state = reactive<{
  academic_class_id: number | undefined;
  monthly_plan_id: number | undefined;
  semester_id: number | undefined;
  required_pages: number;
}>({
  academic_class_id: undefined,
  monthly_plan_id: undefined,
  semester_id: undefined,
  required_pages: 0,
});
const isLoading = ref(false);
const students = ref<Student[]>([]);
const studentsCount = ref(0);
const allStudentCount = ref(0);
const studentsHaveReportCount = ref(0);
const reports = ref<QuranAchievementReport[]>([]);
const pageErrors = ref<string[]>([]);

// get monthly plans
const getMonthlyPlans = async () => {
  try {
    await plansStore.fetchMonthsPlans(); // تجلب الخطط مع months_plans
  } catch (err) {
    toastError({
      title: "خطأ في جلب الخطط",
      description: (err as Error).message || "حدث خطأ غير متوقع",
    });
  }
};
// get required pages based on monthly_plan_Id
const getRequiredPages = () => {
  if (!state.monthly_plan_id) return;

  state.required_pages =
    plansStore.monthsPlansData.find((mp) => mp.id === state.monthly_plan_id)
      ?.pages ?? 0;
};
// search for students
const search = async () => {
  if (!state.academic_class_id || !state.monthly_plan_id) {
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

    // get students count who belong to specific academicClassId and PlanId
    studentsCount.value =
      (await studentsStore.getStudentsCountByAcademicClassIdAndPlanId(
        Number(state.academic_class_id),
        Number(state.monthly_plan_id)
      )) ?? 0;

    // Bring students, excluding those who have reports for this month.
    students.value =
      (await studentsStore.getStudentsByAcademicClassIdAndPlanId(
        Number(state.academic_class_id),
        Number(state.monthly_plan_id)
      )) ?? [];

    studentsHaveReportCount.value = students.value.length;
    // get required pages
    getRequiredPages();

    if (students.value.length === 0) {
      toastError({
        title: "لا يوجد طلاب متاحين",
        description:
          ".جميع الطلاب لديهم تقارير لهذا الشهر أو لا يوجد طلاب في هذه الشعبة، أو لم يتم تعيين خطة",
      });
      return;
    }

    // prepare reports array
    reports.value = students.value.map((student: Student) => {
      return {
        student_id: student.id,
        semester_id: Number(state.semester_id),
        achieved_pages: 0,
        status: "غير مكتمل",
        monthly_plan_id: Number(state.monthly_plan_id),
      };
    });

    // prepare errors array
    pageErrors.value = students.value.map(() => "");
  } finally {
    isLoading.value = false;
  }
};
// check achieved pages
const validatePages = (index: number) => {
  const pages = Number(reports.value[index].achieved_pages);
  if (isNaN(pages) || pages < 0) {
    pageErrors.value[index] = "عدد الصفحات غير صالح";
  } else {
    pageErrors.value[index] = "";
    reports.value[index].status =
      pages >= state.required_pages ? "مكتمل" : "غير مكتمل";
  }
};
// check page inputs
const checkPageInputs = () => {
  let hasError = false;

  reports.value.forEach((_, index: number) => {
    validatePages(index);
    if (pageErrors.value[index]) {
      hasError = true;
    }
  });

  return { hasError };
};
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

    const payload = reports.value.filter((r) => r.achieved_pages !== 0);

    await quranAchievementReportsStore.saveQuranAchievementReports(payload);
    toastSuccess({ title: "تم حفظ تقارير الإنجاز بنجاح" });
    // navigateTo({ name: "quran-achievement-reports" });
    students.value = [];
    reports.value = [];
  } finally {
    isLoading.value = false;
  }
};
// get status color
const getStatusColor = (status: string) => {
  switch (status) {
    case "مكتمل":
      return "success";
    case "غير مكتمل":
      return "error";
  }
};

onMounted(async () => {
  await Promise.all([
    academicClassesStore.fetchClasses(),
    getMonthlyPlans(),
    useGradsStore().fetchSemesters(),
  ]);
  getRequiredPages();
});
</script>

<template>
  <div class="max-w-4xl mx-auto mt-15">
    <UCard>
      <template #header>
        <div class="flex justify-between">
          <div class="flex justify-start items-center gap-2">
            <h1>إضافة تقارير إنجاز القرآن</h1>
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
              @click="navigateTo({ name: 'quran-achievement-reports' })"
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
            <UFormField label="الخطة الشهرية" name="monthly_plan_id" size="md">
              <USelect
                v-model="state.monthly_plan_id"
                :items="[
                  { label: 'اختر الخطة الشهرية', value: undefined },
                  ...plansStore.monthsPlansData.map((mp) => ({
                    label: `${mp.month?.name} - ${mp.month?.id}  (${mp.plan?.students_type} - ${mp.plan?.level?.title})`,
                    value: mp.id,
                  })),
                ]"
                placeholder="اختر الخطة الشهرية"
                icon="i-heroicons-calendar"
                class="w-full"
              />
            </UFormField>
            <!-- <UFormField label="الشهر" required name="monthly_plan_id" size="md">
              <USelect
                class="w-full"
                v-model="state.monthly_plan_id"
                :items="[
                  { label: 'اختر الشهر', value: undefined },
                  ...plansStore.monthsPlansData.map((mp) => ({
                    label: `(${mp?.month} - ${mp?.plan.year}) - ( ${mp?.plan.stage} - ${mp?.plan.students_type} - ${mp?.plan.semester} )`,
                    value: mp?.id,
                  })),
                ]"
                placeholder="اختر الشهر"
                icon="i-heroicons-calendar"
              />
            </UFormField> -->
            <UFormField
              label="الفصل الدراسي"
              required
              name="semester_id"
              size="md"
            >
              <USelect
                class="w-full"
                v-model="state.semester_id"
                :items="[{label: 'اختر الفصل الدراسي', value: undefined},
                    ...useGradsStore().semestersData.map((s:Semester) => ({
                    label: `${s.year} - ${s.name}`,
                    value: s.id,
                  }))]
                 "
                placeholder="اختر الفصل الدراسي"
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
        <!-- عرض الصفحات المطلوبة -->
        <div class="flex flex-wrap gap-2 mb-5" v-if="students.length">
          <div
            class="p-3 bg-secondary/15 rounded-md flex gap-3 w-full md:w-fit justify-between"
          >
            <span class="font-bold">الصفحات المطلوبة</span>
            <UBadge color="secondary" size="lg">
              {{ state.required_pages }}
            </UBadge>
          </div>
          <div
            class="p-3 bg-info/15 rounded-md flex gap-3 w-full md:w-fit justify-between"
          >
            <span class="font-bold">عدد الطلاب المنتسبين للخطة</span>
            <UBadge color="info" size="lg">
              {{ studentsCount }} / {{ allStudentCount }}
            </UBadge>
          </div>
          <div
            class="p-3 bg-info/15 rounded-md flex gap-3 w-full md:w-fit justify-between"
          >
            <span class="font-bold">عدد الطلاب الذين ليس لديهم تقارير</span>
            <UBadge color="info" size="lg">
              {{ studentsHaveReportCount }} / {{ studentsCount }}
            </UBadge>
          </div>
        </div>
        <!-- جدول الطلاب -->
        <table class="w-full">
          <thead>
            <tr
              class="grid grid-cols-4 font-bold bg-secondary text-white place-items-center border-t border-b border-accented"
            >
              <th class="border-x border-accented p-2 w-full">هوية الطالب</th>
              <th class="border-x border-accented p-2 w-full">الاسم</th>
              <th class="border-x border-accented p-2 w-full">
                الصفحات المنجزة
              </th>
              <th class="border-x border-accented p-2 w-full">الحالة</th>
            </tr>
          </thead>
          <tbody v-if="!isLoading">
            <tr
              v-if="students.length"
              class="grid grid-cols-4 place-items-center"
              v-for="(student, index) in students"
              :key="student.id"
            >
              <td
                class="w-full h-full p-2 text-center border-x border-b border-accented flex justify-center items-center"
              >
                {{ student.identity_number ?? "غير متوفر" }}
              </td>
              <td
                class="w-full h-full p-2 text-center border-x border-b border-accented flex justify-center items-center"
              >
                {{
                  [student.first_name, student.second_name, student.last_name]
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
                  v-model.number="reports[index].achieved_pages"
                  @update:model-value="validatePages(index)"
                  @input="validatePages(index)"
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
                  v-if="reports[index].status"
                  :color="getStatusColor(reports[index].status)"
                  size="lg"
                >
                  {{ reports[index].status }}
                </UBadge>
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
            :to="{ name: 'quran-achievement-reports' }"
          />
        </div>
      </template>
    </UCard>
  </div>
</template>
