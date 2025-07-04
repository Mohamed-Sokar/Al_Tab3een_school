import { _ as _sfc_main$1 } from './header-CXonAB11.mjs';
import { _ as _export_sfc, e as _sfc_main$7 } from './server.mjs';
import { _ as _sfc_main$2 } from './Badge-CPUrxw_P.mjs';
import { withCtx, createVNode, createTextVNode, useSSRContext } from 'vue';
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

const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_BaseHeader = _sfc_main$1;
  const _component_UButton = _sfc_main$7;
  const _component_UBadge = _sfc_main$2;
  _push(`<div${ssrRenderAttrs(_attrs)}>`);
  _push(ssrRenderComponent(_component_BaseHeader, {
    title: "\u062E\u0637\u0637 \u0627\u0644\u0637\u0644\u0627\u0628",
    description: "\u0625\u062F\u0627\u0631\u0629 \u062E\u0637\u0637 \u0627\u0644\u0637\u0644\u0627\u0628 \u0627\u0644\u0634\u0647\u0631\u064A\u0629"
  }, {
    actions: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(ssrRenderComponent(_component_UButton, {
          icon: "heroicons-plus-circle-20-solid",
          size: "lg",
          color: "secondary",
          class: "bg-blue-600 px-3 py-2 font-bold",
          variant: "solid",
          to: "/plans/add"
        }, {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(`\u0625\u0636\u0627\u0641\u0629 \u062E\u0637\u0629 \u062C\u062F\u064A\u062F\u0629`);
            } else {
              return [
                createTextVNode("\u0625\u0636\u0627\u0641\u0629 \u062E\u0637\u0629 \u062C\u062F\u064A\u062F\u0629")
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
            to: "/plans/add"
          }, {
            default: withCtx(() => [
              createTextVNode("\u0625\u0636\u0627\u0641\u0629 \u062E\u0637\u0629 \u062C\u062F\u064A\u062F\u0629")
            ]),
            _: 1
          })
        ];
      }
    }),
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(ssrRenderComponent(_component_UBadge, { color: "neutral" }, null, _parent2, _scopeId));
      } else {
        return [
          createVNode(_component_UBadge, { color: "neutral" })
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/plans/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { index as default };
//# sourceMappingURL=index-BwEclTzJ.mjs.map
