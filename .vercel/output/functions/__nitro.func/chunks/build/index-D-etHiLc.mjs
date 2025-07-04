import { _ as _sfc_main$2 } from './header-CXonAB11.mjs';
import { e as _sfc_main$7, c as _sfc_main$b, n as navigateTo } from './server.mjs';
import { _ as _sfc_main$3 } from './Card-ClkFNDdW.mjs';
import { _ as _sfc_main$4 } from './Badge-CPUrxw_P.mjs';
import { defineComponent, withCtx, createTextVNode, createVNode, unref, mergeProps, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderClass } from 'vue/server-renderer';
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
import './students-C5l8o5u3.mjs';
import './useAppToast-BZDaw0os.mjs';
import './constants-CI-Eb238.mjs';
import './api-Bx7QNuNm.mjs';
import 'axios';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "card",
  __ssrInlineRender: true,
  props: {
    driver: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UCard = _sfc_main$3;
      const _component_UIcon = _sfc_main$b;
      const _component_UBadge = _sfc_main$4;
      const _component_UButton = _sfc_main$7;
      _push(ssrRenderComponent(_component_UCard, mergeProps({ class: "h-full border-t-4 border-secondary hover:shadow-xl transition-all" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a, _b, _c, _d, _e, _f, _g, _h;
          if (_push2) {
            _push2(`<div class="flex justify-between"${_scopeId}><div class="flex items-center gap-1"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "heroicons-identification-solid",
              class: "text-secondary w-8 h-8"
            }, null, _parent2, _scopeId));
            _push2(`<span class="text-secondary-600 font-semibold"${_scopeId}>${ssrInterpolate(_ctx.driver.name)}</span></div><div${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UBadge, {
              label: `\u0639\u062F\u062F \u0627\u0644\u0637\u0644\u0627\u0628: ${_ctx.driver.studentsCount}`,
              variant: "soft",
              color: "secondary",
              class: "text-secondary-600 font-bold"
            }, null, _parent2, _scopeId));
            _push2(`</div></div><div class="flex flex-col gap-2 mt-5"${_scopeId}><div class="flex justify-between items-center px-4 py-2 rounded-sm bg-gray-50 dark:bg-secondary-950"${_scopeId}><div class="flex items-center gap-1"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "heroicons-user-group-solid",
              class: "text-secondary w-5 h-5"
            }, null, _parent2, _scopeId));
            _push2(`<span class="text-xs font-bold"${_scopeId}>\u0639\u062F\u062F \u0627\u0644\u0637\u0644\u0627\u0628</span></div><div class="font-bold text-secondary-600"${_scopeId}>${ssrInterpolate(_ctx.driver.studentsCount)}</div></div><div class="flex justify-between items-center px-4 py-2 rounded-sm bg-gray-50 dark:bg-secondary-950"${_scopeId}><div class="flex items-center gap-1"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "heroicons-truck",
              class: "text-info w-5 h-5"
            }, null, _parent2, _scopeId));
            _push2(`<span class="text-xs font-bold"${_scopeId}>\u0646\u0648\u0639 \u0627\u0644\u0633\u064A\u0627\u0631\u0629</span></div><div class="text-info"${_scopeId}>${ssrInterpolate(_ctx.driver.car_type)}</div></div><div class="flex justify-between items-center px-4 py-2 rounded-sm bg-gray-50 dark:bg-secondary-950"${_scopeId}><div class="flex items-center gap-1"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "heroicons-eye-dropper",
              class: "text-info w-5 h-5"
            }, null, _parent2, _scopeId));
            _push2(`<span class="text-xs font-bold"${_scopeId}>\u0644\u0648\u0646 \u0627\u0644\u0633\u064A\u0627\u0631\u0629</span></div><div class="text-info"${_scopeId}>${ssrInterpolate(_ctx.driver.car_color)}</div></div><div class="flex justify-between items-center px-4 py-2 rounded-sm bg-gray-50 dark:bg-secondary-950"${_scopeId}><div class="flex items-center gap-1"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-user-group-solid",
              class: "text-error w-5 h-5"
            }, null, _parent2, _scopeId));
            _push2(`<span class="text-xs font-bold"${_scopeId}>\u0627\u0644\u0633\u0639\u0629 \u0627\u0644\u0642\u0635\u0648\u0649</span></div><div class="text-error text-sm flex items-center gap-1"${_scopeId}><div class="font-bold"${_scopeId}>${ssrInterpolate(_ctx.driver.maximum_capacity)}</div><div class="font-semibold"${_scopeId}>\u0637\u0627\u0644\u0628</div></div></div><div class="flex justify-between items-center px-4 py-2 rounded-sm bg-gray-50 dark:bg-secondary-950"${_scopeId}><div class="flex items-center gap-1"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-cube",
              class: "text-gray-400 w-5 h-5"
            }, null, _parent2, _scopeId));
            _push2(`<span class="text-xs font-bold"${_scopeId}>\u0627\u0644\u0645\u0642\u0627\u0639\u062F \u0627\u0644\u0641\u0627\u0631\u063A\u0629</span></div><div class="${ssrRenderClass([`text-${((_a = _ctx.driver.maximum_capacity) != null ? _a : 0) - ((_b = _ctx.driver.studentsCount) != null ? _b : 0) > 0 ? "success" : "error"}`, "text-sm flex items-center gap-1"])}"${_scopeId}><div class="font-bold"${_scopeId}>${ssrInterpolate(((_c = _ctx.driver.maximum_capacity) != null ? _c : 0) - ((_d = _ctx.driver.studentsCount) != null ? _d : 0))}</div><div class="font-semibold"${_scopeId}>\u0645\u0642\u0639\u062F</div></div></div><div class="grid grid-cols-1 md:grid-cols-4 gap-2 mt-5 text-center"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UButton, {
              label: "\u0639\u0631\u0636 \u0627\u0644\u0637\u0644\u0627\u0628",
              class: "hover:cursor-pointer md:col-span-3 flex justify-center",
              color: "secondary",
              variant: "subtle",
              onClick: ($event) => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))({
                name: "students-view-students_table",
                query: { driver_id: _ctx.driver.id }
              })
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UButton, {
              label: "\u062A\u0639\u062F\u064A\u0644",
              class: "hover:cursor-pointer flex justify-center",
              color: "secondary",
              variant: "solid",
              onClick: ($event) => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))({
                name: "drivers-id-edit_driver",
                params: { id: _ctx.driver.id }
              })
            }, null, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "flex justify-between" }, [
                createVNode("div", { class: "flex items-center gap-1" }, [
                  createVNode(_component_UIcon, {
                    name: "heroicons-identification-solid",
                    class: "text-secondary w-8 h-8"
                  }),
                  createVNode("span", { class: "text-secondary-600 font-semibold" }, toDisplayString(_ctx.driver.name), 1)
                ]),
                createVNode("div", null, [
                  createVNode(_component_UBadge, {
                    label: `\u0639\u062F\u062F \u0627\u0644\u0637\u0644\u0627\u0628: ${_ctx.driver.studentsCount}`,
                    variant: "soft",
                    color: "secondary",
                    class: "text-secondary-600 font-bold"
                  }, null, 8, ["label"])
                ])
              ]),
              createVNode("div", { class: "flex flex-col gap-2 mt-5" }, [
                createVNode("div", { class: "flex justify-between items-center px-4 py-2 rounded-sm bg-gray-50 dark:bg-secondary-950" }, [
                  createVNode("div", { class: "flex items-center gap-1" }, [
                    createVNode(_component_UIcon, {
                      name: "heroicons-user-group-solid",
                      class: "text-secondary w-5 h-5"
                    }),
                    createVNode("span", { class: "text-xs font-bold" }, "\u0639\u062F\u062F \u0627\u0644\u0637\u0644\u0627\u0628")
                  ]),
                  createVNode("div", { class: "font-bold text-secondary-600" }, toDisplayString(_ctx.driver.studentsCount), 1)
                ]),
                createVNode("div", { class: "flex justify-between items-center px-4 py-2 rounded-sm bg-gray-50 dark:bg-secondary-950" }, [
                  createVNode("div", { class: "flex items-center gap-1" }, [
                    createVNode(_component_UIcon, {
                      name: "heroicons-truck",
                      class: "text-info w-5 h-5"
                    }),
                    createVNode("span", { class: "text-xs font-bold" }, "\u0646\u0648\u0639 \u0627\u0644\u0633\u064A\u0627\u0631\u0629")
                  ]),
                  createVNode("div", { class: "text-info" }, toDisplayString(_ctx.driver.car_type), 1)
                ]),
                createVNode("div", { class: "flex justify-between items-center px-4 py-2 rounded-sm bg-gray-50 dark:bg-secondary-950" }, [
                  createVNode("div", { class: "flex items-center gap-1" }, [
                    createVNode(_component_UIcon, {
                      name: "heroicons-eye-dropper",
                      class: "text-info w-5 h-5"
                    }),
                    createVNode("span", { class: "text-xs font-bold" }, "\u0644\u0648\u0646 \u0627\u0644\u0633\u064A\u0627\u0631\u0629")
                  ]),
                  createVNode("div", { class: "text-info" }, toDisplayString(_ctx.driver.car_color), 1)
                ]),
                createVNode("div", { class: "flex justify-between items-center px-4 py-2 rounded-sm bg-gray-50 dark:bg-secondary-950" }, [
                  createVNode("div", { class: "flex items-center gap-1" }, [
                    createVNode(_component_UIcon, {
                      name: "i-heroicons-user-group-solid",
                      class: "text-error w-5 h-5"
                    }),
                    createVNode("span", { class: "text-xs font-bold" }, "\u0627\u0644\u0633\u0639\u0629 \u0627\u0644\u0642\u0635\u0648\u0649")
                  ]),
                  createVNode("div", { class: "text-error text-sm flex items-center gap-1" }, [
                    createVNode("div", { class: "font-bold" }, toDisplayString(_ctx.driver.maximum_capacity), 1),
                    createVNode("div", { class: "font-semibold" }, "\u0637\u0627\u0644\u0628")
                  ])
                ]),
                createVNode("div", { class: "flex justify-between items-center px-4 py-2 rounded-sm bg-gray-50 dark:bg-secondary-950" }, [
                  createVNode("div", { class: "flex items-center gap-1" }, [
                    createVNode(_component_UIcon, {
                      name: "i-heroicons-cube",
                      class: "text-gray-400 w-5 h-5"
                    }),
                    createVNode("span", { class: "text-xs font-bold" }, "\u0627\u0644\u0645\u0642\u0627\u0639\u062F \u0627\u0644\u0641\u0627\u0631\u063A\u0629")
                  ]),
                  createVNode("div", {
                    class: ["text-sm flex items-center gap-1", `text-${((_e = _ctx.driver.maximum_capacity) != null ? _e : 0) - ((_f = _ctx.driver.studentsCount) != null ? _f : 0) > 0 ? "success" : "error"}`]
                  }, [
                    createVNode("div", { class: "font-bold" }, toDisplayString(((_g = _ctx.driver.maximum_capacity) != null ? _g : 0) - ((_h = _ctx.driver.studentsCount) != null ? _h : 0)), 1),
                    createVNode("div", { class: "font-semibold" }, "\u0645\u0642\u0639\u062F")
                  ], 2)
                ]),
                createVNode("div", { class: "grid grid-cols-1 md:grid-cols-4 gap-2 mt-5 text-center" }, [
                  createVNode(_component_UButton, {
                    label: "\u0639\u0631\u0636 \u0627\u0644\u0637\u0644\u0627\u0628",
                    class: "hover:cursor-pointer md:col-span-3 flex justify-center",
                    color: "secondary",
                    variant: "subtle",
                    onClick: ($event) => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))({
                      name: "students-view-students_table",
                      query: { driver_id: _ctx.driver.id }
                    })
                  }, null, 8, ["onClick"]),
                  createVNode(_component_UButton, {
                    label: "\u062A\u0639\u062F\u064A\u0644",
                    class: "hover:cursor-pointer flex justify-center",
                    color: "secondary",
                    variant: "solid",
                    onClick: ($event) => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))({
                      name: "drivers-id-edit_driver",
                      params: { id: _ctx.driver.id }
                    })
                  }, null, 8, ["onClick"])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/drivers/card.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const driversStore = useDriversStore();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_BaseHeader = _sfc_main$2;
      const _component_UButton = _sfc_main$7;
      const _component_DriversCard = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_BaseHeader, {
        title: "\u0627\u0644\u0633\u0627\u0626\u0642\u064A\u0646",
        description: "\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0633\u0627\u0626\u0642\u064A\u0646"
      }, {
        actions: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UButton, {
              icon: "heroicons-plus-circle-20-solid",
              size: "md",
              color: "secondary",
              class: "bg-blue-600 px-3 py-2 font-bold",
              variant: "solid",
              to: "/drivers/add"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`\u0625\u0636\u0627\u0641\u0629 \u0633\u0627\u0626\u0642 \u062C\u062F\u064A\u062F`);
                } else {
                  return [
                    createTextVNode("\u0625\u0636\u0627\u0641\u0629 \u0633\u0627\u0626\u0642 \u062C\u062F\u064A\u062F")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UButton, {
                icon: "heroicons-plus-circle-20-solid",
                size: "md",
                color: "secondary",
                class: "bg-blue-600 px-3 py-2 font-bold",
                variant: "solid",
                to: "/drivers/add"
              }, {
                default: withCtx(() => [
                  createTextVNode("\u0625\u0636\u0627\u0641\u0629 \u0633\u0627\u0626\u0642 \u062C\u062F\u064A\u062F")
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 mt-5"><!--[-->`);
      ssrRenderList(unref(driversStore).driversWithStudentsCount, (driver) => {
        _push(ssrRenderComponent(_component_DriversCard, {
          key: driver.id,
          driver
        }, null, _parent));
      });
      _push(`<!--]--></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/drivers/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-D-etHiLc.mjs.map
