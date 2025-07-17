<script setup lang="ts">
import type { TableColumn, DropdownMenuItem } from "@nuxt/ui";
import type { BehavioralIssueEmployee } from "~/types";
import { months } from "~/constants";
import { useTeachersStore } from "@/stores/teachers";

useHead({ title: "المخالفات الإدارية" });

const teachersStore = useTeachersStore();
const { getArabicDayName } = useDateUtils();
const globalFilter = ref("");
const tableKey = ref(Math.random());
const currentMonthIndex = new Date().getMonth();
const rowSelection = ref({});
const selectedMonth = ref(months[currentMonthIndex]);
const { getDate } = useDateUtils();
const { exportToExcel } = useExportToExcel();

const columns: TableColumn<BehavioralIssueEmployee>[] = [
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
function getDropdownActions(
  issue: BehavioralIssueEmployee
): DropdownMenuItem[] {
  return [
    [
      {
        label: "Edit",
        icon: "i-lucide-edit",
        onSelect: () => {
          // console.log("Edit action for user:", student);
          navigateTo(`/teachers/${issue.id}/edit_behavioral_issue`);
        },
      },
      {
        label: "Delete",
        icon: "i-lucide-trash",
        color: "error",
        onSelect: () => {
          teachersStore.deleteTeacherBehavioralIssue(
            typeof issue.id === "number" ? issue.id : 0
          );
        },
      },
    ],
  ];
}

// Actions
const exportIssues = () => {
  exportToExcel({
    data: selectedIssues.value.map((issue, i) => ({
      الرقم: i + 1,
      الاسم: issue.teacher?.first_name + " " + issue.teacher?.last_name,
      اليوم: getArabicDayName(issue.created_at ?? ""),
      التاريخ: getDate(issue.created_at ?? ""),
      الوصف: issue.description,
    })),
    fileName: "المخالفات الإدارية",
    sheetName: "المخالفات الإدارية",
  });
};

const filteredIssues = computed(() => {
  // tableKey.value = Math.random();
  return teachersStore.sortedIssues.filter(
    (issue: BehavioralIssueEmployee) =>
      new Date(issue.created_at ?? new Date()).getMonth() ===
      months.indexOf(selectedMonth.value)
  );
});

const numberedIssues = computed(() =>
  filteredIssues.value.map((issue: BehavioralIssueEmployee, index: number) => ({
    ...issue,
    rowNumber: index + 1,
  }))
);
const selectedIssues = computed(() =>
  Object.keys(rowSelection.value).map((index) => numberedIssues.value[+index])
);
</script>

<template>
  <div>
    <!-- Start Filters -->
    <div class="w-full mb-10">
      <UInput
        icon="i-lucide-search"
        size="md"
        color="secondary"
        variant="outline"
        v-model="globalFilter"
        placeholder="البحث عن معلم..."
        class="w-full md:col-span-4"
      />

      <!-- <USelect
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
      :data="numberedIssues"
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
  </div>
</template>
