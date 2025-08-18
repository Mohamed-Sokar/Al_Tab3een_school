<template>
  <div>
    <BaseHeader
      title="لوحة التحكم"
      description="مرحباً بك في نظام إدارة المدرسة"
    />
    <div
      class="justify-start items-center flex w-50 mt-3 p-[3px] gap-2 mb-4 bg-secondary-50 border border-secondary-200 dark:bg-secondary-950 dark:border-secondary-500 rounded-sm text-sm"
    >
      <div
        class="w-[50%] text-center rounded-sm hover:bg-secondary py-1 hover:text-white hover: cursor-pointer"
        :class="{
          'bg-secondary text-white': isOverview,
        }"
        @click="componentIsActive = component.overview"
      >
        نظرة عامة
      </div>
      <div
        class="w-[50%] text-center rounded-sm hover:bg-secondary py-1 hover:text-white hover: cursor-pointer"
        :class="{ 'bg-secondary text-white': isStatistics }"
        @click="componentIsActive = component.statistics"
      >
        إحصائيات
      </div>
    </div>

    <BaseFadeTransition>
      <KeepAlive>
        <component :is="componentIsActive" class="w-full" />
      </KeepAlive>
    </BaseFadeTransition>
  </div>
</template>

<script setup lang="ts">
import overview from "~/components/home/overview.vue";
import statistics from "~/components/home/statistics.vue";
useHead({
  title: "الرئيسية",
  meta: [
    {
      name: "description",
      content:
        "مرحبًا بك في موقعنا، نوفر حلول إدارة المدارس من خلال نظام قوي وسهل الاستخدام.",
    },
    {
      name: "keywords",
      content:
        "مدرسة، إدارة الطلاب، النظام المدرسي، التعليم، حضور الطلاب، خطط الحفظ",
    },
  ],
});

useSeoMeta({
  title: "الرئيسية",
  description: "نظام متكامل لإدارة المدرسة، الطلاب، المعلمين، الخطط والدفع.",
  ogTitle: "الرئيسية - لوحة إدارة المدرسة",
  ogDescription: "نظام متكامل لإدارة المدرسة",
  ogImage: "/seo/index.png",
  twitterCard: "summary_large_image",
});
const component = {
  overview,
  statistics,
};
const componentIsActive = shallowRef(component.overview);

const isOverview = computed(
  () => componentIsActive.value === component.overview
);
const isStatistics = computed(
  () => componentIsActive.value === component.statistics
);
</script>

<style scoped></style>
