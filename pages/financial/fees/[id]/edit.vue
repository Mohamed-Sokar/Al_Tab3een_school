<script setup lang="ts">
import { object, number } from "yup";
import type { FeesReport, Semester } from "~/types";
import { ref, reactive, onMounted } from "vue";
import { months } from "~/constants";

// SEO
useHead({ title: "تعديل تقرير إنجاز القرآن" });

// init

const { toastError } = useAppToast();
const route = useRoute();
const client = useSupabaseClient();
const feesStore = useFeesStore();
const schema = object({
  fees: number()
    .typeError("يجب أن تدخل رقما")
    .required("الرسوم المستحقة مطلوبة")
    .min(0, "الرسوم المستحقة يجب ألا تكون سالبة"),
  amount: number()
    .typeError("يجب أن تدخل رقما")
    .required("الرسوم المطلوبة مطلوبة")
    .min(0, "الرسوم المطلوبة يجب ألا تكون سالبة")
    .test(
      "amount-not-greater-than-fees",
      "الرسوم المطلوبة يجب ألا تتجاوز الرسوم المستحقة",
      function (value) {
        const { fees } = this.parent;
        return value <= fees;
      }
    ),
  month_id: number().required("الشهر مطلوب"),
  semester_id: number().required("الفصل الدراسي مطلوب"),
});

// state
const state = reactive<{
  report: FeesReport | null;
  student_name: string;
  identity_number: string;
  academic_class: string;
}>({
  report: null,
  student_name: "",
  identity_number: "",
  academic_class: "",
});
const isLoading = ref(false);
const pageError = ref("");

const fetchReport = async () => {
  const reportId = Number(route.params.id);

  if (isNaN(reportId)) {
    toastError({ title: "معرف التقرير غير صالح" });
    navigateTo({ name: "financial-fees" });
    return;
  }

  try {
    isLoading.value = true;

    // جلب التقرير مع بيانات الطالب
    const { data: report, error: reportError } = await client
      .from("student_monthly_fees")
      .select(
        `id, student_id, fees, amount, status, notes, created_at, month_id, semester_id,
          student:students(id, first_name, second_name, third_name, last_name, identity_number, academic_class_id, academic_class:academic_classes(id, title, group)),
          month:months(id)
          `
      )
      .eq("id", reportId)
      .single();

    if (reportError) {
      throw new Error(reportError.message);
    }

    if (!report) {
      throw new Error("التقرير غير موجود");
    }

    const targetedReport = report as FeesReport;
    // const targetedReport = feesStore.getSpesificReport(reportId) as FeesReport;
    // console.log("targetedReport: ", targetedReport);

    state.report = {
      id: targetedReport.id,
      student_id: targetedReport.student_id,
      month_id: targetedReport.month_id,
      semester_id: targetedReport.semester_id,
      amount: targetedReport.amount,
      fees: targetedReport.fees,
      status: targetedReport.status,
      notes: targetedReport.notes,
      updated_at: new Date(),
    };

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
    setTimeout(() => {
      navigateTo({ name: "financial-fees" });
    }, 1000);
  } finally {
    isLoading.value = false;
  }
};

const saveReport = async () => {
  if (!state.report) return;
  try {
    isLoading.value = true;
    await feesStore.updateFeesReport(state.report);
    state.report = null;
    navigateTo({ name: "financial-fees" });
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
  const amount = Number(state.report?.amount);
  const fees = Number(state.report?.fees);

  if (state.report) {
    // check if amount and fees were grater than 0
    if (amount && fees) {
      state.report.status =
        amount >= fees
          ? "مسدد"
          : amount < fees && amount > 0
          ? "متأخر"
          : "غير مسدد";
    } else {
      state.report.status = "غير مسدد";
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
      class="flex flex-col gap-4"
    >
      <UCard>
        <template #header>
          <div class="flex justify-between">
            <div class="flex justify-start items-center gap-2">
              <h1>تعديل تقرير الرسوم</h1>
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
          <div v-if="isLoading">
            <USkeleton class="h-8 w-full my-2" />
            <USkeleton class="h-8 w-full my-2" />
            <USkeleton class="h-8 w-full my-2" />
          </div>
          <div v-else-if="state.report" class="flex flex-col gap-4">
            <!-- معلومات الطالب -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
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
            <!-- fees and status -->
            <div class="flex flex-wrap gap-2 mb-5">
              <div class="p-3 bg-secondary/15 rounded-md flex gap-3">
                <span class="font-bold">الرسوم المستحقة</span>
                <UBadge color="secondary" size="lg">
                  {{ state.report.fees }}
                </UBadge>
              </div>
              <UBadge
                :label="state.report.status"
                class="font-bold text-xl flex justify-center items-center"
                :color="
                  state.report.status === 'مسدد'
                    ? 'success'
                    : state.report.status === 'متأخر'
                    ? 'warning'
                    : 'error'
                "
              />
            </div>
            <!-- الرسوم المستحقة و المدفوعة -->
            <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <UFormField
                label="الرسوم المستحقة"
                required
                name="fees"
                size="md"
              >
                <UInput
                  v-model.number="state.report.fees"
                  class="w-full"
                  :class="pageError ? 'border-error' : ''"
                  type="number"
                  color="secondary"
                />
                <p v-if="pageError" class="text-error text-xs mt-1">
                  {{ pageError }}
                </p>
              </UFormField>
              <UFormField
                label="الرسوم المدفوعة"
                required
                name="amount"
                size="md"
              >
                <UInput
                  v-model.number="state.report.amount"
                  class="w-full"
                  :class="pageError ? 'border-error' : ''"
                  type="number"
                  color="secondary"
                />
                <p v-if="pageError" class="text-error text-xs mt-1">
                  {{ pageError }}
                </p>
              </UFormField>
              <UFormField label="الشهر" required name="month_id" size="md">
                <USelect
                  class="w-full"
                  v-model="state.report.month_id"
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
              <UFormField
                label="الفصل الدراسي"
                required
                name="semester_id"
                size="md"
              >
                <USelect
                  class="w-full"
                  v-model="state.report.semester_id"
                  :items="
                  [{ label: 'اختر الفصل', value: undefined },...useGradsStore().semestersData.map((s:Semester) => ({
                    label: `${s.year} - ${s.name}`,
                    value: s.id,
                  }))]
                  "
                  placeholder="اختر الفصل الدراسي"
                />
              </UFormField>
              <UFormField
                label="ملاحظات"
                name="notes"
                size="md"
                class="lg:col-span-4"
              >
                <UTextarea
                  class="w-full"
                  :rows="8"
                  v-model="state.report.notes"
                  placeholder="أدخل ملاحظات"
                />
              </UFormField>
            </div>
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
              :to="{ name: 'financial-fees' }"
            />
          </div>
        </template>
      </UCard>
    </UForm>
    <UCard v-else>
      <template #header>
        <div class="flex justify-start items-center gap-2">
          <h1>تعديل تقرير الرسوم</h1>
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
        <p v-else class="text-center text-error">لم يتم العثور على التقرير</p>
      </template>
    </UCard>
  </div>
</template>
