import type { Student, BehavioralIssue, AchievmentReport } from "~/types";
import { defineStore } from "pinia";
import { useAppToast } from "@/composables/useAppToast";
import { students } from "~/constants";

export const useStudentStore = defineStore("students", () => {
  const plansStore = usePlansStore();
  const { toastSuccess, toastError } = useAppToast();
  const studentsData = ref<Student[]>([]);
  const behavioralIssuesStudentData = ref<BehavioralIssue[]>();
  const loading = ref(false);
  const tableKey = ref(Math.random());

  // Getters
  const sortedStudents = computed(() => {
    return [...(studentsData.value ?? [])].sort((a, b) =>
      (a.full_name ?? "").localeCompare(b.full_name ?? "")
    );
  });
  const sortedIssues = computed(() => {
    return [...(behavioralIssuesStudentData.value ?? [])].sort((a, b) =>
      (a.student_name ?? "").localeCompare(b.student_name ?? "")
    );
  });

  // Actions
  const fetchStudents = async () => {
    loading.value = true;
    try {
      const { data } = await api.get("/students");
      console.log(data);
      // set students data to ref locally
      studentsData.value = data;
      toastSuccess({
        title: "تم تحميل الطلاب بنجاح",
      });
      // tableKey.value = Math.random();
    } catch (err) {
      toastError({
        title: "هناك مشكلة في تحميل الطلاب",
        description: err.message,
      });
      // throw new Error();
    } finally {
      loading.value = false;
    }
  };
  const addStudent = async (student: Student) => {
    loading.value = true;
    console.log("student: ", student);
    try {
      const { data } = await api.post("/students", student);
      toastSuccess({
        title: `:تم إضافة الطالب ${data[0].full_name} بنجاح`,
      });
      // add student locally
      (studentsData.value || []).unshift({ ...student });
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
        title: `:تم تحديث بيانات الطالب ${data[0].full_name} بنجاح`,
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

  //     console.log(data);

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

  //     console.log(data);

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

  //     console.log(data);

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

  // behavioral_issues operations
  const fetchBehavioralIssues = async () => {
    loading.value = true;
    try {
      const { data } = await api.get("/students/behavioral-issues");
      console.log(data);
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

    const newIssue = {
      student_id: targetedStudent.id,
      level: targetedStudent.level,
      class_group: targetedStudent.class_group,
      description: description,
      student_name: targetedStudent?.full_name,
      date: new Date().toISOString().split("T")[0],
    };

    try {
      loading.value = true;
      const { data } = await api.post("/students/behavioral-issues", newIssue);

      toastSuccess({
        title: "تم إضافة المخالفة السلوكية",
      });

      // const studentIndex = getSpesificStudentIndex(studentId);
      if (studentsData.value && !!targetedStudent) {
        // const existingStudent = studentsData.value[studentIndex];

        // ensure exsisting the behavioral issues array
        if (!targetedStudent.behavioral_issues) {
          targetedStudent.behavioral_issues = [];
        }

        // add new behavioral Issue
        targetedStudent.behavioral_issues.push({
          id: data[0].id, // المخالفة التي أرجعها السيرفر
          ...newIssue,
          // description: description,
          // date: newIssue.date,
          // student_name: targetedStudent?.full_name,
          // student_id: targetedStudent?.id,
          // level: targetedStudent?.level,
          // class_group: targetedStudent?.class_group,
        });
      }

      (behavioralIssuesStudentData.value || []).unshift(data[0]);
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
      console.log(issueIndex);

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
        studentsData.value[studentIndex].students_behavioral_issues
      ) {
        // You can safely access students_behavioral_issues[issueIndex] here
        // For example, update the description:
        studentsData.value[studentIndex].students_behavioral_issues[
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
        const targetedIssueIndex =
          targetedStudent.students_behavioral_issues?.findIndex(
            (issue) => issue.id === issueId
          );

        targetedStudent.students_behavioral_issues?.splice(
          targetedIssueIndex ?? 0,
          1
        );
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

  const addQuranAchievmentReport = async (
    generalPlanId: number,
    newReport: AchievmentReport
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
      console.log(data);
      toastSuccess({
        title: "تم إضافة تقرير الإنجاز القرآني بنجاح",
      });

      navigateTo({ name: "students-view-students_table" });

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
      "full_name",
      "identity_number",
      "father_identity_number",
      "phone_number",
      "birth_date",
      "level",
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
    // student operations
    fetchStudents,
    fetchBehavioralIssues,
    addStudent,
    editStudent,
    deleteStudent,
    deleteMultipleStudents,
    addQuranAchievmentReport,
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
