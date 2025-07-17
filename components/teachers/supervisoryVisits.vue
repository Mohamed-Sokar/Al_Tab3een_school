<script setup lang="ts">
import type { TableColumn, DropdownMenuItem } from "@nuxt/ui";
import { type SupervisoryVisitTeacher } from "~/types";
import { months } from "~/constants";
import { useTeachersStore } from "@/stores/teachers";

useHead({ title: "الزيارات الإشرافية" });

const teachersStore = useTeachersStore();
const { getArabicDayName, getDate } = useDateUtils();
const { exportToExcel } = useExportToExcel();

const globalFilter = ref("");
const tableKey = ref(Math.random());
const currentMonthIndex = new Date().getMonth();
const rowSelection = ref({});
const selectedMonth = ref(months[currentMonthIndex]);
const selectedVisits = computed(() =>
  Object.keys(rowSelection.value).map((index) => numberedVisits.value[+index])
);

const columns: TableColumn<SupervisoryVisitTeacher>[] = [
  {
    accessorKey: "rowNumber",
    header: "الرقم",
  },
  {
    accessorKey: "اسم المعلم",
    header: "اسم المعلم",
    cell: ({ row }) => {
      return (
        row.original?.teacher?.first_name +
        " " +
        row.original?.teacher?.last_name
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
    header: "تاريخ المخالفة",
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
function getDropdownActions(
  visit: SupervisoryVisitTeacher
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
          teachersStore.deleteSupervisorVisit(
            typeof visit.id === "number" ? visit.id : 0
          );
        },
      },
    ],
  ];
}

// Actions
const exportIssues = () => {
  exportToExcel({
    data: selectedVisits.value.map((visit, i) => ({
      الرقم: i + 1,
      الاسم: visit.teacher?.first_name + " " + visit.teacher?.last_name,
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
const filteredVisits = computed(() => {
  // tableKey.value = Math.random();
  return teachersStore.sortedSupervisorVisits.filter(
    (visit: SupervisoryVisitTeacher) =>
      new Date(visit.date ?? new Date()).getMonth() ===
      months.indexOf(selectedMonth.value)
  );
});
const numberedVisits = computed(() =>
  // filteredVisits.value.map((visit: SupervisoryVisitTeacher, index: number) => ({
  //   ...visit,
  //   rowNumber: index + 1,
  // }))
  teachersStore.sortedSupervisorVisits.map(
    (visit: SupervisoryVisitTeacher, index: number) => ({
      ...visit,
      rowNumber: index + 1,
    })
  )
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
    </div>
    <!-- End Filters -->

    <BaseTable
      :loading="teachersStore.loading"
      :key="tableKey"
      v-model:global-filter="globalFilter"
      v-model:row-selection="rowSelection"
      :data="numberedVisits"
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
  </div>
</template>
