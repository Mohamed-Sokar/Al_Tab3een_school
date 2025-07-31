import type {
  Student,
  BehavioralIssue,
  QuranAchievementReport,
  StudentFilters,
  MonthlyPlan,
} from "~/types";
import { defineStore } from "pinia";
import { useAppToast } from "@/composables/useAppToast";

export const useStudentStore = defineStore("students", () => {
  const plansStore = usePlansStore();
  const client = useSupabaseClient();
  const { toastSuccess, toastError } = useAppToast();
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
    filters: StudentFilters,
    forceRefresh: boolean = false
  ): Promise<void> => {
    const start = (pageNum - 1) * pageSize; // بداية النطاق
    const end = start + pageSize - 1; // نهاية النطاق
    // Check if any filter is applied
    const isFilterApplied =
      filters.academicClassFilter ||
      filters.quranClassFilter ||
      filters.planFilter ||
      filters.levelFilter ||
      filters.memorizationStatusFilter ||
      filters.firstNameFilter ||
      filters.secondNameFilter ||
      filters.thirdNameFilter ||
      filters.lastNameFilter ||
      filters.identityNumberFilter;

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
      plan:plans(id,year,semester,stage,total_pages, months_plans(id,month, pages, plan_id)),
      quran_achievement_reports:students_quran_achievement_reports(monthly_plan_id,month,achieved_pages,status),
      level:levels(title)`
        )
        .range(start, end)
        .order("first_name", { ascending: true });

      // تطبيق الفلاتر إذا وجدت
      if (filters.academicClassFilter) {
        query = query.eq("academic_class_id", filters.academicClassFilter);
      }
      if (filters.quranClassFilter) {
        query = query.eq("quran_class_id", filters.quranClassFilter);
      }
      if (filters.planFilter) {
        query = query.eq("plan_id", filters.planFilter);
      }
      if (filters.levelFilter) {
        query = query.eq("level_id", filters.levelFilter);
      }
      if (filters.memorizationStatusFilter) {
        query = query.eq(
          "memorization_status",
          filters.memorizationStatusFilter
        );
      }
      if (filters.firstNameFilter) {
        query = query.eq("first_name", filters.firstNameFilter);
      }
      if (filters.secondNameFilter) {
        query = query.eq("second_name", filters.secondNameFilter);
      }
      if (filters.thirdNameFilter) {
        query = query.eq("third_name", filters.thirdNameFilter);
      }
      if (filters.lastNameFilter) {
        query = query.eq("last_name", filters.lastNameFilter);
      }
      if (filters.identityNumberFilter) {
        query = query.eq("identity_number", filters.identityNumberFilter);
      }

      const { data, error } = await query;

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
      toastSuccess({
        title: "تم تحميل الطلاب بنجاح",
      });
    } catch (err) {
      toastError({
        title: "هناك مشكلة في تحميل الطلاب",
        description: (err as Error).message,
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
  const getStudentsCount = async (filters: StudentFilters): Promise<void> => {
    let query = client
      .from("students")
      .select("*", { count: "exact", head: true });

    // تطبيق الفلاتر إذا وجدت
    if (filters.academicClassFilter) {
      query = query.eq("academic_class_id", filters.academicClassFilter);
    }
    if (filters.quranClassFilter) {
      query = query.eq("quran_class_id", filters.quranClassFilter);
    }
    if (filters.planFilter) {
      query = query.eq("plan_id", filters.planFilter);
    }
    if (filters.levelFilter) {
      query = query.eq("level_id", filters.levelFilter);
    }
    if (filters.memorizationStatusFilter) {
      query = query.eq("memorization_status", filters.memorizationStatusFilter);
    }
    if (filters.firstNameFilter) {
      query = query.eq("first_name", filters.firstNameFilter);
    }
    if (filters.secondNameFilter) {
      query = query.eq("second_name", filters.secondNameFilter);
    }
    if (filters.thirdNameFilter) {
      query = query.eq("third_name", filters.thirdNameFilter);
    }
    if (filters.lastNameFilter) {
      query = query.eq("last_name", filters.lastNameFilter);
    }
    if (filters.identityNumberFilter) {
      query = query.eq("identity_number", filters.identityNumberFilter);
    }

    const { count, error } = await query;
    if (error) {
      throw createError({ statusCode: 500, message: error.message });
    }
    studentsCount.value = count || 0;
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
  const editStudent = async (studentId: string, newStudent: Student) => {
    try {
      loading.value = true;
      const cleaned = removeInvalidFields(newStudent); // 🧹 remove unfound columns in DB

      const { data } = await api.put(`students/${studentId}`, cleaned);

      toastSuccess({
        title: `:تم تحديث بيانات الطالب ${data[0].first_name} ${data[0].last_name} بنجاح`,
      });
      // update student locally
      const studentIndex = getSpesificStudentIndex(studentId);

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
  /**
   * إعادة تعيين التخزين المؤقت
   */
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
            plan:plans(id,year,semester,stage,total_pages, months_plans(id,month,pages,plan_id)),
            quran_achievement_reports:students_quran_achievement_reports(id,month,achieved_pages,created_at,status,monthly_plan_id,manager_id),
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

      // تصفية الطلاب بناءً على plan_id إذا كان monthlyPlanId
      if (planId) {
        query = query.eq("plan_id", planId);
      }
      query = query.order("id", { ascending: true });

      const { count, error } = await query;

      if (error) {
        throw new Error(error.message);
      }
      // return data;
      console.log(count);

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
    let planId: number;
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
  // behavioral_issues operations
  const fetchBehavioralIssues = async () => {
    loading.value = true;
    try {
      const { data } = await api.get("/students/behavioral-issues");
      // console.log("behavioralIssues: ", data);
      // set behavioral Issues data to ref locally
      behavioralIssuesStudentData.value = data;
      toastSuccess({
        title: "تم تحميل المخالفات بنجاح",
      });
      tableKey.value = Math.random();
    } catch (err) {
      // toastError({
      //   title: err.message,
      // });
      throw Error(err instanceof Error ? err.message : String(err));
    } finally {
      loading.value = false;
    }
  };
  const addStudentBehavioralIssue = async (
    studentId: string,
    description: string
  ) => {
    const targetedStudent = getSpesificStudent(studentId);

    if (!targetedStudent) return;

    const classTitle = targetedStudent.academic_class?.title; // add new behavioral Issue
    const classGroup = targetedStudent.academic_class?.group; // add new behavioral Issue

    const payload = {
      student_id: targetedStudent.id,
      description: description,
    };

    const newIssue = {
      ...payload,
      student: {
        first_name: targetedStudent.first_name,
        last_name: targetedStudent.last_name,
        class: {
          title: classTitle,
          group: classGroup,
        },
      },
      // date: new Date().toISOString().split("T")[0],
    };

    try {
      loading.value = true;
      const { data } = await api.post("/students/behavioral-issues", payload);

      toastSuccess({
        title: "تم إضافة المخالفة السلوكية",
      });
      // console.log(data[0]);
      // const studentIndex = getSpesificStudentIndex(studentId);
      if (studentsData.value && !!targetedStudent) {
        // const existingStudent = studentsData.value[studentIndex];

        // ensure exsisting the behavioral issues array
        if (!targetedStudent.behavioral_issues) {
          targetedStudent.behavioral_issues = [];
        }

        targetedStudent.behavioral_issues.push({
          ...newIssue,
          ...data[0], // المخالفة التي أرجعها السيرفر
        });
      }
      const newData = {
        ...newIssue,
        ...data[0],
      };
      // console.log(newData);
      behavioralIssuesStudentData.value.unshift(newData);
    } catch (err) {
      toastError({
        title: "حدث مشكلة في إضافة المخالفة السلوكية",
      });
      // throw Error(err instanceof Error ? err.message : String(err));s
    } finally {
      loading.value = false;
    }
  };
  const editStudentBehavioralIssue = async (
    issueId: number,
    description: string
  ) => {
    try {
      loading.value = true;
      const issueIndex = getSpesificStudentBehavioralIssueIndex(issueId);
      const targetedIssue = getSpesificStudentBehavioralIssue(issueId);
      // console.log(issueIndex);

      const { data } = await api.put(`/students/behavioral-issues/${issueId}`, {
        ...(behavioralIssuesStudentData.value || [])[issueIndex],
        description,
      });

      (behavioralIssuesStudentData.value || [])[issueIndex] = {
        ...(behavioralIssuesStudentData.value || [])[issueIndex],
        description: description,
      };

      const studentIndex = getSpesificStudentIndex(
        targetedIssue?.student_id ?? ""
      );

      // update students behavioral issues array locally
      if (
        studentsData.value &&
        studentsData.value[studentIndex] &&
        studentsData.value[studentIndex].behavioral_issues
      ) {
        // You can safely access students_behavioral_issues[issueIndex] here
        // For example, update the description:
        studentsData.value[studentIndex].behavioral_issues[
          issueIndex
        ].description = description;
      }

      tableKey.value = Math.random();

      toastSuccess({
        title: "تم تعديل المخالفة بنجاح",
      });
    } catch (err) {
      toastError({
        title: "حدثت مشكلة أثناء تعديل المخالفة",
      });
      throw Error(err instanceof Error ? err.message : String(err));
    } finally {
      loading.value = false;
    }
  };
  const deleteStudentBehavioralIssue = async (issueId: number) => {
    // Update the Student's behavioral issues
    const targetedIssue = getSpesificStudentBehavioralIssue(issueId);
    const issueIndex = getSpesificStudentBehavioralIssueIndex(issueId);
    const targetedStudent = getSpesificStudent(targetedIssue?.student_id || "");

    try {
      // delete issue from DB
      loading.value = true;
      const { data } = await api.delete(
        `students/behavioral-issues/${issueId}`
      );
      toastSuccess({
        title: `:تم حذف المخالفة بنجاح`,
      });

      // delete issue locally
      (behavioralIssuesStudentData.value || []).splice(issueIndex, 1);

      // delete issue from the student behavioral issues array
      if (targetedStudent) {
        const targetedIssueIndex = targetedStudent.behavioral_issues?.findIndex(
          (issue) => issue.id === issueId
        );

        targetedStudent.behavioral_issues?.splice(targetedIssueIndex ?? 0, 1);
      }
    } catch (err) {
      toastError({
        title: "حدث مشكلة في حذف المخالفة",
      });
    } finally {
      loading.value = false;
    }
  };
  const getSpesificStudentBehavioralIssue = (issueId: number) => {
    return sortedIssues.value.find(
      (issue: BehavioralIssue) => issue.id === issueId
    );
  };
  const getSpesificStudentBehavioralIssueIndex = (issueId: number) => {
    return (behavioralIssuesStudentData.value ?? []).findIndex(
      (issue) => issue.id !== undefined && +issue.id === +issueId
    );
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

  // helper Methods
  function cleanObject<T extends object>(obj: T): Partial<T> {
    return Object.fromEntries(
      Object.entries(obj).filter(([_, v]) => v !== undefined)
    ) as Partial<T>;
  }
  function removeInvalidFields(student: Student): Partial<Student> {
    const allowedFields = [
      "id",
      "first_name",
      "second_name",
      "third_name",
      "last_name",
      "identity_number",
      "father_identity_number",
      "phone_number",
      "birth_date",
      "level_id",
      "masjed",
      "address",
      "memorization_status",
      "memorized_juz",
      "daily_recitation",
      "class_group",
      "created_at",
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
    // student operations
    fetchStudents,
    getStudentsCount,
    fetchBehavioralIssues,
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
    // student behavioral Iissue operations
    addStudentBehavioralIssue,
    editStudentBehavioralIssue,
    deleteStudentBehavioralIssue,
    getSpesificStudentBehavioralIssue,
    getSpesificStudentBehavioralIssueIndex,
  };
});
