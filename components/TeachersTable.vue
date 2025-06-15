<script setup lang="ts">
import type { TableColumn, DropdownMenuItem } from "@nuxt/ui";
import type { Teacher, TeacherUpsentReport } from "~/types";
import {
  behavioralIssuesTeacher,
  teachers,
  teachersUpsentReports,
} from "~/constants";

const globalFilter = ref("");
const teachersData = ref<Teacher[]>(teachers);
const isLoading = ref(false);
const tableKey = ref(Math.random());
const UBadge = resolveComponent("UBadge");
const isClicked = ref(false);

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
  // {
  //   accessorKey: "has_behavioral_issue",
  //   header: "المخالفات",
  // },
  {
    accessorKey: "has_behavioral_issue",
    header: "المخالفات",
    cell: ({ row }) => {
      const status = row.original.has_behavioral_issues ?? "لا يوجد";

      return h(
        UBadge,
        {
          class: `capitalize ${
            status === "يوجد" ? "font-bold" : "font-normal"
          } `,
          variant: `${status === "يوجد" ? "subtle" : "soft"}`,
          color: `${status === "يوجد" ? "error" : "neutral"}`,
        },
        () => status
      );
    },
  },
  {
    accessorKey: "ubsent_days_count",
    header: "عدد أيام الغياب",
    cell: ({ row }) => {
      const days_count = row.original.ubsent_days_count ?? 0;

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
              : "neutral"
          }`,
        },
        () => days_count
      );
    },
  },
  {
    accessorKey: "loans",
    header: "قيمة السلف",
    cell: ({ row }) => {
      const loans = row.original.loans ?? 0;
      return h(
        UBadge,
        {
          class: `capitalize ${loans ? "font-bold" : "font-normal"}`,
          variant: `${loans ? "subtle" : "soft"}`,
          color: `${loans ? "error" : "neutral"}`,
        },
        () => loans
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

const has_behavioral_issue = (id: number) => {
  return !!behavioralIssuesTeacher.find((issue) => id === issue.teacher_id)
    ? "يوجد"
    : "لا يوجد";
};

const numberedTeachers = computed(() =>
  teachersData.value.map((teacher, index) => ({
    ...teacher,
    has_behavioral_issue: has_behavioral_issue(teacher.id),
    rowNumber: index + 1,
  }))
);

const deleteTeacher = (id: any) => {
  const teacherIndex = teachersData.value.findIndex(
    (student) => student.id === id
  );

  teachersData.value.splice(teacherIndex, 1);
  tableKey.value = Math.random();
};

const deleteReport = (teacher_id: any) => {
  const reportIndex = teachersUpsentReports.findIndex(
    (report) => report.teacher_id === teacher_id
  );

  if (reportIndex === -1) return;

  teachersUpsentReports.splice(reportIndex, 1);
  tableKey.value = Math.random();
};

const teacherReportIsExsist = (teacher_id: number) => {
  const reportIndex = teachersUpsentReports.findIndex(
    (report: TeacherUpsentReport) => report.teacher_id === teacher_id
  );
  if (reportIndex === -1) return false;
  return true;
};

const updateUpsentStatus = (teacher_id: number, teacher_name: string) => {
  teacherReportIsExsist(teacher_id)
    ? deleteReport(teacher_id)
    : teachersUpsentReports.unshift({
        id: Math.random(),
        teacher_id: teacher_id,
        teacher_name: teacher_name,
        date: new Date().toISOString().split("T")[0],
      });
  setTimeout(() => {
    navigateTo("/teachers/view/ubsent");
  }, 100);
};

const IsTeacherAssignUbsentReport = (teacher_id: number) => {
  const reportIndex = teachersUpsentReports.findIndex(
    (report) => report.teacher_id === teacher_id
  );

  if (reportIndex === -1) return false;
  return true;
};

const badgeUbsentVariant = computed(
  () => (teacherId: number) =>
    IsTeacherAssignUbsentReport(teacherId) ? "solid" : "outline"
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
          <UBadge
            color="error"
            :variant="badgeUbsentVariant(row.original.id)"
            label="غياب"
            class="rounded-lg hover:cursor-pointer hover:bg-error-300"
            @click="updateUpsentStatus(row.original.id, row.original.full_name)"
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
