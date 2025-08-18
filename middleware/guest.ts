export default defineNuxtRouteMiddleware(async (to) => {
  const user = useSupabaseUser();

  // If user is logged in, redirect to home
  if (user.value) {
    return navigateTo("/home");
  }
});
