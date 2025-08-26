<script setup lang="ts">
import type { TableColumn, DropdownMenuItem } from "@nuxt/ui";
import { type Filters, type EmployeeSupervisoryVisit } from "~/types";
import { months } from "~/constants";

useHead({ title: "الزيارات الإشرافية" });

// init
const visitsStore = useEmployeeSupervisoryVisits();
const { getArabicDayName, getDate } = useDateUtils();
const { exportToExcel } = useExportToExcel();

// Data
const columns: TableColumn<EmployeeSupervisoryVisit>[] = [
  {
    accessorKey: "rowNumber",
    header: "الرقم",
  },
  {
    accessorKey: "اسم المعلم",
    header: "اسم المعلم",
    cell: ({ row }) => {
      return (
        row.original?.employee?.first_name +
        " " +
        row.original?.employee?.last_name
      );
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
    accessorKey: "date",
    header: "تاريخ الزيارة",
    cell: ({ row }) => {
      const day = getDate(String(row.original.date));
      return day;
    },
  },
  {
    accessorKey: "type",
    header: "نوع الزيارة",
  },
  {
    accessorKey: "supervisor",
    header: "المشرف الزائر",
  },
  {
    accessorKey: "notes",
    header: "ملاحظات",
  },
  {
    id: "action",
  },
];

// State
const filters = reactive<Filters>({
  firstNameFilter: undefined,
  secondNameFilter: undefined,
  thirdNameFilter: undefined,
  lastNameFilter: undefined,
  jobTitleFilter: undefined,
});
const pageNum = ref(1); // current page
const pageSize = ref(10); // rows per page
const rowSelection = ref({});

// Actions
const exportIssues = () => {
  exportToExcel({
    data: selectedVisits.value.map((visit, i) => ({
      الرقم: i + 1,
      الاسم: visit.employee?.first_name + " " + visit.employee?.last_name,
      اليوم: getArabicDayName(visit.created_at ?? ""),
      التاريخ: getDate(visit.created_at ?? ""),
      "نوع الزيارة": visit.type,
      "المشرف الزائر": visit.supervisor,
      ملاحظات: visit.notes,
    })),
    fileName: "الزيارات الإشرافية",
    sheetName: "الزيارات الإشرافية",
  });
};
const applyFilters = async () => {
  await visitsStore.fetchReports(pageNum.value, pageSize.value, filters, true);
  pageNum.value = 1;
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
  await visitsStore.fetchReports(pageNum.value, pageSize.value, filters);
};
function getDropdownActions(
  visit: EmployeeSupervisoryVisit
): DropdownMenuItem[] {
  return [
    [
      {
        label: "تعديل",
        icon: "i-lucide-edit",
        onSelect: () => {
          navigateTo(`/teachers/${visit.id}/edit_supervisory_visit`);
        },
      },
      {
        label: "حذف",
        icon: "i-lucide-trash",
        color: "error",
        onSelect: () => {
          visitsStore.deleteReport(typeof visit.id === "number" ? visit.id : 0);
        },
      },
    ],
  ];
}

// Computed Properties
const totalPages = computed(() => {
  return Math.ceil(
    visitsStore.reportsCountData > 0
      ? Math.ceil(visitsStore.reportsCountData / pageSize.value)
      : 1
  );
});
const selectedVisits = computed(() =>
  Object.keys(rowSelection.value).map((index) => numberedVisits.value[+index])
);
const rows = computed(() => {
  const start = (pageNum.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return numberedVisits.value.slice(start, end);
});
const numberedVisits = computed(() =>
  visitsStore.reportsData.map(
    (visit: EmployeeSupervisoryVisit, index: number) => ({
      ...visit,
      rowNumber: index + 1,
    })
  )
);

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
      :total-pages="totalPages"
      @update:page-num="pageNum = $event"
      @update:page-size="pageSize = $event"
    >
      <BaseTable
        :loading="visitsStore.loading"
        v-model:row-selection="rowSelection"
        :data="rows"
        :columns="columns"
        :get-dropdown-actions="getDropdownActions"
      >
        <template #actions>
          <div
            v-if="selectedVisits.length"
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
              <span>({{ selectedVisits.length }})</span>
              <span> Excel </span>
            </UButton>
          </div>
        </template>
      </BaseTable>
    </BasePagination>
  </div>
</template>
