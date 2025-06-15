<template>
  <UForm
    :schema="schema"
    :state="state"
    class="space-y-4"
    @submit="SaveProfile"
  >
    <UFormField label="Full Name" name="name">
      <UInput
        v-model="state.name"
        type="name"
        class="w-full"
        placeholder="Full Name"
      />
    </UFormField>

    <UFormField
      label="Email"
      name="email"
      help="You will receive a confirmation email on both the old and new email addresses if you modify your email."
    >
      <UInput v-model="state.email" class="w-full" placeholder="Email" />
    </UFormField>

    <UButton type="submit" :loading="pending"> Save </UButton>
  </UForm>
</template>

<script setup lang="ts">
import { object, string, type InferType } from "yup";
import type { FormSubmitEvent } from "@nuxt/ui";
type Schema = InferType<typeof schema>;
type Data = {
  email?: string;
  data: {
    full_name: string | null;
  };
};

const user = useSupabaseUser();
const supabase = useSupabaseClient();
const schema = object({
  name: string()
    .min(2, "String must contain at least 2 charachter")
    .required("Required"),
  email: string().email("Invalid email").required("Required"),
});
const state = reactive({
  name: user.value?.user_metadata?.full_name || "",
  email: user.value?.email || "",
});

const pending = ref(false);
const { toastSuccess, toastError } = useAppToast();

const SaveProfile = async (event: FormSubmitEvent<Schema>) => {
  pending.value = true;
  try {
    const data: Data = {
      data: {
        full_name: state.name,
      },
    };

    // If the email hasn't changed, we don't need to update it
    if (user.value?.email !== state.email) {
      data.email = state.email;
    }

    console.log(data);
    const { error } = await supabase.auth.updateUser(data);

    if (error) throw error;

    toastSuccess({
      title: "Success",
      description: "The form has been submitted.",
    });
  } catch (error) {
    toastError({
      title: "Error",
      description: error.message,
    });
  } finally {
    pending.value = false;
  }
};
</script>

<style scoped></style>
