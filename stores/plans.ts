import type { MonthlyPlan, Plan } from "~/types";
import { defineStore } from "pinia";
import { useAppToast } from "@/composables/useAppToast";

export const usePlansStore = defineStore("plans", () => {
  const studentsStore = useStudentStore();
  const { toastSuccess, toastError } = useAppToast();
  const plans = ref<Plan[]>([]);
  const loading = ref(false);
  const tableKey = ref(Math.random());

  const fetchPlans = async () => {
    loading.value = true;
    try {
      const { data } = await api.get("/plans");

      console.log(data);
      // set payments data to ref locally
      plans.value = data;
      toastSuccess({
        title: "تم تحميل الخطط بنجاح",
      });
      tableKey.value = Math.random();
    } catch (err) {
      toastError({
        title: "حدث مشكلة أثناء تحميل الخطط",
      });
      throw Error(err instanceof Error ? err.message : String(err));
    } finally {
      loading.value = false;
    }
  };
  const addPlan = async (plan: Plan) => {
    loading.value = true;

    try {
      const { data } = await api.post("/plans", {
        ...plan,
      });
      toastSuccess({
        title: `:تم إضافة الخطة بنجاح`,
      });
      console.log(data);
      // add student locally
      plans.value.unshift({
        ...plan,
      });
    } catch (err) {
      toastError({
        title: "حدث مشكلة في إضافة الخطة",
      });
      throw Error(err instanceof Error ? err.message : String(err));
    } finally {
      loading.value = false;
    }
  };
  const addMonthlyPlan = async (
    generalPlanId: number,
    monthlyPlan: MonthlyPlan
  ) => {
    loading.value = true;
    const newMonthlyPlan = {
      plan_id: generalPlanId,
      ...monthlyPlan,
    };
    try {
      const { data } = await api.post("/plans/months_plans", newMonthlyPlan);
      console.log(data);
      toastSuccess({
        title: `:تم إضافة الخطة بنجاح`,
      });
      // console.log(data);
      // add monthly plan locally
      const plan = plans.value.find((p) => p.id === generalPlanId);
      if (plan) {
        if (!plan.months_plans) {
          plan.months_plans = [];
        }
        plan.months_plans.push({
          ...data[0],
        });
        console.log(plans.value);
      }
    } catch (err) {
      toastError({
        title: "حدث مشكلة في إضافة الخطة",
      });
      throw Error(err instanceof Error ? err.message : String(err));
    } finally {
      loading.value = false;
    }
  };
  const deletePlan = async (planId: number) => {
    try {
      loading.value = true;
      await api.delete(`plans/${planId}`);

      toastSuccess({
        title: `:تم حذف الخطة بنجاح`,
      });
      // delete student locally
      const planIndex = getSpecificPlanIndex(planId);
      plans.value.splice(planIndex, 1);
    } catch (err) {
      toastError({
        title: "حدث مشكلة في حذف الخطة",
      });
    } finally {
      loading.value = false;
    }
  };
  const deleteMonthlyPlan = async (
    monthlyPlanId: number,
    generalPlanId: number
  ) => {
    try {
      loading.value = true;
      await api.delete(`plans/months_plans/${monthlyPlanId}`);

      toastSuccess({
        title: `:تم حذف الخطة بنجاح`,
      });
      // delete plan locally
      const plan = getSpecificPlan(generalPlanId);
      const planIndex = getSpecificPlanIndex(generalPlanId);

      if (plan && plan.months_plans) {
        const monthlyPlanIndex = plan.months_plans.findIndex(
          (monthlyPlan) => monthlyPlan.id === monthlyPlanId
        );
        if (monthlyPlanIndex !== -1) {
          plans.value[planIndex]?.months_plans?.splice(monthlyPlanIndex, 1);
        }
      }
    } catch (err) {
      toastError({
        title: "حدث مشكلة في حذف الخطة",
      });
    } finally {
      loading.value = false;
    }
  };
  const updatePlan = async (planId: number, newPlan: Plan) => {
    try {
      loading.value = true;
      const cleaned = removeInvalidFields(newPlan);
      const { data } = await api.put(`/plans/${planId}`, cleaned);

      toastSuccess({
        title: `:تم تحديث بيانات الخطة بنجاح`,
      });

      console.log(data);

      // update plan locally
      const targetedPlanIndex = getSpecificPlanIndex(planId);
      const targetedPlan = getSpecificPlan(planId);

      plans.value[targetedPlanIndex] = {
        ...targetedPlan,
        ...data[0],
      };
    } catch (err) {
      toastError({
        title: "حدث مشكلة في تعديل بيانات الخطة",
      });
      throw Error(err instanceof Error ? err.message : String(err));
    } finally {
      loading.value = false;
    }
  };
  const getPlanById = async (planId: number) => {
    try {
      loading.value = true;
      const { data, status } = await api.get(`plans/${planId}`);

      if (status !== 200) {
        toastError({
          title: "حدث مشكلة في جلب الخطة",
        });
        throw Error("مشكلة في السيرفر");
      }

      toastSuccess({
        title: `:تم جلب الخطة بنجاح`,
      });
      return data[0];
    } catch (err) {
      // toastError({
      //   title: "حدث مشكلة في جلب الدفعة",
      // });
    } finally {
      loading.value = false;
    }
  };
  const getSpecificPlan = (planId: number) => {
    return plans.value.find((plan) => plan.id === planId);
  };
  const getSpecificPlanIndex = (planId: number) => {
    return plans.value.findIndex((plan) => plan.id === planId);
  };

  const assignPlanToStudents = async (studentIds: string[], planId: number) => {
    try {
      loading.value = true;
      const { data } = await api.post("/plans/assign", {
        planId,
        studentIds,
      });

      toastSuccess({ title: "تم تعيين الخطة للطلاب بنجاح" });

      // update studentsData locally
      studentsStore.studentsData = studentsStore.studentsData.map((student) =>
        studentIds.includes(student.id || "")
          ? { ...student, plan_id: planId }
          : student
      );
    } catch (error) {
      toastError({ title: "فشل تعيين الخطة", description: String(error) });
    } finally {
      loading.value = false;
    }
  };

  // helper methods
  function removeInvalidFields(plan: Plan): Partial<Plan> {
    const allowedFields = [
      "id",
      "stage",
      "total_pages",
      "semester",
      "year",
      "created_at",
    ];

    return Object.fromEntries(
      Object.entries(plan).filter(([key]) => allowedFields.includes(key))
    );
  }
  // Getters
  const plansData = computed(() => plans.value);

  return {
    // data
    plans,
    loading,
    tableKey,
    // Actions
    fetchPlans,
    addPlan,
    addMonthlyPlan,
    deletePlan,
    updatePlan,
    getSpecificPlan,
    getSpecificPlanIndex,
    getPlanById,

    // months_plans
    deleteMonthlyPlan,

    assignPlanToStudents,
    // Getters
    plansData,
  };
});
