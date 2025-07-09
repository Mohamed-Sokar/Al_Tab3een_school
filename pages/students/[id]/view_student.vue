<script setup lang="ts">
import {
  memorization_status_options,
  guardian_name_kinship_options,
  daily_recitation_options,
} from "~/constants";
import { type Student } from "~/types";
import { useStudentStore } from "@/stores/students";

const studentsStore = useStudentStore();

const newStudentState = reactive<Student>({
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
});

const route = useRoute();
const studentId = Array.isArray(route.params.id)
  ? route.params.id[0]
  : route.params.id;

const targetedStudent = ref<Student | undefined>(
  studentsStore.getSpesificStudent(studentId)
);

watchEffect(() => {
  if (studentsStore.sortedStudents.length > 0) {
    targetedStudent.value = studentsStore.getSpesificStudent(studentId);
    Object.assign(newStudentState, targetedStudent.value);
  }
});
const { getArabicDayName, getDate } = useDateUtils();

const getMonthAchievedPages = (month: string, student?: Student): number => {
  return (
    student?.quran_achievement_reports?.find((p) => p.month === month)
      ?.achieved_pages ?? 0
  );
};
const isPlanAchieved = (required: number, achieved: number): boolean => {
  return achieved >= required;
};
const getAchievementColor = (month: string, planPages: number) => {
  const achievedPages = getMonthAchievedPages(month, targetedStudent.value);
  return isPlanAchieved(planPages, achievedPages) ? "success" : "error";
};
</script>

