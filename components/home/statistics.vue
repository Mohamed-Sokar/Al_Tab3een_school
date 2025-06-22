<script setup lang="ts">
import { usePaymentsStore } from "@/stores/paymnets";
import { useLevelsStore } from "@/stores/levels";

const { totalIncome, totalExpense } = usePaymentsStore();
const { levelStudentsCount } = useLevelsStore();

const colorMode = useColorMode();

const RevenueData = [
  { level: "الصف السادس", mount: levelStudentsCount("الصف السادس") },
  { level: "الصف السابع", mount: levelStudentsCount("الصف السابع") },
  { level: "الصف الثامن", mount: levelStudentsCount("الصف الثامن") },
  { level: "الصف التاسع", mount: levelStudentsCount("الصف التاسع") },
];
const DonutData = [
  {
    color: "#ff0000",
    name: "الصادر",
    value: totalExpense(),
  },
  {
    color: "#22c55e",
    name: "الوارد",
    value: totalIncome(),
  },
];

// const DonutData2 = [
//   {
//     color: "#3b82f6",
//     name: "Blue",
//     value: 50,
//   },
//   {
//     color: "#a855f7",
//     name: "Gray",
//     value: 20,
//   },
//   {
//     color: "#22c55e",
//     name: "Green",
//     value: 30,
//   },
// ];
const RevenueCategories = computed(() => ({
  mount: {
    name: "عدد الطلاب",
    color: "#267afd",
  },
}));

const xFormatter = (i: number): string => `${RevenueData[i]?.level}`;
const yFormatter = (i: number) => `${i}`;
</script>

<template>
  <div class="grid lg:grid-cols-2 gap-5">
    <UCard class="h-full flex justify-center items-center">
      <DonutChart
        :data="DonutData.map((i) => i.value)"
        :height="200"
        :labels="DonutData"
        :radius="1"
        :type="'full'"
      >
        <div class="absolute text-center">
          <div class="font-semibold">الصادر والوارد</div>
          <div class="text-(--ui-text-muted) text-xs mt-3">
            <div>
              الدخل :
              <span class="font-bold text-success"> {{ totalIncome() }}</span>
            </div>
            <div>
              المصروفات :
              <span class="font-bold text-error"> {{ totalExpense() }} </span>
            </div>
          </div>
        </div>
      </DonutChart>
    </UCard>
    <UCard>
      <BarChart
        :key="colorMode.value"
        :data="RevenueData"
        :height="300"
        :categories="RevenueCategories"
        :y-axis="['mount']"
        :xNumTicks="RevenueData.length"
        :radius="5"
        :y-grid-line="true"
        :x-formatter="xFormatter"
        :y-formatter="yFormatter"
        :legend-position="LegendPosition.Top"
        :hide-legend="false"
      />
    </UCard>
  </div>
</template>

<style scoped></style>
