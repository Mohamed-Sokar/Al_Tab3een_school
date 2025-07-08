interface Student {
  id?: string | undefined;
  full_name: string | undefined;
  driver_id?: number | undefined;

  identity_number: string | undefined;
  father_identity_number: string | undefined;
  phone_number: string | undefined;
  birth_date: string | undefined;
  address: string | undefined;
  masjed: string | undefined;
  level: string | undefined;
  class_group: string | undefined;
  memorized_juz: string | undefined;
  memorization_status: "غير حافظ" | "حافظ قوي" | "حافظ ضعيف" | undefined;
  daily_recitation: string | undefined;
  behavioral_issues_count?: number | undefined;
  academic_class?: Class | undefined;
  quran_class?: Class | undefined;
  driver?: Driver | undefined;
  behavioral_issues: Array<BehavioralIssue> | undefined;
  plan?: Plan | undefined;
  plan_id?: number | undefined;
  quran_achievement_reports?: StudentMonthlyAchievements[] | undefined;
}

interface StudentMonthlyAchievements {
  id?: number | undefined;
  student_id?: string | undefined;
  monthly_plan_id?: number | undefined;
  month: string | undefined;
  achieved_pages: number | undefined;
  status: "مكتمل" | "غير مكتمل" | undefined;
}

interface Teacher {
  id?: string | undefined;
  manager_id?: string | undefined | null;
  full_name: string | undefined;
  identity_number: string | undefined;
  phone_number: string | undefined;
  birth_date: string | undefined;
  subject: string | undefined;

  teachers_behavioral_issues?: Array<BehavioralIssueTeacher> | undefined;
  teachers_loans?: Array<TeacherLoan> | undefined;
  teachers_absence?: Array<TeacherAbsenceReport> | undefined;

  // behavioral_issues_count?: number | undefined;
  // loans_count?: number | undefined;
  // loans_amount?: number | undefined;
}

interface Payment {
  id?: number | undefined;
  type: string | undefined;
  description: string | undefined;
  date: Date | undefined;
  amount: number | undefined;
}

interface Class {
  id?: number | undefined;
  title: string | undefined;
  group: string | undefined;
  floor: string | undefined;
  wing: string | undefined;
  maximum_capacity: number | undefined;
  studentsCount?: number | undefined;
}

interface Driver {
  id?: number | undefined;
  name: string | undefined;
  phone_no: string | undefined;
  car_type: string | undefined;
  address: string | undefined;
  car_color: string | undefined;
  studentsCount?: number | undefined;
  maximum_capacity?: number | undefined;
}
interface Plan {
  id?: number | undefined;
  year: number | undefined;
  stage: string | undefined;
  total_pages: number | undefined;
  semester: string | undefined;
  months_plans?: Array<MonthlyPlan> | undefined;
  students_type?: string | undefined;
}
interface MonthlyPlan {
  id?: number | undefined;
  plan_id?: number | undefined;
  month: string | undefined;
  pages: number | undefined;
  status?: string | undefined;
}
interface AchievmentReport {
  id?: number | undefined;
  monthly_plan_id: number | undefined;
  student_id?: string | undefined;
  month: string | undefined;
  achieved_pages: number | undefined;
  status?: string | undefined;
}

interface BehavioralIssue {
  id?: number | undefined;
  student_name: string | undefined;
  student_id: string | undefined;
  level: string | undefined;
  class_group: string | undefined;
  date: string | undefined | Date;
  description: string | undefined;
}

interface BehavioralIssueTeacher {
  id: number | undefined;
  teacher_name: string | undefined;
  teacher_id: string | undefined;
  date: string | undefined | Date;
  description: string | undefined;
}

interface TeacherLoan {
  id: number | undefined;
  teacher_name: string | undefined;
  teacher_id: string | undefined;
  date: string | undefined | Date;
  amount: number;
}

interface TeacherAbsenceReport {
  id?: number | undefined;
  teacher_id?: string | undefined;
  teacher_name?: string | undefined;
  date: string | undefined;
  reason: string | undefined;
  excuse_status: string | undefined;
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
  id?: number | undefined;
  title: string | undefined;
  studentsCount?: number | undefined;
  fees: number | undefined;
  maximum_capacity: number | undefined;
}
interface LinkItem {
  label: string;
  icon: string;
  to: string;
}
export type {
  Student,
  Class,
  Driver,
  AchievmentReport,
  Plan,
  MonthlyPlan,
  BehavioralIssue,
  BehavioralIssueTeacher,
  GradesReport,
  Payment,
  Teacher,
  TeacherLoan,
  TeacherAbsenceReport,
  Level,
  LinkItem,
};
