<template>
  <UCard>
    <div class="flex justify-between items-center">
      <div>
        <p>الوضع المظلم</p>
        <p class="text-muted text-sm">تفعيل الوضع المظلم للنظام</p>
      </div>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <USwitch
          name="mode"
          color="secondary"
          unchecked-icon="i-lucide-sun"
          checked-icon="i-lucide-moon"
          v-model="state.mode"
          @change="onSubmit"
        />

        <!-- <UButton type="submit" :loading="pending" color="secondary">
          حفظ
        </UButton> -->
      </UForm>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { object, boolean } from "yup";
const colorMode = useColorMode();
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const pending = ref(false);
const { toastError, toastSuccess } = useAppToast();

const schema = object({
  mode: boolean().required("الوضع مطلوب"),
});

const state = reactive({
  mode: user.value?.user_metadata?.mode === "dark",
});

const onSubmit = async () => {
  pending.value = true;
  const newMode = state.mode ? "dark" : "light";
  try {
    // ✅ تحديث اللون المحلي
    colorMode.preference = newMode;

    // ✅ تحديث metadata في Supabase
    const { error } = await supabase.auth.updateUser({
      data: {
        mode: newMode,
      },
    });
    if (error) throw error;
    toastSuccess({
      title: "تم تغيير الوضع بنجاح",
    });
  } catch (error) {
    toastError({
      title: "خطأ في تغيير الوضع",
      description: error instanceof Error ? error.message : String(error),
    });
  } finally {
    pending.value = false;
  }
};
</script>
