<template>
  <UForm :state="state" :schema="schema" @submit="saveSettings">
    <UFormField label="الوضع" class="mb-4" help="اختر الوضع الذي تفضل">
      <USelect v-model="state.color_mode" :items="modeOptions" class="w-40" />
    </UFormField>

    <UButton
      type="submit"
      label="Save"
      :loading="pending"
      :disabled="pending"
    />
  </UForm>
</template>

<script setup lang="ts">
type Schema = InferType<typeof schema>;
import { object, string, type InferType } from "yup";
import type { FormSubmitEvent } from "@nuxt/ui";
import { modeOptions } from "~/constants";

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const colorMode = useColorMode();
const { toastSuccess, toastError } = useAppToast();
const pending = ref(false);

const state = ref({
  // color_mode: user.value?.user_metadata?.color_mode ?? modeOptions.value[0],
  color_mode: colorMode.preference,
});

watch(state.value, () => (colorMode.preference = state.value.color_mode));
const schema = object({});

const saveSettings = async (event: FormSubmitEvent<Schema>) => {
  pending.value = true;

  // try {
  //   const { error } = await supabase.auth.updateUser({
  //     data: {
  //       transaction_view: state.value.transactionView,
  //       color_mode: state.value.color_mode,
  //     },
  //   });
  //   if (error) throw error;
  //   toastSuccess({
  //     title: "Settings updated",
  //   });
  // } catch (error: any) {
  //   toastError({
  //     title: "Error updating settings",
  //     description: error.message,
  //   });
  // } finally {
  //   pending.value = false;
  // }
};

watch(
  user,
  () => (colorMode.preference = user.value?.user_metadata?.color_mode)
);
</script>

<style scoped></style>
