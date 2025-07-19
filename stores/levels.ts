import type { Level } from "~/types";
import { defineStore } from "pinia";
import { useStudentStore } from "@/stores/students";

export const useLevelsStore = defineStore("levels", () => {
  const studentsStore = useStudentStore();
  // helper composables
  const { toastError, toastSuccess } = useAppToast();
  // Data
  const levels = ref<Level[]>([]);
  const loading = ref(false);
  const isLoaded = ref(false);
  // const tableKey = ref(Math.random());

  // Getters
  const levelsData = computed(() => levels.value);

  const levelsWithStudentsCount = computed(() => {
    return levels.value.map((level) => {
      const count = studentsStore.studentsData.filter(
        (s) => s.level === level.title
      ).length;
      return { ...level, studentsCount: count };
    });
  });

  const fetchLevels = async () => {
    if (isLoaded.value) return; // تجنب الجلب أكثر من مرة
    loading.value = true;
    try {
      const { data } = await api.get("/levels");

      console.log("levels: ", data);
      // set levels data to ref locally
      levels.value = data;
      toastSuccess({
        title: "تم تحميل المستويات بنجاح",
      });
      isLoaded.value = true;
      // tableKey.value = Math.random();
    } catch (err) {
      toastError({
        title: "حدث مشكلة أثناء تحميل المستويات",
        description: (err as Error).message,
      });
      throw Error(err instanceof Error ? err.message : String(err));
    } finally {
      loading.value = false;
    }
  };
  const addLevel = async (level: Level) => {
    loading.value = true;

    try {
      const { data } = await api.post("/levels", level);
      toastSuccess({
        title: `:تم إضافة المستوى بنجاح`,
      });
      console.log(data);
      // add student locally
      levels.value.unshift({
        ...level,
      });
    } catch (err) {
      toastError({
        title: "حدث مشكلة في إضافة المستوى",
        description: (err as Error).message,
      });
      throw Error(err instanceof Error ? err.message : String(err));
    } finally {
      loading.value = false;
    }
  };
  const deleteLevel = async (levelId: number) => {
    try {
      loading.value = true;
      await api.delete(`levels/${levelId}`);

      toastSuccess({
        title: `:تم حذف المستوى بنجاح`,
      });
      // delete level locally
      const levelIndex = getSpecificLevelIndex(levelId);
      levels.value.splice(levelIndex, 1);
    } catch (err) {
      toastError({
        title: "حدث مشكلة في حذف المستوى",
        description: (err as Error).message,
      });
    } finally {
      loading.value = false;
    }
  };
  const updateLevel = async (levelId: number, newLevel: Level) => {
    try {
      loading.value = true;
      const { data } = await api.put(`levels/${levelId}`, newLevel);

      toastSuccess({
        title: `:تم تحديث بيانات المستوى بنجاح`,
      });

      console.log(data);

      // update level locally
      const levelIndex = getSpecificLevelIndex(levelId);
      const targetedLevel = getSpecificLevel(levelId);

      levels.value[levelIndex] = {
        ...targetedLevel,
        ...newLevel,
        // ...data,
      };
    } catch (err) {
      toastError({
        title: "حدث مشكلة في تعديل بيانات المستوى",
        description: (err as Error).message,
      });
    } finally {
      loading.value = false;
    }
  };
  const getSpecificLevel = (levelId: number) => {
    return levels.value.find((level) => level.id === levelId);
  };
  const getSpecificLevelIndex = (levelId: number) => {
    return levels.value.findIndex((level) => level.id === levelId);
  };

  return {
    // Data
    loading,
    //Getters
    levelsData,
    levelsWithStudentsCount,

    // Actions
    fetchLevels,
    addLevel,
    updateLevel,
    deleteLevel,
    getSpecificLevel,
    getSpecificLevelIndex,
    // levelStudentsCount,
  };
});
