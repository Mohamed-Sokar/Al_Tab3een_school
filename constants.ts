import type {
  BehavioralIssue,
  BehavioralIssueTeacher,
  GradesReport,
  Payment,
  Student,
  TeacherLoan,
  TeacherUpsentReport,
} from "./types";

export const memorization_status_options = [
  "حافظ قوي",
  "حافظ ضعيف",
  "غير حافظ",
];

export const academic_level_options = ["ممتاز", "جيد جدا", "جيد", "ضعيف"];

export const level_options = [
  "الصف الأول",
  "الصف الثاني",
  "الصف الثالث",
  "الصف الرابع",
  "الصف الخامس",
  "الصف السادس",
  "الصف السابع",
  "الصف الثامن",
  "الصف التاسع",
];

export const courses_options = [
  "اللغة العربية",
  "اللغة الإنجليزية",
  "العلوم",
  "الرياضيات",
  "القرآن",
  "التربية الإسلامية",
];

export const grades_level_options = [
  "شهري",
  "نصف الفصل الأول",
  "نهاية الفصل الأول",
  "نصف الفصل الثاني",
  "نهاية الفصل الثاني",
];

export const payment_type_options = ["دخل", "مصروف"];

export const modeOptions = ref(["light", "dark"]);

export const months = [
  "يناير",
  "فبراير",
  "مارس",
  "أبريل",
  "مايو",
  "يونيو",
  "يوليو",
  "أغسطس",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر",
];

export const students = [
  {
    id: Math.random(),
    full_name: "محمد سكر",
    identity_number: "183729789",
    phone_number: "0937687656",
    birth_date: new Date().toISOString().split("T")[0],
    level: "الصف التاسع",
    memorization_status: "حافظ قوي",
    // payments_status: "مدفوعة",
    memorized_juz: "30",
    daily_recitation: "جزء",
    academic_level: "جيد جدا",
    behavioral_issues: "لا يوجد",
    loans: 0,

    section: "2",
  },

  {
    id: Math.random(),
    full_name: "أحمد الخالدي",
    identity_number: "123456789",
    phone_number: "1234567891",
    birth_date: new Date().toISOString().split("T")[0],
    level: "الصف السادس",
    memorization_status: "حافظ ضعيف",
    payments_status: "مدفوعة",
    memorized_juz: "30",
    daily_recitation: "ربعين",
    academic_level: "ممتاز",
    behavioral_issues: "لا يوجد",
    loans: 0,

    section: "1",
  },
  {
    id: Math.random(),
    full_name: "أحمد سكر",
    identity_number: "123456789",
    phone_number: "1234567891",
    birth_date: new Date().toISOString().split("T")[0],
    level: "الصف الثامن",
    memorization_status: "حافظ قوي",
    payments_status: "مدفوعة",
    memorized_juz: "30",
    daily_recitation: "جزء",
    academic_level: "جيد",
    behavioral_issues: "لا يوجد",
    section: "3",
  },
  {
    id: Math.random(),
    full_name: "عمر خميس",
    identity_number: "123456789",
    phone_number: "1234567891",
    birth_date: new Date().toISOString().split("T")[0],
    level: "الصف الثامن",
    memorization_status: "حافظ قوي",
    payments_status: "مدفوعة",
    memorized_juz: "30",
    daily_recitation: "جزء",
    academic_level: "جيد",
    behavioral_issues: "لا يوجد",
    section: "3",
  },
  {
    id: Math.random(),
    full_name: "أحمد العوضي",
    identity_number: "123453789",
    phone_number: "1234567891",
    birth_date: new Date().toISOString().split("T")[0],
    level: "الصف التاسع",
    memorization_status: "غير حافظ",
    payments_status: "مدفوعة",
    memorized_juz: "30",
    daily_recitation: "جزء",
    academic_level: "ممتاز",
    behavioral_issues: "لا يوجد",
    section: "1",
  },
  {
    id: Math.random(),
    full_name: "إبراهيم الدالي",
    identity_number: "123456789",
    phone_number: "1234567891",
    birth_date: new Date().toISOString().split("T")[0],
    level: "الصف التاسع",
    memorization_status: "حافظ قوي",
    payments_status: "مدفوعة",
    memorized_juz: "30",
    daily_recitation: "جزء",
    academic_level: "ممتاز",
    behavioral_issues: "لا يوجد",
    section: "1",
  },
  {
    id: Math.random(),
    full_name: "عبد الله سعد",
    identity_number: "123456789",
    phone_number: "1234567891",
    birth_date: new Date().toISOString().split("T")[0],
    level: "الصف الثامن",
    memorization_status: "حافظ قوي",
    payments_status: "مدفوعة",
    memorized_juz: "30",
    daily_recitation: "جزء",
    academic_level: "ممتاز",
    behavioral_issues: "لا يوجد",
    section: "2",
  },
  {
    id: Math.random(),
    full_name: "شعبان دغمش",
    identity_number: "123456789",
    phone_number: "1234567891",
    birth_date: new Date().toISOString().split("T")[0],
    level: "الصف التاسع",
    memorization_status: "حافظ قوي",
    payments_status: "مدفوعة",
    memorized_juz: "30",
    daily_recitation: "جزء",
    academic_level: "ممتاز",
    behavioral_issues: "لا يوجد",
    section: "2",
  },
];

