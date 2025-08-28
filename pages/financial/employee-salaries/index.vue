<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useStudentStore } from "@/stores/students";
import { useAcademicClassesStore } from "@/stores/academic_classes";
import type { TableColumn, DropdownMenuItem } from "@nuxt/ui";
import type { EmployeeSalaryReport, FeesReport, Semester } from "~/types";
import { months } from "~/constants";

// SEO
useHead({ title: "تقارير رواتب المدرسين" });

// init
const salariesStore = useSalariesStore();
const { exportToExcel } = useExportToExcel();

// state
const isLoading = ref(false);
const pageCountOptions = [1, 2, 5, 10, 20, 50];
const table = ref();
const rowSelection = ref({});
const pageNum = ref(1);
const pageSize = ref(5);
const tableKey = ref(Math.random());
const filters = reactive({
  monthFilter: undefined,
  semesterFilter: undefined,
});
const sorting = ref([
  {
    id: "id",
    desc: false,
  },
]);
const UButton = resolveComponent("UButton");
const UBadge = resolveComponent("UBadge");

const getCurrentMonthLoans = (row: EmployeeSalaryReport) => {
  return (
    row.employee?.loans?.reduce((sum, loan) => {
      return sum + (loan.month?.id === row.month?.id ? Number(loan.amount) : 0);
    }, 0) || 0
  );
};

const columns: TableColumn<EmployeeSalaryReport>[] = [
  {
    accessorKey: "rowNumber",
    header: "الرقم",
  },
  {
    accessorKey: "الاسم الرباعي",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return h(UButton, {
        color: "neutral",
        variant: "ghost",
        label: "الاسم رباعي",
        icon: isSorted
          ? isSorted === "asc"
            ? "i-lucide-arrow-up-narrow-wide"
            : "i-lucide-arrow-down-wide-narrow"
          : "i-lucide-arrow-up-down",
        class: "-mx-2.5",
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
      });
    },
    cell: ({ row }) => {
      const report = row.original;
      return [
        report?.employee?.first_name,
        report?.employee?.second_name,
        report?.employee?.third_name,
        report?.employee?.last_name,
      ]
        .filter(Boolean)
        .join(" ");
    },
  },
  // {
  //   accessorKey: "identity_number",
  //   header: "هوية الموظف",
  //   cell: ({ row }) => row.original?.employee?.identity_number || "غير متوفر",
  // },
  {
    accessorKey: "month",
    header: "الشهر",
    cell: ({ row }) =>
      row.original.month
        ? `${row.original.month.name} ( ${row.original.month.id} )`
        : "غير متوفر",
  },
  {
    accessorKey: "الراتب الأساسي",
    header: "الراتب الأساسي",
    cell: ({ row }) => {
      return h(
        UBadge,
        {
          color: "neutral",
          variant: "soft",
        },
        () => row.original.employee?.salary
      );
    },
  },
  {
    accessorKey: "السلف لهذا الشهر",
    header: "السلف لهذا الشهر",
    cell: ({ row }) => {
      const loansThisMonth = getCurrentMonthLoans(row.original);
      return h(
        UBadge,
        {
          color: `${loansThisMonth === 0 ? "success" : "error"}`,
          variant: "soft",
          class: `${loansThisMonth > 0 ? "font-bold" : ""}`,
        },
        () => loansThisMonth
      );
    },
  },
  {
    accessorKey: "الراتب المستحق",
    header: "الراتب المستحق",
    cell: ({ row }) => {
      const loansThisMonth = getCurrentMonthLoans(row.original);
      const salary = Number(row.original.employee?.salary);
      const remainingSalary = salary - loansThisMonth;
      // const remainingSalary = salary - paidSalary - loansThisMonth;

      return h(
        UBadge,
        {
          color: "neutral",
          variant: "soft",
        },
        () => remainingSalary
      );
    },
  },
  {
    accessorKey: "الراتب المدفوع",
    header: "الراتب المدفوع",
    cell: ({ row }) => {
      const paidSalary = Number(row.original.amount);

      return h(
        UBadge,
        {
          color: "neutral",
          variant: "soft",
        },
        () => paidSalary
      );
    },
  },
  // {
  //   accessorKey: "المتبقي",
  //   header: "المتبقي",
  //   cell: ({ row }) => {
  //     const remain =
  //       Number(row.original.employee?.salary) - Number(row.original.amount);
  //     if (remain === 0) return "لا يوجد باقي";
  //     return h(
  //       UBadge,
  //       {
  //         color: `${remain === 0 ? "success" : "error"}`,
  //       },
  //       () => remain
  //     );
  //   },
  // },
  {
    accessorKey: "status",
    header: "الحالة",
    cell: ({ row }) => {
      const status = row.original.status ?? "غير مدفوع";
      const color = {
        مدفوع: "success",
        "غير مكتمل": "warning",
        "غير مدفوع": "error",
      }[status];

      return h(
        UBadge,
        {
          class: `capitalize hover:cursor-pointer hover:outline`,
          color,
        },
        () => status
      );
    },
  },
  {
    accessorKey: "notes",
    header: "الملاحظات",
    cell: ({ row }) => {
      const notes = row.original.notes;
      if (!notes?.length) {
        return `لا يوجد ملاحظات`;
      }
      return h(
        UBadge,
        {
          class: `capitalize`,
          variant: "solid",
          color: "neutral",
        },
        () => row.original.notes
      );
    },
  },
  {
    id: "action",
  },
];

