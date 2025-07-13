<script setup lang="ts">
import { object, string, ref as yupRef, type InferType } from "yup";
import type { FormSubmitEvent } from "@nuxt/ui";

const client = useSupabaseClient();
const { toastError, toastSuccess } = useAppToast();

const show = ref(false);
const loading = ref(false);

// ✅ مخطط التحقق
const schema = object({
  newPassword: string()
    .min(8, "يجب أن تكون 8 أحرف على الأقل")
    .required("كلمة السر الجديدة مطلوبة"),
  confirmNewPassword: string()
    .oneOf([yupRef("newPassword")], "كلمة المرور غير متطابقة")
    .required("تأكيد كلمة المرور مطلوب"),
});

type Schema = InferType<typeof schema>;

const state = reactive({
  newPassword: "",
  confirmNewPassword: "",
});

// ✅ التحقق من قوة كلمة المرور
function checkStrength(str: string) {
  const requirements = [
    { regex: /.{8,}/, text: "على الأقل 8 حروف" },
    { regex: /\d/, text: "على الأقل 1 رقم" },
    { regex: /[a-z]/, text: "على الأقل 1 حرف صغير" },
    { regex: /[A-Z]/, text: "على الأقل 1 حرف كبير" },
  ];

  return requirements.map((req) => ({
    met: req.regex.test(str),
    text: req.text,
  }));
}

const strength = computed(() => checkStrength(state.newPassword));
const score = computed(() => strength.value.filter((req) => req.met).length);

const color = computed(() => {
  if (score.value === 0) return "neutral";
  if (score.value <= 1) return "error";
  if (score.value <= 2) return "warning";
  if (score.value === 3) return "warning";
  return "success";
});

const text = computed(() => {
  if (score.value === 0) return "أدخل كلمة السر";
  if (score.value <= 2) return "كلمة سر ضعيفة";
  if (score.value === 3) return "كلمة سر متوسطة";
  return "كلمة سر قوية";
});

// ✅ عند الإرسال
async function onSubmit(event: FormSubmitEvent<Schema>) {
  loading.value = true;
  try {
    const { error, data } = await client.auth.updateUser({
      password: state.newPassword,
    });
    console.log(data);
    if (error) {
      throw new Error(error.message);
    }

    toastSuccess({ title: "تم تغيير كلمة المرور بنجاح" });
    state.newPassword = "";
    state.confirmNewPassword = "";
  } catch (error) {
    toastError({
      title: "فشل تغيير كلمة المرور",
      description: error instanceof Error ? error.message : String(error),
    });
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <UCard class="max-w-3xl mx-auto hover:shadow-2xl transition-all p-10">
    <UForm :schema="schema" :state="state" class="space-y-2" @submit="onSubmit">
      <h1 class="flex justify-center mb-10 font-bold text-3xl">
        تغيير كلمة المرور
      </h1>

      <UFormField label="كلمة السر الجديدة" name="newPassword" required>
        <UInput
          v-model="state.newPassword"
          :type="show ? 'text' : 'password'"
          class="w-full"
          placeholder="كلمة السر الجديدة"
        >
          <template #trailing>
            <UButton
              color="neutral"
              variant="link"
              size="sm"
              :icon="show ? 'i-lucide-eye-off' : 'i-lucide-eye'"
              :aria-label="show ? 'إخفاء' : 'إظهار'"
              :aria-pressed="show"
              @click="show = !show"
            />
          </template>
        </UInput>
      </UFormField>

      <UProgress
        :color="color"
        :indicator="text"
        :model-value="score"
        :max="4"
        size="sm"
      />

      <p class="text-sm font-medium flex justify-end">
        {{ text }}
      </p>

      <ul class="space-y-1" aria-label="Password requirements">
        <li
          v-for="(req, index) in strength"
          :key="index"
          class="flex items-center gap-0.5 justify-end"
          :class="req.met ? 'text-success' : 'text-muted'"
        >
          <UIcon
            :name="req.met ? 'i-lucide-circle-check' : 'i-lucide-circle-x'"
            class="size-4 shrink-0"
          />
          <span class="text-sm font-light">{{ req.text }}</span>
        </li>
      </ul>

      <UFormField
        label="تأكيد كلمة السر الجديدة"
        name="confirmNewPassword"
        required
      >
        <UInput
          type="password"
          v-model="state.confirmNewPassword"
          class="w-full"
          placeholder="تأكيد كلمة السر الجديدة"
        />
      </UFormField>

      <UButton
        type="submit"
        class="w-full flex justify-center hover:cursor-pointer"
        color="secondary"
        :loading="loading"
      >
        حفظ
      </UButton>
    </UForm>
  </UCard>
</template>
