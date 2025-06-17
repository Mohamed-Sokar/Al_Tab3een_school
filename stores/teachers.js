import {
  behavioralIssuesTeacher,
  teachers,
  teachersLoans,
  teachersUpsentReports,
} from "~/constants";
import { defineStore } from "pinia";

export const useTeacherStore = defineStore("teacher", () => {
  const teachersData = ref(teachers);
  const behavioralIssuesTeacherData = ref(behavioralIssuesTeacher);
  const teachersLoansData = ref(teachersLoans);
  const teachersUpsentReportsData = ref(teachersUpsentReports);

  // Teacher operations
  const addTeacher = (teacher) => {
    teachersData.value.unshift({ ...teacher });
  };
  const editTeacher = (id, newTeacher) => {
    const teacherIndex = getSpesificTeacherIndex(id);
    teachersData.value[teacherIndex] = newTeacher;
    console.log(teachersData.value[teacherIndex]);
  };
  const deleteTeacher = (id) => {
    const teacherIndex = teachersData.value.findIndex(
      (teacher) => teacher.id === id
    );

    teachersData.value.splice(teacherIndex, 1);
  };
  const getSpesificTeacher = (id) => {
    return teachersData.value.find((teacher) => teacher.id == id);
  };
  const getSpesificTeacherIndex = (id) => {
    return teachersData.value.findIndex(
      (teacher) => teacher.id.toString() === id.toString()
    );
  };

  // behavioral_issues operations
  const addTeacherBehavioralIssue = (teacher_id, newIssue) => {
    const targetedTeacher = getSpesificTeacher(teacher_id);

    const newTeacher = {
      ...targetedTeacher,
      behavioral_issues_count: targetedTeacher.behavioral_issues_count + 1,
    };

    editTeacher(teacher_id, newTeacher);

    const newIssueBuffer = {
      id: Math.random(),
      date: new Date().toISOString().split("T")[0],
      teacher_name: targetedTeacher?.full_name,
      teacher_id: targetedTeacher?.id,
      description: newIssue.description,
    };

    behavioralIssuesTeacherData.value.unshift(newIssueBuffer);
  };
  const editTeacherBehavioralIssue = (id, newIssue) => {
    const issueIndex = getSpesificTeacherBehavioralIssueIndex(id);
    behavioralIssuesTeacherData.value[issueIndex] = {
      ...behavioralIssuesTeacherData.value[issueIndex],
      ...newIssue,
      // description: newIssue.description,
    };
  };
  const deleteTeacherBehavioralIssue = (issueId) => {
    // Update the teacher's behavioral issues count
    const targetedIssue = getSpesificTeacherBehavioralIssue(issueId);
    const targetedTeacher = getSpesificTeacher(
      targetedIssue?.teacher_id.toString()
    );

    if (targetedTeacher) {
      editTeacher(targetedTeacher.id, {
        ...targetedTeacher,
        behavioral_issues_count: targetedTeacher.behavioral_issues_count - 1,
      });
    }
    // Remove the issue from the list
    const issueIndex = behavioralIssuesTeacherData.value.findIndex(
      (issue) => issue.id === id
    );

    behavioralIssuesTeacherData.value.splice(issueIndex, 1);
  };
  const getSpesificTeacherBehavioralIssue = (id) => {
    return behavioralIssuesTeacherData.value.find(
      (issue) => issue.id.toString() === id.toString()
    );
  };
  const getSpesificTeacherBehavioralIssueIndex = (id) => {
    return behavioralIssuesTeacherData.value.findIndex(
      (issue) => issue.id.toString() === id.toString()
    );
  };

  // Teacher loans operations
  const addTeacherLoan = (teacher_id, amount) => {
    const targetedTeacher = getSpesificTeacher(teacher_id);
    // Update the teacher's loans count and amount
    const newTeacher = {
      ...targetedTeacher,
      loans_count: targetedTeacher.loans_count + 1,
      loans_amount: +targetedTeacher.loans_amount + +amount,
    };

    // Edit the teacher's data
    editTeacher(teacher_id, newTeacher);

    // Add the new loan to the loans data
    teachersLoansData.value.unshift({
      id: Math.random(),
      date: new Date().toISOString().split("T")[0],
      teacher_id: targetedTeacher.id,
      teacher_name: targetedTeacher.full_name,
      amount,
    });
  };
  const editTeacherLoan = (loanId, amount) => {
    const loanIndex = getSpesificTeacherLoanIndex(loanId);

    teachersLoansData.value[loanIndex] = {
      ...teachersLoansData.value[loanIndex],
      amount,
    };
  };
  const deleteTeacherLoan = (id) => {
    const loanIndex = teachersLoansData.value.findIndex(
      (loan) => loan.id.toString() === id.toString()
    );

    if (loanIndex === -1) return;
    // Update the teacher's loans count and amount
    const targetedLoan = teachersLoansData.value[loanIndex];
    const targetedTeacher = getSpesificTeacher(
      targetedLoan?.teacher_id.toString()
    );
    if (!targetedTeacher) return;
    // Edit the teacher's data by decreasing the loans count and amount
    if (targetedTeacher) {
      editTeacher(targetedTeacher.id, {
        ...targetedTeacher,
        loans_count: +targetedTeacher.loans_count - 1,
        loans_amount: +targetedTeacher.loans_amount - +targetedLoan.amount,
      });
    }

    teachersLoansData.value.splice(loanIndex, 1);
  };
  const getSpesificTeacherLoan = (loanId) => {
    return teachersLoansData.value.find(
      (loan) => loan.id.toString() === loanId.toString()
    );
  };
  const getSpesificTeacherLoanIndex = (loanId) => {
    return teachersLoansData.value.findIndex(
      (loan) => loan.id.toString() === loanId.toString()
    );
  };

  // Teacher Upsent Reports operations
  const addTeacherUpsentReport = (teacher_id, report) => {
    const targetedTeacher = getSpesificTeacher(teacher_id);
    if (!targetedTeacher) return;

    // Update the teacher's upsent reports count
    const newTeacher = {
      ...targetedTeacher,
      upsent_reports_count: targetedTeacher.upsent_reports_count + 1,
    };
    editTeacher(teacher_id, newTeacher);

    // Add the new report to the reports data
    teachersUpsentReportsData.value.unshift({
      id: Math.random(),
      date: report.date,
      teacher_id: targetedTeacher.id,
      teacher_name: targetedTeacher.full_name,
      // reason: report.reason,
    });
  };
  const deleteTeacherUpsentReport = (reportId) => {
    const reportIndex = getSpesificTeacherUpsentReportIndex(reportId);
    if (reportIndex === -1) return;

    // Update the teacher's upsent reports count
    const targetedReport = getSpesificTeacherUpsentReport(reportId);
    const targetedTeacher = getSpesificTeacher(
      targetedReport?.teacher_id.toString()
    );

    if (targetedTeacher) {
      editTeacher(targetedTeacher.id, {
        ...targetedTeacher,
        upsent_reports_count: targetedTeacher.upsent_reports_count - 1,
      });
    }
    // Remove the report from the list
    teachersUpsentReportsData.value.splice(reportIndex, 1);
  };
  const toggleTeacherUpsentReport = (teacher_id, report) => {
    // const reportIndex = getSpesificTeacherUpsentReportIndex(report.id);
    const reportIndex = teachersUpsentReportsData.value.findIndex(
      (r) => r.teacher_id === teacher_id && r.date === report.date
    );
    console.log(reportIndex);
    if (reportIndex !== -1) {
      // If the report already exists, remove it
      deleteTeacherUpsentReport(
        teachersUpsentReportsData.value[reportIndex].id
      );
    } else {
      // If the report does not exist, add it
      addTeacherUpsentReport(teacher_id, report);
    }
  };
  const editTeacherUpsentReport = (id, newReport) => {
    const reportIndex = teachersUpsentReportsData.value.findIndex(
      (report) => report.id === id
    );

    teachersUpsentReportsData.value[reportIndex] = {
      ...teachersUpsentReportsData.value[reportIndex],
      ...newReport,
    };
  };
  const getSpesificTeacherUpsentReport = (reportId) => {
    return teachersUpsentReportsData.value.find(
      (report) => report.id == reportId
    );
  };
  const getSpesificTeacherUpsentReportIndex = (reportId) => {
    return teachersUpsentReportsData.value.findIndex((r) => r.id === reportId);
  };

  const totalTeacherAbsence = computed(() => (teacher_id) => {
    return teachersUpsentReportsData.value.filter(
      (report) => report.teacher_id === teacher_id
    ).length;
  });
  const totalTeacherLoans = computed(() => (teacher_id) => {
    return teachersLoansData.value.reduce((total, loan) => {
      if (loan.teacher_id === teacher_id) {
        return total + loan.loanValue;
      }
      return total;
    });
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
