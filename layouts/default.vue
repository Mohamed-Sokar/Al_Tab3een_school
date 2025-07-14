<template>
  <div class="flex">
    <!-- Sidebar -->
    <AppSidebar />

    <!-- Page content -->
    <div class="lg:w-[calc(100%-190px)] min-h-screen w-full dark:bg-gray-950">
      <div
        class="w-full min-h-screen px-4 pt-4 pb-10 dark:from-gray-900 dark:to-gray-800"
      >
        <main>
          <slot />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// import { students, teachers } from "~/constants";
// const supabase = useSupabaseClient();

useHead({
  titleTemplate: "%s - لوحة إدارة المدرسة",
  htmlAttrs: {
    dir: "rtl",
    lang: "ar",
  },
  meta: [
    { name: "robots", content: "index" },
    // {
    //   name: "google-site-verification",
    //   content: "C-UKtSnT0hK7aUzO337wOFBNWVZoqi-DRR5ep1wSOQM", // ضع الكود الخاص بك هنا
    // },
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
    {
      name: "viewport",
      content: "width=device-width, initial-scale=1",
    },
    {
      charset: "utf-8",
    },
  ],
});

const colorMode = useColorMode();
// colorMode.preference = "system"; // Set default color mode

const studentsStore = useStudentStore();
const paymentsStore = usePaymentsStore();
const teachersStore = useTeachersStore();
const levelsStore = useLevelsStore();
const academicClassesStore = useAcademicClassesStore();
const quranClassesStore = useQuranClassesStore();
const driversStore = useDriversStore();
const plansStore = usePlansStore();

onMounted(async () => {
  // await supabase.auth.updateUser({ password: "Aboomar2939036!" });
  await studentsStore.fetchBehavioralIssues();
  await studentsStore.fetchStudents();
  await levelsStore.fetchLevels();
  await plansStore.fetchPlans();
  await quranClassesStore.fetchClasses();
  await driversStore.fetchDrivers();
  await paymentsStore.fetchPayments();
  await academicClassesStore.fetchClasses();
  await teachersStore.fetchTeachers();
  await teachersStore.fetchAbsenceReports();
  await teachersStore.fetchTeachersLoans();
  await teachersStore.fetchTeachersBehavioralIssues();
});

// import { useStudentStore } from "@/stores/students";
// const { fetchStudents, loading, sortedStudents } = useStudentStore();
// const response = fetchStudents();
// console.log(response);

// const user = useSupabaseUser();

// watch(
//   user,
//   () => (colorMode.preference = user.value?.user_metadata?.color_mode),
//   { immediate: true }
// );
// const supabase = useSupabaseClient();

// create user in both users and profiles tables
// const createUser = async () => {
//   const response = await $fetch("/api/admin/create-user", {
//     method: "POST",
//     body: {
//       email: "aboomarsokar@gmail.com",
//       password: "strongpassword123",
//       role: "manager", // or 'admin'
//     },
//   });
//   console.log(response);
// };

// const { success, response } = await $fetch("/api/send-telegram", {
//   method: "POST",
//   body: { message: "🔔 +1تمت إضافة طالب جديد في المدرسة!" },
// });
// console.log(success, response);
// const { data } = await $fetch("/api/students", {
//   method: "GET",
// });

// const { id } = await $fetch(`/api/students/${data[0].id}`, {
//   method: "PUT",
//   body: {},
// });
// console.log(data, id);
// await createUser();
</script>

<style>
body {
  font-family: "Cairo", sans-serif;
}
</style>
