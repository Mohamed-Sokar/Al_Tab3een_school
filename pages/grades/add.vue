<script setup lang="ts">
import { object, number } from "yup";
import type {
  Class,
  ExamType,
  Grade,
  GradesReport,
  Semester,
  Student,
  Subject,
} from "~/types";
// seo
useHead({ title: "إضافة كشف درجات" });

// init
const gradsReportsStore = useGradsStore();
const { toastError } = useAppToast();

// schema
const schema = object({
  semester_id: number().required("السنة الدراسية مطلوبة"),
  exam_type_id: number().required("نوع الاختبار مطلوب"),
  academic_class_id: number().required("اسم الشعبة مطلوبة"),
  subject_id: number().required("المادة الدراسية مطلوبة"),
});

// state
const state = reactive<{
  semester_id: number | undefined;
  exam_type_id: number | undefined;
  academic_class_id: number | undefined;
  subject_id: number | undefined;
  subject_exam_id: number | undefined;
  min_score: number | undefined;
  max_score: number | undefined;
  reportsCount: number | undefined;
}>({
  // semester_id: gradsReportsStore.semestersData[0]?.id,
  // exam_type_id: gradsReportsStore.examTypesData[2].id,
  // academic_class_id: useAcademicClassesStore().classesData[1].id,
  // subject_id: gradsReportsStore.subjectsData[2].id,
  semester_id: undefined,
  exam_type_id: undefined,
  academic_class_id: undefined,
  subject_id: undefined,
  subject_exam_id: undefined,
  min_score: undefined,
  max_score: undefined,
  reportsCount: undefined,
});
const isLoading = ref(false);
const students = ref<Student[]>([]);
const grades = ref<Grade[]>([]);
const scoreErrors = ref<string[]>([]);

// watch effect
watchEffect(() => {
  if (gradsReportsStore.semestersData.length > 0) {
    state.semester_id = Number(gradsReportsStore.semestersData[0].id);
  }
});

// actions
const getSubjectExams = async () => {
  const data = (await gradsReportsStore.getSubjectExamsByExamTypeId(
    state.exam_type_id ?? 0
  )) as any;
  state.min_score = data?.min_score;
  state.max_score = data?.max_score;
  state.subject_exam_id = data?.id;
};
const search = async () => {
  try {
    isLoading.value = true;
    // get subject_exams to set min_score and max_score and subject_exam_id
    await getSubjectExams();
    // check if exam results exist
    const { isExist } = await gradsReportsStore.checkExamResultsExisting(
      state.academic_class_id ?? 0,
      state.subject_exam_id ?? 0,
      state.semester_id ?? 0,
      state.subject_id ?? 0
    );
    if (isExist) {
      toastError({
        title: "خطأ في إدخال الدرجات",
        description:
          "تم ادخال علامات للمبحث الدراسي المحدد .. يمكنك تعديل البيانات من خانة التعديل الخاصة بالمبحث .. !",
      });
      students.value = [];
      return;
    }

    // get students
    await getStudents();

    // prepare grades array
    grades.value = students.value.map((student: Student) => ({
      student_id: student.id!, // ← تأكيد أنها ليست undefined
      score: null,
    }));
    // prepare scoreErrors array
    scoreErrors.value = students.value.map(() => "");
  } finally {
    isLoading.value = false;
  }
};
const getStudents = async () => {
  try {
    isLoading.value = true;

    // reset scoreErrors array
    scoreErrors.value = [];

    // get students by class id
    students.value =
      (await useAcademicClassesStore().getStudentByAcademicClassId(
        state?.academic_class_id ?? 0
      )) as Student[];
  } finally {
    isLoading.value = false;
  }
};
const validateScore = (index: number) => {
  const score = Number(grades.value[index].score);
  if (isNaN(score)) {
    scoreErrors.value[index] = "الدرجة غير صالحة";
  } else if (score < Number(state?.min_score)) {
    scoreErrors.value[index] = `الدرجة أقل من الحد الأدنى (${state.min_score})`;
  } else if (score > Number(state?.max_score)) {
    scoreErrors.value[
      index
    ] = `الدرجة أكبر من الحد الأعلى (${state.max_score})`;
  } else {
    scoreErrors.value[index] = "";
  }
};
const checkScoreInputs = () => {
  let hasError = false;

  grades.value.forEach((_: any, index: number) => {
    validateScore(index);
    if (scoreErrors.value[index]) {
      hasError = true;
    }
  });

  return { hasError };
};
const saveGrades = async () => {
  isLoading.value = true;
  try {
    const { hasError } = checkScoreInputs();
    if (hasError) {
      toastError({
        title: "يرجى تصحيح الأخطاء قبل الحفظ",
      });
      return;
    }

    // prepare payload
    const payload = grades.value.map((g) => ({
      semester_id: state.semester_id,
      academic_class_id: state.academic_class_id,
      student_id: g.student_id,
      subject_exam_id: state.subject_exam_id,
      subject_id: state.subject_id,
      score: g.score,
    })) as GradesReport[];

    // save students exam results
    await gradsReportsStore.saveGrades(payload);
    await gradsReportsStore.get_avg_scores_filtered();
    navigateTo({ name: "grades" });

    students.value = [];
  } finally {
    isLoading.value = false;
  }
};

