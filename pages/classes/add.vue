<template>
  <UCard class="max-w-3xl mx-auto mt-15">
    <UForm
      ref="form"
      :schema="schema"
      :state="state"
      class="grid grid-cols-1 md:grid-cols-2 gap-y-1 gap-x-4"
      @submit="onSubmit"
    >
      <UFormField required label="الصف الدراسي" name="title">
        <USelect
          :items="isAcademic ? level_options : quran_classes_options"
          v-model="state.title"
          placeholder="الصف الدراسي"
          label="الصف الدراسي"
          class="w-full"
        />
      </UFormField>
      <UFormField required label="الشعبة" name="group">
        <USelect
          :items="class_group_options"
          v-model="state.group"
          placeholder="الشعبة"
          label="الشعبة"
          class="w-full"
        />
      </UFormField>
      <UFormField required label="السعة القصوى" name="maximum_capacity">
        <UInput
          type="number"
          v-model.number="state.maximum_capacity"
          placeholder="السعة القصوى"
          label="السعة القصوى"
          class="w-full"
        />
      </UFormField>
      <UFormField required label="الطابق" name="floor">
        <USelect
          :items="class_floor_options"
          v-model="state.floor"
          placeholder="الطابق"
          label="الطابق"
          class="w-full"
        />
      </UFormField>
      <UFormField required label="الجهة" name="wing">
        <USelect
          :items="class_wing_options"
          v-model="state.wing"
          placeholder="الجهة"
          label="الجهة"
          class="w-full"
        />
      </UFormField>

      <div class="md:col-span-2 flex flex-wrap gap-2 mt-5">
        <UButton
          type="submit"
          class="flex w-full md:w-40 py-2 justify-center font-bold lg:col-span-2 hover:cursor-pointer"
          color="secondary"
          :loading="isLoading"
          label="إضافة"
        />
        <UButton
          variant="soft"
          class="flex w-full md:w-20 py-2 justify-center font-bold lg:col-span-2 hover:cursor-pointer"
          color="secondary"
          @click="
            navigateTo({
              name: isAcademic
                ? 'classes-view-academic_classes'
                : 'classes-view-quran_classes',
            })
          "
          label="إلغاء"
        />
      </div>
    </UForm>
  </UCard>
</template>

<script setup lang="ts">
import { object, string, number } from "yup";
import {
  class_floor_options,
  class_group_options,
  class_wing_options,
  level_options,
  quran_classes_options,
} from "~/constants";
import type { Class } from "~/types";
import { useAcademicClassesStore } from "@/stores/academic_classes";
import { useQuranClassesStore } from "@/stores/quran_classes";

const academicClassesStore = useAcademicClassesStore();
const quranClassesStore = useQuranClassesStore();

const schema = object({
  title: string().required("الصف الدراسي مطلوب"),
  wing: string().required("الجهة مطلوبة"),
  floor: string().required("الطابق مطلوب"),
  group: string().required("الطابق مطلوب"),
  maximum_capacity: number().required("السعة القصوى مطلوبة"),
});

const state = reactive<Class>({
  // id: undefined,
  title: undefined,
  maximum_capacity: undefined,
  wing: undefined,
  floor: undefined,
  group: undefined,
});

const form = ref();
const route = useRoute();
const isAcademic = route.query.classType === "academic";
const isLoading = ref(false);

const onSubmit = async () => {
  isLoading.value = true;
  if (isAcademic) {
    await academicClassesStore.addClass({ ...state });
    await academicClassesStore.fetchClasses();
  } else {
    await quranClassesStore.addClass({ ...state });
    await quranClassesStore.fetchClasses();
  }
  isLoading.value = false;

  navigateTo({
    name: isAcademic
      ? "classes-view-academic_classes"
      : "classes-view-quran_classes",
  });
};
</script>

<style scoped></style>
