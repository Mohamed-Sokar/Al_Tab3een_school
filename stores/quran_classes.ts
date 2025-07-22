import type { Class } from "~/types";
import { defineStore } from "pinia";
import { useStudentStore } from "@/stores/students";

export const useQuranClassesStore = defineStore("quran_classes", () => {
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
          student.quran_class?.title === _class.title &&
          student.quran_class?.group === _class.group
      ).length;
      return { ..._class, studentsCount: count };
    });
  });

  const fetchClasses = async () => {
    if (classesData.value.length) return; // تجنب الجلب أكثر من مرة
    loading.value = true;
    try {
      const { data } = await api.get("/quran_classes");

      // console.log(data);

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
      const { data } = await api.post("/quran_classes", level);
      toastSuccess({
        title: `:تم إضافة الصف بنجاح`,
      });
      // console.log(data);

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
      await api.delete(`quran_classes/${classId}`);

      toastSuccess({
        title: `:تم حذف الصف القرآني بنجاح`,
      });
      // delete class locally
      const classIndex = getSpecificClassIndex(classId);
      classes.value.splice(classIndex, 1);
    } catch (err) {
      toastError({
        title: "حدث مشكلة في حذف الصف القرآني",
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
      const { data } = await api.put(`quran_classes/${classId}`, newClass);

      toastSuccess({
        title: `:تم تحديث بيانات الصف بنجاح`,
      });

      // console.log(data);

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
  const updateQuranClassForStudents = async (
    studentIds: string[],
    classId: number
  ) => {
    try {
      loading.value = true;

      const { data } = await api.put("/quran_classes/update-quran-class", {
        studentIds,
        classId,
      });

      // console.log(data);

      toastSuccess({ title: "تم نقل الطلاب للصف القرآني الجديد بنجاح" });

      // تحديث البيانات محليًا إذا لزم الأمر
      studentsStore.studentsData = studentsStore.studentsData
        .map((student) =>
          studentIds.includes(student.id || "")
            ? { ...student, academic_class_id: classId }
            : student
        )
        .sort((a, b) => (a.first_name || "").localeCompare(b.first_name || ""));
    } catch (error) {
      toastError({ title: "فشل في نقل الطلاب" });
    } finally {
      loading.value = false;
    }
  };

  const classStudentsCount = (levelTitle: string) => {
    return classesWithStudentsCount.value.find(
      (level) => level.title === levelTitle
    )?.studentsCount;
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

    updateQuranClassForStudents,
  };
});
