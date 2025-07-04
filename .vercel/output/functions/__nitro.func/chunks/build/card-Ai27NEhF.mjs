import { _ as _sfc_main$1 } from './Card-ClkFNDdW.mjs';
import { g as useRoute, c as _sfc_main$b, e as _sfc_main$7, n as navigateTo } from './server.mjs';
import { _ as _sfc_main$2 } from './Badge-CPUrxw_P.mjs';
import { defineComponent, computed, mergeProps, withCtx, unref, createVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate, ssrRenderClass } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "card",
  __ssrInlineRender: true,
  props: {
    _class: {}
  },
  setup(__props) {
    const route = useRoute();
    console.log(route.path.split("/")[route.path.split("/").length - 1]);
    const classT = route.path.split("/")[route.path.split("/").length - 1];
    const classType = computed(
      () => classT === "academic_classes" ? "academic" : classT === "quran_classes" ? "quran" : ""
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UCard = _sfc_main$1;
      const _component_UIcon = _sfc_main$b;
      const _component_UBadge = _sfc_main$2;
      const _component_UButton = _sfc_main$7;
      _push(ssrRenderComponent(_component_UCard, mergeProps({ class: "h-full border-t-4 border-secondary hover:shadow-xl transition-all" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a, _b, _c, _d, _e, _f, _g, _h;
          if (_push2) {
            _push2(`<div class="flex justify-between"${_scopeId}><div class="flex items-center gap-1"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-presentation-chart-bar",
              class: "text-secondary w-8 h-8"
            }, null, _parent2, _scopeId));
            _push2(`<span class="text-secondary-600 font-semibold"${_scopeId}>${ssrInterpolate(_ctx._class.title)}</span></div><div${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UBadge, {
              label: `\u0627\u0644\u0634\u0639\u0628\u0629: ${_ctx._class.group}`,
              variant: "soft",
              color: "secondary",
              class: "text-secondary-600 font-bold"
            }, null, _parent2, _scopeId));
            _push2(`</div></div><div class="flex flex-col gap-5 mt-5"${_scopeId}><div class="flex justify-between items-center px-4 py-2 rounded-sm bg-gray-50 dark:bg-secondary-950"${_scopeId}><div class="flex items-center gap-1"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "heroicons-user-group-solid",
              class: "text-secondary w-5 h-5"
            }, null, _parent2, _scopeId));
            _push2(`<span class="text-xs font-bold"${_scopeId}>\u0639\u062F\u062F \u0627\u0644\u0637\u0644\u0627\u0628</span></div><div class="font-bold text-secondary-600"${_scopeId}>${ssrInterpolate(_ctx._class.studentsCount)}</div></div><div class="flex justify-between items-center px-4 py-2 rounded-sm bg-gray-50 dark:bg-secondary-950"${_scopeId}><div class="flex items-center gap-1"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-user-group-solid",
              class: "text-error w-5 h-5"
            }, null, _parent2, _scopeId));
            _push2(`<span class="text-xs font-bold"${_scopeId}>\u0627\u0644\u0633\u0639\u0629 \u0627\u0644\u0642\u0635\u0648\u0649</span></div><div class="text-error text-sm flex items-center gap-1"${_scopeId}><div class="font-bold"${_scopeId}>${ssrInterpolate(_ctx._class.maximum_capacity)}</div><div class="font-semibold"${_scopeId}>\u0637\u0627\u0644\u0628</div></div></div><div class="flex justify-between items-center px-4 py-2 rounded-sm bg-gray-50 dark:bg-secondary-950"${_scopeId}><div class="flex items-center gap-1"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-cube",
              class: "text-gray-400 w-5 h-5"
            }, null, _parent2, _scopeId));
            _push2(`<span class="text-xs font-bold"${_scopeId}>\u0627\u0644\u0645\u0642\u0627\u0639\u062F \u0627\u0644\u0641\u0627\u0631\u063A\u0629</span></div><div class="${ssrRenderClass([`text-${((_a = _ctx._class.maximum_capacity) != null ? _a : 0) - ((_b = _ctx._class.studentsCount) != null ? _b : 0) > 0 ? "success" : "error"}`, "text-sm flex items-center gap-1"])}"${_scopeId}><div class="font-bold"${_scopeId}>${ssrInterpolate(((_c = _ctx._class.maximum_capacity) != null ? _c : 0) - ((_d = _ctx._class.studentsCount) != null ? _d : 0))}</div><div class="font-semibold"${_scopeId}>\u0645\u0642\u0639\u062F</div></div></div><div class="flex justify-between items-center px-4 py-2 rounded-sm bg-gray-50 dark:bg-secondary-950"${_scopeId}><div class="flex items-center gap-1"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "heroicons-building-library",
              class: "w-5 h-5 text-info"
            }, null, _parent2, _scopeId));
            _push2(`<span class="text-xs font-bold"${_scopeId}>\u0627\u0644\u0637\u0627\u0628\u0642</span></div><div class="text-warning text-sm flex items-center gap-1"${_scopeId}><div class="font-bold"${_scopeId}>${ssrInterpolate(_ctx._class.floor)}</div></div></div><div class="flex justify-between items-center px-4 py-2 rounded-sm bg-gray-50 dark:bg-secondary-950"${_scopeId}><div class="flex items-center gap-1"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-globe-alt",
              class: "text-info w-5 h-5"
            }, null, _parent2, _scopeId));
            _push2(`<span class="text-xs font-bold"${_scopeId}>\u0627\u0644\u062C\u0647\u0629</span></div><div class="text-warning text-sm flex items-center gap-1"${_scopeId}><div class="font-bold"${_scopeId}>${ssrInterpolate(_ctx._class.wing)}</div></div></div><div class="grid grid-cols-4 gap-2 text-center"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UButton, {
              label: "\u0639\u0631\u0636 \u0627\u0644\u0637\u0644\u0627\u0628",
              class: "hover:cursor-pointer col-span-3 flex justify-center",
              color: "secondary",
              variant: "subtle",
              onClick: ($event) => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))({
                name: "students-view-students_table",
                query: {
                  level: _ctx._class.title,
                  class_group: _ctx._class.group,
                  classType: unref(classType)
                }
              })
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UButton, {
              label: "\u062A\u0639\u062F\u064A\u0644",
              class: "hover:cursor-pointer flex justify-center",
              color: "secondary",
              variant: "solid",
              onClick: ($event) => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))({
                name: "classes-id-edit_class",
                params: { id: _ctx._class.id },
                query: { classType: unref(classType) }
              })
            }, null, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "flex justify-between" }, [
                createVNode("div", { class: "flex items-center gap-1" }, [
                  createVNode(_component_UIcon, {
                    name: "i-heroicons-presentation-chart-bar",
                    class: "text-secondary w-8 h-8"
                  }),
                  createVNode("span", { class: "text-secondary-600 font-semibold" }, toDisplayString(_ctx._class.title), 1)
                ]),
                createVNode("div", null, [
                  createVNode(_component_UBadge, {
                    label: `\u0627\u0644\u0634\u0639\u0628\u0629: ${_ctx._class.group}`,
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
                  createVNode("div", { class: "font-bold text-secondary-600" }, toDisplayString(_ctx._class.studentsCount), 1)
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
                    createVNode("div", { class: "font-bold" }, toDisplayString(_ctx._class.maximum_capacity), 1),
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
                    class: ["text-sm flex items-center gap-1", `text-${((_e = _ctx._class.maximum_capacity) != null ? _e : 0) - ((_f = _ctx._class.studentsCount) != null ? _f : 0) > 0 ? "success" : "error"}`]
                  }, [
                    createVNode("div", { class: "font-bold" }, toDisplayString(((_g = _ctx._class.maximum_capacity) != null ? _g : 0) - ((_h = _ctx._class.studentsCount) != null ? _h : 0)), 1),
                    createVNode("div", { class: "font-semibold" }, "\u0645\u0642\u0639\u062F")
                  ], 2)
                ]),
                createVNode("div", { class: "flex justify-between items-center px-4 py-2 rounded-sm bg-gray-50 dark:bg-secondary-950" }, [
                  createVNode("div", { class: "flex items-center gap-1" }, [
                    createVNode(_component_UIcon, {
                      name: "heroicons-building-library",
                      class: "w-5 h-5 text-info"
                    }),
                    createVNode("span", { class: "text-xs font-bold" }, "\u0627\u0644\u0637\u0627\u0628\u0642")
                  ]),
                  createVNode("div", { class: "text-warning text-sm flex items-center gap-1" }, [
                    createVNode("div", { class: "font-bold" }, toDisplayString(_ctx._class.floor), 1)
                  ])
                ]),
                createVNode("div", { class: "flex justify-between items-center px-4 py-2 rounded-sm bg-gray-50 dark:bg-secondary-950" }, [
                  createVNode("div", { class: "flex items-center gap-1" }, [
                    createVNode(_component_UIcon, {
                      name: "i-heroicons-globe-alt",
                      class: "text-info w-5 h-5"
                    }),
                    createVNode("span", { class: "text-xs font-bold" }, "\u0627\u0644\u062C\u0647\u0629")
                  ]),
                  createVNode("div", { class: "text-warning text-sm flex items-center gap-1" }, [
                    createVNode("div", { class: "font-bold" }, toDisplayString(_ctx._class.wing), 1)
                  ])
                ]),
                createVNode("div", { class: "grid grid-cols-4 gap-2 text-center" }, [
                  createVNode(_component_UButton, {
                    label: "\u0639\u0631\u0636 \u0627\u0644\u0637\u0644\u0627\u0628",
                    class: "hover:cursor-pointer col-span-3 flex justify-center",
                    color: "secondary",
                    variant: "subtle",
                    onClick: ($event) => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))({
                      name: "students-view-students_table",
                      query: {
                        level: _ctx._class.title,
                        class_group: _ctx._class.group,
                        classType: unref(classType)
                      }
                    })
                  }, null, 8, ["onClick"]),
                  createVNode(_component_UButton, {
                    label: "\u062A\u0639\u062F\u064A\u0644",
                    class: "hover:cursor-pointer flex justify-center",
                    color: "secondary",
                    variant: "solid",
                    onClick: ($event) => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))({
                      name: "classes-id-edit_class",
                      params: { id: _ctx._class.id },
                      query: { classType: unref(classType) }
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
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/classes/card.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=card-Ai27NEhF.mjs.map