<template>
  <div class="max-w-3xl mx-auto space-y-10 mt-10">
    <!-- main info. -->
    <div class="border-b border-dashed border-accented pb-10">
      <h2 class="text-xl mb-5 font-bold text-info">المعلومات الأساسية</h2>
      <UCard>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <UFormField label="الاسم الأول" name="first_name">
            <UInput
              disabled
              v-model="newStudentState.first_name"
              placeholder="الاسم الأول"
              label="الاسم الأول"
              class="w-full"
            />
          </UFormField>
          <UFormField label="الاسم الثاني" name="second_name">
            <UInput
              disabled
              v-model="newStudentState.second_name"
              placeholder="الاسم الثاني"
              label="الاسم الثاني"
              class="w-full"
            />
          </UFormField>
          <UFormField label="الاسم الثالث" name="third_name">
            <UInput
              disabled
              v-model="newStudentState.third_name"
              placeholder="الاسم الثالث"
              label="الاسم الثالث"
              class="w-full"
            />
          </UFormField>
          <UFormField label="الاسم الرابع" name="last_name">
            <UInput
              disabled
              v-model="newStudentState.last_name"
              placeholder="الاسم الرابع"
              label="الاسم الرابع"
              class="w-full"
            />
          </UFormField>
          <UFormField label="اسم ولي الأمر" name="guardian_name">
            <UInput
              disabled
              v-model="newStudentState.guardian_name"
              placeholder="اسم ولي الأمر"
              label="اسم ولي الأمر"
              class="w-full"
            />
          </UFormField>
          <UFormField label="صلة قرابة ولي الأمر" name="guardian_name_kinship">
            <USelect
              disabled
              :items="guardian_name_kinship_options"
              v-model="newStudentState.guardian_name_kinship"
              placeholder="صلة قرابة ولي الأمر"
              label="صلة قرابة ولي الأمر"
              class="w-full"
            />
          </UFormField>
          <UFormField label="رقم الواتس" name="whatsapp_number">
            <UInput
              disabled
              v-model="newStudentState.whatsapp_number"
              type="number"
              placeholder="97xxxxxxxxxx"
              label="رقم الواتس"
              class="w-full"
            />
          </UFormField>

          <UFormField label="رقم الهوية" name="identity_number">
            <UInput
              disabled
              v-model="newStudentState.identity_number"
              placeholder="رقم الهوية"
              label="رقم الهوية"
              class="w-full"
            />
          </UFormField>
          <UFormField label="رقم هوية الأب" name="father_identity_number">
            <UInput
              disabled
              v-model="newStudentState.father_identity_number"
              placeholder="رقم هوية الأب"
              label="رقم هوية الأب"
              class="w-full"
            />
          </UFormField>
          <UFormField label="تاريخ الميلاد" name="birth_date">
            <UInput
              disabled
              v-model="newStudentState.birth_date"
              type="date"
              class="w-full"
              placeholder="تاريخ الميلاد"
              icon="heroicons-calendar-days-solid"
            />
          </UFormField>
          <UFormField label="رقم الجوال" name="phone_number">
            <UInput
              disabled
              v-model="newStudentState.phone_number"
              placeholder="05xxxxxxxx"
              label="رقم الجوال"
              class="w-full"
            />
          </UFormField>
          <UFormField label="العنوان" name="address">
            <UInput
              disabled
              v-model="newStudentState.address"
              placeholder="العنوان"
              label="العنوان"
              class="w-full"
            />
          </UFormField>
          <UFormField label="المسجد" name="masjed">
            <UInput
              disabled
              v-model="newStudentState.masjed"
              placeholder="المسجد"
              label="المسجد"
              class="w-full"
            />
          </UFormField>

          <UFormField label="المستوى الدراسي" name="level_id">
            <USelect
              disabled
              v-model="newStudentState.level_id"
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

          <UFormField label="حالة الحفظ" name="memorization_status">
            <USelect
              disabled
              v-model="newStudentState.memorization_status"
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
              v-model="newStudentState.memorized_juz"
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
              v-model="newStudentState.daily_recitation"
              placeholder="التسميع اليومي"
              label="التسميع اليومي"
              class="w-full"
            />
          </UFormField>
        </div>
      </UCard>
    </div>
    <!-- driver info. -->
    <div class="border-b border-dashed border-accented pb-10">
      <h2 class="text-xl mb-5 font-bold text-info">معلومات السائق</h2>
      <UCard>
        <div v-if="targetedStudent?.driver">
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
              {{ targetedStudent?.driver.name }}
            </span>
            <span class="font-bold">
              {{ targetedStudent?.driver.phone_no }}
            </span>
            <span class="font-bold">
              {{ targetedStudent?.driver.car_type }}
            </span>
            <span class="font-bold">
              {{ targetedStudent?.driver.car_color }}
            </span>
          </div>
        </div>
        <div v-else class="text-sm">لم يتم تعيين سائق...</div>
      </UCard>
    </div>
    <!-- academic_class info. -->
    <div class="border-b border-dashed border-accented pb-10">
      <h2 class="text-xl mb-5 font-bold text-info">معلومات الصف الدراسي</h2>
      <UCard>
        <div v-if="targetedStudent?.academic_class">
          <div
            class="grid grid-cols-4 justify-between items-center gap-2 border-b py-2 place-items-center"
          >
            <span class="font-bold">الصف</span>
            <span class="font-bold">الشعبة</span>
            <span class="font-bold">الطابق</span>
            <span class="font-bold">الجهة</span>
          </div>
          <div
            class="grid grid-cols-4 place-items-center gap-2 not-last:border-b border-dashed py-2"
          >
            <span class="font-bold">
              {{ targetedStudent?.academic_class.title }}
            </span>
            <span class="font-bold">
              {{ targetedStudent?.academic_class.group }}
            </span>
            <span class="font-bold">
              {{ targetedStudent?.academic_class.floor }}
            </span>
            <span class="font-bold">
              {{ targetedStudent?.academic_class.wing }}
            </span>
          </div>
        </div>
        <div v-else>لم يتم تعيين صف دراسي بعد...</div>
      </UCard>
    </div>
    <!-- quran class info. -->
    <div class="border-b border-dashed border-accented pb-10">
      <h2 class="text-xl mb-5 font-bold text-info">معلومات الصف القرآني</h2>
      <UCard>
        <div v-if="targetedStudent?.quran_class">
          <div
            class="grid grid-cols-4 justify-between items-center gap-2 border-b py-2"
          >
            <span class="font-bold">الصف</span>
            <span class="font-bold">الشعبة</span>
            <span class="font-bold">الطابق</span>
            <span class="font-bold">الجهة</span>
          </div>
          <div
            class="grid grid-cols-4 justify-between items-center gap-2 not-last:border-b border-dashed py-2"
          >
            <span class="font-bold">
              {{ targetedStudent?.quran_class.title }}
            </span>
            <span class="font-bold">
              {{ targetedStudent?.quran_class.group }}
            </span>
            <span class="font-bold">
              {{ targetedStudent?.quran_class.floor }}
            </span>
            <span class="font-bold">
              {{ targetedStudent?.quran_class.wing }}
            </span>
          </div>
        </div>
        <div class="text-sm" v-else>لم يتم تعيين صف قرآني بعد...</div>
      </UCard>
    </div>
    <!-- student quran achievement reports -->
    <div class="border-b border-dashed border-accented pb-10">
      <h2 class="text-xl mb-5 font-bold text-info">معلومات الصف القرآني</h2>
      <div>
        <div v-if="targetedStudent?.plan" class="text-sm">
          <!-- achievment plan details -->
          <div
            v-if="targetedStudent.plan.months_plans?.length"
            class="border border-accented rounded-tr-lg rounded-tl-lg"
          >
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
                  v-for="plan in targetedStudent.plan.months_plans"
                  :key="plan.id"
                >
                  <span>
                    {{ plan.month }}
                  </span>
                  <span>
                    {{ plan.pages }}
                  </span>
                  <span>
                    {{
                      getMonthAchievedPages(plan.month ?? "", targetedStudent)
                    }}
                  </span>
                  <UBadge
                    :color="
                      getAchievementColor(plan.month ?? '', plan.pages ?? 0)
                    "
                  >
                    {{
                      isPlanAchieved(
                        plan.pages ?? 0,
                        getMonthAchievedPages(plan.month ?? "", targetedStudent)
                      )
                        ? "مكتمل"
                        : "غير مكتمل"
                    }}
                  </UBadge>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <p v-else>لم يتم تعيين خطة بعد</p>
      </div>
    </div>
    <!-- behavioral issues -->
    <div>
      <h2 class="text-xl mb-5 font-bold text-info">المخالفات السلوكية</h2>
      <UCard>
        <div>
          <div v-if="targetedStudent?.behavioral_issues?.length">
            <ul>
              <li
                class="grid grid-cols-3 justify-between items-center gap-2 border-b py-2"
              >
                <span class="font-bold">اليوم</span>
                <span class="font-bold">التاريخ</span>
                <span class="font-bold">المخالفة</span>
              </li>
              <li
                v-for="(issue, index) in targetedStudent.behavioral_issues"
                :key="index"
                class="grid grid-cols-3 justify-between items-center gap-2 border-b border-dashed border-gray-200 py-2 mb-2"
              >
                <span>
                  {{ getArabicDayName(issue.created_at + "") }}
                </span>
                <span>
                  {{ getDate(issue.created_at ?? "") }}
                </span>
                <span> {{ issue.description }} </span>
              </li>
            </ul>
            <div class="pt-3">
              <span> المجموع: </span>
              <span class="font-bold">
                {{ targetedStudent.behavioral_issues.length }}
              </span>
            </div>
          </div>

          <p v-else>لا توجد مخالفات.</p>
        </div>
      </UCard>
    </div>
  </div>
</template>

<style scoped></style>
