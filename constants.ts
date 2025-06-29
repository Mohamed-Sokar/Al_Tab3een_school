import type {
  BehavioralIssue,
  BehavioralIssueTeacher,
  GradesReport,
  Level,
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

export const payment_type_options = ["صادر", "وارد"];

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
    // id: 1,
    full_name: "أحمد توفيق",
    identity_number: "183729789",
    father_identity_number: "183729789",
    phone_number: "0597687656",
    birth_date: "2010-04-10",
    level: "الصف السابع",
    memorization_status: "حافظ قوي",
    memorized_juz: "30",
    daily_recitation: "جزء",
    // academic_level: "جيد جدا",
    class_group: "2",
    address: "شارع النصر، غزة",
    masjed: "مسجد النور",
  },
  //  4117800 زاهر النعسان ١٢٦
  {
    // id: 2,
    full_name: "محمد محسن",
    identity_number: "183729788",
    father_identity_number: "183733789",
    phone_number: "0591234567",
    birth_date: "2009-12-05",
    level: "الصف السابع",
    memorization_status: "غير حافظ",
    memorized_juz: "2",
    daily_recitation: "صفحة",
    // academic_level: "ممتاز",
    class_group: "2",
    address: "حي الشجاعية، غزة",
    masjed: "مسجد الخلفاء الراشدين",
  },
  {
    // id: 3,
    full_name: "سعيد عمر",
    identity_number: "184556789",
    father_identity_number: "184556123",
    phone_number: "0599988776",
    birth_date: "2011-06-17",
    level: "الصف السادس",
    memorization_status: "غير حافظ",

    memorized_juz: "15",
    daily_recitation: "ربع",
    // academic_level: "جيد",
    class_group: "1",
    address: "شارع الوحدة، غزة",
    masjed: "مسجد القسام",
  },
  {
    // id: 4,
    full_name: "خالد عبد الله",
    identity_number: "182334456",
    father_identity_number: "182334111",
    phone_number: "0593456789",
    birth_date: "2008-03-23",
    level: "الصف الثامن",
    memorization_status: "غير حافظ",

    memorized_juz: "5",
    daily_recitation: "صفحتين",
    // academic_level: "مقبول",
    class_group: "3",
    address: "تل الهوا، غزة",
    masjed: "مسجد السلام",
  },
  {
    // id: 5,
    full_name: "حسن سليمان",
    identity_number: "181234789",
    father_identity_number: "181230001",
    phone_number: "0595678123",
    birth_date: "2007-10-30",
    level: "الصف التاسع",
    memorization_status: "حافظ قوي",
    memorized_juz: "28",
    daily_recitation: "نصف جزء",
    // academic_level: "ممتاز",
    class_group: "1",
    address: "حي الزيتون، غزة",
    masjed: "مسجد الفرقان",
  },
  {
    // id: 6,
    full_name: "عمرو الحسن",
    identity_number: "183000123",
    father_identity_number: "183000001",
    phone_number: "0596789123",
    birth_date: "2010-01-15",
    level: "الصف السابع",
    memorization_status: "غير حافظ",

    memorized_juz: "12",
    daily_recitation: "ربع",
    // academic_level: "جيد جدا",
    class_group: "2",
    address: "دير البلح، الوسطى",
    masjed: "مسجد العودة",
  },
  {
    // id: 7,
    full_name: "بلال نادر",
    identity_number: "185000123",
    father_identity_number: "185000111",
    phone_number: "0593487645",
    birth_date: "2009-07-19",
    level: "الصف الثامن",
    memorization_status: "غير حافظ",
    memorized_juz: "3",
    daily_recitation: "صفحة",
    // academic_level: "مقبول",
    class_group: "3",
    address: "النصيرات، الوسطى",
    masjed: "مسجد الفاروق",
  },
  {
    // id: 8,
    full_name: "محمود فارس",
    identity_number: "186789321",
    father_identity_number: "186789111",
    phone_number: "0594567890",
    birth_date: "2011-11-11",
    level: "الصف السادس",
    memorization_status: "غير حافظ",

    memorized_juz: "18",
    daily_recitation: "نصف جزء",
    // academic_level: "جيد",
    class_group: "1",
    address: "خان يونس الغربية",
    masjed: "مسجد أبو بكر الصديق",
  },
  {
    // id: 9,
    full_name: "زياد سمير",
    identity_number: "180123987",
    father_identity_number: "180123456",
    phone_number: "0598765432",
    birth_date: "2008-09-20",
    level: "الصف التاسع",
    memorization_status: "حافظ قوي",
    memorized_juz: "29",
    daily_recitation: "جزء",
    // academic_level: "ممتاز",
    class_group: "1",
    address: "رفح الشرقية",
    masjed: "مسجد النصر",
  },
  {
    // id: 10,
    full_name: "يحيى إسماعيل",
    identity_number: "189999000",
    father_identity_number: "189111000",
    phone_number: "0593219876",
    birth_date: "2007-05-07",
    level: "الصف التاسع",

    memorization_status: "غير حافظ",

    memorized_juz: "6",
    daily_recitation: "صفحتين",
    // academic_level: "مقبول",
    class_group: "3",
    address: "جباليا البلد",
    masjed: "مسجد عباد الرحمن",
  },
  {
    // id: 11,
    full_name: "أنس مصطفى",
    identity_number: "182121212",
    father_identity_number: "182121000",
    phone_number: "0592345678",
    birth_date: "2009-02-22",
    level: "الصف الثامن",

    memorization_status: "غير حافظ",

    memorized_juz: "14",
    daily_recitation: "نصف جزء",
    // academic_level: "جيد جدا",
    class_group: "2",
    address: "بيت لاهيا",
    masjed: "مسجد بدر",
  },
  {
    // id: 12,
    full_name: "رامي حاتم",
    identity_number: "188888888",
    father_identity_number: "188880000",
    phone_number: "0592223333",
    birth_date: "2010-08-01",
    level: "الصف السابع",

    memorization_status: "غير حافظ",

    memorized_juz: "20",
    daily_recitation: "ربع",
    // academic_level: "جيد",
    class_group: "2",
    address: "الشيخ رضوان، غزة",
    masjed: "مسجد الشافعي",
  },
];

