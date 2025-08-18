import { students } from "./../constants";
import type { BehavioralIssue, EmployeeLoan, Filters, Student } from "~/types";
import { defineStore } from "pinia";
import { useAppToast } from "@/composables/useAppToast";

export const useStudentBehavioralIssues = defineStore(
  "studentBehavioralIssues",
  () => {
    // init
    const client = useSupabaseClient();
    const { toastSuccess, toastError } = useAppToast();

    // state
    const reports = ref<BehavioralIssue[]>([]);
    const reportsCount = ref(0);
    const loading = ref(false);

    // Getters
    const reportsData = computed(() => reports.value);
    const reportsCountData = computed(() => reportsCount.value);
    const sortedReports = computed(() => {
      return reportsData.value
        .slice()
        .sort((a: BehavioralIssue, b: BehavioralIssue) => {
          // Convert created_at strings to Date objects, default to a very old date if null/undefined
          const dateA = a.created_at ? new Date(a.created_at) : new Date(0); // Epoch if null
          const dateB = b.created_at ? new Date(b.created_at) : new Date(0); // Epoch if null
          return dateB.getTime() - dateA.getTime(); // Descending order (newest first)
        });
    });

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
          .from("students_behavioral_issues")
          .select(
            `id, student_id, created_at, description,
          student:students!inner(id, first_name, second_name, third_name, last_name, identity_number, academic_class_id, academic_class:academic_classes(id, title, group), level_id, level:levels(id,title))
          `,
            { count: "exact" }
          )
          .order("id", { ascending: false });

        // Apply academic_class_id filter using a subquery
        if (filters?.academicClassFilter) {
          query = query.eq(
            "student.academic_class_id",
            filters?.academicClassFilter
          );
        }
        if (filters?.levelFilter) {
          query = query.eq("student.level_id", filters?.levelFilter);
        }
        if (filters?.firstNameFilter) {
          query = query.eq("student.first_name", filters?.firstNameFilter);
        }
        if (filters?.secondNameFilter) {
          query = query.eq("student.second_name", filters?.secondNameFilter);
        }
        if (filters?.thirdNameFilter) {
          query = query.eq("student.third_name", filters?.thirdNameFilter);
        }
        if (filters?.lastNameFilter) {
          query = query.eq("student.last_name", filters?.lastNameFilter);
        }
        if (filters?.identityNumberFilter) {
          query = query.eq(
            "student.identity_number",
            filters?.identityNumberFilter
          );
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
          reports.value = data as BehavioralIssue[];
        } else {
          // دمج البيانات الجديدة مع القديمة (تجنب التكرار باستخدام id)
          const existingIds = new Set(reports.value.map((report) => report.id));
          const newData = (data as BehavioralIssue[]).filter(
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
          .from("students_behavioral_issues")
          .select("id, description")
          .eq("id", Number(reportId));

        if (error) {
          toastError({
            title: "حدث مشكلة في جلب التقرير",
          });
          throw Error("مشكلة في السيرفر");
        }

        return data && data.length > 0 ? (data[0] as BehavioralIssue) : null;

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
    const saveBehavioralIssue = async (report: BehavioralIssue) => {
      try {
        loading.value = true;

        const { data, error } = await client
          .from("students_behavioral_issues")
          .upsert(report as any, { onConflict: "id" })
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
    // const updateBehavioralIssue = async (report: BehavioralIssue) => {
    //   try {
    //     const { data, error } = await client
    //       .from("students_behavioral_issues")
    //       .upsert(report as any)
    //       .select();

    //     if (error) {
    //       throw new Error(error.message);
    //     }

    //     // update report locally
    //     const targetedReportIndex = getSpesificReportIndex(report.id ?? 0);

    //     reports.value[targetedReportIndex] = {
    //       ...reports.value[targetedReportIndex],
    //       ...(data[0] as BehavioralIssue),
    //     };

    //     toastSuccess({ title: "تم تحديث التقرير بنجاح" });
    //   } catch (err) {
    //     toastError({
    //       title: "خطأ في تحديث التقرير",
    //       description: (err as Error).message || "حدث خطأ غير متوقع",
    //     });
    //     throw err;
    //   }
    // };
    const deleteReport = async (reportId: number) => {
      try {
        loading.value = true;

        const { error } = await client
          .from("students_behavioral_issues")
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
      getReportById,
      // getReportsCount,

      saveBehavioralIssue,
      // updateBehavioralIssue,
      deleteReport,

      getSpesificReport,
      getSpesificReportIndex,
    };
  }
);
