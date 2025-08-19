export default defineNuxtRouteMiddleware(async (to) => {
  const nuxtApp = useNuxtApp();
  if (import.meta.server) return;
  if (
    import.meta.client &&
    nuxtApp.isHydrating &&
    nuxtApp.payload.serverRendered
  )
    return;

  const user = useSupabaseUser();

  // If user is logged in, redirect to home
  if (user.value) {
    return navigateTo("/home");
  }
});
