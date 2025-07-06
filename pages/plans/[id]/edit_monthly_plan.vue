<script setup lang="ts">
import { number, object, string } from "yup";
import { usePlansStore } from "@/stores/plans";
import { months } from "~/constants";

const plansStore = usePlansStore();

const schema = object({
  month: string().required("الشهر مطلوب"),
  pages: number().required("عدد الصفحات مطلوبة"),
});

const state = reactive({
  month: undefined as string | undefined,
  pages: undefined as number | undefined,
});
const route = useRoute();
const generalPlanId = +route.params.id;

const form = ref();

const onSubmit = async () => {
  console.log(state);
  await plansStore.addMonthlyPlan(generalPlanId, state);
  navigateTo({ name: "plans" });
};
</script>

<template>
  <UCard class="max-w-3xl mx-auto mt-15">
    <UForm
      ref="form"
      :schema="schema"
      :state="state"
      class="grid grid-cols-1 md:grid-cols-2 gap-4"
      @submit="onSubmit"
    >
      <UFormField label="الشهر" name="month">
        <USelect
          :items="months"
          v-model="state.month"
          placeholder="الشهر"
          label="الشهر"
          class="w-full"
        />
      </UFormField>
      <UFormField label="عدد الصفحات" name="pages">
        <UInput
          type="number"
          v-model="state.pages"
          placeholder="عدد الصفحات"
          label="عدد الصفحات"
          class="w-full"
        />
      </UFormField>

      <div class="md:col-span-2 flex gap-2 mt-5">
        <UButton
          type="submit"
          class="flex w-40 py-2 justify-center font-bold lg:col-span-2 hover:cursor-pointer"
          color="secondary"
          label="إضافة"
          :loading="plansStore.loading"
        />
        <UButton
          variant="soft"
          class="flex w-20 py-2 justify-center font-bold lg:col-span-2 hover:cursor-pointer"
          color="secondary"
          @click="navigateTo({ name: 'plans' })"
          label="إلغاء"
        />
      </div>
    </UForm>
  </UCard>
</template>

<style scoped></style>
