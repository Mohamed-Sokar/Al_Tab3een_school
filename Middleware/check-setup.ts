export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return;

  const levelsStore = useLevelsStore();
  const academicClassesStore = useAcademicClassesStore();
  const quranClassesStore = useQuranClassesStore();
  const plansStore = usePlansStore();
  const employeesStore = useTeachersStore();

  // 🛡️ الخطوة 1: التحقق من المستويات
  await Promise.all([
    levelsStore.fetchLevels(),
    academicClassesStore.fetchClasses(),
    quranClassesStore.fetchClasses(),
    plansStore.fetchPlans(),
    employeesStore.fetchTeachers(),
  ]);

  const path = to.path;
  if (
    (path.startsWith("/classes") ||
      path.startsWith("/plans") ||
      path.startsWith("/employees") ||
      path.startsWith("/students")) &&
    !levelsStore.levelsData?.length
  ) {
    if (!path.startsWith("/levels")) {
      return navigateTo("/levels?alert=أضف المستويات أولاً");
    }
  }

  // 🛡️ الخطوة 2: التحقق من الصفوف
  if (
    (path.startsWith("/plans") ||
      path.startsWith("/employees") ||
      path.startsWith("/students")) &&
    (!academicClassesStore.classesData?.length ||
      !quranClassesStore.classesData?.length)
  ) {
    if (!path.startsWith("/classes")) {
      if (!academicClassesStore.classesData?.length) {
        return navigateTo("/classes/view?alert=أضف الصفوف أولاً");
      } else {
        return navigateTo("/classes/view/quran_classes?alert=أضف الصفوف أولاً");
      }
    }
  }

  // 🛡️ الخطوة 3: التحقق من الخطط
  if (
    (path.startsWith("/employees") || path.startsWith("/students")) &&
    !plansStore.plansData?.length
  ) {
    if (!path.startsWith("/plans")) {
      return navigateTo("/plans?alert=أضف الخطط أولاً");
    }
  }

  // 🛡️ الخطوة 4: التحقق من الموظفين
  if (path.startsWith("/students") && !employeesStore.teachersData?.length) {
    if (!path.startsWith("/employees")) {
      return navigateTo("/employees/view?alert=أضف الموظفين أولاً");
    }
  }
  // if (
  //   !to.path.startsWith("/classes") ||
  //   !to.path.startsWith("/plans") ||
  //   !to.path.startsWith("/employees") ||
  //   !to.path.startsWith("/students")
  // ) {
  //   return navigateTo("/");
  // }
  // }, 1000);
});
