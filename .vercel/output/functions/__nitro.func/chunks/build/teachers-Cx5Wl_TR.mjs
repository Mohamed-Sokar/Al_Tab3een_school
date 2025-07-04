import { defineStore } from 'pinia';
import { u as useAppToast } from './useAppToast-BZDaw0os.mjs';
import { ref, computed } from 'vue';
import { a as api } from './api-Bx7QNuNm.mjs';

const useTeachersStore = defineStore("teachers", () => {
  const { toastSuccess, toastError } = useAppToast();
  const teachersData = ref([]);
  const loading = ref(false);
  const behavioralIssuesTeachersData = ref([]);
  const teachersLoansData = ref([]);
  const teachersAbsenceReportsData = ref([]);
  const tableKey = ref(Math.random());
  const sortedTeachers = computed(() => {
    return teachersData.value.sort(
      (a, b) => {
        var _a, _b;
        return ((_a = a.full_name) != null ? _a : "").localeCompare((_b = b.full_name) != null ? _b : "");
      }
    );
  });
  const sortedIssues = computed(() => {
    return behavioralIssuesTeachersData.value.sort(
      (a, b) => {
        var _a, _b;
        return ((_a = a.teacher_name) != null ? _a : "").localeCompare((_b = b.teacher_name) != null ? _b : "");
      }
    );
  });
  const sortedLoans = computed(() => {
    return teachersLoansData.value.sort(
      (a, b) => {
        var _a, _b;
        return ((_a = b.amount) != null ? _a : 0) - ((_b = a.amount) != null ? _b : 0);
      }
    );
  });
  const sortedAbsenceReports = computed(() => {
    return teachersAbsenceReportsData.value.sort(
      (a, b) => new Date(b.date || /* @__PURE__ */ new Date()).getTime() - new Date(a.date || /* @__PURE__ */ new Date()).getTime()
    );
  });
  const fetchTeachers = async () => {
    loading.value = true;
    try {
      const { data } = await api.get("/teachers");
      console.log(data);
      teachersData.value = data;
      toastSuccess({
        title: "\u062A\u0645 \u062A\u062D\u0645\u064A\u0644 \u0627\u0644\u0645\u0639\u0644\u0645\u064A\u0646 \u0628\u0646\u062C\u0627\u062D"
      });
      tableKey.value = Math.random();
    } catch (err) {
      toastError({
        title: "\u0647\u0646\u0627\u0643 \u0645\u0634\u0643\u0644\u0629 \u0641\u064A \u062A\u062D\u0645\u064A\u0644 \u0627\u0644\u0645\u0639\u0644\u0645\u064A\u0646",
        description: "\u062A\u062D\u0642\u0642 \u0645\u0646 \u0627\u0644\u0627\u062A\u0635\u0627\u0644 \u0628\u0627\u0644\u0646\u062A\u0631\u0646\u062A"
      });
      throw new Error("\u062E\u0637\u0623 \u0641\u064A \u062A\u062D\u0645\u064A\u0644 \u0627\u0644\u0645\u0639\u0644\u0645\u064A\u0646");
    } finally {
      loading.value = false;
    }
  };
  const addTeacher = async (teacher) => {
    try {
      loading.value = true;
      const { data } = await api.post("/teachers", teacher);
      toastSuccess({
        title: `:\u062A\u0645 \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u0645\u0639\u0644\u0645 ${data[0].full_name} \u0628\u0646\u062C\u0627\u062D`
      });
      teachersData.value.unshift({ ...teacher });
    } catch (err) {
      toastError({
        title: "\u062D\u062F\u062B \u0645\u0634\u0643\u0644\u0629 \u0641\u064A \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u0645\u0639\u0644\u0645",
        description: "\u062A\u062D\u0642\u0642 \u0645\u0646 \u0627\u0644\u0627\u062A\u0635\u0627\u0644 \u0628\u0627\u0644\u0646\u062A\u0631\u0646\u062A"
      });
      throw Error(err instanceof Error ? err.message : String(err));
    } finally {
      loading.value = false;
    }
  };
  const updateTeacher = async (teacherId, newTeacher) => {
    try {
      loading.value = true;
      const cleaned = removeInvalidFields(newTeacher);
      const { data } = await api.put(`teachers/${teacherId}`, cleaned);
      toastSuccess({
        title: `:\u062A\u0645 \u062A\u062D\u062F\u064A\u062B \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0645\u0639\u0644\u0645 ${data[0].full_name} \u0628\u0646\u062C\u0627\u062D`
      });
      const teacherIndex = getSpesificTeacherIndex(teacherId);
      const targetedTeacher = getSpesificTeacher(teacherId);
      if (teachersData.value && teacherIndex !== -1 && !!targetedTeacher) {
        if (!targetedTeacher.teachers_behavioral_issues) {
          targetedTeacher.teachers_behavioral_issues = [];
        }
        const existingIssues = teachersData.value[teacherIndex].teachers_behavioral_issues;
        if (!!existingIssues) {
          teachersData.value[teacherIndex] = {
            ...data[0],
            teachers_behavioral_issues: existingIssues
          };
        }
      }
      teachersData.value[teacherIndex] = { ...targetedTeacher, ...newTeacher };
    } catch (err) {
      toastError({
        title: "\u062D\u062F\u062B \u0645\u0634\u0643\u0644\u0629 \u0641\u064A \u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u0645\u0639\u0644\u0645",
        description: "\u062A\u062D\u0642\u0642 \u0645\u0646 \u0627\u0644\u0627\u062A\u0635\u0627\u0644 \u0628\u0627\u0644\u0646\u062A\u0631\u0646\u062A"
      });
      throw Error(err instanceof Error ? err.message : String(err));
    } finally {
      loading.value = false;
    }
  };
  const deleteTeacher = async (teacherId) => {
    try {
      loading.value = true;
      const { data } = await api.delete(`teachers/${teacherId}`);
      toastSuccess({
        title: `:\u062A\u0645 \u062D\u0630\u0641 \u0627\u0644\u0645\u0639\u0644\u0645 ( ${data[0].full_name} ) \u0628\u0646\u062C\u0627\u062D`
      });
      console.log(data);
      const teacherIndex = getSpesificTeacherIndex(teacherId);
      teachersData.value.splice(teacherIndex, 1);
    } catch (err) {
      toastError({
        description: "\u062A\u062D\u0642\u0642 \u0645\u0646 \u0627\u0644\u0627\u062A\u0635\u0627\u0644 \u0628\u0627\u0644\u0646\u062A\u0631\u0646\u062A",
        title: "\u062D\u062F\u062B \u0645\u0634\u0643\u0644\u0629 \u0641\u064A \u062D\u0630\u0641 \u0627\u0644\u0645\u0639\u0644\u0645"
      });
      throw Error("\u062D\u062F\u062B \u0645\u0634\u0643\u0644\u0629 \u0641\u064A \u062D\u0630\u0641 \u0627\u0644\u0645\u0639\u0644\u0645");
    } finally {
      loading.value = false;
    }
  };
  const getSpesificTeacher = (teacherId) => {
    return teachersData.value.find((teacher) => teacher.id === teacherId);
  };
  const getSpesificTeacherIndex = (teacherId) => {
    return teachersData.value.findIndex((teacher) => teacher.id === teacherId);
  };
  const fetchTeachersBehavioralIssues = async () => {
    loading.value = true;
    try {
      const { data } = await api.get("/teachers/behavioral-issues");
      console.log(data);
      behavioralIssuesTeachersData.value = data;
      toastSuccess({
        title: "\u062A\u0645 \u062A\u062D\u0645\u064A\u0644 \u0627\u0644\u0645\u062E\u0627\u0644\u0641\u0627\u062A \u0628\u0646\u062C\u0627\u062D"
      });
    } catch (err) {
      toastError({
        title: err.message,
        description: "\u062A\u062D\u0642\u0642 \u0645\u0646 \u0627\u0644\u0627\u062A\u0635\u0627\u0644 \u0628\u0627\u0644\u0646\u062A\u0631\u0646\u062A"
      });
      throw Error(err instanceof Error ? err.message : String(err));
    } finally {
      loading.value = false;
    }
  };
  const addTeacherBehavioralIssue = async (teacherId, description) => {
    const targetedTeacher = getSpesificTeacher(teacherId);
    if (!targetedTeacher) return;
    const newIssue = {
      teacher_id: targetedTeacher.id,
      teacher_name: targetedTeacher == null ? void 0 : targetedTeacher.full_name,
      description,
      date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
    };
    try {
      loading.value = true;
      const { data } = await api.post("/teachers/behavioral-issues", newIssue);
      console.log(data);
      toastSuccess({
        title: "\u062A\u0645 \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u0645\u062E\u0627\u0644\u0641\u0629 \u0627\u0644\u0633\u0644\u0648\u0643\u064A\u0629"
      });
      if (teachersData.value && !!targetedTeacher) {
        if (!targetedTeacher.teachers_behavioral_issues) {
          targetedTeacher.teachers_behavioral_issues = [];
        }
        targetedTeacher.teachers_behavioral_issues.push({
          id: data[0].id,
          // المخالفة التي أرجعها السيرفر
          ...newIssue
        });
      }
      behavioralIssuesTeachersData.value.unshift(data[0]);
    } catch (err) {
      toastError({
        title: "\u062D\u062F\u062B \u0645\u0634\u0643\u0644\u0629 \u0641\u064A \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u0645\u062E\u0627\u0644\u0641\u0629 \u0627\u0644\u0633\u0644\u0648\u0643\u064A\u0629",
        description: "\u062A\u062D\u0642\u0642 \u0645\u0646 \u0627\u0644\u0627\u062A\u0635\u0627\u0644 \u0628\u0627\u0644\u0646\u062A\u0631\u0646\u062A"
      });
    } finally {
      loading.value = false;
    }
  };
  const editTeacherBehavioralIssue = async (issueId, description) => {
    var _a2, _b;
    var _a;
    try {
      loading.value = true;
      const issueIndex = getSpesificTeacherBehavioralIssueIndex(issueId);
      const targetedIssue = getSpesificTeacherBehavioralIssue(issueId);
      const teacherIndex = getSpesificTeacherIndex(
        (_a2 = targetedIssue == null ? void 0 : targetedIssue.teacher_id) != null ? _a2 : ""
      );
      const targetedTeacher = getSpesificTeacher(
        (_b = targetedIssue == null ? void 0 : targetedIssue.teacher_id) != null ? _b : ""
      );
      const { data } = await api.put(`/teachers/behavioral-issues/${issueId}`, {
        // ...behavioralIssuesTeachersData.value[issueIndex],
        description
      });
      console.log(data);
      behavioralIssuesTeachersData.value[issueIndex] = {
        ...behavioralIssuesTeachersData.value[issueIndex],
        description
      };
      if (teachersData.value && teachersData.value[teacherIndex] && teachersData.value[teacherIndex].teachers_behavioral_issues) {
        const issueIndex2 = ((_a = targetedTeacher == null ? void 0 : targetedTeacher.teachers_behavioral_issues) == null ? void 0 : _a.findIndex(
          (issue) => issue.id === issueId
        )) || 0;
        teachersData.value[teacherIndex].teachers_behavioral_issues[issueIndex2].description = description;
      }
      tableKey.value = Math.random();
      toastSuccess({
        title: "\u062A\u0645 \u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u0645\u062E\u0627\u0644\u0641\u0629 \u0628\u0646\u062C\u0627\u062D"
      });
    } catch (err) {
      toastError({
        title: "\u062D\u062F\u062B\u062A \u0645\u0634\u0643\u0644\u0629 \u0623\u062B\u0646\u0627\u0621 \u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u0645\u062E\u0627\u0644\u0641\u0629",
        description: "\u062A\u062D\u0642\u0642 \u0645\u0646 \u0627\u0644\u0627\u062A\u0635\u0627\u0644 \u0628\u0627\u0644\u0646\u062A\u0631\u0646\u062A"
      });
      throw Error(err instanceof Error ? err.message : String(err));
    } finally {
      loading.value = false;
    }
  };
  const deleteTeacherBehavioralIssue = async (issueId) => {
    var _a2;
    var _a, _b;
    const targetedIssue = getSpesificTeacherBehavioralIssue(issueId);
    const issueIndex = getSpesificTeacherBehavioralIssueIndex(issueId);
    const targetedTeacher = getSpesificTeacher((_a2 = targetedIssue == null ? void 0 : targetedIssue.teacher_id) != null ? _a2 : "");
    try {
      loading.value = true;
      const { data } = await api.delete(
        `teachers/behavioral-issues/${issueId}`
      );
      toastSuccess({
        title: `:\u062A\u0645 \u062D\u0630\u0641 \u0627\u0644\u0645\u062E\u0627\u0644\u0641\u0629 \u0628\u0646\u062C\u0627\u062D`
      });
      console.log(data);
      behavioralIssuesTeachersData.value.splice(issueIndex, 1);
      if (!!targetedTeacher) {
        const targetedIssueIndex = (_a = targetedTeacher.teachers_behavioral_issues) == null ? void 0 : _a.findIndex(
          (issue) => issue.id === issueId
        );
        (_b = targetedTeacher.teachers_behavioral_issues) == null ? void 0 : _b.splice(
          targetedIssueIndex != null ? targetedIssueIndex : 0,
          1
        );
      }
    } catch (err) {
      toastError({
        title: "\u062D\u062F\u062B \u0645\u0634\u0643\u0644\u0629 \u0641\u064A \u062D\u0630\u0641 \u0627\u0644\u0645\u062E\u0627\u0644\u0641\u0629",
        description: "\u062A\u062D\u0642\u0642 \u0645\u0646 \u0627\u0644\u0627\u062A\u0635\u0627\u0644 \u0628\u0627\u0644\u0646\u062A\u0631\u0646\u062A"
      });
    } finally {
      loading.value = false;
    }
  };
  const getSpesificTeacherBehavioralIssue = (issueId) => {
    return behavioralIssuesTeachersData.value.find(
      (issue) => issue.id === issueId
    );
  };
  const getSpesificTeacherBehavioralIssueIndex = (issueId) => {
    return behavioralIssuesTeachersData.value.findIndex(
      (issue) => issue.id === issueId
    );
  };
  const fetchTeachersLoans = async () => {
    loading.value = true;
    try {
      const { data } = await api.get("/teachers/loans");
      console.log(data);
      teachersLoansData.value = data;
      toastSuccess({
        title: "\u062A\u0645 \u062A\u062D\u0645\u064A\u0644 \u0627\u0644\u0633\u0644\u0641 \u0628\u0646\u062C\u0627\u062D"
      });
    } catch (err) {
      toastError({
        title: "\u062D\u062F\u062B \u0645\u0634\u0643\u0644\u0629 \u0641\u064A \u062A\u062D\u0645\u064A\u0644 \u0627\u0644\u0633\u0644\u0641",
        description: "\u062A\u062D\u0642\u0642 \u0645\u0646 \u0627\u0644\u0627\u062A\u0635\u0627\u0644 \u0628\u0627\u0644\u0646\u062A\u0631\u0646\u062A"
      });
      throw Error(err instanceof Error ? err.message : String(err));
    } finally {
      loading.value = false;
    }
  };
  const addTeacherLoan = async (teacherId, amount) => {
    const targetedTeacher = getSpesificTeacher(teacherId);
    if (!targetedTeacher) return;
    const newLoan = {
      teacher_id: targetedTeacher.id,
      teacher_name: targetedTeacher == null ? void 0 : targetedTeacher.full_name,
      amount,
      date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
    };
    try {
      loading.value = true;
      const { data } = await api.post("/teachers/loans", newLoan);
      console.log(data);
      toastSuccess({
        title: "\u062A\u0645 \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u0633\u0644\u0641\u0629"
      });
      if (teachersData.value && !!targetedTeacher) {
        if (!targetedTeacher.teachers_loans) {
          targetedTeacher.teachers_loans = [];
        }
        targetedTeacher.teachers_loans.unshift({
          id: data[0].id,
          ...newLoan
        });
      }
      teachersLoansData.value.unshift(data[0]);
    } catch (err) {
      toastError({
        title: "\u062D\u062F\u062B \u0645\u0634\u0643\u0644\u0629 \u0641\u064A \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u0633\u0644\u0641\u0629",
        description: "\u062A\u062D\u0642\u0642 \u0645\u0646 \u0627\u0644\u0627\u062A\u0635\u0627\u0644 \u0628\u0627\u0644\u0646\u062A\u0631\u0646\u062A"
      });
    } finally {
      loading.value = false;
    }
  };
  const editTeacherLoan = async (loanId, amount) => {
    var _a2;
    var _a;
    try {
      loading.value = true;
      const loanIndex = getSpesificTeacherLoanIndex(loanId);
      const targetedLoan = getSpesificTeacherLoan(loanId);
      const teacherIndex = getSpesificTeacherIndex(
        (_a2 = targetedLoan == null ? void 0 : targetedLoan.teacher_id) != null ? _a2 : ""
      );
      const targetedTeacher = getSpesificTeacher(
        (targetedLoan == null ? void 0 : targetedLoan.teacher_id) || ""
      );
      const { data } = await api.put(`/teachers/loans/${loanId}`, {
        // ...behavioralIssuesTeachersData.value[loanIndex],
        amount
      });
      console.log(data);
      teachersLoansData.value[loanIndex] = {
        // ...data[0],
        ...teachersLoansData.value[loanIndex],
        amount
      };
      if (teachersData.value && teachersData.value[teacherIndex] && teachersData.value[teacherIndex].teachers_loans) {
        const loanIndex2 = ((_a = targetedTeacher == null ? void 0 : targetedTeacher.teachers_loans) == null ? void 0 : _a.findIndex(
          (loan) => loan.id === loanId
        )) || 0;
        teachersData.value[teacherIndex].teachers_loans[loanIndex2].amount = amount;
      }
      tableKey.value = Math.random();
      toastSuccess({
        title: "\u062A\u0645 \u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u0633\u0644\u0641\u0629 \u0628\u0646\u062C\u0627\u062D"
      });
    } catch (err) {
      toastError({
        title: "\u062D\u062F\u062B\u062A \u0645\u0634\u0643\u0644\u0629 \u0623\u062B\u0646\u0627\u0621 \u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u0633\u0644\u0641\u0629",
        description: "\u062A\u062D\u0642\u0642 \u0645\u0646 \u0627\u0644\u0627\u062A\u0635\u0627\u0644 \u0628\u0627\u0644\u0646\u062A\u0631\u0646\u062A"
      });
      throw Error(err instanceof Error ? err.message : String(err));
    } finally {
      loading.value = false;
    }
  };
  const deleteTeacherLoan = async (loanId) => {
    var _a2;
    var _a, _b;
    const targetedLoan = getSpesificTeacherLoan(loanId);
    const loanIndex = getSpesificTeacherLoanIndex(loanId);
    const targetedTeacher = getSpesificTeacher((_a2 = targetedLoan == null ? void 0 : targetedLoan.teacher_id) != null ? _a2 : "");
    try {
      loading.value = true;
      const { data } = await api.delete(`teachers/loans/${loanId}`);
      toastSuccess({
        title: `:\u062A\u0645 \u062D\u0630\u0641 \u0627\u0644\u0633\u0644\u0641\u0629 \u0628\u0646\u062C\u0627\u062D`
      });
      console.log(data);
      teachersLoansData.value.splice(loanIndex, 1);
      if (!!targetedTeacher) {
        const targetedLoanIndex = (_a = targetedTeacher.teachers_loans) == null ? void 0 : _a.findIndex(
          (loan) => loan.id === loanId
        );
        (_b = targetedTeacher.teachers_loans) == null ? void 0 : _b.splice(targetedLoanIndex != null ? targetedLoanIndex : 0, 1);
      }
    } catch (err) {
      toastError({
        title: "\u062D\u062F\u062B \u0645\u0634\u0643\u0644\u0629 \u0641\u064A \u062D\u0630\u0641 \u0627\u0644\u0633\u0644\u0641\u0629",
        description: "\u062A\u062D\u0642\u0642 \u0645\u0646 \u0627\u0644\u0627\u062A\u0635\u0627\u0644 \u0628\u0627\u0644\u0646\u062A\u0631\u0646\u062A"
      });
    } finally {
      loading.value = false;
    }
  };
  const getSpesificTeacherLoan = (loanId) => {
    return teachersLoansData.value.find((loan) => loan.id === loanId);
  };
  const getSpesificTeacherLoanIndex = (loanId) => {
    return teachersLoansData.value.findIndex((loan) => loan.id === loanId);
  };
  const fetchAbsenceReports = async () => {
    loading.value = true;
    try {
      const { data } = await api.get("/teachers/absence");
      console.log(data);
      teachersAbsenceReportsData.value = data;
      toastSuccess({
        title: "\u062A\u0645 \u062A\u062D\u0645\u064A\u0644 \u062A\u0642\u0627\u0631\u064A\u0631 \u0627\u0644\u063A\u064A\u0627\u0628 \u0628\u0646\u062C\u0627\u062D"
      });
    } catch (err) {
      toastError({
        title: "\u062D\u062F\u062B \u0645\u0634\u0643\u0644\u0629 \u0641\u064A \u062A\u062D\u0645\u064A\u0644 \u062A\u0642\u0627\u0631\u064A\u0631 \u0627\u0644\u063A\u064A\u0627\u0628",
        description: err.message
      });
    } finally {
      loading.value = false;
    }
  };
  const addTeacherAbsenceReport = async (teacherId, report) => {
    const targetedTeacher = getSpesificTeacher(teacherId);
    if (!targetedTeacher) return;
    const newReport = {
      teacher_id: targetedTeacher.id,
      teacher_name: targetedTeacher == null ? void 0 : targetedTeacher.full_name,
      reason: report.reason,
      excuse_status: report.excuse_status,
      date: report.date
    };
    try {
      loading.value = true;
      const { data } = await api.post("/teachers/absence", newReport);
      console.log(data);
      toastSuccess({
        title: "\u062A\u0645 \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u062A\u0642\u0631\u064A\u0631"
      });
      if (teachersData.value && !!targetedTeacher) {
        if (!targetedTeacher.teachers_absence) {
          targetedTeacher.teachers_absence = [];
        }
        targetedTeacher.teachers_absence.unshift({
          id: data[0].id,
          ...newReport
        });
      }
      teachersAbsenceReportsData.value.unshift(data[0]);
    } catch (err) {
      toastError({
        title: "\u062D\u062F\u062B \u0645\u0634\u0643\u0644\u0629 \u0641\u064A \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u062A\u0642\u0631\u064A\u0631",
        description: err.message
      });
    } finally {
      loading.value = false;
    }
  };
  const deleteTeacherAbsenceReport = async (reportId) => {
    var _a2;
    var _a, _b;
    const targetedreport = getSpesificTeacherAbsenceReport(reportId);
    const reportIndex = getSpesificTeacherAbsenceReportIndex(reportId);
    const targetedTeacher = getSpesificTeacher(
      (_a2 = targetedreport == null ? void 0 : targetedreport.teacher_id) != null ? _a2 : ""
    );
    try {
      loading.value = true;
      const { data } = await api.delete(`teachers/absence/${reportId}`);
      toastSuccess({
        title: `:\u062A\u0645 \u062D\u0630\u0641 \u0627\u0644\u062A\u0642\u0631\u064A\u0631 \u0628\u0646\u062C\u0627\u062D`
      });
      console.log(data);
      teachersAbsenceReportsData.value.splice(reportIndex, 1);
      if (!!targetedTeacher) {
        const targetedReportIndex = (_a = targetedTeacher.teachers_absence) == null ? void 0 : _a.findIndex(
          (loan) => loan.id === reportId
        );
        (_b = targetedTeacher.teachers_loans) == null ? void 0 : _b.splice(targetedReportIndex != null ? targetedReportIndex : 0, 1);
      }
    } catch (err) {
      toastError({
        title: "\u062D\u062F\u062B \u0645\u0634\u0643\u0644\u0629 \u0641\u064A \u062D\u0630\u0641 \u0627\u0644\u062A\u0642\u0631\u064A\u0631",
        description: err.message
      });
    } finally {
      loading.value = false;
    }
  };
  const editTeacherAbsenceReport = async (reportId, newReport) => {
    var _a2;
    var _a;
    try {
      loading.value = true;
      const targetedreport = getSpesificTeacherAbsenceReport(reportId);
      const reportIndex = getSpesificTeacherAbsenceReportIndex(reportId);
      const teacherIndex = getSpesificTeacherIndex(
        (_a2 = targetedreport == null ? void 0 : targetedreport.teacher_id) != null ? _a2 : ""
      );
      const targetedTeacher = getSpesificTeacher(
        (targetedreport == null ? void 0 : targetedreport.teacher_id) || ""
      );
      const { data } = await api.put(`/teachers/absence/${reportId}`, {
        // ...behavioralIssuesTeachersData.value[loanIndex],
        ...targetedreport,
        ...newReport
      });
      console.log(data);
      teachersAbsenceReportsData.value[reportIndex] = {
        // ...data[0],
        ...teachersAbsenceReportsData.value[reportIndex],
        ...newReport
      };
      if (teachersData.value && teachersData.value[teacherIndex] && teachersData.value[teacherIndex].teachers_absence) {
        const reportIndex2 = ((_a = targetedTeacher == null ? void 0 : targetedTeacher.teachers_absence) == null ? void 0 : _a.findIndex(
          (report) => report.id === reportId
        )) || 0;
        teachersData.value[teacherIndex].teachers_absence[reportIndex2] = data[0];
      }
      tableKey.value = Math.random();
      toastSuccess({
        title: "\u062A\u0645 \u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u062A\u0642\u0631\u064A\u0631 \u0628\u0646\u062C\u0627\u062D"
      });
    } catch (err) {
      toastError({
        title: "\u062D\u062F\u062B\u062A \u0645\u0634\u0643\u0644\u0629 \u0623\u062B\u0646\u0627\u0621 \u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u062A\u0642\u0631\u064A\u0631",
        description: err.message
      });
    } finally {
      loading.value = false;
    }
  };
  const getSpesificTeacherAbsenceReport = (reportId) => {
    return teachersAbsenceReportsData.value.find(
      (report) => report.id == reportId
    );
  };
  const getSpesificTeacherAbsenceReportIndex = (reportId) => {
    return teachersAbsenceReportsData.value.findIndex((r) => r.id === reportId);
  };
  function removeInvalidFields(student) {
    const allowedFields = [
      "id",
      "full_name",
      "identity_number",
      "phone_number",
      "birth_date",
      "subject",
      "created_at"
    ];
    return Object.fromEntries(
      Object.entries(student).filter(([key]) => allowedFields.includes(key))
    );
  }
  const totalTeacherAbsence = computed(() => (teacherId) => {
    return teachersUpsentReportsData.value.filter(
      (report) => report.teacher_id === teacherId
    ).length;
  });
  const totalTeacherLoans = computed(() => (teacherId) => {
    return teachersLoansData.value.reduce((total, loan) => {
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
    sortedAbsenceReports
  };
});

export { useTeachersStore as u };
//# sourceMappingURL=teachers-Cx5Wl_TR.mjs.map
