<script setup lang="ts">
import type { TableColumn, DropdownMenuItem } from "@nuxt/ui";
import type { Student } from "~/types";
import { months } from "~/constants";
import { useStudentStore } from "@/stores/students";

const { studentsData, deleteStudent } = useStudentStore();

const { toastSuccess, toastError } = useAppToast();

const route = useRoute();
const UBadge = resolveComponent("UBadge");
const globalFilter = ref(route.query.level ?? "");
const isLoading = ref(false);
const tableKey = ref(Math.random());

// watch(
//   route,
//   () => {
//     globalFilter.value = route.query.level;
//     console.log(route.query.level);
//   },
//   { immediate: true }
// );

const columns: TableColumn<Student>[] = [
  {
    accessorKey: "rowNumber",
    header: "الرقم",
  },
  {
    accessorKey: "identity_number",
    header: "هوية الطالب",
  },
  {
    accessorKey: "father_identity_number",
    header: "هوية الأب",
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
    accessorKey: "address",
    header: "العنوان",
  },
  {
    accessorKey: "masjed",
    header: "المسجد",
  },
  {
    accessorKey: "level",
    header: "الصف الدراسي",
  },
  {
    accessorKey: "section",
    header: "الشعبة",
  },
  {
    accessorKey: "behavioral_issues_count",
    header: "عدد المخالفات السلوكية",
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
  // {
  //   accessorKey: "memorized_juz",
  //   header: "الأجزاء المحفوظة",
  // },
  // {
  //   accessorKey: "daily_recitation",
  //   header: "التسميع اليومي",
  // },
  {
    accessorKey: "academic_level",
    header: "المستوى الأكاديمي العام",
    cell: ({ row }) => {
      const academic_level = row.original.academic_level;

      return h(
        UBadge,
        {
          class: "capitalize",
          variant: "soft",
          color: `${
            academic_level === "ممتاز"
              ? "success"
              : academic_level === "جيد جدا"
              ? "warning"
              : "error"
          }`,
        },
        () => academic_level
      );
    },
  },
  // {
  //   accessorKey: "behavioral_issues",
  //   header: "مخالفات سلوكية",
  // },
  // {
  //   accessorKey: "memorization_status",
  //   header: "حالة الحفظ",
  // },
  // {
  //   accessorKey: "payments_status",
  //   header: "حالة الدفع",
  //   cell: ({ row }) => {
  //     const month = selectedMonth.value;
  //     const status = row.original.payments_status?.[month] ?? "غير مدفوعة";

  //     const color = {
  //       مدفوعة: "success" as const,
  //       "غير مدفوعة": "error" as const,
  //     }[status];

  //     return h(
  //       UBadge,
  //       { class: "capitalize", variant: "subtle", color },
  //       () => status
  //     );
  //   },
  // },
  {
    id: "action",
  },
];

function getDropdownActions(student: Student): DropdownMenuItem[][] {
  return [
    [
      {
        label: "إضافة كشف درجات",
        icon: "i-lucide-copy",
        onSelect: () => {
          navigateTo(`/students/${student.id}/add_grades_report`);
        },
      },
      {
        label: "إضافة مخالفة سلوكية",
        icon: "i-lucide-copy",
        onSelect: () => {
          navigateTo(`/students/${student.id}/add_behavioral_issue`);
        },
      },
    ],
    [
      {
        label: "Edit",
        icon: "i-lucide-edit",
        onSelect: () => {
          navigateTo(`/students/${student.id}/edit_student`);
        },
      },
      {
        label: "Delete",
        icon: "i-lucide-trash",
        color: "error",
        onSelect: () => {
          deleteStudent(student.id || 1);
          tableKey.value = Math.random();
        },
      },
    ],
  ];
}

// const paymentStatusFilterItems = ["جميع الحالات", "مدفوعة", "غير مدفوعة"];

const fetchStudents = async () => {
  try {
    isLoading.value = true;
    const { data } = await $fetch("/api/fetch-students", {
      method: "GET",
    });
    console.log(data);
    // toast.add({
    //   title: "تم تحميل البيانات بنجاح",
    //   color: "success",
    //   icon: "i-lucide-circle-check",
    // });
    return data as Student[];
    // return data;
  } catch (error) {
    console.error("Error fetching students:", error);
    toastError({
      title: "فشل في تحميل البيانات",
    });

    return [];
  } finally {
    isLoading.value = false;
  }
};

// Fetch students data when the component is mounted
// students.value = await fetchStudents();

const currentMonthIndex = new Date().getMonth();
const selectedMonth = ref(months[currentMonthIndex]);

const numberedStudents = computed(() =>
  // filteredStudents.value.map((student, index) => ({
  //   ...student,
  //   rowNumber: index + 1,
  // }))
  studentsData.map((student, index) => ({
    ...student,
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
      <!-- <USelect
        v-model="selectedMonth"
        :items="months"
        size="lg"
        color="secondary"
        class="w-full"
      /> -->

      <!-- <USelect
        v-model="selectedPaymentStatus"
        :items="paymentStatusFilterItems"
        color="secondary"
        size="lg"
        class="w-full"
      /> -->
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
        <span>({{ numberedStudents.length }})</span>
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
        <span>({{ numberedStudents.length }})</span>
        <span> Excel </span>
      </UButton>
    </div>
    <!-- end Export -->

    <UTable
      :loading="isLoading"
      :key="tableKey"
      v-model:global-filter="globalFilter"
      ref="table"
      :data="numberedStudents"
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
