import type { EmployeeLoan, Filters } from "~/types";

import { defineStore } from "pinia";
import { useAppToast } from "@/composables/useAppToast";

export const useLoansStore = defineStore("loans", () => {
  // init
  const client = useSupabaseClient();
  const { toastSuccess, toastError } = useAppToast();
  const employeesStore = useEmployeesStore();
  // state
  const reports = ref<EmployeeLoan[]>([]);
  const reportsCount = ref(0);
  const loading = ref(false);

  // Getters
  const reportsData = computed(() => reports.value);
  const reportsCountData = computed(() => reportsCount.value);
  const sortedReports = computed(() => {
    // return studentsData.value;
    return reportsData.value
      .slice()
      .sort((a: EmployeeLoan, b: EmployeeLoan) => {
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
    filters?: Filters,
    forceRefresh: boolean = false
  ): Promise<void> => {
    const start = (pageNum - 1) * pageSize;
    const end = start + pageSize - 1;

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
        .from("employees_loans")
        .select(
          `id, employee_id, semester_id, amount, notes, status, created_at,updated_at,
          employee:employees(id, first_name, second_name, third_name, last_name, identity_number),
          month:months(id, name)
          `,
          { count: "exact" }
        )
        .order("id", { ascending: false });

      // Apply filtering based on month_id and semester_id
      if (filters?.monthFilter) {
        query = query.eq("month_id", filters?.monthFilter);
      }
      // Apply filtering based on semester_id
      if (filters?.semesterFilter) {
        query = query.eq("semester_id", filters?.semesterFilter);
      }
      // Apply filtering based on semester_id
      if (filters?.statusFilter) {
        query = query.eq("status", filters?.statusFilter);
      }
      if (filters?.dateFilter) {
        const startOfDay = `${filters?.dateFilter}T00:00:00.000Z`;
        const endOfDay = `${filters?.dateFilter}T23:59:59.999Z`;
        query = query.gte("created_at", startOfDay).lte("created_at", endOfDay);
      }
      const { count, error: countError } = await query;

      // Apply pagination
      query = query.range(start, end);

      const { data, error } = await query;
      if (countError) {
        throw new Error(countError.message);
      }
      if (error) {
        throw new Error(error.message);
      }

      reportsCount.value = count || 0;

      if (forceRefresh) {
        reports.value = data as EmployeeLoan[];
      } else {
        // دمج البيانات الجديدة مع القديمة (تجنب التكرار باستخدام id)
        const existingIds = new Set(reports.value.map((report) => report.id));
        const newData = (data as EmployeeLoan[]).filter(
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
  //       .from("employees_loans")
  //       .select("*", { count: "exact", head: true });

  //     // Apply filtering based on month_id
  //     if (filters.monthFilter) {
  //       query = query.eq("month_id", filters.monthFilter);
  //     }

  //     // Apply filtering based on semester_id
  //     if (filters.semesterFilter) {
  //       query = query.eq("semester_id", filters.semesterFilter);
  //     }
  //     // Apply filtering based on status
  //     if (filters.statusFilter) {
  //       query = query.eq("status", filters.statusFilter);
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

  const getSpesificReport = (reportId: number) => {
    return reports.value?.find((report) => report.id === reportId);
  };
  const getSpesificReportIndex = (reportId: number) => {
    return reports.value?.findIndex((report) => report.id === reportId);
  };
  const saveLoanReport = async (report: EmployeeLoan) => {
    try {
      let newReport;
      loading.value = true;
      if (report.status === "غير مدفوع") {
        const { updated_at, ...rest } = report;
        newReport = rest;
      } else {
        newReport = report;
      }

      // Extract date part only (YYYY-MM-DD)
      // let reportToSend: EmployeeLoan = { ...report };

      // if (reportToSend.date) {
      //   const date = new Date(reportToSend.date);
      //   const year = date.getFullYear();
      //   const month = String(date.getMonth() + 1).padStart(2, "0");
      //   const day = String(date.getDate()).padStart(2, "0");

      //   reportToSend.date = new Date(`${year}-${month}-${day}`);
      // }

      const { data, error } = await client
        .from("employees_loans")
        .upsert(newReport as any, { onConflict: "id" })
        .select();

      if (error) {
        throw new Error(error.message);
      }

      // update loan locally
      const reportIdx = getSpesificReportIndex(Number(report.id));
      if (reportIdx !== -1) {
        reports.value[reportIdx] = {
          ...reports.value[reportIdx],
          ...(data[0] as EmployeeLoan),
        };
      }

      toastSuccess({ title: "تم حفظ السلفة بنجاح" });
    } catch (err) {
      toastError({
        title: "خطأ في حفظ السلفة",
        description: (err as Error).message || "حدث خطأ غير متوقع",
      });
    } finally {
      loading.value = false;
    }
  };
  const updateLoanReport = async (report: EmployeeLoan) => {
    try {
      const { month, ...reset } = report;

      const { data, error } = await client
        .from("employees_loans")
        .upsert(reset as any, {
          onConflict: ["employee_id", "month_id"],
        })
        .select();

      if (error) {
        throw new Error(error.message);
      }

      // update report locally
      const targetedReportIndex = getSpesificReportIndex(report.id ?? 0);

      reports.value[targetedReportIndex] = {
        ...reports.value[targetedReportIndex],
        ...(data[0] as EmployeeLoan),
      };

      toastSuccess({ title: "تم تحديث تقرير الراتب بنجاح" });
    } catch (err) {
      toastError({
        title: "خطأ في تحديث تقرير الراتب",
        description: (err as Error).message || "حدث خطأ غير متوقع",
      });
      throw err;
    }
  };
  const deleteReport = async (reportId: number) => {
    try {
      loading.value = true;

      const { error } = await client
        .from("employees_loans")
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

  return {
    // state
    loading,

    // Getters
    reportsData,
    sortedReports,
    reportsCountData,

    // reports operations
    fetchReports,
    // fetchStudentsByAcademicClassIdAndMonthId,
    // getReportsCount,

    saveLoanReport,
    updateLoanReport,
    deleteReport,

    getSpesificReport,
    getSpesificReportIndex,
  };
});
