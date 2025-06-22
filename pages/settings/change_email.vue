<template>
  <div>
    <h2 class="mb-4 font-bold">تغيير الحساب</h2>
    <UCard class="mb-5">
      <UForm
        :schema="emailSchema"
        :state="emailState"
        class="space-y-4"
        @submit="saveEmail"
      >
        <UFormField label="الحساب الحالي" name="currentEmail">
          <UInput
            v-model="emailState.currentEmail"
            class="w-full"
            placeholder="الحساب الحالي"
          />
        </UFormField>
        <UFormField label="الحساب الجديد" name="newEmail">
          <UInput
            v-model="emailState.newEmail"
            class="w-full"
            placeholder="الحساب الجديد"
          />
        </UFormField>

        <UButton type="submit" :loading="pending" color="secondary">
          حفظ
        </UButton>
      </UForm>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { object, string, type InferType } from "yup";
import type { FormSubmitEvent } from "@nuxt/ui";
type EmailSchema = InferType<typeof emailSchema>;

const user = useSupabaseUser();
const pending = ref(false);

const emailSchema = object({
  currentEmail: string().email("Invalid email").required("Required"),
  newEmail: string().email("Invalid email").required("Required"),
});
const emailState = reactive({
  currentEmail: user.value?.email || "",
  newEmail: "",
});

const saveEmail = async (event: FormSubmitEvent<EmailSchema>) => {
  console.log("Save Email");
};
</script>

<style scoped></style>
