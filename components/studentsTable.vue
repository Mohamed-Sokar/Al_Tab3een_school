<script setup lang="ts">
import type { TableColumn, DropdownMenuItem } from "@nuxt/ui";
import { type Student } from "~/types";
import { months, students } from "~/constants";
// import { getPaginationRowModel } from "@tanstack/vue-table";

const toast = useToast();
// const supabase = useSupabaseClient();
const globalFilter = ref("");
const UBadge = resolveComponent("UBadge");
const table = useTemplateRef("table");
const studentsData = ref<Student[]>(students);
const isLoading = ref(false);
const tableKey = ref(Math.random());

const columns: TableColumn<Student>[] = [
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
    accessorKey: "level",
    header: "الصف الدراسي",
  },
  {
    accessorKey: "section",
    header: "الشعبة",
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
      // {
      //   label: "Copy user Id",
      //   icon: "i-lucide-copy",
      //   onSelect: () => {
      //     navigator.clipboard.writeText(student.id.toString());
      //     toast.add({
      //       title: "User ID copied to clipboard!",
      //       color: "success",
      //       icon: "i-lucide-circle-check",
      //     });
      //   },
      // },
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
          console.log("add behavioral issue");
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
          deleteStudent(student.id);
        },
      },
    ],
  ];
}

const paymentStatusFilterItems = ["جميع الحالات", "مدفوعة", "غير مدفوعة"];

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
    toast.add({
      title: "فشل في تحميل البيانات",
      color: "error",
      icon: "i-lucide-circle-x",
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
const selectedPaymentStatus = ref(paymentStatusFilterItems[0]);

const filteredStudents = computed(() => {
  return students.value.filter((student) => {
    const month = selectedMonth.value;
    const paymentStatus = selectedPaymentStatus.value;

    const statusForMonth =
      typeof student.payments_status === "object"
        ? student.payments_status?.[month]
        : student.payments_status;

    if (paymentStatus === "جميع الحالات") return true;

    return statusForMonth === paymentStatus;
  });
});

const numberedStudents = computed(() =>
  // filteredStudents.value.map((student, index) => ({
  //   ...student,
  //   rowNumber: index + 1,
  // }))
  studentsData.value.map((student, index) => ({
    ...student,
    rowNumber: index + 1,
  }))
);

const deleteStudent = (id: any) => {
  const studentIndex = studentsData.value.findIndex(
    (student) => student.id === id
  );

  studentsData.value.splice(studentIndex, 1);
  tableKey.value = Math.random();
};

// watch(selectedMonth, async () => {
//   students.value = await fetchStudents();
// });
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
