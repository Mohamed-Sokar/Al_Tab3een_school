interface Student {
  id: number | undefined;
  full_name: string | undefined;
  identity_number: string | undefined;
  father_identity_number: string | undefined;
  phone_number: string | undefined;
  birth_date: string | undefined;
  address: string | undefined;
  masjed: string | undefined;
  level: string | undefined;
  section: string | undefined;
  memorized_juz: string | undefined;
  memorization_status: "غير حافظ" | "حافظ قوي" | "حافظ ضعيف" | undefined;
  daily_recitation: string | undefined;
  academic_level: string | undefined;
  behavioral_issues_count: number | undefined;
}

interface Teacher {
  id: number | undefined;
  full_name: string | undefined;
  identity_number: string | undefined;
  phone_number: string | undefined;
  birth_date: string | undefined;
  courses: string[] | undefined;
  upsent_reports_count: number | undefined;
  behavioral_issues_count: number | undefined;
  loans_count: number | undefined;
  loans_amount: number | undefined;
}

interface Payment {
  id: number | undefined;
  type: string | undefined;
  description: string | undefined;
  date: string | undefined;
  amount: number | undefined;
}

interface BehavioralIssue {
  id: number | undefined;
  student_name: string | undefined;
  student_id: number | undefined;
  level: string | undefined;
  section: string | undefined;
  date: string | undefined | Date;
  description: string | undefined;
}

interface BehavioralIssueTeacher {
  id: number | undefined;
  teacher_name: string | undefined;
  teacher_id: number | undefined;
  date: string | undefined | Date;
  description: string | undefined;
}

interface TeacherLoan {
  id: number | undefined;
  teacher_name: string | undefined;
  teacher_id: number | undefined;
  date: string | undefined | Date;
  amount: number;
}

interface TeacherUpsentReport {
  id: number | undefined;
  teacher_id: number | undefined;
  teacher_name: string | undefined;
  date: string | undefined;
  // reason: string | undefined;
}

interface GradesReport {
  id: number | undefined;
  student_name: string | undefined;
  level: string | undefined;
  section: string | undefined;
  arabic: number | undefined;
  math: number | undefined;
  science: number | undefined;
  quran: number | undefined;
  english: number | undefined;
  relegion: number | undefined;
  maxmumGrade: number | undefined;
  minmumGrade: number | undefined;
  average: number | string | undefined;
  type: string | undefined;
}

interface Level {
  id: number | undefined;
  title: string | undefined;
  studentsCount: number | undefined;
  fees: number | undefined;
  maximumCapacity: number | undefined;
}

export type {
  Student,
  BehavioralIssue,
  BehavioralIssueTeacher,
  GradesReport,
  Payment,
  Teacher,
  TeacherLoan,
  TeacherUpsentReport,
  Level,
};
