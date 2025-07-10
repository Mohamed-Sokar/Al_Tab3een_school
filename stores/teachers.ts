import type {
  Teacher,
  BehavioralIssueTeacher,
  TeacherAbsenceReport,
  TeacherLoan,
} from "~/types";
import { defineStore } from "pinia";
import { useAppToast } from "@/composables/useAppToast";
import { teachers } from "~/constants";

export const useTeachersStore = defineStore("teachers", () => {
  const { toastSuccess, toastError } = useAppToast();

  const teachersData = ref<Teacher[]>(teachers);
  const loading = ref(false);
  const behavioralIssuesTeachersData = ref<BehavioralIssueTeacher[]>([]);
  const teachersLoansData = ref<TeacherLoan[]>([]);

  const teachersAbsenceReportsData = ref<TeacherAbsenceReport[]>([]);
  const tableKey = ref(Math.random());

  // Getters
  const sortedTeachers = computed(() => {
    return teachersData.value.sort((a, b) =>
      (a.full_name ?? "").localeCompare(b.full_name ?? "")
    );
  });
  const sortedIssues = computed(() => {
    return behavioralIssuesTeachersData.value.sort((a, b) =>
      (a.teacher_name ?? "").localeCompare(b.teacher_name ?? "")
    );
  });
  const sortedLoans = computed(() => {
    return teachersLoansData.value.sort(
      (a, b) => (b.amount ?? 0) - (a.amount ?? 0)
    );
  });
  const sortedAbsenceReports = computed(() => {
    return teachersAbsenceReportsData.value.sort(
      (a, b) =>
        new Date(b.date || new Date()).getTime() -
        new Date(a.date || new Date()).getTime()
    );
  });

  // Actions
  const fetchTeachers = async () => {
    loading.value = true;
    try {
      const { data } = await api.get("/teachers");
      console.log(data);
      // set students data to ref locally
      teachersData.value = data;
      toastSuccess({
        title: "تم تحميل المعلمين بنجاح",
      });
      tableKey.value = Math.random();
    } catch (err) {
      toastError({
        title: "هناك مشكلة في تحميل المعلمين",
        description: "تحقق من الاتصال بالنترنت",
      });
      throw new Error("خطأ في تحميل المعلمين");
    } finally {
      loading.value = false;
    }
  };
  const addTeacher = async (teacher: Teacher) => {
    try {
      loading.value = true;
      const { data } = await api.post("/teachers", teacher);
      toastSuccess({
        title: `:تم إضافة المعلم ${data[0].full_name} بنجاح`,
      });
      // add teacher locally
      teachersData.value.unshift({ ...teacher });
    } catch (err) {
      toastError({
        title: "حدث مشكلة في إضافة المعلم",
        description: "تحقق من الاتصال بالنترنت",
      });
      throw Error(err instanceof Error ? err.message : String(err));
    } finally {
      loading.value = false;
    }
  };
  const updateTeacher = async (teacherId: string, newTeacher: Teacher) => {
    try {
      loading.value = true;
      const cleaned = removeInvalidFields(newTeacher); // 🧹 remove unfound columns in DB

      const { data } = await api.put(`teachers/${teacherId}`, cleaned);

      toastSuccess({
        title: `:تم تحديث بيانات المعلم ${data[0].full_name} بنجاح`,
      });
      // update teacher locally
      const teacherIndex = getSpesificTeacherIndex(teacherId);
      const targetedTeacher = getSpesificTeacher(teacherId);

      // Keep existing behavioral_issues from old data
      if (teachersData.value && teacherIndex !== -1 && !!targetedTeacher) {
        // ensure exsisting the behavioral issues array
        if (!targetedTeacher.teachers_behavioral_issues) {
          targetedTeacher.teachers_behavioral_issues = [];
        }

        const existingIssues =
          teachersData.value[teacherIndex].teachers_behavioral_issues;
        // Merge new data and keep behavioral_issues field

        if (!!existingIssues) {
          teachersData.value[teacherIndex] = {
            ...data[0],
            teachers_behavioral_issues: existingIssues,
          };
        }
      }

      teachersData.value[teacherIndex] = { ...targetedTeacher, ...newTeacher };
    } catch (err) {
      toastError({
        title: "حدث مشكلة في تعديل المعلم",
        description: "تحقق من الاتصال بالنترنت",
      });
      throw Error(err instanceof Error ? err.message : String(err));
    } finally {
      loading.value = false;
    }
  };
  const deleteTeacher = async (teacherId: string) => {
    try {
      loading.value = true;
      const { data } = await api.delete(`teachers/${teacherId}`);
      toastSuccess({
        title: `:تم حذف المعلم ( ${data[0].full_name} ) بنجاح`,
      });
      console.log(data);
      // delete student locally
      const teacherIndex = getSpesificTeacherIndex(teacherId);
      teachersData.value.splice(teacherIndex, 1);
    } catch (err) {
      toastError({
        description: "تحقق من الاتصال بالنترنت",
        title: "حدث مشكلة في حذف المعلم",
      });
      throw Error("حدث مشكلة في حذف المعلم");
    } finally {
      loading.value = false;
    }
  };
  const getSpesificTeacher = (teacherId: string) => {
    return teachersData.value.find((teacher) => teacher.id === teacherId);
  };
  const getSpesificTeacherIndex = (teacherId: string) => {
    return teachersData.value.findIndex((teacher) => teacher.id === teacherId);
  };

  const fetchTeachersBehavioralIssues = async () => {
    loading.value = true;
    try {
      const { data } = await api.get("/teachers/behavioral-issues");
      console.log(data);
      // set behavioral Issues data to ref locally
      behavioralIssuesTeachersData.value = data;
      toastSuccess({
        title: "تم تحميل المخالفات بنجاح",
      });
      // tableKey.value = Math.random();
    } catch (err) {
      toastError({
        title: err.message,
        description: "تحقق من الاتصال بالنترنت",
      });
      throw Error(err instanceof Error ? err.message : String(err));
    } finally {
      loading.value = false;
    }
  };
  const addTeacherBehavioralIssue = async (
    teacherId: string,
    description: string
  ) => {
    const targetedTeacher = getSpesificTeacher(teacherId);

    if (!targetedTeacher) return;

    const newIssue = {
      teacher_id: targetedTeacher.id,
      teacher_name: targetedTeacher?.full_name,
      description: description,
      date: new Date().toISOString().split("T")[0],
    };

    try {
      loading.value = true;
      const { data } = await api.post("/teachers/behavioral-issues", newIssue);
      console.log(data);
      toastSuccess({
        title: "تم إضافة المخالفة السلوكية",
      });

      if (teachersData.value && !!targetedTeacher) {
        // ensure exsisting the behavioral issues array
        if (!targetedTeacher.teachers_behavioral_issues) {
          targetedTeacher.teachers_behavioral_issues = [];
        }

        // add new behavioral Issue
        targetedTeacher.teachers_behavioral_issues.push({
          id: data[0].id, // المخالفة التي أرجعها السيرفر
          ...newIssue,
        });
      }

      behavioralIssuesTeachersData.value.unshift(data[0]);
    } catch (err) {
      toastError({
        title: "حدث مشكلة في إضافة المخالفة السلوكية",
        description: "تحقق من الاتصال بالنترنت",
      });
      // throw Error(err instanceof Error ? err.message : String(err));s
    } finally {
      loading.value = false;
    }
  };
  const editTeacherBehavioralIssue = async (
    issueId: number,
    description: string
  ) => {
    try {
      loading.value = true;
      const issueIndex = getSpesificTeacherBehavioralIssueIndex(issueId);
      const targetedIssue = getSpesificTeacherBehavioralIssue(issueId);
      const teacherIndex = getSpesificTeacherIndex(
        targetedIssue?.teacher_id ?? ""
      );
      const targetedTeacher = getSpesificTeacher(
        targetedIssue?.teacher_id ?? ""
      );

      const { data } = await api.put(`/teachers/behavioral-issues/${issueId}`, {
        // ...behavioralIssuesTeachersData.value[issueIndex],
        description,
      });
      console.log(data);

      behavioralIssuesTeachersData.value[issueIndex] = {
        ...behavioralIssuesTeachersData.value[issueIndex],
        description: description,
      };

      // update students behavioral issues array locally
      if (
        teachersData.value &&
        teachersData.value[teacherIndex] &&
        teachersData.value[teacherIndex].teachers_behavioral_issues
      ) {
        // You can safely access students_behavioral_issues[issueIndex] here
        const issueIndex =
          targetedTeacher?.teachers_behavioral_issues?.findIndex(
            (issue) => issue.id === issueId
          ) || 0;

        // For example, update the description:
        teachersData.value[teacherIndex].teachers_behavioral_issues[
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
        description: "تحقق من الاتصال بالنترنت",
      });
      throw Error(err instanceof Error ? err.message : String(err));
    } finally {
      loading.value = false;
    }
  };
  const deleteTeacherBehavioralIssue = async (issueId: number) => {
    // Update the teacher's behavioral issues
    const targetedIssue = getSpesificTeacherBehavioralIssue(issueId);
    const issueIndex = getSpesificTeacherBehavioralIssueIndex(issueId);
    const targetedTeacher = getSpesificTeacher(targetedIssue?.teacher_id ?? "");

    try {
      // delete issue from DB
      loading.value = true;
      const { data } = await api.delete(
        `teachers/behavioral-issues/${issueId}`
      );
      toastSuccess({
        title: `:تم حذف المخالفة بنجاح`,
      });
      console.log(data);
      // delete issue locally
      behavioralIssuesTeachersData.value.splice(issueIndex, 1);

      // delete issue from the student behavioral issues array
      if (!!targetedTeacher) {
        const targetedIssueIndex =
          targetedTeacher.teachers_behavioral_issues?.findIndex(
            (issue) => issue.id === issueId
          );

        targetedTeacher.teachers_behavioral_issues?.splice(
          targetedIssueIndex ?? 0,
          1
        );
      }
    } catch (err) {
      toastError({
        title: "حدث مشكلة في حذف المخالفة",
        description: "تحقق من الاتصال بالنترنت",
      });
    } finally {
      loading.value = false;
    }
  };
  const getSpesificTeacherBehavioralIssue = (issueId: number) => {
    return behavioralIssuesTeachersData.value.find(
      (issue) => issue.id === issueId
    );
  };
  const getSpesificTeacherBehavioralIssueIndex = (issueId: number) => {
    return behavioralIssuesTeachersData.value.findIndex(
      (issue) => issue.id === issueId
    );
  };

  // Teacher loans operations
  const fetchTeachersLoans = async () => {
    loading.value = true;
    try {
      const { data } = await api.get("/teachers/loans");
      console.log(data);
      // set loans data to ref locally
      teachersLoansData.value = data;

      toastSuccess({
        title: "تم تحميل السلف بنجاح",
      });
      // tableKey.value = Math.random();
    } catch (err) {
      toastError({
        title: "حدث مشكلة في تحميل السلف",
        description: "تحقق من الاتصال بالنترنت",
      });
      throw Error(err instanceof Error ? err.message : String(err));
    } finally {
      loading.value = false;
    }
  };
  const addTeacherLoan = async (teacherId: string, amount: number) => {
    const targetedTeacher = getSpesificTeacher(teacherId);

    if (!targetedTeacher) return;

    const newLoan = {
      teacher_id: targetedTeacher.id,
      teacher_name: targetedTeacher?.full_name,
      amount: amount,
      date: new Date().toISOString().split("T")[0],
    };

    try {
      loading.value = true;
      const { data } = await api.post("/teachers/loans", newLoan);
      console.log(data);
      toastSuccess({
        title: "تم إضافة السلفة",
      });

      if (teachersData.value && !!targetedTeacher) {
        // ensure exsisting the loans array
        if (!targetedTeacher.teachers_loans) {
          targetedTeacher.teachers_loans = [];
        }

        // add new loan
        targetedTeacher.teachers_loans.unshift({
          id: data[0].id,
          ...newLoan,
        });
      }

      teachersLoansData.value.unshift(data[0]);
    } catch (err) {
      toastError({
        title: "حدث مشكلة في إضافة السلفة",
        description: "تحقق من الاتصال بالنترنت",
      });
      // throw Error(err instanceof Error ? err.message : String(err));s
    } finally {
      loading.value = false;
    }
  };
  const editTeacherLoan = async (loanId: number, amount: number) => {
    try {
      loading.value = true;
      const loanIndex = getSpesificTeacherLoanIndex(loanId);
      const targetedLoan = getSpesificTeacherLoan(loanId);
      const teacherIndex = getSpesificTeacherIndex(
        targetedLoan?.teacher_id ?? ""
      );
      const targetedTeacher = getSpesificTeacher(
        targetedLoan?.teacher_id || ""
      );

      const { data } = await api.put(`/teachers/loans/${loanId}`, {
        // ...behavioralIssuesTeachersData.value[loanIndex],
        amount,
      });
      console.log(data);

      // update loans data locally
      teachersLoansData.value[loanIndex] = {
        // ...data[0],
        ...teachersLoansData.value[loanIndex],
        amount: amount,
      };
      // update teacher loans array locally
      if (
        teachersData.value &&
        teachersData.value[teacherIndex] &&
        teachersData.value[teacherIndex].teachers_loans
      ) {
        // You can safely access teachers_loans[loanIndex] here
        const loanIndex =
          targetedTeacher?.teachers_loans?.findIndex(
            (loan) => loan.id === loanId
          ) || 0;

        teachersData.value[teacherIndex].teachers_loans[loanIndex].amount =
          amount;
      }

      tableKey.value = Math.random();

      toastSuccess({
        title: "تم تعديل السلفة بنجاح",
      });
    } catch (err) {
      toastError({
        title: "حدثت مشكلة أثناء تعديل السلفة",
        description: "تحقق من الاتصال بالنترنت",
      });
      throw Error(err instanceof Error ? err.message : String(err));
    } finally {
      loading.value = false;
    }
  };
  const deleteTeacherLoan = async (loanId: number) => {
    const targetedLoan = getSpesificTeacherLoan(loanId);
    const loanIndex = getSpesificTeacherLoanIndex(loanId);
    const targetedTeacher = getSpesificTeacher(targetedLoan?.teacher_id ?? "");

    try {
      // delete issue from DB
      loading.value = true;
      const { data } = await api.delete(`teachers/loans/${loanId}`);
      toastSuccess({
        title: `:تم حذف السلفة بنجاح`,
      });
      console.log(data);
      // delete issue locally
      teachersLoansData.value.splice(loanIndex, 1);

      // delete issue from the student behavioral issues array
      if (!!targetedTeacher) {
        const targetedLoanIndex = targetedTeacher.teachers_loans?.findIndex(
          (loan) => loan.id === loanId
        );

        targetedTeacher.teachers_loans?.splice(targetedLoanIndex ?? 0, 1);
      }
    } catch (err) {
      toastError({
        title: "حدث مشكلة في حذف السلفة",
        description: "تحقق من الاتصال بالنترنت",
      });
    } finally {
      loading.value = false;
    }
  };
  const getSpesificTeacherLoan = (loanId: number) => {
    return teachersLoansData.value.find((loan) => loan.id === loanId);
  };
  const getSpesificTeacherLoanIndex = (loanId: number) => {
    return teachersLoansData.value.findIndex((loan) => loan.id === loanId);
  };
  const fetchAbsenceReports = async () => {
    loading.value = true;
    try {
      const { data } = await api.get("/teachers/absence");
      console.log(data);
      // set loans data to ref locally
      teachersAbsenceReportsData.value = data;

      toastSuccess({
        title: "تم تحميل تقارير الغياب بنجاح",
      });
      // tableKey.value = Math.random();
    } catch (err) {
      toastError({
        title: "حدث مشكلة في تحميل تقارير الغياب",
        description: err.message,
      });
    } finally {
      loading.value = false;
    }
  };
  // Teacher Absence Reports operations
  const addTeacherAbsenceReport = async (
    teacherId: string,
    report: TeacherAbsenceReport
  ) => {
    const targetedTeacher = getSpesificTeacher(teacherId);

    if (!targetedTeacher) return;

    const newReport = {
      teacher_id: targetedTeacher.id,
      teacher_name: targetedTeacher?.full_name,
      reason: report.reason,
      excuse_status: report.excuse_status,
      date: report.date,
    };

    try {
      loading.value = true;
      const { data } = await api.post("/teachers/absence", newReport);
      console.log(data);
      toastSuccess({
        title: "تم إضافة التقرير",
      });

      if (teachersData.value && !!targetedTeacher) {
        // ensure exsisting the loans array
        if (!targetedTeacher.teachers_absence) {
          targetedTeacher.teachers_absence = [];
        }

        // add new loan
        targetedTeacher.teachers_absence.unshift({
          id: data[0].id,
          ...newReport,
        });
      }

      teachersAbsenceReportsData.value.unshift(data[0]);
    } catch (err) {
      toastError({
        title: "حدث مشكلة في إضافة التقرير",
        description: err.message,
      });
    } finally {
      loading.value = false;
    }
  };
  const deleteTeacherAbsenceReport = async (reportId: number) => {
    const targetedreport = getSpesificTeacherAbsenceReport(reportId);
    const reportIndex = getSpesificTeacherAbsenceReportIndex(reportId);
    const targetedTeacher = getSpesificTeacher(
      targetedreport?.teacher_id ?? ""
    );

    try {
      // delete report from DB
      loading.value = true;
      const { data } = await api.delete(`teachers/absence/${reportId}`);
      toastSuccess({
        title: `:تم حذف التقرير بنجاح`,
      });
      console.log(data);
      // delete report locally
      teachersAbsenceReportsData.value.splice(reportIndex, 1);

      // delete report from the student absence reports array
      if (!!targetedTeacher) {
        const targetedReportIndex = targetedTeacher.teachers_absence?.findIndex(
          (loan) => loan.id === reportId
        );

        targetedTeacher.teachers_loans?.splice(targetedReportIndex ?? 0, 1);
      }
    } catch (err) {
      toastError({
        title: "حدث مشكلة في حذف التقرير",
        description: err.message,
      });
    } finally {
      loading.value = false;
    }
  };
  // const toggleTeacherAbsenceReport = async (
  //   teacherId: number,
  //   report: TeacherUpsentReport
  // ) => {
  //   // const reportIndex = getSpesificTeacherUpsentReportIndex(report.id);
  //   const reportIndex = teachersAbsenceReportsData.value.findIndex(
  //     (r) => r.teacher_id === teacherId && r.date === report.date
  //   );
  //   if (reportIndex !== -1) {
  //     // If the report already exists, remove it
  //     deleteTeacherUpsentReport(
  //       teachersUpsentReportsData.value[reportIndex].id || 0
  //     );
  //   } else {
  //     // If the report does not exist, add it
  //     addTeacherUpsentReport(teacherId, report);
  //   }
  // };

  const editTeacherAbsenceReport = async (
    reportId: number,
    newReport: TeacherAbsenceReport
  ) => {
    try {
      loading.value = true;
      const targetedreport = getSpesificTeacherAbsenceReport(reportId);
      const reportIndex = getSpesificTeacherAbsenceReportIndex(reportId);
      const teacherIndex = getSpesificTeacherIndex(
        targetedreport?.teacher_id ?? ""
      );
      const targetedTeacher = getSpesificTeacher(
        targetedreport?.teacher_id || ""
      );

      const { data } = await api.put(`/teachers/absence/${reportId}`, {
        // ...behavioralIssuesTeachersData.value[loanIndex],
        ...targetedreport,
        ...newReport,
      });
      console.log(data);

      // update report data locally
      teachersAbsenceReportsData.value[reportIndex] = {
        // ...data[0],
        ...teachersAbsenceReportsData.value[reportIndex],
        ...newReport,
      };
      // update teacher absence reports array locally
      if (
        teachersData.value &&
        teachersData.value[teacherIndex] &&
        teachersData.value[teacherIndex].teachers_absence
      ) {
        // You can safely access teachers_loans[loanIndex] here
        const reportIndex =
          targetedTeacher?.teachers_absence?.findIndex(
            (report) => report.id === reportId
          ) || 0;

        teachersData.value[teacherIndex].teachers_absence[reportIndex] =
          data[0];
      }

      tableKey.value = Math.random();

      toastSuccess({
        title: "تم تعديل التقرير بنجاح",
      });
    } catch (err) {
      toastError({
        title: "حدثت مشكلة أثناء تعديل التقرير",
        description: err.message,
      });
    } finally {
      loading.value = false;
    }
  };
  const getSpesificTeacherAbsenceReport = (reportId: number) => {
    return teachersAbsenceReportsData.value.find(
      (report) => report.id == reportId
    );
  };
  const getSpesificTeacherAbsenceReportIndex = (reportId: number) => {
    return teachersAbsenceReportsData.value.findIndex((r) => r.id === reportId);
  };

  // helpre methods
  function removeInvalidFields(student: Teacher): Partial<Teacher> {
    const allowedFields = [
      "id",
      "full_name",
      "identity_number",
      "phone_number",
      "birth_date",
      "subject",
      "created_at",
    ];

    return Object.fromEntries(
      Object.entries(student).filter(([key]) => allowedFields.includes(key))
    );
  }

  const totalTeacherAbsence = computed(() => (teacherId: number) => {
    return teachersUpsentReportsData.value.filter(
      (report) => report.teacher_id === teacherId
    ).length;
  });
  const totalTeacherLoans = computed(() => (teacherId: number) => {
    return teachersLoansData.value.reduce((total, loan): number => {
      if (loan.teacher_id === teacherId) {
        return total + loan.amount;
      }
      return total;
    }, 0);
  });

  return {
    // Data
    teachersData,
    behavioralIssuesTeachersData,
    teachersLoansData,
    teachersAbsenceReportsData,
    loading,
    // Actions
    fetchTeachers,
    addTeacher,
    updateTeacher,
    deleteTeacher,
    getSpesificTeacher,
    getSpesificTeacherIndex,
    // behavioral_issues
    fetchTeachersBehavioralIssues,
    addTeacherBehavioralIssue,
    editTeacherBehavioralIssue,
    deleteTeacherBehavioralIssue,
    getSpesificTeacherBehavioralIssue,
    getSpesificTeacherBehavioralIssueIndex,
    // teachers loans
    fetchTeachersLoans,
    addTeacherLoan,
    editTeacherLoan,
    deleteTeacherLoan,
    getSpesificTeacherLoan,
    getSpesificTeacherLoanIndex,
    // teachers absence reports
    fetchAbsenceReports,
    // toggleTeacherAbsenceReport,
    addTeacherAbsenceReport,
    editTeacherAbsenceReport,
    deleteTeacherAbsenceReport,
    getSpesificTeacherAbsenceReport,
    getSpesificTeacherAbsenceReportIndex,
    // computed properties ==> Getters
    totalTeacherAbsence,
    totalTeacherLoans,
    sortedTeachers,
    sortedLoans,
    sortedIssues,
    sortedAbsenceReports,
  };
});
