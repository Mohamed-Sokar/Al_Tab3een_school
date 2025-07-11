import type {
  Teacher,
  BehavioralIssueTeacher,
  TeacherAbsenceReport,
  TeacherLoan,
} from "~/types";
import { defineStore } from "pinia";
import { useAppToast } from "@/composables/useAppToast";

export const useTeachersStore = defineStore("teachers", () => {
  const { toastSuccess, toastError } = useAppToast();

  const teachersData = ref<Teacher[]>([]);
  const loading = ref(false);
  const behavioralIssuesTeachersData = ref<BehavioralIssueTeacher[]>([]);
  const teachersLoansData = ref<TeacherLoan[]>([]);

  const teachersAbsenceReportsData = ref<TeacherAbsenceReport[]>([]);
  const tableKey = ref(Math.random());

  // Getters
  const sortedTeachers = computed(() => {
    return teachersData.value.sort((a, b) =>
      (a.first_name ?? "").localeCompare(b.first_name ?? "")
    );
  });
  const sortedIssues = computed(() => {
    return behavioralIssuesTeachersData.value.sort((a, b) => {
      const aDate = a.created_at ? new Date(a.created_at).getTime() : 0;
      const bDate = b.created_at ? new Date(b.created_at).getTime() : 0;
      return aDate - bDate;
    });
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
        title: `:تم إضافة المعلم ${data[0].first_name} ${data[0].last_name} بنجاح`,
      });
      // add teacher locally
      teachersData.value.unshift({ ...data[0] });
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
        title: `:تم تحديث بيانات المعلم ${data[0].first_name} ${data[0].last_name} بنجاح`,
      });
      // update teacher locally
      const teacherIndex = getSpesificTeacherIndex(teacherId);
      const targetedTeacher = getSpesificTeacher(teacherId);

      // Keep existing behavioral_issues from old data
      if (teachersData.value && teacherIndex !== -1 && !!targetedTeacher) {
        // ensure exsisting the behavioral issues array
        if (!targetedTeacher.behavioral_issues) {
          targetedTeacher.behavioral_issues = [];
        }

        const existingIssues =
          teachersData.value[teacherIndex].behavioral_issues;
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
    } catch (err) {
      toastError({
        title: "حدث مشكلة في تحميل المخالفات الإدارية",
        description: err instanceof Error ? err.message : String(err),
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

    const issue = {
      teacher_id: targetedTeacher.id,
      description: description,
    };

    try {
      loading.value = true;
      const { data } = await api.post("/teachers/behavioral-issues", issue);
      console.log(data);
      toastSuccess({
        title: "تم إضافة المخالفة السلوكية",
      });

      if (teachersData.value && !!targetedTeacher) {
        // ensure exsisting the behavioral issues array
        if (!targetedTeacher.behavioral_issues) {
          targetedTeacher.behavioral_issues = [];
        }

        // add new behavioral Issue
        targetedTeacher.behavioral_issues.push({
          ...data[0], // المخالفة التي أرجعها السيرفر
        });
      }

      const newIssue = {
        ...issue,
        teacher: {
          first_name: targetedTeacher.first_name,
          last_name: targetedTeacher.last_name,
        },
      };
      behavioralIssuesTeachersData.value.unshift({ ...newIssue, ...data[0] });
    } catch (err) {
      toastError({
        title: "حدث مشكلة في إضافة المخالفة السلوكية",
        description: err instanceof Error ? err.message : String(err),
      });
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
        teachersData.value[teacherIndex].behavioral_issues
      ) {
        // You can safely access students_behavioral_issues[issueIndex] here
        const issueIndex =
          targetedTeacher?.behavioral_issues?.findIndex(
            (issue) => issue.id === issueId
          ) || 0;

        // For example, update the description:
        teachersData.value[teacherIndex].behavioral_issues[
          issueIndex
        ].description = description;
      }

      // tableKey.value = Math.random();

      toastSuccess({
        title: "تم تعديل المخالفة بنجاح",
      });
    } catch (err) {
      toastError({
        title: "حدثت مشكلة أثناء تعديل المخالفة",
        description: err instanceof Error ? err.message : String(err),
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
        const targetedIssueIndex = targetedTeacher.behavioral_issues?.findIndex(
          (issue) => issue.id === issueId
        );

        targetedTeacher.behavioral_issues?.splice(targetedIssueIndex ?? 0, 1);
      }
    } catch (err) {
      toastError({
        title: "حدث مشكلة في حذف المخالفة",
        description: err instanceof Error ? err.message : String(err),
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

    const loan = {
      teacher_id: targetedTeacher.id,
      amount: amount,
    };

    try {
      loading.value = true;
      const { data } = await api.post("/teachers/loans", loan);
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
          ...data[0],
        });
      }
      const newLoan = {
        ...loan,
        teacher: {
          first_name: targetedTeacher.first_name,
          last_name: targetedTeacher.last_name,
        },
      };
      teachersLoansData.value.unshift({ ...newLoan, ...data[0] });
    } catch (err) {
      toastError({
        title: "حدث مشكلة في إضافة السلفة",
        description: err instanceof Error ? err.message : String(err),
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
        teachersData.value[teacherIndex].loans
      ) {
        // You can safely access teachers_loans[loanIndex] here
        const loanIndex =
          targetedTeacher?.loans?.findIndex((loan) => loan.id === loanId) || 0;

        teachersData.value[teacherIndex].loans[loanIndex].amount = amount;
      }

      toastSuccess({
        title: "تم تعديل السلفة بنجاح",
      });
    } catch (err) {
      toastError({
        title: "حدثت مشكلة أثناء تعديل السلفة",
        description: err instanceof Error ? err.message : String(err),
      });
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
        const targetedLoanIndex = targetedTeacher.loans?.findIndex(
          (loan) => loan.id === loanId
        );

        targetedTeacher.loans?.splice(targetedLoanIndex ?? 0, 1);
      }
    } catch (err) {
      toastError({
        title: "حدث مشكلة في حذف السلفة",
        description: err instanceof Error ? err.message : String(err),
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
        description: err instanceof Error ? err.message : String(err),
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
      ...report,
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
        if (!targetedTeacher.absence) {
          targetedTeacher.absence = [];
        }

        // add new loan
        targetedTeacher.absence.unshift({
          ...data[0],
        });
      }
      const newAbsenceReport = {
        ...newReport,
        teacher: {
          first_name: targetedTeacher.first_name,
          last_name: targetedTeacher.last_name,
        },
      };
      // add report locally
      teachersAbsenceReportsData.value.unshift({
        ...newAbsenceReport,
        ...data[0],
      });
    } catch (err) {
      toastError({
        title: "حدث مشكلة في إضافة التقرير",
        description: err instanceof Error ? err.message : String(err),
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
        const targetedReportIndex = targetedTeacher.absence?.findIndex(
          (loan) => loan.id === reportId
        );

        targetedTeacher.loans?.splice(targetedReportIndex ?? 0, 1);
      }
    } catch (err) {
      toastError({
        title: "حدث مشكلة في حذف التقرير",
        description: err instanceof Error ? err.message : String(err),
      });
    } finally {
      loading.value = false;
    }
  };
  const editTeacherAbsenceReport = async (
    reportId: number,
    newReport: TeacherAbsenceReport
  ) => {
    try {
      loading.value = true;
      const targetedReport = getSpesificTeacherAbsenceReport(reportId);
      const reportIndex = getSpesificTeacherAbsenceReportIndex(reportId);
      const teacherIndex = getSpesificTeacherIndex(
        targetedReport?.teacher_id ?? ""
      );
      const targetedTeacher = getSpesificTeacher(
        targetedReport?.teacher_id || ""
      );

      const { data } = await api.put(`teachers/absence/${reportId}`, {
        // ...behavioralIssuesTeachersData.value[loanIndex],
        // ...targetedReport,
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
        teachersData.value[teacherIndex].absence
      ) {
        // You can safely access teachers_loans[loanIndex] here
        const reportIndex =
          targetedTeacher?.absence?.findIndex(
            (report) => report.id === reportId
          ) || 0;

        teachersData.value[teacherIndex].absence[reportIndex] = data[0];
      }
      toastSuccess({
        title: "تم تعديل التقرير بنجاح",
      });
    } catch (err) {
      toastError({
        title: "حدثت مشكلة أثناء تعديل التقرير",
        description: err instanceof Error ? err.message : String(err),
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

  // const totalTeacherAbsence = computed(() => (teacherId: string) => {
  //   return teachersAbsenceReportsData.value.filter(
  //     (report) => report.teacher_id === teacherId
  //   ).length;
  // });
  // const totalTeacherLoans = computed(() => (teacherId: string) => {
  //   return teachersLoansData.value.reduce((total, loan): number => {
  //     if (loan.teacher_id === teacherId) {
  //       return total + loan.amount;
  //     }
  //     return total;
  //   }, 0);
  // });

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
    // totalTeacherAbsence,
    // totalTeacherLoans,
    sortedTeachers,
    sortedLoans,
    sortedIssues,
    sortedAbsenceReports,
  };
});
