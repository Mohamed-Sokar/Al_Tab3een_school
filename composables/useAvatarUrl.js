export const useAvatarUrl = () => {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();

  // Get the avatar URL for a user
  const getPublicUrl = () => {
    if (!user.value?.user_metadata?.avatar_url) return null;

    // Get public URL for an avatar image stored in Supabase storage
    const { data } = supabase.storage
      .from("avatars")
      .getPublicUrl(user.value?.user_metadata?.avatar_url);

    return data.publicUrl;
  };

  const url = ref(getPublicUrl());

  // watch user to get the latest avatarUrl
  watch(user, () => (url.value = getPublicUrl()), { immediate: true });

  return { url };
};
