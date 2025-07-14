<template>
  <div>
    <h2 class="mb-4 font-bold">تغيير الحساب</h2>
    <UCard class="mb-5">
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="saveEmail"
      >
        <UFormField label="الحساب الحالي" name="currentEmail">
          <UInput
            v-model="state.currentEmail"
            class="w-full"
            placeholder="الحساب الحالي"
          />
        </UFormField>
        <UFormField
          label="الحساب الجديد"
          name="newEmail"
          description="بعد الحفظ سيصلك إيميل على حسابك الجديد لتأكيد العملية"
        >
          <UInput
            v-model="state.newEmail"
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
import { object, string } from "yup";
const { toastError, toastSuccess } = useAppToast();

const user = useSupabaseUser();
const supabase = useSupabaseClient();
const pending = ref(false);
const redirectUrl = useRuntimeConfig().public.baseUrl;

const schema = object({
  currentEmail: string().email("إيميل غير صالح").required("الإيميل مطلوب"),
  newEmail: string().email("إيميل غير صالح").required("الإيميل مطلوب"),
});
const state = reactive({
  currentEmail: user.value?.email || "",
  newEmail: "",
});
const saveEmail = async () => {
  pending.value = true;
  try {
    const { data, error } = await supabase.auth.updateUser(
      { email: state.newEmail },
      {
        emailRedirectTo: `${redirectUrl}/auth/email-change-callback`,
      }
    );
    if (error) throw error;

    console.log(data);
    toastSuccess({
      title: "تم تغيير الحساب بنجاح",
    });
  } catch (error) {
    toastError({
      title: "حدث خطأ في تغيير الحساب",
      description: (error as Error).message,
    });
  } finally {
    pending.value = false;
  }
};
</script>

<style scoped></style>
