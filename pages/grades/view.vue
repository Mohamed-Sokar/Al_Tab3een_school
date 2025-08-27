<script setup lang="ts">
import type { Class, ExamType, Grade, Semester, Subject } from "~/types";

// seo
useHead({ title: "عرض كشف درجات" });

// init
const route = useRoute();
const query = route.query;
const gradsReportsStore = useGradsStore();
const { exportToExcel } = useExportToExcel();
const studentsStore = useStudentStore();

// data
const semester = gradsReportsStore.semestersData.find(
  (s: Semester) => Number(s.id) === Number(query.semester_id)
)?.name;
const year = gradsReportsStore.semestersData.find(
  (s: Semester) => Number(s.id) === Number(query.semester_id)
)?.year;
const examType = gradsReportsStore.examTypesData.find(
  (s: ExamType) => Number(s.id) === Number(query.exam_type_id)
);
const academicClass = useAcademicClassesStore().classesData.find(
  (s: Class) => Number(s.id) === Number(query.academic_class_id)
);
const subject = gradsReportsStore.subjectsData.find(
  (s: Class) => Number(s.id) === Number(query.subject_id)
);

// state
const isLoading = ref(false);
const studentsCount = ref(0);
const studentsWithGrades = ref<Grade[]>([]);
const scoreErrors = ref<string[]>([]);
const state = reactive({
  semester_id: Number(query.semester_id),
  exam_type_id: Number(query.exam_type_id),
  academic_class_id: Number(query.academic_class_id),
  subject_id: Number(query.subject_id),
  subject_exam_id: Number(query.subject_exam_id),
  min_score: Number(query.min_score),
  max_score: Number(query.max_score),
});

// actions
const getSubjectExams = async () => {
  const data = (await gradsReportsStore.getSubjectExamsByExamTypeId(
    state.exam_type_id ?? 0
  )) as any;
  state.min_score = data?.min_score;
  state.max_score = data?.max_score;
};
const validateScore = (index: number) => {
  const score = Number(studentsWithGrades.value[index].score);
  if (isNaN(score)) {
    scoreErrors.value[index] = "الدرجة غير صالحة";
  } else if (score < 5) {
    scoreErrors.value[index] = `الدرجة أقل من الحد الأدنى (${5})`;
  } else if (score > 10) {
    scoreErrors.value[index] = `الدرجة أكبر من الحد الأعلى (${10})`;
  } else {
    scoreErrors.value[index] = "";
  }
};
const getStudentsWithGrades = async () => {
  try {
    isLoading.value = true;
    scoreErrors.value = [];

    const data = await gradsReportsStore.getStudentsWithGrades(
      state.academic_class_id ?? 0,
      state.semester_id ?? 0,
      state.subject_id ?? 0,
      state.subject_exam_id ?? 0
    );
    console.log(data);
    // set grades array
    studentsWithGrades.value = data;

    scoreErrors.value = studentsWithGrades.value.map(() => "");
  } finally {
    isLoading.value = false;
  }
};
const exportReports = () => {
  exportToExcel({
    data: studentsWithGrades.value.map((r, i) => ({
      الرقم: i + 1,
      "السنة الدراسية": year,
      "الفصل الدراسي": semester,
      الاختبار: examType?.name,
      الشعبة: academicClass?.title + " - " + academicClass?.group,
      المبحث: subject?.name,
      "اسم الطالب":
        (r.student?.first_name ?? "") +
        (r.student?.second_name ?? "") +
        (r.student?.third_name ?? "") +
        (r.student?.last_name ?? ""),
      "رقم الهوية": r.student?.identity_number,
      "العلامة الصغرى": state.min_score,
      "العلامة الكبرى": state.max_score,
      "علامة الطالب": r.score,
    })),
    fileName: "درجات الطلاب",
    sheetName: "معدل درجات الطلاب",
  });
};
onMounted(async () => {
  // to get min_score and max_score
  await getSubjectExams();
  // get students with their grades
  await getStudentsWithGrades();
  // to get students count
  await studentsStore.getStudentsCount({
    academicClassFilter: academicClass?.id,
  });
});
const calculateStatus = (row: Grade) => {
  const percentage = ((row.score ?? 0) / state.max_score) * 100;
  console.log(percentage);
  return percentage >= 90 && percentage <= 100
    ? "ممتاز"
    : percentage >= 80 && percentage < 90
    ? "جيد جدا"
    : percentage >= 70 && percentage < 80
    ? "جيد"
    : percentage >= 60 && percentage < 70
    ? "مقبول"
    : percentage >= 50 && percentage < 60
    ? "ضعيف"
    : "راسب";
};
// Function to map status to badge color
const getBadgeColor = (status: string) => {
  switch (status) {
    case "ممتاز":
      return "success"; // Green
    case "جيد جدا":
      return "info"; // Blue
    case "جيد":
      return "warning"; // Orange
    case "مقبول":
      return "neutral"; // black
    case "ضعيف":
      return "error"; // black
    case "راسب":
      return "error"; // Red
    default:
      return "info"; // Fallback color
  }
};
</script>

