import { ref } from 'vue';

const memorization_status_options = [
  "\u062D\u0627\u0641\u0638 \u0642\u0648\u064A",
  "\u062D\u0627\u0641\u0638 \u0636\u0639\u064A\u0641",
  "\u063A\u064A\u0631 \u062D\u0627\u0641\u0638"
];
const quran_classes_options = [
  "\u062A\u062B\u0628\u064A\u062A",
  "\u0627\u0644\u0623\u0648\u0644",
  "\u0627\u0644\u062B\u0627\u0646\u064A",
  "\u0627\u0644\u062B\u0627\u0644\u062B",
  "\u0627\u0644\u0631\u0627\u0628\u0639",
  "\u0627\u0644\u062E\u0627\u0645\u0633",
  "\u0627\u0644\u0633\u0627\u062F\u0633",
  "\u0627\u0644\u0633\u0627\u0628\u0639",
  "\u0627\u0644\u062B\u0627\u0645\u0646",
  "\u0627\u0644\u062A\u0627\u0633\u0639"
];
const level_options = [
  "\u0627\u0644\u0623\u0648\u0644",
  "\u0627\u0644\u062B\u0627\u0646\u064A",
  "\u0627\u0644\u062B\u0627\u0644\u062B",
  "\u0627\u0644\u0631\u0627\u0628\u0639",
  "\u0627\u0644\u062E\u0627\u0645\u0633",
  "\u0627\u0644\u0633\u0627\u062F\u0633",
  "\u0627\u0644\u0633\u0627\u0628\u0639",
  "\u0627\u0644\u062B\u0627\u0645\u0646",
  "\u0627\u0644\u062A\u0627\u0633\u0639"
];
const class_group_options = ["1", "2", "3", "4", "5"];
const class_wing_options = [
  "\u0627\u0644\u062C\u0646\u0648\u0628\u064A\u0629",
  "\u0627\u0644\u0634\u0645\u0627\u0644\u064A\u0629",
  "\u0627\u0644\u063A\u0631\u0628\u064A\u0629",
  "\u0627\u0644\u0634\u0631\u0642\u064A\u0629"
];
const class_floor_options = ["\u0627\u0644\u0623\u0631\u0636\u064A", "\u0627\u0644\u0623\u0648\u0644", "\u0627\u0644\u062B\u0627\u0646\u064A", "\u0627\u0644\u062B\u0627\u0644\u062B"];
const courses_options = [
  "\u0627\u0644\u0644\u063A\u0629 \u0627\u0644\u0639\u0631\u0628\u064A\u0629",
  "\u0627\u0644\u0644\u063A\u0629 \u0627\u0644\u0625\u0646\u062C\u0644\u064A\u0632\u064A\u0629",
  "\u0627\u0644\u0639\u0644\u0648\u0645",
  "\u0627\u0644\u0631\u064A\u0627\u0636\u064A\u0627\u062A",
  "\u0627\u0644\u0642\u0631\u0622\u0646",
  "\u0627\u0644\u062A\u0631\u0628\u064A\u0629 \u0627\u0644\u0625\u0633\u0644\u0627\u0645\u064A\u0629"
];
const grades_level_options = [
  "\u0634\u0647\u0631\u064A",
  "\u0646\u0635\u0641 \u0627\u0644\u0641\u0635\u0644 \u0627\u0644\u0623\u0648\u0644",
  "\u0646\u0647\u0627\u064A\u0629 \u0627\u0644\u0641\u0635\u0644 \u0627\u0644\u0623\u0648\u0644",
  "\u0646\u0635\u0641 \u0627\u0644\u0641\u0635\u0644 \u0627\u0644\u062B\u0627\u0646\u064A",
  "\u0646\u0647\u0627\u064A\u0629 \u0627\u0644\u0641\u0635\u0644 \u0627\u0644\u062B\u0627\u0646\u064A"
];
const payment_type_options = ["\u0635\u0627\u062F\u0631", "\u0648\u0627\u0631\u062F"];
ref(["light", "dark"]);
const months = [
  "\u064A\u0646\u0627\u064A\u0631",
  "\u0641\u0628\u0631\u0627\u064A\u0631",
  "\u0645\u0627\u0631\u0633",
  "\u0623\u0628\u0631\u064A\u0644",
  "\u0645\u0627\u064A\u0648",
  "\u064A\u0648\u0646\u064A\u0648",
  "\u064A\u0648\u0644\u064A\u0648",
  "\u0623\u063A\u0633\u0637\u0633",
  "\u0633\u0628\u062A\u0645\u0628\u0631",
  "\u0623\u0643\u062A\u0648\u0628\u0631",
  "\u0646\u0648\u0641\u0645\u0628\u0631",
  "\u062F\u064A\u0633\u0645\u0628\u0631"
];
const students = [
  {
    // id: 1,
    full_name: "\u0623\u062D\u0645\u062F \u062A\u0648\u0641\u064A\u0642",
    identity_number: "183729789",
    father_identity_number: "183729789",
    phone_number: "0597687656",
    birth_date: "2010-04-10",
    level: "\u0627\u0644\u0635\u0641 \u0627\u0644\u0633\u0627\u0628\u0639",
    memorization_status: "\u062D\u0627\u0641\u0638 \u0642\u0648\u064A",
    memorized_juz: "30",
    daily_recitation: "\u062C\u0632\u0621",
    // academic_level: "جيد جدا",
    class_group: "2",
    address: "\u0634\u0627\u0631\u0639 \u0627\u0644\u0646\u0635\u0631\u060C \u063A\u0632\u0629",
    masjed: "\u0645\u0633\u062C\u062F \u0627\u0644\u0646\u0648\u0631"
  },
  //  4117800 زاهر النعسان ١٢٦
  {
    // id: 2,
    full_name: "\u0645\u062D\u0645\u062F \u0645\u062D\u0633\u0646",
    identity_number: "183729788",
    father_identity_number: "183733789",
    phone_number: "0591234567",
    birth_date: "2009-12-05",
    level: "\u0627\u0644\u0635\u0641 \u0627\u0644\u0633\u0627\u0628\u0639",
    memorization_status: "\u063A\u064A\u0631 \u062D\u0627\u0641\u0638",
    memorized_juz: "2",
    daily_recitation: "\u0635\u0641\u062D\u0629",
    // academic_level: "ممتاز",
    class_group: "2",
    address: "\u062D\u064A \u0627\u0644\u0634\u062C\u0627\u0639\u064A\u0629\u060C \u063A\u0632\u0629",
    masjed: "\u0645\u0633\u062C\u062F \u0627\u0644\u062E\u0644\u0641\u0627\u0621 \u0627\u0644\u0631\u0627\u0634\u062F\u064A\u0646"
  },
  {
    // id: 3,
    full_name: "\u0633\u0639\u064A\u062F \u0639\u0645\u0631",
    identity_number: "184556789",
    father_identity_number: "184556123",
    phone_number: "0599988776",
    birth_date: "2011-06-17",
    level: "\u0627\u0644\u0635\u0641 \u0627\u0644\u0633\u0627\u062F\u0633",
    memorization_status: "\u063A\u064A\u0631 \u062D\u0627\u0641\u0638",
    memorized_juz: "15",
    daily_recitation: "\u0631\u0628\u0639",
    // academic_level: "جيد",
    class_group: "1",
    address: "\u0634\u0627\u0631\u0639 \u0627\u0644\u0648\u062D\u062F\u0629\u060C \u063A\u0632\u0629",
    masjed: "\u0645\u0633\u062C\u062F \u0627\u0644\u0642\u0633\u0627\u0645"
  },
  {
    // id: 4,
    full_name: "\u062E\u0627\u0644\u062F \u0639\u0628\u062F \u0627\u0644\u0644\u0647",
    identity_number: "182334456",
    father_identity_number: "182334111",
    phone_number: "0593456789",
    birth_date: "2008-03-23",
    level: "\u0627\u0644\u0635\u0641 \u0627\u0644\u062B\u0627\u0645\u0646",
    memorization_status: "\u063A\u064A\u0631 \u062D\u0627\u0641\u0638",
    memorized_juz: "5",
    daily_recitation: "\u0635\u0641\u062D\u062A\u064A\u0646",
    // academic_level: "مقبول",
    class_group: "3",
    address: "\u062A\u0644 \u0627\u0644\u0647\u0648\u0627\u060C \u063A\u0632\u0629",
    masjed: "\u0645\u0633\u062C\u062F \u0627\u0644\u0633\u0644\u0627\u0645"
  },
  {
    // id: 5,
    full_name: "\u062D\u0633\u0646 \u0633\u0644\u064A\u0645\u0627\u0646",
    identity_number: "181234789",
    father_identity_number: "181230001",
    phone_number: "0595678123",
    birth_date: "2007-10-30",
    level: "\u0627\u0644\u0635\u0641 \u0627\u0644\u062A\u0627\u0633\u0639",
    memorization_status: "\u062D\u0627\u0641\u0638 \u0642\u0648\u064A",
    memorized_juz: "28",
    daily_recitation: "\u0646\u0635\u0641 \u062C\u0632\u0621",
    // academic_level: "ممتاز",
    class_group: "1",
    address: "\u062D\u064A \u0627\u0644\u0632\u064A\u062A\u0648\u0646\u060C \u063A\u0632\u0629",
    masjed: "\u0645\u0633\u062C\u062F \u0627\u0644\u0641\u0631\u0642\u0627\u0646"
  },
  {
    // id: 6,
    full_name: "\u0639\u0645\u0631\u0648 \u0627\u0644\u062D\u0633\u0646",
    identity_number: "183000123",
    father_identity_number: "183000001",
    phone_number: "0596789123",
    birth_date: "2010-01-15",
    level: "\u0627\u0644\u0635\u0641 \u0627\u0644\u0633\u0627\u0628\u0639",
    memorization_status: "\u063A\u064A\u0631 \u062D\u0627\u0641\u0638",
    memorized_juz: "12",
    daily_recitation: "\u0631\u0628\u0639",
    // academic_level: "جيد جدا",
    class_group: "2",
    address: "\u062F\u064A\u0631 \u0627\u0644\u0628\u0644\u062D\u060C \u0627\u0644\u0648\u0633\u0637\u0649",
    masjed: "\u0645\u0633\u062C\u062F \u0627\u0644\u0639\u0648\u062F\u0629"
  },
  {
    // id: 7,
    full_name: "\u0628\u0644\u0627\u0644 \u0646\u0627\u062F\u0631",
    identity_number: "185000123",
    father_identity_number: "185000111",
    phone_number: "0593487645",
    birth_date: "2009-07-19",
    level: "\u0627\u0644\u0635\u0641 \u0627\u0644\u062B\u0627\u0645\u0646",
    memorization_status: "\u063A\u064A\u0631 \u062D\u0627\u0641\u0638",
    memorized_juz: "3",
    daily_recitation: "\u0635\u0641\u062D\u0629",
    // academic_level: "مقبول",
    class_group: "3",
    address: "\u0627\u0644\u0646\u0635\u064A\u0631\u0627\u062A\u060C \u0627\u0644\u0648\u0633\u0637\u0649",
    masjed: "\u0645\u0633\u062C\u062F \u0627\u0644\u0641\u0627\u0631\u0648\u0642"
  },
  {
    // id: 8,
    full_name: "\u0645\u062D\u0645\u0648\u062F \u0641\u0627\u0631\u0633",
    identity_number: "186789321",
    father_identity_number: "186789111",
    phone_number: "0594567890",
    birth_date: "2011-11-11",
    level: "\u0627\u0644\u0635\u0641 \u0627\u0644\u0633\u0627\u062F\u0633",
    memorization_status: "\u063A\u064A\u0631 \u062D\u0627\u0641\u0638",
    memorized_juz: "18",
    daily_recitation: "\u0646\u0635\u0641 \u062C\u0632\u0621",
    // academic_level: "جيد",
    class_group: "1",
    address: "\u062E\u0627\u0646 \u064A\u0648\u0646\u0633 \u0627\u0644\u063A\u0631\u0628\u064A\u0629",
    masjed: "\u0645\u0633\u062C\u062F \u0623\u0628\u0648 \u0628\u0643\u0631 \u0627\u0644\u0635\u062F\u064A\u0642"
  },
  {
    // id: 9,
    full_name: "\u0632\u064A\u0627\u062F \u0633\u0645\u064A\u0631",
    identity_number: "180123987",
    father_identity_number: "180123456",
    phone_number: "0598765432",
    birth_date: "2008-09-20",
    level: "\u0627\u0644\u0635\u0641 \u0627\u0644\u062A\u0627\u0633\u0639",
    memorization_status: "\u062D\u0627\u0641\u0638 \u0642\u0648\u064A",
    memorized_juz: "29",
    daily_recitation: "\u062C\u0632\u0621",
    // academic_level: "ممتاز",
    class_group: "1",
    address: "\u0631\u0641\u062D \u0627\u0644\u0634\u0631\u0642\u064A\u0629",
    masjed: "\u0645\u0633\u062C\u062F \u0627\u0644\u0646\u0635\u0631"
  },
  {
    // id: 10,
    full_name: "\u064A\u062D\u064A\u0649 \u0625\u0633\u0645\u0627\u0639\u064A\u0644",
    identity_number: "189999000",
    father_identity_number: "189111000",
    phone_number: "0593219876",
    birth_date: "2007-05-07",
    level: "\u0627\u0644\u0635\u0641 \u0627\u0644\u062A\u0627\u0633\u0639",
    memorization_status: "\u063A\u064A\u0631 \u062D\u0627\u0641\u0638",
    memorized_juz: "6",
    daily_recitation: "\u0635\u0641\u062D\u062A\u064A\u0646",
    // academic_level: "مقبول",
    class_group: "3",
    address: "\u062C\u0628\u0627\u0644\u064A\u0627 \u0627\u0644\u0628\u0644\u062F",
    masjed: "\u0645\u0633\u062C\u062F \u0639\u0628\u0627\u062F \u0627\u0644\u0631\u062D\u0645\u0646"
  },
  {
    // id: 11,
    full_name: "\u0623\u0646\u0633 \u0645\u0635\u0637\u0641\u0649",
    identity_number: "182121212",
    father_identity_number: "182121000",
    phone_number: "0592345678",
    birth_date: "2009-02-22",
    level: "\u0627\u0644\u0635\u0641 \u0627\u0644\u062B\u0627\u0645\u0646",
    memorization_status: "\u063A\u064A\u0631 \u062D\u0627\u0641\u0638",
    memorized_juz: "14",
    daily_recitation: "\u0646\u0635\u0641 \u062C\u0632\u0621",
    // academic_level: "جيد جدا",
    class_group: "2",
    address: "\u0628\u064A\u062A \u0644\u0627\u0647\u064A\u0627",
    masjed: "\u0645\u0633\u062C\u062F \u0628\u062F\u0631"
  },
  {
    // id: 12,
    full_name: "\u0631\u0627\u0645\u064A \u062D\u0627\u062A\u0645",
    identity_number: "188888888",
    father_identity_number: "188880000",
    phone_number: "0592223333",
    birth_date: "2010-08-01",
    level: "\u0627\u0644\u0635\u0641 \u0627\u0644\u0633\u0627\u0628\u0639",
    memorization_status: "\u063A\u064A\u0631 \u062D\u0627\u0641\u0638",
    memorized_juz: "20",
    daily_recitation: "\u0631\u0628\u0639",
    // academic_level: "جيد",
    class_group: "2",
    address: "\u0627\u0644\u0634\u064A\u062E \u0631\u0636\u0648\u0627\u0646\u060C \u063A\u0632\u0629",
    masjed: "\u0645\u0633\u062C\u062F \u0627\u0644\u0634\u0627\u0641\u0639\u064A"
  }
];
[
  {
    // id: 1,
    manager_id: null,
    full_name: "\u062D\u0633\u064A\u0646 \u0631\u0627\u0644\u064A",
    identity_number: "183729789",
    phone_number: "0937687656",
    birth_date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    subject: "\u0627\u0644\u062A\u0631\u0628\u064A\u0629 \u0627\u0644\u0625\u0633\u0644\u0627\u0645\u064A\u0629"
    // upsent_reports_count: 0,
    // behavioral_issues_count: 0,
    // loans_count: 0,
    // loans_amount: 0,
  },
  {
    // id: 2,
    manager_id: null,
    full_name: "\u0647\u0627\u0634\u0645 \u0623\u064A\u0648\u0628",
    identity_number: "183729789",
    phone_number: "0937687656",
    birth_date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    subject: "\u0627\u0644\u0639\u0644\u0648\u0645"
    // upsent_reports_count: 0,
    // behavioral_issues_count: 0,
    // loans_count: 0,
    // loans_amount: 0,
  },
  {
    // id: 3,
    manager_id: null,
    full_name: "\u062D\u0645\u0632\u0629 \u0635\u0644\u0627\u062D",
    identity_number: "183729789",
    phone_number: "0937687656",
    birth_date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    subject: "\u0627\u0644\u0639\u0644\u0648\u0645"
    // upsent_reports_count: 0,
    // behavioral_issues_count: 0,
    // loans_count: 0,
    // loans_amount: 0,
  },
  {
    // id: 4,
    manager_id: null,
    full_name: "\u0631\u0632\u0642 \u0627\u0644\u0634\u0627\u0641\u0639\u064A",
    identity_number: "183729789",
    phone_number: "0937687656",
    birth_date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    subject: "\u0627\u0644\u0644\u063A\u0629 \u0627\u0644\u0625\u0646\u062C\u0644\u064A\u0632\u064A\u0629"
    // upsent_reports_count: 0,
    // behavioral_issues_count: 0,
    // loans_count: 0,
    // loans_amount: 0,
  },
  {
    // id: 5,
    manager_id: null,
    full_name: "\u064A\u0648\u0633\u0641 \u0627\u0644\u0628\u0644\u0639\u0627\u0648\u064A",
    identity_number: "183729789",
    phone_number: "0937687656",
    birth_date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    subject: "\u0627\u0644\u0644\u063A\u0629 \u0627\u0644\u0639\u0631\u0628\u064A\u0629"
    // upsent_reports_count: 0,
    // behavioral_issues_count: 0,
    // loans_count: 0,
    // loans_amount: 0,
  }
];
[
  {
    id: Math.random(),
    type: "\u0645\u0635\u0631\u0648\u0641",
    description: "\u062A\u0643\u0631\u064A\u0645 \u0627\u0644\u0637\u0644\u0627\u0628 \u0641\u064A \u0627\u0644\u0645\u0633\u0627\u0628\u0642\u0629",
    date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    amount: 500
  },
  {
    id: Math.random(),
    type: "\u0645\u0635\u0631\u0648\u0641",
    description: "\u062A\u0643\u0627\u0644\u064A\u0641 \u0623\u062F\u0648\u0627\u062A \u0627\u0644\u062A\u0646\u0637\u064A\u0641",
    date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    amount: 200
  },
  {
    id: Math.random(),
    type: "\u062F\u062E\u0644",
    description: "\u062F\u0639\u0645 \u0645\u0646 \u0645\u0624\u0633\u0633\u0629",
    date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    amount: 1e3
  }
];
const gradesReports = [];

export { memorization_status_options as a, grades_level_options as b, courses_options as c, class_group_options as d, class_floor_options as e, class_wing_options as f, gradesReports as g, level_options as l, months as m, payment_type_options as p, quran_classes_options as q, students as s };
//# sourceMappingURL=constants-CI-Eb238.mjs.map
