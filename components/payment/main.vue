<script setup lang="ts">
import type { TableColumn, DropdownMenuItem } from "@nuxt/ui";
import { type Payment } from "~/types";
import { invoiceTypes, months } from "~/constants";
import { usePaymentsStore } from "@/stores/paymnets";

// init
const paymentsStore = usePaymentsStore();
const { exportToExcel } = useExportToExcel();
const { getArabicDayName, getDate } = useDateUtils();
const UBadge = resolveComponent("UBadge");
const columns: TableColumn<Payment>[] = [
  {
    accessorKey: "rowNumber",
    header: "الرقم",
  },
  {
    accessorKey: "type",
    header: "نوع الدفعة",
    cell: ({ row }) => {
      const status = row.original.type_id === 1 ? "صادر" : "وارد";

      const color = {
        وارد: "success" as const,
        صادر: "error" as const,
      }[status];

      return h(
        UBadge,
        { class: "capitalize", variant: "subtle", color },
        () => status
      );
    },
  },
  {
    accessorKey: "اليوم",
    header: "اليوم",
    cell: ({ row }) => {
      const day = getArabicDayName(String(row.original.created_at));
      return day;
    },
  },
  {
    accessorKey: "تاريخ الدفعة",
    header: "تاريخ الدفعة",
    cell: ({ row }) => {
      const day = getDate(String(row.original.created_at));
      return day;
    },
  },
  {
    accessorKey: "description",
    header: "وصف الدفعة",
  },
  {
    accessorKey: "amount",
    header: "القيمة",
    cell: ({ row }) => row.original.amount + " ₪ ",
  },
  {
    id: "action",
  },
];
function getDropdownActions(report: Payment): DropdownMenuItem[] {
  return [
    {
      label: "تعديل",
      icon: "i-lucide-edit",
      onSelect: () => {
        navigateTo({
          name: "financial-payments-id-edit",
          params: { id: report.id },
        });
      },
    },
    {
      label: "حذف",
      icon: "i-lucide-trash",
      color: "error",
      onSelect: () => {
        paymentsStore.deletePayment(report.id ?? 0);
      },
    },
  ];
}

// State
const globalFilter = ref("");
const tableKey = ref(Math.random());
const pageCountOptions = [1, 2, 5, 10, 20, 50];
const pageNum = ref(1);
const pageSize = ref(2);
const rowSelection = ref({});
const filters = reactive({
  monthFilter: undefined,
  invoiceTypeFilter: undefined,
});

// Actions
const exportReports = () => {
  exportToExcel({
    data: selectedReports.value.map((report, i) => ({
      الرقم: i + 1,
      "نوع الدفعة": report.type,
      "رقم الوصل": report.invoice_number,
      اليوم: getArabicDayName(report.date ?? ""),
      التاريخ: getDate(report.date ?? ""),
      القيمة: report.amount,
      الوصف: report.description,
    })),
    fileName: "تقارير الغياب",
    sheetName: "تقارير الغياب",
  });
};
const fetchReports = async (forceRefresh: boolean = false) => {
  await paymentsStore.getReportsCount(filters);
  await paymentsStore.fetchReports(
    pageNum.value,
    pageSize.value,
    filters,
    forceRefresh
  );
  await paymentsStore.fetchPaymentSums(filters);
  console.log("paymentSumsData: ", paymentsStore.paymentSumsData);
};
// refetch reports when filtering
const applyFilters = async () => {
  await paymentsStore.getReportsCount(filters);
  await fetchReports(true);
  pageNum.value = 1;
};
const updateRows = async () => {
  await paymentsStore.fetchReports(pageNum.value, pageSize.value, filters);
};

