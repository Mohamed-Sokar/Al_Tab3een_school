<script setup lang="ts">
import type { TableColumn, DropdownMenuItem } from "@nuxt/ui";
import { type Payment } from "~/types";
import { months } from "~/constants";
import { usePaymentsStore } from "@/stores/paymnets";

const paymentsStore = usePaymentsStore();
const { exportToExcel } = useExportToExcel();
const { getArabicDayName, getDate } = useDateUtils();

const UBadge = resolveComponent("UBadge");
// const table = useTemplateRef("table");
const globalFilter = ref("");
const currentMonthIndex = new Date().getMonth();
const selectedMonth = ref(months[currentMonthIndex]);
const tableKey = ref(Math.random());
const rowSelection = ref({});
// const selectedDate = ref(new Date().toISOString().split("T")[0]);

watch(selectedMonth, () => (tableKey.value = Math.random()));

const columns: TableColumn<Payment>[] = [
  {
    accessorKey: "rowNumber",
    header: "الرقم",
  },
  {
    accessorKey: "type",
    header: "نوع الدفعة",
    cell: ({ row }) => {
      const status = row.original.type ?? "وارد";

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
    accessorKey: "date",
    header: "اليوم",
    cell: ({ row }) => {
      const day = getArabicDayName(String(row.original.date));
      return day;
    },
  },
  {
    accessorKey: "date",
    header: "تاريخ الدفعة",
  },
  {
    accessorKey: "description",
    header: "وصف الدفعة",
  },
  {
    accessorKey: "amount",
    header: "القيمة",
  },
  {
    id: "action",
  },
];

function getDropdownActions(payment: Payment): DropdownMenuItem[] {
  return [
    {
      label: "Edit",
      icon: "i-lucide-edit",
      onSelect: () => {
        navigateTo(`/payments/${payment.id}/edit_payment`);
      },
    },
    {
      label: "Delete",
      icon: "i-lucide-trash",
      color: "error",
      onSelect: () => {
        paymentsStore.deletePayment(payment.id ?? 0);
      },
    },
  ];
}

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

// Computed
const filteredPayments = computed(() => {
  if (selectedMonth.value === "كل الأشهر") return paymentsStore.sortedPayment;
  // tableKey.value = Math.random();
  return paymentsStore.sortedPayment.filter((payment) =>
    // payment.date === selectedDate.value &&
    {
      return (
        new Date(payment.date ?? new Date()).getMonth() ===
        months.indexOf(selectedMonth.value)
      );
    }
  );
});
const numberedPayments = computed(() =>
  filteredPayments.value.map((payment, index) => ({
    ...payment,
    rowNumber: index + 1,
  }))
);
const selectedReports = computed(() =>
  Object.keys(rowSelection.value).map((index) => numberedPayments.value[+index])
);
const total = computed(() =>
  numberedPayments.value.reduce((sum: any, payment: Payment) => {
    if (payment.type === "وارد") {
      return (sum += payment.amount);
    } else {
      return (sum -= payment.amount ?? 0);
    }
  }, 0)
);
</script>

<template>
  <div>
    <!-- Start Filters -->
    <div class="my-10 gap-2 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
      <UInput
        icon="i-lucide-search"
        size="lg"
        color="secondary"
        variant="outline"
        v-model="globalFilter"
        placeholder="البحث عن دفعة..."
        class="md:col-span-2 lg:col-span-3"
      />
      <USelect
        v-model="selectedMonth"
        :items="months"
        size="lg"
        color="secondary"
        class="w-full"
      />
    </div>

    <div class="flex items-center gap-4 mb-5">
      <div>مجموع الصادر والوارد:</div>
      <div
        class="font-bold text-2xl"
        :class="{
          'text-black dark:text-white font-normal': total === 0,
          'text-success': total > 0,
          'text-error': total < 0,
        }"
      >
        <UBadge
          :color="total >= 0 ? 'success' : 'error'"
          size="xl"
          class="font-bold"
        >
          {{ total }}
        </UBadge>
      </div>
    </div>

    <!-- Start Table -->
    <BaseTable
      :loading="paymentsStore.loading"
      :key="tableKey"
      v-model:global-filter="globalFilter"
      v-model:row-selection="rowSelection"
      :data="numberedPayments"
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
  </div>
</template>
