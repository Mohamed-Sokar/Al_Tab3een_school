<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import type {
  AvgScoreResult,
  Class,
  ExamType,
  Grade,
  GradesReport,
  Semester,
  Student,
  Subject,
} from "~/types";
import { object, number } from "yup";

// seo
useHead({ title: "الدرجات" });
useSeoMeta({
  title: "الدرجات",
  description: "توليد تقارير عن درجات الطلاب",
  ogTitle: "درجات الطلاب",
  ogDescription: "لوحة تحكم تقارير درجات الطلاب",
  ogImage: "/seo/grads.png",
  twitterCard: "summary_large_image",
});

// init
const gradsReportsStore = useGradsStore();
const { exportToExcel } = useExportToExcel();

// schema
const schema = object({
  semester: number().required("السنة الدراسية مطلوبة"),
  exam_type: number().nullable(),
  academic_class: number().nullable(),
  subject: number().nullable(),
});

// data
const globalFilter = ref("");
const rowSelection = ref({});
const tableKey = ref(Math.random());
const table = ref();
const columns: TableColumn<AvgScoreResult>[] = [
  {
    accessorKey: "rowNumber",
    header: "الرقم",
  },
  {
    accessorKey: "الشعبة",
    header: "الشعبة",
    cell: ({ row }) =>
      row.original.academic_class_title +
      " - " +
      row.original.academic_class_group,
  },
  {
    accessorKey: "المبحث الدراسي",
    header: "المبحث الدراسي",
    cell: ({ row }) => row.original.subject_name,
  },
  {
    accessorKey: "الامتحان",
    header: "الامتحان",
    cell: ({ row }) => row.original.exam_type_name,
  },

  {
    accessorKey: "العلامة الكبرى",
    header: "العلامة الكبرى",
    cell: ({ row }) => row.original.max_score,
  },
  {
    accessorKey: "العلامة الصغرى",
    header: "العلامة الصغرى",
    cell: ({ row }) => row.original.min_score,
  },
  {
    accessorKey: "معدل التقييم",
    header: "معدل التقييم",
    cell: ({ row }) => row.original.average_score,
  },
  {
    id: "action",
  },
];
// state
const state = reactive({
  semester: gradsReportsStore.semestersData[0]?.id,
  exam_type: undefined,
  academic_class: undefined,
  subject: undefined,
});

// computed properties
const numberedReports = computed(() => {
  return gradsReportsStore.avgScoresByClassData.map((report, index) => ({
    ...report,
    rowNumber: index + 1,
  }));
});
const selectedReports = computed(() =>
  Object.keys(rowSelection.value).map((index) => numberedReports.value[+index])
);

// actions
const exportReports = () => {
  exportToExcel({
    data: selectedReports.value.map((r, i) => ({
      الرقم: i + 1,
      الشعبة: r?.academic_class_title + " - " + r.academic_class_group,
      المبحث: r?.subject_name,
      الامتحان: r.exam_type_name,
      المعدل: r.average_score,
    })),
    fileName: "درجات الطلاب",
    sheetName: "معدل درجات الطلاب",
  });
};
const search = async () => {
  //   await gradsReportsStore.fetchGradsReport();
  await gradsReportsStore.get_avg_scores_filtered(
    state.semester,
    state.academic_class,
    state.exam_type,
    state.subject
  );
};
// watch and watchEffect
watchEffect(() => {
  if (gradsReportsStore.semestersData.length > 0) {
    state.semester = gradsReportsStore.semestersData[0].id;
  }
});
</script>

<template>
  <div>
    <!-- start base header -->
    <BaseHeader
      title="الدرجات"
      description="إدارة درجات الطلاب الشهرية والنصفية والنهائية"
    >
      <template #actions>
        <UButton
          color="secondary"
          label="أضف تقرير درجات"
          size="lg"
          icon="heroicons-plus-circle-20-solid"
          class="bg-secondary-600 font-bold hover:cursor-pointer"
          :to="{ name: 'grades-add' }"
        />
      </template>
    </BaseHeader>
    <!-- Start filters -->
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="search">
      <div class="w-full grid md:grid-cols-2 xl:grid-cols-4 gap-3 my-10">
        <UFormField label="السنة الدراسية" required name="semester" size="md">
          <USelect
            class="w-full"
            v-model="state.semester"
            :items="
                gradsReportsStore.semestersData.map((s:Semester) => ({
                label: `${s.year} - ${s.name}`,
                value: s.id,
              }))
            "
            placeholder="اختر السنة الدراسية"
          />
        </UFormField>

        <UFormField label="نوع الاختبار" name="exam_type" size="md">
          <USelect
            class="w-full"
            v-model="state.exam_type"
            :items="[{ label: 'اختر نوع الاختبار', value: null }
              ,...gradsReportsStore.examTypesData.map((s:ExamType) => ({
                label: `${s.name}`,
                value: s.id,
              }))]
            "
            placeholder="اختر نوع الاختبار"
          />
        </UFormField>

        <UFormField label="الشعبة الدراسية" name="academic_class" size="md">
          <USelect
            class="w-full"
            v-model="state.academic_class"
            :items="[{ label: 'اختر الشعبة الدراسية', value: null }
              ,...useAcademicClassesStore().classesData.map((s:Class) => ({
                label: `${s.title} - ${s.group}`,
                value: s.id,
              }))]
            "
            placeholder="اختر الشعبة الدراسية"
          />
        </UFormField>

        <UFormField label="المادة الدراسية" name="subject" size="md">
          <USelect
            class="w-full"
            v-model="state.subject"
            :items="[{ label: 'اختر المادة الدراسية', value: null }
              , ...gradsReportsStore.subjectsData.map((s:Subject) => ({
                label: `${s.name}`,
                value: s.id,
              }))]
            "
            placeholder="اختر المادة الدراسية"
          />
        </UFormField>

        <div class="flex gap-3 items-center">
          <UButton
            type="submit"
            label="بحث"
            icon="i-lucide-search"
            color="secondary"
            :loading="gradsReportsStore.loading"
            class="flex px-4 py-2 rounded-sm mt-5 hover:cursor-pointer font-bold"
          />
        </div>
      </div>
    </UForm>
    <!-- start table -->
    <BaseTable
      :loading="gradsReportsStore.loading"
      :key="tableKey"
      v-model:global-filter="globalFilter"
      :ref="table"
      :data="numberedReports"
      v-model:row-selection="rowSelection"
      :columns="columns"
    >
      <template #actions>
        <div
          class="flex flex-wrap justify-end gap-2 items-center"
          v-if="selectedReports.length"
        >
          <UButton
            icon="heroicons-document-chart-bar-solid"
            variant="outline"
            color="primary"
            size="sm"
            class="p-2 font-bold text-green-700"
            @click="exportReports"
          >
            <span>تصدير</span>
            <span>({{ selectedReports.length }})</span>
            <span> Excel </span>
          </UButton>
        </div>
      </template>
      <template #action-cell="{ row }">
        <UButton
          icon="i-lucide-edit"
          color="secondary"
          @click="
            navigateTo({
              name: 'grades-edit',
              query: {
                semester_id: state.semester,
                academic_class_id: row.original.academic_class_id,
                subject_id: row.original.subject_id,
                subject_exam_id: row.original.subject_exam_id,
                exam_type_id: row.original.exam_type_id,
              },
            })
          "
        />
      </template>
    </BaseTable>
  </div>
</template>
