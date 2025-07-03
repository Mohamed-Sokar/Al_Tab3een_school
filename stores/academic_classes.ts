import type { Class } from "~/types";
import { defineStore } from "pinia";
import { useStudentStore } from "@/stores/students";

export const useAcademicClassesStore = defineStore("academic_classes", () => {
  const studentsStore = useStudentStore();
  // helper composables
  const { toastError, toastSuccess } = useAppToast();
  // Data
  const classes = ref<Class[]>([]);
  const loading = ref(false);

  // Getters
  const classesData = computed(() => classes.value);

  const classesWithStudentsCount = computed(() => {
    return classes.value.map((_class) => {
      const count = studentsStore.sortedStudents.filter(
        (student) =>
          student.academic_class?.title === _class.title &&
          student.academic_class?.group === _class.group
      ).length;
      return { ..._class, studentsCount: count };
    });
  });

  const fetchClasses = async () => {
    loading.value = true;
    try {
      const { data } = await api.get("academic_classes");

      console.log(data);
      // set levels data to ref locally
      classes.value = data;
      toastSuccess({
        title: "تم تحميل الصفوف بنجاح",
      });
      // tableKey.value = Math.random();
    } catch (err) {
      toastError({
        title: "حدث مشكلة أثناء تحميل الصفوف",
        description:
          err instanceof Error
            ? err.message
            : typeof err === "string"
            ? err
            : JSON.stringify(err),
      });
    } finally {
      loading.value = false;
    }
  };
  const addClass = async (level: Class) => {
    loading.value = true;

    try {
      const { data } = await api.post("academic_classes", level);
      toastSuccess({
        title: `:تم إضافة الصف بنجاح`,
      });
      console.log(data);
      // add student locally
      classes.value.unshift({
        ...level,
      });
    } catch (err) {
      toastError({
        title: "حدث مشكلة في إضافة الصف",
        description:
          err instanceof Error
            ? err.message
            : typeof err === "string"
            ? err
            : JSON.stringify(err),
      });
    } finally {
      loading.value = false;
    }
  };
  const deleteClass = async (classId: number) => {
    try {
      loading.value = true;
      await api.delete(`academic_classes/${classId}`);

      toastSuccess({
        title: `:تم حذف المستوى بنجاح`,
      });
      // delete class locally
      const classIndex = getSpecificClassIndex(classId);
      classes.value.splice(classIndex, 1);
    } catch (err) {
      toastError({
        title: "حدث مشكلة في حذف المستوى",
        description:
          err instanceof Error
            ? err.message
            : typeof err === "string"
            ? err
            : JSON.stringify(err),
      });
    } finally {
      loading.value = false;
    }
  };
  const updateClass = async (classId: number, newClass: Class) => {
    try {
      loading.value = true;
      const { data } = await api.put(`academic_classes/${classId}`, newClass);

      toastSuccess({
        title: `:تم تحديث بيانات الصف بنجاح`,
      });

      console.log(data);

      // update class locally
      const classIndex = getSpecificClassIndex(classId);
      const targetedClass = getSpecificClass(classId);

      classes.value[classIndex] = {
        ...targetedClass,
        ...newClass,
        // ...data,
      };
    } catch (err) {
      toastError({
        title: "حدث مشكلة في تعديل بيانات الصف",
        description:
          err instanceof Error
            ? err.message
            : typeof err === "string"
            ? err
            : JSON.stringify(err),
      });
    } finally {
      loading.value = false;
    }
  };
  const getSpecificClass = (classId: number) => {
    return classes.value.find((level) => level.id === classId);
  };
  const getSpecificClassIndex = (classId: number) => {
    return classes.value.findIndex((level) => level.id === classId);
  };
  const classStudentsCount = (levelTitle: string) => {
    return classesWithStudentsCount.value.find(
      (level) => level.title === levelTitle
    )?.studentsCount;
  };

  const updateAcademicClassForStudents = async (
    studentIds: string[],
    classId: number
  ) => {
    try {
      loading.value = true;

      const { data } = await api.put("academic_classes/update-academic-class", {
        studentIds,
        classId,
      });

      console.log(data);

      toastSuccess({ title: "تم نقل الطلاب للصف الدراسي الجديد بنجاح" });

      // تحديث البيانات محليًا إذا لزم الأمر
      studentsStore.studentsData = studentsStore.studentsData.map((student) =>
        studentIds.includes(student.id || "")
          ? { ...student, academic_class_id: classId }
          : student
      );
    } catch (error) {
      toastError({ title: "فشل في نقل الطلاب" });
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

    updateAcademicClassForStudents,
  };
});
