<script setup lang="ts">
import type { TableColumn, DropdownMenuItem } from "@nuxt/ui";
import type { Teacher, TeacherUpsentReport } from "~/types";
import { useTeacherStore } from "@/stores/teachers";

const {
  teachersData,
  teachersUpsentReportsData,
  deleteTeacher,
  toggleTeacherUpsentReport,
  getSpesificTeacher,
} = useTeacherStore();

const globalFilter = ref("");
const isLoading = ref(false);
const tableKey = ref(Math.random());
const UBadge = resolveComponent("UBadge");

// onMounted(() => {
// tableKey.value = Math.random();
// });

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
    header: "الاسم رباعي",
  },
  {
    accessorKey: "phone_number",
    header: "رقم الجوال",
  },
  {
    accessorKey: "birth_date",
    header: "تاريخ الميلاد",
  },
  {
    accessorKey: "courses",
    header: "المواد التي يتم تدريسها",
  },
  {
    accessorKey: "behavioral_issues_count",
    header: "المخالفات",
    cell: ({ row }) => {
      const behavioral_issues_count = row.original.behavioral_issues_count ?? 0;

      return h(
        UBadge,
        {
          class: `capitalize ${
            behavioral_issues_count > 0 ? "font-bold" : "font-normal"
          } `,
          variant: `${behavioral_issues_count > 0 ? "subtle" : "soft"}`,
          color: `${behavioral_issues_count > 0 ? "error" : "success"}`,
        },
        () => behavioral_issues_count
      );
    },
  },
  {
    accessorKey: "upsent_reports_count",
    header: "عدد أيام الغياب",
    cell: ({ row }) => {
      const days_count = row.original.upsent_reports_count ?? 0;

      return h(
        UBadge,
        {
          class: `capitalize ${days_count ? "font-bold" : "font-normal"}`,
          variant: `${days_count === 0 ? "soft" : "subtle"}`,

          color: `${
            days_count === 1 || days_count === 2
              ? "warning"
              : days_count >= 3
              ? "error"
              : "success"
          }`,
        },
        () => days_count
      );
    },
  },
  {
    accessorKey: "loans_count",
    header: "عدد السلف",
    cell: ({ row }) => {
      const loansCount = row.original.loans_count ?? 0;
      return h(
        UBadge,
        {
          class: `capitalize ${loansCount ? "font-bold" : "font-normal"}`,
          variant: `${loansCount ? "subtle" : "soft"}`,
          color: `${loansCount ? "error" : "success"}`,
        },
        () => loansCount
      );
    },
  },
  {
    accessorKey: "loans_amount",
    header: "مجموع السلف",
    cell: ({ row }) => {
      const loansAmount = row.original.loans_amount ?? 0;
      return h(
        UBadge,
        {
          class: `capitalize ${loansAmount ? "font-bold" : "font-normal"}`,
          variant: `${loansAmount ? "subtle" : "soft"}`,
          color: `${loansAmount ? "error" : "success"}`,
        },
        () => loansAmount
      );
    },
  },
  {
    id: "action",
  },
];

function getDropdownActions(teacher: Teacher): DropdownMenuItem[][] {
  return [
    [
      {
        label: "إضافة مخالفة إدارية",
        icon: "i-lucide-copy",
        onSelect: () => {
          navigateTo(`/teachers/${teacher.id}/add_behavioral_issue`);
        },
      },
      {
        label: "إضافة سلفة",
        icon: "i-lucide-copy",
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
          deleteTeacher(teacher.id);
          tableKey.value = Math.random();
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
// teachersData.map((teacher, index) => {
//   console.log(hasBehavioralIssuesReports(teacher.id));
//   console.log(teacher);
// });

const numberedTeachers = computed(() => {
  return teachersData.map((teacher, index) => ({
    ...teacher,
    rowNumber: index + 1,
  }));
});

const updateAbsenceStatus = (teacher_id: number) => {
  const targetedTeacher = getSpesificTeacher(teacher_id);

  const report = {
    id: Math.random(),
    teacher_id: teacher_id,
    teacher_name: targetedTeacher?.full_name,
    date: new Date().toISOString().split("T")[0],
  };

  toggleTeacherUpsentReport(teacher_id, report);

  setTimeout(() => {
    navigateTo("/teachers/view/ubsent");
  }, 100);
};

const IsTeacherHasAbsenceReport = (teacher_id: number) => {
  const reportIndex = teachersUpsentReportsData.findIndex(
    (report) => report.teacher_id?.toString() === teacher_id.toString()
  );

  if (reportIndex === -1) return false;
  return true;
};

const buttonAbsenceVariant = computed(
  () => (teacherId: number) =>
    IsTeacherHasAbsenceReport(teacherId) ? "solid" : "outline"
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

    <UTable
      :loading="isLoading"
      :key="tableKey"
      v-model:global-filter="globalFilter"
      ref="table"
      :data="numberedTeachers"
      :columns="columns"
    >
      <template #action-cell="{ row }">
        <div class="flex gap-2 items-center">
          <UButton
            color="error"
            icon="i-lucide-user-minus"
            :variant="buttonAbsenceVariant(row.original.id ?? 0)"
            label="غياب"
            size="xs"
            class="rounded-md hover:cursor-pointer text-xs"
            @click="updateAbsenceStatus(row.original.id ?? 0)"
          />

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
    </UTable>
  </div>
</template>
