import type { Driver } from "~/types";
import { defineStore } from "pinia";
import { useStudentStore } from "@/stores/students";

export const useDriversStore = defineStore("drivers", () => {
  const studentsStore = useStudentStore();
  // helper composables
  const { toastError, toastSuccess } = useAppToast();
  // Data
  const drivers = ref<Driver[]>([]);
  const loading = ref(false);

  // Getters
  const driversData = computed(() => drivers.value);

  const driversWithStudentsCount = computed(() => {
    return drivers.value.map((driver) => {
      const count = studentsStore.sortedStudents.filter(
        (student) => student.driver_id === driver.id
      ).length;
      return { ...driver, studentsCount: count };
    });
  });

  const fetchDrivers = async () => {
    loading.value = true;
    try {
      const { data } = await api.get("/drivers");

      console.log(data);
      // set levels data to ref locally
      drivers.value = data;
      toastSuccess({
        title: "تم تحميل السائقين بنجاح",
      });
    } catch (err) {
      toastError({
        title: "حدث مشكلة أثناء تحميل السائقين",
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
  const addDriver = async (driver: Driver) => {
    loading.value = true;

    try {
      const { data } = await api.post("/drivers", driver);
      toastSuccess({
        title: `:تم إضافة السائق بنجاح`,
      });
      console.log(data);
      // add student locally
      drivers.value.unshift({
        ...driver,
      });
    } catch (err) {
      toastError({
        title: "حدث مشكلة في إضافة السائق",
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
  const deleteDriver = async (driverId: number) => {
    try {
      loading.value = true;
      await api.delete(`drivers/${driverId}`);

      toastSuccess({
        title: `:تم حذف السائق بنجاح`,
      });
      // delete driver locally
      const driverIndex = getSpecificDriverIndex(driverId);
      drivers.value.splice(driverIndex, 1);
    } catch (err) {
      toastError({
        title: "حدث مشكلة في حذف السائق",
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
  const updateDriver = async (driverId: number, newDriver: Driver) => {
    try {
      loading.value = true;
      const { data } = await api.put(`drivers/${driverId}`, newDriver);

      toastSuccess({
        title: `:تم تحديث بيانات السائق بنجاح`,
      });

      console.log(data);

      // update class locally
      const driverIndex = getSpecificDriverIndex(driverId);
      const targetedDriver = getSpecificDriver(driverId);

      drivers.value[driverIndex] = {
        ...targetedDriver,
        ...newDriver,
        // ...data,
      };
    } catch (err) {
      toastError({
        title: "حدث مشكلة في تعديل بيانات السائق",
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
  const getSpecificDriver = (driverId: number) => {
    return drivers.value.find((driver) => driver.id === driverId);
  };
  const getSpecificDriverIndex = (driverId: number) => {
    return drivers.value.findIndex((driver) => driver.id === driverId);
  };
  const driverStudentsCount = (driverId: number) => {
    return driversWithStudentsCount.value.find(
      (driver) => driver.id === driverId
    )?.studentsCount;
  };

  const updatesDriverForStudents = async (
    studentIds: string[],
    driverId: number
  ) => {
    try {
      loading.value = true;

      const { data } = await api.put("/drivers/update-driver", {
        studentIds,
        driverId,
      });

      console.log(data);

      toastSuccess({ title: "تم تعيين سائق للطلاب بنجاح" });

      // تحديث البيانات محليًا إذا لزم الأمر
      studentsStore.studentsData = studentsStore.studentsData
        .map((student) =>
          studentIds.includes(student.id || "")
            ? { ...student, driver_id: driverId }
            : student
        )
        .sort((a, b) => (a.first_name || "").localeCompare(b.first_name || ""));
    } catch (error) {
      toastError({ title: "فشل في تعيين السائق" });
    } finally {
      loading.value = false;
    }
  };

  return {
    // Data
    loading,
    //Getters
    driversData,
    driversWithStudentsCount,

    // Actions
    fetchDrivers,
    addDriver,
    updateDriver,
    deleteDriver,
    getSpecificDriver,
    getSpecificDriverIndex,
    driverStudentsCount,

    updatesDriverForStudents,
  };
});
