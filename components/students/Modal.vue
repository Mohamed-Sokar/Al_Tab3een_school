<script setup lang="ts">
import type {
  QuranAchievementReport,
  Student,
  StudentModalFlag,
} from "~/types";
import { object, number } from "yup";

import { toDate } from "~/composables/studentUtils";

const { getArabicDayName, getDate } = useDateUtils();

const schema = object({
  selectedClassId: number().required("الصف مطلوب"),
});
const assignPlanSchema = object({
  selectedPlanId: number().required("الخطة مطلوبة"),
});

// props init
const props = defineProps<{
  showModal: boolean;
  loading: boolean;
  selectedFlag: StudentModalFlag | undefined;
  selectedStudent: Student | undefined;
  selectedClassId: number | undefined;
  selectedPlan: { label: string; value: number | undefined } | undefined;
  academicClasses: ReturnType<typeof useAcademicClassesStore>["classesData"];
  quranClasses: ReturnType<typeof useQuranClassesStore>["classesData"];
  plans: ReturnType<typeof usePlansStore>["plansData"];
}>();

// emits init
const emit = defineEmits<{
  (e: "update:showModal", value: boolean): void;
  (e: "update:selectedClassId", value: number | undefined): void;
  (
    e: "update:selectedPlan",
    value: { label: string; value: number | undefined } | undefined
  ): void;
  (e: "submit"): void;
}>();

// modal titles
const modelTitle = computed(() =>
  props.selectedFlag === "studentIssue"
    ? "تفاصيل المخالفات"
    : props.selectedFlag === "move_academic_class"
    ? "نقل لصف دراسي"
    : props.selectedFlag === "move_quran_class"
    ? "نقل لصف قرآن"
    : props.selectedFlag === "academic_class"
    ? "تفاصيل الصف الدراسي"
    : props.selectedFlag === "quran_class"
    ? "تفاصيل الصف القرآني"
    : props.selectedFlag === "driver_info"
    ? "تفاصيل السائق"
    : props.selectedFlag === "plan"
    ? "تفاصيل خطة الطالب"
    : props.selectedFlag === "fees"
    ? "تفاصيل رسوم الطالب"
    : props.selectedFlag === "assign_plan"
    ? "تعيين خطة"
    : ""
);
const isOpen = computed({
  get: () => props.showModal || false,
  set: (value) => {
    // if (!value) resetForm();
    emit("update:showModal", value);
  },
});
const getRequiredPages = (report: QuranAchievementReport) =>
  props.selectedStudent?.plan?.months_plans?.find(
    (mp) => mp.month_id === report.month_plan?.month_id
  )?.pages;
</script>

