<script setup lang="ts">
const login = () => {
  navigateTo("/login");
};

definePageMeta({
  layout: "general",
});
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 main"
    dir="rtl"
  >
    <!-- Navigation -->
    <nav class="bg-white shadow-sm sticky top-0">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center gap-1">
            <UIcon name="i-lucide-book-open" class="text-2xl text-secondary" />
            <div class="flex-shrink-0 flex items-center">
              <span class="mr-2 text-xl font-bold text-gray-800"
                >مدرسة التابعين</span
              >
            </div>
          </div>
          <div class="flex items-center">
            <NuxtLink
              to="/login"
              class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              تسجيل الدخول
            </NuxtLink>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <div class="overflow-hidden">
      <div class="max-w-7xl mx-auto">
        <div
          class="pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32"
        >
          <main
            class="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 lg:mt-16 lg:px-8 xl:mt-20"
          >
            <div class="text-right">
              <h1
                class="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl"
              >
                <span class="block">نظام إدارة المدرسة</span>
                <span class="block text-indigo-600">مدرسة التابعين</span>
              </h1>
              <p
                class="mt-3 text-base text-muted sm:mt-5 sm:text-lg sm:max-w-xl md:mt-5 md:text-xl"
              >
                نظام متكامل لإدارة الطلاب والامتحانات والنتائج بطريقة سهلة و
                آمنة وفعالة
              </p>
              <div class="mt-5 sm:mt-8 sm:flex sm:justify-end">
                <div class="rounded-md shadow">
                  <NuxtLink
                    to="/login"
                    class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                  >
                    ابدأ الآن
                  </NuxtLink>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="py-12 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-right">
          <h2
            class="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl"
          >
            مميزات النظام
          </h2>
          <p class="mt-4 max-w-2xl text-xl text-gray-500">
            كل ما تحتاجه لإدارة مدرستك في مكان واحد
          </p>
        </div>

        <div class="mt-10">
          <div
            class="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10"
          >
            <!-- Feature 1 -->
            <div class="text-right">
              <div class="flex items-center justify-start">
                <div class="flex-shrink-0 bg-indigo-500 rounded-md p-2">
                  <svg
                    class="h-6 w-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <div class="mr-4">
                  <h3 class="text-lg leading-6 font-medium text-gray-900">
                    إدارة الطلاب
                  </h3>
                  <p class="mt-2 text-base text-gray-500">
                    سجل كافة بيانات الطلاب وتتبع مستواهم الأكاديمي بسهولة
                  </p>
                </div>
              </div>
            </div>

            <!-- Feature 2 -->
            <div class="text-right">
              <div class="flex items-center justify-start">
                <div class="flex-shrink-0 bg-indigo-500 rounded-md p-2">
                  <svg
                    class="h-6 w-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <div class="mr-4">
                  <h3 class="text-lg leading-6 font-medium text-gray-900">
                    إدارة الامتحانات
                  </h3>
                  <p class="mt-2 text-base text-gray-500">
                    نظام متكامل لإدارة جميع امتحانات الطلاب وتقييم أدائهم
                  </p>
                </div>
              </div>
            </div>

            <!-- Feature 3 -->
            <div class="text-right">
              <div class="flex items-center justify-start">
                <div class="flex-shrink-0 bg-indigo-500 rounded-md p-2">
                  <svg
                    class="h-6 w-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <div class="mr-4">
                  <h3 class="text-lg leading-6 font-medium text-gray-900">
                    تقارير وإحصائيات
                  </h3>
                  <p class="mt-2 text-base text-gray-500">
                    احصل على تقارير مفصلة وإحصائيات دقيقة عن أداء الطلاب
                  </p>
                </div>
              </div>
            </div>

            <!-- Feature 4 -->
            <div class="text-right">
              <div class="flex items-center justify-start">
                <div class="flex-shrink-0 bg-indigo-500 rounded-md p-2">
                  <svg
                    class="h-6 w-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <div class="mr-4">
                  <h3 class="text-lg leading-6 font-medium text-gray-900">
                    نظام آمن
                  </h3>
                  <p class="mt-2 text-base text-gray-500">
                    حماية كاملة لبيانات الطلاب والمدرسة وفق أعلى معايير الأمان
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Testimonials -->
    <!-- <div class="bg-indigo-50">
      <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div class="text-right">
          <h2
            class="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl"
          >
            آراء المعلمين
          </h2>
        </div>
        <div class="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div class="bg-white p-6 rounded-lg shadow">
            <div class="text-right">
              <p class="text-gray-600">
                "النظام سهل الاستخدام ووفر الكثير من الوقت في إدارة درجات الطلاب
                وتقييم أدائهم."
              </p>
              <div class="mt-4 flex items-center justify-end">
                <div class="mr-4">
                  <p class="text-sm font-medium text-gray-900">أ. أحمد محمد</p>
                  <p class="text-sm text-gray-500">معلم الرياضيات</p>
                </div>
                <div class="flex-shrink-0">
                  <div
                    class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center"
                  >
                    <span class="text-indigo-600 font-bold">أ</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white p-6 rounded-lg shadow">
            <div class="text-right">
              <p class="text-gray-600">
                "التقارير المقدمة من النظام ساعدتني في تحديد نقاط الضعف والقوة
                لدى الطلاب بسهولة."
              </p>
              <div class="mt-4 flex items-center justify-end">
                <div class="mr-4">
                  <p class="text-sm font-medium text-gray-900">
                    أ. سارة عبدالله
                  </p>
                  <p class="text-sm text-gray-500">معلمة اللغة العربية</p>
                </div>
                <div class="flex-shrink-0">
                  <div
                    class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center"
                  >
                    <span class="text-indigo-600 font-bold">س</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white p-6 rounded-lg shadow">
            <div class="text-right">
              <p class="text-gray-600">
                "وفر النظام أكثر من 50% من الوقت الذي كنا نستغرقه في الأعمال
                الورقية."
              </p>
              <div class="mt-4 flex items-center justify-end">
                <div class="mr-4">
                  <p class="text-sm font-medium text-gray-900">أ. خالد محمود</p>
                  <p class="text-sm text-gray-500">مدير المدرسة</p>
                </div>
                <div class="flex-shrink-0">
                  <div
                    class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center"
                  >
                    <span class="text-indigo-600 font-bold">خ</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> -->

    <!-- CTA Section -->
    <div class="bg-indigo-700">
      <div
        class="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8"
      >
        <h2 class="text-3xl font-extrabold text-white sm:text-4xl">
          <span class="block">جاهز لتحويل إدارة مدرستك؟</span>
        </h2>
        <p class="mt-4 text-lg leading-6 text-indigo-200">
          سجل الآن واستمتع بنظام إدارة مدرسي متكامل وسهل الاستخدام
        </p>
        <NuxtLink
          to="/login"
          class="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 sm:w-auto"
        >
          سجل الدخول
        </NuxtLink>
      </div>
    </div>

    <!-- Footer -->
    <footer class="bg-gray-800">
      <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div class="text-right">
            <h3
              class="text-sm font-semibold text-gray-400 tracking-wider uppercase"
            >
              روابط سريعة
            </h3>
            <ul class="mt-4 space-y-4">
              <li>
                <NuxtLink
                  to="/"
                  class="text-base text-gray-300 hover:text-white"
                >
                  الصفحة الرئيسية
                </NuxtLink>
              </li>
              <li>
                <NuxtLink
                  to="/login"
                  class="text-base text-gray-300 hover:text-white"
                >
                  تسجيل الدخول
                </NuxtLink>
              </li>
            </ul>
          </div>

          <div class="text-right">
            <h3
              class="text-sm font-semibold text-gray-400 tracking-wider uppercase"
            >
              اتصل بنا
            </h3>
            <ul class="mt-4 space-y-4">
              <li>
                <p class="text-base text-gray-300">
                  البريد الإلكتروني: aboomarsokar@gmail.com
                </p>
              </li>
              <li>
                <p class="text-base text-gray-300">الجوال: 0592939036</p>
              </li>
            </ul>
          </div>

          <div class="text-right">
            <h3
              class="text-sm font-semibold text-gray-400 tracking-wider uppercase"
            >
              عن المدرسة
            </h3>
            <p class="mt-4 text-base text-gray-300">
              مدرسة التابعين تقدم تعليمًا متميزًا لأبنائنا الطلاب مع نظام إدارة
              مدرسي متكامل لتسهيل العملية التعليمية.
            </p>
          </div>
        </div>
        <div class="mt-8 border-t border-gray-700 pt-8 text-right">
          <p class="text-sm text-gray-400 flex items-center gap-2">
            <span class="text-2xl flex items-center"> &copy; </span>
            2025 م.محمد سالم سكر - جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.main {
  font-family: "Cairo", sans-serif;
}
</style>
