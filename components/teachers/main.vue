<script setup lang="ts">
import type { TableColumn, DropdownMenuItem } from "@nuxt/ui";
import type { Teacher } from "~/types";
import { useTeachersStore } from "@/stores/teachers";
import type { Column } from "@tanstack/vue-table";

const teachersStore = useTeachersStore();
const { getArabicDayName } = useDateUtils();
type Flag = "behavioral_issues" | "loans" | "absence";

const globalFilter = ref("");
const sorting = ref([
  {
    id: "id",
    desc: false,
  },
]);
const tableKey = ref(Math.random());
const UBadge = resolveComponent("UBadge");
const UButton = resolveComponent("UButton");
const UDropdownMenu = resolveComponent("UDropdownMenu");
const selectedTeacher = ref<Teacher>();
const selectedArrayFlag = ref<Flag>();
const showModal = ref(false);
const table = ref();

function showIssuesModal(teacher: Teacher, flag: Flag) {
  selectedArrayFlag.value = flag;
  selectedTeacher.value = teacher;
  showModal.value = true;
}

const columns: TableColumn<Teacher>[] = [
  {
    accessorKey: "rowNumber",
    header: "الرقم",
  },
  {
    accessorKey: "identity_number",
    header: "الهوية",
  },
  {
    accessorKey: "full_name",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return h(UButton, {
        color: "neutral",
        variant: "ghost",
        label: "الاسم رباعي",
        icon: isSorted
          ? isSorted === "asc"
            ? "i-lucide-arrow-up-narrow-wide"
            : "i-lucide-arrow-down-wide-narrow"
          : "i-lucide-arrow-up-down",
        class: "-mx-2.5 ",
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
      });
    },
  },
  {
    accessorKey: "phone_number",
    header: "رقم الجوال",
  },
  {
    accessorKey: "birth_date",
    // header: "تاريخ الميلاد",
    header: ({ column }) => getHeader(column, "تاريخ الميلاد"),
    cell: ({ row }) => {
      // return new Date(row.getValue("birth_date")).toLocaleString("en-US", {
      //   day: "numeric",
      //   month: "short",
      //   hour: "2-digit",
      //   minute: "2-digit",
      //   hour12: false,
      // });
      return row.original.birth_date;
    },
  },
  {
    accessorKey: "subject",
    header: "المادة",
  },
  {
    accessorKey: "teachers_behavioral_issues",
    header: "المخالفات الإدارية",
    cell: ({ row }) => {
      const issues = row.original.teachers_behavioral_issues || [];
      return h(
        UBadge,
        {
          class: `capitalize hover:cursor-pointer hover:outline ${
            issues.length > 0 ? "font-bold" : "font-normal"
          }`,
          variant: `${issues.length > 0 ? "subtle" : "soft"}`,
          color: `${issues.length > 0 ? "error" : "success"}`,
          onClick: () => showIssuesModal(row.original, "behavioral_issues"),
        },
        () => `${issues.length} مخالفة`
      );
    },
  },
  {
    accessorKey: "teachers_loans",
    header: "السلف المستحقة",
    cell: ({ row }) => {
      const loans = row.original.teachers_loans || [];
      return h(
        UBadge,
        {
          class: `capitalize hover:cursor-pointer hover:outline ${
            loans.length > 0 ? "font-bold" : "font-normal"
          }`,
          variant: `${loans.length ? "subtle" : "soft"}`,
          color: `${loans.length ? "error" : "success"}`,
          onClick: () => showIssuesModal(row.original, "loans"),
        },

        () => `${loans.length} سلفة`
      );
    },
  },
  {
    accessorKey: "teachers_absence",
    header: "أيام الغياب",
    cell: ({ row }) => {
      const absences = row.original.teachers_absence || [];
      return h(
        UBadge,
        {
          class: `capitalize hover:cursor-pointer hover:outline ${
            absences.length > 0 ? "font-bold" : "font-normal"
          }`,
          variant: `${absences.length ? "subtle" : "soft"}`,
          color: `${absences.length ? "error" : "success"}`,
          onClick: () => showIssuesModal(row.original, "absence"),
        },

        () => `${absences.length} يوم`
      );
    },
  },
  // {
  //   accessorKey: "upsent_reports_count",
  //   header: "عدد أيام الغياب",
  //   cell: ({ row }) => {
  //     const days_count = row.original.upsent_reports_count ?? 0;

  //     return h(
  //       UBadge,
  //       {
  //         class: `capitalize ${days_count ? "font-bold" : "font-normal"}`,
  //         variant: `${days_count === 0 ? "soft" : "subtle"}`,

  //         color: `${
  //           days_count === 1 || days_count === 2
  //             ? "warning"
  //             : days_count >= 3
  //             ? "error"
  //             : "success"
  //         }`,
  //       },
  //       () => days_count
  //     );
  //   },
  // },
  // {
  //   accessorKey: "loans_count",
  //   header: "عدد السلف",
  //   cell: ({ row }) => {
  //     const loansCount = row.original.loans_count ?? 0;
  //     return h(
  //       UBadge,
  //       {
  //         class: `capitalize ${loansCount ? "font-bold" : "font-normal"}`,
  //         variant: `${loansCount ? "subtle" : "soft"}`,
  //         color: `${loansCount ? "error" : "success"}`,
  //       },
  //       () => loansCount
  //     );
  //   },
  // },
  {
    id: "action",
  },
];
function getHeader(column: Column<Teacher>, label: string) {
  const isSorted = column.getIsSorted();

  return h(
    UDropdownMenu,
    {
      content: {
        align: "start",
      },
      "aria-label": "Actions dropdown",
      items: [
        {
          label: "Asc",
          type: "checkbox",
          icon: "i-lucide-arrow-up-narrow-wide",
          checked: isSorted === "asc",
          onSelect: () => {
            if (isSorted === "asc") {
              column.clearSorting();
            } else {
              column.toggleSorting(false);
            }
          },
        },
        {
          label: "Desc",
          icon: "i-lucide-arrow-down-wide-narrow",
          type: "checkbox",
          checked: isSorted === "desc",
          onSelect: () => {
            if (isSorted === "desc") {
              column.clearSorting();
            } else {
              column.toggleSorting(true);
            }
          },
        },
      ],
    },
    () =>
      h(UButton, {
        color: "neutral",
        variant: "ghost",
        label,
        icon: isSorted
          ? isSorted === "asc"
            ? "i-lucide-arrow-up-narrow-wide"
            : "i-lucide-arrow-down-wide-narrow"
          : "i-lucide-arrow-up-down",
        class: "-mx-2.5 data-[state=open]:bg-elevated",
        "aria-label": `Sort by ${
          isSorted === "asc" ? "descending" : "ascending"
        }`,
      })
  );
}
function getDropdownActions(teacher: Teacher): DropdownMenuItem[][] {
  return [
    [
      {
        label: "إضافة تقرير غياب",
        color: "error",
        icon: "i-heroicons-user-minus",
        onSelect: () => {
          navigateTo(`/teachers/${teacher.id}/add_absence_report`);
        },
      },
      {
        label: "إضافة مخالفة إدارية",
        color: "warning",
        icon: "i-heroicons-exclamation-triangle",
        onSelect: () => {
          navigateTo(`/teachers/${teacher.id}/add_behavioral_issue`);
        },
      },
      {
        label: "إضافة سلفة",
        color: "info",
        icon: "i-heroicons-banknotes",
        onSelect: () => {
          navigateTo(`/teachers/${teacher.id}/add_loan`);
        },
      },
    ],
    [
      {
        label: "Edit",
        icon: "i-lucide-edit",
        onSelect: () => {
          navigateTo(`/teachers/${teacher.id}/edit_teacher`);
        },
      },
      {
        label: "Delete",
        icon: "i-lucide-trash",
        color: "error",
        onSelect: () => {
          teachersStore.deleteTeacher(teacher.id || "");
          // tableKey.value = Math.random();
        },
      },
    ],
  ];
}

