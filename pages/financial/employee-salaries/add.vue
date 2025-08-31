<script setup lang="ts">
import { object, number } from "yup";

import {
  type Semester,
  type Employee,
  type EmployeeSalaryReport,
  type Filters,
} from "~/types";
import { months } from "@/constants";

// SEO
useHead({ title: "إضافة راتب موظف" });

// init
const employeesStore = useEmployeesStore();
const gradesStore = useGradsStore();
const salariesStore = useSalariesStore();
const { toastError, toastSuccess } = useAppToast();
const schema = object({
  monthFilter: number().required("الشهر مطلوب"),
  semesterFilter: number().required("الفصل الدراسي مطلوب"),
});

const filters = reactive<Filters>({
  monthFilter: undefined,
  semesterFilter: undefined,
});

// state
const state = reactive<{
  employee_name: undefined | string;
}>({
  employee_name: undefined,
});

const isLoading = ref(false);
const employees = ref<Employee[]>([]);
const employeesCount = ref(0);
const reports = ref<EmployeeSalaryReport[]>([]);
const pageErrors = ref<string[]>([]);

const getCurrentMonthLoans = (row: Employee) => {
  return (
    row?.loans?.reduce((sum, loan) => {
      return (
        sum + (loan.month?.id === filters.monthFilter ? Number(loan.amount) : 0)
      );
    }, 0) || 0
  );
};

const getStatus = (
  // employee: Employee,
  deservedSalary: number,
  paidSalary: number
) => {
  if (paidSalary >= deservedSalary) return "مدفوع";
  if (paidSalary < deservedSalary && paidSalary > 0) return "غير مكتمل";
  return "غير مدفوع";
};

const getDeservedSalary = (employee: Employee) => {
  return Number(employee.salary) - getCurrentMonthLoans(employee);
};

const handleOverTimeSalaryChange = (index: number, value: number) => {
  reports.value[index].over_time_salary = value;

  // Recalculate deservedSalary automatically
  const baseSalary = Number(reports.value[index].salary);
  const currentMonthLoans = Number(reports.value[index].currentMonthLoans);
  reports.value[index].deservedSalary = baseSalary + value - currentMonthLoans;

  // Auto-adjust paidSalary to match new deservedSalary
  reports.value[index].paidSalary = reports.value[index].deservedSalary;

  // Update status
  reports.value[index].status = getStatus(
    reports.value[index].deservedSalary,
    reports.value[index].paidSalary
  );

  // Validate the salary
  validateSalary(index);
};
// search for employee
const search = async () => {
  if (!filters.semesterFilter || !filters.monthFilter) {
    toastError({ title: "يرجى اختيار الفصل الدراسي والشهر" });
    return;
  }

  const count = await salariesStore.checkReportsExist(filters);
  if (count && count > 0) {
    toastError({
      title: "تقارير رواتب هذا الشهر موجودة بالفعل",
      description: "لا يمكن إضافة تقارير رواتب لنفس الشهر والفصل الدراسي",
    });
    return;
  }
  try {
    isLoading.value = true;

    // get count of all employees
    employeesCount.value = Number(await employeesStore.getEmployeesCount());

    // Bring employees
    await employeesStore.fetchEmployees(1, employeesCount.value, filters, true);
    employees.value = employeesStore.employeesData;

    // Prepare reports array
    reports.value = employees.value.map((employee: Employee) => {
      const baseSalary = Number(employee.salary) || 0;
      const currentMonthLoans = getCurrentMonthLoans(employee);
      const paidSalary = baseSalary - currentMonthLoans;
      const deservedSalary = getDeservedSalary(employee);

      return {
        employee_id: employee.id,
        semester_id: filters.semesterFilter,
        month_id: filters.monthFilter,
        over_time_salary: 0,
        amount: 0,
        notes: "",
        salary: baseSalary,
        currentMonthLoans: currentMonthLoans,
        deservedSalary: deservedSalary,
        paidSalary: paidSalary,
        remainingSalary: deservedSalary - paidSalary,
        updated_at: new Date(),
        status: getStatus(deservedSalary, paidSalary),
      };
    });

    // Prepare errors array
    pageErrors.value = employees.value.map(() => "");
  } finally {
    isLoading.value = false;
  }
};

