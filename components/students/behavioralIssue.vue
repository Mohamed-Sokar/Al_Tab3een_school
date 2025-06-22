<script setup lang="ts">
import type { TableColumn, DropdownMenuItem } from "@nuxt/ui";
import type { BehavioralIssue } from "~/types";
import { months } from "~/constants";
import { useStudentStore } from "@/stores/students";

const { behavioralIssuesStudentData, deleteStudentBehavioralIssue } =
  useStudentStore();

const { toastSuccess } = useAppToast();
const globalFilter = ref("");
const isLoading = ref(false);
const tableKey = ref(Math.random());

const columns: TableColumn<BehavioralIssue>[] = [
  {
    accessorKey: "rowNumber",
    header: "الرقم",
  },

  {
    accessorKey: "student_name",
    header: "اسم الطالب",
  },
  {
    accessorKey: "level",
    header: "الصف",
  },
  {
    accessorKey: "section",
    header: "الشعبة",
  },
  {
    accessorKey: "date",
    header: "تاريخ المخالفة",
  },
  {
    accessorKey: "description",
    header: "الوصف",
  },
  {
    id: "action",
  },
];

function getDropdownActions(issue: BehavioralIssue): DropdownMenuItem[][] {
  return [
    [
      {
        label: "Edit",
        icon: "i-lucide-edit",
        onSelect: () => {
          navigateTo(`/students/${issue.id}/edit_behavioral_issue`);
        },
      },
      {
        label: "Delete",
        icon: "i-lucide-trash",
        color: "error",
        onSelect: () => {
          deleteStudentBehavioralIssue(issue.id || 1);
          tableKey.value = Math.random();
        },
      },
    ],
  ];
}

const currentMonthIndex = new Date().getMonth();
const selectedMonth = ref(months[currentMonthIndex]);

const numberedIssues = computed(() =>
  behavioralIssuesStudentData.map((issue, index) => ({
    ...issue,
    rowNumber: index + 1,
  }))
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
        <span>({{ behavioralIssuesStudentData.length }})</span>
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
        <span>({{ behavioralIssuesStudentData.length }})</span>
        <span> Excel </span>
      </UButton>
    </div>
    <!-- end Export -->

    <UTable
      :loading="isLoading"
      :key="tableKey"
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
    </UTable>
  </div>
</template>
