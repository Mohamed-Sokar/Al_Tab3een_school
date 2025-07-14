<script setup lang="ts">
import { useSupabaseClient } from "#imports";

const supabase = useSupabaseClient();

// Supabase سيتحقق من رابط التأكيد تلقائيًا عبر الرابط
onMounted(async () => {
  const { error } = await supabase.auth.getSession(); // يحفز التحقق

  if (!error) {
    // ✅ إعادة التوجيه بعد نجاح تأكيد البريد
    navigateTo("/");
  } else {
    console.error(error.message);
    navigateTo("/error");
  }
});
</script>

<template>
  <div class="text-center">
    <p>جارٍ تأكيد البريد الإلكتروني...</p>
  </div>
</template>
