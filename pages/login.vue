<script setup lang="ts">
import { object, string, type InferType } from "yup";
import type { FormSubmitEvent } from "@nuxt/ui";
type Schema = InferType<typeof schema>;

const client = useSupabaseClient();
const { toastError, toastSuccess } = useAppToast();
const show = ref(false);
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

const strength = computed(() => checkStrength(state.password));
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
const schema = object({
  email: string().email("الإيميل غير صالح").required("الإيميل مطلوب"),
  password: string()
    .min(8, "يجب أن تكون 8 أحرف على الأقل")
    .required("كلمة السر مطلوبة"),
});

const state = reactive({
  email: "",
  password: "",
});
const loading = ref(false);

onMounted(async () => {
  await client.auth.getSession();
  navigateTo("/");
});

definePageMeta({
  layout: "auth",
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  loading.value = true;
  try {
    const { error } = await client.auth.signInWithPassword({
      email: state.email || "",
      password: state.password || "",
    });

    if (error) {
      throw new Error(error.message);
    }
    toastSuccess({ title: "تم تسجيل الدخول بنجاح" });
    navigateTo({ name: "auth-callback" });
  } catch (error) {
    toastError({
      title: "فشل تسجيل الدخول",
      description: error.message,
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
        تسجيل الدخول لموقع المدرسة
      </h1>
      <UFormField label="الإيميل" name="email" required>
        <UInput v-model="state.email" class="w-full" />
      </UFormField>

      <UFormField label="كلمة السر" name="password" required>
        <UInput
          v-model="state.password"
          :type="show ? 'text' : 'password'"
          class="w-full"
        >
          <template #trailing>
            <UButton
              color="neutral"
              variant="link"
              size="sm"
              :icon="show ? 'i-lucide-eye-off' : 'i-lucide-eye'"
              :aria-label="show ? 'Hide password' : 'Show password'"
              :aria-pressed="show"
              aria-controls="password"
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

      <p id="password-strength" class="text-sm font-medium flex justify-end">
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

          <span class="text-sm font-light">
            {{ req.text }}
            <span class="sr-only">
              {{ req.met ? " - Requirement met" : " - Requirement not met" }}
            </span>
          </span>
        </li>
      </ul>
      <UButton
        type="submit"
        class="w-full flex justify-center hover:cursor-pointer"
        color="secondary"
        :loading="loading"
      >
        تسجيل الدخول
      </UButton>
    </UForm>
  </UCard>
</template>
