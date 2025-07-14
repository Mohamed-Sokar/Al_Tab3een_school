<script setup lang="ts">
import type { TableColumn, DropdownMenuItem } from "@nuxt/ui";
import type { TeacherAbsenceReport } from "~/types";
import { months } from "~/constants";
import { useTeachersStore } from "@/stores/teachers";
const teachersStore = useTeachersStore();
const { getArabicDayName } = useDateUtils();
const { exportToExcel } = useExportToExcel();

const globalFilter = ref("");
const tableKey = ref(Math.random());
const currentMonthIndex = new Date().getMonth();
const selectedMonth = ref(months[currentMonthIndex]);
const selectedDate = ref(new Date().toISOString().split("T")[0]);
const rowSelection = ref({});
const { getDate } = useDateUtils();

const columns: TableColumn<TeacherAbsenceReport>[] = [
  {
    accessorKey: "rowNumber",
    header: "الرقم",
  },
  {
    accessorKey: "اسم المعلم",
    header: "اسم المعلم",
    cell: ({ row }) => {
      return (
        row.original.teacher?.first_name + " " + row.original.teacher?.last_name
      );
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
function getDropdownActions(report: TeacherAbsenceReport): DropdownMenuItem[] {
  return [
    [
      {
        label: "تعديل",
        icon: "i-lucide-edit",
        onSelect: () => {
          navigateTo(`/teachers/${report.id}/edit_absence_report`);
        },
      },
      {
        label: "حذف",
        icon: "i-lucide-trash",
        color: "error",
        onSelect: () => {
          teachersStore.deleteTeacherAbsenceReport(
            typeof report.id === "number" ? report.id : 0
          );
        },
      },
    ],
  ];
}

// Actions
const exportReports = () => {
  exportToExcel({
    data: selectedReports.value.map((report, i) => ({
      الرقم: i + 1,
      الاسم: report.teacher?.first_name + " " + report.teacher?.last_name,
      اليوم: getArabicDayName(report.created_at ?? ""),
      التاريخ: getDate(report.date ?? ""),
      "حالة الغياب": report.excuse_status,
      السبب: report.reason,
    })),
    fileName: "تقارير الغياب",
    sheetName: "تقارير الغياب",
  });
};

const filteredAbsenceReports = computed(() => {
  tableKey.value = Math.random();
  return teachersStore.sortedAbsenceReports.filter(
    (report: TeacherAbsenceReport) =>
      // report.date === selectedDate.value &&
      new Date(report.date || new Date()).getMonth() ===
      months.indexOf(selectedMonth.value)
  );
});
const numberedAbsenceReports = computed(() =>
  filteredAbsenceReports.value.map(
    (report: TeacherAbsenceReport, index: number) => ({
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
// const selectedReportsIds = computed(() =>
//   selectedReport.value.map((report) => report?.id)
// );

// watch(rowSelection, () => {
//   console.log(selectedReport.value);
// });
</script>

<template>
  <div>
    <!-- Start Filters -->
    <div class="mb-10">
      <UInput
        icon="i-lucide-search"
        size="lg"
        color="secondary"
        variant="outline"
        v-model="globalFilter"
        placeholder="البحث عن معلم..."
        class="w-full md:col-span-4"
      />
      <!-- <UInput
        v-model="selectedDate"
        type="date"
        size="lg"
        color="secondary"
        class="w-full"
      />
      <USelect
        v-model="selectedMonth"
        :items="months"
        size="lg"
        color="secondary"
        class="w-full"
      /> -->
    </div>
    <!-- End Filters -->

    <BaseTable
      :loading="teachersStore.loading"
      :key="tableKey"
      v-model:global-filter="globalFilter"
      v-model:row-selection="rowSelection"
      :data="numberedAbsenceReports"
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
    <!-- <UTable
      :loading="teachersStore.loading"
      :key="tableKey"
      v-model:global-filter="globalFilter"
      ref="table"
      :data="numberedAbsenceReports"
      :columns="columns"
    >
      <template #action-cell="{ row }">
        <UDropdownMenu :items="getDropdownActions(row.original)">
          <UButton
            icon="i-lucide-ellipsis-vertical"
            color="neutral"
            variant="soft"
            aria-label="Actions"
            class="p-2"
          />
        </UDropdownMenu>
      </template>
    </UTable> -->
  </div>
</template>
