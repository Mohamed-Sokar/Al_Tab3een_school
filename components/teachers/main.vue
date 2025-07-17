<script setup lang="ts">
import type { TableColumn, DropdownMenuItem } from "@nuxt/ui";
import type { Employee } from "~/types";
import { useTeachersStore } from "@/stores/teachers";
import { array, object } from "yup";
import { useExportToExcel } from "~/composables/useExportToExcel";

useHead({ title: "المعلمون" });

const teachersStore = useTeachersStore();
const academicClassesStore = useAcademicClassesStore();
const { getArabicDayName, getDate } = useDateUtils();
const { exportToExcel } = useExportToExcel();

type Flag =
  | "behavioral_issues"
  | "loans"
  | "absence"
  | "academic_classes"
  | "add_supervisory_visit"
  | "supervisory_visits"
  | "assign_academic_class";

const globalFilter = ref("");
const sorting = ref([
  {
    id: "id",
    desc: false,
  },
]);
const rowSelection = ref({});
const tableKey = ref(Math.random());
const UBadge = resolveComponent("UBadge");
const UButton = resolveComponent("UButton");
const selectedTeacher = ref<Employee>();
const selectedArrayFlag = ref<Flag>();
const showModal = ref(false);
const selectedAcademicClassesIds = ref<number[]>([]);
const prevAcademicClassesIds = ref<number[]>([]);
const table = ref();

const schema = object({
  selectedAcademicClassesIds: array().required("الصف مطلوب"),
});