<template>
  <UModal
    :title="modelTitle"
    class="min-w-xl lg:min-w-3xl overflow-x-scroll"
    v-model:open="isOpen"
  >
    <template #body>
      <div v-if="selectedFlag === 'studentIssue'">
        <div v-if="selectedStudent?.behavioral_issues?.length">
          <ul>
            <li
              class="grid grid-cols-3 justify-between items-center gap-2 border-b py-2 place-items-center"
            >
              <span class="font-bold">اليوم</span>
              <span class="font-bold">التاريخ</span>
              <span class="font-bold">المخالفة</span>
            </li>
            <li
              v-for="(issue, index) in selectedStudent.behavioral_issues"
              :key="index"
              class="grid grid-cols-3 justify-between items-center gap-2 border-b border-dashed border-gray-200 py-2 place-items-center mb-2"
            >
              <span>{{ getArabicDayName(issue.created_at + "") }}</span>
              <span>{{ toDate(issue.created_at ?? "") }}</span>
              <span>{{ issue.description }}</span>
            </li>
          </ul>
          <div class="pt-3">
            <span>المجموع:</span>
            <span class="font-bold">{{
              selectedStudent.behavioral_issues.length
            }}</span>
          </div>
        </div>
        <p v-else>لا توجد مخالفات.</p>
      </div>
      <div v-if="selectedFlag === 'academic_class'">
        <div v-if="selectedStudent?.academic_class">
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
              class="grid grid-cols-4 justify-between items-center gap-2 py-2 place-items-center"
            >
              <span class="font-bold">{{
                selectedStudent?.academic_class.title
              }}</span>
              <span class="font-bold">{{
                selectedStudent?.academic_class.group
              }}</span>
              <span class="font-bold">{{
                selectedStudent?.academic_class.floor
              }}</span>
              <span class="font-bold">{{
                selectedStudent?.academic_class.wing
              }}</span>
            </li>
          </ul>
        </div>
        <p v-else>لم يتم تعيين صف بعد</p>
      </div>
      <div v-if="selectedFlag === 'quran_class'">
        <div v-if="selectedStudent?.quran_class">
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
              class="grid grid-cols-4 justify-between items-center gap-2 py-2 place-items-center"
            >
              <span class="font-bold">{{
                selectedStudent?.quran_class.title
              }}</span>
              <span class="font-bold">{{
                selectedStudent?.quran_class.group
              }}</span>
              <span class="font-bold">{{
                selectedStudent?.quran_class.floor
              }}</span>
              <span class="font-bold">{{
                selectedStudent?.quran_class.wing
              }}</span>
            </li>
          </ul>
        </div>
        <p v-else>لم يتم تعيين صف بعد</p>
      </div>
      <div v-if="selectedFlag === 'fees'">
        <div v-if="selectedStudent?.months_fees" class="text-sm">
          <div
            v-if="selectedStudent.months_fees?.length"
            class="border border-accented rounded-tr-lg rounded-tl-lg"
          >
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
                  v-for="fee in selectedStudent.months_fees"
                  :key="fee.id"
                >
                  <span>{{ getArabicDayName(fee.created_at ?? "") }}</span>
                  <span>{{ getDate(fee.created_at ?? "") }}</span>
                  <span>{{
                    fee.updated_at ? getDate(fee.updated_at) : "لم يتم التحديث"
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
          <p v-else>لم يتم دفع رسوم بعد</p>
        </div>
      </div>
      <div v-if="selectedFlag === 'plan'">
        <div v-if="selectedStudent?.quran_achievement_reports" class="text-sm">
          <div
            v-if="selectedStudent.quran_achievement_reports?.length"
            class="border border-accented rounded-tr-lg rounded-tl-lg"
          >
            <h3
              class="font-bold text-sm text-center py-2 rounded-tr-md rounded-tl-md bg-accented"
            >
              تفاصيل خطة الطالب
            </h3>
            <div class="px-2">
              <ul>
                <li
                  class="grid grid-cols-4 justify-between items-center gap-2 border-b py-2 place-items-center"
                >
                  <!-- <span class="font-bold">يوم الدفع</span> -->
                  <span class="font-bold">التاريخ</span>
                  <span class="font-bold">الصفحات المطلوبة</span>
                  <span class="font-bold">الصفحات المنجزة</span>
                  <span class="font-bold">الحالة</span>
                </li>
                <li
                  class="grid grid-cols-4 justify-between items-center gap-2 py-2 place-items-center not-last:border-b border-gray-400 not-last:border-dashed"
                  v-for="report in selectedStudent.quran_achievement_reports"
                  :key="report.id"
                >
                  <span>
                    {{ report.month_plan?.month?.name }} -
                    {{ report.month_plan?.month?.id }}
                  </span>
                  <span>{{ getRequiredPages(report) }}</span>
                  <span>{{ report.achieved_pages }}</span>
                  <UBadge
                    :color="report.status === 'مكتمل' ? 'success' : 'error'"
                    :label="report.status"
                  >
                  </UBadge>
                </li>
              </ul>
            </div>
          </div>
          <p v-else>لم يتم إضافة تقرير إنجاز بعد</p>
        </div>
      </div>
      <div v-if="selectedFlag === 'move_academic_class'">
        <UForm
          :schema="schema"
          :state="{ selectedClassId }"
          class="space-y-4"
          @submit="emit('submit')"
        >
          <UFormField label="اختر الصف الدراسي" required name="classId">
            <USelect
              class="w-full"
              :model-value="selectedClassId"
              @update:model-value="emit('update:selectedClassId', $event)"
              :items="
                academicClasses.map((c) => ({
                  label: `${c.title} - شعبة ${c.group}`,
                  value: c.id,
                }))
              "
              placeholder="اختر الصف الدراسي"
            />
          </UFormField>
          <div class="flex gap-3 items-center">
            <UButton
              type="submit"
              label="نقل"
              color="secondary"
              :loading="props.loading"
              class="w-30 flex justify-center mt-5 hover:cursor-pointer font-bold"
            />
            <UButton
              label="إلغاء"
              color="neutral"
              variant="soft"
              class="w-30 flex justify-center mt-5 hover:cursor-pointer"
              @click="emit('update:showModal', false)"
            />
          </div>
        </UForm>
      </div>
      <div v-if="selectedFlag === 'move_quran_class'">
        <UForm
          :schema="schema"
          :state="{ selectedClassId }"
          class="space-y-4"
          @submit="emit('submit')"
        >
          <UFormField label="اختر صف القرآن" required name="classId">
            <USelect
              class="w-full"
              :model-value="selectedClassId"
              @update:model-value="emit('update:selectedClassId', $event)"
              :items="
                quranClasses.map((c) => ({
                  label: `${c.title} - شعبة ${c.group}`,
                  value: c.id,
                }))
              "
              placeholder="اختر صف القرآن"
            />
          </UFormField>
          <div class="flex gap-3 items-center">
            <UButton
              type="submit"
              label="نقل"
              color="secondary"
              :loading="props.loading"
              class="w-30 flex justify-center mt-5 hover:cursor-pointer font-bold"
            />
            <UButton
              label="إلغاء"
              color="neutral"
              variant="soft"
              class="w-30 flex justify-center mt-5 hover:cursor-pointer"
              @click="emit('update:showModal', false)"
            />
          </div>
        </UForm>
      </div>
      <div v-if="selectedFlag === 'assign_plan'">
        <UForm
          :schema="assignPlanSchema"
          :state="{ selectedPlanId: selectedPlan?.value }"
          class="space-y-4"
          @submit="emit('submit')"
        >
          <UFormField label="اختر الخطة" required name="planId">
            <USelectMenu
              class="w-full"
              :model-value="selectedPlan"
              @update:model-value="emit('update:selectedPlan', $event)"
              icon="i-lucide-map"
              :items="
                plans.map((plan) => ({
                  label: `${plan.semester} ${plan.year} - ${plan.students_type} - ${plan.stage} - عدد الصفحات: ( ${plan.total_pages} )`,
                  value: plan.id,
                }))
              "
              placeholder="اختر الخطة"
            />
          </UFormField>
          <div class="flex gap-3 items-center">
            <UButton
              type="submit"
              label="تعيين"
              color="secondary"
              :loading="props.loading"
              class="w-30 flex justify-center mt-5 hover:cursor-pointer font-bold"
            />
            <UButton
              label="إلغاء"
              color="neutral"
              variant="soft"
              class="w-30 flex justify-center mt-5 hover:cursor-pointer"
              @click="emit('update:showModal', false)"
            />
          </div>
        </UForm>
      </div>
    </template>
  </UModal>
</template>
