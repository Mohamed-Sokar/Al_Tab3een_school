<script setup lang="ts">
import type { Column } from "@tanstack/vue-table";
import type { TableColumn, DropdownMenuItem } from "@nuxt/ui";
import type { Student } from "~/types";
import { useStudentStore } from "@/stores/students";
import { useAcademicClassesStore } from "@/stores/academic_classes";
import { useQuranClassesStore } from "@/stores/quran_classes";
import { useDriversStore } from "@/stores/drivers";
import { usePlansStore } from "@/stores/plans";
import { object, number } from "yup";
import type { InferType } from "yup";
import { months } from "~/constants";

const schema = object({
  selectedClassId: number().required("الصف مطلوب"),
});
const assignDriverSchema = object({
  selectedDriverId: number().required("السائق مطلوب"),
});
const assignPlanSchema = object({
  selectedPlanId: number().required("الخطة مطلوبة"),
});
type Schema = InferType<typeof schema>;

// init
const studentsStore = useStudentStore();
const quranClassesStore = useQuranClassesStore();
const academicClassesStore = useAcademicClassesStore();
const driversStore = useDriversStore();
const plansStore = usePlansStore();

const route = useRoute();
const UButton = resolveComponent("UButton");
// const UDropdownMenu = resolveComponent("UDropdownMenu");
const UBadge = resolveComponent("UBadge");
const sorting = ref([
  {
    id: "id",
    desc: false,
  },
]);

type Flag =
  | "academic_class"
  | "quran_class"
  | "studentIssue"
  | "move_quran_class"
  | "move_academic_class"
  | "driver_info"
  | "plan"
  | "assign_plan"
  | "assign_driver";

// data
const globalFilter = ref<string>();
const table = ref();
const tableKey = ref(Math.random());
const rowSelection = ref({});
const selectedStudent = ref<Student>();
const showModal = ref(false);
const selectedFlag = ref<Flag>();
const selectedClassId = ref<number | undefined>(undefined);
const selectedDriverId = ref<number | undefined>(undefined);
const selectedPlan = ref<
  { label: string; value: number | undefined } | undefined
