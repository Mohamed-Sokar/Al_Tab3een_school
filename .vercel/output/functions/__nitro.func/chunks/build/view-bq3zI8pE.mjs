import { _ as _sfc_main$1 } from './header-CXonAB11.mjs';
import { g as useRoute, e as _sfc_main$7, f as __nuxt_component_0 } from './server.mjs';
import { _ as _sfc_main$2 } from './tabs-C9VUc8nP.mjs';
import { defineComponent, ref, watch, computed, withCtx, unref, createVNode, useSSRContext } from 'vue';
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
    const route = useRoute();
    const classT = ref();
    watch(
      route,
      () => {
        classT.value = route.path.split("/")[route.path.split("/").length - 1];
      },
      { immediate: true }
    );
    const classType = computed(
      () => classT.value === "academic_classes" ? "academic" : classT.value === "quran_classes" ? "quran" : ""
    );
    const links = [
      {
        label: "\u0627\u0644\u0635\u0641\u0648\u0641 \u0627\u0644\u062F\u0631\u0627\u0633\u064A\u0629",
        icon: "i-heroicons-presentation-chart-bar",
        to: "/classes/view/academic_classes"
      },
      {
        label: "\u0627\u0644\u0635\u0641\u0648\u0641 \u0627\u0644\u0642\u0631\u0622\u0646\u064A\u0629",
        icon: "i-heroicons-book-open",
        to: "/classes/view/quran_classes"
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_BaseHeader = _sfc_main$1;
      const _component_UButton = _sfc_main$7;
      const _component_BaseTabs = _sfc_main$2;
      const _component_NuxtPage = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_BaseHeader, {
        title: "\u0627\u0644\u0635\u0641\u0648\u0641",
        description: "\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0635\u0641\u0648\u0641 \u0627\u0644\u062F\u0631\u0627\u0633\u064A\u0629"
      }, {
        actions: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UButton, {
              icon: "heroicons-plus-circle-20-solid",
              size: "md",
              color: "secondary",
              class: "bg-blue-600 px-3 py-2 font-bold",
              variant: "solid",
              to: { name: "classes-add", query: { classType: unref(classType) } },
              label: unref(classType) === "academic" ? "\u0625\u0636\u0627\u0641\u0629 \u0635\u0641 \u062F\u0631\u0627\u0633\u064A \u062C\u062F\u064A\u062F" : "\u0625\u0636\u0627\u0641\u0629 \u0635\u0641 \u0642\u0631\u0622\u0646 \u062C\u062F\u064A\u062F"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UButton, {
                icon: "heroicons-plus-circle-20-solid",
                size: "md",
                color: "secondary",
                class: "bg-blue-600 px-3 py-2 font-bold",
                variant: "solid",
                to: { name: "classes-add", query: { classType: unref(classType) } },
                label: unref(classType) === "academic" ? "\u0625\u0636\u0627\u0641\u0629 \u0635\u0641 \u062F\u0631\u0627\u0633\u064A \u062C\u062F\u064A\u062F" : "\u0625\u0636\u0627\u0641\u0629 \u0635\u0641 \u0642\u0631\u0622\u0646 \u062C\u062F\u064A\u062F"
              }, null, 8, ["to", "label"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_BaseTabs, { links }, null, _parent));
      _push(ssrRenderComponent(_component_NuxtPage, null, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/classes/view.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=view-bq3zI8pE.mjs.map
