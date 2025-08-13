<script setup lang="ts">
import { h, resolveComponent } from "vue";
import type { TableColumn, DropdownMenuItem } from "@nuxt/ui";
import type { Filters, Level, MonthlyPlan, Plan, Semester } from "~/types";
import { object, number, string } from "yup";

// SEO
useHead({ title: "الخطط الدراسية" });
useSeoMeta({
  title: "الخطط الدراسية",
  description: "إنشاء ومتابعة الخطط الدراسية الشهرية لكل طالب",
  ogTitle: "إدارة الخطط",
  ogDescription: "خطط دراسية مفصلة للقرآن والمناهج",
  ogImage: "/seo/plans.png",
  twitterCard: "summary",
});

// init
const UButton = resolveComponent("UButton");
const plansStore = usePlansStore();
const route = useRoute();
const gradsReportsStore = useGradsStore();

// data
const schema = object({
  semesterFilter: number().nullable(),
  levelFilter: number().nullable(),
  studentsTypeFilter: string().nullable(),
});
const queryPlanId =
  route.query.planId !== null && route.query.planId !== undefined
    ? +route.query.planId
    : -1;
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
    accessorKey: "semester",
    header: "الفصل الدراسي",
    cell: ({ row }) =>
      row.original?.semester?.name + " - " + row.original?.semester?.year,
  },
  {
    accessorKey: "level",
    header: "المرحلة",
    cell: ({ row }) => row?.original?.level?.title,
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

// state
const filters = reactive<Filters>({
  semesterFilter: undefined,
  studentsTypeFilter: undefined,
  levelFilter: undefined,
});
const expanded = ref<Record<number, boolean>>({ 0: true });

// Actions
function getDropdownActions(plan: Plan): DropdownMenuItem[][] {
  return [
    [
      {
        label: "إضافة خطة شهرية جديدة",
        color: "info",
        icon: "i-heroicons-plus-solid",
        onSelect: () => {
          navigateTo({
            name: "plans-id-add_monthly_plan",
            params: { id: plan.id },
          });
        },
      },
    ],
    [
      {
        label: "تعديل",
        icon: "i-lucide-edit",
        onSelect: () => {
          navigateTo({ name: "plans-id-edit", query: { id: plan.id } });
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
function expandRow(planId: number = -1) {
  if (planId === -1) {
    expanded.value = {};
    return;
  }

  // البحث عن الصف الذي يحتوي على planId
  const rowIndex = numberedPlans.value.findIndex((plan) => plan.id === planId);
  if (rowIndex !== -1) {
    expanded.value = { [rowIndex]: true };
  } else {
    expanded.value = {};
  }
}
const search = async () => {
  await plansStore.fetchPlans(filters, true);
  expandRow(-1);
};

// Computed
const numberedPlans = computed(() =>
  plansStore.plansData.map((plan, index) => {
    return {
      ...plan,
      rowNumber: index + 1,
    };
  })
);

// watch
watch(
  route,
  async () => {
    if (queryPlanId !== -1) {
      // التأكد من تحميل البيانات قبل التوسيع
      // await plansStore.fetchPlans(filters, true);
      expandRow(Number(queryPlanId));
    }
    expandRow(-1);
  },
  { immediate: true }
);

// onMounted(() => {
//   watch(
//     route,
//     () => {
//       if (route.query.alert) {
//         useAppToast().toastError({
//           title: decodeURIComponent(route.query.alert as string),
//         });
//       }
//     },
//     { immediate: true }
//   );
// });
const sortedMonthPlans = (monthPlans: MonthlyPlan[]) => {
  return monthPlans.sort((a, b) => {
    return (a.month_id ?? 0) - (b.month_id ?? 0);
  });
};
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

    <!-- Start filters -->
    <UForm :schema="schema" :state="filters" class="space-y-4" @submit="search">
      <div class="w-full grid md:grid-cols-2 xl:grid-cols-3 gap-3 my-5">
        <UFormField label="الفصل الدراسي" name="semesterFilter" size="md">
          <USelect
            class="w-full"
            v-model="filters.semesterFilter"
            :items="
                [{ label: 'اختر الفصل الدراسي', value: undefined },
                ...gradsReportsStore.semestersData.map((s:Semester) => ({
                label: `${s.year} - ${s.name}`,
                value: s.id,
              }))]
            "
            placeholder="اختر الفصل الدراسي"
          />
        </UFormField>
        <UFormField label="المرحلة الدراسية" name="levelFilter" size="md">
          <USelect
            class="w-full"
            v-model="filters.levelFilter"
            :items="[{ label: 'اختر المرحلة الدراسية', value: null }
              ,...useLevelsStore().levelsData.map((s:Level) => ({
                label: s.title,
                value: s.id,
              }))]
            "
            placeholder="اختر المرحلة الدراسية"
          />
        </UFormField>
        <UFormField label="نوع الطلاب" name="studentsTypeFilter" size="md">
          <USelect
            class="w-full"
            v-model="filters.studentsTypeFilter"
            :items="[
              { label: 'اختر نوع الطلاب', value: null },
              { label: 'طلاب قدامى', value: 'طلاب قدامى' },
              { label: 'طلاب جدد', value: 'طلاب جدد' },
            ]"
            placeholder="اختر نوع الطلاب"
          />
        </UFormField>
      </div>
      <div class="flex gap-3 items-center">
        <UButton
          type="submit"
          label="بحث"
          icon="i-lucide-search"
          color="secondary"
          :loading="plansStore.loading"
          class="flex rounded-sm hover:cursor-pointer font-bold"
        />
      </div>
    </UForm>

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
                  v-for="(month_plan, index) in sortedMonthPlans(
                    row.original.months_plans
                  )"
                  :key="month_plan.id"
                  class="grid grid-cols-4 gap-4 place-items-center not-last:border-b not-last:border-dashed border-gray-300 dark:border-gray-700 p-2"
                >
                  <div>{{ index + 1 }}</div>
                  <div>
                    {{ month_plan?.month?.name }} - {{ month_plan?.month?.id }}
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
