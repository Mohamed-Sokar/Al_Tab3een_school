<template>
  <div>
    <BaseHeader title="الإعدادات" description="تخصيص وإدارة إعدادات النظام">
    </BaseHeader>
    <div class="grid grid-cols-6 gap-8 mt-5">
      <div class="flex flex-col gap-0.5 col-span-2">
        <UButton
          variant="ghost"
          color="secondary"
          class="py-1.5 px-5 text-gray-500 rounded-md text-sm"
          :icon="link.icon"
          :class="{
            'text-secondary bg-secondary-50 dark:bg-gray-800':
              link.to === route.path,
          }"
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          >{{ link.label }}
        </UButton>
      </div>
      <!-- <UNavigationMenu orientation="vertical" :items="links" class="col-span-2" /> -->
      <div class="col-span-4">
        <BaseFadeTransition>
          <NuxtPage />
        </BaseFadeTransition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
watch(route, () => {
  if (route.path === "/settings") {
    navigateTo("/settings/general");
  }
});

const links = [
  {
    label: "الإعدادات",
    icon: "i-lucide-cog",
    to: "/settings/general",
  },
  {
    label: "الملف الشخصي",
    icon: "i-lucide-user",
    to: "/settings/profile",
  },
  {
    label: "الصورة الشخصية",
    icon: "i-lucide-image",
    to: "/settings/avatar",
  },
  {
    label: "تغيير الحساب",
    icon: "i-lucide-cog",
    to: "/settings/change_email",
  },
  {
    label: "تغيير كلمة السر",
    icon: "i-lucide-cog",
    to: "/settings/change_password",
  },
];
</script>

<style scoped></style>
