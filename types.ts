interface Student {
  id?: string | undefined;
  full_name?: string | undefined;
  first_name: string | undefined;
  second_name: string | undefined;
  third_name: string | undefined;
  last_name: string | undefined;
  guardian_name: string | undefined;
  guardian_name_kinship?: string | undefined; // صلة قرابة ولي الأمر
  driver_id?: number | undefined;

  created_at?: string | undefined | Date;
  identity_number: string | undefined;
  father_identity_number: string | undefined;
  phone_number: string | undefined;
  whatsapp_number: string | undefined;
  birth_date: Date | undefined;
  address: string | undefined;
  masjed: string | undefined;
  level_id: number | undefined;
  // class_group: string | undefined;
  memorized_juz: number | undefined;
  memorization_status: "غير حافظ" | "حافظ قوي" | "حافظ ضعيف" | undefined;
  daily_recitation: string | undefined;
  behavioral_issues_count?: number | undefined;
  academic_class?: Class | undefined;
  quran_class?: Class | undefined;
  driver?: Driver | undefined;
  behavioral_issues?: Array<BehavioralIssue> | undefined;
  plan?: Plan | undefined;
  plan_id?: number | undefined;
  academic_class_id?: number | undefined;
  quran_class_id?: number | undefined;
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

interface Employee {
  id?: string | undefined;
  manager_id?: string | undefined | null;
  // full_name?: string | undefined;
  first_name: string | undefined;
  second_name: string | undefined;
  third_name: string | undefined;
  last_name: string | undefined;
  identity_number: string | undefined;
  phone_number: string | undefined;
  address: string | undefined;
  masjed: string | undefined;
  job_title: string | undefined;
  whatsapp_number: string | undefined;
  enrollment_date: Date | undefined;
  children_count?: string | undefined;
  marital_status: "متزوج" | "أعزب" | "مطلق" | "أرمل" | undefined;
  birth_date: Date | undefined;
  subject: string[] | undefined;
  level_id: number | undefined;
  created_at?: string | undefined | Date;

  behavioral_issues?: Array<BehavioralIssueEmployee> | undefined;
  supervisory_visits?: Array<SupervisoryVisitTeacher> | undefined;
  loans?: Array<EmployeeLoan> | undefined;
  absence?: Array<EmployeeAbsenceReport> | undefined;
  academic_classes?: Array<Class> | undefined;

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
  invoice_number: string | undefined;
}

interface Class {
  id?: number | undefined;
  title?: string | undefined;
  group?: string | undefined;
  floor?: string | undefined;
  wing?: string | undefined;
  maximum_capacity?: number | undefined;
  students?: [{ count: number }];
  class?: { id?: number; title: string; group: string };
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
  rowNumber?: number | undefined; // For display purposes, not in the database
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
type StudentBehavioralIssue = {
  first_name: string | undefined;
  last_name: string | undefined;
  class: {
    title: string | undefined;
    group: string | undefined;
  };
};
interface BehavioralIssue {
  rowNumber?: number | undefined; // For display purposes, not in the database
  id?: number | undefined;
  created_at?: string | undefined | Date;
  student_id: string | undefined;
  student?: StudentBehavioralIssue | undefined;
  description: string | undefined;
}

interface BehavioralIssueEmployee {
  id: number | undefined;
  teacher_id: string | undefined;
  employee?: {
    first_name: string | undefined;
    last_name: string | undefined;
  };
  description: string | undefined;
  created_at?: string | undefined | Date;
}
interface SupervisoryVisitTeacher {
  id?: number | undefined;
  teacher_id?: string | undefined;
  teacher?: {
    first_name: string | undefined;
    last_name: string | undefined;
  };
  notes: string | undefined;
  supervisor: string | undefined;
  date: Date | undefined;
  type: string | undefined;
  created_at?: string | undefined | Date;
}

interface EmployeeLoan {
  id: number | undefined;
  teacher_id: string | undefined;
  employee: {
    first_name: string | undefined;
    last_name: string | undefined;
  };
  amount: number;
  created_at?: Date | undefined;
}

interface EmployeeAbsenceReport {
  id?: number | undefined;
  teacher_id?: string | undefined;
  employee?: {
    first_name: string | undefined;
    last_name: string | undefined;
  };
  date?: Date | undefined;
  created_at?: Date | undefined;
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
  students: [{ count: number }];
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
  BehavioralIssueEmployee,
  SupervisoryVisitTeacher,
  GradesReport,
  Payment,
  Employee,
  EmployeeAbsenceReport,
  EmployeeLoan,
  Level,
  LinkItem,
};
