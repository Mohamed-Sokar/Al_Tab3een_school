<template>
  <div>
    <div class="mb-4">
      <UFormField label="الصورة الشخصية الحالية" class="w-full">
        <UAvatar :src="avatarUrl" class="w-30 h-30 border" />
      </UFormField>
    </div>

    <div class="mb-4">
      <UFormField
        label="اختر صورة جديدة"
        class="w-full"
        name="avatar"
        help="بعد اختيارك للصورة اضغط على زر حفظ ليتم حفظ الصورة الجديدة"
      >
        <!-- there is a bug with using UInput -->
        <!-- <UInput type="file" ref="fileInput" /> -->
        <input
          type="file"
          ref="fileInput"
          class="py-1.5 px-2 w-80 rounded-md border border-gray-300 dark:border-gray-600"
        />
      </UFormField>
    </div>

    <UButton
      type="submit"
      color="secondary"
      variant="solid"
      label="حفظ"
      :loading="uploading"
      :disabled="uploading"
      @click="saveAvatar"
    />
  </div>
</template>

<script setup>
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const uploading = ref(false);
const fileInput = ref(); // Reference to an input with ref="fileInput" attribute

const { toastSuccess, toastError } = useAppToast();

const { url } = useAvatarUrl();
const avatarUrl = computed(() => url.value ?? "/images/avatar.avif");

const saveAvatar = async () => {
  // 1. Get the uploaded file
  const file = fileInput.value.files[0]; // Access the file from the input element

  // a) If no file uploaded, show toast error
  if (!file && !user.value) {
    toastError({
      title: "اختر صورة أولاً",
      description: "يجب أن تختار صورة أولا قبل التسليم",
    });
    return;
  }

  // 2. Generate the new filename
  // const fileExt = file.name.split(".").pop();
  // const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `${user.value.id}/${file.name}`;

  try {
    uploading.value = true;

    // 1. Upload the image to avatars bucket
    const { data, error } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, {
        upsert: true,
        cacheControl: "3600",
        contentType: file.type,
      });
    if (error) throw error;

    // 2. Update the user metadata with the avatar URL
    await supabase.auth.updateUser({
      data: {
        avatar_url: data.path, // Use the path returned from the upload
      },
    });

    // 3. (OPTIONALLY) remove the old avatar file
    // if (currentAvatarUrl) {
    //   const { error: deleteError } = await supabase.storage
    //     .from("avatars")
    //     .remove([currentAvatarUrl]);
    //   if (deleteError) throw deleteError;
    // }

    // 4. Reset the file input
    fileInput.value.value = ""; // Clear the input field

    toastSuccess({
      title: "تم تحميل الصورة الشخصية بنجاح",
    });
  } catch (error) {
    toastError({
      title: "حدث خطأ في تحميل الصورة الشخصية",
      description: error.message,
    });
  } finally {
    uploading.value = false;
  }
};
</script>

<style scoped></style>
