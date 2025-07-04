import { defineStore } from 'pinia';
import { u as useStudentStore } from './students-C5l8o5u3.mjs';
import { u as useAppToast } from './useAppToast-BZDaw0os.mjs';
import { ref, computed } from 'vue';
import { a as api } from './api-Bx7QNuNm.mjs';

const useLevelsStore = defineStore("levels", () => {
  const studentsStore = useStudentStore();
  const { toastError, toastSuccess } = useAppToast();
  const levels = ref([]);
  const loading = ref(false);
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
    loading.value = true;
    try {
      const { data } = await api.get("/levels");
      console.log(data);
      levels.value = data;
      toastSuccess({
        title: "\u062A\u0645 \u062A\u062D\u0645\u064A\u0644 \u0627\u0644\u0645\u0633\u062A\u0648\u064A\u0627\u062A \u0628\u0646\u062C\u0627\u062D"
      });
    } catch (err) {
      toastError({
        title: "\u062D\u062F\u062B \u0645\u0634\u0643\u0644\u0629 \u0623\u062B\u0646\u0627\u0621 \u062A\u062D\u0645\u064A\u0644 \u0627\u0644\u0645\u0633\u062A\u0648\u064A\u0627\u062A",
        description: err.message
      });
      throw Error(err instanceof Error ? err.message : String(err));
    } finally {
      loading.value = false;
    }
  };
  const addLevel = async (level) => {
    loading.value = true;
    try {
      const { data } = await api.post("/levels", level);
      toastSuccess({
        title: `:\u062A\u0645 \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u0645\u0633\u062A\u0648\u0649 \u0628\u0646\u062C\u0627\u062D`
      });
      console.log(data);
      levels.value.unshift({
        ...level
      });
    } catch (err) {
      toastError({
        title: "\u062D\u062F\u062B \u0645\u0634\u0643\u0644\u0629 \u0641\u064A \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u0645\u0633\u062A\u0648\u0649",
        description: err.message
      });
      throw Error(err instanceof Error ? err.message : String(err));
    } finally {
      loading.value = false;
    }
  };
  const deleteLevel = async (levelId) => {
    try {
      loading.value = true;
      await api.delete(`levels/${levelId}`);
      toastSuccess({
        title: `:\u062A\u0645 \u062D\u0630\u0641 \u0627\u0644\u0645\u0633\u062A\u0648\u0649 \u0628\u0646\u062C\u0627\u062D`
      });
      const levelIndex = getSpecificLevelIndex(levelId);
      levels.value.splice(levelIndex, 1);
    } catch (err) {
      toastError({
        title: "\u062D\u062F\u062B \u0645\u0634\u0643\u0644\u0629 \u0641\u064A \u062D\u0630\u0641 \u0627\u0644\u0645\u0633\u062A\u0648\u0649",
        description: err.message
      });
    } finally {
      loading.value = false;
    }
  };
  const updateLevel = async (levelId, newLevel) => {
    try {
      loading.value = true;
      const { data } = await api.put(`levels/${levelId}`, newLevel);
      toastSuccess({
        title: `:\u062A\u0645 \u062A\u062D\u062F\u064A\u062B \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0645\u0633\u062A\u0648\u0649 \u0628\u0646\u062C\u0627\u062D`
      });
      console.log(data);
      const levelIndex = getSpecificLevelIndex(levelId);
      const targetedLevel = getSpecificLevel(levelId);
      levels.value[levelIndex] = {
        ...targetedLevel,
        ...newLevel
        // ...data,
      };
    } catch (err) {
      toastError({
        title: "\u062D\u062F\u062B \u0645\u0634\u0643\u0644\u0629 \u0641\u064A \u062A\u0639\u062F\u064A\u0644 \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0645\u0633\u062A\u0648\u0649",
        description: err.message
      });
    } finally {
      loading.value = false;
    }
  };
  const getSpecificLevel = (levelId) => {
    return levels.value.find((level) => level.id === levelId);
  };
  const getSpecificLevelIndex = (levelId) => {
    return levels.value.findIndex((level) => level.id === levelId);
  };
  const levelStudentsCount = (levelTitle) => {
    var _a;
    return (_a = levelsWithStudentsCount.value.find(
      (level) => level.title === levelTitle
    )) == null ? void 0 : _a.studentsCount;
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
    levelStudentsCount
  };
});

export { useLevelsStore as u };
//# sourceMappingURL=levels-wubGyWhj.mjs.map