>(undefined);
const columns: TableColumn<Student>[] = [
  // {
  //   accessorKey: "الرقم",
  //   header: "الرقم",
  // },
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
  // {
  //   accessorKey: "phone_number",
  //   header: "رقم الجوال",
  // },
  // {
  //   accessorKey: "birth_date",
  //   // header: "تاريخ الميلاد",
  //   header: ({ column }) => getHeader(column, "تاريخ الميلاد"),
  //   cell: ({ row }) => {
  //     // return new Date(row.getValue("birth_date")).toLocaleString("en-US", {
  //     //   day: "numeric",
  //     //   month: "short",
  //     //   hour: "2-digit",
  //     //   minute: "2-digit",
  //     //   hour12: false,
  //     // });
  //     return row.original.birth_date;
  //   },
  // },
  // {
  //   accessorKey: "address",
  //   header: "العنوان",
  // },
  // {
  //   accessorKey: "masjed",
  //   header: "المسجد",
  // },
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
      const currentMonth = months[new Date().getMonth() + 1]; // because I addes "كل الأشهر" to months array
      const student = row.original;

      const requiredPages =
        student.plan?.months_plans?.find((plan) => plan.month === currentMonth)
          ?.pages ?? 0;

      const achievedReport = student.quran_achievement_reports?.find(
        (report) => report.month === currentMonth
      );
      // const achievedPages = getMonthAchievedPages(currentMonth, student);
      const status = achievedReport?.status ?? "غير مكتمل";
      // نتحقق إذا لم تُحمّل الخطة بعد
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
    accessorKey: "driver",
    header: "السائق",
    cell: ({ row }) => {
      const driver = row.original.driver;
      let driverName = "";
      if (
        driver &&
        typeof driver.name === "string" &&
        typeof driver.car_type === "string" &&
        typeof driver.car_color === "string"
      ) {
        driverName = `${driver.name}`;
      } else {
        driverName = "لا يوجد سائق";
      }

      return h(
        UBadge,
        {
          class: `capitalize hover:cursor-pointer hover:outline`,
          variant: `${driver ? "subtle" : "outline"}`,
          color: `neutral`,
          onClick: (e: MouseEvent) => {
            e.stopPropagation();
            showBasedModal("driver_info", row.original);
          },
        },
        () => driverName
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
    id: "action",
  },
];

// functions
function showBasedModal(flag: Flag, student?: Student) {
  selectedFlag.value = flag;
  showModal.value = true;
  if (!!student) {
    selectedStudent.value = student;
  }
  // console.log(selectedStudent.value);
}
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
      {
        label: "إضافة تقرير حفظ شهري",
        icon: "i-lucide-book-open",
        color: "info",
        onSelect: () => {
          navigateTo({
            name: "students-id-add_quran_achievement_report",
            params: { id: student.id },
            query: {
              general_plan_id: student.plan_id,
            },
          });
          // navigateTo(
          //   `/students/${student.id}/add_quran_achievement_plan?general_plan_id=${student.plan_id}`
          // );
        },
      },
    ],
    [
      {
        label: "معاينة",
        icon: "i-lucide-eye",
        onSelect: () => {
          navigateTo(`/students/${student.id}/view_student`);
        },
      },
      {
        label: "تعديل",
        icon: "i-lucide-edit",
        onSelect: () => {
          navigateTo(`/students/${student.id}/edit_student`);
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
// function getHeader(column: Column<Student>, label: string) {
//   const isSorted = column.getIsSorted();

//   return h(
//     UDropdownMenu,
//     {
//       content: {
//         align: "start",
//       },
//       "aria-label": "Actions dropdown",
//       items: [
//         {
//           label: "Asc",
//           type: "checkbox",
//           icon: "i-lucide-arrow-up-narrow-wide",
//           checked: isSorted === "asc",
//           onSelect: () => {
//             if (isSorted === "asc") {
//               column.clearSorting();
//             } else {
//               column.toggleSorting(false);
//             }
//           },
//         },
//         {
//           label: "Desc",
//           icon: "i-lucide-arrow-down-wide-narrow",
//           type: "checkbox",
//           checked: isSorted === "desc",
//           onSelect: () => {
//             if (isSorted === "desc") {
//               column.clearSorting();
//             } else {
//               column.toggleSorting(true);
//             }
//           },
//         },
//       ],
//     },
//     () =>
//       h(UButton, {
//         color: "neutral",
//         variant: "ghost",
//         label,
//         icon: isSorted
//           ? isSorted === "asc"
//             ? "i-lucide-arrow-up-narrow-wide"
//             : "i-lucide-arrow-down-wide-narrow"
//           : "i-lucide-arrow-up-down",
//         class: "-mx-2.5 data-[state=open]:bg-elevated",
//         "aria-label": `Sort by ${
//           isSorted === "asc" ? "descending" : "ascending"
//         }`,
//       })
//   );
// }
const { getArabicDayName } = useDateUtils();
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
const assignStudentsToDriver = async () => {
  if (!selectedDriverId.value || selectedStudents.value.length === 0) return;

  await driversStore.updatesDriverForStudents(
    selectedStudentsIds.value.filter(
      (id): id is string => typeof id === "string"
    ),
    selectedDriverId.value
  );

  rowSelection.value = {};
  selectedDriverId.value = undefined;
};
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

async function onSubmit() {
  if (selectedFlag.value === "move_academic_class") {
    await assignStudentsToAcademicClass();
    await studentsStore.fetchStudents();
  } else if (selectedFlag.value === "move_quran_class") {
    await assignStudentsToQuranClass();
    await studentsStore.fetchStudents();
  } else if (selectedFlag.value === "assign_driver") {
    await assignStudentsToDriver();
    await studentsStore.fetchStudents();
  } else if (selectedFlag.value === "assign_plan") {
    await assignStudentsToPlan();
    await studentsStore.fetchStudents();
  }
  showModal.value = false;
}
const driver_id_query = route.query.driver_id;
const level_query = route.query.level;
const class_group_query = route.query.class_group;
const classType_query: ClassType | undefined =
  typeof route.query.classType === "string" &&
  (route.query.classType === "quran" || route.query.classType === "academic")
    ? (route.query.classType as ClassType)
    : undefined;

type ClassType = "quran" | "academic";

// Computed
const selectedStudents = computed(() =>
  Object.keys(rowSelection.value).map((index) => numberedStudents.value[+index])
);
const filteredStudents = computed(() => {
  if (driver_id_query) {
    return studentsStore.sortedStudents.filter(
      (student) =>
        driver_id_query !== null &&
        driver_id_query !== undefined &&
        student.driver_id === +driver_id_query
    );
  } else if (level_query && class_group_query) {
    if (classType_query === "academic") {
      return studentsStore.sortedStudents.filter(
        (student) =>
          student.academic_class?.title === level_query &&
          String(student.academic_class?.group) === String(class_group_query)
      );
    } else if (classType_query === "quran") {
      return studentsStore.sortedStudents.filter(
        (student) =>
          student.quran_class?.title === level_query &&
          String(student.quran_class?.group) === String(class_group_query)
      );
    }
  } else if (level_query) {
    return studentsStore.sortedStudents.filter(
      (student) => student.academic_class?.title === level_query
    );
  } else {
    return studentsStore.sortedStudents;
  }
});
const numberedStudents = computed(() =>
  (filteredStudents.value ?? []).map((student, index) => {
    return {
      ...student,
      rowNumber: index + 1,
    };
  })
);
const selectedStudentsIds = computed(() =>
  selectedStudents.value.map((student) => student?.id)
);
const modelTitle = computed(() =>
  selectedFlag.value === "studentIssue"
    ? "تفاصيل المخالفات"
    : selectedFlag.value === "move_academic_class"
    ? "نقل لصف دراسي"
    : selectedFlag.value === "move_quran_class"
    ? "نقل لصف قرآن"
    : selectedFlag.value === "academic_class"
    ? "تفاصيل الصف الدراسي"
    : selectedFlag.value === "quran_class"
    ? "تفاصيل الصف القرآني"
    : selectedFlag.value === "driver_info"
    ? "تفاصيل السائق"
    : selectedFlag.value === "plan"
    ? "تفاصيل خطة الطالب"
    : ""
);

const getMonthAchievedPages = (month: string, student?: Student): number => {
  return (
    student?.quran_achievement_reports?.find((p) => p.month === month)
      ?.achieved_pages ?? 0
  );
};
// const getMonthStatus = (month: string, student?: Student): string => {
//   return (
//     student?.student_monthly_achievements?.find((p) => p.month === month)
//       ?.status ?? "غير مكتمل"
//   );
// };
const isPlanAchieved = (required: number, achieved: number): boolean => {
  return achieved >= required;
};
const getAchievementColor = (month: string, planPages: number) => {
  const achievedPages = getMonthAchievedPages(month, selectedStudent.value);
  return isPlanAchieved(planPages, achievedPages) ? "success" : "error";
};

watch(selectedPlan, () => {
  console.log(selectedPlan.value?.value);
});

const toDate = (date: string | Date): string => {
  if (typeof date === "string") {
    return new Date(date).toISOString().split("T")[0];
  }
  return date.toISOString().split("T")[0];
};
</script>

<template>
  <div>
    <UModal v-model:open="showModal" :title="modelTitle" class="min-w-3xl">
      <template #body>
        <div v-if="selectedFlag === 'studentIssue'">
          <div v-if="selectedStudent?.behavioral_issues?.length">
            <ul>
              <li
                class="grid grid-cols-3 justify-between items-center gap-2 border-b py-2 place-items-center"
              >
                <span class="font-bold">اليوم</span>
                <span class="font-bold">التاريخ</span>
                <span class="font-bold">المخالفة</span>
              </li>
              <li
                v-for="(issue, index) in selectedStudent.behavioral_issues"
                :key="index"
                class="grid grid-cols-3 justify-between items-center gap-2 border-b border-dashed border-gray-200 py-2 place-items-center mb-2"
              >
                <span>
                  {{ getArabicDayName(issue.created_at + "") }}
                </span>
                <span>
                  {{ toDate(issue.created_at ?? "") }}
                </span>
                <span> {{ issue.description }} </span>
              </li>
            </ul>
            <div class="pt-3">
              <span> المجموع: </span>
              <span class="font-bold">
                {{ selectedStudent.behavioral_issues.length }}
              </span>
            </div>
          </div>

          <p v-else>لا توجد مخالفات.</p>
        </div>
        <div v-if="selectedFlag === 'academic_class'">
          <div v-if="selectedStudent?.academic_class">
            <ul>
              <li
                class="grid grid-cols-4 justify-between items-center gap-2 border-b py-2 place-items-center"
              >
                <span class="font-bold">الصف</span>
                <span class="font-bold">الشعبة</span>
                <span class="font-bold">الطابق</span>
                <span class="font-bold">الجهة</span>
              </li>
              <li
                class="grid grid-cols-4 justify-between items-center gap-2 py-2 place-items-center"
              >
                <span class="font-bold">
                  {{ selectedStudent?.academic_class.title }}
                </span>
                <span class="font-bold">
                  {{ selectedStudent?.academic_class.group }}
                </span>
                <span class="font-bold">
                  {{ selectedStudent?.academic_class.floor }}
                </span>
                <span class="font-bold">
                  {{ selectedStudent?.academic_class.wing }}
                </span>
              </li>
            </ul>
          </div>

          <p v-else>لم يتم تعيين صف بعد</p>
        </div>
        <div v-if="selectedFlag === 'quran_class'">
          <div v-if="selectedStudent?.quran_class">
            <ul>
              <li
                class="grid grid-cols-4 justify-between items-center gap-2 border-b py-2 place-items-center"
              >
                <span class="font-bold">الصف</span>
                <span class="font-bold">الشعبة</span>
                <span class="font-bold">الطابق</span>
                <span class="font-bold">الجهة</span>
              </li>
              <li
                class="grid grid-cols-4 justify-between items-center gap-2 py-2 place-items-center"
              >
                <span class="font-bold">
                  {{ selectedStudent?.quran_class.title }}
                </span>
                <span class="font-bold">
                  {{ selectedStudent?.quran_class.group }}
                </span>
                <span class="font-bold">
                  {{ selectedStudent?.quran_class.floor }}
                </span>
                <span class="font-bold">
                  {{ selectedStudent?.quran_class.wing }}
                </span>
              </li>
            </ul>
          </div>

          <p v-else>لم يتم تعيين صف بعد</p>
        </div>
        <div v-if="selectedFlag === 'driver_info'">
          <div v-if="selectedStudent?.driver">
            <ul>
              <li
                class="grid grid-cols-4 justify-between items-center gap-2 border-b py-2 place-items-center"
              >
                <span class="font-bold">الاسم</span>
                <span class="font-bold">نوع السيارة</span>
                <span class="font-bold">لون السيارة</span>
                <span class="font-bold">رقم الجوال</span>
              </li>
              <li
                class="grid grid-cols-4 justify-between items-center gap-2 py-2 place-items-center"
              >
                <span class="font-bold">
                  {{ selectedStudent?.driver.name }}
                </span>
                <span class="font-bold">
                  {{ selectedStudent?.driver.car_type }}
                </span>
                <span class="font-bold">
                  {{ selectedStudent?.driver.car_color }}
                </span>
                <span class="font-bold">
                  {{ selectedStudent?.driver.phone_no }}
                </span>
              </li>
            </ul>
          </div>

          <p v-else>لم يتم تعيين سائق بعد</p>
        </div>
        <div v-if="selectedFlag === 'plan'">
          <div v-if="selectedStudent?.plan" class="text-sm">
            <!-- achievment plan details -->
            <div
              v-if="selectedStudent.plan.months_plans?.length"
              class="border border-accented rounded-tr-lg rounded-tl-lg"
            >
              <h3
                class="font-bold text-sm text-center py-2 rounded-tr-md rounded-tl-md bg-accented"
              >
                تفاصيل إنجاز الطالب
              </h3>
              <div class="px-2">
                <ul>
                  <li
                    class="grid grid-cols-4 justify-between items-center gap-2 border-b py-2 place-items-center"
                  >
                    <span class="font-bold">الشهر</span>
                    <span class="font-bold">عدد الصفحات المطلوبة</span>
                    <span class="font-bold">عدد الصفحات المنجزة</span>
                    <span class="font-bold">الحالة</span>
                  </li>
                  <li
                    class="grid grid-cols-4 justify-between items-center gap-2 py-2 place-items-center not-last:border-b border-gray-400 not-last:border-dashed"
                    v-for="plan in selectedStudent.plan.months_plans"
                    :key="plan.id"
                  >
                    <span>
                      {{ plan.month }}
                    </span>
                    <span>
                      {{ plan.pages }}
                    </span>
                    <span>
                      {{
                        getMonthAchievedPages(plan.month ?? "", selectedStudent)
                      }}
                    </span>
                    <UBadge
                      :color="
                        getAchievementColor(plan.month ?? '', plan.pages ?? 0)
                      "
                    >
                      {{
                        isPlanAchieved(
                          plan.pages ?? 0,
                          getMonthAchievedPages(
                            plan.month ?? "",
                            selectedStudent
                          )
                        )
                          ? "مكتمل"
                          : "غير مكتمل"
                      }}
                    </UBadge>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <p v-else>لم يتم تعيين خطة بعد</p>
        </div>

        <div v-if="selectedFlag === 'move_academic_class'">
          <UForm
            :schema="schema"
            :state="{ selectedClassId }"
            class="space-y-4"
            @submit="onSubmit"
          >
            <UFormField label="اختر الصف الدراسي" required name="classId">
              <USelect
                class="w-full"
                v-model="selectedClassId"
                :items="
                  academicClassesStore.classesData.map((c) => ({
                    label: `${c.title} - شعبة ${c.group}`,
                    value: c.id,
                  }))
                "
                placeholder="اختر الصف الدراسي"
              />
            </UFormField>
            <div class="flex gap-3 items-center">
              <UButton
                type="submit"
                label="نقل"
                color="secondary"
                :loading="academicClassesStore.loading"
                class="w-30 flex justify-center mt-5 hover:cursor-pointer font-bold"
              />
              <UButton
                label="إلغاء"
                color="neutral"
                variant="soft"
                class="w-30 flex justify-center mt-5 hover:cursor-pointer"
                @click="showModal = false"
              />
            </div>
          </UForm>
        </div>
        <div v-if="selectedFlag === 'move_quran_class'">
          <UForm
            :schema="schema"
            :state="{ selectedClassId }"
            class="space-y-4"
            @submit="onSubmit"
          >
            <UFormField label="اختر صف القرآن" required name="classId">
              <USelect
                class="w-full"
                v-model="selectedClassId"
                :items="
                  quranClassesStore.classesData.map((c) => ({
                    label: `${c.title} - شعبة ${c.group}`,
                    value: c.id,
                  }))
                "
                placeholder="اختر صف القرآن"
              />
            </UFormField>
            <div class="flex gap-3 items-center">
              <UButton
                type="submit"
                label="نقل"
                color="secondary"
                :loading="quranClassesStore.loading"
                class="w-30 flex justify-center mt-5 hover:cursor-pointer font-bold"
              />
              <UButton
                label="إلغاء"
                color="neutral"
                variant="soft"
                class="w-30 flex justify-center mt-5 hover:cursor-pointer"
                @click="showModal = false"
              />
            </div>
          </UForm>
        </div>
        <div v-if="selectedFlag === 'assign_driver'">
          <UForm
            :schema="assignDriverSchema"
            :state="{ selectedDriverId }"
            class="space-y-4"
            @submit="onSubmit"
          >
            <UFormField label="اختر السائق" required name="driverId">
              <USelect
                class="w-full"
                v-model="selectedDriverId"
                :items="
                  driversStore.driversData.map((driver) => ({
                    label: `${driver.name} - ${driver.car_type} - ${driver.car_color}`,
                    value: driver.id,
                  }))
                "
                placeholder="اختر السائق"
              />
            </UFormField>
            <div class="flex gap-3 items-center">
              <UButton
                type="submit"
                label="تعيين"
                color="secondary"
                :loading="driversStore.loading"
                class="w-30 flex justify-center mt-5 hover:cursor-pointer font-bold"
              />
              <UButton
                label="إلغاء"
                color="neutral"
                variant="soft"
                class="w-30 flex justify-center mt-5 hover:cursor-pointer"
                @click="showModal = false"
              />
            </div>
          </UForm>
        </div>
        <div v-if="selectedFlag === 'assign_plan'">
          <UForm
            :schema="assignPlanSchema"
            :state="{ selectedPlanId: selectedPlan?.value }"
            class="space-y-4"
            @submit="onSubmit"
          >
            <UFormField label="اختر الخطة" required name="planId">
              <USelectMenu
                class="w-full"
                v-model="selectedPlan"
                icon="i-lucide-map"
                :items="
                  plansStore.plansData.map((plan) => ({
                    label: `${plan.semester} ${plan.year} - ${plan.students_type} - ${plan.stage} - عدد الصفحات: ( ${plan.total_pages} )`,
                    value: plan.id,
                  }))
                "
                placeholder="اختر الخطة"
              />
            </UFormField>
            <div class="flex gap-3 items-center">
              <UButton
                type="submit"
                label="تعيين"
                color="secondary"
                :loading="plansStore.loading"
                class="w-30 flex justify-center mt-5 hover:cursor-pointer font-bold"
              />
              <UButton
                label="إلغاء"
                color="neutral"
                variant="soft"
                class="w-30 flex justify-center mt-5 hover:cursor-pointer"
                @click="showModal = false"
              />
            </div>
          </UForm>
        </div>
      </template>
    </UModal>

    <!-- start filters -->
    <div class="mb-10">
      <UInput
        icon="i-lucide-search"
        size="md"
        color="secondary"
        variant="outline"
        v-model="globalFilter"
        placeholder="البحث عن طالب..."
        class="w-full md:col-span-4"
      />
    </div>

    <BaseTable
      :loading="studentsStore.loading"
      :key="studentsStore.tableKey"
      v-model:global-filter="globalFilter"
      v-model:row-selection="rowSelection"
      :ref="table"
      :data="numberedStudents"
      :columns="columns"
      v-model:sorting="sorting"
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
          <UButton
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
          </UButton>
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
          >
            <!-- <span>تصدير</span> -->
            <span>({{ selectedStudents.length }})</span>
            <span> Excel </span>
          </UButton>
          <!-- PDF export button -->
          <UButton
            icon="heroicons-document-chart-bar-solid"
            variant="outline"
            color="secondary"
            size="sm"
            class="p-2 font-bold text-blue-700 h-full"
          >
            <!-- <span>تصدير</span> -->
            <span>({{ selectedStudents.length }})</span>
            <span> PDF </span>
          </UButton>
        </div>
      </template>
      <!-- </div> -->
    </BaseTable>
    <!-- <UTable
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
    </UTable> -->
  </div>
</template>
