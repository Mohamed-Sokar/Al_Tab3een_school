<script setup lang="ts">
import { object, number } from "yup";
import { useStudentStore } from "@/stores/students";
import { usePlansStore } from "@/stores/plans";
import type { QuranAchievementReport } from "~/types";
import { ref, reactive, onMounted } from "vue";

// SEO
useHead({ title: "تعديل تقرير إنجاز القرآن" });

// init
const studentsStore = useStudentStore();
const quranAchievementReportsStore = useQuranAcheivementReport();
const plansStore = usePlansStore();
const client = useSupabaseClient();
const { toastError, toastSuccess } = useAppToast();
const route = useRoute();

const schema = object({
  achieved_pages: number()
    .required("الصفحات المنجزة مطلوبة")
    .min(0, "الصفحات المنجزة يجب ألا تكون سالبة"),
});

// state
const state = reactive<{
  report: QuranAchievementReport | null;
  required_pages: number;
  student_name: string;
  identity_number: string;
  academic_class: string;
  monthly_plan: string;
}>({
  report: null,
  required_pages: 0,
  student_name: "",
  identity_number: "",
  academic_class: "",
  monthly_plan: "",
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
    // const { data: report, error: reportError } = await client
    //   .from("students_quran_achievement_reports")
    //   .select(
    //     `id, student_id, month, achieved_pages, status, monthly_plan_id, manager_id, created_at,
    //     student:students(id, first_name, second_name, third_name, last_name, identity_number, academic_class_id,
    //       academic_class:academic_classes(id, title, group)),
    //     monthly_plan:months_plans(id, month, pages, plan:plans(id, year, semester, stage, students_type))`
    //   )
    //   .eq("id", reportId)
    //   .single();

    // if (reportError) {
    //   throw new Error(reportError.message);
    // }

    // if (!report) {
    //   throw new Error("التقرير غير موجود");
    // }
    // const targetedReport = report as QuranAchievementReport;
    const targetedReport = quranAchievementReportsStore.getSpesificReport(
      reportId
    ) as QuranAchievementReport;

    state.report = {
      id: targetedReport.id,
      student_id: targetedReport.student_id,
      month: targetedReport.month,
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

    state.monthly_plan = targetedReport.monthly_plan
      ? `(${targetedReport.monthly_plan.month} - ${targetedReport.monthly_plan.plan.year}) - (${targetedReport.monthly_plan.plan.stage} - ${targetedReport.monthly_plan.plan.students_type} - ${targetedReport.monthly_plan.plan.semester})`
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

// التحقق من صحة عدد الصفحات
const validatePages = () => {
  if (!state.report) return;
  const pages = Number(state.report.achieved_pages);
  if (isNaN(pages) || pages < 0) {
    pageError.value = "عدد الصفحات غير صالح";
  } else {
    pageError.value = "";
    state.report.status = pages >= state.required_pages ? "مكتمل" : "غير مكتمل";
  }
};

// حفظ التعديلات
const saveReport = async () => {
  if (!state.report) return;
  validatePages();
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

// جلب البيانات عند تحميل المكون
onMounted(async () => {
  await fetchReport();
});
</script>

<template>
  <div class="max-w-4xl mx-auto mt-15">
    <UCard>
      <template #header>
        <div class="flex justify-start items-center gap-2">
          <h1>تعديل تقرير إنجاز القرآن</h1>
          <UIcon
            name="i-heroicons-book-open"
            size="xl"
            class="text-secondary text-2xl"
          />
        </div>
      </template>
      <template #default>
        <div v-if="isLoading">
          <USkeleton class="h-8 w-full my-2" />
          <USkeleton class="h-8 w-full my-2" />
          <USkeleton class="h-8 w-full my-2" />
        </div>
        <div v-else-if="state.report">
          <UForm
            :state="state.report"
            :schema="schema"
            class="flex flex-col gap-4"
          >
            <!-- معلومات الطالب -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
            </div>
            <!-- الشعبة الدراسية والخطة الشهرية -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <UFormField
                label="الشعبة الدراسية"
                name="academic_class"
                size="md"
              >
                <UInput :value="state.academic_class" disabled class="w-full" />
              </UFormField>
              <UFormField label="الخطة الشهرية" name="monthly_plan" size="md">
                <UInput :value="state.monthly_plan" disabled class="w-full" />
              </UFormField>
            </div>
            <!-- الصفحات المطلوبة -->
            <div class="flex flex-wrap gap-2 mb-5">
              <div class="p-3 bg-secondary/15 rounded-md flex gap-3">
                <span class="font-bold">الصفحات المطلوبة</span>
                <UBadge color="secondary" size="lg">
                  {{ state.required_pages }}
                </UBadge>
              </div>
            </div>
            <!-- الصفحات المنجزة والحالة -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <UFormField
                label="الصفحات المنجزة"
                required
                name="achieved_pages"
                size="md"
              >
                <UInput
                  v-model.number="state.report.achieved_pages"
                  @update:model-value="validatePages"
                  :autofocus="true"
                  @input="validatePages"
                  :class="pageError ? 'border-error' : ''"
                  type="number"
                  min="0"
                  color="secondary"
                />
                <p v-if="pageError" class="text-error text-xs mt-1">
                  {{ pageError }}
                </p>
              </UFormField>
              <UFormField label="الحالة" name="status" size="md">
                <UInput :value="state.report.status" disabled />
              </UFormField>
            </div>
          </UForm>
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
            @click="saveReport"
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
