import type { EmployeeAbsenceReport, Filters } from "~/types";
import { defineStore } from "pinia";
import { useAppToast } from "@/composables/useAppToast";

export const useEmployeeAbsenceReport = defineStore(
  "employeeAbsenceReport",
  () => {
    // init
    const client = useSupabaseClient();
    const { toastSuccess, toastError } = useAppToast();

    // state
    const reports = ref<EmployeeAbsenceReport[]>([]);
    const reportsCount = ref(0);
    const loading = ref(false);

    // Getters
    const reportsData = computed(() => reports.value);
    const reportsCountData = computed(() => reportsCount.value);

    // Actions
    /**
     * جلب الطلاب من Supabase مع دعم التصفح والفلاتر
     * @param {number} pageNum
     * @param {number} pageSize
     * @param {Object} filters
     * @param {Object} forceRefresh
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
        // check if data is already fetched
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
        // !inner => so important -> only returns records that match both tables filters
        let query = client
          .from("employees_absence")
          .select(
            `id, employee_id, created_at, date, reason, excuse_status,
          employee:employees!inner(id, first_name, second_name, third_name, last_name, job_title)
          `,
            { count: "exact" }
          )
          .order("created_at", { ascending: false });

        // Apply firstName
        if (filters?.firstNameFilter) {
          query = query.eq("employee.first_name", filters?.firstNameFilter);
        }
        if (filters?.secondNameFilter) {
          query = query.eq("employee.second_name", filters?.secondNameFilter);
        }
        if (filters?.thirdNameFilter) {
          query = query.eq("employee.third_name", filters?.thirdNameFilter);
        }
        if (filters?.lastNameFilter) {
          query = query.eq("employee.last_name", filters?.lastNameFilter);
        }
        if (filters?.jobTitleFilter) {
          query = query.eq("employee.job_title", filters?.jobTitleFilter);
        }

        const { count, error: countError } = await query;
        reportsCount.value = count || 0;

        // Apply pagination
        query = query.range(start, end);

        const { data, error } = await query;
        console.log(data);
        if (countError) {
          throw new Error(countError.message);
        }
        if (error) {
          throw new Error(error.message);
        }

        if (forceRefresh) {
          reports.value = data as EmployeeAbsenceReport[];
        } else {
          // دمج البيانات الجديدة مع القديمة (تجنب التكرار باستخدام id)
          const existingIds = new Set(reports.value.map((report) => report.id));
          const newData = (data as EmployeeAbsenceReport[]).filter(
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
    const getReportById = async (reportId: number) => {
      try {
        loading.value = true;
        // const { data, status } = await api.get(`students/behavioral-issues/${reportId}`);

        let { data, error } = await client
          .from("employees_absence")
          .select("id, description")
          .eq("id", Number(reportId));

        if (error) {
          toastError({
            title: "حدث مشكلة في جلب التقرير",
          });
          throw Error("مشكلة في السيرفر");
        }

        return data && data.length > 0
          ? (data[0] as EmployeeAbsenceReport)
          : null;

        // toastSuccess({
        //   title: `:تم جلب الخطة بنجاح`,
        // });
      } catch (err) {
        toastError({
          title: "حدث مشكلة في جلب التقرير",
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
    const saveEmployeeAbsenceReport = async (report: EmployeeAbsenceReport) => {
      try {
        loading.value = true;

        const { data, error } = await client
          .from("employees_absence")
          .upsert(report as any, { onConflict: "id" })
          .select();

        if (error) {
          throw new Error(error.message);
        }

        // update report locally
        const reportIdx = getSpesificReportIndex(Number(report.id));
        if (reportIdx !== -1) {
          reports.value[reportIdx] = {
            ...reports.value[reportIdx],
            ...(data[0] as EmployeeAbsenceReport),
          };
        }

        toastSuccess({ title: "تم حفظ التقرير بنجاح" });
      } catch (err) {
        toastError({
          title: "خطأ في حفظ التقرير",
          description: (err as Error).message || "حدث خطأ غير متوقع",
        });
      } finally {
        loading.value = false;
      }
    };

    const deleteReport = async (reportId: number) => {
      try {
        loading.value = true;

        const { error } = await client
          .from("employees_absence")
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
      reportsCountData,

      // reports operations
      fetchReports,
      getReportById,

      saveEmployeeAbsenceReport,
      deleteReport,

      getSpesificReport,
      getSpesificReportIndex,
    };
  }
);