const numberedTeachers = computed(() => {
  return teachersStore.sortedTeachers.map((teacher, index) => ({
    ...teacher,
    rowNumber: index + 1,
  }));
});
</script>

<template>
  <div>
    <UModal
      v-model:open="showModal"
      :title="
        selectedArrayFlag === 'behavioral_issues'
          ? 'تفاصيل المخالفات'
          : selectedArrayFlag === 'loans'
          ? 'تفاصيل السلف'
          : selectedArrayFlag === 'absence'
          ? 'تفاصيل أيام الغياب'
          : ''
      "
    >
      <template #body>
        <div v-if="selectedArrayFlag === 'behavioral_issues'">
          <div v-if="selectedTeacher?.teachers_behavioral_issues?.length">
            <ul>
              <li
                class="grid grid-cols-3 justify-between items-center gap-2 border-b py-2"
              >
                <span class="font-bold">اليوم</span>
                <span class="font-bold">التاريخ</span>
                <span class="font-bold">المخالفة</span>
              </li>
              <li
                v-for="(
                  issue, index
                ) in selectedTeacher.teachers_behavioral_issues"
                :key="index"
                class="grid grid-cols-3 justify-between items-center gap-2 border-b border-dashed border-gray-200 py-2 mb-2"
              >
                <span>
                  {{ getArabicDayName(issue.date + "") }}
                </span>
                <span> {{ issue.date }} </span>
                <span> {{ issue.description }} </span>
              </li>
            </ul>
            <div class="pt-3">
              <span> المجموع: </span>
              <span class="font-bold">
                {{ selectedTeacher.teachers_behavioral_issues.length }}
              </span>
            </div>
          </div>

          <p v-else>لا توجد مخالفات.</p>
        </div>

        <div v-else-if="selectedArrayFlag === 'loans'">
          <div v-if="selectedTeacher?.teachers_loans?.length">
            <ul>
              <li
                class="grid grid-cols-3 justify-between items-center gap-2 border-b py-2"
              >
                <span class="font-bold">اليوم</span>
                <span class="font-bold">التاريخ</span>
                <span class="font-bold">القيمة</span>
              </li>
              <li
                v-for="(loan, index) in selectedTeacher.teachers_loans"
                :key="index"
                class="grid grid-cols-3 justify-between items-center gap-2 border-b border-dashed border-gray-200 py-2 mb-2"
              >
                <span>
                  {{ getArabicDayName(loan.date + "") }}
                </span>
                <span> {{ loan.date }} </span>
                <span> {{ loan.amount }} ₪ </span>
              </li>
            </ul>
            <div class="pt-3">
              <span> المجموع: </span>
              <span class="font-bold">
                {{
                  selectedTeacher.teachers_loans.reduce(
                    (previousValue, loan) => previousValue + (loan.amount || 0),
                    0
                  )
                }}
                ₪
              </span>
            </div>
          </div>

          <p v-else>لا توجد سلف مستحقة.</p>
        </div>

        <div v-else-if="selectedArrayFlag === 'absence'">
          <div v-if="selectedTeacher?.teachers_absence?.length">
            <ul>
              <li
                class="grid grid-cols-4 justify-between items-center gap-2 border-b py-1"
              >
                <span class="font-bold">اليوم</span>
                <span class="font-bold">التاريخ</span>
                <span class="font-bold">حالة العذر</span>
                <span class="font-bold">سبب الغياب</span>
              </li>
              <li
                v-for="(report, index) in selectedTeacher.teachers_absence"
                :key="index"
                class="grid grid-cols-4 justify-center items-center gap-2 border-b border-dashed border-gray-200 py-2 mb-2"
              >
                <span>
                  {{ getArabicDayName(report.date + "") }}
                </span>
                <span> {{ report.date }} </span>
                <span> {{ report.excuse_status }} </span>
                <span> {{ report.reason }} </span>
              </li>
            </ul>
            <div class="pt-3">
              <span> المجموع: </span>
              <span class="font-bold">
                {{ selectedTeacher.teachers_absence.length }}
              </span>
            </div>
          </div>

          <p v-else>لا يوجد أيام غياب.</p>
        </div>
      </template>
    </UModal>
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
        <span>({{ numberedTeachers.length }})</span>
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
        <span>({{ numberedTeachers.length }})</span>
        <span> Excel </span>
      </UButton>
    </div>
    <!-- end Export -->

    <BaseTable
      :loading="teachersStore.loading"
      :key="tableKey"
      v-model:global-filter="globalFilter"
      :ref="table"
      :data="numberedTeachers"
      :columns="columns"
      v-model:sorting="sorting"
      :get-dropdown-actions="getDropdownActions"
    />
    <!-- <UTable
      :loading="teachersStore.loading"
      :key="tableKey"
      v-model:global-filter="globalFilter"
      ref="table"
      :data="numberedTeachers"
      :columns="columns"
    >
      <template #action-cell="{ row }">
        <div class="flex gap-2 items-center">
          <UDropdownMenu :items="getDropdownActions(row.original)">
            <UButton
              icon="i-lucide-ellipsis-vertical"
              color="neutral"
              variant="soft"
              aria-label="Actions"
              class="p-2"
            />
          </UDropdownMenu>
        </div>
      </template>
    </UTable> -->
  </div>
</template>
