<script setup lang="ts">
import type { TableColumn, DropdownMenuItem } from "@nuxt/ui";
import type { Student } from "~/types";
import type { BehavioralIssue } from "~/types";
import { useStudentStore } from "@/stores/students";

const studentsStore = useStudentStore();

const route = useRoute();
const UBadge = resolveComponent("UBadge");
const globalFilter = ref<string>(
  typeof route.query.level === "string" ? route.query.level : ""
);
const tableKey = ref(Math.random());

const selectedStudent = ref();
typeof route.query.level === "string" ? route.query.level : "";
const showModal = ref(false);
function showIssuesModal(student: Student) {
  selectedStudent.value = student;
  showModal.value = true;
}

const columns: TableColumn<Student>[] = [
  {
    accessorKey: "rowNumber",
    header: "الرقم",
  },
  // {
  //   accessorKey: "identity_number",
  //   header: "هوية الطالب",
  // },
  // {
  //   accessorKey: "father_identity_number",
  //   header: "هوية الأب",
  // },
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
    accessorKey: "class_group",
    header: "الشعبة",
  },
  {
    accessorKey: "students_behavioral_issues",
    header: "المخالفات السلوكية",
    cell: ({ row }) => {
      const issues = row.original.students_behavioral_issues || [];
      return h(
        UBadge,
        {
          class: `capitalize hover:cursor-pointer hover:outline ${
            issues.length > 0 ? "font-bold" : "font-normal"
          } `,
          variant: `${issues.length > 0 ? "subtle" : "soft"}`,
          color: `${issues.length > 0 ? "error" : "success"}`,
          onClick: () => showIssuesModal(row.original),
        },
        () => `${issues.length} مخالفة`
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
  // {
  //   accessorKey: "academic_level",
  //   header: "المستوى الأكاديمي العام",
  //   cell: ({ row }) => {
  //     const academic_level = row.original.academic_level;

  //     return h(
  //       UBadge,
  //       {
  //         class: "capitalize",
  //         variant: "soft",
  //         color: `${
  //           academic_level === "ممتاز"
  //             ? "success"
  //             : academic_level === "جيد جدا"
  //             ? "warning"
  //             : "error"
  //         }`,
  //       },
  //       () => academic_level
  //     );
  //   },
  // },
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
        label: "إضافة مخالفة سلوكية",
        color: "warning",
        icon: "i-heroicons-exclamation-triangle",
        onSelect: () => {
          navigateTo(`/students/${student.id}/add_behavioral_issue`);
        },
      },
      {
        label: "إضافة كشف درجات",
        icon: "i-heroicons-academic-cap",
        color: "info",
        onSelect: () => {
          navigateTo(`/students/${student.id}/add_grades_report`);
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
          studentsStore.deleteStudent(
            typeof student.id === "string" ? student.id : ""
          );
          tableKey.value = Math.random();
        },
      },
    ],
  ];
}

const numberedStudents = computed(() =>
  studentsStore.sortedStudents.map((student, index) => {
    // console.log(student?.behavioral_issues?.count);
    return {
      ...student,
      // behavioral_issues_count: student?.behavioral_issues[0].count,
      // behavioral_issues_count: student?.behavioral_issues?.count || 0,
      rowNumber: index + 1,
    };
  })
);
const dayNameArabic = (date: string) =>
  new Date(date).toLocaleDateString("ar-EG", { weekday: "long" });
</script>

<template>
  <div>
    <UModal v-model:open="showModal" title="تفاصيل المخالفات">
      <template #body>
        <div v-if="selectedStudent?.students_behavioral_issues?.length">
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
              ) in selectedStudent.students_behavioral_issues"
              :key="index"
              class="grid grid-cols-3 justify-between items-center gap-2 border-b border-dashed border-gray-200 py-2 mb-2"
            >
              <span>
                {{ dayNameArabic(issue.date + "") }}
              </span>
              <span> {{ issue.date }} </span>
              <span> {{ issue.description }} </span>
            </li>
          </ul>
          <div class="pt-3">
            <span> المجموع: </span>
            <span class="font-bold">
              {{ selectedStudent.students_behavioral_issues.length }}
            </span>
          </div>
        </div>

        <p v-else>لا توجد مخالفات.</p>
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
      :loading="studentsStore.loading"
      :key="studentsStore.tableKey"
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
