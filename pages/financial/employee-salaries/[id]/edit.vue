<script setup lang="ts">
import { object, number } from "yup";
import type { EmployeeSalaryReport, Semester } from "~/types";
import { ref, reactive, onMounted } from "vue";
import { months } from "~/constants";

// SEO
useHead({ title: "تعديل تقرير راتب الموظف" });

// init
const { toastError } = useAppToast();
const route = useRoute();
const client = useSupabaseClient();
const salariesStore = useSalariesStore();
const schema = object({
  amount: number()
    .typeError("يجب أن تدخل رقما")
    .required("الراتب المدفوع مطلوبة")
    .min(0, "الراتب المدفوع يجب ألا يكون قيمة سالبة")
    .test(
      "amount-not-greater-than-salary",
      "الراتب المدفوع يجب ألا يتجاوز الراتب المستحق",
      function (value) {
        return value <= (state.salary ?? 0);
      }
    ),
  month_id: number().required("الشهر مطلوب"),
  semester_id: number().required("الفصل الدراسي مطلوب"),
});

// state
const state = reactive<{
  report: EmployeeSalaryReport | null;
  employee_name: string;
  salary: number | undefined;
  identity_number: string;
}>({
  report: null,
  employee_name: "",
  salary: undefined,
  identity_number: "",
});
const isLoading = ref(false);

const fetchReport = async () => {
  const reportId = Number(route.params.id);

  if (isNaN(reportId)) {
    toastError({ title: "معرف التقرير غير صالح" });
    navigateTo({ name: "financial-employee-salaries" });
    return;
  }
  try {
    isLoading.value = true;

    // جلب التقرير مع بيانات الطالب
    const { data: report, error: reportError } = await client
      .from("employee_salaries")
      .select(
        `id, employee_id, amount, status, notes, created_at, month_id, semester_id,
          employee:employees(id, first_name, second_name, third_name, last_name, identity_number, salary),
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

    const targetedReport = report as EmployeeSalaryReport;
    // const targetedReport = feesStore.getSpesificReport(reportId) as FeesReport;
    // console.log("targetedReport: ", targetedReport);

    state.salary = targetedReport.employee?.salary;

    state.report = {
      id: targetedReport.id,
      employee_id: targetedReport.employee_id,
      month_id: targetedReport.month_id,
      semester_id: targetedReport.semester_id,
      amount: targetedReport.amount,
      status: targetedReport.status,
      updated_at: new Date(),
    };

    state.employee_name = [
      targetedReport?.employee?.first_name,
      targetedReport?.employee?.second_name,
      targetedReport?.employee?.third_name,
      targetedReport?.employee?.last_name,
    ]
      .filter(Boolean)
      .join(" ");

    state.identity_number =
      targetedReport?.employee?.identity_number || "غير متوفر";
  } catch (err) {
    toastError({
      title: "خطأ في جلب التقرير",
      description: (err as Error).message || "حدث خطأ غير متوقع",
    });
    setTimeout(() => {
      navigateTo({ name: "financial-employee-salaries" });
    }, 1000);
  } finally {
    isLoading.value = false;
  }
};

const saveReport = async () => {
  if (!state.report) return;

  try {
    isLoading.value = true;
    await salariesStore.updateSalaryReport(state.report);
    state.report = null;
    navigateTo({ name: "financial-employee-salaries" });
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
  const salary = Number(state.salary);

  if (state.report) {
    // check if amount and salary were grater than 0
    if (amount && salary) {
      state.report.status =
        amount >= salary
          ? "مدفوع"
          : amount < salary && amount > 0
          ? "غير مكتمل"
          : "غير مدفوع";
    } else {
      state.report.status = "غير مدفوع";
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
              <h1>تعديل تقرير الراتب</h1>
              <UIcon
                name="i-lucide-credit-card"
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
                @click="navigateTo({ name: 'financial-employee-salaries' })"
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
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <UFormField label="اسم الموظف" name="employee_name" size="md">
                <UInput :value="state.employee_name" disabled class="w-full" />
              </UFormField>
              <UFormField label="رقم الهوية" name="identity_number" size="md">
                <UInput
                  :value="state.identity_number"
                  disabled
                  class="w-full"
                />
              </UFormField>
            </div>
            <!-- salary and status -->
            <div class="flex flex-wrap gap-2 mb-5">
              <div class="p-3 bg-secondary/15 rounded-md flex gap-3">
                <span class="font-bold">الراتب المستحق</span>
                <UBadge color="secondary" size="lg">
                  {{ state.salary }}
                </UBadge>
              </div>
              <UBadge
                :label="state.report.status"
                class="font-bold text-xl flex justify-center items-center"
                :color="
                  state.report.status === 'مدفوع'
                    ? 'success'
                    : state.report.status === 'غير مكتمل'
                    ? 'warning'
                    : 'error'
                "
              />
            </div>
            <!-- salary and amount -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <UFormField
                label="الراتب المدفوع"
                required
                name="amount"
                size="md"
              >
                <UInput
                  v-model.number="state.report.amount"
                  class="w-full"
                  type="number"
                  color="secondary"
                />
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
              :to="{ name: 'financial-employee-salaries' }"
            />
          </div>
        </template>
      </UCard>
    </UForm>
    <UCard v-else>
      <template #header>
        <div class="flex justify-start items-center gap-2">
          <h1>تعديل تقرير الراتب</h1>
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
