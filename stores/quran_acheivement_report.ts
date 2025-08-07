import type {
  Student,
  QuranAchievementReport,
  MonthlyPlan,
  StudentQuranAcheivementReportFilters,
} from "~/types";
import { defineStore } from "pinia";
import { useAppToast } from "@/composables/useAppToast";
import { date } from "zod/v4";

export const useQuranAcheivementReport = defineStore(
  "QuranAcheivementReport",
  () => {
    const client = useSupabaseClient();
    const { toastSuccess, toastError } = useAppToast();
    const reports = ref<QuranAchievementReport[]>([]);
    const loading = ref(false);
    const reportsCount = ref(0);
    const plansStore = usePlansStore();

    // Getters
    const reportsData = computed(() => reports.value);
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
    const reportsCountData = computed(() => reportsCount.value);

    // Actions
    /**
     * جلب الطلاب من Supabase مع دعم التصفح والفلاتر
     * @param {number} pageNum - رقم الصفحة (يبدأ من 1)
     * @param {number} pageSize - عدد السجلات لكل صفحة
     * @param {Object} filters - الفلاتر المطبقة (اختيارية)
     * @returns {Promise<void>}
     */
    // const fetchReports = async (
    //   pageNum: number = 1,
    //   pageSize: number = 10,
    //   filters: StudentFilters,
    //   forceRefresh: boolean = false
    // ) => {
    //   const start = (pageNum - 1) * pageSize; // بداية النطاق
    //   const end = start + pageSize - 1; // نهاية النطاق
    //   // Check if any filter is applied
    //   const isFilterApplied =
    //     filters.academicClassFilter ||
    //     filters.quranClassFilter ||
    //     filters.planFilter ||
    //     filters.levelFilter ||
    //     filters.memorizationStatusFilter ||
    //     filters.firstNameFilter ||
    //     filters.secondNameFilter ||
    //     filters.thirdNameFilter ||
    //     filters.lastNameFilter ||
    //     filters.identityNumberFilter;

    //   // Force refresh if filters are applied or forceRefresh is explicitly true
    //   const shouldForceRefresh = forceRefresh || isFilterApplied;

    //   if (!shouldForceRefresh) {
    //     console.log("force Refresh", forceRefresh);
    //     // التحقق مما إذا كانت البيانات موجودة بالفعل
    //     const hasEnoughData = studentsData.value.length > start;
    //     if (hasEnoughData) {
    //       const slicedData = studentsData.value.slice(start, end + 1);
    //       if (
    //         slicedData.length >= Math.min(pageSize, studentsCount.value - start)
    //       ) {
    //         console.log(`Using cached data for page ${pageNum}`);
    //         return;
    //       }
    //     }
    //   }

    //   loading.value = true;
    //   try {
    //     let query = client
    //       .from("students")
    //       .select(
    //         `*, behavioral_issues:students_behavioral_issues(id, description, created_at),
    //   academic_class:academic_classes(id,title,group,floor,wing),
    //   quran_class:quran_classes(id,title,group,floor,wing),
    //   driver:drivers(name, car_type, car_color, phone_no),
    //   plan:plans(id,year,semester,stage,total_pages, months_plans(id,month, pages, plan_id)),
    //   quran_achievement_reports:students_quran_achievement_reports(monthly_plan_id,month,achieved_pages,status),
    //   level:levels(title)`
    //       )
    //       .range(start, end)
    //       .order("first_name", { ascending: true });

    //     // تطبيق الفلاتر إذا وجدت
    //     if (filters.academicClassFilter) {
    //       query = query.eq("academic_class_id", filters.academicClassFilter);
    //     }
    //     if (filters.quranClassFilter) {
    //       query = query.eq("quran_class_id", filters.quranClassFilter);
    //     }
    //     if (filters.planFilter) {
    //       query = query.eq("plan_id", filters.planFilter);
    //     }
    //     if (filters.levelFilter) {
    //       query = query.eq("level_id", filters.levelFilter);
    //     }
    //     if (filters.memorizationStatusFilter) {
    //       query = query.eq(
    //         "memorization_status",
    //         filters.memorizationStatusFilter
    //       );
    //     }
    //     if (filters.firstNameFilter) {
    //       query = query.eq("first_name", filters.firstNameFilter);
    //     }
    //     if (filters.secondNameFilter) {
    //       query = query.eq("second_name", filters.secondNameFilter);
    //     }
    //     if (filters.thirdNameFilter) {
    //       query = query.eq("third_name", filters.thirdNameFilter);
    //     }
    //     if (filters.lastNameFilter) {
    //       query = query.eq("last_name", filters.lastNameFilter);
    //     }
    //     if (filters.identityNumberFilter) {
    //       query = query.eq("identity_number", filters.identityNumberFilter);
    //     }

    //     const { data, error } = await query;

    //     if (forceRefresh) {
    //       studentsData.value = data as Student[];
    //       console.log("students data inside force", studentsData.value);
    //     } else {
    //       // دمج البيانات الجديدة مع القديمة (تجنب التكرار باستخدام id)
    //       const existingIds = new Set(
    //         studentsData.value.map((student) => student.id)
    //       );
    //       const newData = (data as Student[]).filter(
    //         (student) => !existingIds.has(student.id)
    //       );
    //       // set students data
    //       studentsData.value = [...studentsData.value, ...newData];
    //     }
    //     toastSuccess({
    //       title: "تم تحميل الطلاب بنجاح",
    //     });
    //   } catch (err) {
    //     toastError({
    //       title: "هناك مشكلة في تحميل الطلاب",
    //       description: (err as Error).message,
    //     });
    //   } finally {
    //     loading.value = false;
    //   }
    // };

    const fetchReports = async (
      pageNum: number = 1,
      pageSize: number = 10,
      filters: StudentQuranAcheivementReportFilters,
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
          .from("students_quran_achievement_reports")
          .select(
            `id, student_id, achieved_pages, status, monthly_plan_id, manager_id, created_at,
        student:students(id, first_name, second_name, third_name, last_name, identity_number, academic_class_id,
        academic_class:academic_classes(id, title, group)),
        monthly_plan:months_plans(id, month, pages, plan:plans(id, year, semester, stage, students_type))`
          )
          .range(start, end);
        // .order("id", { ascending: false });

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
        if (filters.monthlyPlanFilter) {
          query = query.eq("monthly_plan_id", filters.monthlyPlanFilter);
        }

        const { data, error } = await query;
        if (error) {
          throw new Error(error.message);
        }

        if (forceRefresh) {
          reports.value = data as QuranAchievementReport[];
        } else {
          // دمج البيانات الجديدة مع القديمة (تجنب التكرار باستخدام id)
          const existingIds = new Set(reports.value.map((report) => report.id));
          const newData = (data as QuranAchievementReport[]).filter(
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
    /**
     * fetch reports from supabase based on monthlyPlanId and studentsIds
     * @param {number} monthlyPlanId
     * @param {number} studentIds
     * @returns {Promise<void>}
     */
    const fetchReportsByMonthlyPlanId = async (
      monthlyPlanId: number,
      studentIds: string[]
    ): Promise<void> => {
      try {
        loading.value = true;
        // Fetch existing reports for this month
        const { data: existingReports, error } = await client
          .from("students_quran_achievement_reports")
          .select(
            "id, student_id, month, achieved_pages, status, monthly_plan_id, manager_id, created_at"
          )
          .eq("monthly_plan_id", monthlyPlanId)
          .in("student_id", studentIds);

        if (error) {
          throw new Error(error.message);
        }
      } catch (err) {
        toastError({
          title: "خطأ في جلب التقارير",
          description: (err as Error).message || "حدث خطأ غير متوقع",
        });
      } finally {
        loading.value = false;
      }
    };
    /**
     * جلب عدد الطلاب الكلي مع تطبيق الفلاتر
     * @param {Object} filters - الفلاتر المطبقة (اختيارية)
     * @returns {Promise<void>}
     */
    const getReportsCount = async (
      filters: StudentQuranAcheivementReportFilters
    ): Promise<void> => {
      try {
        loading.value = true;
        let query = client
          .from("students_quran_achievement_reports")
          .select("*", { count: "exact", head: true });

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
        if (filters.monthlyPlanFilter) {
          query = query.eq("monthly_plan_id", filters.monthlyPlanFilter);
        }
        const { count, error } = await query;
        if (error) {
          throw createError({ statusCode: 500, message: error.message });
        }
        reportsCount.value = count || 0;
      } catch (err) {
        toastError({ title: "خطأ في جلب عدد التقارير" });
      } finally {
        loading.value = false;
      }
    };
    // const addStudent = async (student: Student) => {
    //   loading.value = true;
    //   // console.log("student: ", student);
    //   try {
    //     const { data } = await api.post("/students", student);
    //     toastSuccess({
    //       title: `:تم إضافة الطالب ${data[0].first_name} ${data[0].last_name} بنجاح`,
    //     });
    //     // console.log("student from backend: ", data[0]);
    //     // add student locally
    //     studentsData.value.unshift({ ...data[0] });
    //   } catch (err) {
    //     toastError({
    //       title: "حدث مشكلة في إضافة الطالب",
    //     });
    //     throw Error(err instanceof Error ? err.message : String(err));
    //   } finally {
    //     loading.value = false;
    //   }
    // };
    // const editStudent = async (studentId: string, newStudent: Student) => {
    //   try {
    //     loading.value = true;
    //     const cleaned = removeInvalidFields(newStudent); // 🧹 remove unfound columns in DB

    //     const { data } = await api.put(`students/${studentId}`, cleaned);

    //     toastSuccess({
    //       title: `:تم تحديث بيانات الطالب ${data[0].first_name} ${data[0].last_name} بنجاح`,
    //     });
    //     // update student locally
    //     const studentIndex = getSpesificStudentIndex(studentId);

    //     // Keep existing behavioral_issues from old data
    //     if (studentsData.value && studentIndex !== -1) {
    //       const existingIssues =
    //         studentsData.value[studentIndex].behavioral_issues;
    //       // Merge new data and keep behavioral_issues field
    //       studentsData.value[studentIndex] = {
    //         ...data[0],
    //         behavioral_issues: existingIssues,
    //       };
    //     }
    //   } catch (err) {
    //     toastError({
    //       title: "حدث مشكلة في تعديل الطالب",
    //     });
    //     throw Error(err instanceof Error ? err.message : String(err));
    //   } finally {
    //     loading.value = false;
    //   }
    // };
    // const deleteStudent = async (studentId: string) => {
    //   try {
    //     loading.value = true;
    //     const { data } = await api.delete(`students/${studentId}`);
    //     toastSuccess({
    //       title: `:تم حذف الطالب ( ${data[0].full_name} ) بنجاح`,
    //     });
    //     // delete student locally
    //     const studentIndex = getSpesificStudentIndex(studentId);
    //     (studentsData.value || []).splice(studentIndex, 1);
    //   } catch (err) {
    //     toastError({
    //       title: "حدث مشكلة في حذف الطالب",
    //     });
    //   } finally {
    //     loading.value = false;
    //   }
    // };
    // const deleteMultipleStudents = async (ids: string[]) => {
    //   try {
    //     loading.value = true;

    //     await api.delete("/students/delete-many", { data: { ids } });

    //     // إزالة الطلاب من الواجهة مباشرة
    //     studentsData.value = studentsData.value.filter(
    //       (student) => !ids.includes(student.id || "")
    //     );

    //     toastSuccess({ title: "تم حذف الطلاب بنجاح" });
    //   } catch (error) {
    //     toastError({ title: "فشل في حذف الطلاب" });
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

    /**
     * حفظ تقارير إنجاز القرآن للطلاب
     * @param reports - مصفوفة تقارير الإنجاز
     */
    const saveQuranAchievementReports = async (
      newReports: QuranAchievementReport[]
    ) => {
      try {
        const { data, error } = await client
          .from("students_quran_achievement_reports")
          .upsert(newReports, {
            onConflict: ["student_id", "monthly_plan_id"],
          })
          .select();

        if (error) {
          throw new Error(error.message);
        }

        console.log(data);

        // reports.value.unshift(...date);

        toastSuccess({ title: "تم حفظ تقارير الإنجاز بنجاح" });
      } catch (err) {
        toastError({
          title: "خطأ في حفظ تقارير الإنجاز",
          description: (err as Error).message || "حدث خطأ غير متوقع",
        });
      }
    };
    const updateQuranAchievementReport = async (
      report: QuranAchievementReport
    ) => {
      try {
        await plansStore.fetchMonthsPlans();
        const monthPlan = plansStore.monthsPlansData.find(
          (mp) => mp.id === report.monthly_plan_id
        );

        const requiredPages = (monthPlan as MonthlyPlan).pages || 0;
        const updatedReport = {
          ...report,
          status:
            (report.achieved_pages ?? 0) >= requiredPages
              ? "مكتمل"
              : "غير مكتمل",
        };

        const { data, error } = await client
          .from("students_quran_achievement_reports")
          .upsert([updatedReport], {
            onConflict: ["student_id", "month"],
          })
          .select();

        if (error) {
          throw new Error(error.message);
        }

        console.log("new report: ", data);
        // update report locally
        const targetedReportIndex = getSpesificReportIndex(report.id ?? 0);

        console.log(reports.value[targetedReportIndex]);

        reports.value[targetedReportIndex] = {
          ...reports.value[targetedReportIndex],
          ...(data[0] as QuranAchievementReport),
        };

        console.log("updated reports: ", reports.value);

        toastSuccess({ title: "تم تحديث تقرير الإنجاز بنجاح" });
      } catch (err) {
        toastError({
          title: "خطأ في تحديث تقرير الإنجاز",
          description: (err as Error).message || "حدث خطأ غير متوقع",
        });
        throw err;
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
      reportsData,
      loading,

      // Getters
      sortedReports,
      reportsCountData,
      // reports operations
      fetchReports,
      fetchReportsByMonthlyPlanId,
      getReportsCount,

      // addStudent,
      // editStudent,
      // deleteStudent,
      // deleteMultipleStudents,
      // resetStudentsCache,

      // addQuranQuranAchievementReport,

      saveQuranAchievementReports,
      updateQuranAchievementReport,

      getSpesificReport,
      getSpesificReportIndex,
    };
  }
);
