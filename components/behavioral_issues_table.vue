<script setup lang="ts">
import type { TableColumn, DropdownMenuItem } from "@nuxt/ui";
import { type BehavioralIssue, type GradesReport, type Student } from "~/types";
import { months, behavioralIssues, gradesReports } from "~/constants";

const toast = useToast();
const globalFilter = ref("");
const isLoading = ref(false);
const tableKey = ref(Math.random());
const issues = ref(behavioralIssues);

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

function getDropdownActions(issue: GradesReport): DropdownMenuItem[][] {
  return [
    [
      // {
      //   label: "Copy user Id",
      //   icon: "i-lucide-copy",
      //   onSelect: () => {
      //     navigator.clipboard.writeText(issue.id.toString());
      //     toast.add({
      //       title: "User ID copied to clipboard!",
      //       color: "success",
      //       icon: "i-lucide-circle-check",
      //     });
      //   },
      // },
    ],
    [
      {
        label: "Edit",
        icon: "i-lucide-edit",
        onSelect: () => {
          // console.log("Edit action for user:", student);
          navigateTo(`/students/${issue.id}/edit_behavioral_issue`);
        },
      },
      {
        label: "Delete",
        icon: "i-lucide-trash",
        color: "error",
        onSelect: () => {
          deleteIssue(issue.id);
        },
      },
    ],
  ];
}

const currentMonthIndex = new Date().getMonth();
const selectedMonth = ref(months[currentMonthIndex]);

const numberedIssues = computed(() =>
  issues.value.map((issue, index) => ({
    ...issue,
    rowNumber: index + 1,
  }))
);

const deleteIssue = (id: any) => {
  const issueIndex = behavioralIssues.findIndex((issue) => issue.id === id);

  if (issueIndex === -1) return;

  issues.value.splice(issueIndex, 1);
  tableKey.value = Math.random();
};
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
        <span>({{ behavioralIssues.length }})</span>
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
        <span>({{ behavioralIssues.length }})</span>
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
