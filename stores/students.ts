import type {
  Student,
  BehavioralIssue,
  QuranAchievementReport,
  Filters,
} from "~/types";
import { defineStore } from "pinia";
import { useAppToast } from "@/composables/useAppToast";

export const useStudentStore = defineStore("students", () => {
  // init
  const plansStore = usePlansStore();
  const client = useSupabaseClient();
  const { toastSuccess, toastError } = useAppToast();

  // state
  const studentsData = ref<Student[]>([]);
  const behavioralIssuesStudentData = ref<BehavioralIssue[]>([]);
  const loading = ref(false);
  const studentsCount = ref(0);
  const tableKey = ref(Math.random());

  // Getters
  const sortedStudents = computed(() => {
    // return studentsData.value;
    return studentsData.value.sort((a, b) =>
      (b.first_name ?? "").localeCompare(a.first_name ?? "")
    );
  });
  const sortedIssues = computed(() => {
    return [...(behavioralIssuesStudentData.value ?? [])].sort((a, b) =>
      (a.student?.first_name ?? "").localeCompare(b.student?.first_name ?? "")
    );
  });
  const studentsCountData = computed(() => studentsCount.value);

  // Actions
  /**
   * جلب الطلاب من Supabase مع دعم التصفح والفلاتر
   * @param {number} pageNum - رقم الصفحة (يبدأ من 1)
   * @param {number} pageSize - عدد السجلات لكل صفحة
   * @param {Object} filters - الفلاتر المطبقة (اختيارية)
   * @returns {Promise<void>}
   */
  const fetchStudents = async (
    pageNum: number = 1,
    pageSize: number = 10,
    filters?: Filters,
    forceRefresh: boolean = false
  ): Promise<void> => {
    const start = (pageNum - 1) * pageSize; // بداية النطاق
    const end = start + pageSize - 1; // نهاية النطاق
    // Check if any filter is applied
    const isFilterApplied =
      filters?.academicClassFilter ||
      filters?.quranClassFilter ||
      filters?.planFilter ||
      filters?.levelFilter ||
      filters?.memorizationStatusFilter ||
      filters?.firstNameFilter ||
      filters?.secondNameFilter ||
      filters?.thirdNameFilter ||
      filters?.lastNameFilter ||
      filters?.identityNumberFilter;

    // Force refresh if filters are applied or forceRefresh is explicitly true
    const shouldForceRefresh = forceRefresh || isFilterApplied;

    if (!shouldForceRefresh) {
      console.log("force Refresh", forceRefresh);
      // التحقق مما إذا كانت البيانات موجودة بالفعل
      const hasEnoughData = studentsData.value.length > start;
      if (hasEnoughData) {
        const slicedData = studentsData.value.slice(start, end + 1);
        if (
          slicedData.length >= Math.min(pageSize, studentsCount.value - start)
        ) {
          console.log(`Using cached data for page ${pageNum}`);
          return;
        }
      }
    }

    loading.value = true;
    try {
      let query = client
        .from("students")
        .select(
          `*, behavioral_issues:students_behavioral_issues(id, description, created_at),
      academic_class:academic_classes(id,title,group,floor,wing),
      quran_class:quran_classes(id,title,group,floor,wing),
      driver:drivers(name, car_type, car_color, phone_no),
      plan:plans(semester_id, semester:semesters(id, year, name),total_pages, months_plans(id,month_id, month:months(id, name), pages, plan_id)),
      quran_achievement_reports:students_quran_achievement_reports(monthly_plan_id, month_plan:months_plans(id, month_id, month:months(id, name)), achieved_pages, status, created_at),
      level:levels(title),
      months_fees:student_monthly_fees(id,amount,status,created_at, month:months(id,name)),
      exam_results:student_exam_results(notes, score, exam:subject_exams(max_score, min_score, type:exam_types(name)), semester:semesters(id, year, name), subject:subjects(id, name))
      `,
          { count: "exact" }
        )
        .order("academic_class_id", { ascending: true });

      // apply filters if exist
      if (filters?.academicClassFilter) {
        query = query.eq("academic_class_id", filters?.academicClassFilter);
      }
      if (filters?.quranClassFilter) {
        query = query.eq("quran_class_id", filters?.quranClassFilter);
      }
      if (filters?.planFilter) {
        query = query.eq("plan_id", filters?.planFilter);
      }
      if (filters?.levelFilter) {
        query = query.eq("level_id", filters?.levelFilter);
      }
      if (filters?.memorizationStatusFilter) {
        query = query.eq(
          "memorization_status",
          filters?.memorizationStatusFilter
        );
      }
      if (filters?.firstNameFilter) {
        query = query.eq("first_name", filters?.firstNameFilter);
      }
      if (filters?.secondNameFilter) {
        query = query.eq("second_name", filters?.secondNameFilter);
      }
      if (filters?.thirdNameFilter) {
        query = query.eq("third_name", filters?.thirdNameFilter);
      }
      if (filters?.lastNameFilter) {
        query = query.eq("last_name", filters?.lastNameFilter);
      }
      if (filters?.identityNumberFilter) {
        query = query.eq("identity_number", filters?.identityNumberFilter);
      }

      const { count, error: countError } = await query;
      if (countError) {
        throw createError({ statusCode: 500, message: countError.message });
      }
      studentsCount.value = count || 0;

      // apply pagination
      query = query.range(start, end);

      const { data, error } = await query;
      console.log("students", data);
      if (error) {
        throw error;
      }
      if (forceRefresh) {
        studentsData.value = data as Student[];
        console.log("students data inside force", studentsData.value);
      } else {
        // دمج البيانات الجديدة مع القديمة (تجنب التكرار باستخدام id)
        const existingIds = new Set(
          studentsData.value.map((student) => student.id)
        );
        const newData = (data as Student[]).filter(
          (student) => !existingIds.has(student.id)
        );
        // set students data
        studentsData.value = [...studentsData.value, ...newData];
      }
      // toastSuccess({
      //   title: "تم تحميل الطلاب بنجاح",
      // });
    } catch (err) {
      toastError({
        title: "هناك مشكلة في تحميل الطلاب",
        description: (err as Error).message,
      });
    } finally {
      loading.value = false;
    }
  };
  const addStudent = async (student: Student) => {
    loading.value = true;
    // console.log("student: ", student);
    try {
      const { data } = await api.post("/students", student);
      toastSuccess({
        title: `:تم إضافة الطالب ${data[0].first_name} ${data[0].last_name} بنجاح`,
      });
      // console.log("student from backend: ", data[0]);
      // add student locally
      studentsData.value.unshift({ ...data[0] });
    } catch (err) {
      toastError({
        title: "حدث مشكلة في إضافة الطالب",
      });
      throw Error(err instanceof Error ? err.message : String(err));
    } finally {
      loading.value = false;
    }
  };
  const editStudent = async (newStudent: Student) => {
    try {
      loading.value = true;
      const cleaned = removeInvalidFields(newStudent); // 🧹 remove unfound columns in DB
      const { data } = await api.put(`students/${newStudent.id}`, cleaned);

      toastSuccess({
        title: `:تم تحديث بيانات الطالب ${data[0].first_name} ${data[0].last_name} بنجاح`,
      });
      // update student locally
      const studentIndex = getSpesificStudentIndex(String(newStudent.id));

      // Keep existing behavioral_issues from old data
      if (studentsData.value && studentIndex !== -1) {
        const existingIssues =
          studentsData.value[studentIndex].behavioral_issues;
        // Merge new data and keep behavioral_issues field
        studentsData.value[studentIndex] = {
          ...data[0],
          behavioral_issues: existingIssues,
        };
      }
    } catch (err) {
      toastError({
        title: "حدث مشكلة في تعديل الطالب",
      });
      throw Error(err instanceof Error ? err.message : String(err));
    } finally {
      loading.value = false;
    }
  };
  const deleteStudent = async (studentId: string) => {
    try {
      loading.value = true;
      const { data } = await api.delete(`students/${studentId}`);
      toastSuccess({
        title: `:تم حذف الطالب ( ${data[0].full_name} ) بنجاح`,
      });
      // delete student locally
      const studentIndex = getSpesificStudentIndex(studentId);
      (studentsData.value || []).splice(studentIndex, 1);
    } catch (err) {
      toastError({
        title: "حدث مشكلة في حذف الطالب",
      });
    } finally {
      loading.value = false;
    }
  };
  const deleteMultipleStudents = async (ids: string[]) => {
    try {
      loading.value = true;

      await api.delete("/students/delete-many", { data: { ids } });

      // إزالة الطلاب من الواجهة مباشرة
      studentsData.value = studentsData.value.filter(
        (student) => !ids.includes(student.id || "")
      );

      toastSuccess({ title: "تم حذف الطلاب بنجاح" });
    } catch (error) {
      toastError({ title: "فشل في حذف الطلاب" });
    } finally {
      loading.value = false;
    }
  };
  // const updateAcademicClassForStudents = async (
  //   studentIds: string[],
  //   classId: number
  // ) => {
  //   try {
  //     loading.value = true;

  //     const { data } = await api.put("/students/update-academic-class", {
  //       studentIds,
  //       classId,
  //     });

  // console.log(data);

  //     toastSuccess({ title: "تم نقل الطلاب للصف الدراسي الجديد بنجاح" });

  //     // تحديث البيانات محليًا إذا لزم الأمر
  //     studentsData.value = studentsData.value.map((student) =>
  //       studentIds.includes(student.id || "")
  //         ? { ...student, academic_class_id: classId }
  //         : student
  //     );
  //   } catch (error) {
  //     toastError({ title: "فشل في نقل الطلاب" });
  //   } finally {
  //     loading.value = false;
  //   }
  // };
  // const updateQuranClassForStudents = async (
  //   studentIds: string[],
  //   classId: number
  // ) => {
  //   try {
  //     loading.value = true;

  //     const { data } = await api.put("/students/update-quran-class", {
  //       studentIds,
  //       classId,
  //     });

  // console.log(data);

  //     toastSuccess({ title: "تم نقل الطلاب للصف القرآني الجديد بنجاح" });

  //     // تحديث البيانات محليًا إذا لزم الأمر
  //     studentsData.value = studentsData.value.map((student) =>
  //       studentIds.includes(student.id || "")
  //         ? { ...student, academic_class_id: classId }
  //         : student
  //     );
  //   } catch (error) {
  //     toastError({ title: "فشل في نقل الطلاب" });
  //   } finally {
  //     loading.value = false;
  //   }
  // };
  // const updatesDriverForStudents = async (
  //   studentIds: string[],
  //   driverId: number
  // ) => {
  //   try {
  //     loading.value = true;

  //     const { data } = await api.put("/students/update-driver", {
  //       studentIds,
  //       driverId,
  //     });

  // console.log(data);

  //     toastSuccess({ title: "تم تعيين سائق للطلاب بنجاح" });

  //     // تحديث البيانات محليًا إذا لزم الأمر
  //     studentsData.value = studentsData.value.map((student) =>
  //       studentIds.includes(student.id || "")
  //         ? { ...student, driver_id: driverId }
  //         : student
  //     );
  //   } catch (error) {
  //     toastError({ title: "فشل في تعيين السائق" });
  //   } finally {
  //     loading.value = false;
  //   }
  // };

  const getSpesificStudent = (studentId: string) => {
    return studentsData.value?.find((student) => student.id === studentId);
  };
  const getSpesificStudentIndex = (studentId: string) => {
    return studentsData.value.findIndex((student) => student.id === studentId);
  };
  const resetStudentsCache = () => {
    studentsData.value = [];
    studentsCount.value = 0;
  };
  /**
   * جلب الطلاب بناءً على academic_class_id
   * @param academicClassId - معرف الشعبة الدراسية
   * @param monthlyPlanId - معرف خطة الشهر (للتحقق من التقارير الموجودة)
   */
  const getStudentsByAcademicClassIdAndPlanId = async (
    academicClassId: number,
    monthlyPlanId?: number
  ) => {
    loading.value = true;
    let students: Student[] = [];
    let planId: number;
    try {
      // get planId
      await plansStore.fetchMonthsPlans();
      planId =
        plansStore.monthsPlansData.find((mp) => mp.id === monthlyPlanId)
          ?.plan_id ?? 0;

      let query = client
        .from("students")
        .select(
          `*, 
            behavioral_issues:students_behavioral_issues(id, description, created_at),
            academic_class:academic_classes(id,title,group,floor,wing),
            quran_class:quran_classes(id,title,group,floor,wing),
            driver:drivers(name, car_type, car_color, phone_no),
            plan:plans(id,semester_id, semester:semesters(id,name,year), total_pages, months_plans(id, month:months(id,name), month_id,pages, plan_id)),
            quran_achievement_reports:students_quran_achievement_reports(id,achieved_pages,created_at,status,monthly_plan_id,manager_id),
            level:levels(title)`
        )
        .eq("academic_class_id", academicClassId);

      // تصفية الطلاب بناءً على plan_id إذا كان monthlyPlanId
      if (planId) {
        query = query.eq("plan_id", planId);
      }
      query = query.order("id", { ascending: true });

      const { data, error } = await query;

      if (error) {
        throw new Error(error.message);
      }
      // return data;
      // تصفية الطلاب الذين ليس لديهم تقرير لهذا الشهر
      if (monthlyPlanId) {
        students = data.filter((student: Student) => {
          return !student?.quran_achievement_reports?.some(
            (report) => report.monthly_plan_id === monthlyPlanId
          );
        });
      } else {
        students = data;
      }

      // studentsCount.value = studentsData.value.length;
      console.log("Fetched students by academic class:", students);
      toastSuccess({ title: "تم جلب الطلاب بنجاح" });
      return students;
    } catch (err) {
      // studentsData.value = [];
      // studentsCount.value = 0;
      toastError({
        title: "خطأ في جلب الطلاب",
        description: (err as Error).message || "حدث خطأ غير متوقع",
      });
    } finally {
      loading.value = false;
    }
  };
  /**
   * جلب الطلاب بناءً على academic_class_id
   * @param academicClassId - معرف الشعبة الدراسية
   */
  const getStudentsCountByAcademicClassId = async (academicClassId: number) => {
    loading.value = true;
    let studentsCount: number;
    try {
      let query = client
        .from("students")
        .select("*", { count: "exact", head: true })
        .eq("academic_class_id", academicClassId);

      const { count, error } = await query;

      if (error) {
        throw new Error(error.message);
      }

      studentsCount = Number(count);

      return studentsCount;
    } catch (err) {
      toastError({
        title: "خطأ في جلب الطلاب",
        description: (err as Error).message || "حدث خطأ غير متوقع",
      });
    } finally {
      loading.value = false;
    }
  };
  /**
   * جلب الطلاب بناءً على academic_class_id
   * @param academicClassId - معرف الشعبة الدراسية
   * @param monthlyPlanId - معرف خطة الشهر (للتحقق من التقارير الموجودة)
   */
  const getStudentsCountByAcademicClassIdAndPlanId = async (
    academicClassId: number,
    monthlyPlanId?: number
  ) => {
    loading.value = true;
    let studentsCount: number;
    let planId: number;
    try {
      // get planId
      await plansStore.fetchMonthsPlans();
      planId =
        plansStore.monthsPlansData.find((mp) => mp.id === monthlyPlanId)
          ?.plan_id ?? 0;

      let query = client
        .from("students")
        .select("*", { count: "exact", head: true })
        .eq("academic_class_id", academicClassId);

      if (planId) {
        query = query.eq("plan_id", planId);
      }
      query = query.order("id", { ascending: true });

      const { count, error } = await query;

      if (error) {
        throw new Error(error.message);
      }

      studentsCount = Number(count);

      console.log(
        "Fetched students count by academic class and planId:",
        studentsCount
      );
      toastSuccess({ title: "تم جلب عدد الطلاب بنجاح" });
      return studentsCount;
    } catch (err) {
      // studentsData.value = [];
      // studentsCount.value = 0;
      toastError({
        title: "خطأ في جلب الطلاب",
        description: (err as Error).message || "حدث خطأ غير متوقع",
      });
    } finally {
      loading.value = false;
    }
  };
  /**
   * جلب الطلاب بناءً على academic_class_id
   * @param academicClassId - معرف الشعبة الدراسية
   */
  const getStudentsByAcademicClassId = async (academicClassId: number) => {
    // loading.value = true;
    let students: Student[] = [];
    try {
      let query = client
        .from("students")
        .select(
          `*, 
            behavioral_issues:students_behavioral_issues(id, description, created_at),
            academic_class:academic_classes(id,title,group,floor,wing),
            quran_class:quran_classes(id,title,group,floor,wing),
            driver:drivers(name, car_type, car_color, phone_no),
            plan:plans(id,year,semester,stage,total_pages, months_plans(id,month,pages,plan_id)),
            quran_achievement_reports:students_quran_achievement_reports(id,month,achieved_pages,created_at,status,monthly_plan_id,manager_id),
            level:levels(title)`
        )
        .eq("academic_class_id", academicClassId)
        .order("id", { ascending: true });
      // تصفية الطلاب بناءً على plan_id إذا كان monthlyPlanId

      const { data, error } = await query;

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (err) {
      toastError({
        title: "خطأ في جلب الطلاب",
        description: (err as Error).message || "حدث خطأ غير متوقع",
      });
    } finally {
      loading.value = false;
    }
  };
  const addQuranQuranAchievementReport = async (
    generalPlanId: number,
    newReport: QuranAchievementReport
  ) => {
    const targetedStudent = getSpesificStudent(newReport.student_id || "");
    // check if student exists
    if (!targetedStudent) {
      toastError({
        title: "الطالب غير موجود",
        description: "يرجى التأكد من وجود الطالب قبل إضافة تقرير الإنجاز.",
      });
      return;
    }
    // check if monthly plan is exists
    const generalPlan = plansStore.getSpecificPlan(generalPlanId);
    const currentMonth = generalPlan?.months_plans?.find(
      (monthPlan) => monthPlan.month === newReport.month
    );
    if (!currentMonth) {
      toastError({
        title: "لا يوجد خطة لهذا الشهر",
        description: "يرجى التأكد من وجود خطة لهذا الشهر قبل إضافة التقرير.",
      });
      return;
    }

    // check if report for the same month already exists
    if (
      targetedStudent?.quran_achievement_reports?.find(
        (report) =>
          report.month === newReport.month &&
          report.monthly_plan_id === newReport.monthly_plan_id
      )
    ) {
      toastError({
        title: "تقرير الإنجاز القرآني لهذا الشهر موجود بالفعل",
        description: "لا يمكن إضافة تقرير جديد لنفس الشهر.",
      });
      return;
    }

    try {
      loading.value = true;

      const months_plans = generalPlan?.months_plans;
      const targetedMonthPlan = months_plans
        ? months_plans.find((monthPlan) => monthPlan.month === newReport.month)
        : undefined;

      const payload = {
        ...newReport,
        status:
          targetedMonthPlan?.pages && newReport.achieved_pages
            ? newReport.achieved_pages >= targetedMonthPlan.pages
              ? "مكتمل"
              : "غير مكتمل"
            : "",
      };

      const { data } = await api.post(
        "/students/quran-achievement-report",
        payload
      );

      toastSuccess({
        title: "تم إضافة تقرير الإنجاز القرآني بنجاح",
      });

      // add report locally
      const studentIndex = getSpesificStudentIndex(newReport.student_id || "");
      if (studentsData.value && studentIndex !== -1) {
        const existingReports =
          studentsData.value[studentIndex].quran_achievement_reports || [];
        studentsData.value[studentIndex].quran_achievement_reports = [
          ...existingReports,
          data[0],
        ];
      }
      navigateTo({ name: "students-view" });
    } catch (err) {
      toastError({
        title: "حدثت مشكلة أثناء إضافة تقرير الإنجاز القرآني",
      });
      throw Error(err instanceof Error ? err.message : String(err));
    } finally {
      loading.value = false;
    }
  };
  const fetchStudentById = async (studentId: string) => {
    try {
      loading.value = true;
      const { data, error } = await client
        .from("students")
        .select(
          `*, behavioral_issues:students_behavioral_issues(id, description, created_at),
      academic_class:academic_classes(id,title,group,floor,wing),
      quran_class:quran_classes(id,title,group,floor,wing),
      driver:drivers(name, car_type, car_color, phone_no),
      plan:plans(semester_id, semester:semesters(id, year, name),total_pages, months_plans(id,month_id, month:months(id, name), pages, plan_id)),
      quran_achievement_reports:students_quran_achievement_reports(monthly_plan_id, month_plan:months_plans(id, month_id, month:months(id, name), pages), achieved_pages, status, created_at),
      level:levels(title),
      months_fees:student_monthly_fees(id,amount,status,created_at, month:months(id,name)),
      exam_results:student_exam_results(notes, score, exam:subject_exams(max_score, min_score, type:exam_types(name)), semester:semesters(id, year, name), subject:subjects(id, name))
      `
        )
        .eq("id", studentId)
        .single();

      if (error) {
        throw Error("حدثت مشكلة أثناء جلب بيانات الطالب");
      }
      return data;
    } catch (err) {
      toastError({
        title: "حدثت مشكلة أثناء جلب بيانات الطالب",
      });
      throw Error(err instanceof Error ? err.message : String(err));
    } finally {
      loading.value = false;
    }
  };

  // helper Methods
  // function cleanObject<T extends object>(obj: T): Partial<T> {
  //   return Object.fromEntries(
  //     Object.entries(obj).filter(([_, v]) => v !== undefined)
  //   ) as Partial<T>;
  // }
  function removeInvalidFields(student: Student): Partial<Student> {
    const allowedFields = [
      "id",
      "manager_id",
      "first_name",
      "second_name",
      "third_name",
      "last_name",
      "identity_number",
      "father_identity_number",
      "phone_number",
      "birth_date",
      "masjed",
      "address",
      "memorization_status",
      "memorized_juz",
      "daily_recitation",
      "created_at",
      "guardian_name",
      "guardian_name_kinship",
      "whatsapp_number",
      "level_id",
      "quran_class_id",
      "academic_class_id",
      "driver_id",
      "plan_id",
    ];

    return Object.fromEntries(
      Object.entries(student).filter(([key]) => allowedFields.includes(key))
    );
  }
  return {
    // state
    studentsData,
    loading,
    behavioralIssuesStudentData,
    tableKey,

    // Getters
    sortedStudents,
    sortedIssues,
    studentsCountData,

    // Student operations
    fetchStudents,
    fetchStudentById,
    addStudent,
    editStudent,
    deleteStudent,
    deleteMultipleStudents,
    resetStudentsCache,

    addQuranQuranAchievementReport,
    getStudentsByAcademicClassId,
    getStudentsCountByAcademicClassId,
    getStudentsByAcademicClassIdAndPlanId,
    getStudentsCountByAcademicClassIdAndPlanId,

    // updateAcademicClassForStudents,
    // updatesDriverForStudents,
    // updateQuranClassForStudents,
    getSpesificStudent,
    getSpesificStudentIndex,
  };
});
