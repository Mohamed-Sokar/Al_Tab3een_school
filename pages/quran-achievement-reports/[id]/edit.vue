<script setup lang="ts">
import { object, number } from "yup";
import type { MonthlyPlan, QuranAchievementReport, Semester } from "~/types";
import { ref, reactive, onMounted } from "vue";

// SEO
useHead({ title: "تعديل تقرير إنجاز القرآن" });

// init
const quranAchievementReportsStore = useQuranAcheivementReport();
const { toastError } = useAppToast();
const route = useRoute();
const client = useSupabaseClient();
const schema = object({
  achieved_pages: number()
    .required("الصفحات المنجزة مطلوبة")
    .typeError("يجب إدخال رقم")
    .min(0, "الصفحات المنجزة يجب ألا تكون سالبة"),
  monthly_plan_id: number().required("الشهر مطلوب"),
  semester_id: number().required("الفصل الدراسي مطلوب"),
});

// state
const state = reactive<{
  report: QuranAchievementReport | null;
  required_pages: number;
  student_name: string;
  identity_number: string;
  academic_class: string;
  semester_id: number;
  monthly_plan_id: number;
}>({
  report: null,
  required_pages: 0,
  student_name: "",
  identity_number: "",
  academic_class: "",
  semester_id: 0,
  monthly_plan_id: 0,
});
const isLoading = ref(false);
const pageError = ref("");

const fetchReport = async () => {
  const reportId = Number(route.params.id);
  if (isNaN(reportId)) {
    toastError({ title: "معرف التقرير غير صالح" });
    navigateTo({ name: "quran-achievement-reports" });
    return;
  }

  try {
    isLoading.value = true;

    // جلب التقرير مع بيانات الطالب والخطة الشهرية
    const { data: report, error: reportError } = await client
      .from("students_quran_achievement_reports")
      .select(
        `id, student_id, achieved_pages, status, monthly_plan_id, manager_id, created_at,
        student:students(id, first_name, second_name, third_name, last_name, identity_number, academic_class_id,
        academic_class:academic_classes(id, title, group)),
        monthly_plan:months_plans(id, month, pages, plan:plans(id, year, semester, stage, students_type))`
      )
      .eq("id", reportId)
      .single();

    if (reportError) {
      throw new Error(reportError.message);
    }

    if (!report) {
      throw new Error("التقرير غير موجود");
    }
    // const targetedReport = report as QuranAchievementReport;
    const targetedReport = quranAchievementReportsStore.getSpesificReport(
      reportId
    ) as QuranAchievementReport;

    state.report = {
      id: targetedReport.id,
      student_id: targetedReport.student_id,
      semester_id: targetedReport.semester_id,
      achieved_pages: targetedReport.achieved_pages,
      status: targetedReport.status,
      monthly_plan_id: targetedReport.monthly_plan_id,
    };

    state.required_pages = targetedReport.monthly_plan?.pages || 0;

    state.student_name = [
      targetedReport?.student?.first_name,
      targetedReport?.student?.second_name,
      targetedReport?.student?.third_name,
      targetedReport?.student?.last_name,
    ]
      .filter(Boolean)
      .join(" ");

    state.identity_number =
      targetedReport?.student?.identity_number || "غير متوفر";

    state.academic_class = targetedReport?.student?.academic_class
      ? `${targetedReport.student.academic_class.title} - شعبة ${targetedReport.student.academic_class.group}`
      : "غير متوفر";
  } catch (err) {
    toastError({
      title: "خطأ في جلب التقرير",
      description: (err as Error).message || "حدث خطأ غير متوقع",
    });
    navigateTo({ name: "quran-achievement-reports" });
  } finally {
    isLoading.value = false;
  }
};

const saveReport = async () => {
  if (!state.report) return;

  if (pageError.value) {
    toastError({ title: "يرجى تصحيح الأخطاء قبل الحفظ" });
    return;
  }

  isLoading.value = true;
  try {
    await quranAchievementReportsStore.updateQuranAchievementReport(
      state.report
    );
    navigateTo({ name: "quran-achievement-reports" });
  } catch (err) {
    toastError({
      title: "خطأ في تحديث التقرير",
      description: (err as Error).message || "حدث خطأ غير متوقع",
    });
  } finally {
    isLoading.value = false;
  }
};