// Computed
const filteredPayments = computed(() => {
  // if (selectedMonth.value === "كل الأشهر") return paymentsStore.sortedPayment;
  return paymentsStore.sortedReports;
  // tableKey.value = Math.random();
  // return paymentsStore.sortedPayment.filter((payment) =>
  //   // payment.date === selectedDate.value &&
  //   {
  //     return (
  //       new Date(payment.date ?? new Date()).getMonth() ===
  //       months.indexOf(selectedMonth.value)
  //     );
  //   }
  // );
});
const numberedReports = computed(() =>
  filteredPayments.value.map((payment, index) => ({
    ...payment,
    rowNumber: index + 1,
  }))
);
const selectedReports = computed(() =>
  Object.keys(rowSelection.value).map((index) => numberedReports.value[+index])
);
const rows = computed(() => {
  const start = (pageNum.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  console.log("rows; ", numberedReports.value.slice(start, end));
  return numberedReports.value.slice(start, end);
});
const totalPages = computed(() => {
  return Math.ceil(
    paymentsStore.reportsCountData > 0
      ? Math.ceil(paymentsStore.reportsCountData / pageSize.value)
      : 1
  );
});

// Watches
watch(pageSize, () => {
  pageNum.value = 1;
  console.log(totalPages.value);
});
// reset rowSelection when pageNum is changed
watch(pageNum, async () => {
  updateRows();
  rowSelection.value = {}; // reset selections
});
</script>

<template>
  <div>
    <UForm
      :state="filters"
      @submit="applyFilters"
      class="flex gap-2 flex-col justify-between items-start lg:items-start mb-5 mt-5"
    >
      <div class="w-full grid grid-cols-1 lg:grid-cols-2 gap-2 mb-5">
        <UFormField label="الشهر" name="monthFilter" size="md">
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
        <UFormField label="نوع الدفعات" name="invoiceTypeFilter" size="md">
          <USelect
            class="w-full"
            v-model="filters.invoiceTypeFilter"
            :items="[
              { label: 'اختر نوع الدفعات', value: undefined },
              ...invoiceTypes.map((m) => ({
                label: `${m.label}`,
                value: m.value,
              })),
            ]"
            placeholder="اختر نوع الدفعات"
            icon="i-lucide-credit-card"
          />
        </UFormField>
      </div>
      <UButton
        icon="i-lucide-search"
        color="secondary"
        type="submit"
        label="بحث"
        class="hover:cursor-pointer rounded-sm"
        :loading="paymentsStore.loading"
      />
    </UForm>

    <div
      class="flex flex-wrap items-center gap-4 mb-5"
      v-if="!paymentsStore.loading"
    >
      <div
        class="p-3 w-full md:w-fit bg-secondary/15 rounded-md flex justify-between items-center gap-3"
        v-if="paymentsStore.reportsCountData"
      >
        <span class="font-bold">مجموع التقارير</span>
        <UBadge color="secondary" size="lg" class="font-bold">
          {{ paymentsStore.reportsCountData ?? 0 }} تقرير
        </UBadge>
      </div>
      <div
        class="p-3 w-full md:w-fit bg-secondary/15 rounded-md flex justify-between gap-3"
        v-if="paymentsStore.totalExpense"
      >
        <span class="font-bold">مجموع الصادرات</span>
        <UBadge color="secondary" size="lg" class="font-bold">
          {{ paymentsStore.totalExpense ?? 0 }} ₪
        </UBadge>
      </div>
      <div
        class="p-3 w-full md:w-fit bg-secondary/15 rounded-md flex justify-between gap-3"
        v-if="paymentsStore.totalIncome"
      >
        <span class="font-bold">مجموع الإيرادات</span>
        <UBadge color="secondary" size="lg" class="font-bold">
          {{ paymentsStore.totalIncome ?? 0 }} ₪
        </UBadge>
      </div>
      <div
        class="p-3 w-full md:w-fit bg-error/15 rounded-md flex justify-between gap-3"
        :class="
          paymentsStore.netDifference < 0 ? 'bg-error/15' : 'bg-success/15'
        "
        v-if="paymentsStore.totalExpense && paymentsStore.totalIncome"
      >
        <span class="font-bold">الصافي</span>
        <UBadge
          :color="paymentsStore.netDifference < 0 ? 'error' : 'success'"
          size="lg"
          class="font-bold"
        >
          {{ paymentsStore.netDifference ?? 0 }} ₪
        </UBadge>
      </div>
    </div>
    <div class="flex gap-3 mb-5" v-else>
      <USkeleton class="w-full h-10" v-for="i in 3" :key="i" />
    </div>

    <!-- change pageSize -->
    <UFormField
      label="عدد الصفوف لكل صفحة"
      name="pageSize"
      class="flex items-center gap-2 mb-2"
    >
      <USelect v-model="pageSize" :items="pageCountOptions" id="pageSize" />
    </UFormField>
    <!-- Start Table -->
    <BaseTable
      :loading="paymentsStore.loading"
      :key="tableKey"
      v-model:global-filter="globalFilter"
      v-model:row-selection="rowSelection"
      :data="rows"
      :columns="columns"
      :get-dropdown-actions="getDropdownActions"
    >
      <template #actions>
        <div
          v-if="selectedReports.length"
          class="flex flex-wrap justify-end gap-2 items-center"
        >
          <UButton
            icon="heroicons-document-chart-bar-solid"
            variant="outline"
            color="primary"
            size="sm"
            class="p-2 font-bold text-green-700"
            @click="exportReports"
          >
            <span>تصدير</span>
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
</template>
