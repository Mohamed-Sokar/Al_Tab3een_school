import { _ as _sfc_main$5 } from './header-CXonAB11.mjs';
import { _ as __nuxt_component_3 } from './fadeTransition-CbF_NhQl.mjs';
import { defineComponent, shallowRef, computed, unref, withCtx, createVNode, resolveDynamicComponent, createBlock, openBlock, KeepAlive, mergeProps, createTextVNode, toDisplayString, createElementBlock, Fragment, createElementVNode, createCommentVNode, renderSlot, normalizeClass, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrRenderVNode, ssrInterpolate, ssrRenderSlot } from 'vue/server-renderer';
import { Primitive } from 'reka-ui';
import { a as __nuxt_component_0$2, c as _sfc_main$b, b as useAppConfig, t as tv } from './server.mjs';
import { _ as _sfc_main$6 } from './Card-ClkFNDdW.mjs';
import { u as useStudentStore } from './students-C5l8o5u3.mjs';
import { u as useTeachersStore } from './teachers-Cx5Wl_TR.mjs';
import { u as usePaymentsStore } from './paymnets-DpmBuoF8.mjs';
import { u as useLevelsStore } from './levels-wubGyWhj.mjs';
import { Donut, Orientation, StackedBar, GroupedBar } from '@unovis/ts';
import { VisSingleContainer, VisTooltip, VisDonut, VisBulletLegend, VisXYContainer, VisStackedBar, VisGroupedBar, VisAxis } from '@unovis/vue';
import { u as useColorMode } from './composables-K6fOgyxT.mjs';
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
import './constants-CI-Eb238.mjs';
import './api-Bx7QNuNm.mjs';
import 'axios';

