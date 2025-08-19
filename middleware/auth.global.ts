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
  const publicRoutes = ["/", "/login"]; // Add any other public routes

  // If user is logged in and tries to access login/register, redirect to home
  if (user.value && to.path === "/login") {
    return navigateTo("/home");
  }

  // If user is not logged in and tries to access protected route
  if (!user.value && !publicRoutes.includes(to.path)) {
    return navigateTo("/login");
  }
});
