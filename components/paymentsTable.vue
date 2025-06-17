<script setup lang="ts">
import type { TableColumn, DropdownMenuItem } from "@nuxt/ui";
import { type Payment } from "~/types";
import { months } from "~/constants";
import { usePaymentsStore } from "@/stores/paymnets";

const { paymentsData, deletePayment } = usePaymentsStore();

const UBadge = resolveComponent("UBadge");
// const table = useTemplateRef("table");
const globalFilter = ref("");
const isLoading = ref(false);
const tableKey = ref(Math.random());
const currentMonthIndex = new Date().getMonth();
const selectedMonth = ref(months[currentMonthIndex]);
const selectedDate = ref(new Date().toISOString().split("T")[0]);

const columns: TableColumn<Payment>[] = [
  {
    accessorKey: "rowNumber",
    header: "الرقم",
  },
  {
    accessorKey: "type",
    header: "نوع الدفعة",
    cell: ({ row }) => {
      const status = row.original.type ?? "دخل";

      const color = {
        دخل: "success" as const,
        مصروف: "error" as const,
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
        // console.log("Edit action for user:", student);
        navigateTo(`/payments/${payment.id}/edit_payment`);
      },
    },
    {
      label: "Delete",
      icon: "i-lucide-trash",
      color: "error",
      onSelect: () => {
        deletePayment(payment.id ?? 0);
      },
    },
  ];
}

const filteredPayments = computed(() => {
  tableKey.value = Math.random();
  return paymentsData.value.filter(
    (payment) =>
      // payment.date === selectedDate.value &&
      new Date(payment.date ?? new Date()).getMonth() ===
      months.indexOf(selectedMonth.value)
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
    if (payment.type === "دخل") {
      return (sum += payment.amount);
    } else {
      return (sum -= payment.amount ?? 0);
    }
  }, 0)
);

//   paymentsData.value.splice(studentIndex, 1);
//   tableKey.value = Math.random();
// };
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
      <UInput
        v-model="selectedDate"
        type="date"
        size="lg"
        color="secondary"
        class="w-full"
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
        <span>({{ paymentsData.length }})</span>
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
        <span>({{ paymentsData.length }})</span>
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
    <UTable
      :loading="isLoading"
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
    </UTable>
  </div>
</template>
