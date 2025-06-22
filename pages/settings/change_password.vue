<script setup lang="ts">
import { object, string, type InferType } from "yup";
import type { FormSubmitEvent } from "@nuxt/ui";
type PasswordSchema = InferType<typeof schema>;

const pending = ref(false);

const schema = object({
  oldPassword: string()
    .min(6, "String must contain at least 6 charachter")
    .required("Required"),
  newPassword: string()
    .min(6, "Password must contain at least 6 charachter")
    .required("Required"),
  confirmNewPassword: string()
    .min(6, "Password must contain at least 6 charachter")
    .required("Required"),
});
const state = reactive({
  oldPassword: "",
  newPassword: "",
  confirmNewPassword: "",
});

const savePassword = async (event: FormSubmitEvent<PasswordSchema>) => {
  console.log("Save Password");
};
</script>

<template>
  <div>
    <h2 class="mb-4 font-bold">تغيير كلمة السر</h2>
    <UCard>
      <UForm
        :key="Math.random()"
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="savePassword"
      >
        <UFormField label="كلمة السر القديمة" name="oldPassword">
          <UInput
            v-model="state.oldPassword"
            class="w-full"
            placeholder="كلمة السر القديمة"
          />
        </UFormField>
        <UFormField label="كلمة السر الجديدة" name="newPassword">
          <UInput
            type="password"
            v-model="state.newPassword"
            class="w-full"
            placeholder="كلمة السر الجديدة"
          />
        </UFormField>
        <UFormField label="تأكيد كلمة السر الجديدة" name="confirmNewPassword">
          <UInput
            type="password"
            v-model="state.confirmNewPassword"
            class="w-full"
            placeholder="تأكيد كلمة السر الجديدة"
          />
        </UFormField>

        <UButton type="submit" :loading="pending" color="secondary">
          حفظ
        </UButton>
      </UForm>
    </UCard>
  </div>
</template>

<style scoped></style>
