<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useStudentStore } from "@/stores/students";
import { useAcademicClassesStore } from "@/stores/academic_classes";
import type { TableColumn, DropdownMenuItem } from "@nuxt/ui";

import type { FeesReport, Filters, Semester } from "~/types";
import { months } from "~/constants";

// SEO
useHead({ title: "تقارير رسوم الطلاب" });

// init
const academicClassesStore = useAcademicClassesStore();
const feesStore = useFeesStore();
const { exportToExcel } = useExportToExcel();
const { getDate } = useDateUtils();

// data
const UButton = resolveComponent("UButton");
const UBadge = resolveComponent("UBadge");
const columns: TableColumn<FeesReport>[] = [
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
      const report = row.original;
      return [
        report?.student?.first_name,
        report?.student?.second_name,
        report?.student?.third_name,
        report?.student?.last_name,
      ]
        .filter(Boolean)
        .join(" ");
    },
  },
  {
    accessorKey: "identity_number",
    header: "هوية الطالب",
    cell: ({ row }) => row.original?.student?.identity_number || "غير متوفر",
  },
  {
    accessorKey: "academic_class",
    header: "الشعبة الدراسية",
    cell: ({ row }) =>
      `${row.original.student?.academic_class?.title} - ${row.original.student?.academic_class?.group}`,
  },
  {
    accessorKey: "month",
    header: "الشهر",
    cell: ({ row }) =>
      row.original.month
        ? `${row.original.month.name} ( ${row.original.month.id} )`
        : "غير متوفر",
  },
  {
    accessorKey: "fees",
    header: "الرسوم المستحقة",
    cell: ({ row }) => {
      return h(
        UBadge,
        {
          variant: "soft",
          color: "neutral",
        },
        () => row.original.fees
      );
    },
  },
  {
    accessorKey: "amount",
    header: "الرسوم المدفوعة",
    cell: ({ row }) => {
      return h(
        UBadge,
        {
          variant: "soft",
          color: "neutral",
        },
        () => row.original.amount
      );
    },
  },
  {
    accessorKey: "المتبقي",
    header: "المتبقي",
    cell: ({ row }) => {
      const remain = Number(row.original.fees) - Number(row.original.amount);
      if (remain === 0) return "لا يوجد باقي";
      return h(
        UBadge,
        {
          color: `${remain === 0 ? "success" : "error"}`,
        },
        () => remain
      );
    },
  },
  {
    accessorKey: "status",
    header: "الحالة",
    cell: ({ row }) => {
      const status = row.original.status ?? "غير مسدد";
      const color = {
        مسدد: "success",
        متأخر: "warning",
        "غير مسدد": "error",
      }[status];

      return h(
        UBadge,
        {
          class: `capitalize`,
          color,
        },
        () => status
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "تاريخ الإضافة",
    cell: ({ row }) => getDate(row?.original?.created_at ?? new Date()),
  },
  {
    accessorKey: "updated_at",
    header: "تاريخ الحديث",
    cell: ({ row }) => {
      if (!row.original.updated_at) {
        return "لم يتم التحديث";
      }
      return getDate(row?.original?.updated_at);
    },
  },
  {
    accessorKey: "notes",
    header: "الملاحظات",
    cell: ({ row }) => {
      const notes = row.original.notes;
      if (!notes?.length) {
        return `لا يوجد ملاحظات`;
      }
      return h(
        UBadge,
        {
          class: `capitalize`,
          variant: "solid",
          color: "neutral",
        },
        () => notes
      );
    },
  },
  {
    id: "action",
  },
];
const pageCountOptions = [1, 2, 5, 10, 20, 50];

// state
const filters = reactive<Filters>({
  academicClassFilter: undefined,
  monthFilter: undefined,
  semesterFilter: undefined,
  dateFilter: undefined,
});
const isLoading = ref(false);
const table = ref();
const pageNum = ref(1);
const pageSize = ref(5);
const tableKey = ref(Math.random());
const rowSelection = ref({});
const sorting = ref([
  {
    id: "id",
    desc: false,
  },
]);

// Actions
const fetchReports = async (forceRefresh: boolean = false) => {
  isLoading.value = true;
  // await feesStore.getReportsCount(filters);
  await feesStore.fetchReports(
    pageNum.value,
    pageSize.value,
    filters,
    forceRefresh
  );
  isLoading.value = false;
};
const deleteReport = async (reportId: number) => {
  if (!confirm("هل أنت متأكد من حذف هذا التقرير؟")) return;
  try {
    isLoading.value = true;
    await feesStore.deleteReport(reportId);
  } finally {
    isLoading.value = false;
  }
};
const applyFilters = async () => {
  // await feesStore.getReportsCount(filters);
  await fetchReports(true);
  pageNum.value = 1;
};
const updateRows = async () => {
  await feesStore.fetchReports(pageNum.value, pageSize.value, filters);
};
const exportReports = () => {
  exportToExcel({
    data: selectedReports.value.map((report, i) => ({
      الرقم: i + 1,
      "الاسم الكامل": [
        report?.student?.first_name,
        report?.student?.second_name,
        report?.student?.third_name,
        report?.student?.last_name,
      ]
        .filter(Boolean)
        .join(" "),
      "رقم الهوية": report.student?.identity_number,
      "الشعبة الدراسية":
        report.student?.academic_class?.title +
        " - " +
        report.student?.academic_class?.group,
      "الرسوم المستحقة": report.fees,
      "الرسوم المدفوعة": report.amount,
      المتبقي: Number(report.fees) - Number(report.amount),
      "تاريخ الإضافة": report.created_at,
      "تاريخ التحديث": report.updated_at ?? "لم يتم التحديث",
      الحالة: report.status,
      الملاحظات: report.notes,
    })),
    sheetName: `رسوم تاريخ ${filters.dateFilter || "كل التواريخ"} - شهر (${
      months.find((m) => filters.monthFilter === m.value)?.label || "كل الأشهر"
    })`,
    fileName: `تقرير رسوم تاريخ ${filters.dateFilter || "كل التواريخ"} - شهر (${
      months.find((m) => filters.monthFilter === m.value)?.label || "كل الأشهر"
    })`,
    // fileName: "رسوم الطلاب الشهرية",
    // sheetName: "الرسوم الشهرية",
  });
};
function getDropdownActions(report: FeesReport): DropdownMenuItem[] {
  return [
    {
      label: "تعديل",
      icon: "i-lucide-edit",
      onSelect: () => {
        navigateTo({
          name: "financial-fees-id-edit",
          params: { id: report.id },
        });
      },
    },
    {
      label: "حذف",
      icon: "i-lucide-trash",
      color: "error",
      onSelect: () => deleteReport(report.id ?? 0),
    },
  ];
}

// Computed
const selectedReports = computed(() => {
  // calculate offset
  const offset = (pageNum.value - 1) * pageSize.value;

  return Object.keys(rowSelection.value)
    .map((index) => {
      // تعديل الفهرس ليعكس الموضع في القائمة الكلية
      const globalIndex = offset + Number(index);
      return numberedReports.value[globalIndex];
    })
    .filter((report) => report !== undefined); // تصفية أي قيم غير موجودة
});
const date_string = computed({
  get() {
    if (!filters.dateFilter) return "";
    if (typeof filters.dateFilter === "string") {
      // If already in YYYY-MM-DD format, return as is
      if (/^\d{4}-\d{2}-\d{2}$/.test(filters.dateFilter)) {
        return filters.dateFilter;
      }
      // Try to parse and format
      const d = new Date(filters.dateFilter);
      if (!isNaN(d.getTime())) {
        return d.toISOString().slice(0, 10);
      }
      return "";
    }
    if (filters.dateFilter instanceof Date) {
      return filters.dateFilter.toISOString().slice(0, 10);
    }
    return "";
  },
  set(val: Date) {
    filters.dateFilter = val;
  },
});
// pagination rows
const rows = computed(() => {
  const start = (pageNum.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  console.log("rows; ", numberedReports.value.slice(start, end));
  return numberedReports.value.slice(start, end);
});
const totalPages = computed(() => {
  return Math.ceil(
    feesStore.reportsCountData > 0
      ? Math.ceil(feesStore.reportsCountData / pageSize.value)
      : 1
  );
});
const numberedReports = computed(() =>
  feesStore.reportsData.map((report: FeesReport, index: number) => {
    return {
      ...report,
      rowNumber: index + 1,
    };
  })
);

// Watches
watch(pageSize, () => {
  pageNum.value = 1;
});
// reset rowSelection when pageNum is changed
watch(pageNum, async () => {
  updateRows();
  rowSelection.value = {}; // reset selections
});
// clean monthFilter if conflicts with dateFilter
watch(filters, () => {
  if (filters.dateFilter && filters.monthFilter) {
    const selectedDate = new Date(filters.dateFilter);
    const month = selectedDate.getMonth() + 1; // 1-12
    if (month !== filters.monthFilter) {
      filters.monthFilter = undefined; // Clear month filter if it conflicts
    }
  }
});

onMounted(async () => {
  await academicClassesStore.fetchClasses();
});
</script>

<template>
  <div>
    <!-- start base header -->
    <BaseHeader title="رسوم الطلاب" description="إدارة رسوم الطلاب الشهرية">
      <template #actions>
        <UButton
          color="secondary"
          label="أضف تقرير رسوم"
          size="lg"
          icon="heroicons-plus-circle-20-solid"
          class="bg-secondary-600 font-bold hover:cursor-pointer"
          :to="{ name: 'financial-fees-add' }"
        />
      </template>
    </BaseHeader>

    <div class="mt-5">
      <!-- start filters -->
      <div class="mb-5">
        <UForm :state="filters" @submit="applyFilters" class="">
          <div class="grid grid-cols-1 lg:grid-cols-4 gap-2 items-end mb-2">
            <UFormField label="الفصل الدراسي" name="semester_id" size="md">
              <USelect
                class="w-full"
                v-model="filters.semesterFilter"
                :items="
                useGradsStore().semestersData.map((s:Semester) => ({
                label: `${s.year} - ${s.name}`,
                value: s.id,
              }))
            "
                placeholder="اختر الفصل الدراسي"
              />
            </UFormField>
            <UFormField
              label="الشعبة الدراسية"
              name="academic_class_id"
              size="md"
            >
              <USelect
                class="w-full"
                v-model="filters.academicClassFilter"
                :items="[
                  { label: 'اختر الشعبة الدراسية', value: undefined },
                  ...academicClassesStore.classesData.map((c) => ({
                    label: `${c.title} - شعبة ${c.group}`,
                    value: c.id,
                  })),
                ]"
                placeholder="اختر الشعبة الدراسية"
                icon="i-heroicons-presentation-chart-bar"
              />
            </UFormField>
            <UFormField label="التاريخ" name="date" size="md">
              <UInput
                type="date"
                class="w-full"
                v-model="date_string"
                placeholder="اختر التاريخ"
                trailing-icon="i-heroicons-calendar"
              />
            </UFormField>
            <UFormField label="الشهر" name="month_id" size="md">
              <USelect
                class="w-full"
                v-model="filters.monthFilter"
                :items="[
                  { label: 'اختر الشهر', value: undefined },
                  ...months.map((m) => ({
                    label: `${m.label} - ${m.value}`,
                    value: m.value,
                  })),
                ]"
                placeholder="اختر الشهر"
                icon="i-heroicons-calendar"
              />
            </UFormField>
          </div>
          <UButton
            icon="i-lucide-search"
            color="secondary"
            type="submit"
            label="تصفية"
            class="hover:cursor-pointer rounded-sm"
            :loading="isLoading"
          />
        </UForm>
      </div>

      <!-- change pageSize -->
      <UFormField
        label="عدد الصفوف لكل صفحة"
        name="pageSize"
        class="flex items-center gap-2 mb-2"
      >
        <USelect v-model="pageSize" :items="pageCountOptions" id="pageSize" />
      </UFormField>
      <!-- Students table -->
      <BaseTable
        v-model:row-selection="rowSelection"
        v-model:sorting="sorting"
        :loading="feesStore.loading"
        :key="tableKey"
        :ref="table"
        :data="rows"
        :columns="columns"
        :get-dropdown-actions="getDropdownActions"
      >
        <template #actions>
          <div
            v-if="selectedReports.length"
            class="flex flex-wrap justify-end gap-2 items-center"
          >
            <!-- Excel export button -->
            <UButton
              icon="heroicons-document-chart-bar-solid"
              variant="outline"
              color="primary"
              size="xs"
              class="p-2 font-bold text-green-700 h-full"
              @click="exportReports"
            >
              <span>({{ selectedReports.length }})</span>
              <span> Excel </span>
            </UButton>
          </div>
        </template>
      </BaseTable>

      <!-- pagination tools -->
      <div class="flex justify-between items-center mt-4">
        <!-- زر السابق -->
        <UButton
          :disabled="pageNum === 1"
          @click="pageNum--"
          color="secondary"
          class="px-4 py-2 text-white rounded hover:cursor-pointer disabled:bg-gray-300 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
          label="السابق"
        />

        <!-- أرقام الصفحات -->
        <div class="flex gap-2">
          <UButton
            color="secondary"
            :variant="pageNum === p ? 'solid' : 'outline'"
            v-for="p in totalPages"
            :key="p"
            @click="pageNum = p"
            :class="['px-3 py-1 rounded hover:cursor-pointer']"
          >
            {{ p }}
          </UButton>
        </div>

        <!-- زر التالي -->
        <UButton
          :disabled="pageNum >= totalPages"
          @click="pageNum++"
          color="secondary"
          class="px-4 py-2 text-white rounded hover:cursor-pointer disabled:bg-gray-300 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
          label="التالي"
        />
      </div>
    </div>
  </div>
</template>
