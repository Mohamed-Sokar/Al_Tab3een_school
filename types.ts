import { useQuranAcheivementReport } from "./stores/quran_acheivement_report";
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
  level?: { title: string };
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

interface StudentFilters {
  academicClassFilter?: number | undefined;
  quranClassFilter?: number | undefined;
  planFilter?: number | undefined;
  levelFilter?: number | undefined;
  identityNumberFilter?: string | undefined; // Changed to string to handle Arabic/English numbers
  memorizationStatusFilter?: string | undefined;
  firstNameFilter?: string | undefined;
  secondNameFilter?: string | undefined;
  thirdNameFilter?: string | undefined;
  lastNameFilter?: string | undefined;
}

interface StudentQuranAcheivementReportFilters {
  academicClassFilter?: number | undefined;
  monthlyPlanFilter?: number | undefined;
}

type StudentModalFlag =
  | "academic_class"
  | "quran_class"
  | "studentIssue"
  | "move_quran_class"
  | "move_academic_class"
  | "driver_info"
  | "plan"
  | "assign_plan"
  | "assign_driver";

interface SelectOption {
  label: string;
  value: number | string | undefined; // دعم string لـ month و status
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
  plan: Plan;
}
interface QuranAchievementReport {
  id?: number | undefined;
  student_id?: string | undefined;
  month: string | undefined;
  achieved_pages: number | undefined;
  monthly_plan_id: number | undefined;
  status?: "مكتمل" | "غير مكتمل" | undefined;
  student?: Student;
  monthly_plan?: MonthlyPlan;
  created_at?: Date;
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
interface Semester {
  id?: number | undefined;
  name: string | undefined;
  year: string | undefined;
}
interface ExamType {
  id?: number | undefined;
  name: string | undefined;
}
interface Subject {
  id?: number | undefined;
  name: string | undefined;
}

interface GradesReport {
  id?: number | undefined;
  student_id: string | undefined;
  semester_id: number | undefined;
  academic_class_id: number | undefined;
  subject_exam_id: number | undefined;
  subject_id: number | undefined;
  score: number | undefined;
}

interface AvgScoreResult {
  academic_class_id: number | undefined;
  academic_class_group: string | undefined;
  academic_class_title: string | undefined;
  exam_type_name: string | undefined;
  average_score: number | undefined;
  exam_type_id: number | undefined;
  min_score: number | undefined;
  max_score: number | undefined;
  subject_id: number | undefined;
  subject_name: string | undefined;
  subject_exam_id: number | undefined;
  grades_count: number | undefined;
}

interface Grade {
  id?: number | undefined;
  student_id?: string | undefined;
  student?: Student;
  score: number | null;
  // first_name?: string | undefined;
  // second_name?: string | undefined;
  // third_name?: string | undefined;
  // last_name?: string | undefined;
  // identity_number?: string | undefined;
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
  StudentFilters,
  StudentQuranAcheivementReportFilters,
  StudentModalFlag,
  Class,
  Driver,
  QuranAchievementReport,
  Plan,
  MonthlyPlan,
  SelectOption,
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
  // Grades Reports
  Semester,
  ExamType,
  AvgScoreResult,
  Subject,
  Grade,
};
