import { _ as _sfc_main$1 } from './header-CXonAB11.mjs';
import { g as useRoute, e as _sfc_main$7, f as __nuxt_component_0 } from './server.mjs';
import { _ as _sfc_main$2 } from './tabs-C9VUc8nP.mjs';
import { _ as __nuxt_component_3 } from './fadeTransition-CbF_NhQl.mjs';
import { defineComponent, computed, withCtx, createTextVNode, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
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
  __name: "view",
  __ssrInlineRender: true,
  setup(__props) {
    useRoute();
    const links = [
      {
        label: "\u0627\u0644\u0645\u0639\u0644\u0645\u0648\u0646",
        icon: "i-lucide-user",
        to: "/teachers/view/teachers_table"
      },
      {
        label: "\u0627\u0644\u0642\u0631\u0648\u0636",
        icon: "i-lucide-user",
        to: "/teachers/view/loans"
      },
      {
        label: "\u0627\u0644\u0645\u062E\u0627\u0644\u0641\u0627\u062A \u0627\u0644\u0625\u062F\u0627\u0631\u064A\u0629",
        icon: "i-lucide-user",
        to: "/teachers/view/behavioral_issues"
      },
      {
        label: "\u0627\u0644\u062D\u0636\u0648\u0631 \u0648\u0627\u0644\u063A\u064A\u0627\u0628",
        icon: "i-lucide-user",
        to: "/teachers/view/absence"
      }
    ];
    computed(() => {
      return `text-sm grid grid-cols-4 gap-1 p-1 bg-secondary-50 border border-secondary-200 dark:bg-secondary-950 dark:border-secondary-500 rounded-sm mt-2 mb-8 `;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_BaseHeader = _sfc_main$1;
      const _component_UButton = _sfc_main$7;
      const _component_BaseTabs = _sfc_main$2;
      const _component_BaseFadeTransition = __nuxt_component_3;
      const _component_NuxtPage = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_BaseHeader, {
        title: "\u0627\u0644\u0645\u0639\u0644\u0645\u0648\u0646",
        description: "\u0625\u062F\u0627\u0631\u0629 \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0645\u0639\u0644\u0645\u0648\u0646 \u0648\u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062A \u0627\u0644\u0623\u0643\u0627\u062F\u064A\u0645\u064A\u0629"
      }, {
        actions: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UButton, {
              icon: "heroicons-plus-circle-20-solid",
              size: "lg",
              color: "secondary",
              class: "bg-blue-600 px-3 py-2 font-bold",
              variant: "solid",
              to: { name: "teachers-add" }
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`\u0625\u0636\u0627\u0641\u0629 \u0645\u0639\u0644\u0645`);
                } else {
                  return [
                    createTextVNode("\u0625\u0636\u0627\u0641\u0629 \u0645\u0639\u0644\u0645")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UButton, {
                icon: "heroicons-plus-circle-20-solid",
                size: "lg",
                color: "secondary",
                class: "bg-blue-600 px-3 py-2 font-bold",
                variant: "solid",
                to: { name: "teachers-add" }
              }, {
                default: withCtx(() => [
                  createTextVNode("\u0625\u0636\u0627\u0641\u0629 \u0645\u0639\u0644\u0645")
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_BaseTabs, { links }, null, _parent));
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
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/teachers/view.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=view-CuGdTAGg.mjs.map
