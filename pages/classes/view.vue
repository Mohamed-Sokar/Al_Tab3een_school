<template>
  <div>
    <BaseHeader title="الصفوف" description="إدارة الصفوف الدراسية">
      <template #actions>
        <UButton
          icon="heroicons-plus-circle-20-solid"
          size="md"
          color="secondary"
          class="bg-blue-600 px-3 py-2 font-bold"
          variant="solid"
          :to="{ name: 'classes-add', query: { classType: classType } }"
          :label="
            classType === 'academic'
              ? 'إضافة صف دراسي جديد'
              : 'إضافة صف قرآن جديد'
          "
        />
      </template>
    </BaseHeader>

    <BaseTabs :links="links" />
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
useHead({ title: "الصفوف الدراسية" });
useSeoMeta({
  title: "الصفوف الدراسية",
  description: "تعريف وتنظيم الصفوف الدراسية حسب المراحل",
  ogTitle: "إدارة الصفوف",
  ogDescription: "إدارة الصفوف الدراسية وتوزيع الطلاب",
  ogImage: "/seo/classes.png",
  twitterCard: "summary",
});
import type { LinkItem } from "~/types";
const route = useRoute();
const classT = ref();

watch(
  route,
  () => {
    classT.value = route.path.split("/")[route.path.split("/").length - 1];
  },
  { immediate: true }
);

const classType = computed(() =>
  classT.value === "academic_classes"
    ? "academic"
    : classT.value === "quran_classes"
    ? "quran"
    : ""
);
const links: LinkItem[] = [
  {
    label: "الصفوف الدراسية",
    icon: "i-heroicons-presentation-chart-bar",
    to: "/classes/view/academic_classes",
  },
  {
    label: "الصفوف القرآنية",
    icon: "i-heroicons-book-open",
    to: "/classes/view/quran_classes",
  },
];
</script>

<style scoped></style>
