<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useStudentStore } from "@/stores/students";
import { useAcademicClassesStore } from "@/stores/academic_classes";
import type { TableColumn, DropdownMenuItem } from "@nuxt/ui";
import { usePlansStore } from "@/stores/plans";
import type {
  QuranAchievementReport,
  StudentQuranAcheivementReportFilters,
} from "~/types";

// SEO
useHead({ title: "تقارير إنجاز القرآن" });

// init
const studentsStore = useStudentStore();
const academicClassesStore = useAcademicClassesStore();
const quranAchievementReportsStore = useQuranAcheivementReport();
const plansStore = usePlansStore();
const client = useSupabaseClient();
const { exportToExcel } = useExportToExcel();
const { toastError, toastSuccess } = useAppToast();

// state
const filters = reactive<StudentQuranAcheivementReportFilters>({
  academicClassFilter: undefined,
  monthlyPlanFilter: undefined,
});
const isLoading = ref(false);
const pageCountOptions = [1, 2, 5, 10, 20, 50];
const table = ref();
const pageNum = ref(1);
const pageSize = ref(5);
const UButton = resolveComponent("UButton");
const UBadge = resolveComponent("UBadge");
const rowSelection = ref({});
const sorting = ref([
  {
    id: "id",
    desc: false,
  },
]);
const columns: TableColumn<QuranAchievementReport>[] = [
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
    accessorKey: "monthly_plan",
    header: "الخطة الشهرية",
    cell: ({ row }) =>
      row.original.monthly_plan
        ? `(${row.original.monthly_plan.month} - ${row.original.monthly_plan.plan.year}) - (${row.original.monthly_plan.plan.stage} - ${row.original.monthly_plan.plan.students_type})`
        : "غير متوفر",
  },
  {
    accessorKey: "required_pages",
    header: "الصفحات المطلوبة",
    cell: ({ row }) => `${row.original.monthly_plan?.pages}`,
  },
  {
    accessorKey: "achieved_pages",
    header: "الصفحات المنجزة",
    cell: ({ row }) => `${row.original.achieved_pages}`,
  },
  {
    accessorKey: "status",
    header: "الحالة",
    cell: ({ row }) => {
      const status = row.original.status ?? "غير مكتمل";
      const color = {
        مكتمل: "success",
        "غير مكتمل": "error",
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
    id: "action",
  },
];

// Actions
const fetchReports = async (forceRefresh: boolean = false) => {
  isLoading.value = true;
  await quranAchievementReportsStore.getReportsCount(filters);
  await quranAchievementReportsStore.fetchReports(
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
  try {
    const { error } = await client
      .from("students_quran_achievement_reports")
      .delete()
      .eq("id", reportId);

    if (error) {
      throw new Error(error.message);
    }

    toastSuccess({ title: "تم حذف التقرير بنجاح" });
    await fetchReports(); // إعادة جلب التقارير بعد الحذف
  } catch (err) {
    toastError({
      title: "خطأ في حذف التقرير",
      description: (err as Error).message || "حدث خطأ غير متوقع",
    });
  } finally {
    isLoading.value = false;
  }
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
      "الخطة الشهرية": report.monthly_plan
        ? `(${report.monthly_plan.month} - ${report.monthly_plan.plan.year}) - (${report.monthly_plan.plan.stage} - ${report.monthly_plan.plan.students_type})`
        : "غير متوفر",

      "الصفحات المطلوبة": report.monthly_plan?.pages,
      "الصفحات المنجزة": report.achieved_pages,
      الحالة: report.status,
    })),
    fileName: "التقارير القرآنية الشهرية",
    sheetName: "التقارير القرآنية",
  });
};
const applyFilters = async () => {
  await quranAchievementReportsStore.getReportsCount(filters);
  await fetchReports(true);
  pageNum.value = 1;
};
const updateRows = async () => {
  await quranAchievementReportsStore.fetchReports(
    pageNum.value,
    pageSize.value,
    filters
  );
};
function getDropdownActions(
  report: QuranAchievementReport
): DropdownMenuItem[] {
  return [
    {
      label: "تعديل",
      icon: "i-lucide-edit",
      onSelect: () => {
        navigateTo(`/quran-achievement-reports/${report.id}/edit`);
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

// computed
const numberedReports = computed(() =>
  quranAchievementReportsStore.reportsData.map((report, index) => {
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
    quranAchievementReportsStore.reportsCountData > 0
      ? Math.ceil(
          quranAchievementReportsStore.reportsCountData / pageSize.value
        )
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

onMounted(async () => {
  await Promise.all([
    academicClassesStore.fetchClasses(),
    plansStore.fetchMonthsPlans(),
    // quranAchievementReportsStore.fetchReports(
    //   pageNum.value,
    //   pageSize.value,
    //   filters
    // ),
  ]);
});

// watches
watch(pageSize, () => {
  pageNum.value = 1;
});
// reset rowSelection when pageNum is changed
watch(pageNum, async () => {
  updateRows();
  rowSelection.value = {}; // reset selection when update pageNum
});
</script>

<template>
  <div>
    <!-- start base header -->
    <BaseHeader
      title="تقارير إنجاز القرآن"
      description="إدارة إنجاز الطلاب القرآني الشهريي"
    >
      <template #actions>
        <UButton
          color="secondary"
          label="أضف تقرير إنجاز قرآن"
          size="lg"
          icon="heroicons-plus-circle-20-solid"
          class="bg-secondary-600 font-bold hover:cursor-pointer"
          :to="{ name: 'quran-achievement-reports-add' }"
        />
      </template>
    </BaseHeader>

    <div class="mt-5">
      <!-- filters -->
      <div class="mb-5">
        <UForm
          :state="filters"
          @submit="applyFilters"
          class="flex gap-2 flex-col justify-between"
        >
          <div class="w-full grid grid-cols-1 lg:grid-cols-2 gap-2">
            <UFormField
              label="الشعبة الدراسية"
              name="academic_class_id"
              size="md"
            >
              <USelect
                v-model="filters.academicClassFilter"
                :items="[
                  { label: 'جميع الشعب', value: undefined },
                  ...academicClassesStore.classesData.map((c) => ({
                    label: `${c.title} - شعبة ${c.group}`,
                    value: c.id,
                  })),
                ]"
                placeholder="اختر الشعبة الدراسية"
                icon="i-heroicons-presentation-chart-bar"
                class="w-full"
              />
            </UFormField>
            <UFormField label="الخطة الشهرية" name="monthly_plan_id" size="md">
              <USelect
                v-model="filters.monthlyPlanFilter"
                :items="[
                  { label: 'جميع الخطط', value: undefined },
                  ...plansStore.monthsPlansData.map((mp) => ({
                    label: `(${mp.month} - ${mp.plan.year}) - (${mp.plan.stage} - ${mp.plan.students_type} - ${mp.plan.semester})`,
                    value: mp.id,
                  })),
                ]"
                placeholder="اختر الخطة الشهرية"
                icon="i-heroicons-calendar"
                class="w-full"
              />
            </UFormField>
          </div>
          <UButton
            icon="i-lucide-search"
            color="secondary"
            type="submit"
            label="تصفية"
            class="hover:cursor-pointer rounded-sm mt-2 lg:mt-0 w-fit"
            :loading="isLoading"
          />
        </UForm>
      </div>
      <div>
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
          :loading="quranAchievementReportsStore.loading"
          :key="studentsStore.tableKey"
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
  </div>
</template>