export const teachers = [
  {
    // id: 1,
    manager_id: null,
    full_name: "حسين رالي",
    identity_number: "183729789",
    phone_number: "0937687656",
    birth_date: new Date().toISOString().split("T")[0],
    subject: "التربية الإسلامية",

    // upsent_reports_count: 0,
    // behavioral_issues_count: 0,
    // loans_count: 0,
    // loans_amount: 0,
  },
  {
    // id: 2,
    manager_id: null,
    full_name: "هاشم أيوب",
    identity_number: "183729789",
    phone_number: "0937687656",
    birth_date: new Date().toISOString().split("T")[0],
    subject: "العلوم",

    // upsent_reports_count: 0,
    // behavioral_issues_count: 0,
    // loans_count: 0,
    // loans_amount: 0,
  },
  {
    // id: 3,
    manager_id: null,
    full_name: "حمزة صلاح",
    identity_number: "183729789",
    phone_number: "0937687656",
    birth_date: new Date().toISOString().split("T")[0],
    subject: "العلوم",

    // upsent_reports_count: 0,
    // behavioral_issues_count: 0,
    // loans_count: 0,
    // loans_amount: 0,
  },
  {
    // id: 4,
    manager_id: null,
    full_name: "رزق الشافعي",
    identity_number: "183729789",
    phone_number: "0937687656",
    birth_date: new Date().toISOString().split("T")[0],
    subject: "اللغة الإنجليزية",

    // upsent_reports_count: 0,
    // behavioral_issues_count: 0,
    // loans_count: 0,
    // loans_amount: 0,
  },
  {
    // id: 5,
    manager_id: null,
    full_name: "يوسف البلعاوي",
    identity_number: "183729789",
    phone_number: "0937687656",
    birth_date: new Date().toISOString().split("T")[0],
    subject: "اللغة العربية",

    // upsent_reports_count: 0,
    // behavioral_issues_count: 0,
    // loans_count: 0,
    // loans_amount: 0,
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

export const levels: Level[] = [
  {
    id: 1,
    title: "الصف السادس",
    studentsCount: 80,
    maximumCapacity: 60,
    fees: 100,
  },
  {
    id: 2,
    title: "الصف السابع",
    studentsCount: 65,
    maximumCapacity: 70,
    fees: 100,
  },
  {
    id: 3,
    title: "الصف الثامن",
    studentsCount: 43,
    maximumCapacity: 60,
    fees: 100,
  },
  {
    id: 4,
    title: "الصف التاسع",
    studentsCount: 70,
    maximumCapacity: 77,
    fees: 100,
  },
];
