import type { MonthlyPlan, Plan, Student } from "~/types";
import { defineStore } from "pinia";
import { useAppToast } from "@/composables/useAppToast";

export const usePlansStore = defineStore("plans", () => {
  const studentsStore = useStudentStore();
  const client = useSupabaseClient();
  const { toastSuccess, toastError } = useAppToast();
  const plans = ref<Plan[]>([]);
  const monthsPlans = ref<MonthlyPlan[]>([]);
  const plansIsLoaded = ref(false);
  const monthsPlansIsLoaded = ref(false);
  const loading = ref(false);
  const tableKey = ref(Math.random());

  const fetchPlans = async () => {
    try {
      if (plansIsLoaded.value) return; // تجنب الجلب أكثر من مرة
      loading.value = true;

      const { data } = await api.get("/plans");
      // set payments data to ref locally
      plans.value = data;
      toastSuccess({
        title: "تم تحميل الخطط بنجاح",
      });
      plansIsLoaded.value = true;
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
      // check is plan in exist
      plans.value.find(
        (p) =>
          p.stage === plan.stage &&
          p.semester === plan.semester &&
          p.students_type === plan.students_type &&
          p.year === plan.year
      );
      if (
        plans.value.find(
          (p) =>
            p.stage === plan.stage &&
            p.semester === plan.semester &&
            p.students_type === plan.students_type &&
            p.year === plan.year
        )
      ) {
        toastError({
          title: "هذه الخطة موجودة بالفعل",
        });
        return;
      }

      const { data } = await api.post("/plans", {
        ...plan,
      });
      toastSuccess({
        title: `:تم إضافة الخطة بنجاح`,
      });
      // console.log(data);
      // add plan locally
      plans.value.unshift({
        ...data[0],
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
  const updatePlan = async (planId: number, newPlan: Plan) => {
    try {
      loading.value = true;
      const cleaned = removeInvalidFields(newPlan);
      const { data } = await api.put(`/plans/${planId}`, cleaned);

      toastSuccess({
        title: `:تم تحديث بيانات الخطة بنجاح`,
      });

      // console.log(data);

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
  const fetchMonthsPlans = async () => {
    loading.value = true;
    if (monthsPlansIsLoaded.value) return;
    try {
      const { data, error } = await client
        .from("months_plans")
        .select("*, plan:plan_id(id,stage, semester, year, students_type)");

      // set payments data to ref locally
      if (error) throw Error;

      toastSuccess({
        title: "تم تحميل الخطط الشهرية بنجاح",
      });
      // console.log("months plans: ", data);
      monthsPlansIsLoaded.value = true;
      monthsPlans.value = data;
      return data;
    } catch (err) {
      toastError({
        title: "حدث مشكلة أثناء تحميل الخطط الشهرية",
      });
    } finally {
      loading.value = false;
    }
  };
  const addMonthlyPlan = async (
    generalPlanId: number,
    monthlyPlan: MonthlyPlan
  ) => {
    const newMonthlyPlan = {
      plan_id: generalPlanId,
      ...monthlyPlan,
    };
    try {
      loading.value = true;
      // check if monthly plan in general plan is exist
      if (
        plans.value
          .find((plan) => plan.id === generalPlanId)
          ?.months_plans?.find(
            (monthPlan) => monthPlan.month === monthlyPlan.month
          )
      ) {
        toastError({
          title: "هذه الخطة موجودة بالفعل",
        });
        return;
      }

      const { data } = await api.post("/plans/months_plans", newMonthlyPlan);
      // console.log(data);
      toastSuccess({
        title: `:تم إضافة الخطة بنجاح`,
      });
      console.log(data);
      // add monthly plan locally
      const plan = plans.value.find((p) => p.id === generalPlanId);
      if (plan) {
        if (!plan.months_plans) {
          plan.months_plans = [];
        }
        plan.months_plans.push({
          ...data[0],
        });
        // update the students monthly plan
        studentsStore.studentsData = studentsStore.studentsData.map(
          (student: Student) => {
            if (
              student.plan_id === generalPlanId &&
              student.plan &&
              Array.isArray(student.plan.months_plans)
            ) {
              return {
                ...student,
                plan: {
                  ...student.plan,
                  months_plans: [...student.plan.months_plans, data[0]],
                },
              };
            }
            return student;
          }
        );
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
  const updateMonthlyPlan = async (
    monthlyPlanId: number,
    generalPlanId: number,
    newPlan: MonthlyPlan
  ) => {
    try {
      loading.value = true;
      const { data } = await api.put(
        `/plans/months_plans/${monthlyPlanId}`,
        newPlan
      );

      toastSuccess({
        title: `:تم تحديث بيانات الخطة بنجاح`,
      });

      // console.log(data);

      // update plan locally
      const plan = plans.value.find((p) => p.id === generalPlanId);
      if (plan && plan.months_plans) {
        const monthlyPlanIndex = plan.months_plans.findIndex(
          (monthlyPlan) => monthlyPlan.id === monthlyPlanId
        );
        if (monthlyPlanIndex !== -1) {
          plan.months_plans[monthlyPlanIndex] = {
            ...data[0],
            ...newPlan,
          };
        }
      }
      // update the students monthly plan
      studentsStore.studentsData = studentsStore.studentsData.map(
        (student: Student) => {
          if (
            student.plan_id === generalPlanId &&
            student.plan &&
            Array.isArray(student.plan.months_plans)
          ) {
            return {
              ...student,
              plan: {
                ...student.plan,
                months_plans: student.plan.months_plans.map((mp) =>
                  mp.id === monthlyPlanId ? { ...mp, ...data[0] } : mp
                ),
              },
            };
          }
          return student;
        }
      );
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
      studentsStore.studentsData = studentsStore.studentsData
        .map((student) =>
          studentIds.includes(student.id || "")
            ? { ...student, plan_id: planId }
            : student
        )
        .sort((a, b) => (a.first_name || "").localeCompare(b.first_name || ""));
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
      "students_type",
      "year",
      "created_at",
    ];

    return Object.fromEntries(
      Object.entries(plan).filter(([key]) => allowedFields.includes(key))
    );
  }
  // Getters
  const plansData = computed(() => plans.value);
  const monthsPlansData = computed(() => monthsPlans.value);

  return {
    // data
    plans,
    loading,
    tableKey,
    // Actions
    fetchPlans,
    fetchMonthsPlans,
    addPlan,
    addMonthlyPlan,
    deletePlan,
    updatePlan,
    getSpecificPlan,
    getSpecificPlanIndex,
    getPlanById,

    // months_plans
    deleteMonthlyPlan,
    updateMonthlyPlan,

    assignPlanToStudents,
    // Getters
    plansData,
    monthsPlansData,
  };
});
