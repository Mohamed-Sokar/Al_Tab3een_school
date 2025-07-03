<template>
  <UCard class="max-w-3xl mx-auto mt-15">
    <UForm
      ref="form"
      :schema="schema"
      :state="state"
      class="grid grid-cols-1 md:grid-cols-2 gap-y-1 gap-x-4"
      @submit="onSubmit"
    >
      <UFormField required label="الاسم" name="name">
        <UInput
          v-model="state.name"
          placeholder="الاسم"
          label="الاسم"
          class="w-full"
        />
      </UFormField>
      <UFormField required label="رقم الجوال" name="phone_no">
        <UInput
          type="number"
          v-model="state.phone_no"
          placeholder="رقم الجوال"
          label="رقم الجوال"
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
      <UFormField required label="العنوان" name="address">
        <UInput
          v-model="state.address"
          placeholder="العنوان"
          label="العنوان"
          class="w-full"
        />
      </UFormField>
      <UFormField required label="نوع السيارة" name="car_type">
        <UInput
          v-model="state.car_type"
          placeholder="نوع السيارة"
          label="نوع السيارة"
          class="w-full"
        />
      </UFormField>
      <UFormField required label="لون السيارة" name="car_color">
        <UInput
          v-model="state.car_color"
          placeholder="لون السيارة"
          label="لون السيارة"
          class="w-full"
        />
      </UFormField>

      <div class="md:col-span-2 flex flex-wrap gap-2 mt-5">
        <UButton
          type="submit"
          class="flex w-full md:w-40 py-2 justify-center font-bold lg:col-span-2 hover:cursor-pointer"
          color="secondary"
          :loading="driversStore.loading"
          label="إضافة"
        />
        <UButton
          variant="soft"
          class="flex w-full md:w-20 py-2 justify-center font-bold lg:col-span-2 hover:cursor-pointer"
          color="secondary"
          @click="navigateTo({ name: 'drivers' })"
          label="إلغاء"
        />
      </div>
    </UForm>
  </UCard>
</template>

<script setup lang="ts">
import { object, string, number } from "yup";
import type { Driver } from "~/types";
import { useDriversStore } from "@/stores/drivers";

const driversStore = useDriversStore();

const schema = object({
  name: string().required("الاسم مطلوب"),
  phone_no: string().required("رقم الجوال مطلوب"),
  maximum_capacity: number().required("القيمة القصوى مطلوبة"),
  car_type: string().required("نوع السيارة مطلوبة"),
  car_color: string().required("لون السيارة مطلوبة"),
  address: string().required("العنوان مطلوب"),
});

const state = reactive<Driver>({
  // id: undefined,
  name: undefined,
  maximum_capacity: undefined,
  phone_no: undefined,
  car_type: undefined,
  car_color: undefined,
  address: undefined,
});

const form = ref();

const onSubmit = async () => {
  await driversStore.addDriver({ ...state });
  navigateTo({ name: "drivers" });
};
</script>

<style scoped></style>
