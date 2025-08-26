<script setup lang="ts">
import type { TableColumn, DropdownMenuItem } from "@nuxt/ui";
import type { AdministrativeIssueEmployee, Filters } from "~/types";
import { months } from "~/constants";

// SEO
useHead({ title: "المخالفات الإدارية" });

// init
const issuesStore = useEmployeeAdministrativeIssues();
const { getArabicDayName } = useDateUtils();
const { getDate } = useDateUtils();
const { exportToExcel } = useExportToExcel();

// data
const currentMonthIndex = new Date().getMonth();
const columns: TableColumn<AdministrativeIssueEmployee>[] = [
  {
    accessorKey: "rowNumber",
    header: "الرقم",
  },

  {
    accessorKey: "اسم الموظف",
    header: "اسم الموظف",
    cell: ({ row }) => {
      return (
        row.original?.employee?.first_name +
        " " +
        row.original?.employee?.last_name
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
    accessorKey: "التاريخ",
    header: "اليوم",
    cell: ({ row }) => {
      const day = getArabicDayName(String(row.original.created_at));
      return day;
    },
  },
  {
    accessorKey: "created_at",
    header: "تاريخ المخالفة",
    cell: ({ row }) => {
      const day = getDate(String(row.original.created_at));
      return day;
    },
  },
  {
    accessorKey: "description",
    header: "الوصف",
  },
  {
    id: "action",
  },
];

// state
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

// Watches
watch(pageSize, () => {
  pageNum.value = 1;
});
// reset rowSelection when pageNum is changed
watch(pageNum, async () => {
  updateRows();
  rowSelection.value = {};
});

// Actions
const exportIssues = () => {
  exportToExcel({
    data: selectedIssues.value.map((issue, i) => ({
      الرقم: i + 1,
      الاسم: issue.employee?.first_name + " " + issue.employee?.last_name,
      اليوم: getArabicDayName(issue.created_at ?? ""),
      التاريخ: getDate(issue.created_at ?? ""),
      الوصف: issue.description,
    })),
    fileName: "المخالفات الإدارية",
    sheetName: "المخالفات الإدارية",
  });
};
const updateRows = async () => {
  await issuesStore.fetchReports(pageNum.value, pageSize.value, filters);
};
function getDropdownActions(
  issue: AdministrativeIssueEmployee
): DropdownMenuItem[] {
  return [
    [
      {
        label: "Edit",
        icon: "i-lucide-edit",
        onSelect: () => {
          // console.log("Edit action for user:", student);
          navigateTo(`/employees/${issue.id}/edit-behavioral-issue`);
        },
      },
      {
        label: "Delete",
        icon: "i-lucide-trash",
        color: "error",
        onSelect: () => {
          issuesStore.deleteReport(typeof issue.id === "number" ? issue.id : 0);
        },
      },
    ],
  ];
}
const applyFilters = async () => {
  pageNum.value = 1;
  await issuesStore.fetchReports(pageNum.value, pageSize.value, filters, true);
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

// Computed Properties
const totalPages = computed(() => {
  return Math.ceil(
    issuesStore.reportsCountData > 0
      ? Math.ceil(issuesStore.reportsCountData / pageSize.value)
      : 1
  );
});
const rows = computed(() => {
  const start = (pageNum.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return numberedIssues.value.slice(start, end);
});
const numberedIssues = computed(() =>
  (issuesStore.reportsData as AdministrativeIssueEmployee[]).map(
    (issue: AdministrativeIssueEmployee, index: number) => ({
      ...issue,
      rowNumber: index + 1,
    })
  )
);
const selectedIssues = computed(() =>
  Object.keys(rowSelection.value).map((index) => numberedIssues.value[+index])
);
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
        :loading="issuesStore.loading"
        v-model:row-selection="rowSelection"
        :data="rows"
        :columns="columns"
        :get-dropdown-actions="getDropdownActions"
      >
        <template #actions>
          <div
            v-if="selectedIssues.length"
            class="flex flex-wrap justify-end gap-2 items-center"
          >
            <UButton
              icon="heroicons-document-chart-bar-solid"
              variant="outline"
              color="primary"
              size="sm"
              class="p-2 font-bold text-green-700"
              @click="exportIssues"
            >
              <span>تصدير</span>
              <span>({{ selectedIssues.length }})</span>
              <span> Excel </span>
            </UButton>
          </div>
        </template>
      </BaseTable>
    </BasePagination>
  </div>
</template>
