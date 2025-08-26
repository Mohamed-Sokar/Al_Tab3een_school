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

// search for employee
const search = async () => {
  if (!filters.semesterFilter || !filters.monthFilter) {
    toastError({ title: "يرجى اختيار الفصل الدراسي والشهر" });
    return;
  }

  try {
    isLoading.value = true;

    // get count of all employees
    employeesCount.value = Number(await employeesStore.getEmployeesCount());

    // Bring employees
    await employeesStore.fetchEmployees(filters, true);
    employees.value = employeesStore.employeesData;

    // prepare reports array
    reports.value = employees.value.map((employee: Employee) => {
      return {
        employee_id: employee.id,
        semester_id: filters.semesterFilter,
        month_id: filters.monthFilter,
        amount: 0,
        notes: "",
        status: "غير مدفوع",
        salary: employee.salary,
        updated_at: new Date(),
      };
    });

    // prepare errors array
    pageErrors.value = employees.value.map(() => "");
  } finally {
    isLoading.value = false;
  }
};

const validateSalary = (index: number) => {
  const amount = Number(reports.value[index].amount);
  const salary = Number(reports.value[index].salary);

  if (isNaN(amount) || amount < 0) {
    pageErrors.value[index] = "قيمة الراتب غير صالح";
  } else if (amount > salary) {
    pageErrors.value[index] =
      "يجب أن يكون الراتب المدخل أقل أو يساوي الراتب المستحق";
  } else {
    pageErrors.value[index] = "";

    reports.value[index].status =
      amount >= salary
        ? "مدفوع"
        : amount < salary && amount > 0
        ? "غير مكتمل"
        : "غير مدفوع";
  }
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
    // remove reports that doesn't contain fees amount
    const filteredReport = reports.value.filter((r) => r.amount !== 0);
    const newReports = filteredReport.map((report) => {
      const { salary, ...rest } = report;
      return rest;
    });
    console.log(newReports);
    // save reports in DB
    await salariesStore.saveSalaryReports(newReports);

    toastSuccess({ title: "تم حفظ تقارير الرواتب بنجاح" });
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
  <div class="max-w-4xl mx-auto mt-15">
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
        <!-- جدول الطلاب -->
        <table class="w-full">
          <thead>
            <tr
              class="grid grid-cols-5 font-bold bg-secondary text-white place-items-center border-t border-b border-accented"
            >
              <th class="border-x border-accented p-2 w-full">الاسم رباعي</th>
              <th class="border-x border-accented p-2 w-full">
                الراتب المستحق
              </th>
              <th class="border-x border-accented p-2 w-full">
                الراتب المدفوع
              </th>
              <th class="border-x border-accented p-2 w-full">الحالة</th>
              <th class="border-x border-accented p-2 w-full">ملاحظات</th>
            </tr>
          </thead>
          <tbody v-if="!isLoading">
            <tr
              v-if="employees.length"
              class="grid grid-cols-5 place-items-center"
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
                  :color="pageErrors[index] ? 'error' : 'secondary'"
                  :highlight="pageErrors[index] ? true : false"
                  v-model.number="reports[index].amount"
                  @update:model-value="validateSalary(index)"
                  @input="validateSalary(index)"
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
