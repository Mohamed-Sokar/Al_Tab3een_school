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
        <UFormField label="الاسم الرباعي" name="name">
          <UInput
            v-model="state.name"
            class="w-full"
            placeholder="الاسم الرباعي"
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
type Schema = InferType<typeof schema>;

type Data = {
  email?: string;
  data: {
    full_name: string | null;
  };
};

const user = useSupabaseUser();
// const supabase = useSupabaseClient();

const schema = object({
  name: string()
    .min(2, "String must contain at least 2 charachter")
    .required("Required"),
});
const state = reactive({
  name: user.value?.user_metadata?.full_name || "",
});
// email schema and state

const pending = ref(false);
// const passwordPending = ref(false);

// const { toastSuccess, toastError } = useAppToast();

const saveProfile = async (event: FormSubmitEvent<Schema>) => {
  console.log("Save Profile");
  // pending.value = true;
  // try {
  //   const data: Data = {
  //     data: {
  //       full_name: state.name,
  //     },
  //   };
  //   // If the email hasn't changed, we don't need to update it
  //   if (user.value?.email !== state.email) {
  //     data.email = state.email;
  //   }
  //   console.log(data);
  //   const { error } = await supabase.auth.updateUser(data);
  //   if (error) throw error;
  //   toastSuccess({
  //     title: "Success",
  //     description: "The form has been submitted.",
  //   });
  // } catch (error) {
  //   toastError({
  //     title: "Error",
  //     description: error.message,
  //   });
  // } finally {
  //   pending.value = false;
  // }
};
</script>

<style scoped></style>
