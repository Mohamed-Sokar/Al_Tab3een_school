<script setup lang="ts">
import type { TableColumn, DropdownMenuItem } from "@nuxt/ui";
import type { Student, StudentFilters, StudentModalFlag } from "~/types";
import { useStudentStore } from "@/stores/students";
import { useAcademicClassesStore } from "@/stores/academic_classes";
import { useQuranClassesStore } from "@/stores/quran_classes";
import { usePlansStore } from "@/stores/plans";
import { months } from "~/constants";

// init
const studentsStore = useStudentStore();
const quranClassesStore = useQuranClassesStore();
const academicClassesStore = useAcademicClassesStore();
const plansStore = usePlansStore();
const { exportToExcel } = useExportToExcel();
const UButton = resolveComponent("UButton");
const UBadge = resolveComponent("UBadge");
const sorting = ref([
  {
    id: "id",
    desc: false,
  },
]);

// Data
const table = ref();
const tableKey = ref(Math.random());
const columns: TableColumn<Student>[] = [
  {
    accessorKey: "rowNumber",
    header: "الرقم",
  },
  {
    accessorKey: "الاسم الرباعي",
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
        class: "-mx-2.5",
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
      });
    },
    cell: ({ row }) => {
      const student = row.original;
      return student.first_name &&
        student.second_name &&
        student.third_name &&
        student.last_name
        ? student.first_name +
            " " +
            student.second_name +
            " " +
            student.last_name
        : student.full_name;
    },
  },
  {
    accessorKey: "level",
    header: "المستوى",
    cell: ({ row }) => row.original?.level?.title ?? "",
  },
  {
    accessorKey: "academic_class",
    header: "الصف الدراسي",
    cell: ({ row }) => {
      const academicClass = row.original.academic_class;
      let academicClassName = "";
      if (
        academicClass &&
        typeof academicClass.title === "string" &&
        typeof academicClass.group === "string"
      ) {
        academicClassName = `${academicClass.title} - ${academicClass.group}`;
      } else {
        academicClassName = "غير مضاف";
      }

      return h(
        UBadge,
        {
          class: `capitalize hover:cursor-pointer hover:outline`,
          variant: `${academicClass ? "subtle" : "outline"}`,
          color: `neutral`,
          onClick: (e: MouseEvent) => {
            e.stopPropagation();
            showBasedModal("academic_class", row.original);
          },
        },
        () => academicClassName
      );
    },
  },
  {
    accessorKey: "quran_class",
    header: "الصف القرآني",
    cell: ({ row }) => {
      const quranClass = row.original.quran_class;
      let quranClassName = "";
      if (
        quranClass &&
        typeof quranClass.title === "string" &&
        typeof quranClass.group === "string"
      ) {
        quranClassName = `${quranClass.title} - ${quranClass.group}`;
      } else {
        quranClassName = "غير مضاف";
      }

      return h(
        UBadge,
        {
          class: `capitalize hover:cursor-pointer hover:outline`,
          variant: `${quranClass ? "subtle" : "outline"}`,
          color: `neutral`,
          onClick: (e: MouseEvent) => {
            e.stopPropagation();
            showBasedModal("quran_class", row.original);
          },
        },
        () => quranClassName
      );
    },
  },
  {
    accessorKey: "quran_achievement_reports",
    header: "خطة الحفظ",
    cell: ({ row }) => {
      const currentMonth = months[new Date().getMonth()];
      const student = row.original;

      if (!student.plan_id) {
        return "لم يتم تعيين خطة عامة بعد";
      }

      const currentMonthAchvReport = student.quran_achievement_reports?.find(
        (report) => {
          return report.month_plan?.month?.id === currentMonth.value;
        }
      );
      const currentMonthPlan = student.plan?.months_plans?.find((plan) => {
        return plan.month_id === currentMonth.value;
      });

      if (!currentMonthPlan) {
        return "لم يتم تعيين خطة لهذا الشهر";
      }
      if (!currentMonthAchvReport) {
        return "لم يتم إضافة تقرير إنجاز قرآني لهذا الشهر";
      }

      const requiredPages = currentMonthPlan?.pages;

      const achievedReport = student.quran_achievement_reports?.find(
        (report) => report.month_plan?.month?.id === currentMonth.value
      );

      const status = achievedReport?.status ?? "غير مكتمل";
      // Check if the month plan is existing
      if (requiredPages === 0) {
        return h(
          UBadge,
          { color: "gray", variant: "subtle" },
          () => "لا توجد خطة لهذا الشهر"
        );
      }
      const color = {
        مكتمل: "success",
        "غير مكتمل": "error",
      }[status];

      return h(
        UBadge,
        {
          class: "capitalize hover:cursor-pointer hover:outline",
          variant: "subtle",
          color: color,
          onClick: (e: MouseEvent) => {
            e.stopPropagation();
            showBasedModal("plan", student);
          },
        },
        () => status
      );
    },
  },
  {
    accessorKey: "exam_results",
    header: "نتائج الامتحانات",
    cell: ({ row }) => {
      const exam_results = row.original.exam_results || [];
      return h(
        UBadge,
        {
          class: `capitalize hover:cursor-pointer hover:outline ${
            exam_results.length > 0 ? "font-bold" : "font-normal"
          } `,
          variant: `${exam_results.length > 0 ? "subtle" : "soft"}`,
          color: `neutral`,
          onClick: (e: MouseEvent) => {
            e.stopPropagation();
            showBasedModal("exam_results", row.original);
          },
        },
        () => `${exam_results.length} درجة`
      );
    },
  },
  {
    accessorKey: "behavioral_issues",
    header: "المخالفات السلوكية",
    cell: ({ row }) => {
      const issues = row.original.behavioral_issues || [];
      return h(
        UBadge,
        {
          class: `capitalize hover:cursor-pointer hover:outline ${
            issues.length > 0 ? "font-bold" : "font-normal"
          } `,
          variant: `${issues.length > 0 ? "subtle" : "soft"}`,
          color: `${issues.length > 0 ? "error" : "success"}`,
          onClick: (e: MouseEvent) => {
            e.stopPropagation();
            showBasedModal("studentIssue", row.original);
          },
        },
        () => `${issues.length} مخالفة`
      );
    },
  },
  {
    accessorKey: "الرسوم الشهرية",
    header: "الرسوم الشهرية",
    cell: ({ row }) => {
      const fees = row.original.months_fees || [];
      return h(
        UBadge,
        {
          class: `capitalize hover:cursor-pointer hover:outline ${
            fees.length > 0 ? "font-bold" : "font-normal"
          } `,
          variant: `${fees.length > 0 ? "subtle" : "soft"}`,
          color: `${fees.length > 0 ? "success" : "error"}`,
          onClick: (e: MouseEvent) => {
            e.stopPropagation();
            showBasedModal("fees", row.original);
          },
        },
        () => `${fees.length} دفعة`
      );
    },
  },
  // {
  //   accessorKey: "driver",
  //   header: "السائق",
  //   cell: ({ row }) => {
  //     const driver = row.original.driver;
  //     let driverName = "";
  //     if (
  //       driver &&
  //       typeof driver.name === "string" &&
  //       typeof driver.car_type === "string" &&
  //       typeof driver.car_color === "string"
  //     ) {
  //       driverName = `${driver.name}`;
  //     } else {
  //       driverName = "لا يوجد سائق";
  //     }

  //     return h(
  //       UBadge,
  //       {
  //         class: `capitalize hover:cursor-pointer hover:outline`,
  //         variant: `${driver ? "subtle" : "outline"}`,
  //         color: `neutral`,
  //         onClick: (e: MouseEvent) => {
  //           e.stopPropagation();
  //           showBasedModal("driver_info", row.original);
  //         },
  //       },
  //       () => driverName
  //     );
  //   },
  // },
  {
    id: "action",
  },
];

