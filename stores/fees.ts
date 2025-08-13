import type {
  Student,
  QuranAchievementReport,
  FeesReport,
  Filters,
} from "~/types";

import { defineStore } from "pinia";
import { useAppToast } from "@/composables/useAppToast";

export const useFeesStore = defineStore("fees", () => {
  // init
  const client = useSupabaseClient();
  const { toastSuccess, toastError } = useAppToast();

  // state
  const reports = ref<FeesReport[]>([]);
  const reportsCount = ref(0);
  const loading = ref(false);

  // Getters
  const reportsData = computed(() => reports.value);
  const reportsCountData = computed(() => reportsCount.value);
  const sortedReports = computed(() => {
    // return studentsData.value;
    return reportsData.value
      .slice()
      .sort((a: QuranAchievementReport, b: QuranAchievementReport) => {
        // Convert created_at strings to Date objects, default to a very old date if null/undefined
        const dateA = a.created_at ? new Date(a.created_at) : new Date(0); // Epoch if null
        const dateB = b.created_at ? new Date(b.created_at) : new Date(0); // Epoch if null
        return dateB.getTime() - dateA.getTime(); // Descending order (newest first)
      });
  });

  // Actions
  /**
   * جلب الطلاب من Supabase مع دعم التصفح والفلاتر
   * @param {number} pageNum - رقم الصفحة (يبدأ من 1)
   * @param {number} pageSize - عدد السجلات لكل صفحة
   * @param {Object} filters - الفلاتر المطبقة (اختيارية)
   * @param {Object} forceRefresh - تحديث إجباري (اختيارية)
   * @returns {Promise<void>}
   */
  const fetchReports = async (
    pageNum: number = 1,
    pageSize: number = 10,
    filters: Filters,
    forceRefresh: boolean = false
  ): Promise<void> => {
    const start = (pageNum - 1) * pageSize; // بداية النطاق
    const end = start + pageSize - 1; // نهاية النطاق

    // Check if any filter is applied
    // const isFilterApplied =
    //   filters.academicClassFilter || filters.monthlyPlanFilter;

    // Force refresh if filters are applied or forceRefresh is explicitly true
    const shouldForceRefresh = forceRefresh;

    if (!shouldForceRefresh) {
      // التحقق مما إذا كانت البيانات موجودة بالفعل
      const hasEnoughData = reportsData.value.length > start;
      if (hasEnoughData) {
        const slicedData = reportsData.value.slice(start, end + 1);
        if (
          slicedData.length >= Math.min(pageSize, reportsCount.value - start)
        ) {
          console.log(`Using cached data for page ${pageNum}`);
          return;
        }
      }
    }
    try {
      loading.value = true;
      let query = client
        .from("student_monthly_fees")
        .select(
          `id, student_id, fees, amount, status, notes, created_at,updated_at,
          student:students(id, first_name, second_name, third_name, last_name, identity_number, academic_class_id, academic_class:academic_classes(id, title, group)),
          month:months(id, name)
          `,
          { count: "exact" }
        )
        .order("id", { ascending: false });

      // Apply filtering based on academic_class_id
      if (filters.academicClassFilter) {
        const { data: studentIds, error: studentError } = await client
          .from("students")
          .select("id")
          .eq("academic_class_id", filters.academicClassFilter);

        if (studentError) {
          throw new Error(studentError.message);
        }

        const validStudentIds = studentIds.map(
          (student: Student) => student.id
        );
        if (validStudentIds.length > 0) {
          query = query.in("student_id", validStudentIds);
        } else {
          reports.value = [];
          loading.value = false;
          return;
        }
      }

      // Apply filtering based on monthly_plan_id
      if (filters.monthFilter) {
        query = query.eq("month_id", filters.monthFilter);
      }
      if (filters.semesterFilter) {
        query = query.eq("semester_id", filters.semesterFilter);
      }
      if (filters.dateFilter) {
        const startOfDay = `${filters.dateFilter}T00:00:00.000Z`;
        const endOfDay = `${filters.dateFilter}T23:59:59.999Z`;
        query = query.gte("created_at", startOfDay).lte("created_at", endOfDay);
      }

      const { count, error: countError } = await query;
      // Apply Pagination
      query = query.range(start, end);
      const { data, error } = await query;
      if (error) {
        throw new Error(error.message);
      }

      reportsCount.value = count || 0;

      if (forceRefresh) {
        reports.value = data as FeesReport[];
      } else {
        // دمج البيانات الجديدة مع القديمة (تجنب التكرار باستخدام id)
        const existingIds = new Set(reports.value.map((report) => report.id));
        const newData = (data as FeesReport[]).filter(
          (report) => !existingIds.has(report.id)
        );
        // set reports data
        reports.value = [...reports.value, ...newData];
      }
    } catch (err) {
      toastError({
        title: "خطأ في جلب التقارير",
        description: (err as Error).message || "حدث خطأ غير متوقع",
      });
      reports.value = [];
    } finally {
      loading.value = false;
    }
  };
  // const getReportsCount = async (filters: Filters): Promise<void> => {
  //   try {
  //     loading.value = true;
  //     let query = client
  //       .from("student_monthly_fees")
  //       .select("*", { count: "exact", head: true });

  //     // Apply filtering based on academic_class_id
  //     if (filters.academicClassFilter) {
  //       const { data: studentIds, error: studentError } = await client
  //         .from("students")
  //         .select("id")
  //         .eq("academic_class_id", filters.academicClassFilter);

  //       if (studentError) {
  //         throw new Error(studentError.message);
  //       }

  //       const validStudentIds = studentIds.map(
  //         (student: Student) => student.id
  //       );
  //       if (validStudentIds.length > 0) {
  //         query = query.in("student_id", validStudentIds);
  //       } else {
  //         reports.value = [];
  //         loading.value = false;
  //         return;
  //       }
  //     }

  //     // Apply filtering based on month_id
  //     if (filters.monthFilter) {
  //       query = query.eq("month_id", filters.monthFilter);
  //     }
  //     const { count, error } = await query;

  //     if (error) {
  //       throw createError({ statusCode: 500, message: error.message });
  //     }
  //     reportsCount.value = count || 0;
  //   } catch (err) {
  //     toastError({ title: "خطأ في جلب عدد التقارير" });
  //   } finally {
  //     loading.value = false;
  //   }
  // };
  const fetchStudentsByAcademicClassIdAndMonthId = async (
    academicClassId: number,
    monthId?: number
  ) => {
    loading.value = true;
    let students: Student[] = [];

    try {
      let query = client
        .from("students")
        .select(
          "id, first_name, second_name, third_name, last_name, months_fees:student_monthly_fees(*)"
        )
        .eq("academic_class_id", academicClassId)
        .order("id", { ascending: true });

      const { data, error } = await query;

      if (error) {
        throw new Error(error.message);
      }
      console.log(data);
      // تصفية الطلاب الذين ليس لديهم رسوم لهذا الشهر
      if (monthId) {
        students = data.filter((student: Student) => {
          return !student?.months_fees?.some(
            (report) => report.month_id === monthId
          );
        });
      } else {
        students = data;
      }

      // studentsCount.value = studentsData.value.length;
      console.log("Fetched students by academic class and month :", students);
      toastSuccess({ title: "تم جلب الطلاب بنجاح" });
      return students;
    } catch (err) {
      toastError({
        title: "خطأ في جلب الطلاب",
        description: (err as Error).message || "حدث خطأ غير متوقع",
      });
    } finally {
      loading.value = false;
    }
  };
  const getSpesificReport = (reportId: number) => {
    return reports.value?.find((report) => report.id === reportId);
  };
  const getSpesificReportIndex = (reportId: number) => {
    return reports.value?.findIndex((report) => report.id === reportId);
  };
  const saveFeesReports = async (newReports: FeesReport[]) => {
    try {
      const { error } = await client
        .from("student_monthly_fees")
        .upsert(newReports, {
          onConflict: ["student_id", "month_id"],
        });

      if (error) {
        throw new Error(error.message);
      }

      toastSuccess({ title: "تم حفظ تقارير الإنجاز بنجاح" });
    } catch (err) {
      toastError({
        title: "خطأ في حفظ تقارير الإنجاز",
        description: (err as Error).message || "حدث خطأ غير متوقع",
      });
    }
  };
  const updateFeesReport = async (report: FeesReport) => {
    try {
      const { month, ...reset } = report;

      const { data, error } = await client
        .from("student_monthly_fees")
        .upsert(reset, {
          onConflict: ["student_id", "month_id"],
        })
        .select();

      if (error) {
        throw new Error(error.message);
      }

      // update report locally
      const targetedReportIndex = getSpesificReportIndex(report.id ?? 0);

      reports.value[targetedReportIndex] = {
        ...reports.value[targetedReportIndex],
        ...(data[0] as FeesReport),
      };

      toastSuccess({ title: "تم تحديث تقرير الرسوم بنجاح" });
    } catch (err) {
      toastError({
        title: "خطأ في تحديث تقرير الرسوم",
        description: (err as Error).message || "حدث خطأ غير متوقع",
      });
      throw err;
    }
  };
  const deleteReport = async (reportId: number) => {
    try {
      loading.value = true;

      const { error } = await client
        .from("student_monthly_fees")
        .delete()
        .eq("id", reportId);

      if (error) {
        throw new Error(error.message);
      }

      const reportIdx = getSpesificReportIndex(reportId);
      reports.value.splice(reportIdx, 1);

      toastSuccess({ title: "تم حذف التقرير بنجاح" });
    } catch (err) {
      toastError({
        title: "خطأ في حذف التقرير",
        description: (err as Error).message || "حدث خطأ غير متوقع",
      });
    } finally {
      loading.value = false;
    }
  };
  // helper Methods
  // function removeInvalidFields(student: Student): Partial<Student> {
  //   const allowedFields = [
  //     "id",
  //     "first_name",
  //     "second_name",
  //     "third_name",
  //     "last_name",
  //     "identity_number",
  //     "father_identity_number",
  //     "phone_number",
  //     "birth_date",
  //     "level_id",
  //     "masjed",
  //     "address",
  //     "memorization_status",
  //     "memorized_juz",
  //     "daily_recitation",
  //     "class_group",
  //     "created_at",
  //   ];

  //   return Object.fromEntries(
  //     Object.entries(student).filter(([key]) => allowedFields.includes(key))
  //   );
  // }
  return {
    // state
    loading,

    // Getters
    reportsData,
    sortedReports,
    reportsCountData,

    // reports operations
    fetchReports,
    fetchStudentsByAcademicClassIdAndMonthId,
    // getReportsCount,

    saveFeesReports,
    updateFeesReport,
    deleteReport,

    getSpesificReport,
    getSpesificReportIndex,
  };
});
