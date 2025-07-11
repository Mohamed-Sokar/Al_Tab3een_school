<script setup lang="ts">
import type { TableColumn, DropdownMenuItem } from "@nuxt/ui";
import type { TeacherLoan } from "~/types";
import { months } from "~/constants";
import { useTeachersStore } from "@/stores/teachers";
const { getArabicDayName, getDate } = useDateUtils();
const teachersStore = useTeachersStore();

const globalFilter = ref("");
const tableKey = ref(Math.random());
const currentMonthIndex = new Date().getMonth();
const selectedMonth = ref(months[currentMonthIndex]);
const rowSelection = ref({});

const sorting = ref([
  {
    id: "id",
    desc: false,
  },
]);
const columns: TableColumn<TeacherLoan>[] = [
  {
    accessorKey: "rowNumber",
    header: "الرقم",
  },

  {
    accessorKey: "اسم المعلم",
    header: "اسم المعلم",
    cell: ({ row }) => {
      return (
        row.original.teacher.first_name + " " + row.original.teacher.last_name
      );
    },
  },
  {
    accessorKey: "يوم السلفة",
    header: "اليوم",
    cell: ({ row }) => {
      const day = getArabicDayName(String(row.original.created_at));
      return day;
    },
  },
  {
    accessorKey: "تاريخ المخالفة",
    header: "تاريخ المخالفة",
    cell: ({ row }) => {
      const day = getDate(String(row.original.created_at));
      return day;
    },
  },
  {
    accessorKey: "amount",
    header: "قيمة السلفة",
  },
  {
    id: "action",
  },
];
function getDropdownActions(loan: TeacherLoan): DropdownMenuItem[] {
  return [
    [
      {
        label: "تعديل",
        icon: "i-lucide-edit",
        onSelect: () => {
          // console.log("Edit action for user:", student);
          navigateTo(`/teachers/${loan.id}/edit_loan`);
        },
      },
      {
        label: "حذف",
        icon: "i-lucide-trash",
        color: "error",
        onSelect: () => {
          teachersStore.deleteTeacherLoan(
            typeof loan.id === "number" ? loan.id : 0
          );
        },
      },
    ],
  ];
}
const filteredLoans = computed(() => {
  tableKey.value = Math.random(); // Reset table key to force re-render
  if (selectedMonth.value === "كل الأشهر") {
    return teachersStore.sortedLoans;
  }
  return teachersStore.sortedLoans.filter(
    (loan) =>
      new Date(loan.created_at || new Date()).getMonth() ===
      months.indexOf(selectedMonth.value)
  );
});
const numberedLoans = computed(() =>
  filteredLoans.value.map((loan, index) => ({
    ...loan,
    rowNumber: index + 1,
  }))
);
const selectedLoans = computed(() =>
  Object.keys(rowSelection.value).map((index) => numberedLoans.value[+index])
);
const selectedLoansIds = computed(() =>
  selectedLoans.value.map((loan) => loan?.id)
);

watch(rowSelection, () => {
  console.log(selectedLoans.value);
});
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
        <span>({{ numberedLoans.length }})</span>
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
        <span>({{ numberedLoans.length }})</span>
        <span> Excel </span>
      </UButton>
    </div>
    <!-- end Export -->

    <!-- Start Table -->
    <BaseTable
      :loading="teachersStore.loading"
      :key="tableKey"
      v-model:global-filter="globalFilter"
      v-model:row-selection="rowSelection"
      :data="numberedLoans"
      :columns="columns"
      v-model:sorting="sorting"
      :get-dropdown-actions="getDropdownActions"
    />
    <!-- <UTable
      :loading="teachersStore.loading"
      :key="tableKey"
      v-model:global-filter="globalFilter"
      ref="table"
      :data="numberedLoans"
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
