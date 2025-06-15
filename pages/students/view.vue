<template>
  <div>
    <page-header
      title="الطلاب"
      description="إدارة بيانات الطلاب والمعلومات الأكاديمية"
    >
      <template #actions>
        <app-modal
          @saved="() => console.log('object')"
          v-model:modal-value="isOpen"
        />
        <UButton
          active
          color="secondary"
          variant="outline"
          active-color="secondary"
          size="lg"
          active-variant="solid"
          icon="heroicons-plus-circle-20-solid"
          class="bg-secondary-600 font-bold"
          to="/students/add"
          @click="isOpen = !isOpen"
          >إضافة طالب</UButton
        >
      </template>
    </page-header>

    <!-- <UNavigationMenu
      class="flex justify-end my-4"
      orientation="horizontal"
      :items="links"
      color="secondary"
    /> -->
    <div
      class="grid grid-cols-3 gap-1 p-1 bg-gradient-to-l from-blue-300 to-purple-200 dark:from-gray-900 dark:to-gray-800 mt-2 mb-8 rounded-sm"
    >
      <NuxtLink
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        class="w-full h-full rounded-md text-center p-1 hover:bg-secondary hover:dark:bg-secondary-600 hover:text-white hover:font-bold"
        :class="{
          'bg-secondary dark:bg-secondary-600 text-white font-bold':
            link.to === route.path,
        }"
      >
        {{ link.label }}
      </NuxtLink>
    </div>
    <FadeTransition>
      <NuxtPage />
    </FadeTransition>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const isOpen = ref(false);

const links = [
  {
    label: "جدول الطلاب",
    icon: "i-lucide-user",
    to: "/students/view/students_table",
  },
  {
    label: "كشف الدرجات",
    icon: "i-lucide-user",
    to: "/students/view/grades",
  },
  {
    label: "المخالفات السلوكية",
    icon: "i-lucide-user",
    to: "/students/view/behavioral_issues",
  },
];

onMounted(() => {
  watch(
    route,
    () => {
      route.path === "/students/view"
        ? navigateTo("/students/view/students_table")
        : navigateTo(route.path);
    },
    { immediate: true }
  );
  console.log(route.path);
});
</script>

<style scoped></style>