// State
const filters = reactive<StudentFilters>({
  academicClassFilter: undefined,
  quranClassFilter: undefined,
  planFilter: undefined,
  levelFilter: undefined,
  memorizationStatusFilter: undefined,
  firstNameFilter: undefined,
  secondNameFilter: undefined,
  thirdNameFilter: undefined,
  lastNameFilter: undefined,
  identityNumberFilter: undefined,
});
const pageNum = ref(1); // current page
const pageSize = ref(10); // rows per page
const rowSelection = ref({});
const selectedStudent = ref<Student>();
const showModal = ref(false);
const isLoading = ref(false);
const selectedFlag = ref<StudentModalFlag>();
const selectedClassId = ref<number | undefined>(undefined);
// const selectedDriverId = ref<number | undefined>(undefined);
const selectedPlan = ref<
  { label: string; value: number | undefined } | undefined
>(undefined);
const paginationRef = ref();

// functions
function showBasedModal(flag: StudentModalFlag, student?: Student) {
  selectedFlag.value = flag;
  showModal.value = true;
  if (!!student) {
    selectedStudent.value = student;
  }
}
function getDropdownActions(student: Student): DropdownMenuItem[][] {
  return [
    [
      {
        label: "إضافة مخالفة سلوكية",
        color: "warning",
        icon: "i-heroicons-exclamation-triangle",
        onSelect: () => {
          navigateTo(`/students/${student.id}/add-behavioral-issue`);
        },
      },
      // I moved this functionality to another link in sidebar ("الإنجاز القرآني")
      // {
      //   label: "إضافة تقرير حفظ شهري",
      //   icon: "i-lucide-book-open",
      //   color: "info",
      //   onSelect: () => {
      //     navigateTo({
      //       name: "students-id-add-quran-achievement-report",
      //       params: { id: student.id },
      //       query: {
      //         general_plan_id: student.plan_id,
      //       },
      //     });
      //   },
      // },
    ],
    [
      {
        label: "معاينة",
        icon: "i-lucide-eye",
        onSelect: () => {
          navigateTo(`/students/${student.id}/view`);
        },
      },
      {
        label: "تعديل",
        icon: "i-lucide-edit",
        onSelect: () => {
          navigateTo(`/students/${student.id}/edit`);
        },
      },
      {
        label: "حذف",
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
const deleteSelectedStudents = async () => {
  if (selectedStudentsIds.value.length === 0) return;

  await studentsStore.deleteMultipleStudents(
    selectedStudentsIds.value.filter(
      (id): id is string => typeof id === "string"
    )
  );
  rowSelection.value = {};
};
const assignStudentsToAcademicClass = async () => {
  if (!selectedClassId.value || selectedStudents.value.length === 0) return;

  await academicClassesStore.updateAcademicClassForStudents(
    selectedStudentsIds.value.filter(
      (id): id is string => typeof id === "string"
    ),
    selectedClassId.value
  );

  rowSelection.value = {};
  selectedClassId.value = undefined;
};
const assignStudentsToQuranClass = async () => {
  if (!selectedClassId.value || selectedStudents.value.length === 0) return;

  await quranClassesStore.updateQuranClassForStudents(
    selectedStudentsIds.value.filter(
      (id): id is string => typeof id === "string"
    ),
    selectedClassId.value
  );

  rowSelection.value = {};
  selectedClassId.value = undefined;
};
// const assignStudentsToDriver = async () => {
//   if (!selectedDriverId.value || selectedStudents.value.length === 0) return;

//   await driversStore.updatesDriverForStudents(
//     selectedStudentsIds.value.filter(
//       (id): id is string => typeof id === "string"
//     ),
//     selectedDriverId.value
//   );

//   rowSelection.value = {};
//   selectedDriverId.value = undefined;
// };
const assignStudentsToPlan = async () => {
  if (!selectedPlan.value?.value || selectedStudents.value.length === 0) return;

  await plansStore.assignPlanToStudents(
    selectedStudentsIds.value.filter(
      (id): id is string => typeof id === "string"
    ),
    selectedPlan.value.value
  );

  rowSelection.value = {};
  selectedPlan.value = undefined;
};
const exportStudents = () => {
  exportToExcel({
    data: selectedStudents.value.map((s, i) => ({
      الرقم: i + 1,
      "الاسم الكامل":
        s?.first_name +
        " " +
        s?.last_name +
        " " +
        s.third_name +
        " " +
        s.last_name,
      // "الاسم الأول": s.first_name,
      // "الاسم الثاني": s.second_name,
      // "الاسم الثالث": s.third_name,
      // "الاسم الأخير": s.last_name,
      العنوان: s.address,
      المسجد: s.masjed,
      "اسم ولي الأمر": s.guardian_name,
      "صلة قرابة ولي الأمر": s.guardian_name_kinship,
      الهوية: s.identity_number,
      "هوية الأب": s.father_identity_number,
      الهاتف: s.phone_number,
      "رقم الواتس": s.whatsapp_number,
      "تاريخ الميلاد": s.birth_date,
      "حالة الحفظ": s.memorization_status,
      "عدد الأجزاء المحفوظة": s.memorized_juz,
      "مقدار التسميع اليومي": s.daily_recitation,
      "عدد المخالفات السلوكية": s.behavioral_issues?.length,
    })),
    fileName: "الطلاب",
    sheetName: "الطلاب",
  });
};
const onSubmit = async () => {
  isLoading.value = true;
  if (selectedFlag.value === "move_academic_class") {
    await assignStudentsToAcademicClass();
    await studentsStore.fetchStudents(pageNum.value, pageSize.value, filters);
  } else if (selectedFlag.value === "move_quran_class") {
    await assignStudentsToQuranClass();
    await studentsStore.fetchStudents(pageNum.value, pageSize.value, filters);
    // } else if (selectedFlag.value === "assign_driver") {
    //   await assignStudentsToDriver();
    //   await studentsStore.fetchStudents(pageNum.value, pageSize.value);
  } else if (selectedFlag.value === "assign_plan") {
    await assignStudentsToPlan();
    await studentsStore.fetchStudents(pageNum.value, pageSize.value, filters);
  }
  isLoading.value = false;
  showModal.value = false;
};
const resetFilters = () => {
  Object.assign(filters, {
    academicClassFilter: undefined,
    quranClassFilter: undefined,
    planFilter: undefined,
    levelFilter: undefined,
    memorizationStatusFilter: undefined,
    firstNameFilter: undefined,
    secondNameFilter: undefined,
    thirdNameFilter: undefined,
    lastNameFilter: undefined,
    identityNumberFilter: undefined,
  });
  // Optionally, trigger a fetch to refresh the table with no filters
  // onSubmitFilter();
};
// const driver_id_query = route.query.driver_id;
// const level_query = route.query.level;
// const class_group_query = route.query.class_group;
// const classType_query: ClassType | undefined =
//   typeof route.query.classType === "string" &&
//   (route.query.classType === "quran" || route.query.classType === "academic")
//     ? (route.query.classType as ClassType)
//     : undefined;

// Computed
// selected Students based pagination
const selectedStudents = computed(() => {
  // حساب إزاحة التصفح (offset)
  const offset = (pageNum.value - 1) * pageSize.value;

  // تحويل الفهارس المختارة إلى الطلاب المقابلين في numberedStudents
  return Object.keys(rowSelection.value)
    .map((index) => {
      // تعديل الفهرس ليعكس الموضع في القائمة الكلية
      const globalIndex = offset + Number(index);
      return numberedStudents.value[globalIndex];
    })
    .filter((student) => student !== undefined); // تصفية أي قيم غير موجودة
});
// const filteredStudents = computed(() => {
//   if (driver_id_query) {
//     return studentsStore.sortedStudents.filter(
//       (student) =>
//         driver_id_query !== null &&
//         driver_id_query !== undefined &&
//         student.driver_id === +driver_id_query
//     );
//   } else if (level_query && class_group_query) {
//     if (classType_query === "academic") {
//       return studentsStore.sortedStudents.filter(
//         (student) =>
//           student.academic_class?.title === level_query &&
//           String(student.academic_class?.group) === String(class_group_query)
//       );
//     } else if (classType_query === "quran") {
//       return studentsStore.sortedStudents.filter(
//         (student) =>
//           student.quran_class?.title === level_query &&
//           String(student.quran_class?.group) === String(class_group_query)
//       );
//     }
//   } else if (level_query) {
//     return studentsStore.sortedStudents.filter(
//       (student) => student.academic_class?.title === level_query
//     );
//   } else {
//     return studentsStore.sortedStudents;
//   }
// });
const numberedStudents = computed(() =>
  studentsStore.studentsData.map((student, index) => {
    return {
      ...student,
      rowNumber: index + 1,
    };
  })
);
const selectedStudentsIds = computed(() =>
  selectedStudents.value.map((student) => student?.id)
);
const totalPages = computed(() => {
  return Math.ceil(
    studentsStore.studentsCountData > 0
      ? Math.ceil(studentsStore.studentsCountData / pageSize.value)
      : 1
  );
});

// pagination rows
const rows = computed(() => {
  const start = (pageNum.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return numberedStudents.value.slice(start, end);
});

// Actions
const updateRows = async () => {
  await studentsStore.fetchStudents(pageNum.value, pageSize.value, filters);
};
const onSubmitFilter = async () => {
  pageNum.value = 1;
  await studentsStore.fetchStudents(
    pageNum.value,
    pageSize.value,
    filters,
    true
  );
  paginationRef.value?.resetPage();
};

// Watches
watch(pageSize, () => {
  pageNum.value = 1;
});
// reset rowSelection when pageNum is changed
watch(pageNum, async () => {
  updateRows();
  rowSelection.value = {};
});

const route = useRoute();
const level_id_query = route.query.level_id;
const academic_class_id_query = route.query.academic_class_id;
const quran_class_id_query = route.query.quran_class_id;

watch(
  route,
  () => {
    resetFilters();
    if (level_id_query) filters.levelFilter = Number(level_id_query);
    if (academic_class_id_query)
      filters.academicClassFilter = Number(academic_class_id_query);
    if (quran_class_id_query)
      filters.quranClassFilter = Number(quran_class_id_query);
    onSubmitFilter();
  },
  { immediate: true }
);
</script>
<template>
  <div>
    <!-- student Modal -->
    <StudentsModal
      v-model:show-modal="showModal"
      :selected-flag="selectedFlag"
      :selected-student="selectedStudent"
      :selected-class-id="selectedClassId"
      :selected-plan="selectedPlan"
      :academic-classes="academicClassesStore.classesData"
      :quran-classes="quranClassesStore.classesData"
      :plans="plansStore.plansData"
      :loading="isLoading"
      @update:show-modal="showModal = $event"
      @update:selected-class-id="selectedClassId = $event"
      @update:selected-plan="selectedPlan = $event"
      @submit="onSubmit"
    />
    <!-- Student filters -->
    <StudentsFilters
      :filters="filters"
      @submit="onSubmitFilter"
      @reset="resetFilters"
    />
    <BasePagination
      ref="paginationRef"
      :total-pages="totalPages"
      @update:page-num="pageNum = $event"
      @update:page-size="pageSize = $event"
    >
      <!-- Students table -->
      <BaseTable
        v-model:row-selection="rowSelection"
        v-model:sorting="sorting"
        :loading="studentsStore.loading"
        :key="studentsStore.tableKey"
        :ref="table"
        :data="rows"
        :columns="columns"
        :get-dropdown-actions="getDropdownActions"
      >
        <template #actions>
          <div
            v-if="selectedStudents.length"
            class="flex flex-wrap justify-end gap-2 items-center"
          >
            <!-- delete button -->
            <UButton
              icon="heroicons-trash"
              variant="outline"
              color="error"
              size="xs"
              class="p-2 font-bold h-full"
              :loading="studentsStore.loading"
              @click="deleteSelectedStudents"
            >
              <span>حذف</span>
              <span>({{ selectedStudents.length }})</span>
            </UButton>

            <!-- move to quran class button -->
            <UButton
              icon="i-heroicons-arrow-right-on-rectangle"
              variant="outline"
              color="info"
              size="xs"
              class="p-2 font-bold h-full"
              @click="showBasedModal('move_quran_class')"
            >
              <span>نقل</span>
              <span>لصف</span>
              <span>قرآن</span>
              <span>({{ selectedStudents.length }})</span>
            </UButton>

            <!-- move to academic class button -->
            <UButton
              icon="i-heroicons-arrow-right-on-rectangle"
              variant="outline"
              color="info"
              size="xs"
              class="p-2 font-bold h-full"
              @click="showBasedModal('move_academic_class')"
            >
              <span>نقل</span>
              <span>لصف</span>
              <span>دراسي</span>
              <span>({{ selectedStudents.length }})</span>
            </UButton>
            <!-- assign driver to students button -->
            <!-- <UButton
            icon="lucide-car-taxi-front"
            variant="outline"
            color="warning"
            size="xs"
            class="p-2 font-bold h-full"
            @click="showBasedModal('assign_driver')"
          >
            <span>تعيين</span>
            <span>سائق</span>
            <span>({{ selectedStudents.length }})</span>
          </UButton> -->
            <!-- assign plan to students button -->
            <UButton
              icon="lucide-car-taxi-front"
              variant="outline"
              color="warning"
              size="xs"
              class="p-2 font-bold h-full"
              @click="showBasedModal('assign_plan')"
            >
              <span>تعيين</span>
              <span>خطة</span>
              <span>({{ selectedStudents.length }})</span>
            </UButton>
            <!-- Excel export button -->
            <UButton
              icon="heroicons-document-chart-bar-solid"
              variant="outline"
              color="primary"
              size="xs"
              class="p-2 font-bold text-green-700 h-full"
              @click="exportStudents"
            >
              <!-- <span>تصدير</span> -->
              <span>({{ selectedStudents.length }})</span>
              <span> Excel </span>
            </UButton>
            <!-- PDF export button -->
            <!-- <UButton
            icon="heroicons-document-chart-bar-solid"
            variant="outline"
            color="secondary"
            size="sm"
            class="p-2 font-bold text-blue-700 h-full"
          >
            <span>({{ selectedStudents.length }})</span>
            <span> PDF </span>
          </UButton> -->
          </div>
        </template>
      </BaseTable>
    </BasePagination>
  </div>
</template>