const columns: TableColumn<Employee>[] = [
  {
    accessorKey: "rowNumber",
    header: "الرقم",
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
    cell: ({ row }) => {
      const teacher = row.original;
      return teacher.first_name
        ? teacher.first_name +
            " " +
            teacher.second_name +
            " " +
            teacher.last_name
        : "";
    },
  },
  {
    accessorKey: "job_title",
    header: "المسمى الوظيفي",
  },
  {
    accessorKey: "subject",
    header: "المادة",
    cell: ({ row }) => {
      let subject: string | string[] = row.original.subject || "";
      if (typeof row.original.subject === "string") {
        try {
          subject = JSON.parse(row.original.subject).join(" | ");
        } catch (e) {
          subject = row.original.subject;
        }
      }
      if (Array.isArray(subject)) {
        subject = subject.join(" | ");
      }
      return h(
        UBadge,
        {
          class: `capitalize`,
          variant: "solid",
          color: `info`,
        },
        () => `${subject || "غير محدد"}`
      );
    },
  },
  {
    accessorKey: "teachers_behavioral_issues",
    header: "المخالفات الإدارية",
    cell: ({ row }) => {
      const issues = row.original.behavioral_issues || [];
      return h(
        UBadge,
        {
          class: `capitalize hover:cursor-pointer hover:outline ${
            issues.length > 0 ? "font-bold" : "font-normal"
          }`,
          variant: `${issues.length > 0 ? "subtle" : "soft"}`,
          color: `${issues.length > 0 ? "error" : "neutral"}`,
          onClick: (e: Event) => {
            e.stopPropagation();
            showIssuesModal(row.original, "behavioral_issues");
          },
        },
        () => `${issues.length} مخالفة`
      );
    },
  },
  {
    accessorKey: "teachers_loans",
    header: "السلف المستحقة",
    cell: ({ row }) => {
      const loans = row.original.loans || [];
      return h(
        UBadge,
        {
          class: `capitalize hover:cursor-pointer hover:outline ${
            loans.length > 0 ? "font-bold" : "font-normal"
          }`,
          variant: `${loans.length ? "subtle" : "soft"}`,
          color: `${loans.length ? "error" : "neutral"}`,
          onClick: (e: Event) => {
            e.stopPropagation();
            showIssuesModal(row.original, "loans");
          },
        },

        () => `${loans.length} سلفة`
      );
    },
  },
  {
    accessorKey: "teachers_absence",
    header: "أيام الغياب",
    cell: ({ row }) => {
      const absences = row.original.absence || [];
      return h(
        UBadge,
        {
          class: `capitalize hover:cursor-pointer hover:outline ${
            absences.length > 0 ? "font-bold" : "font-normal"
          }`,
          variant: `${absences.length ? "subtle" : "soft"}`,
          color: `${absences.length ? "error" : "neutral"}`,
          onClick: (e: Event) => {
            e.stopPropagation();
            showIssuesModal(row.original, "absence");
          },
        },

        () => `${absences.length} يوم`
      );
    },
  },
  {
    accessorKey: "academic_classes",
    header: "الصفوف الدراسية",
    cell: ({ row }) => {
      const academic_classes = row.original.academic_classes || [];
      if (academic_classes.length === 0) {
        return "لا يوجد صفوف";
      }
      return h(
        UBadge,
        {
          class: `capitalize hover:cursor-pointer hover:outline ${
            academic_classes.length > 0 ? "font-bold" : "font-normal"
          }`,
          variant: `${academic_classes.length ? "subtle" : "soft"}`,
          color: `neutral`,
          onClick: (e: Event) => {
            e.stopPropagation();
            showIssuesModal(row.original, "academic_classes");
          },
        },

        () => `${academic_classes.length} صف`
      );
    },
  },
  {
    accessorKey: "supervisory_visits",
    header: "الزيارات الإشرافية",
    cell: ({ row }) => {
      const supervisory_visits = row.original.supervisory_visits || [];
      if (supervisory_visits.length === 0) {
        return "لا توجد زيارات";
      }
      return h(
        UBadge,
        {
          class: `capitalize hover:cursor-pointer hover:outline ${
            supervisory_visits.length > 0 ? "font-bold" : "font-normal"
          }`,
          variant: `${supervisory_visits.length ? "subtle" : "soft"}`,
          color: `${supervisory_visits.length ? "success" : "neutral"}`,
          onClick: (e: Event) => {
            e.stopPropagation();
            showIssuesModal(row.original, "supervisory_visits");
          },
        },

        () => `${supervisory_visits.length} زيارة`
      );
    },
  },

  {
    id: "action",
  },
];
function getDropdownActions(teacher: Employee): DropdownMenuItem[][] {
  return [
    [
      {
        label: "إضافة زيارة إشرافية",
        color: "info",
        icon: "i-heroicons-calendar-days",
        onSelect: () => {
          navigateTo(`/employees/${teacher.id}/add-supervisory-visit`);
          // showIssuesModal(teacher, "add_supervisory_visit");
        },
      },
      {
        label: "إضافة صف دراسي",
        color: "info",
        icon: "i-heroicons-presentation-chart-bar",
        onSelect: () => {
          showIssuesModal(teacher, "assign_academic_class");
        },
      },
      {
        label: "إضافة سلفة",
        color: "info",
        icon: "i-heroicons-banknotes",
        onSelect: () => {
          navigateTo(`/employees/${teacher.id}/add-loan`);
        },
      },
      {
        label: "إضافة تقرير غياب",
        color: "error",
        icon: "i-heroicons-user-minus",
        onSelect: () => {
          navigateTo(`/employees/${teacher.id}/add-absence-report`);
        },
      },
      {
        label: "إضافة مخالفة إدارية",
        color: "warning",
        icon: "i-heroicons-exclamation-triangle",
        onSelect: () => {
          navigateTo(`/employees/${teacher.id}/add-behavioral-issue`);
        },
      },
    ],
    [
      {
        label: "معاينة",
        icon: "i-lucide-eye",
        onSelect: () => {
          navigateTo(`/employees/${teacher.id}/view`);
        },
      },
      {
        label: "تعديل",
        icon: "i-lucide-edit",
        onSelect: () => {
          navigateTo(`/employees/${teacher.id}/edit`);
        },
      },
      {
        label: "حذف",
        icon: "i-lucide-trash",
        color: "error",
        onSelect: () => {
          teachersStore.deleteTeacher(teacher.id || "");
        },
      },
    ],
  ];
}
// Actions
function showIssuesModal(teacher: Employee, flag: Flag) {
  selectedArrayFlag.value = flag;
  selectedTeacher.value = teacher;
  showModal.value = true;

  console.log(selectedTeacher.value.academic_classes);
  // assign to select the prev academic classes
  selectedAcademicClassesIds.value =
    selectedTeacher.value?.academic_classes
      ?.map((c) => c?.class?.id)
      .filter((id): id is number => typeof id === "number") || [];

  // buffer perv classes id's
  prevAcademicClassesIds.value = [...selectedAcademicClassesIds.value];

  console.log("prevAcademicClassesIds", prevAcademicClassesIds.value);
  console.log("selectedAcademicClassesIds", selectedAcademicClassesIds.value);
}
const assignAcademicClass = async () => {
  // get just new academic classes
  const newClassIds = selectedAcademicClassesIds.value.filter(
    (id) => !prevAcademicClassesIds.value.includes(id)
  );
  const removedClassIds = prevAcademicClassesIds.value.filter(
    (id) => !selectedAcademicClassesIds.value.includes(id)
  );

  // adding new classes
  if (newClassIds.length > 0) {
    await academicClassesStore.assignAcademicClassesForTeacher(
      newClassIds,
      selectedTeacher.value?.id || ""
    );
  }

  // delete classes which unselected
  if (removedClassIds.length > 0) {
    await academicClassesStore.removeAcademicClassesFromTeacher(
      removedClassIds,
      selectedTeacher.value?.id || ""
    );
  }
  selectedAcademicClassesIds.value = [];
  prevAcademicClassesIds.value = [];
  console.log(selectedTeacher.value);
  showModal.value = false;
};
const exportStudents = () => {
  exportToExcel({
    data: selectedTeachers.value.map((s, i) => ({
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
      المواد: s.subject,
      المسجد: s.masjed,
      الهوية: s.identity_number,
      الهاتف: s.phone_number,
      "رقم الواتس": s.whatsapp_number,
      "تاريخ الميلاد": s.birth_date,
      "تاريخ الالتحاق بالمدرسة": s.enrollment_date,
      "عدد الأطفال":
        s.marital_status === "متزوج" ? s.children_count : "غير متزوج بعد",
      "الحالة الاجتماعية": s.marital_status,
      "عدد المخالفات السلوكية": s.behavioral_issues?.length,
    })),
    fileName: "المعلمين",
    sheetName: "المعلمين",
  });
};
// Getters
const numberedTeachers = computed(() => {
  return teachersStore.sortedTeachers.map(
    (teacher: Employee, index: number) => ({
      ...teacher,
      rowNumber: index + 1,
    })
  );
});
const selectedTeachers = computed(() =>
  Object.keys(rowSelection.value).map((index) => numberedTeachers.value[+index])
);
const selectedEmployeesIds = computed(() =>
  selectedTeachers.value.map((student) => student?.id)
);

