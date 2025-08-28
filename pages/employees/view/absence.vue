<script setup lang="ts">
import type { TableColumn, DropdownMenuItem } from "@nuxt/ui";
import type { EmployeeAbsenceReport, Filters } from "~/types";

useHead({ title: "الحضور والغياب" });

// init
const absenceReportsStore = useEmployeeAbsenceReport();
const { getArabicDayName } = useDateUtils();
const { exportToExcel } = useExportToExcel();
const { getDate } = useDateUtils();

// Data
const columns: TableColumn<EmployeeAbsenceReport>[] = [
  {
    accessorKey: "rowNumber",
    header: "الرقم",
  },
  {
    accessorKey: "اسم الموظف",
    header: "اسم الموظف",
    cell: ({ row }) => {
      return (
        row.original.employee?.first_name +
        " " +
        row.original.employee?.last_name
      );
    },
  },
  {
    accessorKey: "المسمى الوظيفي",
    header: "المسمى الوظيفي",
    cell: ({ row }) => {
      return row.original?.employee?.job_title;
    },
  },
  {
    accessorKey: "اليوم",
    header: "اليوم",
    cell: ({ row }) => {
      const day = getArabicDayName(String(row.original.date));
      return day;
    },
  },
  {
    accessorKey: "التاريخ",
    header: "التاريخ",
    cell: ({ row }) => {
      const day = getDate(String(row.original.date));
      return day;
    },
  },
  {
    accessorKey: "excuse_status",
    header: "حالة العذر",
  },
  {
    accessorKey: "reason",
    header: "السبب",
  },
  {
    id: "action",
  },
];

// State
const rowSelection = ref({});
const pageNum = ref(1); // current page
const pageSize = ref(10); // rows per page
const filters = reactive<Filters>({
  firstNameFilter: undefined,
  secondNameFilter: undefined,
  thirdNameFilter: undefined,
  lastNameFilter: undefined,
  jobTitleFilter: undefined,
});
const paginationRef = ref();

// Actions
const exportReports = () => {
  exportToExcel({
    data: selectedReports.value.map((report, i) => ({
      الرقم: i + 1,
      الاسم: report.employee?.first_name + " " + report.employee?.last_name,
      اليوم: getArabicDayName(report.created_at ?? ""),
      التاريخ: getDate(report.date ?? ""),
      "حالة الغياب": report.excuse_status,
      السبب: report.reason,
    })),
    fileName: "تقارير الغياب",
    sheetName: "تقارير الغياب",
  });
};
function getDropdownActions(report: EmployeeAbsenceReport): DropdownMenuItem[] {
  return [
    [
      {
        label: "تعديل",
        icon: "i-lucide-edit",
        onSelect: () => {
          navigateTo({
            name: "employees-id-edit-absence-report",
            params: { id: report.id },
          });
        },
      },
      {
        label: "حذف",
        icon: "i-lucide-trash",
        color: "error",
        onSelect: () => {
          absenceReportsStore.deleteReport(
            typeof report.id === "number" ? report.id : 0
          );
        },
      },
    ],
  ];
}
const applyFilters = async () => {
  pageNum.value = 1;
  await absenceReportsStore.fetchReports(
    pageNum.value,
    pageSize.value,
    filters,
    true
  );
  paginationRef.value?.resetPage();
};
const resetFilters = () => {
  Object.assign(filters, {
    firstNameFilter: undefined,
    secondNameFilter: undefined,
    thirdNameFilter: undefined,
    lastNameFilter: undefined,
    jobTitleFilter: undefined,
  });
  // Optionally, trigger a fetch to refresh the table with no filters
  // onSubmitFilter();
};
const updateRows = async () => {
  await absenceReportsStore.fetchReports(
    pageNum.value,
    pageSize.value,
    filters
  );
};

// Computed Properties
const numberedAbsenceReports = computed(() =>
  absenceReportsStore.reportsData.map(
    (report: EmployeeAbsenceReport, index: number) => ({
      ...report,
      rowNumber: index + 1,
    })
  )
);
const selectedReports = computed(() =>
  Object.keys(rowSelection.value).map(
    (index) => numberedAbsenceReports.value[+index]
  )
);
const totalPages = computed(() => {
  return Math.ceil(
    absenceReportsStore.reportsCountData > 0
      ? Math.ceil(absenceReportsStore.reportsCountData / pageSize.value)
      : 1
  );
});
const rows = computed(() => {
  const start = (pageNum.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return numberedAbsenceReports.value.slice(start, end);
});

// Watches
watch(pageSize, () => {
  pageNum.value = 1;
});
// reset rowSelection when pageNum is changed
watch(pageNum, async () => {
  updateRows();
  rowSelection.value = {};
});
</script>

<template>
  <div>
    <!-- Start Filters -->
    <EmployeeFilters
      :filters="filters"
      @reset="resetFilters"
      @submit="applyFilters"
    />
    <!-- End Filters -->
    <BasePagination
      ref="paginationRef"
      :total-pages="totalPages"
      @update:page-num="pageNum = $event"
      @update:page-size="pageSize = $event"
    >
      <BaseTable
        :loading="absenceReportsStore.loading"
        v-model:row-selection="rowSelection"
        :data="rows"
        :columns="columns"
        :get-dropdown-actions="getDropdownActions"
      >
        <template #actions>
          <div
            v-if="selectedReports.length"
            class="flex flex-wrap justify-end gap-2 items-center"
          >
            <UButton
              icon="heroicons-document-chart-bar-solid"
              variant="outline"
              color="primary"
              size="sm"
              class="p-2 font-bold text-green-700"
              @click="exportReports"
            >
              <span>تصدير</span>
              <span>({{ selectedReports.length }})</span>
              <span> Excel </span>
            </UButton>
          </div>
        </template>
      </BaseTable>
    </BasePagination>
  </div>
</template>
