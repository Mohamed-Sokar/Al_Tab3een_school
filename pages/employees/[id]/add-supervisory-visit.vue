<script setup lang="ts">
import { object, string, date } from "yup";
import { useTeachersStore } from "@/stores/teachers";
import type { SupervisoryVisitTeacher } from "~/types";

const teachersStore = useTeachersStore();
// const { getDate } = useDateUtils();
const route = useRoute();
const form = ref();
const teacherId = Array.isArray(route.params.id)
  ? route.params.id[0]
  : route.params.id ?? "";

const schema = object({
  notes: string().required("الملاحظات مطلوبة"),
  date: date().required("التاريخ مطلوب"),
  supervisor: string().required("المشرف الزائر مطلوب"),
  type: string().required("نوع الزيارة مطلوبة"),
});

const state = reactive<SupervisoryVisitTeacher>({
  notes: undefined,
  date: new Date(),
  type: undefined,
  supervisor: undefined,
});

const onSubmit = async () => {
  await teachersStore.addSupervisoryVisit(teacherId, state);
  navigateTo({ name: "teachers-view-supervisory_visits" });
};

const date_string = computed({
  get() {
    if (!state.date) return "";
    if (typeof state.date === "string") {
      // If already in YYYY-MM-DD format, return as is
      if (/^\d{4}-\d{2}-\d{2}$/.test(state.date)) {
        return state.date;
      }
      // Try to parse and format
      const d = new Date(state.date);
      if (!isNaN(d.getTime())) {
        return d.toISOString().slice(0, 10);
      }
      return "";
    }
    if (state.date instanceof Date) {
      return state.date.toISOString().slice(0, 10);
    }
    return "";
  },
  set(val: Date) {
    state.date = val;
  },
});
</script>

<template>
  <UCard class="max-w-3xl mx-auto mt-15">
    <UForm
      ref="form"
      :schema="schema"
      :state="state"
      class="grid grid-cols-1 md:grid-cols-2 gap-2"
      @submit="onSubmit"
    >
      <UFormField label="تاريخ الزيارة" name="date">
        <UInput type="date" v-model="date_string" class="w-full mt-2" />
      </UFormField>
      <UFormField label="المشرف الزائر" name="supervisor">
        <UInput
          v-model="state.supervisor"
          placeholder="أدخل وصف المشرف الزائر..."
          label="وصف المشرف الزائر"
          class="w-full mt-2"
        />
      </UFormField>
      <UFormField label="نوع الزيارة" name="type">
        <UInput
          v-model="state.type"
          placeholder="أدخل وصف نوع الزيارة..."
          label="وصف نوع الزيارة"
          class="w-full mt-2"
        />
      </UFormField>
      <UFormField label="الملاحظات" name="notes" class="md:col-span-2">
        <UTextarea
          v-model="state.notes"
          placeholder="أدخل وصف الملاحظات..."
          label="وصف الملاحظات"
          class="w-full mt-2"
          :rows="5"
        />
      </UFormField>

      <div class="md:col-span-2 flex gap-2 mt-5">
        <UButton
          type="submit"
          class="flex w-40 py-2 justify-center font-bold lg:col-span-2 hover:cursor-pointer"
          color="secondary"
          label="إضافة"
          :loading="teachersStore.loading"
        />
        <UButton
          variant="soft"
          class="flex w-20 py-2 justify-center font-bold lg:col-span-2 hover:cursor-pointer"
          color="secondary"
          @click="navigateTo({ name: 'teachers-view-teachers_table' })"
          label="إلغاء"
        />
      </div>
    </UForm>
  </UCard>
</template>

<style scoped></style>
