interface Student {
  id: number | undefined;
  full_name: string | undefined;
  identity_number: string | undefined;
  phone_number: string | undefined;
  birth_date: string | undefined;
  level: string | undefined;
  memorization_status: string | undefined;
  // memorization_status: "حافظ قوي" | "حافظ ضعيف" | "غير حافظ" | undefined;
  // payments_status: Record<string, "مدفوعة" | "غير مدفوعة"> | undefined;
  memorized_juz: string | undefined;
  daily_recitation: string | undefined;
  academic_level: string | undefined;
  behavioral_issues: string | undefined;
  section: string | undefined;
}

interface Teacher {
  id: number | undefined;
  full_name: string | undefined;
  identity_number: string | undefined;
  phone_number: string | undefined;
  birth_date: string | undefined;
  courses: string[] | undefined;
  ubsent_days_count: number | undefined;
  has_behavioral_issues: string | undefined;
  loans: number;
}

interface Payment {
  id: number | undefined;
  type: string | undefined;
  description: string | undefined;
  date: string | undefined;
  value: number | undefined;
}

interface BehavioralIssue {
  id: number | undefined;
  student_name: string | undefined;
  student_id: string | number | undefined;
  level: string | undefined;
  section: string | undefined;
  date: string | undefined | Date;
  description: string | undefined;
}

interface BehavioralIssueTeacher {
  id: number | undefined;
  teacher_name: string | undefined;
  teacher_id: string | number | undefined;
  date: string | undefined | Date;
  description: string | undefined;
}

interface TeacherLoan {
  id: number | undefined;
  teacher_name: string | undefined;
  teacher_id: string | number | undefined;
  date: string | undefined | Date;
  loanValue: number | undefined;
}

interface TeacherUpsentReport {
  id: number | undefined;
  teacher_id: number | undefined;
  teacher_name: string | undefined;
  date: string | undefined;
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

export type {
  Student,
  BehavioralIssue,
  BehavioralIssueTeacher,
  GradesReport,
  Payment,
  Teacher,
  TeacherLoan,
  TeacherUpsentReport,
};
