export default defineNuxtRouteMiddleware(async (to) => {
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