// watch(rowSelection, () => {
//   console.log(selectedTeachers.value);
// });
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
          : selectedArrayFlag === 'academic_classes'
          ? 'تفاصيل الصفوف الدراسية'
          : selectedArrayFlag === 'supervisory_visits'
          ? 'تفاصيل الزيارات الإشرافية'
          : ''
      "
    >
      <template #body>
        <div v-if="selectedArrayFlag === 'behavioral_issues'">
          <div v-if="selectedTeacher?.behavioral_issues?.length">
            <ul>
              <li
                class="grid grid-cols-3 justify-between items-center gap-2 border-b py-2 place-items-center"
              >
                <span class="font-bold">اليوم</span>
                <span class="font-bold">التاريخ</span>
                <span class="font-bold">المخالفة</span>
              </li>
              <li
                v-for="(issue, index) in selectedTeacher.behavioral_issues"
                :key="index"
                class="grid grid-cols-3 justify-between items-center gap-2 border-b border-dashed border-gray-200 py-2 place-items-center mb-2"
              >
                <span>
                  {{ getArabicDayName(issue.created_at + "") }}
                </span>
                <span>
                  {{ getDate(issue.created_at ?? "") }}
                </span>
                <span> {{ issue.description }} </span>
              </li>
            </ul>
            <div class="pt-3">
              <span> المجموع: </span>
              <span class="font-bold">
                {{ selectedTeacher.behavioral_issues.length }}
              </span>
            </div>
          </div>

          <p v-else>لا توجد مخالفات.</p>
        </div>
        <div v-if="selectedArrayFlag === 'supervisory_visits'">
          <div v-if="selectedTeacher?.supervisory_visits?.length">
            <ul>
              <li
                class="grid grid-cols-5 justify-between items-center gap-2 border-b py-2 place-items-center"
              >
                <span class="font-bold">اليوم</span>
                <span class="font-bold">التاريخ</span>
                <span class="font-bold">نوع الزيارة</span>
                <span class="font-bold">المشرف</span>
                <span class="font-bold">ملاحظات</span>
              </li>
              <li
                v-for="(visit, index) in selectedTeacher.supervisory_visits"
                :key="index"
                class="grid grid-cols-5 justify-between items-center gap-2 border-b border-dashed border-gray-200 py-2 place-items-center mb-2"
              >
                <span>
                  {{ getArabicDayName(visit.date + "") }}
                </span>
                <span>
                  {{ getDate(visit.date ?? "") }}
                </span>
                <span> {{ visit.type }} </span>
                <span> {{ visit.supervisor }} </span>
                <span> {{ visit.notes }} </span>
              </li>
            </ul>
            <div class="pt-3">
              <span> المجموع: </span>
              <span class="font-bold">
                {{ selectedTeacher.supervisory_visits.length }}
              </span>
            </div>
          </div>

          <p v-else>لا توجد زيارات.</p>
        </div>
        <div v-if="selectedArrayFlag === 'academic_classes'">
          <div v-if="selectedTeacher?.academic_classes?.length">
            <ul>
              <li
                class="grid grid-cols-2 justify-between items-center gap-2 border-b py-2 place-items-center"
              >
                <span class="font-bold">الصف</span>
                <span class="font-bold">الشعبة</span>
              </li>
              <li
                v-for="(
                  academicClass, index
                ) in selectedTeacher.academic_classes"
                :key="index"
                class="grid grid-cols-2 justify-between items-center gap-2 border-b border-dashed border-gray-200 py-2 place-items-center mb-2"
              >
                <span> {{ academicClass?.class?.title }} </span>
                <span> {{ academicClass?.class?.group }} </span>
              </li>
            </ul>
            <div class="pt-3">
              <span> المجموع: </span>
              <span class="font-bold">
                {{ selectedTeacher.academic_classes.length }}
              </span>
            </div>
          </div>

          <p v-else>لا توجد صفوف.</p>
        </div>
        <div v-else-if="selectedArrayFlag === 'loans'">
          <div v-if="selectedTeacher?.loans?.length">
            <ul>
              <li
                class="grid grid-cols-3 justify-between items-center gap-2 border-b py-2 place-items-center"
                place-items-center
              >
                <span class="font-bold">اليوم</span>
                <span class="font-bold">التاريخ</span>
                <span class="font-bold">القيمة</span>
              </li>
              <li
                v-for="(loan, index) in selectedTeacher.loans"
                :key="index"
                class="grid grid-cols-3 justify-between items-center gap-2 border-b border-dashed border-gray-200 py-2 place-items-center mb-2"
              >
                <span>
                  {{ getArabicDayName(loan.created_at + "") }}
                </span>
                <span> {{ getDate(loan.created_at ?? "") }} </span>
                <span> {{ loan.amount }} ₪ </span>
              </li>
            </ul>
            <div class="pt-3">
              <span> المجموع: </span>
              <span class="font-bold">
                {{
                  selectedTeacher.loans.reduce(
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
          <div v-if="selectedTeacher?.absence?.length">
            <ul>
              <li
                class="grid grid-cols-4 justify-between items-center gap-2 border-b py-2 place-items-center"
              >
                <span class="font-bold">اليوم</span>
                <span class="font-bold">التاريخ</span>
                <span class="font-bold">حالة العذر</span>
                <span class="font-bold">سبب الغياب</span>
              </li>
              <li
                v-for="(report, index) in selectedTeacher.absence"
                :key="index"
                class="grid grid-cols-4 justify-center items-center gap-2 border-b border-dashed border-gray-200 py-2 place-items-center mb-2"
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
                {{ selectedTeacher.absence.length }}
              </span>
            </div>
          </div>

          <p v-else>لا يوجد أيام غياب.</p>
        </div>
        <div v-if="selectedArrayFlag === 'assign_academic_class'">
          <UForm
            :schema="schema"
            :state="{ selectedAcademicClassesIds }"
            class="space-y-4"
            @submit="assignAcademicClass"
          >
            <UFormField label="اختر الصف الدراسي" required name="classId">
              <USelect
                class="w-full"
                multiple
                v-model="selectedAcademicClassesIds"
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
      </template>
    </UModal>

    <!-- Start Filters -->
    <div class="w-full mb-10">
      <UInput
        icon="i-lucide-search"
        size="md"
        color="secondary"
        variant="outline"
        v-model="globalFilter"
        placeholder="البحث عن معلم..."
        class="w-full md:col-span-4"
      />
    </div>
    <!-- End Filters -->

    <BaseTable
      :loading="teachersStore.loading"
      :key="tableKey"
      v-model:global-filter="globalFilter"
      v-model:row-selection="rowSelection"
      :ref="table"
      :data="numberedTeachers"
      :columns="columns"
      v-model:sorting="sorting"
      :get-dropdown-actions="getDropdownActions"
    >
      <template #actions>
        <div
          v-if="selectedTeachers.length"
          class="flex flex-wrap justify-end gap-2 items-center"
        >
          <UButton
            icon="heroicons-document-chart-bar-solid"
            variant="outline"
            color="primary"
            size="sm"
            class="p-2 font-bold text-green-700"
            @click="exportStudents"
          >
            <span>تصدير</span>
            <span>({{ selectedTeachers.length }})</span>
            <span> Excel </span>
          </UButton>
        </div>
      </template>
    </BaseTable>
  </div>
</template>
<style></style>
