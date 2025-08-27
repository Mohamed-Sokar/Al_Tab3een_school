<script setup lang="ts">
import {
  memorization_status_options,
  guardian_name_kinship_options,
  daily_recitation_options,
} from "~/constants";
import type { GradesReport, Student } from "~/types";
import { useStudentStore } from "@/stores/students";

// init
const studentsStore = useStudentStore();
const { getArabicDayName, getDate } = useDateUtils();
const route = useRoute();

// data
const studentId = Array.isArray(route.params.id)
  ? route.params.id[0]
  : route.params.id;

// state
const state = reactive<Student>({
  first_name: undefined,
  second_name: undefined,
  third_name: undefined,
  last_name: undefined,
  guardian_name: undefined,
  guardian_name_kinship: guardian_name_kinship_options[0],
  whatsapp_number: undefined,
  identity_number: undefined,
  father_identity_number: undefined,
  phone_number: undefined,
  birth_date: undefined,
  level_id: undefined,
  masjed: undefined,
  address: undefined,
  memorization_status: undefined,
  memorized_juz: undefined as number | undefined,
  daily_recitation: undefined,
  created_at: undefined,
  academic_class: undefined,
  quran_class: undefined,
  behavioral_issues: undefined,
  months_fees: undefined,
  quran_achievement_reports: undefined,
  exam_results: undefined,
});

// Actions
const getStatusLabel = (report: GradesReport) => {
  const scorePercentage =
    Number(report.score) / Number(report?.exam?.max_score);
  if (scorePercentage >= 0.9) return "ممتاز";
  if (scorePercentage >= 0.8) return "جيد جدا";
  if (scorePercentage >= 0.7) return "جيد";
  return "ضعيف";
};
const getStatusColor = (report: GradesReport) => {
  const scorePercentage =
    Number(report.score) / Number(report?.exam?.max_score);

  return scorePercentage >= 0.9
    ? "success"
    : scorePercentage >= 0.8
    ? "warning"
    : "error";
};

// studentsStore.getSpesificStudent(studentId)
const createdAtString = computed({
  get() {
    if (!state.created_at) return "";
    if (typeof state.created_at === "string") {
      // If already in YYYY-MM-DD format, return as is
      if (/^\d{4}-\d{2}-\d{2}$/.test(state.created_at)) {
        return state.created_at;
      }
      // Try to parse and format
      const d = new Date(state.created_at);
      if (!isNaN(d.getTime())) {
        return d.toISOString().slice(0, 10);
      }
      return "";
    }
    if (state.created_at instanceof Date) {
      return state.created_at.toISOString().slice(0, 10);
    }
    return "";
  },
  set(val: string) {
    state.created_at = val;
  },
});
const birth_date_string = computed({
  get() {
    if (!state.birth_date) return "";
    if (typeof state.birth_date === "string") {
      // If already in YYYY-MM-DD format, return as is
      if (/^\d{4}-\d{2}-\d{2}$/.test(state.birth_date)) {
        return state.birth_date;
      }
      // Try to parse and format
      const d = new Date(state.birth_date);
      if (!isNaN(d.getTime())) {
        return d.toISOString().slice(0, 10);
      }
      return "";
    }
    if (state.birth_date instanceof Date) {
      return state.birth_date.toISOString().slice(0, 10);
    }
    return "";
  },
  set(val: Date) {
    state.birth_date = val;
  },
});

onMounted(async () => {
  const student = await studentsStore.fetchStudentById(studentId);
  Object.assign(state, student);
  console.log("Fetched student:", state);
});
</script>

