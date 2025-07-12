<script setup lang="ts">
import { object, string, type InferType } from "yup";
import type { FormSubmitEvent } from "@nuxt/ui";
type Schema = InferType<typeof schema>;
const { toastError, toastSuccess } = useAppToast();

type Data = {
  email?: string;
  data: {
    full_name: string | null;
    school_name: string | null;
  };
};
const user = useSupabaseUser();
const supabase = useSupabaseClient();
const pending = ref(false);

const schema = object({
  full_name: string()
    .min(2, "الاسم يجب أن يكون على الأقل 2 أحرف")
    .required("الاسم مطلوب"),
  school_name: string()
    .min(2, "الاسم يجب أن يكون على الأقل 2 أحرف")
    .required("الاسم مطلوب"),
});
const state = reactive({
  full_name: user.value?.user_metadata?.full_name || "",
  school_name: user.value?.user_metadata?.school_name || "",
});

const saveProfile = async (event: FormSubmitEvent<Schema>) => {
  pending.value = true;
  try {
    const data: Data = {
      data: {
        full_name: state.full_name,
        school_name: state.school_name,
      },
    };
    const { error } = await supabase.auth.updateUser(data);
    if (error) throw error;

    toastSuccess({
      title: "تم تغيير الاسم بنجاح",
    });
  } catch (error) {
    toastError({
      title: "خطأ في تغيير الاسم",
      description: error instanceof Error ? error.message : String(error),
    });
  } finally {
    pending.value = false;
  }
};
</script>

<template>
  <div>
    <h2 class="mb-4 font-bold">تغيير المعلومات الشخصية</h2>
    <UCard class="mb-5">
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="saveProfile"
      >
        <UFormField label="الاسم الرباعي" name="full_name">
          <UInput
            v-model="state.full_name"
            class="w-full"
            placeholder="الاسم الرباعي"
          />
        </UFormField>
        <UFormField label="اسم المدرسة" name="school_name">
          <UInput
            v-model="state.school_name"
            class="w-full"
            placeholder="اسم المدرسة"
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
