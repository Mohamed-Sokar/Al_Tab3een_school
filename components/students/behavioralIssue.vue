<script setup lang="ts">
import type { TableColumn, DropdownMenuItem } from "@nuxt/ui";
import type { BehavioralIssue } from "~/types";
import { months } from "~/constants";
import { useStudentStore } from "@/stores/students";
const { getArabicDayName } = useDateUtils();

const studentsStore = useStudentStore();

const globalFilter = ref("");
const rowSelection = ref({});
watch(rowSelection, () => {
  console.log(rowSelection.value);
  console.log(selectedIssues.value);
});
const table = ref();

const columns: TableColumn<BehavioralIssue>[] = [
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
      return row.original.student?.class?.title
        ? `${row.original.student?.class?.title} - ${row.original.student.class.group}`
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
    cell: ({ row }) => {
      const date = new Date(row.original.created_at ?? "");
      return date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
    },
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

function getDropdownActions(issue: BehavioralIssue): DropdownMenuItem[][] {
  return [
    [
      {
        label: "تعديل",
        icon: "i-lucide-edit",
        onSelect: () => {
          navigateTo(`/students/${issue.id}/edit_behavioral_issue`);
        },
      },
      {
        label: "حذف",
        icon: "i-lucide-trash",
        color: "error",
        onSelect: () => {
          studentsStore.deleteStudentBehavioralIssue(issue.id || 1);
        },
      },
    ],
  ];
}

const currentMonthIndex = new Date().getMonth();
const selectedMonth = ref(months[currentMonthIndex]);

const numberedIssues = computed(() =>
  studentsStore.sortedIssues.map((issue, index) => ({
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
    <div class="w-full grid md:grid-cols-6 gap-3 mt-5">
      <UInput
        icon="i-lucide-search"
        size="lg"
        color="secondary"
        variant="outline"
        v-model="globalFilter"
        placeholder="البحث عن طالب..."
        class="w-full md:col-span-4"
      />
      <USelect
        v-model="selectedMonth"
        :items="months"
        size="lg"
        color="secondary"
        class="w-full"
      />
    </div>
    <!-- End Filters -->

    <!-- start Export -->
    <div class="flex items-center justify-end gap-2 mt-8 mb-2">
      <UButton
        icon="heroicons-document-chart-bar-solid"
        variant="outline"
        color="secondary"
        size="sm"
        class="p-2 font-bold text-blue-700"
      >
        <span>تصدير</span>
        <span>({{ studentsStore.sortedIssues.length }})</span>
        <span> PDF </span>
      </UButton>
      <UButton
        icon="heroicons-document-chart-bar-solid"
        variant="outline"
        color="primary"
        size="sm"
        class="p-2 font-bold text-green-700"
      >
        <span>تصدير</span>
        <span>({{ studentsStore.sortedIssues.length }})</span>
        <span> Excel </span>
      </UButton>
    </div>
    <!-- end Export -->

    <BaseTable
      :loading="studentsStore.loading"
      :key="studentsStore.tableKey"
      v-model:global-filter="globalFilter"
      v-model:row-selection="rowSelection"
      :ref="table"
      :data="numberedIssues"
      :columns="columns"
      :get-dropdown-actions="getDropdownActions"
    />
    <!-- <UTable
      :loading="studentsStore.loading"
      :key="studentsStore.tableKey"
      v-model:global-filter="globalFilter"
      ref="table"
      :data="numberedIssues"
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