const calculateStatus = (row: Grade) => {
  const percentage = ((row.score ?? 0) / (state?.max_score ?? 10)) * 100;
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
  <div class="max-w-4xl mx-auto mt-15">
    <UCard class="max-w-4xl mx-auto mt-15">
      <template #header>
        <div class="flex justify-between">
          <div class="flex justify-start items-center gap-2">
            <h1>إضافة علامات الطلاب</h1>
            <UIcon
              name="i-heroicons-academic-cap"
              size="xl"
              class="text-secondary text-2xl"
            />
          </div>
          <div>
            <UButton
              icon="i-heroicons-arrow-left"
              color="secondary"
              size="sm"
              class="w-10 flex justify-center items-center hover:cursor-pointer"
              @click="navigateTo({ name: 'grades' })"
            />
          </div>
        </div>
      </template>
      <template #default>
        <UForm
          :state="state"
          :schema="schema"
          @submit="search"
          class="flex gap-2 flex-col justify-between items-start lg:items-start mb-5"
        >
          <div class="w-full grid grid-cols-1 lg:grid-cols-4 gap-2 mb-5">
            <UFormField
              label="السنة الدراسية"
              required
              name="semester_id"
              size="md"
            >
              <USelect
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

            <UFormField
              label="نوع الاختبار"
              name="exam_type_id"
              size="md"
              required
            >
              <USelect
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

            <UFormField
              label="الشعبة الدراسية"
              name="academic_class_id"
              size="md"
              required
            >
              <USelect
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

            <UFormField
              label="المادة الدراسية"
              name="subject_id"
              size="md"
              required
            >
              <USelect
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

          <UButton
            icon="i-lucide-search"
            color="secondary"
            type="submit"
            label="بحث"
            class="hover:cursor-pointer rounded-sm"
            :loading="isLoading"
          />
        </UForm>
        <!-- max & min exam score -->
        <div class="flex flex-wrap gap-2 mb-5" v-if="students.length">
          <div
            color="secondary"
            size="lg"
            class="p-3 bg-error/15 rounded-md flex gap-3"
          >
            <span class="font-bold">العلامة الصغرى</span>
            <UBadge color="error" size="lg">
              {{ state?.min_score }}
            </UBadge>
          </div>
          <div
            color="secondary"
            size="lg"
            class="p-3 bg-secondary/15 rounded-md flex gap-3"
          >
            <span class="font-bold">العلامة الكبرى</span>
            <UBadge color="secondary" size="lg">
              {{ state?.max_score }}
            </UBadge>
          </div>
        </div>

        <table class="w-full">
          <thead>
            <tr
              class="grid grid-cols-4 font-bold bg-secondary text-white place-items-center border-t border-b border-accented"
            >
              <th class="border-x border-accented p-2 w-full">هوية الطالب</th>
              <th class="border-x border-accented p-2 w-full">اسم الطالب</th>
              <th class="border-x border-accented p-2 w-full">علامة الطالب</th>
              <th class="border-x border-accented p-2 w-full">علامة الطالب</th>
            </tr>
          </thead>
          <tbody v-if="!isLoading">
            <tr
              v-if="students.length"
              class="grid grid-cols-4 place-items-center"
              v-for="(student, index) in students"
              :key="student.id"
            >
              <td
                class="w-full h-full p-2 text-center border-x border-b border-accented flex justify-center items-center"
              >
                {{ student.identity_number ?? 1234 }}
              </td>
              <td
                class="w-full h-full p-2 text-center border-x border-b border-accented flex justify-center items-center"
              >
                {{
                  student.first_name +
                  " " +
                  student.second_name +
                  " " +
                  student.last_name
                }}
              </td>
              <td
                class="w-full h-full p-2 border-x border-b border-accented flex flex-col justify-center"
                v-if="grades.length > index && grades[index]"
              >
                <UInput
                  type="number"
                  :color="scoreErrors[index] ? 'error' : 'secondary'"
                  :highlight="scoreErrors[index] ? true : false"
                  v-model.number="grades[index].score"
                  @update:model-value="validateScore(index)"
                  @input="() => validateScore(index)"
                  :class="scoreErrors[index] ? 'border-error' : ''"
                />
                <p v-if="scoreErrors[index]" class="text-error text-xs mt-1">
                  {{ scoreErrors[index] }}
                </p>
              </td>
              <td
                class="w-full h-full p-2 text-center border-x border-b border-accented flex flex-col justify-center items-center"
                v-if="grades.length > index && grades[index]"
              >
                <UBadge
                  :color="getBadgeColor(calculateStatus(grades[index]))"
                  size="lg"
                >
                  {{ calculateStatus(grades[index]) }}
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
      <template #footer v-if="students.length">
        <div class="gap-2 flex">
          <UButton
            label="حفظ"
            color="secondary"
            class="w-20 flex justify-center"
            type="submit"
            :loading="isLoading"
            @click="saveGrades"
          />
          <UButton
            label="إلغاء"
            variant="soft"
            color="neutral"
            :loading="isLoading"
            :to="{ name: 'grades' }"
          />
        </div>
      </template>
    </UCard>
  </div>
</template>