const validateSalary = (index: number) => {
  const paidSalary = Number(reports.value[index].paidSalary) || 0;
  const deservedSalary = Number(reports.value[index].deservedSalary) || 0;

  if (isNaN(paidSalary) || paidSalary <= 0) {
    pageErrors.value[index] = "قيمة الراتب غير صالح";
  } else if (paidSalary > deservedSalary) {
    pageErrors.value[index] =
      "يجب أن يكون الراتب المدخل أقل أو يساوي الراتب المستحق";
  } else {
    pageErrors.value[index] = "";
    reports.value[index].amount = paidSalary;
  }
  // update remainingSalary
  updateRemainingSalary(index);
};
const updateRemainingSalary = (index: number) => {
  const paidSalary = Number(reports.value[index].paidSalary) || 0;
  const deservedSalary = Number(reports.value[index].deservedSalary) || 0;

  // Update status
  reports.value[index].status = getStatus(deservedSalary, paidSalary);
  // Update remainingSalary
  reports.value[index].remainingSalary = deservedSalary - paidSalary;
};
// check page inputs
const checkPageInputs = () => {
  let hasError = false;

  reports.value.forEach((_, index: number) => {
    validateSalary(index);
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
    // Remove reports that doesn't contain fees amount
    const filteredReport = reports.value.filter((r) => r.amount !== 0);
    const newReports = filteredReport.map((report) => {
      const {
        salary,
        currentMonthLoans,
        deservedSalary,
        paidSalary,
        remainingSalary,
        ...rest
      } = report;
      return rest;
    });
    // save reports in DB
    await salariesStore.saveSalaryReports(newReports);
    // navigateTo({ name: "financial-employee-salaries" });

    // reset arrays
    employees.value = [];
    reports.value = [];
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await Promise.all([gradesStore.fetchSemesters()]);
});
</script>

<template>
  <div class="mx-auto mt-15">
    <UCard>
      <template #header>
        <div class="flex justify-between">
          <div class="flex justify-start items-center gap-2">
            <h1>إضافة رواتب العاملين</h1>
            <UIcon
              name="i-heroicons-book-open"
              size="xl"
              class="text-secondary text-2xl"
            />
          </div>
          <div>
            <UButton
              icon="heroicons-arrow-left-16-solid"
              color="secondary"
              size="sm"
              class="w-10 flex justify-center items-center hover:cursor-pointer"
              @click="navigateTo({ name: 'financial-employee-salaries' })"
            />
          </div>
        </div>
      </template>
      <template #default>
        <UForm
          :state="filters"
          :schema="schema"
          @submit="search"
          class="flex gap-2 flex-col justify-between items-start lg:items-start mb-5"
        >
          <div class="w-full grid grid-cols-1 lg:grid-cols-2 gap-2 mb-5">
            <UFormField
              label="الفصل الدراسي"
              required
              name="semesterFilter"
              size="md"
            >
              <USelect
                class="w-full"
                v-model="filters.semesterFilter"
                :items="
                gradesStore.semestersData.map((s:Semester) => ({
                label: `${s.year} - ${s.name}`,
                value: s.id,
              }))
            "
                placeholder="اختر الفصل الدراسي"
              />
            </UFormField>
            <UFormField label="الشهر" required name="monthFilter" size="md">
              <USelect
                class="w-full"
                v-model="filters.monthFilter"
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

        <div class="flex flex-wrap gap-2 mb-5" v-if="employees.length">
          <div class="p-3 bg-secondary/15 rounded-md flex gap-3">
            <span class="font-bold">عدد الموظفين</span>
            <UBadge color="secondary" size="lg" class="font-bold">
              {{ employeesCount }}
            </UBadge>
          </div>

          <div class="p-3 bg-info/15 rounded-md flex gap-3 items-center">
            <span class="font-bold">الموظفين غير مستلمين الراتب</span>
            <UBadge
              color="info"
              size="lg"
              class="font-bold"
              :label="employees.length"
            />
            <span class="font-bold text-xl text-gray-500"> / </span>
            <span class="font-bold text-xl text-gray-500">
              {{ employeesCount }}
            </span>
          </div>
        </div>

        <!-- student table -->
        <table class="w-full">
          <thead>
            <tr
              class="grid grid-cols-9 font-bold bg-secondary text-white place-items-center border-t border-b border-accented text-sm"
            >
              <th class="border-x border-accented p-2 w-full">الاسم رباعي</th>
              <th class="border-x border-accented p-2 w-full">
                الراتب الأساسي
              </th>
              <th class="border-x border-accented p-2 w-full">
                سلف الشهر الحالي
              </th>
              <th class="border-x border-accented p-2 w-full">راتب إضافي</th>
              <th class="border-x border-accented p-2 w-full">
                الراتب المستحق
              </th>
              <th class="border-x border-accented p-2 w-full">
                الراتب المدفوع
              </th>
              <th class="border-x border-accented p-2 w-full">المتبقي</th>
              <th class="border-x border-accented p-2 w-full">الحالة</th>
              <th class="border-x border-accented p-2 w-full">ملاحظات</th>
            </tr>
          </thead>
          <tbody v-if="!isLoading">
            <tr
              v-if="employees.length"
              class="grid grid-cols-9 place-items-center"
              v-for="(employee, index) in employees"
              :key="employee.id"
            >
              <td
                class="w-full h-full p-2 text-center border-x border-b border-accented flex justify-center items-center"
              >
                {{
                  [
                    employee.first_name,
                    employee.second_name,
                    employee.third_name,
                    employee.last_name,
                  ]
                    .filter(Boolean)
                    .join(" ")
                }}
              </td>
              <td
                class="w-full h-full p-2 border-x border-b border-accented flex flex-col justify-center"
              >
                <UInput
                  disabled
                  v-model.number="reports[index].salary"
                  type="number"
                />
              </td>
              <td
                class="w-full h-full p-2 border-x border-b border-accented flex flex-col justify-center"
              >
                <UInput
                  disabled
                  :model-value="reports[index].currentMonthLoans"
                  type="number"
                />
              </td>
              <td
                class="w-full h-full p-2 border-x border-b border-accented flex flex-col justify-center"
              >
                <UInput
                  v-model="reports[index].over_time_salary"
                  @update:model-value="
                    (val) => handleOverTimeSalaryChange(index, Number(val))
                  "
                  type="number"
                />
              </td>
              <td
                class="w-full h-full p-2 border-x border-b border-accented flex flex-col justify-center"
              >
                <UInput disabled :model-value="reports[index].deservedSalary" />
              </td>
              <td
                class="w-full h-full p-2 border-x border-b border-accented flex flex-col justify-center"
              >
                <UInput
                  :color="pageErrors[index] ? 'error' : 'secondary'"
                  :highlight="pageErrors[index] ? true : false"
                  v-model="reports[index].paidSalary"
                  @update:model-value="validateSalary(index)"
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
                  disabled
                  v-model="reports[index].remainingSalary"
                  type="number"
                />
              </td>
              <td
                class="w-full h-full p-2 text-center border-x border-b border-accented flex justify-center items-center"
              >
                <UBadge
                  :color="
                    reports[index].status === 'مدفوع'
                      ? 'success'
                      : reports[index].status === 'غير مكتمل'
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
      <template #footer v-if="employees.length">
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
            :to="{ name: 'financial-employee-salaries' }"
          />
        </div>
      </template>
    </UCard>
  </div>
</template>
