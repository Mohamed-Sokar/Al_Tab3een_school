<script setup lang="ts">
import type { TableColumn, DropdownMenuItem } from "@nuxt/ui";
import { type GradesReport, type Student } from "~/types";
import { months, gradesReports, grades_level_options } from "~/constants";

const { toastSuccess, toastError } = useAppToast();
const globalFilter = ref("");
const gradesReportsData = ref<GradesReport[]>(gradesReports);
const isLoading = ref(false);
const tableKey = ref(Math.random());

const new_grades_level_options = ["الكل", ...grades_level_options];

const columns: TableColumn<GradesReport>[] = [
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
    accessorKey: "arabic",
    header: "لغة عربية",
  },
  {
    accessorKey: "english",
    header: "لغة إنجليزية",
  },
  {
    accessorKey: "relegion",
    header: "التربية الإسلامية",
  },
  {
    accessorKey: "math",
    header: "الرياضيات",
  },
  {
    accessorKey: "science",
    header: "العلوم",
  },
  {
    accessorKey: "quran",
    header: "القرآن",
  },
  {
    accessorKey: "type",
    header: "نوع الكشف",
  },
  {
    accessorKey: "average",
    header: "المعدل",
  },

  {
    id: "action",
  },
];

function getDropdownActions(report: GradesReport): DropdownMenuItem[][] {
  return [
    [
      {
        label: "Edit",
        icon: "i-lucide-edit",
        onSelect: () => {
          navigateTo(`/students/${report.id}/edit_grades_report`);
        },
      },
      {
        label: "Delete",
        icon: "i-lucide-trash",
        color: "error",
        onSelect: () => {
          deleteReport(report.id);
        },
      },
    ],
  ];
}

// const fetchStudents = async () => {
//   try {
//     isLoading.value = true;
//     const { data } = await $fetch("/api/fetch-students", {
//       method: "GET",
//     });
//     console.log(data);
//     // toast.add({
//     //   title: "تم تحميل البيانات بنجاح",
//     //   color: "success",
//     //   icon: "i-lucide-circle-check",
//     // });
//     return data as Student[];
//     // return data;
//   } catch (error) {
//     console.error("Error fetching students:", error);
//     toast.add({
//       title: "فشل في تحميل البيانات",
//       color: "error",
//       icon: "i-lucide-circle-x",
//     });
//     return [];
//   } finally {
//     isLoading.value = false;
//   }
// };

// Fetch students data when the component is mounted
// students.value = await fetchStudents();

const selectedType = ref(new_grades_level_options[0]);

const numberedReports = computed(() => {
  const filteredReports = gradesReportsData.value.filter((report) => {
    if (selectedType.value === "الكل") return true;
    return report.type === selectedType.value;
  });

  tableKey.value = Math.random();
  return filteredReports.map((report, index) => ({
    ...report,
    rowNumber: index + 1,
  }));
  // gradesReportsData.value.map((report, index) => ({
  //   ...report,
  //   rowNumber: index + 1,
  // }))
});

const deleteReport = (id: any) => {
  const reportIndex = gradesReportsData.value.findIndex(
    (report) => report.id === id
  );

  gradesReportsData.value.splice(reportIndex, 1);
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
        v-model="selectedType"
        :items="new_grades_level_options"
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
        <span>({{ gradesReports.length }})</span>
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
        <span>({{ gradesReports.length }})</span>
        <span> Excel </span>
      </UButton>
    </div>
    <!-- end Export -->

    <UTable
      :loading="isLoading"
      :key="tableKey"
      v-model:global-filter="globalFilter"
      ref="table"
      :data="numberedReports"
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