// Actions
const fetchReports = async (forceRefresh: boolean = false) => {
  isLoading.value = true;
  await salariesStore.getReportsCount(filters);
  await salariesStore.fetchReports(
    pageNum.value,
    pageSize.value,
    filters,
    forceRefresh
  );
  isLoading.value = false;
};
const deleteReport = async (reportId: number) => {
  if (!confirm("هل أنت متأكد من حذف هذا التقرير؟")) return;
  isLoading.value = true;
  await salariesStore.deleteReport(reportId);
  isLoading.value = false;
};
function getDropdownActions(report: EmployeeSalaryReport): DropdownMenuItem[] {
  return [
    {
      label: "تعديل",
      icon: "i-lucide-edit",
      onSelect: () => {
        // navigateTo(`/employee-salaries/${report.id}/edit`);
        navigateTo({
          name: "financial-employee-salaries-id-edit",
          params: { id: report.id },
        });
      },
    },
    {
      label: "حذف",
      icon: "i-lucide-trash",
      color: "error",
      onSelect: () => deleteReport(report.id ?? 0),
    },
  ];
}
const exportReports = () => {
  exportToExcel({
    data: selectedReports.value.map((report, i) => ({
      الرقم: i + 1,
      "الاسم الكامل": [
        report?.employee?.first_name,
        report?.employee?.second_name,
        report?.employee?.third_name,
        report?.employee?.last_name,
      ]
        .filter(Boolean)
        .join(" "),
      "هوية الموظف": report.employee?.identity_number,
      الشهر: report.month?.name,
      "الراتب المستحق": report.employee?.salary,
      "الراتب المدفوع": report.amount,
      المتبقي: Number(report.employee?.salary) - Number(report.amount),
      الحالة: report.status,
      notes: report.notes,
    })),
    sheetName: `شهر (${
      months.find((m) => filters.monthFilter === m.value)?.label || "كل الأشهر"
    })`,
    fileName: `تقرير رواتب شهر (${
      months.find((m) => filters.monthFilter === m.value)?.label || "كل الأشهر"
    })`,
  });
};
// refresh reports when filtering
const applyFilters = async () => {
  await salariesStore.getReportsCount(filters);
  await fetchReports(true);
  pageNum.value = 1;
};
const updateRows = async () => {
  await salariesStore.fetchReports(pageNum.value, pageSize.value, filters);
};

onMounted(async () => {
  await Promise.all([useGradsStore().fetchSemesters()]);
});