export const teachers = [
  {
    id: 1,
    full_name: "حسين رالي",
    identity_number: "183729789",
    phone_number: "0937687656",
    birth_date: new Date().toISOString().split("T")[0],
    courses: ["التربية الإسلامية", "القرآن"],
    upsent_reports_count: 0,
    behavioral_issues_count: 0,
    loans_count: 0,
    loans_amount: 0,
  },
  {
    id: 2,
    full_name: "هاشم أيوب",
    identity_number: "183729789",
    phone_number: "0937687656",
    birth_date: new Date().toISOString().split("T")[0],
    courses: ["العلوم"],
    upsent_reports_count: 0,
    behavioral_issues_count: 0,
    loans_count: 0,
    loans_amount: 0,
  },
  {
    id: 3,
    full_name: "حمزة صلاح",
    identity_number: "183729789",
    phone_number: "0937687656",
    birth_date: new Date().toISOString().split("T")[0],
    courses: ["العلوم", "القرآن"],
    upsent_reports_count: 0,
    behavioral_issues_count: 0,
    loans_count: 0,
    loans_amount: 0,
  },
  {
    id: 4,
    full_name: "رزق الشافعي",
    identity_number: "183729789",
    phone_number: "0937687656",
    birth_date: new Date().toISOString().split("T")[0],
    courses: ["اللغة الإنجليزية", "القرآن"],
    upsent_reports_count: 0,
    behavioral_issues_count: 0,
    loans_count: 0,
    loans_amount: 0,
  },
  {
    id: 5,
    full_name: "يوسف البلعاوي",
    identity_number: "183729789",
    phone_number: "0937687656",
    birth_date: new Date().toISOString().split("T")[0],
    courses: ["اللغة العربية", "القرآن"],
    upsent_reports_count: 0,
    behavioral_issues_count: 0,
    loans_count: 0,
    loans_amount: 0,
  },
];

export const teachersLoans: TeacherLoan[] = [];

export const teachersUpsentReports: TeacherUpsentReport[] = [];

export const payments: Payment[] = [
  {
    id: Math.random(),
    type: "مصروف",
    description: "تكريم الطلاب في المسابقة",
    date: new Date().toISOString().split("T")[0],
    amount: 500,
  },
  {
    id: Math.random(),
    type: "مصروف",
    description: "تكاليف أدوات التنطيف",
    date: new Date().toISOString().split("T")[0],
    amount: 200,
  },
  {
    id: Math.random(),
    type: "دخل",
    description: "دعم من مؤسسة",
    date: new Date().toISOString().split("T")[0],
    amount: 1000,
  },
];

export const behavioralIssues: BehavioralIssue[] = [
  // {
  //   id: 1,
  //   student_name: "كرم الغفري",
  //   level: "الثامن",
  //   date: new Date().toISOString().split("T")[0],
  //   section: "1",
  //   description: "قلة أدب مع مدرس",
  // },
  // {
  //   id: 2,
  //   student_name: "أحمد سعيد",
  //   level: "الثامن",
  //   date: new Date().toISOString().split("T")[0],
  //   section: "1",
  //   description: "قلة أدب مع مدرس",
  // },
  // {
  //   id: 3,
  //   student_name: "أحمد صالح",
  //   level: "التاسع",
  //   date: new Date().toISOString().split("T")[0],
  //   section: "2",
  //   description: "الاعتداء على طالب",
  // },
  // {
  //   id: 4,
  //   student_name: "محمود أحمد",
  //   level: "السابع",
  //   date: new Date().toISOString().split("T")[0],
  //   section: "2",
  //   description: "التأخر المتكرر",
  // },
  // {
  //   id: 5,
  //   student_name: "كرم الغفري",
  //   level: "الثامن",
  //   date: new Date().toISOString().split("T")[0],
  //   section: "1",
  //   description: "الاعتداء على طالب",
  // },
];

export const behavioralIssuesTeacher: BehavioralIssueTeacher[] = [];

export const gradesReports: GradesReport[] = [];
