<script setup lang="ts">
import type { TableColumn, DropdownMenuItem } from "@nuxt/ui";
import { type Payment } from "~/types";
import { months } from "~/constants";
import { usePaymentsStore } from "@/stores/paymnets";

const paymentsStore = usePaymentsStore();
const { getArabicDayName } = useDateUtils();

const UBadge = resolveComponent("UBadge");
// const table = useTemplateRef("table");
const globalFilter = ref("");
const currentMonthIndex = new Date().getMonth();
const selectedMonth = ref(months[currentMonthIndex]);
const tableKey = ref(Math.random());
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

const filteredPayments = computed(() => {
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
    <div class="w-full grid md:grid-cols-6 gap-3 mt-5">
      <UInput
        icon="i-lucide-search"
        size="lg"
        color="secondary"
        variant="outline"
        v-model="globalFilter"
        placeholder="البحث عن دفعة..."
        class="w-full md:col-span-4"
      />
      <USelect
        v-model="selectedMonth"
        :items="months"
        size="lg"
        color="secondary"
        class="w-full"
      />
    </div>

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
        <span>({{ paymentsStore.paymentsData?.length }})</span>
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
        <span>({{ paymentsStore.paymentsData?.length }})</span>
        <span> Excel </span>
      </UButton>
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
      :data="numberedPayments"
      :columns="columns"
      :get-dropdown-actions="getDropdownActions"
    />
    <!-- <UTable
      :loading="paymentsStore.loading"
      :key="tableKey"
      v-model:global-filter="globalFilter"
      ref="table"
      :data="numberedPayments"
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
