<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import type { DropdownMenuItem } from "@nuxt/ui";
const route = useRoute();
const { toastError, toastSuccess } = useAppToast();
const isOpen = ref(false);
const isLargeScreen = ref(false);
const loading = ref(false);
const supabase = useSupabaseClient();
const user = useSupabaseUser();

function updateScreen() {
  isLargeScreen.value = window.innerWidth >= 1024;
}

onMounted(() => {
  updateScreen();
  window.addEventListener("resize", updateScreen);
});

watch(
  () => route.path,
  () => {
    if (!isLargeScreen.value) isOpen.value = false;
  }
);

const signOut = async () => {
  try {
    loading.value = true;
    await $fetch("/api/notifications/send-telegram", {
      method: "POST",
      body: { message: `🔔 تم تسجيل الخروج من حساب ${user?.value?.email}` },
    });

    const { error } = await supabase.auth.signOut();
    navigateTo("/login");
    if (error) {
      throw new Error(error.message);
    }
    // const response = await api.post("/notifications/send-telegram", {
    //   message: `🔔 تم تسجيل الخروج من حساب ${user.value?.email}`,
    // });
    toastSuccess({
      title: "تم تسجيل الخروج بنجاح",
    });
  } catch (error) {
    toastError({
      title: "حدث مشكلة في تسجيل الخروج",
      description: error.message,
    });
  } finally {
    loading.value = false;
  }
};

const links = [
  { label: "الرئيسية", icon: "i-lucide-home", to: "/" },
  {
    label: "الطلاب",
    icon: "i-lucide-users",
    to: "/students/view/students_table",
  },
  { label: "المعلمون", icon: "i-lucide-users", to: "/teachers/view" },
  { label: "المصروفات", icon: "i-lucide-credit-card", to: "/payments" },
  { label: "المستويات", icon: "i-lucide-book-open", to: "/levels" },
  // { label: "التقارير", icon: "i-lucide-bar-chart-3", to: "/reports" },
  { label: "الإعدادات", icon: "i-lucide-settings", to: "/settings/general" },
];
const items: DropdownMenuItem[] = [
  [
    {
      slot: "account",
      // label: user.value?.email,
      icon: "i-lucide-user",
      disabled: true,
    },
  ],
  [
    {
      label: "تغيير الصورة الشخصية",
      icon: "i-heroicons-camera",
      onSelect: () => {
        navigateTo("/settings/avatar");
      },
    },
  ],
  [
    {
      label: "تسجيل خروج",
      color: "error",
      icon: "heroicons-arrow-right-end-on-rectangle-20-solid",
      class: "text-red-500  hover:cursor-pointer",
      onSelect: () => {
        signOut();
      },
    },
  ],
];
</script>

<template>
  <!-- Toggle Button -->
  <button
    class="fixed top-4 right-4 z-50 bg-blue-700 dark:bg-blue-600 text-white p-2 rounded-lg shadow-lg lg:hidden"
    @click="isOpen = !isOpen"
  >
    <UIcon
      :name="isOpen ? 'i-lucide-x' : 'lucide-align-right'"
      class="size-6"
    />
  </button>

  <!-- Backdrop -->
  <Transition name="fade">
    <div
      v-if="isOpen && !isLargeScreen"
      class="fixed inset-0 bg-black/50 z-40"
      @click="isOpen = false"
    />
  </Transition>

  <!-- Sidebar -->
  <Transition name="slide">
    <aside
      v-if="isOpen || isLargeScreen"
      class="fixed lg:sticky top-0 right-0 flex flex-col justify-between w-64 h-screen z-1000 bg-gradient-to-b from-blue-800 to-purple-700 dark:from-gray-900 dark:to-gray-800 text-white transition-all duration-300 ease-in-out"
    >
      <!-- Sidebar Header -->
      <div
        class="flex items-center gap-4 p-4 border-b border-blue-300 dark:border-gray-700"
      >
        <div>
          <!-- Logo -->
          <!-- <UAvatar size="xl" /> -->
          <UDropdownMenu
            v-if="user"
            class="hover:cursor-pointer"
            arrow
            :items="items"
            :ui="{
              content: 'w-60',
            }"
          >
            <UAvatar
              :src="url ?? '/images/avatar.avif'"
              size="xl"
              class="border"
            />
            <template #account="{ item }">
              <div class="text-left w-full">
                <p class="text-muted">تم تسجيل الدخول بحساب</p>
                <div class="flex justify-between w-full">
                  <p class="font-medium text-gray-900 dark:text-white">
                    {{ user.email }}
                  </p>
                  <UIcon
                    :name="item.icon"
                    class="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500 ms-auto"
                  />
                </div>
              </div>
            </template>
            <template #item-leading> </template>
          </UDropdownMenu>
        </div>
        <div>
          <h2 class="text-xl font-bold text-white">جلال أبو صايمة</h2>
          <p class="text-sm text-blue-200 dark:text-gray-400">
            مدير مدرسة التابعين
          </p>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="mt-6 px-2 flex-1 space-y-2 text-right overflow-y-auto">
        <div v-for="link in links" :key="link.to">
          <NuxtLink
            :to="link.to"
            class="flex items-center font-semibold gap-3 px-4 py-2 rounded-lg transition hover:bg-blue-600"
            :class="{
              'bg-blue-600':
                link.to === '/'
                  ? route.path === link.to
                  : route.path.includes(link.to),
            }"
          >
            <UIcon :name="link.icon" class="size-5" />
            <span class="text-base text-white dark:text-gray-200">
              {{ link.label }}
            </span>
          </NuxtLink>
        </div>
      </nav>

      <!-- Footer -->
      <!-- <div
        class="px-4 py-3 bg-blue-800 dark:bg-gray-900 flex items-center justify-between text-sm"
      >
        <div>
          <p class="text-white dark:text-gray-200">مدير النظام</p>
          <p class="text-blue-200 dark:text-gray-400">admin@school.com</p>
        </div>
        <div
          class="w-10 h-10 rounded-full bg-blue-500 dark:bg-gray-700 flex items-center justify-center text-white font-bold"
        >
          م
        </div>
      </div> -->
    </aside>
  </Transition>
</template>

<style>
/* Slide transition */
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease-in-out;
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
