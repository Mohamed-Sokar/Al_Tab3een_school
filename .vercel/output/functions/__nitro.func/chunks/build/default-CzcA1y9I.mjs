import { u as useHead, g as useRoute, h as useSupabaseUser, c as _sfc_main$b, i as _sfc_main$a, a as __nuxt_component_0$2, n as navigateTo } from './server.mjs';
import { _ as _sfc_main$2 } from './DropdownMenu-BleUNEq_.mjs';
import { defineComponent, mergeProps, ref, watch, unref, withCtx, createVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSlot, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { u as useAppToast } from './useAppToast-BZDaw0os.mjs';
import { u as useSupabaseClient } from './useSupabaseClient-L7lO71ll.mjs';
import { a as api } from './api-Bx7QNuNm.mjs';
import { u as useColorMode } from './composables-K6fOgyxT.mjs';
import { u as useStudentStore } from './students-C5l8o5u3.mjs';
import { u as usePaymentsStore } from './paymnets-DpmBuoF8.mjs';
import { u as useTeachersStore } from './teachers-Cx5Wl_TR.mjs';
import { u as useLevelsStore } from './levels-wubGyWhj.mjs';
import { u as useAcademicClassesStore } from './academic_classes-C4vfu9w7.mjs';
import { u as useQuranClassesStore } from './quran_classes-BKWJ4W-E.mjs';
import { u as useDriversStore } from './drivers-BuRykaFo.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@iconify/utils';
import 'consola';
import 'node:module';
import 'pinia';
import 'vue-router';
import '@supabase/ssr';
import 'tailwindcss/colors';
import '@iconify/vue';
import 'reka-ui';
import '@vueuse/core';
import 'tailwind-variants';
import '@iconify/utils/lib/css/icon';
import 'perfect-debounce';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'reka-ui/namespaced';
import 'axios';
import './constants-CI-Eb238.mjs';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "sidebar",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const { toastError, toastSuccess } = useAppToast();
    const isOpen = ref(false);
    const isLargeScreen = ref(false);
    const loading = ref(false);
    const supabase = useSupabaseClient();
    const user = useSupabaseUser();
    watch(
      () => route.path,
      () => {
        if (!isLargeScreen.value) isOpen.value = false;
      }
    );
    const signOut = async () => {
      var _a;
      try {
        loading.value = true;
        await api.post("/notifications/send-telegram", {
          message: `\u{1F514} \u062A\u0645 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062E\u0631\u0648\u062C \u0645\u0646 \u062D\u0633\u0627\u0628 ${(_a = user.value) == null ? void 0 : _a.email}`
        });
        const { error } = await supabase.auth.signOut();
        navigateTo("/login");
        if (error) {
          throw new Error(error.message);
        }
        toastSuccess({
          title: "\u062A\u0645 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062E\u0631\u0648\u062C \u0628\u0646\u062C\u0627\u062D"
        });
      } catch (error) {
        toastError({
          title: "\u062D\u062F\u062B \u0645\u0634\u0643\u0644\u0629 \u0641\u064A \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062E\u0631\u0648\u062C",
          description: error instanceof Error ? error.message : typeof error === "string" ? error : JSON.stringify(error)
        });
      } finally {
        loading.value = false;
      }
    };
    const links = [
      { label: "\u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629", icon: "i-lucide-home", to: "/" },
      {
        label: "\u0627\u0644\u0637\u0644\u0627\u0628",
        icon: "i-lucide-users",
        to: "/students/view/students_table"
      },
      { label: "\u0627\u0644\u0645\u0639\u0644\u0645\u0648\u0646", icon: "i-lucide-users", to: "/teachers/view" },
      { label: "\u0627\u0644\u0645\u0635\u0631\u0648\u0641\u0627\u062A", icon: "i-lucide-credit-card", to: "/payments" },
      {
        label: "\u0627\u0644\u0635\u0641\u0648\u0641",
        icon: "i-heroicons-presentation-chart-bar",
        to: "/classes/view/academic_classes",
        star: true
      },
      {
        label: "\u0627\u0644\u0633\u0627\u0626\u0642\u064A\u0646",
        icon: "i-lucide-car-taxi-front",
        to: "/drivers",
        star: true
      },
      { label: "\u0627\u0644\u0645\u0633\u062A\u0648\u064A\u0627\u062A", icon: "i-lucide-book-open", to: "/levels" },
      { label: "\u062E\u0637\u0637 \u0627\u0644\u0637\u0644\u0627\u0628", icon: "i-heroicons-calendar-days", to: "/plans" },
      // { label: "التقارير", icon: "i-lucide-bar-chart-3", to: "/reports" },
      { label: "\u0627\u0644\u0625\u0639\u062F\u0627\u062F\u0627\u062A", icon: "i-lucide-settings", to: "/settings/general" }
    ];
    const items = [
      [
        {
          slot: "account",
          // label: user.value?.email,
          icon: "i-lucide-user",
          disabled: true
        }
      ],
      [
        {
          label: "\u062A\u063A\u064A\u064A\u0631 \u0627\u0644\u0635\u0648\u0631\u0629 \u0627\u0644\u0634\u062E\u0635\u064A\u0629",
          icon: "i-heroicons-camera",
          onSelect: () => {
            navigateTo("/settings/avatar");
          }
        }
      ],
      [
        {
          label: "\u062A\u0633\u062C\u064A\u0644 \u062E\u0631\u0648\u062C",
          color: "error",
          icon: "heroicons-arrow-right-end-on-rectangle-20-solid",
          class: "text-red-500  hover:cursor-pointer",
          onSelect: () => {
            signOut();
          }
        }
      ]
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = _sfc_main$b;
      const _component_UDropdownMenu = _sfc_main$2;
      const _component_UAvatar = _sfc_main$a;
      const _component_NuxtLink = __nuxt_component_0$2;
      _push(`<div${ssrRenderAttrs(_attrs)}><button class="fixed top-4 right-4 z-50 bg-blue-700 dark:bg-blue-600 text-white p-2 rounded-lg shadow-lg lg:hidden">`);
      _push(ssrRenderComponent(_component_UIcon, {
        name: isOpen.value ? "i-lucide-x" : "lucide-align-right",
        class: "size-6"
      }, null, _parent));
      _push(`</button>`);
      if (isOpen.value && !isLargeScreen.value) {
        _push(`<div class="fixed inset-0 bg-black/50 z-40"></div>`);
      } else {
        _push(`<!---->`);
      }
      if (isOpen.value || isLargeScreen.value) {
        _push(`<aside class="fixed lg:sticky top-0 right-0 flex flex-col justify-between w-64 h-screen z-1000 bg-gradient-to-b from-blue-800 to-purple-700 dark:from-gray-900 dark:to-gray-800 text-white transition-all duration-300 ease-in-out"><div class="flex items-center gap-4 p-4 border-b border-blue-300 dark:border-gray-700"><div>`);
        if (unref(user)) {
          _push(ssrRenderComponent(_component_UDropdownMenu, {
            class: "hover:cursor-pointer",
            arrow: "",
            items,
            ui: {
              content: "w-60"
            }
          }, {
            account: withCtx(({ item }, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="text-left w-full"${_scopeId}><p class="text-muted"${_scopeId}>\u062A\u0645 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 \u0628\u062D\u0633\u0627\u0628</p><div class="flex justify-between w-full"${_scopeId}><p class="font-medium text-gray-900 dark:text-white"${_scopeId}>${ssrInterpolate(unref(user).email)}</p>`);
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: item.icon,
                  class: "flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500 ms-auto"
                }, null, _parent2, _scopeId));
                _push2(`</div></div>`);
              } else {
                return [
                  createVNode("div", { class: "text-left w-full" }, [
                    createVNode("p", { class: "text-muted" }, "\u062A\u0645 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 \u0628\u062D\u0633\u0627\u0628"),
                    createVNode("div", { class: "flex justify-between w-full" }, [
                      createVNode("p", { class: "font-medium text-gray-900 dark:text-white" }, toDisplayString(unref(user).email), 1),
                      createVNode(_component_UIcon, {
                        name: item.icon,
                        class: "flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500 ms-auto"
                      }, null, 8, ["name"])
                    ])
                  ])
                ];
              }
            }),
            "item-leading": withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) ;
              else {
                return [];
              }
            }),
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              var _a, _b;
              if (_push2) {
                _push2(ssrRenderComponent(_component_UAvatar, {
                  src: (_a = _ctx.url) != null ? _a : "/images/avatar.avif",
                  size: "xl",
                  class: "border"
                }, null, _parent2, _scopeId));
              } else {
                return [
                  createVNode(_component_UAvatar, {
                    src: (_b = _ctx.url) != null ? _b : "/images/avatar.avif",
                    size: "xl",
                    class: "border"
                  }, null, 8, ["src"])
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div><h2 class="text-xl font-bold text-white">\u062C\u0644\u0627\u0644 \u0623\u0628\u0648 \u0635\u0627\u064A\u0645\u0629</h2><p class="text-sm text-blue-200 dark:text-gray-400"> \u0645\u062F\u064A\u0631 \u0645\u062F\u0631\u0633\u0629 \u0627\u0644\u062A\u0627\u0628\u0639\u064A\u0646 </p></div></div><nav class="mt-6 px-2 flex-1 space-y-2 text-right overflow-y-auto"><!--[-->`);
        ssrRenderList(links, (link) => {
          _push(`<div>`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: link.to,
            class: ["flex items-center font-semibold gap-3 px-4 py-2 rounded-lg transition hover:bg-blue-600", {
              "bg-blue-600": link.to === "/" ? unref(route).path === link.to : unref(route).path.includes(link.to)
            }]
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: link.icon,
                  class: "size-5"
                }, null, _parent2, _scopeId));
                _push2(`<span class="text-base text-white dark:text-gray-200"${_scopeId}>${ssrInterpolate(link.label)}</span>`);
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: link.star ? "i-heroicons-sparkles-solid" : "",
                  class: "size-5 text-warning-300"
                }, null, _parent2, _scopeId));
              } else {
                return [
                  createVNode(_component_UIcon, {
                    name: link.icon,
                    class: "size-5"
                  }, null, 8, ["name"]),
                  createVNode("span", { class: "text-base text-white dark:text-gray-200" }, toDisplayString(link.label), 1),
                  createVNode(_component_UIcon, {
                    name: link.star ? "i-heroicons-sparkles-solid" : "",
                    class: "size-5 text-warning-300"
                  }, null, 8, ["name"])
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div>`);
        });
        _push(`<!--]--></nav></aside>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/app/sidebar.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    useSupabaseClient();
    useHead({
      title: "Al Tabeen School",
      htmlAttrs: {
        dir: "rtl",
        lang: "ar"
      }
    });
    const colorMode = useColorMode();
    colorMode.preference = "system";
    useStudentStore();
    usePaymentsStore();
    useTeachersStore();
    useLevelsStore();
    useAcademicClassesStore();
    useQuranClassesStore();
    useDriversStore();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_AppSidebar = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_AppSidebar, null, null, _parent));
      _push(`<div class="lg:w-[calc(100%-190px)] min-h-screen w-full dark:bg-gray-950"><div class="w-full min-h-screen px-4 pt-4 pb-10 dark:from-gray-900 dark:to-gray-800"><main>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=default-CzcA1y9I.mjs.map