<template>
  <UCard class="max-w-4xl mx-auto mt-15">
    <template #header>
      <div class="flex justify-between">
        <div class="flex justify-start items-center gap-2">
          <h1>عرض علامات الطلاب</h1>
          <UIcon
            name="i-heroicons-academic-cap"
            size="xl"
            class="text-secondary text-2xl"
          />
        </div>
        <div>
          <UButton
            icon="heroicons-arrow-left-16-solid"
            color="secondary"
            size="sm"
            class="w-10 flex justify-center items-center hover:cursor-pointer"
            @click="navigateTo({ name: 'grades' })"
          />
        </div>
      </div>
    </template>
    <template #default>
      <!-- select buttons -->
      <div class="w-full grid grid-cols-1 lg:grid-cols-4 gap-2 mb-5">
        <UFormField label="السنة الدراسية" name="semester_id" size="md">
          <USelect
            disabled
            class="w-full"
            v-model="state.semester_id"
            :items="
                     gradsReportsStore.semestersData.map((s:Semester) => ({
                     label: `${s.year} - ${s.name}`,
                     value: s.id,
                   }))
                 "
            placeholder="اختر السنة الدراسية"
          />
        </UFormField>

        <UFormField label="نوع الاختبار" name="exam_type_id" size="md">
          <USelect
            disabled
            class="w-full"
            v-model="state.exam_type_id"
            :items="[{ label: 'اختر نوع الاختبار', value: null }
                   ,...gradsReportsStore.examTypesData.map((s:ExamType) => ({
                     label: `${s.name}`,
                     value: s.id,
                   }))]
                 "
            placeholder="اختر نوع الاختبار"
          />
        </UFormField>

        <UFormField label="الشعبة الدراسية" name="academic_class_id" size="md">
          <USelect
            disabled
            class="w-full"
            v-model="state.academic_class_id"
            :items="[{ label: 'اختر الشعبة الدراسية', value: null }
                   ,...useAcademicClassesStore().classesData.map((s:Class) => ({
                     label: `${s.title} - ${s.group}`,
                     value: s.id,
                   }))]
                 "
            placeholder="اختر الشعبة الدراسية"
          />
        </UFormField>

        <UFormField label="المادة الدراسية" name="subject_id" size="md">
          <USelect
            disabled
            class="w-full"
            v-model="state.subject_id"
            :items="[{ label: 'اختر المادة الدراسية', value: null }
                   , ...gradsReportsStore.subjectsData.map((s:Subject) => ({
                     label: `${s.name}`,
                     value: s.id,
                   }))]
                 "
            placeholder="اختر المادة الدراسية"
          />
        </UFormField>
      </div>

      <!-- max & min score -->
      <div
        class="flex flex-wrap gap-2 mb-2 justify-between items-end"
        v-if="studentsWithGrades.length"
      >
        <div class="flex flex-wrap gap-2">
          <div
            color="secondary"
            size="lg"
            class="p-2 bg-error/15 rounded-md flex gap-3 items-center"
          >
            <span class="font-bold">العلامة الصغرى</span>
            <UBadge color="error" size="lg" class="font-bold">
              {{ state?.min_score }}
            </UBadge>
          </div>
          <div
            color="secondary"
            size="lg"
            class="p-2 bg-secondary/15 rounded-md flex gap-3 items-center"
          >
            <span class="font-bold">العلامة الكبرى</span>
            <UBadge color="secondary" size="lg" class="font-bold">
              {{ state?.max_score }}
            </UBadge>
          </div>
          <div
            color="secondary"
            size="lg"
            class="p-2 bg-secondary/15 rounded-md flex gap-3 items-center"
          >
            <span class="font-bold">عدد الدرجات</span>
            <UBadge color="secondary" size="lg" class="font-bold">
              {{ studentsWithGrades.length }}
            </UBadge>
            <span class="text-2xl text-muted">/</span>
            <span class="text-xl text-muted font-bold">
              {{ studentsStore.studentsCountData }}
            </span>
          </div>
        </div>

        <div>
          <UButton
            icon="heroicons-document-chart-bar-solid"
            variant="outline"
            color="primary"
            size="xs"
            class="p-2 font-bold text-green-700 hover:cursor-pointer"
            @click="exportReports"
          >
            <span>تصدير</span>
            <span>({{ studentsWithGrades.length }})</span>
            <span> Excel </span>
          </UButton>
        </div>
      </div>
      <!-- students  -->
      <table class="w-full">
        <thead>
          <tr
            class="grid grid-cols-4 font-bold bg-secondary text-white place-items-center border-t border-b border-accented"
          >
            <th class="border-x border-accented p-2 w-full">هوية الطالب</th>
            <th class="border-x border-accented p-2 w-full">اسم الطالب</th>
            <th class="border-x border-accented p-2 w-full">علامة الطالب</th>
            <th class="border-x border-accented p-2 w-full">الحالة</th>
          </tr>
        </thead>
        <tbody v-if="!isLoading">
          <tr
            v-if="studentsWithGrades.length"
            class="grid grid-cols-4 place-items-center"
            v-for="(swg, index) in studentsWithGrades"
            :key="swg.student?.id"
          >
            <td
              class="w-full h-full p-2 text-center border-x border-b border-accented flex justify-center items-center"
            >
              {{ swg.student?.identity_number }}
            </td>
            <td
              class="w-full h-full p-2 text-center border-x border-b border-accented flex justify-center items-center"
            >
              {{
                swg.student?.first_name +
                " " +
                swg.student?.second_name +
                " " +
                swg.student?.last_name
              }}
            </td>
            <td
              class="w-full h-full p-2 text-center border-x border-b border-accented flex flex-col justify-center items-center"
              v-if="
                studentsWithGrades.length > index && studentsWithGrades[index]
              "
            >
              <UInput
                disabled
                :color="scoreErrors[index] ? 'error' : 'secondary'"
                :highlight="scoreErrors[index] ? true : false"
                v-model="studentsWithGrades[index].score"
                @update:model-value="validateScore(index)"
                @input="() => validateScore(index)"
              />
              <p v-if="scoreErrors[index]" class="text-error text-xs mt-1">
                {{ scoreErrors[index] }}
              </p>
            </td>
            <td
              class="w-full h-full p-2 text-center border-x border-b border-accented flex flex-col justify-center items-center"
              v-if="
                studentsWithGrades.length > index && studentsWithGrades[index]
              "
            >
              <UBadge
                :color="
                  getBadgeColor(calculateStatus(studentsWithGrades[index]))
                "
                size="lg"
              >
                {{ calculateStatus(studentsWithGrades[index]) }}
              </UBadge>
            </td>
          </tr>
          <tr
            v-else
            class="flex justify-center p-2 border border-accented mt-2"
          >
            لا يوجد بيانات للعرض
          </tr>
        </tbody>
        <tbody v-else>
          <USkeleton class="h-8 w-full my-2" />
          <USkeleton class="h-8 w-full my-2" />
          <USkeleton class="h-8 w-full my-2" />
          <USkeleton class="h-8 w-full my-2" />
        </tbody>
      </table>
    </template>
  </UCard>
</template>
