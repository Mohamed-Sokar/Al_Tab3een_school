<template>
  <UCard class="max-w-3xl mx-auto mt-15">
    <UForm
      ref="form"
      :schema="schema"
      :state="state"
      class="grid grid-cols-1 lg:grid-cols-2 gap-4"
      @submit="onSubmit"
    >
      <UFormField label="الصف الدراسي" name="title">
        <USelect
          :items="level_options"
          v-model="state.title"
          placeholder="الصف الدراسي"
          label="الصف الدراسي"
          class="w-full"
        />
      </UFormField>
      <UFormField label="السعة القصوى" name="maximumCapacity">
        <UInput
          type="number"
          v-model.number="state.maximumCapacity"
          placeholder="السعة القصوى"
          label="السعة القصوى"
          class="w-full"
        />
      </UFormField>
      <UFormField label="الرسوم الشهرية" name="fees">
        <UInput
          type="number"
          v-model.number="state.fees"
          placeholder="الرسوم الشهرية"
          label="الرسوم الشهرية"
          class="w-full"
        />
      </UFormField>

      <div class="col-span-2 flex gap-2 mt-5">
        <UButton
          type="submit"
          class="flex w-40 py-2 justify-center font-bold lg:col-span-2 hover:cursor-pointer"
          color="secondary"
          :loading="isLoading"
          label="تعديل"
        />
        <UButton
          variant="soft"
          class="flex w-20 py-2 justify-center font-bold lg:col-span-2 hover:cursor-pointer"
          color="secondary"
          @click="navigateTo('/levels')"
          label="إلغاء"
        />
      </div>
    </UForm>
  </UCard>
</template>

<script setup lang="ts">
import { object, string, number } from "yup";
import { level_options } from "~/constants";
import type { Level } from "~/types";
import { useLevelsStore } from "@/stores/levels";

const { levelsData, addLevel, getSpecificLevel, getSpecificLevelIndex } =
  useLevelsStore();

const schema = object({
  title: string().required("الصف الدراسي مطلوب"),
  maximumCapacity: number().required("السعة القصوى مطلوبة"),
  fees: number().required("الرسوم مطلوبة"),
});

const state = reactive<Level>({
  id: undefined,
  title: undefined,
  maximumCapacity: undefined,
  fees: undefined,
  studentsCount: 50,
});

const { toastSuccess } = useAppToast();
const isLoading = ref(false);
const form = ref();

const onSubmit = async () => {
  isLoading.value = true;
  addLevel({ ...state });

  setTimeout(() => {
    isLoading.value = false;
    toastSuccess({
      title: "تم إضافة المستوى بنجاح",
    });
    navigateTo("/levels");
  }, 500);
};
</script>

<style scoped></style>
