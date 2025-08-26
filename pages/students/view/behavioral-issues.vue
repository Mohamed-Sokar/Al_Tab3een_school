<script setup lang="ts">
import type { TableColumn, DropdownMenuItem } from "@nuxt/ui";
import type { Filters, StudentBehavioralIssue } from "~/types";

// init
const { getArabicDayName, getDate } = useDateUtils();
const behavioralIssuesStore = useStudentBehavioralIssues();
const { exportToExcel } = useExportToExcel();

// State
const pageNum = ref(1); // current page
const pageSize = ref(5); // rows per page
const filters = reactive<Filters>({
  academicClassFilter: undefined,
  levelFilter: undefined,
  firstNameFilter: undefined,
  secondNameFilter: undefined,
  thirdNameFilter: undefined,
  lastNameFilter: undefined,
  identityNumberFilter: undefined,
});
const rowSelection = ref({});
const table = ref();
const paginationRef = ref();

// Data
const columns: TableColumn<StudentBehavioralIssue>[] = [
  {
    accessorKey: "الرقم",
    header: "الرقم",
    cell: ({ row }) => {
      return row.original.rowNumber || "";
    },
  },

  {
    accessorKey: "اسم الطالب",
    header: "اسم الطالب",
    cell: ({ row }) => {
      const student = row.original.student;
      if (!student) return "غير معروف";
      return `${student.first_name} ${student.last_name}`;
    },
  },
  {
    accessorKey: "الصف",
    header: "الصف",
    cell: ({ row }) => {
      return row.original.student?.academic_class
        ? `${row.original.student?.academic_class?.title} - ${row.original.student.academic_class.group}`
        : "";
    },
  },

  {
    accessorKey: "اليوم",
    header: "اليوم",
    cell: ({ row }) => {
      const day = getArabicDayName(String(row.original.created_at));
      return day;
    },
  },
  {
    accessorKey: "التاريخ",
    header: "تاريخ المخالفة",
    cell: ({ row }) => getDate(row.original.created_at ?? ""),
  },
  {
    accessorKey: "الوصف",
    header: "الوصف",
    cell: ({ row }) => {
      return row.original.description || "لا يوجد وصف";
    },
  },
  {
    id: "action",
  },
];

// Actions
const exportIssues = () => {
  exportToExcel({
    data: selectedIssues.value.map((issue, i) => ({
      الرقم: i + 1,
      الاسم: [
        issue.student?.first_name,
        issue.student?.second_name,
        issue.student?.third_name,
        issue.student?.last_name,
      ]
        .filter(Boolean)
        .join(" "),
      "رقم الهوية": issue.student?.identity_number,
      الصف:
        issue.student?.academic_class?.title +
        " - " +
        issue.student?.academic_class?.group,
      اليوم: getArabicDayName(issue.created_at ?? ""),
      التاريخ: getDate(issue.created_at ?? ""),
      الوصف: issue.description,
    })),
    fileName: "المخالفات السلوكية",
    sheetName: "المخالفات السلوكية",
  });
};
function getDropdownActions(
  report: StudentBehavioralIssue
): DropdownMenuItem[][] {
  return [
    [
      {
        label: "تعديل",
        icon: "i-lucide-edit",
        onSelect: () => {
          navigateTo(`/students/${report.id}/edit-behavioral-issue`);
        },
      },
      {
        label: "حذف",
        icon: "i-lucide-trash",
        color: "error",
        onSelect: () => {
          behavioralIssuesStore.deleteReport(report.id ?? -1);
        },
      },
    ],
  ];
}
const onSubmit = async () => {
  pageNum.value = 1;
  await behavioralIssuesStore.fetchReports(
    pageNum.value,
    pageSize.value,
    filters,
    true
  );
  paginationRef.value?.resetPage();
};
const onReset = async () => {
  filters.academicClassFilter = undefined;
  filters.levelFilter = undefined;
  filters.firstNameFilter = undefined;
  filters.secondNameFilter = undefined;
  filters.thirdNameFilter = undefined;
  filters.lastNameFilter = undefined;
  filters.identityNumberFilter = undefined;
  // await behavioralIssuesStore.fetchReports(pageNum.value, pageSize.value, filters);
};

// Computed
const numberedIssues = computed(() =>
  behavioralIssuesStore.sortedReports.map((issue, index) => ({
    ...issue,
    rowNumber: index + 1,
  }))
);
const selectedIssues = computed(() =>
  Object.keys(rowSelection.value).map((index) => numberedIssues.value[+index])
);
const totalPages = computed(() => {
  return Math.ceil(
    behavioralIssuesStore.reportsCountData > 0
      ? Math.ceil(behavioralIssuesStore.reportsCountData / pageSize.value)
      : 1
  );
});

// pagination rows
const rows = computed(() => {
  const start = (pageNum.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return numberedIssues.value.slice(start, end);
});
</script>

<template>
  <div>
    <!-- Start Filters -->
    <StudentsBehavioralIssueFilters
      :filters="filters"
      @submit="onSubmit"
      @reset="onReset"
      :loading="behavioralIssuesStore.loading"
    />

    <BasePagination
      ref="paginationRef"
      :total-pages="totalPages"
      @update:page-num="pageNum = $event"
      @update:page-size="pageSize = $event"
    >
      <BaseTable
        :loading="behavioralIssuesStore.loading"
        v-model:row-selection="rowSelection"
        :ref="table"
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
