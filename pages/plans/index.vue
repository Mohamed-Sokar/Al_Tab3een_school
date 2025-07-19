<script setup lang="ts">
// definePageMeta({
// middleware: ["check-setup"],
// });
onMounted(() => {
  watch(
    route,
    () => {
      if (route.query.alert) {
        useAppToast().toastError({
          title: decodeURIComponent(route.query.alert as string),
        });
      }
    },
    { immediate: true }
  );
});

useHead({ title: "الخطط الدراسية" });
useSeoMeta({
  title: "الخطط الدراسية",
  description: "إنشاء ومتابعة الخطط الدراسية الشهرية لكل طالب",
  ogTitle: "إدارة الخطط",
  ogDescription: "خطط دراسية مفصلة للقرآن والمناهج",
  ogImage: "/seo/plans.png",
  twitterCard: "summary",
});
import { h, resolveComponent } from "vue";
import type { TableColumn, DropdownMenuItem } from "@nuxt/ui";
import type { Plan } from "~/types";

const UButton = resolveComponent("UButton");
const plansStore = usePlansStore();
const expanded = ref<Record<number, boolean>>({ 1: true });
const route = useRoute();
const queryPlanId =
  route.query.planId !== null && route.query.planId !== undefined
    ? +route.query.planId
    : -1;

const numberedPlans = computed(() =>
  plansStore.plansData.map((plan, index) => {
    return {
      ...plan,
      rowNumber: index + 1,
    };
  })
);

watch(
  route,
  () => {
    expandRow(queryPlanId);
  },
  { immediate: true }
);

const columns: TableColumn<Plan>[] = [
  {
    id: "expand",
    cell: ({ row }) =>
      h(UButton, {
        color: "neutral",
        variant: "ghost",
        icon: "i-lucide-chevron-down",
        square: true,
        "aria-label": "Expand",
        ui: {
          leadingIcon: [
            "transition-transform",
            row.getIsExpanded() ? "duration-200 rotate-180" : "",
          ],
        },
        onClick: () => row.toggleExpanded(),
      }),
  },
  {
    accessorKey: "rowNumber",
    header: "#",
    cell: ({ row }) => row.original.rowNumber,
  },
  {
    accessorKey: "year",
    header: "السنة",
  },
  {
    accessorKey: "semester",
    header: "الفصل الدراسي",
  },
  {
    accessorKey: "stage",
    header: "المرحلة",
  },
  {
    accessorKey: "students_type",
    header: "نوع الطلاب",
  },
  {
    accessorKey: "total_pages",
    header: "عدد الصفحات",
  },
  {
    accessorKey: "months_plans",
    header: "عدد الخطط الشهرية",
    cell: ({ row }) => row.original.months_plans?.length,
  },
  {
    id: "action",
  },
];

function getDropdownActions(plan: Plan): DropdownMenuItem[][] {
  return [
    [
      {
        label: "إضافة خطة شهرية جديدة",
        color: "info",
        icon: "i-heroicons-plus-solid",
        onSelect: () => {
          navigateTo(`/plans/${plan.id}/add_monthly_plan`);
        },
      },
    ],
    [
      {
        label: "تعديل",
        icon: "i-lucide-edit",
        onSelect: () => {
          navigateTo(`/plans/${plan.id}/edit`);
        },
      },
      {
        label: "حذف",
        color: "error",
        icon: "i-lucide-trash",
        onSelect: () => {
          plansStore.deletePlan(plan.id ?? -1);
        },
      },
    ],
  ];
}

const deleteMonthlyPlan = async (
  monthlyPlanId: number,
  generalPlanId: number
) => {
  await plansStore.deleteMonthlyPlan(monthlyPlanId, generalPlanId);
  expandRow(generalPlanId); // ✅ expand the row after deleting
};
const editMonthlyPlan = (monthlyPlanId: number, generalPlanId: number) => {
  navigateTo({
    name: "plans-id-edit_monthly_plan",
    params: { id: monthlyPlanId },
    query: { generalPlanId: generalPlanId },
  });
  console.log("generalPlanId: ", generalPlanId);
  console.log("monthlyPlanId: ", monthlyPlanId);
};
function expandRow(planId: number) {
  expanded.value = { [planId - 1]: true };
}
</script>

<template>
  <div>
    <BaseHeader title="خطط الطلاب" description="إدارة خطط الطلاب الشهرية">
      <template #actions>
        <UButton
          icon="heroicons-plus-circle-20-solid"
          size="lg"
          color="secondary"
          class="bg-blue-600 px-3 py-2 font-bold"
          variant="solid"
          to="/plans/add"
          >إضافة خطة جديدة</UButton
        >
      </template>
    </BaseHeader>

    <UTable
      v-model:expanded="expanded"
      :data="numberedPlans"
      :columns="columns"
      :loading="plansStore.loading"
      :ui="{ tr: 'data-[expanded=true]:bg-elevated/50' }"
      class="flex-1 border mt-10 border-gray-300 dark:border-gray-700 rounded-tr-md rounded-tl-md"
    >
      <template #expanded="{ row }">
        <div
          class="flex items-center justify-center"
          v-if="row.original.months_plans?.length"
        >
          <div
            class="flex flex-col items-center justify-center gap-3 max-w-3xl"
          >
            <div
              class="border border-gray-300 dark:border-gray-700 rounded-tr-lg rounded-tl-lg max-w-3xl md:min-w-2xl lg:min-w-3xl"
            >
              <li
                class="grid grid-cols-4 gap-4 font-bold place-items-center border-b border-gray-300 dark:border-gray-700 p-2"
              >
                <div>الرقم</div>
                <div>الشهر</div>
                <div>عدد الصفحات</div>
                <div>العمليات</div>
              </li>
              <ul class="px-4">
                <li
                  v-for="(month_plan, index) in row.original.months_plans"
                  :key="month_plan.id"
                  class="grid grid-cols-4 gap-4 place-items-center not-last:border-b not-last:border-dashed border-gray-300 dark:border-gray-700 p-2"
                >
                  <div>{{ index + 1 }}</div>
                  <div>
                    {{ month_plan.month }}
                  </div>
                  <div>
                    {{ month_plan.pages }}
                  </div>
                  <div class="flex gap-2 items-center">
                    <UButton
                      icon="i-lucide-trash"
                      color="error"
                      variant="soft"
                      size="xs"
                      class="hover:cursor-pointer"
                      @click="
                        deleteMonthlyPlan(
                          month_plan.id ?? 0,
                          row.original.id ?? 0
                        )
                      "
                      :loading="plansStore.loading"
                    />
                    <UButton
                      icon="i-lucide-edit"
                      color="neutral"
                      variant="soft"
                      size="xs"
                      class="hover:cursor-pointer"
                      @click="
                        editMonthlyPlan(
                          month_plan.id ?? 0,
                          row.original.id ?? 0
                        )
                      "
                    />
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div v-else class="flex justify-center items-center">
          لا يوجد خطط شهرية مضافة
        </div>
      </template>
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
