import type { Filters, MonthlyPlan, Plan, Student } from "~/types";
import { defineStore } from "pinia";
import { useAppToast } from "@/composables/useAppToast";

export const usePlansStore = defineStore("plans", () => {
  const studentsStore = useStudentStore();
  const client = useSupabaseClient();
  const { toastSuccess, toastError } = useAppToast();
  const plans = ref<Plan[]>([]);
  const plansCount = ref(0);
  const monthsPlans = ref<MonthlyPlan[]>([]);
  // const plansIsLoaded = ref(false);
  const monthsPlansIsLoaded = ref(false);
  const loading = ref(false);
  const tableKey = ref(Math.random());

  const fetchPlans = async (
    pageNum: number = 1,
    pageSize: number = 10,
    filters?: Filters,
    forceRefresh: boolean = false
  ): Promise<void> => {
    const start = (pageNum - 1) * pageSize; // بداية النطاق
    const end = start + pageSize - 1; // نهاية النطاق
    // Check if any filter is applied
    // const isFilterApplied =
    //   filters?.firstNameFilter ||
    //   filters?.secondNameFilter ||
    //   filters?.thirdNameFilter ||
    //   filters?.lastNameFilter ||
    //   filters?.jobTitleFilter;

    // Force refresh if filters are applied or forceRefresh is explicitly true
    // const shouldForceRefresh = forceRefresh || isFilterApplied;
    const shouldForceRefresh = forceRefresh;

    if (!shouldForceRefresh) {
      console.log("force Refresh", forceRefresh);
      const hasEnoughData = plans.value.length > start;
      if (hasEnoughData) {
        const slicedData = plans.value.slice(start, end + 1);
        if (slicedData.length >= Math.min(pageSize, plansCount.value - start)) {
          console.log(`Using cached data for page ${pageNum}`);
          return;
        }
      }
    }

    try {
      loading.value = true;

      let query = client
        .from("plans")
        .select(
          "*, months_plans(id,month:months(id, name), pages, month_id), semester:semesters(id,name,year), level:levels(title)",
          { count: "exact" }
        )
        .order("total_pages", { ascending: false });

      // Apply filtering based on students_type, academic_class_id and semester_id
      if (filters?.semesterFilter) {
        query = query.eq("semester_id", filters.semesterFilter);
      }
      if (filters?.studentsTypeFilter) {
        query = query.eq("students_type", filters.studentsTypeFilter);
      }
      if (filters?.levelFilter) {
        query = query.eq("level_id", filters.levelFilter);
      }

      const { count, error: countError } = await query;
      if (countError) {
        throw createError({ statusCode: 500, message: countError.message });
      }
      plansCount.value = count || 0;

      // apply pagination
      query = query.range(start, end);

      const { data, error } = await query;
      console.log(data);
      if (error) {
        throw new Error(error.message);
      }
      if (forceRefresh) {
        plans.value = data as Plan[];
      } else {
        // دمج البيانات الجديدة مع القديمة (تجنب التكرار باستخدام id)
        const existingIds = new Set(plans.value.map((plan) => plan.id));
        const newData = (data as Plan[]).filter(
          (plan) => !existingIds.has(plan.id)
        );
        // set plans data
        plans.value = [...plans.value, ...newData];
      }
    } catch (err) {
      toastError({
        title: "خطأ في جلب الخطط",
        description: (err as Error).message || "حدث خطأ غير متوقع",
      });
      plans.value = [];
    } finally {
      loading.value = false;
    }
  };
  const addPlan = async (plan: Plan) => {
    loading.value = true;

    try {
      // check is plan in exist
      let { count, error: isExistError } = await client
        .from("plans")
        .select("*", { count: "exact", head: true })
        .eq("level_id", Number(plan.level_id))
        .eq("semester_id", Number(plan.semester_id))
        .eq("students_type", String(plan.students_type));

      if (isExistError) {
        throw isExistError;
      }

      if (count) {
        toastError({
          title: "هذه الخطة موجودة بالفعل",
        });
        return;
      }
      // save plan in DB
      const savedPlan = await savePlan(plan);
      // add plan locally
      plans.value.unshift(savedPlan);
      await navigateTo({ name: "plans" });
    } catch (err) {
      toastError({
        title: "حدث مشكلة في إضافة الخطة",
      });
      throw Error(err instanceof Error ? err.message : String(err));
    } finally {
      loading.value = false;
    }
  };
  const savePlan = async (plan: Plan) => {
    loading.value = true;
    try {
      const { data, error } = await client
        .from("plans")
        .upsert(plan, { onConflict: "id" })
        .select(
          "*, months_plans(id,month:months(id, name), pages), semester:semesters(id,name,year), level:levels(title)"
        );
      console.log("plan data: ", data);
      // const { data } = await api.post("/plans", {
      //   ...plan,
      // });
      // toastSuccess({
      //   title: `:تم إضافة الخطة بنجاح`,
      // });

      return data[0];
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
      if (!confirm("هل أنت متأكد من حذف الخطة؟")) return;

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
      // const cleaned = removeInvalidFields(newPlan);
      const targetedPlan = (await savePlan({ ...newPlan, id: planId })) as Plan;
      // const { data } = await api.put(`/plans/${planId}`, cleaned);

      toastSuccess({
        title: `:تم تحديث بيانات الخطة بنجاح`,
      });

      // update plan locally
      const targetedPlanIndex = getSpecificPlanIndex(planId);
      // const targetedPlan = getSpecificPlan(planId);

      if (targetedPlanIndex !== -1) {
        plans.value[targetedPlanIndex] = {
          ...targetedPlan,
        };
      }
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
        .select(
          "*, plan:plans(id, semester:semesters(id, year, name), students_type, level:levels(id,title)), month:months(id,name)"
        );

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
      const generalPlanResult = await getPlanById(generalPlanId);
      const generalPlan = generalPlanResult as Plan | undefined;

      console.log("generalPlan", generalPlan);

      const mpIdx = generalPlan?.months_plans?.findIndex(
        (mp) =>
          mp.plan_id === generalPlanId && mp.month_id === monthlyPlan.month_id
      );

      if (mpIdx !== -1) {
        toastError({
          title: "هذه الخطة موجودة بالفعل",
        });
        return;
      }

      const { data } = await api.post("/plans/months_plans", newMonthlyPlan);

      toastSuccess({
        title: `:تم إضافة الخطة بنجاح`,
      });

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
        // studentsStore.studentsData = studentsStore.studentsData.map(
        //   (student: Student) => {
        //     if (
        //       student.plan_id === generalPlanId &&
        //       student.plan &&
        //       Array.isArray(student.plan.months_plans)
        //     ) {
        //       return {
        //         ...student,
        //         plan: {
        //           ...student.plan,
        //           months_plans: [...student.plan.months_plans, data[0]],
        //         },
        //       };
        //     }
        //     return student;
        //   }
        // );
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
      if (!confirm("هل أنت متأكد من حذف الخطة الشهرية؟")) return;
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
      // const { data, status } = await api.get(`plans/${planId}`);

      let { data, error } = await client
        .from("plans")
        // .select(
        //   "*, months_plans(id, month_id, month:months(id, name), pages, plan_id)"
        // )
        .select()
        .eq("id", Number(planId));

      if (error) {
        toastError({
          title: "حدث مشكلة في جلب الخطة",
        });
        throw Error("مشكلة في السيرفر");
      }

      return data && data.length ? (data[0] as Plan) : undefined;

      // toastSuccess({
      //   title: `:تم جلب الخطة بنجاح`,
      // });
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
  // function removeInvalidFields(plan: Plan): Partial<Plan> {
  //   const allowedFields = [
  //     "id",
  //     "stage",
  //     "total_pages",
  //     "semester",
  //     "students_type",
  //     "year",
  //     "created_at",
  //   ];

  //   return Object.fromEntries(
  //     Object.entries(plan).filter(([key]) => allowedFields.includes(key))
  //   );
  // }
  // Getters
  const plansData = computed(() => plans.value);
  const monthsPlansData = computed(() => monthsPlans.value);
  const plansCountData = computed(() => plansCount.value);
  return {
    // data
    plans,
    plansCountData,
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
