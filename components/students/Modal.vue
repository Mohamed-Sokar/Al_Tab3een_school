<script setup lang="ts">
import type { Student, StudentModalFlag } from "~/types";
// import { useAcademicClassesStore } from "@/stores/academic_classes";
// import { useQuranClassesStore } from "@/stores/quran_classes";
// import { usePlansStore } from "@/stores/plans";
import { object, number } from "yup";

import {
  toDate,
  getMonthAchievedPages,
  isPlanAchieved,
  getAchievementColor,
} from "~/composables/studentUtils";

const { getArabicDayName } = useDateUtils();
// تعريف schema للنماذج
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

// المتاجر
const academicClassesStore = useAcademicClassesStore();
const quranClassesStore = useQuranClassesStore();
const plansStore = usePlansStore();

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
</script>

<template>
  <UModal :title="modelTitle" class="min-w-3xl" v-model:open="isOpen">
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
      <div v-if="selectedFlag === 'plan'">
        <div v-if="selectedStudent?.plan" class="text-sm">
          <div
            v-if="selectedStudent.plan.months_plans?.length"
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
                  v-for="plan in selectedStudent.plan.months_plans"
                  :key="plan.id"
                >
                  <span>{{ plan.month }}</span>
                  <span>{{ plan.pages }}</span>
                  <span>{{
                    getMonthAchievedPages(plan.month ?? "", selectedStudent)
                  }}</span>
                  <UBadge
                    :color="
                      getAchievementColor(
                        plan.month ?? '',
                        plan.pages ?? 0,
                        selectedStudent
                      )
                    "
                  >
                    {{
                      isPlanAchieved(
                        plan.pages ?? 0,
                        getMonthAchievedPages(plan.month ?? "", selectedStudent)
                      )
                        ? "مكتمل"
                        : "غير مكتمل"
                    }}
                  </UBadge>
                </li>
              </ul>
            </div>
          </div>
          <p v-else>لم يتم تعيين خطة بعد</p>
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
