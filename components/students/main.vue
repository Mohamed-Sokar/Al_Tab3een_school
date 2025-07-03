<script setup lang="ts">
import type { Column } from "@tanstack/vue-table";
import type { TableColumn, DropdownMenuItem } from "@nuxt/ui";
import type { Student } from "~/types";
import { useStudentStore } from "@/stores/students";
import { useAcademicClassesStore } from "@/stores/academic_classes";
import { useQuranClassesStore } from "@/stores/quran_classes";
import { useDriversStore } from "@/stores/drivers";
import { object, number } from "yup";
import type { InferType } from "yup";

const schema = object({
  selectedClassId: number().required("الصف مطلوب"),
});
const assignDriverSchema = object({
  selectedDriverId: number().required("السائق مطلوب"),
});
type Schema = InferType<typeof schema>;

// init
const studentsStore = useStudentStore();
const quranClassesStore = useQuranClassesStore();
const academicClassesStore = useAcademicClassesStore();
const driversStore = useDriversStore();

const route = useRoute();
const UButton = resolveComponent("UButton");
const UDropdownMenu = resolveComponent("UDropdownMenu");
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
    accessorKey: "address",
    header: "العنوان",
  },
  {
    accessorKey: "masjed",
    header: "المسجد",
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
function getHeader(column: Column<Student>, label: string) {
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
const dayNameArabic = (date: string) =>
  new Date(date).toLocaleDateString("ar-EG", { weekday: "long" });
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
    : ""
);
</script>

<template>
  <div>
    <UModal v-model:open="showModal" :title="modelTitle">
      <template #body>
        <div v-if="selectedFlag === 'studentIssue'">
          <div v-if="selectedStudent?.behavioral_issues?.length">
            <ul>
              <li
                class="grid grid-cols-3 justify-between items-center gap-2 border-b py-2"
              >
                <span class="font-bold">اليوم</span>
                <span class="font-bold">التاريخ</span>
                <span class="font-bold">المخالفة</span>
              </li>
              <li
                v-for="(issue, index) in selectedStudent.behavioral_issues"
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
                class="grid grid-cols-4 justify-between items-center gap-2 border-b py-2"
              >
                <span class="font-bold">الصف</span>
                <span class="font-bold">الشعبة</span>
                <span class="font-bold">الطابق</span>
                <span class="font-bold">الجهة</span>
              </li>
              <li
                class="grid grid-cols-4 justify-between items-center gap-2 py-2"
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
                class="grid grid-cols-4 justify-between items-center gap-2 border-b py-2"
              >
                <span class="font-bold">الصف</span>
                <span class="font-bold">الشعبة</span>
                <span class="font-bold">الطابق</span>
                <span class="font-bold">الجهة</span>
              </li>
              <li
                class="grid grid-cols-4 justify-between items-center gap-2 py-2"
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
                class="grid grid-cols-4 justify-between items-center gap-2 border-b py-2"
              >
                <span class="font-bold">الاسم</span>
                <span class="font-bold">نوع السيارة</span>
                <span class="font-bold">لون السيارة</span>
                <span class="font-bold">رقم الجوال</span>
              </li>
              <li
                class="grid grid-cols-4 justify-between items-center gap-2 py-2"
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
      </template>
    </UModal>

    <!-- Start actions -->
    <div class="w-full flex justify-between gap-2 mt-5 mb-5">
      <TransitionGroup :duration="300" mode="out-in" name="fade">
        <!-- input filter -->
        <UInput
          icon="i-lucide-search"
          size="md"
          color="secondary"
          variant="outline"
          v-model="globalFilter"
          placeholder="البحث عن طالب..."
          class="w-full md:col-span-4"
        />
        <!-- actions -->
        <div
          class="flex items-center justify-end gap-2"
          v-if="selectedStudents.length"
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
        <!-- <div class="space-x-2 flex items-center">
          <UBadge
            :label="selectedStudents.length"
            color="secondary"
            class="font-bold"
          />
          <span> طلاب محددين </span>
        </div> -->
      </TransitionGroup>
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
    />
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