const theme = {
  "base": "animate-pulse rounded-md bg-elevated"
};
const _sfc_main$4 = {
  __name: "Skeleton",
  __ssrInlineRender: true,
  props: {
    as: { type: null, required: false },
    class: { type: null, required: false }
  },
  setup(__props) {
    const props = __props;
    const appConfig = useAppConfig();
    const ui = computed(() => {
      var _a;
      return tv({ extend: tv(theme), ...((_a = appConfig.ui) == null ? void 0 : _a.skeleton) || {} });
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(Primitive), mergeProps({
        as: __props.as,
        "aria-busy": "true",
        "aria-label": "loading",
        "aria-live": "polite",
        role: "alert",
        class: ui.value({ class: props.class })
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
};
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui/dist/runtime/components/Skeleton.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "card",
  __ssrInlineRender: true,
  props: {
    color: {},
    to: {},
    title: {},
    value: {},
    iconName: {},
    loading: { type: Boolean }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      const _component_USkeleton = _sfc_main$4;
      const _component_NuxtLink = __nuxt_component_0$2;
      const _component_u_card = _sfc_main$6;
      const _component_UIcon = _sfc_main$b;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      if (_ctx.loading) {
        _push(`<div class="grid gap-2">`);
        _push(ssrRenderComponent(_component_USkeleton, { class: "h-8 w-[350px]" }, null, _parent));
        _push(ssrRenderComponent(_component_USkeleton, { class: "h-8 w-[350px]" }, null, _parent));
        _push(ssrRenderComponent(_component_USkeleton, { class: "h-8 w-[350px]" }, null, _parent));
        _push(`</div>`);
      } else {
        _push(ssrRenderComponent(_component_NuxtLink, {
          class: "hover:translate-y-1 transition-all",
          to: _ctx.to
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_u_card, {
                class: ["h-full border-t-4", `border-${_ctx.color || "secondary"}`]
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="flex justify-between mb-3"${_scopeId2}><div class="flex gap-2 items-center"${_scopeId2}><div class="font-bold"${_scopeId2}>${ssrInterpolate(props.title)}</div></div><div class="font-bold text-lg"${_scopeId2}>`);
                    _push3(ssrRenderComponent(_component_UIcon, {
                      name: _ctx.iconName || "i-lucide-lightbulb",
                      class: ["size-7", `text-${_ctx.color ? _ctx.color : "primary"}`]
                    }, null, _parent3, _scopeId2));
                    _push3(`</div></div><div class="${ssrRenderClass([`text-${typeof _ctx.value === "number" && _ctx.value < 0 ? "error" : _ctx.color ? _ctx.color : "secondary"}`, "font-bold text-2xl border w-30 p-1 rounded-md flex justify-center items-center"])}"${_scopeId2}>${ssrInterpolate(_ctx.value)}</div>`);
                  } else {
                    return [
                      createVNode("div", { class: "flex justify-between mb-3" }, [
                        createVNode("div", { class: "flex gap-2 items-center" }, [
                          createVNode("div", { class: "font-bold" }, toDisplayString(props.title), 1)
                        ]),
                        createVNode("div", { class: "font-bold text-lg" }, [
                          createVNode(_component_UIcon, {
                            name: _ctx.iconName || "i-lucide-lightbulb",
                            class: ["size-7", `text-${_ctx.color ? _ctx.color : "primary"}`]
                          }, null, 8, ["name", "class"])
                        ])
                      ]),
                      createVNode("div", {
                        class: ["font-bold text-2xl border w-30 p-1 rounded-md flex justify-center items-center", `text-${typeof _ctx.value === "number" && _ctx.value < 0 ? "error" : _ctx.color ? _ctx.color : "secondary"}`]
                      }, toDisplayString(_ctx.value), 3)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_u_card, {
                  class: ["h-full border-t-4", `border-${_ctx.color || "secondary"}`]
                }, {
                  default: withCtx(() => [
                    createVNode("div", { class: "flex justify-between mb-3" }, [
                      createVNode("div", { class: "flex gap-2 items-center" }, [
                        createVNode("div", { class: "font-bold" }, toDisplayString(props.title), 1)
                      ]),
                      createVNode("div", { class: "font-bold text-lg" }, [
                        createVNode(_component_UIcon, {
                          name: _ctx.iconName || "i-lucide-lightbulb",
                          class: ["size-7", `text-${_ctx.color ? _ctx.color : "primary"}`]
                        }, null, 8, ["name", "class"])
                      ])
                    ]),
                    createVNode("div", {
                      class: ["font-bold text-2xl border w-30 p-1 rounded-md flex justify-center items-center", `text-${typeof _ctx.value === "number" && _ctx.value < 0 ? "error" : _ctx.color ? _ctx.color : "secondary"}`]
                    }, toDisplayString(_ctx.value), 3)
                  ]),
                  _: 1
                }, 8, ["class"])
              ];
            }
          }),
          _: 1
        }, _parent));
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/home/card.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "overview",
  __ssrInlineRender: true,
  setup(__props) {
    const studentsStore = useStudentStore();
    const {
      teachersData,
      behavioralIssuesTeachersData,
      // teachersUpsentReportsData,
      teachersLoansData
    } = useTeachersStore();
    const paymentsStore = usePaymentsStore();
    const { levelsData } = useLevelsStore();
    const totalPayments = computed(
      () => paymentsStore.totalPayments.reduce((sum, payment) => {
        var _a;
        if (payment.type === "\u062F\u062E\u0644") {
          return sum += payment.amount;
        } else {
          return sum -= (_a = payment.amount) != null ? _a : 0;
        }
      }, 0)
    );
    const totalTeachersLoans = computed(
      () => teachersLoansData.reduce((sum, loan) => {
        return sum += +loan.amount;
      }, 0)
    );
    computed(() => "91.5%");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_HomeCard = _sfc_main$3;
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">`);
      _push(ssrRenderComponent(_component_HomeCard, {
        to: "/students/view/students_table",
        title: "\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0637\u0644\u0627\u0628",
        value: unref(studentsStore).sortedStudents.length,
        color: "secondary",
        "icon-name": "i-heroicons-users",
        loading: unref(studentsStore).loading
      }, null, _parent));
      _push(ssrRenderComponent(_component_HomeCard, {
        to: "/teachers/view",
        title: "\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0645\u0639\u0644\u0645\u064A\u0646",
        value: unref(teachersData).length,
        color: "secondary",
        "icon-name": "i-heroicons-users",
        loading: unref(studentsStore).loading
      }, null, _parent));
      _push(ssrRenderComponent(_component_HomeCard, {
        to: "/payments",
        title: "\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0635\u0627\u062F\u0631 \u0648\u0627\u0644\u0648\u0627\u0631\u062F",
        value: unref(totalPayments),
        color: "warning",
        "icon-name": "i-heroicons-currency-dollar",
        loading: unref(studentsStore).loading
      }, null, _parent));
      _push(ssrRenderComponent(_component_HomeCard, {
        to: "/teachers/view/loans",
        title: "\u0645\u062C\u0645\u0648\u0639 \u0633\u0644\u0641 \u0627\u0644\u0645\u062F\u0631\u0633\u064A\u0646",
        value: unref(totalTeachersLoans),
        color: "warning",
        "icon-name": "i-heroicons-currency-dollar",
        loading: unref(studentsStore).loading
      }, null, _parent));
      _push(ssrRenderComponent(_component_HomeCard, {
        to: "/students/view/behavioral_issues",
        title: "\u0645\u062C\u0645\u0648\u0639 \u0627\u0644\u0645\u062E\u0627\u0644\u0641\u0627\u062A \u0627\u0644\u0633\u0644\u0648\u0643\u064A\u0629 \u0644\u0644\u0637\u0644\u0627\u0628",
        value: unref(studentsStore).sortedIssues.length,
        color: "error",
        "icon-name": "i-heroicons-exclamation-triangle",
        loading: unref(studentsStore).loading
      }, null, _parent));
      _push(ssrRenderComponent(_component_HomeCard, {
        to: "/teachers/view/behavioral_issues",
        title: "\u0645\u062C\u0645\u0648\u0639 \u0627\u0644\u0645\u062E\u0627\u0644\u0641\u0627\u062A \u0627\u0644\u0625\u062F\u0627\u0631\u064A\u0629 \u0644\u0644\u0645\u0639\u0644\u0645\u064A\u0646",
        value: unref(behavioralIssuesTeachersData).length,
        color: "error",
        "icon-name": "i-heroicons-exclamation-triangle",
        loading: unref(studentsStore).loading
      }, null, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/home/overview.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
var l = /* @__PURE__ */ ((a) => (a.Top = "top", a.Bottom = "bottom", a))(l || {});
const S = /* @__PURE__ */ defineComponent({
  __name: "BarChart",
  props: {
    data: {},
    stacked: { type: Boolean },
    height: {},
    xLabel: {},
    yLabel: {},
    padding: { default: () => ({
      top: 5,
      right: 5,
      bottom: 5,
      left: 5
    }) },
    categories: {},
    xFormatter: {},
    yFormatter: {},
    yNumTicks: { default: (a) => a.data.length > 24 ? 24 / 4 : a.data.length - 1 },
    minMaxTicksOnly: { type: Boolean },
    xNumTicks: { default: (a) => a.data.length > 24 ? 24 / 4 : a.data.length - 1 },
    xExplicitTicks: {},
    yAxis: {},
    groupPadding: {},
    barPadding: {},
    radius: {},
    hideLegend: { type: Boolean },
    orientation: { default: Orientation.Vertical },
    legendPosition: {},
    xDomainLine: { type: Boolean },
    yDomainLine: { type: Boolean },
    xTickLine: { type: Boolean },
    yTickLine: { type: Boolean },
    xGridLine: { type: Boolean },
    yGridLine: { type: Boolean, default: true }
  },
  setup(a) {
    const n = a;
    if (!n.yAxis || n.yAxis.length === 0)
      throw new Error("yAxis is required");
    const m = computed(() => n.yAxis.map((e) => (t) => t[e])), p = (e, t) => Object.values(n.categories)[t].color, g = computed(
      () => n.legendPosition === l.Top
    ), y = computed(() => (e, t) => {
      return "";
    });
    return (e, t) => (openBlock(), createElementBlock("div", {
      class: normalizeClass(["flex flex-col space-y-4", { "flex-col-reverse": g.value }])
    }, [
      createVNode(unref(VisXYContainer), {
        padding: e.padding,
        height: e.height
      }, {
        default: withCtx(() => {
          var _a, _b, _c, _d, _e, _f, _g, _h;
          return [
            createVNode(unref(VisTooltip), {
              triggers: {
                [unref(GroupedBar).selectors.bar]: y.value,
                [unref(StackedBar).selectors.bar]: y.value
              }
            }, null, 8, ["triggers"]),
            e.stacked ? (openBlock(), createBlock(unref(VisStackedBar), {
              key: 1,
              data: e.data,
              x: (u, d) => d,
              y: m.value,
              color: p,
              "rounded-corners": (_a = e.radius) != null ? _a : 0,
              "group-padding": (_b = e.groupPadding) != null ? _b : 0,
              "bar-padding": (_c = e.barPadding) != null ? _c : 0.2,
              orientation: (_d = e.orientation) != null ? _d : unref(Orientation).Vertical
            }, null, 8, ["data", "x", "y", "rounded-corners", "group-padding", "bar-padding", "orientation"])) : (openBlock(), createBlock(unref(VisGroupedBar), {
              key: 0,
              data: e.data,
              x: (u, d) => d,
              y: m.value,
              color: p,
              "rounded-corners": (_e = e.radius) != null ? _e : 0,
              "group-padding": (_f = e.groupPadding) != null ? _f : 0,
              "bar-padding": (_g = e.barPadding) != null ? _g : 0.2,
              orientation: (_h = e.orientation) != null ? _h : unref(Orientation).Vertical
            }, null, 8, ["data", "x", "y", "rounded-corners", "group-padding", "bar-padding", "orientation"])),
            createVNode(unref(VisAxis), {
              type: "x",
              "tick-format": e.xFormatter,
              label: e.xLabel,
              "grid-line": e.xGridLine,
              "domain-line": !!e.xDomainLine,
              "tick-line": e.xTickLine,
              "num-ticks": e.xNumTicks,
              "tick-values": e.xExplicitTicks,
              "min-max-ticks-only": e.minMaxTicksOnly
            }, null, 8, ["tick-format", "label", "grid-line", "domain-line", "tick-line", "num-ticks", "tick-values", "min-max-ticks-only"]),
            createVNode(unref(VisAxis), {
              type: "y",
              label: e.yLabel,
              "grid-line": e.orientation !== unref(Orientation).Horizontal && e.yGridLine,
              "domain-line": !!e.yDomainLine,
              "tick-format": e.yFormatter,
              "num-ticks": e.yNumTicks,
              "tick-line": e.yTickLine
            }, null, 8, ["label", "grid-line", "domain-line", "tick-format", "num-ticks", "tick-line"])
          ];
        }),
        _: 1
      }, 8, ["padding", "height"]),
      e.hideLegend ? createCommentVNode("", true) : (openBlock(), createElementBlock("div", {
        key: 0,
        class: normalizeClass(["flex items center justify-end", { "pb-4": g.value }])
      }, [
        createVNode(unref(VisBulletLegend), {
          items: Object.values(e.categories)
        }, null, 8, ["items"])
      ], 2))
    ], 2));
  }
});
var r = /* @__PURE__ */ ((l2) => (l2.Half = "half", l2.Full = "full", l2))(r || {});
const k = { class: "flex items-center justify-center" }, B = {
  key: 0,
  class: "flex items-center justify-center mt-4"
}, w = /* @__PURE__ */ defineComponent({
  __name: "DonutChart",
  props: {
    type: {},
    data: {},
    height: {},
    radius: {},
    hideLegend: { type: Boolean },
    labels: {}
  },
  setup(l2) {
    const r$1 = l2, s = (e) => e, a = r$1.type === r.Half, d = {
      [Donut.selectors.segment]: (e) => `<div class='flex items-center'><div class='w-2 h-2 rounded-full mr-2' style='background-color: ${r$1.labels[e.index].color} ;'></div>
        <div>${e.data}</div>
      </vistooltip>
    </vissinglecontainer>
  </div>`
    };
    return (e, D) => (openBlock(), createElementBlock(Fragment, null, [
      createElementVNode("div", k, [
        createVNode(unref(VisSingleContainer), {
          data: e.data,
          height: e.height,
          margin: {}
        }, {
          default: withCtx(() => [
            createVNode(unref(VisTooltip), {
              "horizontal-shift": 20,
              "vertical-shift": 20,
              triggers: d
            }),
            createVNode(unref(VisDonut), {
              value: s,
              "corner-radius": e.radius,
              color: r$1.labels.map((c) => c.color),
              "angle-range": a ? [-1.5707963267948966, 1.5707963267948966] : []
            }, null, 8, ["corner-radius", "color", "angle-range"])
          ]),
          _: 1
        }, 8, ["data", "height"]),
        renderSlot(e.$slots, "default")
      ]),
      e.hideLegend ? createCommentVNode("", true) : (openBlock(), createElementBlock("div", B, [
        createVNode(unref(VisBulletLegend), { items: e.labels }, null, 8, ["items"])
      ]))
    ], 64));
  }
});
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "statistics",
  __ssrInlineRender: true,
  setup(__props) {
    const paymentsStore = usePaymentsStore();
    const { levelStudentsCount } = useLevelsStore();
    const colorMode = useColorMode();
    const RevenueData = [
      { level: "\u0627\u0644\u0635\u0641 \u0627\u0644\u0633\u0627\u062F\u0633", mount: levelStudentsCount("\u0627\u0644\u0635\u0641 \u0627\u0644\u0633\u0627\u062F\u0633") },
      { level: "\u0627\u0644\u0635\u0641 \u0627\u0644\u0633\u0627\u0628\u0639", mount: levelStudentsCount("\u0627\u0644\u0635\u0641 \u0627\u0644\u0633\u0627\u0628\u0639") },
      { level: "\u0627\u0644\u0635\u0641 \u0627\u0644\u062B\u0627\u0645\u0646", mount: levelStudentsCount("\u0627\u0644\u0635\u0641 \u0627\u0644\u062B\u0627\u0645\u0646") },
      { level: "\u0627\u0644\u0635\u0641 \u0627\u0644\u062A\u0627\u0633\u0639", mount: levelStudentsCount("\u0627\u0644\u0635\u0641 \u0627\u0644\u062A\u0627\u0633\u0639") }
    ];
    const DonutData = [
      {
        color: "#ff0000",
        name: "\u0627\u0644\u0635\u0627\u062F\u0631",
        value: paymentsStore.totalExpense
      },
      {
        color: "#22c55e",
        name: "\u0627\u0644\u0648\u0627\u0631\u062F",
        value: paymentsStore.totalIncome
      }
    ];
    const RevenueCategories = computed(() => ({
      mount: {
        name: "\u0639\u062F\u062F \u0627\u0644\u0637\u0644\u0627\u0628",
        color: "#267afd"
      }
    }));
    const xFormatter = (i) => {
      var _a;
      return `${(_a = RevenueData[i]) == null ? void 0 : _a.level}`;
    };
    const yFormatter = (i) => `${i}`;
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UCard = _sfc_main$6;
      const _component_DonutChart = w;
      const _component_BarChart = S;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "grid lg:grid-cols-2 gap-5" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_UCard, { class: "h-full flex justify-center items-center" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_DonutChart, {
              data: DonutData.map((i) => i.value),
              height: 200,
              labels: DonutData,
              radius: 1,
              type: "full"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="absolute text-center"${_scopeId2}><div class="font-semibold"${_scopeId2}>\u0627\u0644\u0635\u0627\u062F\u0631 \u0648\u0627\u0644\u0648\u0627\u0631\u062F</div><div class="text-(--ui-text-muted) text-xs mt-3"${_scopeId2}><div${_scopeId2}> \u0627\u0644\u062F\u062E\u0644 : <span class="font-bold text-success"${_scopeId2}>${ssrInterpolate(unref(paymentsStore).totalIncome)}</span></div><div${_scopeId2}> \u0627\u0644\u0645\u0635\u0631\u0648\u0641\u0627\u062A : <span class="font-bold text-error"${_scopeId2}>${ssrInterpolate(unref(paymentsStore).totalExpense)}</span></div></div></div>`);
                } else {
                  return [
                    createVNode("div", { class: "absolute text-center" }, [
                      createVNode("div", { class: "font-semibold" }, "\u0627\u0644\u0635\u0627\u062F\u0631 \u0648\u0627\u0644\u0648\u0627\u0631\u062F"),
                      createVNode("div", { class: "text-(--ui-text-muted) text-xs mt-3" }, [
                        createVNode("div", null, [
                          createTextVNode(" \u0627\u0644\u062F\u062E\u0644 : "),
                          createVNode("span", { class: "font-bold text-success" }, toDisplayString(unref(paymentsStore).totalIncome), 1)
                        ]),
                        createVNode("div", null, [
                          createTextVNode(" \u0627\u0644\u0645\u0635\u0631\u0648\u0641\u0627\u062A : "),
                          createVNode("span", { class: "font-bold text-error" }, toDisplayString(unref(paymentsStore).totalExpense), 1)
                        ])
                      ])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_DonutChart, {
                data: DonutData.map((i) => i.value),
                height: 200,
                labels: DonutData,
                radius: 1,
                type: "full"
              }, {
                default: withCtx(() => [
                  createVNode("div", { class: "absolute text-center" }, [
                    createVNode("div", { class: "font-semibold" }, "\u0627\u0644\u0635\u0627\u062F\u0631 \u0648\u0627\u0644\u0648\u0627\u0631\u062F"),
                    createVNode("div", { class: "text-(--ui-text-muted) text-xs mt-3" }, [
                      createVNode("div", null, [
                        createTextVNode(" \u0627\u0644\u062F\u062E\u0644 : "),
                        createVNode("span", { class: "font-bold text-success" }, toDisplayString(unref(paymentsStore).totalIncome), 1)
                      ]),
                      createVNode("div", null, [
                        createTextVNode(" \u0627\u0644\u0645\u0635\u0631\u0648\u0641\u0627\u062A : "),
                        createVNode("span", { class: "font-bold text-error" }, toDisplayString(unref(paymentsStore).totalExpense), 1)
                      ])
                    ])
                  ])
                ]),
                _: 1
              }, 8, ["data"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UCard, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_BarChart, {
              key: unref(colorMode).value,
              data: RevenueData,
              height: 300,
              categories: unref(RevenueCategories),
              "y-axis": ["mount"],
              xNumTicks: RevenueData.length,
              radius: 5,
              "y-grid-line": true,
              "x-formatter": xFormatter,
              "y-formatter": yFormatter,
              "legend-position": ("LegendPosition" in _ctx ? _ctx.LegendPosition : unref(l)).Top,
              "hide-legend": false
            }, null, _parent2, _scopeId));
          } else {
            return [
              (openBlock(), createBlock(_component_BarChart, {
                key: unref(colorMode).value,
                data: RevenueData,
                height: 300,
                categories: unref(RevenueCategories),
                "y-axis": ["mount"],
                xNumTicks: RevenueData.length,
                radius: 5,
                "y-grid-line": true,
                "x-formatter": xFormatter,
                "y-formatter": yFormatter,
                "legend-position": ("LegendPosition" in _ctx ? _ctx.LegendPosition : unref(l)).Top,
                "hide-legend": false
              }, null, 8, ["categories", "xNumTicks", "legend-position"]))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/home/statistics.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const component = {
      overview: _sfc_main$2,
      statistics: _sfc_main$1
    };
    const componentIsActive = shallowRef(component.overview);
    const isOverview = computed(
      () => componentIsActive.value === component.overview
    );
    const isStatistics = computed(
      () => componentIsActive.value === component.statistics
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_BaseHeader = _sfc_main$5;
      const _component_BaseFadeTransition = __nuxt_component_3;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_BaseHeader, {
        title: "\u0644\u0648\u062D\u0629 \u0627\u0644\u062A\u062D\u0643\u0645",
        description: "\u0645\u0631\u062D\u0628\u0627\u064B \u0628\u0643 \u0641\u064A \u0646\u0638\u0627\u0645 \u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0645\u062F\u0631\u0633\u0629"
      }, null, _parent));
      _push(`<div class="justify-start items-center flex w-50 mt-3 p-[3px] gap-2 mb-4 bg-secondary-50 border border-secondary-200 dark:bg-secondary-950 dark:border-secondary-500 rounded-sm text-sm"><div class="${ssrRenderClass([{
        "bg-secondary text-white": unref(isOverview)
      }, "w-[50%] text-center rounded-sm hover:bg-secondary py-1 hover:text-white hover: cursor-pointer"])}"> \u0646\u0638\u0631\u0629 \u0639\u0627\u0645\u0629 </div><div class="${ssrRenderClass([{ "bg-secondary text-white": unref(isStatistics) }, "w-[50%] text-center rounded-sm hover:bg-secondary py-1 hover:text-white hover: cursor-pointer"])}"> \u0625\u062D\u0635\u0627\u0626\u064A\u0627\u062A </div></div>`);
      _push(ssrRenderComponent(_component_BaseFadeTransition, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(``);
            ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(unref(componentIsActive)), { class: "w-full" }, null), _parent2, _scopeId);
          } else {
            return [
              (openBlock(), createBlock(KeepAlive, null, [
                (openBlock(), createBlock(resolveDynamicComponent(unref(componentIsActive)), { class: "w-full" }))
              ], 1024))
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-DKCN_6EV.mjs.map