<template>
  <div class="max-w-3xl mx-auto mt-10" ref="contentToPrint">
    <div v-if="studentsStore.loading" class="space-y-5">
      <USkeleton class="h-100 w-full" />
      <USkeleton class="h-50 w-full" />
      <USkeleton class="h-10 w-full" />
      <USkeleton class="h-10 w-full" />
      <USkeleton class="h-10 w-full" />
      <USkeleton class="h-10 w-full" />
    </div>
    <div class="space-y-10" v-else>
      <!-- main info. -->
      <div class="border-b border-dashed border-accented pb-10">
        <div class="flex justify-between items-center mb-5">
          <h2 class="text-xl font-bold text-info">المعلومات الأساسية</h2>
          <div class="flex gap-2">
            <UButton
              :to="{ name: 'students-id-edit', params: { id: studentId } }"
              icon="heroicons-pencil"
              variant="subtle"
              color="secondary"
            />
            <UButton
              :to="{ name: 'students-view' }"
              icon="heroicons-arrow-left-16-solid"
              variant="subtle"
              color="secondary"
            />
          </div>
        </div>
        <UCard>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <UFormField label="الاسم الأول" name="first_name">
              <UInput
                disabled
                v-model="state.first_name"
                placeholder="الاسم الأول"
                label="الاسم الأول"
                class="w-full"
              />
            </UFormField>
            <UFormField label="الاسم الثاني" name="second_name">
              <UInput
                disabled
                v-model="state.second_name"
                placeholder="الاسم الثاني"
                label="الاسم الثاني"
                class="w-full"
              />
            </UFormField>
            <UFormField label="الاسم الثالث" name="third_name">
              <UInput
                disabled
                v-model="state.third_name"
                placeholder="الاسم الثالث"
                label="الاسم الثالث"
                class="w-full"
              />
            </UFormField>
            <UFormField label="الاسم الرابع" name="last_name">
              <UInput
                disabled
                v-model="state.last_name"
                placeholder="الاسم الرابع"
                label="الاسم الرابع"
                class="w-full"
              />
            </UFormField>
            <UFormField label="اسم ولي الأمر" name="guardian_name">
              <UInput
                disabled
                v-model="state.guardian_name"
                placeholder="اسم ولي الأمر"
                label="اسم ولي الأمر"
                class="w-full"
              />
            </UFormField>
            <UFormField
              label="صلة قرابة ولي الأمر"
              name="guardian_name_kinship"
            >
              <USelect
                disabled
                :items="guardian_name_kinship_options"
                v-model="state.guardian_name_kinship"
                placeholder="صلة قرابة ولي الأمر"
                label="صلة قرابة ولي الأمر"
                class="w-full"
              />
            </UFormField>
            <UFormField label="رقم الواتس" name="whatsapp_number">
              <UInput
                disabled
                v-model="state.whatsapp_number"
                type="number"
                placeholder="97xxxxxxxxxx"
                label="رقم الواتس"
                class="w-full"
              />
            </UFormField>
            <UFormField label="رقم الهوية" name="identity_number">
              <UInput
                disabled
                v-model="state.identity_number"
                placeholder="رقم الهوية"
                label="رقم الهوية"
                class="w-full"
              />
            </UFormField>
            <UFormField label="رقم هوية الأب" name="father_identity_number">
              <UInput
                disabled
                v-model="state.father_identity_number"
                placeholder="رقم هوية الأب"
                label="رقم هوية الأب"
                class="w-full"
              />
            </UFormField>
            <UFormField label="تاريخ الميلاد" name="birth_date">
              <UInput
                disabled
                v-model="birth_date_string"
                type="date"
                class="w-full"
                placeholder="تاريخ الميلاد"
                icon="heroicons-calendar-days-solid"
              />
            </UFormField>
            <UFormField label="رقم الجوال" name="phone_number">
              <UInput
                disabled
                v-model="state.phone_number"
                placeholder="05xxxxxxxx"
                label="رقم الجوال"
                class="w-full"
              />
            </UFormField>
            <UFormField label="العنوان" name="address">
              <UInput
                disabled
                v-model="state.address"
                placeholder="العنوان"
                label="العنوان"
                class="w-full"
              />
            </UFormField>
            <UFormField label="تاريخ إضافة الطالب" name="created_at">
              <UInput
                disabled
                v-model="createdAtString"
                placeholder="تاريخ إضافة الطالب"
                label="تاريخ إضافة الطالب"
                class="w-full"
                type="date"
              />
            </UFormField>
            <UFormField label="المسجد" name="masjed">
              <UInput
                disabled
                v-model="state.masjed"
                placeholder="المسجد"
                label="المسجد"
                class="w-full"
              />
            </UFormField>
            <UFormField label="المستوى الدراسي" name="level_id">
              <USelect
                disabled
                v-model="state.level_id"
                :items="
                  useLevelsStore().levelsData.map((level) => ({
                    label: level.title,
                    value: level.id,
                  }))
                "
                type="text"
                class="w-full"
                placeholder="المستوى الدراسي"
              />
            </UFormField>
            <UFormField label="الشعبة الدراسية" name="academic_class_id">
              <USelect
                disabled
                class="w-full"
                icon="i-heroicons-presentation-chart-bar"
                v-model="state.academic_class_id"
                :items="[
                  { label: 'الكل', value: undefined },
                  ...useAcademicClassesStore().classesData.map((c) => ({
                    label: `${c.title} - شعبة ${c.group}`,
                    value: c.id,
                  })),
                ]"
                placeholder="اختر الشعبة الدراسية"
              />
            </UFormField>
            <UFormField label="الشعبة القرآنية" name="quran_class_id">
              <USelect
                disabled
                class="w-full"
                icon="i-lucide-book-open"
                v-model="state.quran_class_id"
                :items="[
                  { label: 'الكل', value: undefined },
                  ...useQuranClassesStore().classesData.map((c) => ({
                    label: `${c.title} - شعبة ${c.group}`,
                    value: c.id,
                  })),
                ]"
                placeholder="اختر الشعبة القرآنية"
              />
            </UFormField>
            <UFormField label="حالة الحفظ" name="memorization_status">
              <USelect
                disabled
                v-model="state.memorization_status"
                :items="memorization_status_options"
                type="text"
                class="w-full"
                placeholder="حالة الحفظ"
              />
            </UFormField>
            <UFormField label="الأجزاء المحفوظة" name="memorized_juz">
              <USelect
                disabled
                :items="
                  Array.from({ length: 30 }, (_, i) => ({
                    label: `${i + 1} جزء`,
                    value: i + 1,
                  }))
                "
                v-model="state.memorized_juz"
                type="number"
                placeholder="الأجزاء المحفوظة"
                label="الأجزاء المحفوظة"
                class="w-full"
              />
            </UFormField>
            <UFormField label="التسميع اليومي" name="daily_recitation">
              <USelect
                disabled
                :items="daily_recitation_options"
                v-model="state.daily_recitation"
                placeholder="التسميع اليومي"
                label="التسميع اليومي"
                class="w-full"
              />
            </UFormField>
          </div>
        </UCard>
      </div>
      <!-- driver info. -->
      <!-- <div class="border-b border-dashed border-accented pb-10">
      <h2 class="text-xl mb-5 font-bold text-info">معلومات السائق</h2>
      <UCard>
        <div v-if="state?.driver">
          <div
            class="grid grid-cols-4 justify-between items-center gap-2 border-b py-2 place-items-center"
          >
            <span class="font-bold">الاسم</span>
            <span class="font-bold">رقم الجوال</span>
            <span class="font-bold">نوع السيارة</span>
            <span class="font-bold">لون السيارة</span>
          </div>
          <div
            class="grid grid-cols-4 justify-between items-center gap-2 not-last:border-b border-dashed py-2 place-items-center"
          >
            <span class="font-bold">
              {{ state?.driver.name }}
            </span>
            <span class="font-bold">
              {{ state?.driver.phone_no }}
            </span>
            <span class="font-bold">
              {{ state?.driver.car_type }}
            </span>
            <span class="font-bold">
              {{ state?.driver.car_color }}
            </span>
          </div>
        </div>
        <div v-else class="text-sm">لم يتم تعيين سائق...</div>
      </UCard>
    </div> -->

      <!-- academic class info. -->
      <div class="border-b border-dashed border-accented pb-10">
        <h2 class="text-xl mb-5 font-bold text-info">معلومات الصف الدراسي</h2>
        <UCard>
          <div class="text-sm" v-if="state?.academic_class">
            <div class="border border-accented rounded-tr-lg rounded-tl-lg">
              <h3
                class="font-bold text-sm text-center py-2 rounded-tr-md rounded-tl-md bg-accented"
              >
                تفاصيل الصف الدراسي
              </h3>
              <div class="px-2">
                <ul>
                  <li
                    class="grid grid-cols-4 justify-between items-center gap-2 border-b py-2 place-items-center"
                  >
                    <span class="font-bold">الصف</span>
                    <span class="font-bold">الشعبة</span>
                    <span class="font-bold">الطابق</span>
                    <span class="font-bold">الجهة</span>
                  </li>
                  <li
                    class="grid grid-cols-4 justify-between items-center gap-2 py-2 place-items-center not-last:border-b border-gray-400 not-last:border-dashed"
                  >
                    <span>
                      {{ state?.academic_class?.title }}
                    </span>
                    <span>
                      {{ state?.academic_class?.group }}
                    </span>
                    <span>
                      {{ state?.academic_class?.floor }}
                    </span>
                    <span>
                      {{ state?.academic_class?.wing }}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <p v-else>لم يتم تعيين صف دراسي بعد</p>
        </UCard>
      </div>
      <!-- quran class info. -->
      <div class="border-b border-dashed border-accented pb-10">
        <h2 class="text-xl mb-5 font-bold text-info">معلومات الصف القرآني</h2>
        <UCard>
          <div class="text-sm" v-if="state?.quran_class">
            <div class="border border-accented rounded-tr-lg rounded-tl-lg">
              <h3
                class="font-bold text-sm text-center py-2 rounded-tr-md rounded-tl-md bg-accented"
              >
                تفاصيل الصف القرآني
              </h3>
              <div class="px-2">
                <ul>
                  <li
                    class="grid grid-cols-4 justify-between items-center gap-2 border-b py-2 place-items-center"
                  >
                    <span class="font-bold">الصف</span>
                    <span class="font-bold">الشعبة</span>
                    <span class="font-bold">الطابق</span>
                    <span class="font-bold">الجهة</span>
                  </li>
                  <li
                    class="grid grid-cols-4 justify-between items-center gap-2 py-2 place-items-center not-last:border-b border-gray-400 not-last:border-dashed"
                  >
                    <span>
                      {{ state?.quran_class?.title }}
                    </span>
                    <span>
                      {{ state?.quran_class?.group }}
                    </span>
                    <span>
                      {{ state?.quran_class?.floor }}
                    </span>
                    <span>
                      {{ state?.quran_class?.wing }}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <p v-else>لم يتم تعيين صف قرآني بعد</p>
        </UCard>
      </div>
      <!-- student quran achievement reports -->
      <div class="border-b border-dashed border-accented pb-10">
        <h2 class="text-xl mb-5 font-bold text-info">تقارير إنجاز الحفظ</h2>
        <UCard>
          <div v-if="state?.quran_achievement_reports?.length" class="text-sm">
            <!-- achievment plan details -->
            <div class="border border-accented rounded-tr-lg rounded-tl-lg">
              <h3
                class="font-bold text-sm text-center py-2 rounded-tr-md rounded-tl-md bg-accented"
              >
                تفاصيل إنجاز الطالب
              </h3>
              <div class="px-2">
                <ul>
                  <li
                    class="grid grid-cols-4 justify-between items-center gap-2 border-b py-2 place-items-center"
                  >
                    <span class="font-bold">الشهر</span>
                    <span class="font-bold">عدد الصفحات المطلوبة</span>
                    <span class="font-bold">عدد الصفحات المنجزة</span>
                    <span class="font-bold">الحالة</span>
                  </li>
                  <li
                    class="grid grid-cols-4 justify-between items-center gap-2 py-2 place-items-center not-last:border-b border-gray-400 not-last:border-dashed"
                    v-for="report in state.quran_achievement_reports"
                    :key="report.id"
                  >
                    <span>
                      {{ report.month_plan?.month?.name }} -
                      {{ report.month_plan?.month?.id }}
                    </span>
                    <span>
                      {{ report.month_plan?.pages }}
                    </span>
                    <span>
                      {{ report.achieved_pages }}
                    </span>
                    <UBadge
                      :color="report.status === 'مكتمل' ? 'success' : 'error'"
                      :label="report.status"
                    />
                  </li>
                </ul>
              </div>
            </div>
            <div class="mt-5">
              <span class="font-bold text-md">عدد التقارير: </span>
              <UBadge
                color="neutral"
                variant="subtle"
                label=""
                class="font-bold"
              >
                {{ state?.quran_achievement_reports?.length }}
              </UBadge>
            </div>
          </div>
          <p v-else>لم يتم إضافة تقارير إنجاز قرآني بعد</p>
        </UCard>
      </div>
      <!-- student exams grades reports -->
      <div class="border-b border-dashed border-accented pb-10">
        <h2 class="text-xl mb-5 font-bold text-info">تقارير درجات الطالب</h2>
        <UCard>
          <div v-if="state?.exam_results?.length" class="text-sm">
            <div class="border border-accented rounded-tr-lg rounded-tl-lg">
              <h3
                class="font-bold text-sm text-center py-2 rounded-tr-md rounded-tl-md bg-accented"
              >
                تفاصيل درجات الطالب
              </h3>
              <div class="px-2">
                <ul>
                  <li
                    class="grid grid-cols-4 justify-between items-center gap-2 border-b py-2 place-items-center"
                  >
                    <span class="font-bold">نوع الاختبار</span>
                    <span class="font-bold">المادة</span>
                    <span class="font-bold">الدرجة</span>
                    <span class="font-bold">التقييم</span>
                  </li>
                  <li
                    class="grid grid-cols-4 justify-between items-center gap-2 py-2 place-items-center not-last:border-b border-gray-400 not-last:border-dashed"
                    v-for="report in state.exam_results"
                    :key="report.id"
                  >
                    <span>
                      {{ report.exam?.type.name }}
                    </span>
                    <span>
                      {{ report.subject?.name }}
                    </span>
                    <span>
                      {{ report.score }} / {{ report.exam?.max_score }}
                    </span>
                    <UBadge
                      :color="getStatusColor(report)"
                      :label="getStatusLabel(report)"
                    />
                  </li>
                </ul>
              </div>
            </div>
            <div class="mt-5">
              <span class="font-bold text-md">عدد التقارير: </span>
              <UBadge
                color="neutral"
                variant="subtle"
                label=""
                class="font-bold"
              >
                {{ state?.exam_results?.length }}
              </UBadge>
            </div>
          </div>
          <p v-else>لم يتم إضافة تقارير درجات بعد</p>
        </UCard>
      </div>
      <!-- student Fees reports -->
      <div class="border-b border-dashed border-accented pb-10">
        <h2 class="text-xl mb-5 font-bold text-info">تقارير رسوم الدفع</h2>
        <UCard>
          <div v-if="state?.months_fees?.length" class="text-sm">
            <!-- student fees details -->
            <div class="border border-accented rounded-tr-lg rounded-tl-lg">
              <h3
                class="font-bold text-sm text-center py-2 rounded-tr-md rounded-tl-md bg-accented"
              >
                تفاصيل رسوم الطالب
              </h3>
              <div class="px-2">
                <ul>
                  <li
                    class="grid grid-cols-5 justify-between items-center gap-2 border-b py-2 place-items-center"
                  >
                    <span class="font-bold">يوم الدفع</span>
                    <span class="font-bold">تاريخ الدفع</span>
                    <span class="font-bold">تاريخ التحديث</span>
                    <span class="font-bold">القيمة</span>
                    <span class="font-bold">الحالة</span>
                  </li>
                  <li
                    class="grid grid-cols-5 justify-between items-center gap-2 py-2 place-items-center not-last:border-b border-gray-400 not-last:border-dashed"
                    v-for="fee in state.months_fees"
                    :key="fee.id"
                  >
                    <span>{{ getArabicDayName(fee.created_at ?? "") }}</span>
                    <span>{{ getDate(fee.created_at ?? "") }}</span>
                    <span>{{
                      fee.updated_at
                        ? getDate(fee.updated_at)
                        : "لم يتم التحديث"
                    }}</span>
                    <span>{{ fee.amount }}</span>
                    <UBadge
                      :color="
                        fee.status === 'مسدد'
                          ? 'success'
                          : fee.status === 'متأخر'
                          ? 'warning'
                          : 'error'
                      "
                      :label="fee.status"
                    >
                    </UBadge>
                  </li>
                </ul>
              </div>
            </div>
            <div class="mt-5">
              <span class="font-bold text-md">عدد التقارير: </span>
              <UBadge
                color="neutral"
                variant="subtle"
                label=""
                class="font-bold"
              >
                {{ state?.months_fees?.length }}
              </UBadge>
            </div>
          </div>
          <p v-else>لم يتم إضافة تقارير رسوم بعد</p>
        </UCard>
      </div>
      <!-- student Behavioral Issue reports -->
      <div class="border-b border-dashed border-accented pb-10">
        <h2 class="text-xl mb-5 font-bold text-info">
          تقارير المخالفات السلوكية
        </h2>
        <UCard>
          <div v-if="state?.behavioral_issues?.length" class="text-sm">
            <!-- behavioral issue details -->
            <div
              v-if="state.behavioral_issues?.length"
              class="border border-accented rounded-tr-lg rounded-tl-lg"
            >
              <h3
                class="font-bold text-sm text-center py-2 rounded-tr-md rounded-tl-md bg-accented"
              >
                تفاصيل المخالفات السلوكية
              </h3>
              <div class="px-2">
                <ul>
                  <li
                    class="grid grid-cols-3 justify-between items-center gap-2 border-b py-2 place-items-center"
                  >
                    <span class="font-bold">اليوم</span>
                    <span class="font-bold">التاريخ</span>
                    <span class="font-bold">وصف المخالفة</span>
                  </li>
                  <li
                    class="grid grid-cols-3 justify-between items-center gap-2 py-2 place-items-center not-last:border-b border-gray-400 not-last:border-dashed"
                    v-for="report in state.behavioral_issues"
                    :key="report.id"
                  >
                    <span>{{ getArabicDayName(report.created_at ?? "") }}</span>
                    <span>{{ getDate(report.created_at ?? "") }}</span>

                    <span>{{ report.description }}</span>
                  </li>
                </ul>
              </div>
            </div>
            <div class="mt-5">
              <span class="font-bold text-md">عدد التقارير: </span>
              <UBadge
                color="neutral"
                variant="subtle"
                label=""
                class="font-bold"
              >
                {{ state.behavioral_issues.length }}
              </UBadge>
            </div>
          </div>
          <p v-else>لا يوجد مخالفات سلوكية</p>
        </UCard>
      </div>
    </div>
  </div>
</template>

<style>
@media print {
  body * {
    visibility: hidden;
  }
  .max-w-3xl,
  .max-w-3xl * {
    visibility: visible;
  }
  .max-w-3xl {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    max-width: 100%;
  }
  /* Hide print button when printing */
  button {
    display: none !important;
  }
}
</style>
