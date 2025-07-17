<template>
  <UCard class="max-w-3xl mx-auto mt-15">
    <UForm
      ref="form"
      :schema="schema"
      :state="state"
      class="grid grid-cols-2 gap-4"
      @submit="updateReport"
    >
      <UFormField label="النهاية القصوى" name="maxmumGrade">
        <UInput
          type="number"
          v-model.number="state.maxmumGrade"
          placeholder="النهاية القصوى"
          label="النهاية القصوى"
          class="w-full"
        />
      </UFormField>
      <UFormField label="النهاية الدنيا" name="minmumGrade">
        <UInput
          type="number"
          v-model.number="state.minmumGrade"
          placeholder="النهاية الدنيا"
          label="النهاية الدنيا"
          class="w-full"
        />
      </UFormField>
      <UFormField label="اللغة العربية" name="arabic">
        <UInput
          type="number"
          v-model.number="state.arabic"
          placeholder="اللغة العربية"
          label="اللغة العربية"
          class="w-full"
        />
      </UFormField>
      <UFormField label="اللغة الإنجليزية" name="english">
        <UInput
          type="number"
          v-model.number="state.english"
          placeholder="اللغة الإنجليزية"
          label="اللغة الإنجليزية"
          class="w-full"
        />
      </UFormField>
      <UFormField label="رياضيات" name="math">
        <UInput
          type="number"
          v-model.number="state.math"
          placeholder="رياضيات"
          label="رياضيات"
          class="w-full"
        />
      </UFormField>
      <UFormField label="علوم" name="science">
        <UInput
          type="number"
          v-model.number="state.science"
          placeholder="علوم"
          label="علوم"
          class="w-full"
        />
      </UFormField>
      <UFormField label="قرآن" name="quran">
        <UInput
          type="number"
          v-model.number="state.quran"
          placeholder="قرآن"
          label="قرآن"
          class="w-full"
        />
      </UFormField>

      <UFormField label="نوع الكشف" name="type">
        <USelect
          v-model="state.type"
          :items="grades_level_options"
          placeholder="نوع الكشف"
          label="نوع الكشف"
          class="w-full"
        />
      </UFormField>

      <div class="col-span-2 flex gap-2 mt-5">
        <UButton
          type="submit"
          class="flex w-40 py-2 justify-center font-bold lg:col-span-2 hover:cursor-pointer"
          color="secondary"
          label="تعديل"
          :loading="isLoading"
        />
        <UButton
          variant="soft"
          class="flex w-20 py-2 justify-center font-bold lg:col-span-2 hover:cursor-pointer"
          color="secondary"
          @click="navigateTo('/students/view/grades')"
          label="إلغاء"
        />
      </div>
    </UForm>
  </UCard>
</template>

<script setup lang="ts">
import { number, object, string } from "yup";
import { grades_level_options, gradesReports, students } from "~/constants";
import { type GradesReport } from "~/types";

const schema = object({
  arabic: number().required("اللغة العربية مطلوبة"),
  math: number().required("الرياضيات مطلوبة"),
  science: number().required("العلوم مطلوب"),
  quran: number().required("القرآن مطلوب"),
  english: number().required("اللغة الإنجليزية مطلوبة"),
  maxmumGrade: number().required("النهاية القصوى مطلوبة"),
  minmumGrade: number().required("النهاية الدنيا مطلوبة"),
  type: string().required("نوع الكشف مطلوب"),
});

const state = reactive<GradesReport>({
  id: undefined,
  student_name: undefined,
  level: undefined,
  section: undefined,
  arabic: undefined,
  math: undefined,
  science: undefined,
  quran: undefined,
  english: undefined,
  maxmumGrade: undefined,
  minmumGrade: undefined,
  average: undefined,
  type: undefined,
  relegion: undefined,
});

// const supabase = useSupabaseClient();
const route = useRoute();
const { toastSuccess, toastError } = useAppToast();
const isLoading = ref(false);
const form = ref();

const targetedReport = gradesReports.find(
  (report) => report.id.toString() === route.params.id.toString()
);

Object.assign(state, targetedReport);

const updateReport = async () => {
  isLoading.value = true;
  const reportIndex = gradesReports.findIndex(
    (report) => report.id.toString() === route.params.id.toString()
  );
  gradesReports[reportIndex] = {
    ...state,
    average: `${
      (state?.arabic +
        state?.math +
        state?.science +
        state?.quran +
        state?.english) /
      5
    }%`,
  };

  setTimeout(() => {
    isLoading.value = false;
    toastSuccess({
      title: "تم تحديث كشف الدرجات بنجاح",
    });
    navigateTo("/students/view/grades");
  }, 500);
};
</script>

<style scoped></style>
