import { _ as _sfc_main$2 } from './header-CXonAB11.mjs';
import { e as _sfc_main$7, c as _sfc_main$b, n as navigateTo } from './server.mjs';
import { _ as _sfc_main$3 } from './Card-ClkFNDdW.mjs';
import { _ as _sfc_main$4 } from './Badge-CPUrxw_P.mjs';
import { defineComponent, computed, withCtx, createTextVNode, createVNode, unref, mergeProps, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderClass } from 'vue/server-renderer';
import { u as useLevelsStore } from './levels-wubGyWhj.mjs';
import { u as useStudentStore } from './students-C5l8o5u3.mjs';
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
import './useAppToast-BZDaw0os.mjs';
import './api-Bx7QNuNm.mjs';
import 'axios';
import './constants-CI-Eb238.mjs';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "card",
  __ssrInlineRender: true,
  props: {
    level: {}
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
              name: "heroicons-academic-cap-16-solid",
              class: "text-secondary w-8 h-8"
            }, null, _parent2, _scopeId));
            _push2(`<span class="text-secondary-600 font-semibold"${_scopeId}>${ssrInterpolate(_ctx.level.title)}</span></div><div${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UBadge, {
              label: `${_ctx.level.studentsCount} \u0637\u0627\u0644\u0628`,
              variant: "soft",
              color: "secondary",
              class: "text-secondary-600 font-bold"
            }, null, _parent2, _scopeId));
            _push2(`</div></div><div class="flex flex-col gap-5 mt-5"${_scopeId}><div class="flex justify-between items-center px-4 py-2 rounded-sm bg-gray-50 dark:bg-secondary-950"${_scopeId}><div class="flex items-center gap-1"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "heroicons-user-group-solid",
              class: "text-secondary w-5 h-5"
            }, null, _parent2, _scopeId));
            _push2(`<span class="text-xs font-bold"${_scopeId}>\u0639\u062F\u062F \u0627\u0644\u0637\u0644\u0627\u0628</span></div><div class="font-bold text-secondary-600"${_scopeId}>${ssrInterpolate(_ctx.level.studentsCount)}</div></div><div class="flex justify-between items-center px-4 py-2 rounded-sm bg-gray-50 dark:bg-secondary-950"${_scopeId}><div class="flex items-center gap-1"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-user-group-solid",
              class: "text-error w-5 h-5"
            }, null, _parent2, _scopeId));
            _push2(`<span class="text-xs font-bold"${_scopeId}>\u0627\u0644\u0633\u0639\u0629 \u0627\u0644\u0642\u0635\u0648\u0649</span></div><div class="text-error text-sm flex items-center gap-1"${_scopeId}><div class="font-bold"${_scopeId}>${ssrInterpolate(_ctx.level.maximum_capacity)}</div><div class="font-semibold"${_scopeId}>\u0637\u0627\u0644\u0628</div></div></div><div class="flex justify-between items-center px-4 py-2 rounded-sm bg-gray-50 dark:bg-secondary-950"${_scopeId}><div class="flex items-center gap-1"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "heroicons-currency-dollar-20-solid",
              class: "text-warning w-5 h-5"
            }, null, _parent2, _scopeId));
            _push2(`<span class="text-xs font-bold"${_scopeId}>\u0627\u0644\u0631\u0633\u0648\u0645 \u0627\u0644\u0634\u0647\u0631\u064A\u0629</span></div><div class="text-warning text-sm flex items-center gap-1"${_scopeId}><div class="font-bold"${_scopeId}>${ssrInterpolate(_ctx.level.fees)}</div><div class="font-semibold"${_scopeId}>\u0634\u064A\u0643\u0644</div></div></div><div class="flex justify-between items-center px-4 py-2 rounded-sm bg-gray-50 dark:bg-secondary-950"${_scopeId}><div class="flex items-center gap-1"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-cube",
              class: "text-gray-400 w-5 h-5"
            }, null, _parent2, _scopeId));
            _push2(`<span class="text-xs font-bold"${_scopeId}>\u0627\u0644\u0645\u0642\u0627\u0639\u062F \u0627\u0644\u0641\u0627\u0631\u063A\u0629</span></div><div class="${ssrRenderClass([`text-${((_a = _ctx.level.maximum_capacity) != null ? _a : 0) - ((_b = _ctx.level.studentsCount) != null ? _b : 0) > 0 ? "success" : "error"}`, "text-sm flex items-center gap-1"])}"${_scopeId}><div class="font-bold"${_scopeId}>${ssrInterpolate(((_c = _ctx.level.maximum_capacity) != null ? _c : 0) - ((_d = _ctx.level.studentsCount) != null ? _d : 0))}</div><div class="font-semibold"${_scopeId}>\u0645\u0642\u0639\u062F</div></div></div><div class="grid grid-cols-4 gap-2 text-center"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UButton, {
              label: "\u0639\u0631\u0636 \u0627\u0644\u0637\u0644\u0627\u0628",
              class: "hover:cursor-pointer col-span-3 flex justify-center",
              color: "secondary",
              variant: "subtle",
              onClick: ($event) => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))({
                name: "students-view-students_table",
                query: { level: _ctx.level.title }
              })
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UButton, {
              label: "\u062A\u0639\u062F\u064A\u0644",
              class: "hover:cursor-pointer flex justify-center",
              color: "secondary",
              variant: "solid",
              onClick: ($event) => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))({
                name: "levels-id-edit_level",
                params: { id: _ctx.level.id }
              })
            }, null, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "flex justify-between" }, [
                createVNode("div", { class: "flex items-center gap-1" }, [
                  createVNode(_component_UIcon, {
                    name: "heroicons-academic-cap-16-solid",
                    class: "text-secondary w-8 h-8"
                  }),
                  createVNode("span", { class: "text-secondary-600 font-semibold" }, toDisplayString(_ctx.level.title), 1)
                ]),
                createVNode("div", null, [
                  createVNode(_component_UBadge, {
                    label: `${_ctx.level.studentsCount} \u0637\u0627\u0644\u0628`,
                    variant: "soft",
                    color: "secondary",
                    class: "text-secondary-600 font-bold"
                  }, null, 8, ["label"])
                ])
              ]),
              createVNode("div", { class: "flex flex-col gap-5 mt-5" }, [
                createVNode("div", { class: "flex justify-between items-center px-4 py-2 rounded-sm bg-gray-50 dark:bg-secondary-950" }, [
                  createVNode("div", { class: "flex items-center gap-1" }, [
                    createVNode(_component_UIcon, {
                      name: "heroicons-user-group-solid",
                      class: "text-secondary w-5 h-5"
                    }),
                    createVNode("span", { class: "text-xs font-bold" }, "\u0639\u062F\u062F \u0627\u0644\u0637\u0644\u0627\u0628")
                  ]),
                  createVNode("div", { class: "font-bold text-secondary-600" }, toDisplayString(_ctx.level.studentsCount), 1)
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
                    createVNode("div", { class: "font-bold" }, toDisplayString(_ctx.level.maximum_capacity), 1),
                    createVNode("div", { class: "font-semibold" }, "\u0637\u0627\u0644\u0628")
                  ])
                ]),
                createVNode("div", { class: "flex justify-between items-center px-4 py-2 rounded-sm bg-gray-50 dark:bg-secondary-950" }, [
                  createVNode("div", { class: "flex items-center gap-1" }, [
                    createVNode(_component_UIcon, {
                      name: "heroicons-currency-dollar-20-solid",
                      class: "text-warning w-5 h-5"
                    }),
                    createVNode("span", { class: "text-xs font-bold" }, "\u0627\u0644\u0631\u0633\u0648\u0645 \u0627\u0644\u0634\u0647\u0631\u064A\u0629")
                  ]),
                  createVNode("div", { class: "text-warning text-sm flex items-center gap-1" }, [
                    createVNode("div", { class: "font-bold" }, toDisplayString(_ctx.level.fees), 1),
                    createVNode("div", { class: "font-semibold" }, "\u0634\u064A\u0643\u0644")
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
                    class: ["text-sm flex items-center gap-1", `text-${((_e = _ctx.level.maximum_capacity) != null ? _e : 0) - ((_f = _ctx.level.studentsCount) != null ? _f : 0) > 0 ? "success" : "error"}`]
                  }, [
                    createVNode("div", { class: "font-bold" }, toDisplayString(((_g = _ctx.level.maximum_capacity) != null ? _g : 0) - ((_h = _ctx.level.studentsCount) != null ? _h : 0)), 1),
                    createVNode("div", { class: "font-semibold" }, "\u0645\u0642\u0639\u062F")
                  ], 2)
                ]),
                createVNode("div", { class: "grid grid-cols-4 gap-2 text-center" }, [
                  createVNode(_component_UButton, {
                    label: "\u0639\u0631\u0636 \u0627\u0644\u0637\u0644\u0627\u0628",
                    class: "hover:cursor-pointer col-span-3 flex justify-center",
                    color: "secondary",
                    variant: "subtle",
                    onClick: ($event) => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))({
                      name: "students-view-students_table",
                      query: { level: _ctx.level.title }
                    })
                  }, null, 8, ["onClick"]),
                  createVNode(_component_UButton, {
                    label: "\u062A\u0639\u062F\u064A\u0644",
                    class: "hover:cursor-pointer flex justify-center",
                    color: "secondary",
                    variant: "solid",
                    onClick: ($event) => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))({
                      name: "levels-id-edit_level",
                      params: { id: _ctx.level.id }
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/levels/card.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const levelsStore = useLevelsStore();
    const studentsStore = useStudentStore();
    const levelsWithStudentsCount = computed(() => {
      return levelsStore.levelsData.map((level) => {
        const count = studentsStore.studentsData.filter(
          (s) => s.level === level.title
        ).length;
        return { ...level, studentsCount: count };
      });
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_BaseHeader = _sfc_main$2;
      const _component_UButton = _sfc_main$7;
      const _component_LevelsCard = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_BaseHeader, {
        title: "\u0627\u0644\u0645\u0633\u062A\u0648\u064A\u0627\u062A",
        description: "\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0645\u0631\u0627\u062D\u0644 \u0627\u0644\u062A\u0639\u0644\u064A\u0645\u064A\u0629 \u0648\u0627\u0644\u0635\u0641\u0648\u0641 \u0627\u0644\u062F\u0631\u0627\u0633\u064A\u0629"
      }, {
        actions: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UButton, {
              icon: "heroicons-plus-circle-20-solid",
              size: "md",
              color: "secondary",
              class: "bg-blue-600 px-3 py-2 font-bold",
              variant: "solid",
              to: "/levels/add"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`\u0625\u0636\u0627\u0641\u0629 \u0645\u0633\u062A\u0648\u0649 \u062C\u062F\u064A\u062F`);
                } else {
                  return [
                    createTextVNode("\u0625\u0636\u0627\u0641\u0629 \u0645\u0633\u062A\u0648\u0649 \u062C\u062F\u064A\u062F")
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
                to: "/levels/add"
              }, {
                default: withCtx(() => [
                  createTextVNode("\u0625\u0636\u0627\u0641\u0629 \u0645\u0633\u062A\u0648\u0649 \u062C\u062F\u064A\u062F")
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="grid lg:grid-cols-3 gap-4 mt-5"><!--[-->`);
      ssrRenderList(unref(levelsWithStudentsCount), (level) => {
        _push(ssrRenderComponent(_component_LevelsCard, {
          key: level.id,
          level
        }, null, _parent));
      });
      _push(`<!--]--></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/levels/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-DMEJqpTD.mjs.map
