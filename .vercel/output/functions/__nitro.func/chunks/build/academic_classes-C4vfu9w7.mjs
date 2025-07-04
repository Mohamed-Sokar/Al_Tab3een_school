import { defineStore } from 'pinia';
import { u as useStudentStore } from './students-C5l8o5u3.mjs';
import { u as useAppToast } from './useAppToast-BZDaw0os.mjs';
import { ref, computed } from 'vue';
import { a as api } from './api-Bx7QNuNm.mjs';

const useAcademicClassesStore = defineStore("academic_classes", () => {
  const studentsStore = useStudentStore();
  const { toastError, toastSuccess } = useAppToast();
  const classes = ref([]);
  const loading = ref(false);
  const classesData = computed(() => classes.value);
  const classesWithStudentsCount = computed(() => {
    return classes.value.map((_class) => {
      const count = studentsStore.sortedStudents.filter(
        (student) => {
          var _a, _b;
          return ((_a = student.academic_class) == null ? void 0 : _a.title) === _class.title && ((_b = student.academic_class) == null ? void 0 : _b.group) === _class.group;
        }
      ).length;
      return { ..._class, studentsCount: count };
    });
  });
  const fetchClasses = async () => {
    loading.value = true;
    try {
      const { data } = await api.get("academic_classes");
      console.log(data);
      classes.value = data;
      toastSuccess({
        title: "\u062A\u0645 \u062A\u062D\u0645\u064A\u0644 \u0627\u0644\u0635\u0641\u0648\u0641 \u0628\u0646\u062C\u0627\u062D"
      });
    } catch (err) {
      toastError({
        title: "\u062D\u062F\u062B \u0645\u0634\u0643\u0644\u0629 \u0623\u062B\u0646\u0627\u0621 \u062A\u062D\u0645\u064A\u0644 \u0627\u0644\u0635\u0641\u0648\u0641",
        description: err instanceof Error ? err.message : typeof err === "string" ? err : JSON.stringify(err)
      });
    } finally {
      loading.value = false;
    }
  };
  const addClass = async (level) => {
    loading.value = true;
    try {
      const { data } = await api.post("academic_classes", level);
      toastSuccess({
        title: `:\u062A\u0645 \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u0635\u0641 \u0628\u0646\u062C\u0627\u062D`
      });
      console.log(data);
      classes.value.unshift({
        ...level
      });
    } catch (err) {
      toastError({
        title: "\u062D\u062F\u062B \u0645\u0634\u0643\u0644\u0629 \u0641\u064A \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u0635\u0641",
        description: err instanceof Error ? err.message : typeof err === "string" ? err : JSON.stringify(err)
      });
    } finally {
      loading.value = false;
    }
  };
  const deleteClass = async (classId) => {
    try {
      loading.value = true;
      await api.delete(`academic_classes/${classId}`);
      toastSuccess({
        title: `:\u062A\u0645 \u062D\u0630\u0641 \u0627\u0644\u0645\u0633\u062A\u0648\u0649 \u0628\u0646\u062C\u0627\u062D`
      });
      const classIndex = getSpecificClassIndex(classId);
      classes.value.splice(classIndex, 1);
    } catch (err) {
      toastError({
        title: "\u062D\u062F\u062B \u0645\u0634\u0643\u0644\u0629 \u0641\u064A \u062D\u0630\u0641 \u0627\u0644\u0645\u0633\u062A\u0648\u0649",
        description: err instanceof Error ? err.message : typeof err === "string" ? err : JSON.stringify(err)
      });
    } finally {
      loading.value = false;
    }
  };
  const updateClass = async (classId, newClass) => {
    try {
      loading.value = true;
      const { data } = await api.put(`academic_classes/${classId}`, newClass);
      toastSuccess({
        title: `:\u062A\u0645 \u062A\u062D\u062F\u064A\u062B \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0635\u0641 \u0628\u0646\u062C\u0627\u062D`
      });
      console.log(data);
      const classIndex = getSpecificClassIndex(classId);
      const targetedClass = getSpecificClass(classId);
      classes.value[classIndex] = {
        ...targetedClass,
        ...newClass
        // ...data,
      };
    } catch (err) {
      toastError({
        title: "\u062D\u062F\u062B \u0645\u0634\u0643\u0644\u0629 \u0641\u064A \u062A\u0639\u062F\u064A\u0644 \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0635\u0641",
        description: err instanceof Error ? err.message : typeof err === "string" ? err : JSON.stringify(err)
      });
    } finally {
      loading.value = false;
    }
  };
  const getSpecificClass = (classId) => {
    return classes.value.find((level) => level.id === classId);
  };
  const getSpecificClassIndex = (classId) => {
    return classes.value.findIndex((level) => level.id === classId);
  };
  const classStudentsCount = (levelTitle) => {
    var _a;
    return (_a = classesWithStudentsCount.value.find(
      (level) => level.title === levelTitle
    )) == null ? void 0 : _a.studentsCount;
  };
  const updateAcademicClassForStudents = async (studentIds, classId) => {
    try {
      loading.value = true;
      const { data } = await api.put("academic_classes/update-academic-class", {
        studentIds,
        classId
      });
      console.log(data);
      toastSuccess({ title: "\u062A\u0645 \u0646\u0642\u0644 \u0627\u0644\u0637\u0644\u0627\u0628 \u0644\u0644\u0635\u0641 \u0627\u0644\u062F\u0631\u0627\u0633\u064A \u0627\u0644\u062C\u062F\u064A\u062F \u0628\u0646\u062C\u0627\u062D" });
      studentsStore.studentsData = studentsStore.studentsData.map(
        (student) => studentIds.includes(student.id || "") ? { ...student, academic_class_id: classId } : student
      );
    } catch (error) {
      toastError({ title: "\u0641\u0634\u0644 \u0641\u064A \u0646\u0642\u0644 \u0627\u0644\u0637\u0644\u0627\u0628" });
    } finally {
      loading.value = false;
    }
  };
  return {
    // Data
    loading,
    //Getters
    classesData,
    classesWithStudentsCount,
    // Actions
    fetchClasses,
    addClass,
    updateClass,
    deleteClass,
    getSpecificClass,
    getSpecificClassIndex,
    classStudentsCount,
    updateAcademicClassForStudents
  };
});

export { useAcademicClassesStore as u };
//# sourceMappingURL=academic_classes-C4vfu9w7.mjs.map
