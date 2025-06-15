import {
  behavioralIssuesTeacher,
  teachers,
  teachersLoans,
  teachersUpsentReports,
} from "~/constants";

export const useTeachers = () => {
  const teachersData = ref(teachers);
  const behavioralIssuesTeacherData = ref(behavioralIssuesTeacher);
  // const teachersLoansData = ref(teachersLoans);
  // const teacherUpsentReportsData = ref(teachersUpsentReports);

  // Teacher CRUD operations
  const getAllTeachers = () => {
    return teachersData.value;
  };
  const addTeacher = (teacher) => {
    teachersData.value.unshift({ ...teacher });
  };
  const editTeacher = (id, newTeacher) => {
    const teacherIndex = teachers.findIndex(
      (teacher) => teacher.id === id.toString()
    );

    teachers[teacherIndex] = newTeacher;
  };
  const deleteTeacher = (id) => {
    const teacherIndex = teachersData.value.findIndex(
      (teacher) => teacher.id === id
    );

    teachersData.value.splice(teacherIndex, 1);
  };

  // behavioral_issues CRUD operations
  const getAllBehavioralIssuesReports = () => {
    return behavioralIssuesTeacherData.value;
  };
  const addTeacherBehavioralIssue = () => {
    behavioralIssuesTeacherData.value.unshift({
      id: Math.random(),
      teacher_name: targetedTeacher?.full_name,
      teacher_id: targetedTeacher?.id,
      date: new Date().toISOString().split("T")[0],
      description: state.description,
    });
  };
  const editTeacherBehavioralIssue = (id, newIssue) => {
    const issueIndex = behavioralIssuesTeacherData.value.findIndex(
      (issue) => issue.id === id
    );

    behavioralIssuesTeacherData.value[issueIndex] = {
      ...behavioralIssuesTeacher[issueIndex],
      ...newIssue,
    };
  };
  const deleteTeacherBehavioralIssue = (id) => {
    const issueIndex = behavioralIssuesTeacherData.value.findIndex(
      (issue) => issue.id === id
    );

    behavioralIssuesTeacherData.value.splice(issueIndex, 1);
  };

  return {
    // teachers CRUD
    getAllTeachers,
    addTeacher,
    editTeacher,
    deleteTeacher,
    // behavioral_issues CRUD
    getAllBehavioralIssuesReports,
    addTeacherBehavioralIssue,
    editTeacherBehavioralIssue,
    deleteTeacherBehavioralIssue,
  };
};
