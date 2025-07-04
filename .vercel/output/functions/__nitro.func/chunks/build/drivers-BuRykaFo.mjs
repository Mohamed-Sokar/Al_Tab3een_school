import { defineStore } from 'pinia';
import { u as useStudentStore } from './students-C5l8o5u3.mjs';
import { u as useAppToast } from './useAppToast-BZDaw0os.mjs';
import { ref, computed } from 'vue';
import { a as api } from './api-Bx7QNuNm.mjs';

const useDriversStore = defineStore("drivers", () => {
  const studentsStore = useStudentStore();
  const { toastError, toastSuccess } = useAppToast();
  const drivers = ref([]);
  const loading = ref(false);
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
      drivers.value = data;
      toastSuccess({
        title: "\u062A\u0645 \u062A\u062D\u0645\u064A\u0644 \u0627\u0644\u0633\u0627\u0626\u0642\u064A\u0646 \u0628\u0646\u062C\u0627\u062D"
      });
    } catch (err) {
      toastError({
        title: "\u062D\u062F\u062B \u0645\u0634\u0643\u0644\u0629 \u0623\u062B\u0646\u0627\u0621 \u062A\u062D\u0645\u064A\u0644 \u0627\u0644\u0633\u0627\u0626\u0642\u064A\u0646",
        description: err instanceof Error ? err.message : typeof err === "string" ? err : JSON.stringify(err)
      });
    } finally {
      loading.value = false;
    }
  };
  const addDriver = async (driver) => {
    loading.value = true;
    try {
      const { data } = await api.post("/drivers", driver);
      toastSuccess({
        title: `:\u062A\u0645 \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u0633\u0627\u0626\u0642 \u0628\u0646\u062C\u0627\u062D`
      });
      console.log(data);
      drivers.value.unshift({
        ...driver
      });
    } catch (err) {
      toastError({
        title: "\u062D\u062F\u062B \u0645\u0634\u0643\u0644\u0629 \u0641\u064A \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u0633\u0627\u0626\u0642",
        description: err instanceof Error ? err.message : typeof err === "string" ? err : JSON.stringify(err)
      });
    } finally {
      loading.value = false;
    }
  };
  const deleteDriver = async (driverId) => {
    try {
      loading.value = true;
      await api.delete(`drivers/${driverId}`);
      toastSuccess({
        title: `:\u062A\u0645 \u062D\u0630\u0641 \u0627\u0644\u0633\u0627\u0626\u0642 \u0628\u0646\u062C\u0627\u062D`
      });
      const driverIndex = getSpecificDriverIndex(driverId);
      drivers.value.splice(driverIndex, 1);
    } catch (err) {
      toastError({
        title: "\u062D\u062F\u062B \u0645\u0634\u0643\u0644\u0629 \u0641\u064A \u062D\u0630\u0641 \u0627\u0644\u0633\u0627\u0626\u0642",
        description: err instanceof Error ? err.message : typeof err === "string" ? err : JSON.stringify(err)
      });
    } finally {
      loading.value = false;
    }
  };
  const updateDriver = async (driverId, newDriver) => {
    try {
      loading.value = true;
      const { data } = await api.put(`drivers/${driverId}`, newDriver);
      toastSuccess({
        title: `:\u062A\u0645 \u062A\u062D\u062F\u064A\u062B \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0633\u0627\u0626\u0642 \u0628\u0646\u062C\u0627\u062D`
      });
      console.log(data);
      const driverIndex = getSpecificDriverIndex(driverId);
      const targetedDriver = getSpecificDriver(driverId);
      drivers.value[driverIndex] = {
        ...targetedDriver,
        ...newDriver
        // ...data,
      };
    } catch (err) {
      toastError({
        title: "\u062D\u062F\u062B \u0645\u0634\u0643\u0644\u0629 \u0641\u064A \u062A\u0639\u062F\u064A\u0644 \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0633\u0627\u0626\u0642",
        description: err instanceof Error ? err.message : typeof err === "string" ? err : JSON.stringify(err)
      });
    } finally {
      loading.value = false;
    }
  };
  const getSpecificDriver = (driverId) => {
    return drivers.value.find((driver) => driver.id === driverId);
  };
  const getSpecificDriverIndex = (driverId) => {
    return drivers.value.findIndex((driver) => driver.id === driverId);
  };
  const driverStudentsCount = (driverId) => {
    var _a;
    return (_a = driversWithStudentsCount.value.find(
      (driver) => driver.id === driverId
    )) == null ? void 0 : _a.studentsCount;
  };
  const updatesDriverForStudents = async (studentIds, driverId) => {
    try {
      loading.value = true;
      const { data } = await api.put("/drivers/update-driver", {
        studentIds,
        driverId
      });
      console.log(data);
      toastSuccess({ title: "\u062A\u0645 \u062A\u0639\u064A\u064A\u0646 \u0633\u0627\u0626\u0642 \u0644\u0644\u0637\u0644\u0627\u0628 \u0628\u0646\u062C\u0627\u062D" });
      studentsStore.studentsData = studentsStore.studentsData.map(
        (student) => studentIds.includes(student.id || "") ? { ...student, driver_id: driverId } : student
      );
    } catch (error) {
      toastError({ title: "\u0641\u0634\u0644 \u0641\u064A \u062A\u0639\u064A\u064A\u0646 \u0627\u0644\u0633\u0627\u0626\u0642" });
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
    updatesDriverForStudents
  };
});

export { useDriversStore as u };
//# sourceMappingURL=drivers-BuRykaFo.mjs.map
