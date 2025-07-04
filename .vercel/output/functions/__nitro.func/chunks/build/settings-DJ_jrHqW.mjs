import { _ as _sfc_main$1 } from './header-CXonAB11.mjs';
import { g as useRoute, n as navigateTo, e as _sfc_main$7, f as __nuxt_component_0 } from './server.mjs';
import { _ as __nuxt_component_3 } from './fadeTransition-CbF_NhQl.mjs';
import { defineComponent, watch, unref, withCtx, createTextVNode, toDisplayString, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "settings",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    watch(route, () => {
      if (route.path === "/settings") {
        navigateTo("/settings/general");
      }
    });
    const links = [
      {
        label: "\u0627\u0644\u0625\u0639\u062F\u0627\u062F\u0627\u062A",
        icon: "i-lucide-cog",
        to: "/settings/general"
      },
      {
        label: "\u0627\u0644\u0645\u0644\u0641 \u0627\u0644\u0634\u062E\u0635\u064A",
        icon: "i-lucide-user",
        to: "/settings/profile"
      },
      {
        label: "\u0627\u0644\u0635\u0648\u0631\u0629 \u0627\u0644\u0634\u062E\u0635\u064A\u0629",
        icon: "i-lucide-image",
        to: "/settings/avatar"
      },
      {
        label: "\u062A\u063A\u064A\u064A\u0631 \u0627\u0644\u062D\u0633\u0627\u0628",
        icon: "i-lucide-cog",
        to: "/settings/change_email"
      },
      {
        label: "\u062A\u063A\u064A\u064A\u0631 \u0643\u0644\u0645\u0629 \u0627\u0644\u0633\u0631",
        icon: "i-lucide-cog",
        to: "/settings/change_password"
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_BaseHeader = _sfc_main$1;
      const _component_UButton = _sfc_main$7;
      const _component_BaseFadeTransition = __nuxt_component_3;
      const _component_NuxtPage = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_BaseHeader, {
        title: "\u0627\u0644\u0625\u0639\u062F\u0627\u062F\u0627\u062A",
        description: "\u062A\u062E\u0635\u064A\u0635 \u0648\u0625\u062F\u0627\u0631\u0629 \u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0627\u0644\u0646\u0638\u0627\u0645"
      }, null, _parent));
      _push(`<div class="grid grid-cols-6 gap-8 mt-5"><div class="flex flex-col gap-0.5 col-span-2"><!--[-->`);
      ssrRenderList(links, (link) => {
        _push(ssrRenderComponent(_component_UButton, {
          variant: "ghost",
          color: "secondary",
          class: ["py-1.5 px-5 text-gray-500 rounded-md text-sm", {
            "text-secondary bg-secondary-50 dark:bg-gray-800": link.to === unref(route).path
          }],
          icon: link.icon,
          key: link.to,
          to: link.to
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(link.label)}`);
            } else {
              return [
                createTextVNode(toDisplayString(link.label), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div><div class="col-span-4">`);
      _push(ssrRenderComponent(_component_BaseFadeTransition, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_NuxtPage, null, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_NuxtPage)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/settings.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=settings-DJ_jrHqW.mjs.map
