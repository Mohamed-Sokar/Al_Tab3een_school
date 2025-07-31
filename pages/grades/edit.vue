<script setup lang="ts">
import type {
  Class,
  ExamType,
  Grade,
  GradesReport,
  Semester,
  Subject,
} from "~/types";
// seo
useHead({ title: "تعديل كشف درجات" });

// init
const route = useRoute();
const query = route.query;
const gradsReportsStore = useGradsStore();
const { toastError } = useAppToast();

// data
const isLoading = ref(false);
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
const checkScoreInputs = () => {
  let hasError = false;

  studentsWithGrades.value.forEach((_: any, index: number) => {
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
    const payload = studentsWithGrades.value.map((swg) => ({
      semester_id: state.semester_id,
      academic_class_id: state.academic_class_id,
      student_id: swg?.student?.id,
      subject_exam_id: state.subject_exam_id,
      subject_id: state.subject_id,
      score: Number(swg.score),
    })) as GradesReport[];
    // // save students exam results
    await gradsReportsStore.saveGrades(payload);
    await gradsReportsStore.get_avg_scores_filtered();
    navigateTo({ name: "grades" });
  } finally {
    isLoading.value = false;
    // studentsWithGrades.value = [];
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
onMounted(async () => {
  // to get min_score and max_score
  await getSubjectExams();
  // get students with their grades
  await getStudentsWithGrades();
});
</script>

<template>
  <UCard class="max-w-4xl mx-auto mt-15">
    <template #header>
      <div class="flex justify-start items-center gap-2">
        <h1>تعديل علامات الطلاب</h1>
        <UIcon
          name="i-heroicons-academic-cap"
          size="xl"
          class="text-secondary text-2xl"
        />
      </div>
    </template>
    <template #default>
      <!-- select buttons -->
      <div class="w-full grid grid-cols-1 lg:grid-cols-4 gap-2 mb-5">
        <UFormField
          label="السنة الدراسية"
          required
          name="semester_id"
          size="md"
        >
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

        <UFormField label="نوع الاختبار" name="exam_type_id" size="md" required>
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

        <UFormField
          label="الشعبة الدراسية"
          name="academic_class_id"
          size="md"
          required
        >
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

        <UFormField
          label="المادة الدراسية"
          name="subject_id"
          size="md"
          required
        >
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
      <div class="flex flex-wrap gap-2 mb-5" v-if="studentsWithGrades.length">
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
      <!-- students  -->
      <table class="w-full">
        <thead>
          <tr
            class="grid grid-cols-3 font-bold bg-secondary text-white place-items-center border-t border-b border-accented"
          >
            <th class="border-x border-accented p-2 w-full">هوية الطالب</th>
            <th class="border-x border-accented p-2 w-full">الاسم رباعي</th>
            <th class="border-x border-accented p-2 w-full">علامة الطالب</th>
          </tr>
        </thead>
        <tbody v-if="!isLoading">
          <tr
            v-if="studentsWithGrades.length"
            class="grid grid-cols-3 place-items-center"
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
                swg.student?.third_name +
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
    <template #footer v-if="studentsWithGrades.length">
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
</template>