// computed properties
const numberedReports = computed(() =>
  salariesStore.reportsData.map((report, index) => {
    return {
      ...report,
      rowNumber: index + 1,
    };
  })
);
// pagination rows
const rows = computed(() => {
  const start = (pageNum.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return numberedReports.value.slice(start, end);
});
const totalPages = computed(() => {
  return Math.ceil(
    salariesStore.reportsCountData > 0
      ? Math.ceil(salariesStore.reportsCountData / pageSize.value)
      : 1
  );
});
const selectedReports = computed(() => {
  // calculate offset
  const offset = (pageNum.value - 1) * pageSize.value;

  return Object.keys(rowSelection.value)
    .map((index) => {
      // تعديل الفهرس ليعكس الموضع في القائمة الكلية
      const globalIndex = offset + Number(index);
      return numberedReports.value[globalIndex];
    })
    .filter((report) => report !== undefined); // تصفية أي قيم غير موجودة
});

// watch
watch(pageSize, () => {
  pageNum.value = 1;
});
// reset rowSelection when pageNum is changed
watch(pageNum, async () => {
  updateRows();
  rowSelection.value = {}; // reset selections
});
</script>

<template>
  <div>
    <!-- start base header -->
    <BaseHeader
      title="رواتب العاملين"
      description="إدارة رواتب العاملين الشهرية"
    >
      <template #actions>
        <UButton
          color="secondary"
          label="أضف تقرير رواتب"
          size="lg"
          icon="heroicons-plus-circle-20-solid"
          class="bg-secondary-600 font-bold hover:cursor-pointer"
          :to="{ name: 'financial-employee-salaries-add' }"
        />
      </template>
    </BaseHeader>

    <div class="mt-5">
      <!-- start filters -->
      <div class="mb-5">
        <UForm :state="filters" @submit="applyFilters" class="">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-2 items-end mb-2">
            <UFormField
              label="الفصل الدراسي"
              required
              name="semester_id"
              size="md"
            >
              <USelect
                class="w-full"
                v-model="filters.semesterFilter"
                :items="
                useGradsStore().semestersData.map((s:Semester) => ({
                label: `${s.year} - ${s.name}`,
                value: s.id,
              }))
            "
                placeholder="اختر الفصل الدراسي"
              />
            </UFormField>
            <UFormField label="الشهر" required name="month_id" size="md">
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
            label="تصفية"
            class="hover:cursor-pointer rounded-sm"
            :loading="isLoading"
          />
        </UForm>
      </div>

      <!-- change pageSize -->
      <UFormField
        label="عدد الصفوف لكل صفحة"
        name="pageSize"
        class="flex items-center gap-2 mb-2"
      >
        <USelect v-model="pageSize" :items="pageCountOptions" id="pageSize" />
      </UFormField>
      <!-- employees table -->
      <BaseTable
        v-model:row-selection="rowSelection"
        v-model:sorting="sorting"
        :loading="salariesStore.loading"
        :key="tableKey"
        :ref="table"
        :data="rows"
        :columns="columns"
        :get-dropdown-actions="getDropdownActions"
      >
        <template #actions>
          <div
            v-if="selectedReports.length"
            class="flex flex-wrap justify-end gap-2 items-center"
          >
            <!-- Excel export button -->
            <UButton
              icon="heroicons-document-chart-bar-solid"
              variant="outline"
              color="primary"
              size="xs"
              class="p-2 font-bold text-green-700 h-full"
              @click="exportReports"
            >
              <span>({{ selectedReports.length }})</span>
              <span> Excel </span>
            </UButton>
          </div>
        </template>
      </BaseTable>

      <!-- pagination tools -->
      <div class="flex justify-between items-center mt-4">
        <!-- prev button -->
        <UButton
          :disabled="pageNum === 1"
          @click="pageNum--"
          color="secondary"
          class="px-4 py-2 text-white rounded hover:cursor-pointer disabled:bg-gray-300 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
          label="السابق"
        />

        <!-- page numbers -->
        <div class="flex gap-2">
          <UButton
            color="secondary"
            :variant="pageNum === p ? 'solid' : 'outline'"
            v-for="p in totalPages"
            :key="p"
            @click="pageNum = p"
            :class="['px-3 py-1 rounded hover:cursor-pointer']"
          >
            {{ p }}
          </UButton>
        </div>

        <!-- next button -->
        <UButton
          :disabled="pageNum >= totalPages"
          @click="pageNum++"
          color="secondary"
          class="px-4 py-2 text-white rounded hover:cursor-pointer disabled:bg-gray-300 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
          label="التالي"
        />
      </div>
    </div>
  </div>
</template>
