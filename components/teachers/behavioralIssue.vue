<script setup lang="ts">
import type { TableColumn, DropdownMenuItem } from "@nuxt/ui";
import { type BehavioralIssueTeacher } from "~/types";
import { months } from "~/constants";
import { useTeachersStore } from "@/stores/teachers";
const teachersStore = useTeachersStore();
const { getArabicDayName } = useDateUtils();
const globalFilter = ref("");
const tableKey = ref(Math.random());
const currentMonthIndex = new Date().getMonth();
const selectedMonth = ref(months[currentMonthIndex]);

const columns: TableColumn<BehavioralIssueTeacher>[] = [
  {
    accessorKey: "rowNumber",
    header: "الرقم",
  },

  {
    accessorKey: "teacher_name",
    header: "اسم المعلم",
  },
  {
    accessorKey: "date",
    header: "اليوم",
    cell: ({ row }) => {
      const day = getArabicDayName(String(row.original.date));
      return day;
    },
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

function getDropdownActions(issue: BehavioralIssueTeacher): DropdownMenuItem[] {
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

const filteredIssues = computed(() => {
  // tableKey.value = Math.random();
  return teachersStore.sortedIssues.filter(
    (issue) =>
      new Date(issue.date ?? new Date()).getMonth() ===
      months.indexOf(selectedMonth.value)
  );
});

const numberedIssues = computed(() =>
  filteredIssues.value.map((issue, index) => ({
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
        placeholder="البحث عن معلم..."
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
        <span>({{ numberedIssues.length }})</span>
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
        <span>({{ numberedIssues.length }})</span>
        <span> Excel </span>
      </UButton>
    </div>
    <!-- end Export -->

    <UTable
      :loading="teachersStore.loading"
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
