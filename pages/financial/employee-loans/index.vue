<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import type { TableColumn, DropdownMenuItem } from "@nuxt/ui";
import type {
  EmployeeLoan,
  EmployeeSalaryReport,
  Semester,
  Filters,
} from "~/types";
import { months } from "~/constants";

// SEO
useHead({ title: "تقارير سلف المدرسين" });

// init
const loansStore = useLoansStore();
const { exportToExcel } = useExportToExcel();
const { getArabicDayName, getDate } = useDateUtils();

// state
const isLoading = ref(false);
const pageCountOptions = [1, 2, 5, 10, 20, 50];
const table = ref();
const rowSelection = ref({});
const pageNum = ref(1);
const pageSize = ref(5);
const tableKey = ref(Math.random());
const filters = reactive<Filters>({
  monthFilter: undefined,
  semesterFilter: undefined,
  statusFilter: undefined,
  dateFilter: undefined,
});
const sorting = ref([
  {
    id: "id",
    desc: false,
  },
]);
const UButton = resolveComponent("UButton");
const UBadge = resolveComponent("UBadge");
const columns: TableColumn<EmployeeLoan>[] = [
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
        report?.employee?.first_name,
        report?.employee?.second_name,
        report?.employee?.third_name,
        report?.employee?.last_name,
      ]
        .filter(Boolean)
        .join(" ");
    },
  },
  // {
  //   accessorKey: "identity_number",
  //   header: "هوية الموظف",
  //   cell: ({ row }) => row.original?.employee?.identity_number || "غير متوفر",
  // },
  {
    accessorKey: "يوم السلفة",
    header: "اليوم",
    cell: ({ row }) => {
      const day = getArabicDayName(String(row.original.created_at));
      return day;
    },
  },
  {
    accessorKey: "قيمة السلفة",
    header: "قيمة السلفة",
    cell: ({ row }) => row.original.amount,
  },
  {
    accessorKey: "تاريخ الاستلاف",
    header: "تاريخ الاستلاف",
    cell: ({ row }) => {
      const day = getDate(String(row.original.created_at));
      return day;
    },
  },
  {
    accessorKey: "تاريخ الاسترداد",
    header: "تاريخ الاسترداد",
    cell: ({ row }) => {
      if (!row.original.updated_at) {
        return "لم تسترد";
      }
      const day = getDate(row.original.updated_at);
      return day;
    },
  },
  {
    accessorKey: "status",
    header: "الحالة",
    cell: ({ row }) => {
      const status = row.original.status ?? "غير مدفوع";
      const color = {
        مدفوع: "success",
        "غير مدفوع": "error",
      }[status];

      return h(
        UBadge,
        {
          class: `capitalize hover:cursor-pointer hover:outline`,
          color,
        },
        () => status
      );
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
        () => row.original.notes
      );
    },
  },
  {
    id: "action",
  },
];

// Actions
const fetchReports = async (forceRefresh: boolean = false) => {
  isLoading.value = true;
  // await loansStore.getReportsCount(filters);
  await loansStore.fetchReports(
    pageNum.value,
    pageSize.value,
    filters,
    forceRefresh
  );
  isLoading.value = false;
};
const deleteReport = async (reportId: number) => {
  if (!confirm("هل أنت متأكد من حذف هذا التقرير؟")) return;
  isLoading.value = true;
  await loansStore.deleteReport(reportId);
  isLoading.value = false;
};
function getDropdownActions(report: EmployeeSalaryReport): DropdownMenuItem[] {
  return [
    {
      label: "تعديل",
      icon: "i-lucide-edit",
      onSelect: () => {
        navigateTo({
          name: "financial-employee-loans-id-edit",
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
const exportReports = () => {
  exportToExcel({
    data: selectedReports.value.map((report, i) => ({
      الرقم: i + 1,
      "الاسم الكامل": [
        report?.employee?.first_name,
        report?.employee?.second_name,
        report?.employee?.third_name,
        report?.employee?.last_name,
      ]
        .filter(Boolean)
        .join(" "),
      "رقم الهوية": report.employee?.identity_number,
      اليوم: getArabicDayName(report.created_at ?? ""),
      الشهر: report.month?.name,
      "قيمة السلفة": report.amount,
      "تاريخ الاستلاف": getDate(report.created_at ?? ""),
      "تاريخ الاسترداد": getDate(report.updated_at ?? "لم يتم استردادها"),
      الحالة: report.status,
      الملاحظات: report.notes,
    })),
    sheetName: `سلف تاريخ ${filters.dateFilter || "كل التواريخ"} - شهر (${
      months.find((m) => filters.monthFilter === m.value)?.label || "كل الأشهر"
    })`,
    fileName: `تقرير سلف تاريخ ${filters.dateFilter || "كل التواريخ"} - شهر (${
      months.find((m) => filters.monthFilter === m.value)?.label || "كل الأشهر"
    })`,
  });
};
// refetch reports when filtering
const applyFilters = async () => {
  console.log("filters", filters);
  // await loansStore.getReportsCount(filters);
  await fetchReports(true);
  pageNum.value = 1;
};
const updateRows = async () => {
  await loansStore.fetchReports(pageNum.value, pageSize.value, filters);
};

// Computed properties
const numberedReports = computed(() =>
  loansStore.reportsData.map((report, index) => {
    return {
      ...report,
      rowNumber: index + 1,
    };
  })
);
// pagination rows
const rows = computed(() => {
  const start = (pageNum.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return numberedReports.value.slice(start, end);
});
const totalPages = computed(() => {
  return Math.ceil(
    loansStore.reportsCountData > 0
      ? Math.ceil(loansStore.reportsCountData / pageSize.value)
      : 1
  );
});
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

// watch
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
  await Promise.all([useGradsStore().fetchSemesters()]);
});
</script>

<template>
  <div>
    <!-- start base header -->
    <BaseHeader title="سلف العاملين" description="إدارة سلف العاملين" />

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
            <UFormField label="تاريخ السلفة" name="date" size="md">
              <UInput
                type="date"
                class="w-full"
                v-model="date_string"
                placeholder="اختر التاريخ"
                trailing-icon="i-heroicons-calendar"
              />
            </UFormField>
            <UFormField label="الحالة" name="status" size="md">
              <USelect
                class="w-full"
                v-model="filters.statusFilter"
                :items="[
                  { label: 'اختر الحالة', value: undefined },
                  { label: 'مدفوع', value: 'مدفوع' },
                  { label: 'غير مدفوع', value: 'غير مدفوع' },
                ]"
                placeholder="اختر الحالة"
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
      <!-- employees table -->
      <BaseTable
        v-model:row-selection="rowSelection"
        v-model:sorting="sorting"
        :loading="loansStore.loading"
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
        <!-- prev button -->
        <UButton
          :disabled="pageNum === 1"
          @click="pageNum--"
          color="secondary"
          class="px-4 py-2 text-white rounded hover:cursor-pointer disabled:bg-gray-300 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
          label="السابق"
        />

        <!-- page numbers -->
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

        <!-- next button -->
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
