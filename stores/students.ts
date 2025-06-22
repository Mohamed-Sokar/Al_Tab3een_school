import type { Student, BehavioralIssue } from "~/types";
import { students, behavioralIssues } from "~/constants";
// import { defineStore } from "pinia";

export const useStudentStore = defineStore("students", () => {
  const studentsData = ref<Student[]>(students);
  const behavioralIssuesStudentData = ref(behavioralIssues);

  // Students operations
  const addStudent = (student: Student) => {
    studentsData.value.unshift({ ...student });
  };
  const editStudent = (studentId: number, newstudent: Student) => {
    const studentIndex = getSpesificStudentIndex(studentId);
    studentsData.value[studentIndex] = newstudent;
  };
  const deleteStudent = (studentId: number) => {
    const studentIndex = getSpesificStudentIndex(studentId);

    studentsData.value.splice(studentIndex, 1);
  };
  const getSpesificStudent = (studentId: number) => {
    return studentsData.value.find((student) => student.id === studentId);
  };
  const getSpesificStudentIndex = (studentId: number) => {
    return studentsData.value.findIndex((student) => student.id === studentId);
  };

  // behavioral_issues operations
  const addStudentBehavioralIssue = (
    studentId: number,
    description: string
  ) => {
    const targetedStudent = getSpesificStudent(studentId);

    const newStudent = {
      ...targetedStudent,
      behavioral_issues_count:
        typeof targetedStudent?.behavioral_issues_count === "number"
          ? targetedStudent?.behavioral_issues_count + 1
          : 0,
    };

    editStudent(studentId, newStudent);

    const newIssueBuffer = {
      id: Math.random(),
      date: new Date().toISOString().split("T")[0],
      student_name: targetedStudent?.full_name,
      level: targetedStudent?.level,
      section: targetedStudent?.section,
      student_id: targetedStudent?.id,
      description: description,
    };

    behavioralIssuesStudentData.value.unshift(newIssueBuffer);
  };
  const editStudentBehavioralIssue = (issueId: number, description: string) => {
    const issueIndex = getSpesificStudentBehavioralIssueIndex(issueId);
    behavioralIssuesStudentData.value[issueIndex] = {
      ...behavioralIssuesStudentData.value[issueIndex],
      description: description,
    };
  };
  const deleteStudentBehavioralIssue = (issueId: number) => {
    // Update the Student's behavioral issues count
    const targetedIssue = getSpesificStudentBehavioralIssue(issueId);
    const targetedStudent = getSpesificStudent(targetedIssue?.student_id);

    if (targetedStudent) {
      editStudent(targetedStudent.id, {
        ...targetedStudent,
        behavioral_issues_count:
          typeof targetedStudent?.behavioral_issues_count === "number"
            ? targetedStudent?.behavioral_issues_count - 1
            : 0,
      });
    }
    // Remove the issue from the list
    const issueIndex = getSpesificStudentBehavioralIssueIndex(issueId);

    behavioralIssuesStudentData.value.splice(issueIndex, 1);
  };
  const getSpesificStudentBehavioralIssue = (issueId: number) => {
    return behavioralIssuesStudentData.value.find(
      (issue) => issue.id === issueId
    );
  };
  const getSpesificStudentBehavioralIssueIndex = (issueId: number) => {
    return behavioralIssuesStudentData.value.findIndex(
      (issue) => issue.id === issueId
    );
  };

  return {
    // state
    studentsData,
    behavioralIssuesStudentData,
    // student operations
    addStudent,
    editStudent,
    deleteStudent,
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
