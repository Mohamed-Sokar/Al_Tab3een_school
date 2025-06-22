import type { Level } from "~/types";
import { levels } from "@/constants";
import { defineStore } from "pinia";

export const useLevelsStore = defineStore("levels", () => {
  const levelsData = ref<Level[]>(levels);

  const addLevel = (level: Level) => {
    return levelsData.value.unshift({
      ...level,
      id: Math.random(),
    });
  };
  const deleteLevel = (levelId: number) => {
    const targetedLevelIndex = levelsData.value.findIndex(
      (level) => level.id === levelId
    );
    return levelsData.value.splice(targetedLevelIndex, 1);
  };
  const updateLevel = (levelId: number, newLevel: Level) => {
    const targetedLevelIndex = getSpecificLevelIndex(levelId);
    const targetedLevel = getSpecificLevel(levelId);

    return (levelsData.value[targetedLevelIndex] = {
      ...targetedLevel,
      ...newLevel,
    });
  };
  const getSpecificLevel = (levelId: number | string) => {
    return levelsData.value.find((level) => level.id === levelId);
  };
  const getSpecificLevelIndex = (levelId: number) => {
    return levelsData.value.findIndex((level) => level.id === levelId);
  };
  const levelStudentsCount = (levelTitle: string) => {
    return levelsData.value.find((level) => level.title === levelTitle)
      ?.studentsCount;
  };

  return {
    levelsData,
    addLevel,
    updateLevel,
    deleteLevel,
    getSpecificLevel,
    getSpecificLevelIndex,
    levelStudentsCount,
  };
});
