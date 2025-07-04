import { defineStore } from 'pinia';
import { u as useAppToast } from './useAppToast-BZDaw0os.mjs';
import { s as students } from './constants-CI-Eb238.mjs';
import { ref, computed } from 'vue';
import { a as api } from './api-Bx7QNuNm.mjs';

const useStudentStore = defineStore("students", () => {
  const { toastSuccess, toastError } = useAppToast();
  const studentsData = ref(students);
  const behavioralIssuesStudentData = ref();
  const loading = ref(false);
  const tableKey = ref(Math.random());
  const sortedStudents = computed(() => {
    var _a;
    return [...(_a = studentsData.value) != null ? _a : []].sort(
      (a, b) => {
        var _a2, _b;
        return ((_a2 = a.full_name) != null ? _a2 : "").localeCompare((_b = b.full_name) != null ? _b : "");
      }
    );
  });
  const sortedIssues = computed(() => {
    var _a;
    return [...(_a = behavioralIssuesStudentData.value) != null ? _a : []].sort(
      (a, b) => {
        var _a2, _b;
        return ((_a2 = a.student_name) != null ? _a2 : "").localeCompare((_b = b.student_name) != null ? _b : "");
      }
    );
  });
  const fetchStudents = async () => {
    loading.value = true;
    try {
      const { data } = await api.get("/students");
      console.log(data);
      studentsData.value = data;
      toastSuccess({
        title: "\u062A\u0645 \u062A\u062D\u0645\u064A\u0644 \u0627\u0644\u0637\u0644\u0627\u0628 \u0628\u0646\u062C\u0627\u062D"
      });
      tableKey.value = Math.random();
    } catch (err) {
      toastError({
        title: "\u0647\u0646\u0627\u0643 \u0645\u0634\u0643\u0644\u0629 \u0641\u064A \u062A\u062D\u0645\u064A\u0644 \u0627\u0644\u0637\u0644\u0627\u0628"
      });
      throw new Error();
    } finally {
      loading.value = false;
    }
  };
  const addStudent = async (student) => {
    loading.value = true;
    try {
      const { data } = await api.post("/students", student);
      toastSuccess({
        title: `:\u062A\u0645 \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u0637\u0627\u0644\u0628 ${data[0].full_name} \u0628\u0646\u062C\u0627\u062D`
      });
      (studentsData.value || []).unshift({ ...student });
    } catch (err) {
      toastError({
        title: "\u062D\u062F\u062B \u0645\u0634\u0643\u0644\u0629 \u0641\u064A \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u0637\u0627\u0644\u0628"
      });
      throw Error(err instanceof Error ? err.message : String(err));
    } finally {
      loading.value = false;
    }
  };
  const editStudent = async (studentId, newStudent) => {
    try {
      loading.value = true;
      const cleaned = removeInvalidFields(newStudent);
      const { data } = await api.put(`students/${studentId}`, cleaned);
      toastSuccess({
        title: `:\u062A\u0645 \u062A\u062D\u062F\u064A\u062B \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0637\u0627\u0644\u0628 ${data[0].full_name} \u0628\u0646\u062C\u0627\u062D`
      });
      const studentIndex = getSpesificStudentIndex(studentId);
      if (studentsData.value && studentIndex !== -1) {
        const existingIssues = studentsData.value[studentIndex].students_behavioral_issues;
        studentsData.value[studentIndex] = {
          ...data[0],
          students_behavioral_issues: existingIssues
        };
      }
    } catch (err) {
      toastError({
        title: "\u062D\u062F\u062B \u0645\u0634\u0643\u0644\u0629 \u0641\u064A \u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u0637\u0627\u0644\u0628"
      });
      throw Error(err instanceof Error ? err.message : String(err));
    } finally {
      loading.value = false;
    }
  };
  const deleteStudent = async (studentId) => {
    try {
      loading.value = true;
      const { data } = await api.delete(`students/${studentId}`);
      toastSuccess({
        title: `:\u062A\u0645 \u062D\u0630\u0641 \u0627\u0644\u0637\u0627\u0644\u0628 ( ${data[0].full_name} ) \u0628\u0646\u062C\u0627\u062D`
      });
      const studentIndex = getSpesificStudentIndex(studentId);
      (studentsData.value || []).splice(studentIndex, 1);
    } catch (err) {
      toastError({
        title: "\u062D\u062F\u062B \u0645\u0634\u0643\u0644\u0629 \u0641\u064A \u062D\u0630\u0641 \u0627\u0644\u0637\u0627\u0644\u0628"
      });
    } finally {
      loading.value = false;
    }
  };
  const deleteMultipleStudents = async (ids) => {
    try {
      loading.value = true;
      await api.delete("/students/delete-many", { data: { ids } });
      studentsData.value = studentsData.value.filter(
        (student) => !ids.includes(student.id || "")
      );
      toastSuccess({ title: "\u062A\u0645 \u062D\u0630\u0641 \u0627\u0644\u0637\u0644\u0627\u0628 \u0628\u0646\u062C\u0627\u062D" });
    } catch (error) {
      toastError({ title: "\u0641\u0634\u0644 \u0641\u064A \u062D\u0630\u0641 \u0627\u0644\u0637\u0644\u0627\u0628" });
    } finally {
      loading.value = false;
    }
  };
  const getSpesificStudent = (studentId) => {
    var _a;
    return (_a = studentsData.value) == null ? void 0 : _a.find((student) => student.id === studentId);
  };
  const getSpesificStudentIndex = (studentId) => {
    return studentsData.value.findIndex((student) => student.id === studentId);
  };
  const fetchBehavioralIssues = async () => {
    loading.value = true;
    try {
      const { data } = await api.get("/students/behavioral-issues");
      console.log(data);
      behavioralIssuesStudentData.value = data;
      toastSuccess({
        title: "\u062A\u0645 \u062A\u062D\u0645\u064A\u0644 \u0627\u0644\u0645\u062E\u0627\u0644\u0641\u0627\u062A \u0628\u0646\u062C\u0627\u062D"
      });
      tableKey.value = Math.random();
    } catch (err) {
      throw Error(err instanceof Error ? err.message : String(err));
    } finally {
      loading.value = false;
    }
  };
  const addStudentBehavioralIssue = async (studentId, description) => {
    const targetedStudent = getSpesificStudent(studentId);
    if (!targetedStudent) return;
    const newIssue = {
      student_id: targetedStudent.id,
      level: targetedStudent.level,
      class_group: targetedStudent.class_group,
      description,
      student_name: targetedStudent == null ? void 0 : targetedStudent.full_name,
      date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
    };
    try {
      loading.value = true;
      const { data } = await api.post("/students/behavioral-issues", newIssue);
      toastSuccess({
        title: "\u062A\u0645 \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u0645\u062E\u0627\u0644\u0641\u0629 \u0627\u0644\u0633\u0644\u0648\u0643\u064A\u0629"
      });
      if (studentsData.value && !!targetedStudent) {
        if (!targetedStudent.students_behavioral_issues) {
          targetedStudent.students_behavioral_issues = [];
        }
        targetedStudent.students_behavioral_issues.push({
          id: data[0].id,
          // المخالفة التي أرجعها السيرفر
          ...newIssue
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
        title: "\u062D\u062F\u062B \u0645\u0634\u0643\u0644\u0629 \u0641\u064A \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u0645\u062E\u0627\u0644\u0641\u0629 \u0627\u0644\u0633\u0644\u0648\u0643\u064A\u0629"
      });
    } finally {
      loading.value = false;
    }
  };
  const editStudentBehavioralIssue = async (issueId, description) => {
    var _a;
    try {
      loading.value = true;
      const issueIndex = getSpesificStudentBehavioralIssueIndex(issueId);
      const targetedIssue = getSpesificStudentBehavioralIssue(issueId);
      console.log(issueIndex);
      const { data } = await api.put(`/students/behavioral-issues/${issueId}`, {
        ...(behavioralIssuesStudentData.value || [])[issueIndex],
        description
      });
      (behavioralIssuesStudentData.value || [])[issueIndex] = {
        ...(behavioralIssuesStudentData.value || [])[issueIndex],
        description
      };
      const studentIndex = getSpesificStudentIndex(
        (_a = targetedIssue == null ? void 0 : targetedIssue.student_id) != null ? _a : ""
      );
      if (studentsData.value && studentsData.value[studentIndex] && studentsData.value[studentIndex].students_behavioral_issues) {
        studentsData.value[studentIndex].students_behavioral_issues[issueIndex].description = description;
      }
      tableKey.value = Math.random();
      toastSuccess({
        title: "\u062A\u0645 \u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u0645\u062E\u0627\u0644\u0641\u0629 \u0628\u0646\u062C\u0627\u062D"
      });
    } catch (err) {
      toastError({
        title: "\u062D\u062F\u062B\u062A \u0645\u0634\u0643\u0644\u0629 \u0623\u062B\u0646\u0627\u0621 \u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u0645\u062E\u0627\u0644\u0641\u0629"
      });
      throw Error(err instanceof Error ? err.message : String(err));
    } finally {
      loading.value = false;
    }
  };
  const deleteStudentBehavioralIssue = async (issueId) => {
    var _a, _b;
    const targetedIssue = getSpesificStudentBehavioralIssue(issueId);
    const issueIndex = getSpesificStudentBehavioralIssueIndex(issueId);
    const targetedStudent = getSpesificStudent((targetedIssue == null ? void 0 : targetedIssue.student_id) || "");
    try {
      loading.value = true;
      const { data } = await api.delete(
        `students/behavioral-issues/${issueId}`
      );
      toastSuccess({
        title: `:\u062A\u0645 \u062D\u0630\u0641 \u0627\u0644\u0645\u062E\u0627\u0644\u0641\u0629 \u0628\u0646\u062C\u0627\u062D`
      });
      (behavioralIssuesStudentData.value || []).splice(issueIndex, 1);
      if (targetedStudent) {
        const targetedIssueIndex = (_a = targetedStudent.students_behavioral_issues) == null ? void 0 : _a.findIndex(
          (issue) => issue.id === issueId
        );
        (_b = targetedStudent.students_behavioral_issues) == null ? void 0 : _b.splice(
          targetedIssueIndex != null ? targetedIssueIndex : 0,
          1
        );
      }
    } catch (err) {
      toastError({
        title: "\u062D\u062F\u062B \u0645\u0634\u0643\u0644\u0629 \u0641\u064A \u062D\u0630\u0641 \u0627\u0644\u0645\u062E\u0627\u0644\u0641\u0629"
      });
    } finally {
      loading.value = false;
    }
  };
  const getSpesificStudentBehavioralIssue = (issueId) => {
    return sortedIssues.value.find(
      (issue) => issue.id === issueId
    );
  };
  const getSpesificStudentBehavioralIssueIndex = (issueId) => {
    var _a;
    return ((_a = behavioralIssuesStudentData.value) != null ? _a : []).findIndex(
      (issue) => issue.id !== void 0 && +issue.id === +issueId
    );
  };
  function removeInvalidFields(student) {
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
      "created_at"
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
    getSpesificStudentBehavioralIssueIndex
  };
});

export { useStudentStore as u };
//# sourceMappingURL=students-C5l8o5u3.mjs.map
