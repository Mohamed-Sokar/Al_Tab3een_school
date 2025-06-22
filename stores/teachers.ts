import {
  behavioralIssuesTeacher,
  teachers,
  teachersLoans,
  teachersUpsentReports,
} from "~/constants";
import type {
  Teacher,
  BehavioralIssueTeacher,
  TeacherUpsentReport,
} from "~/types";
import { defineStore } from "pinia";

export const useTeacherStore = defineStore("teacher", () => {
  const teachersData = ref<Teacher[]>(teachers);
  const behavioralIssuesTeacherData = ref(behavioralIssuesTeacher);
  const teachersLoansData = ref(teachersLoans);
  const teachersUpsentReportsData = ref(teachersUpsentReports);

  // Teacher operations
  const addTeacher = (teacher: Teacher) => {
    teachersData.value.unshift({ ...teacher });
  };
  const editTeacher = (teacherId: number, newTeacher: Teacher) => {
    const teacherIndex = getSpesificTeacherIndex(teacherId);
    teachersData.value[teacherIndex] = newTeacher;
  };
  const deleteTeacher = (teacherId: number) => {
    const teacherIndex = teachersData.value.findIndex(
      (teacher) => teacher.id === teacherId
    );

    teachersData.value.splice(teacherIndex, 1);
  };
  const getSpesificTeacher = (teacherId: number) => {
    return teachersData.value.find((teacher) => teacher.id == teacherId);
  };
  const getSpesificTeacherIndex = (teacherId: number) => {
    return teachersData.value.findIndex((teacher) => teacher.id === teacherId);
  };

  // behavioral_issues operations
  const addTeacherBehavioralIssue = (
    teacherId: number,
    description: string
  ) => {
    const targetedTeacher = getSpesificTeacher(teacherId);

    const newTeacher = {
      ...targetedTeacher,
      behavioral_issues_count:
        typeof targetedTeacher?.behavioral_issues_count === "number"
          ? targetedTeacher?.behavioral_issues_count + 1
          : 0,
    };

    editTeacher(teacherId, newTeacher);

    const newIssueBuffer = {
      id: Math.random(),
      date: new Date().toISOString().split("T")[0],
      teacher_name: targetedTeacher?.full_name,
      teacher_id: targetedTeacher?.id,
      // description: description,
      description: description,
    };

    behavioralIssuesTeacherData.value.unshift(newIssueBuffer);
  };
  const editTeacherBehavioralIssue = (
    issueId: number,
    newIssue: BehavioralIssueTeacher
  ) => {
    const issueIndex = getSpesificTeacherBehavioralIssueIndex(issueId);
    behavioralIssuesTeacherData.value[issueIndex] = {
      ...behavioralIssuesTeacherData.value[issueIndex],
      // description: description,
      ...newIssue,
    };
  };
  const deleteTeacherBehavioralIssue = (issueId: number) => {
    // Update the teacher's behavioral issues count
    const targetedIssue = getSpesificTeacherBehavioralIssue(issueId);
    const targetedTeacher = getSpesificTeacher(targetedIssue?.teacher_id ?? 0);

    if (targetedTeacher) {
      editTeacher(targetedIssue?.teacher_id || 0, {
        ...targetedTeacher,
        behavioral_issues_count:
          typeof targetedTeacher?.behavioral_issues_count === "number"
            ? targetedTeacher?.behavioral_issues_count - 1
            : 0,
      });
    }
    // Remove the issue from the list
    const issueIndex = getSpesificTeacherBehavioralIssueIndex(issueId);

    behavioralIssuesTeacherData.value.splice(issueIndex, 1);
  };
  const getSpesificTeacherBehavioralIssue = (issueId: number) => {
    return behavioralIssuesTeacherData.value.find(
      (issue) => issue.id === issueId
    );
  };
  const getSpesificTeacherBehavioralIssueIndex = (issueId: number) => {
    return behavioralIssuesTeacherData.value.findIndex(
      (issue) => issue.id === issueId
    );
  };

  // Teacher loans operations
  const addTeacherLoan = (teacherId: number, amount: number) => {
    const targetedTeacher = getSpesificTeacher(teacherId);
    // Update the teacher's loans count and amount
    const newTeacher = {
      ...targetedTeacher,
      loans_count:
        typeof targetedTeacher?.loans_count === "number"
          ? targetedTeacher?.loans_count + 1
          : 0,
      loans_amount:
        typeof targetedTeacher?.loans_amount === "number"
          ? targetedTeacher?.loans_amount + +amount
          : 0,
    };
    console.log(newTeacher);
    // Edit the teacher's data
    editTeacher(teacherId, newTeacher);

    // Add the new loan to the loans data
    teachersLoansData.value.unshift({
      id: Math.random(),
      date: new Date().toISOString().split("T")[0],
      teacher_id: targetedTeacher?.id,
      teacher_name: targetedTeacher?.full_name,
      amount,
    });
  };
  const editTeacherLoan = (loanId: number, amount: number) => {
    const loanIndex = getSpesificTeacherLoanIndex(loanId);

    teachersLoansData.value[loanIndex] = {
      ...teachersLoansData.value[loanIndex],
      amount,
    };
  };
  const deleteTeacherLoan = (loanId: number) => {
    const loanIndex = getSpesificTeacherLoanIndex(loanId);

    if (loanIndex === -1) return;
    // Update the teacher's loans count and amount
    const targetedLoan = teachersLoansData.value[loanIndex];
    const targetedTeacher = getSpesificTeacher(targetedLoan?.teacher_id || 0);
    if (!targetedTeacher) return;
    // Edit the teacher's data by decreasing the loans count and amount
    if (targetedTeacher) {
      editTeacher(targetedTeacher?.id || 0, {
        ...targetedTeacher,
        loans_count: targetedTeacher.loans_count || 0 - 1,
        loans_amount:
          (targetedTeacher.loans_amount || 0) - (targetedLoan.amount || 0),
      });
    }

    teachersLoansData.value.splice(loanIndex, 1);
  };
  const getSpesificTeacherLoan = (loanId: number) => {
    return teachersLoansData.value.find((loan) => loan.id === loanId);
  };
  const getSpesificTeacherLoanIndex = (loanId: number) => {
    return teachersLoansData.value.findIndex((loan) => loan.id === loanId);
  };

  // Teacher Upsent Reports operations
  const addTeacherUpsentReport = (
    teacherId: number,
    report: TeacherUpsentReport
  ) => {
    const targetedTeacher = getSpesificTeacher(teacherId);
    if (!targetedTeacher) return;

    // Update the teacher's upsent reports count
    const newTeacher = {
      ...targetedTeacher,
      upsent_reports_count:
        typeof targetedTeacher?.upsent_reports_count === "number"
          ? targetedTeacher?.upsent_reports_count + 1
          : 0,
    };
    editTeacher(teacherId, newTeacher);

    // Add the new report to the reports data
    teachersUpsentReportsData.value.unshift({
      id: Math.random(),
      // date: report.date,
      date: new Date().toISOString().split("T")[0],
      teacher_id: targetedTeacher.id,
      teacher_name: targetedTeacher.full_name,
      // reason: report.reason,
    });
  };
  const deleteTeacherUpsentReport = (reportId: number) => {
    const reportIndex = getSpesificTeacherUpsentReportIndex(reportId);
    if (reportIndex === -1) return;

    // Update the teacher's upsent reports count
    const targetedReport = getSpesificTeacherUpsentReport(reportId);
    const targetedTeacher = getSpesificTeacher(targetedReport?.teacher_id || 0);

    if (targetedTeacher) {
      editTeacher(targetedTeacher?.id || 0, {
        ...targetedTeacher,
        upsent_reports_count:
          typeof targetedTeacher?.upsent_reports_count === "number"
            ? targetedTeacher?.upsent_reports_count - 1
            : 0,
      });
    }
    // Remove the report from the list
    teachersUpsentReportsData.value.splice(reportIndex, 1);
  };
  const toggleTeacherUpsentReport = (
    teacherId: number,
    report: TeacherUpsentReport
  ) => {
    // const reportIndex = getSpesificTeacherUpsentReportIndex(report.id);
    const reportIndex = teachersUpsentReportsData.value.findIndex(
      (r) => r.teacher_id === teacherId && r.date === report.date
    );
    if (reportIndex !== -1) {
      // If the report already exists, remove it
      deleteTeacherUpsentReport(
        teachersUpsentReportsData.value[reportIndex].id || 0
      );
    } else {
      // If the report does not exist, add it
      addTeacherUpsentReport(teacherId, report);
    }
  };
  const editTeacherUpsentReport = (
    reportId: number,
    newReport: TeacherUpsentReport
  ) => {
    const reportIndex = teachersUpsentReportsData.value.findIndex(
      (report) => report.id === reportId
    );

    teachersUpsentReportsData.value[reportIndex] = {
      ...teachersUpsentReportsData.value[reportIndex],
      ...newReport,
    };
  };
  const getSpesificTeacherUpsentReport = (reportId: number) => {
    return teachersUpsentReportsData.value.find(
      (report) => report.id == reportId
    );
  };
  const getSpesificTeacherUpsentReportIndex = (reportId: number) => {
    return teachersUpsentReportsData.value.findIndex((r) => r.id === reportId);
  };

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
    // teachers
    teachersData,
    addTeacher,
    editTeacher,
    deleteTeacher,
    getSpesificTeacher,
    getSpesificTeacherIndex,
    // behavioral_issues
    behavioralIssuesTeacherData,
    addTeacherBehavioralIssue,
    editTeacherBehavioralIssue,
    deleteTeacherBehavioralIssue,
    getSpesificTeacherBehavioralIssue,
    getSpesificTeacherBehavioralIssueIndex,
    // teachers loans
    teachersLoansData,
    addTeacherLoan,
    editTeacherLoan,
    deleteTeacherLoan,
    getSpesificTeacherLoan,
    getSpesificTeacherLoanIndex,
    // teachers upsent reports
    teachersUpsentReportsData,
    toggleTeacherUpsentReport,
    addTeacherUpsentReport,
    editTeacherUpsentReport,
    deleteTeacherUpsentReport,
    getSpesificTeacherUpsentReport,
    getSpesificTeacherUpsentReportIndex,
    // computed properties
    totalTeacherAbsence,
    totalTeacherLoans,
  };
});