const assignReportStatus = () => {
  const required_pages = Number(state.required_pages);
  const achieved_pages = Number(state.report?.achieved_pages);

  if (state.report) {
    // check if amount and fees were grater than 0
    if (required_pages && achieved_pages) {
      state.report.status =
        achieved_pages >= required_pages ? "مكتمل" : "غير مكتمل";
    } else {
      state.report.status = "غير مكتمل";
    }
  }
};

// watch state to assign report status
watch(state, () => {
  assignReportStatus();
});

onMounted(async () => {
  await fetchReport();
});
</script>

<template>
  <div class="max-w-4xl mx-auto mt-15">
    <UForm
      v-if="state.report"
      :state="state.report"
      :schema="schema"
      @submit="saveReport"
    >
      <UCard>
        <template #header>
          <div class="flex justify-between">
            <div class="flex justify-start items-center gap-2">
              <h1>تعديل تقرير إنجاز القرآن</h1>
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
          <div v-if="isLoading">
            <USkeleton class="h-8 w-full my-2" />
            <USkeleton class="h-8 w-full my-2" />
            <USkeleton class="h-8 w-full my-2" />
          </div>
          <div v-else-if="state.report">
            <!-- معلومات الطالب -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
              <UFormField label="اسم الطالب" name="student_name" size="md">
                <UInput :value="state.student_name" disabled class="w-full" />
              </UFormField>
              <UFormField label="رقم الهوية" name="identity_number" size="md">
                <UInput
                  :value="state.identity_number"
                  disabled
                  class="w-full"
                />
              </UFormField>
              <UFormField
                label="الشعبة الدراسية"
                name="academic_class"
                size="md"
              >
                <UInput :value="state.academic_class" disabled class="w-full" />
              </UFormField>
            </div>

            <!-- الصفحات المطلوبة والحالة -->
            <div class="flex flex-wrap gap-2 mb-5">
              <div class="p-3 bg-secondary/15 rounded-md flex gap-3">
                <span class="font-bold">الصفحات المطلوبة</span>
                <UBadge color="secondary" size="lg">
                  {{ state.required_pages }}
                </UBadge>
              </div>
              <UBadge
                :label="state.report.status"
                class="font-bold text-xl flex justify-center items-center"
                :color="
                  (state.report.achieved_pages ?? 0) >= state.required_pages
                    ? 'success'
                    : 'error'
                "
              />
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-2">
              <UFormField
                label="الصفحات المنجزة"
                required
                name="achieved_pages"
                size="md"
              >
                <UInput
                  v-model.number="state.report.achieved_pages"
                  class="w-full"
                  type="number"
                  color="secondary"
                />
              </UFormField>
              <UFormField
                label="الفصل الدراسي"
                required
                name="semester_id"
                size="md"
              >
                <USelect
                  class="w-full"
                  v-model="state.report.semester_id"
                  :items="[{label: 'اختر الفصل الدراسي', value: undefined},
                    ...useGradsStore().semestersData.map((s:Semester) => ({
                    label: `${s.year} - ${s.name}`,
                    value: s.id,
                  }))]
            "
                  placeholder="اختر الفصل الدراسي"
                />
              </UFormField>
              <UFormField
                label="الخطة الشهرية"
                required
                name="monthly_plan_id"
                size="md"
                class="lg:col-span-2"
              >
                <USelect
                  class="w-full"
                  v-model="state.report.monthly_plan_id"
                  :items="[
                    { label: 'اختر الخطة الشهرية', value: undefined },
                    ...usePlansStore().monthsPlansData.map((mp:MonthlyPlan) => ({
                      label: `(${mp?.month} - ${mp?.plan.year}) - ( ${mp?.plan.stage} - ${mp?.plan.students_type} - ${mp?.plan.semester} )`,
                      value: mp.id,
                    })),
                  ]"
                  placeholder="اختر الخطة الشهرية"
                  icon="i-heroicons-calendar"
                />
              </UFormField>
            </div>
          </div>
          <div v-else>
            <p class="text-center text-error">لم يتم العثور على التقرير</p>
          </div>
        </template>
        <template #footer v-if="state.report">
          <div class="gap-2 flex">
            <UButton
              label="حفظ"
              color="secondary"
              class="w-20 flex justify-center"
              :loading="isLoading"
              type="submit"
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
    </UForm>
  </div>
</template>
