import { _ as _sfc_main$2 } from './Card-ClkFNDdW.mjs';
import { _ as _sfc_main$3 } from './Form-xmP0I2N6.mjs';
import { _ as _sfc_main$4 } from './FormField-1OWKP-81.mjs';
import { _ as _sfc_main$5 } from './Input-Y7FMS0Nh.mjs';
import { e as _sfc_main$7, c as _sfc_main$b, n as navigateTo, d as useLocale, b as useAppConfig, t as tv } from './server.mjs';
import { defineComponent, ref, computed, reactive, mergeProps, withCtx, unref, createVNode, createTextVNode, toDisplayString, createBlock, openBlock, Fragment, renderList, useSlots, createCommentVNode, renderSlot, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderStyle, ssrRenderSlot } from 'vue/server-renderer';
import { useForwardPropsEmits, Primitive, ProgressRoot, ProgressIndicator } from 'reka-ui';
import { reactivePick } from '@vueuse/core';
import { object, string } from 'yup';
import { u as useSupabaseClient } from './useSupabaseClient-L7lO71ll.mjs';
import { u as useAppToast } from './useAppToast-BZDaw0os.mjs';
import { a as api } from './api-Bx7QNuNm.mjs';
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
import 'tailwind-variants';
import '@iconify/utils/lib/css/icon';
import 'perfect-debounce';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'axios';

const theme = {
  "slots": {
    "root": "gap-2",
    "base": "relative overflow-hidden rounded-full bg-accented",
    "indicator": "rounded-full size-full transition-transform duration-200 ease-out",
    "status": "flex justify-end text-dimmed transition-[width] duration-200",
    "steps": "grid items-end",
    "step": "truncate text-end row-start-1 col-start-1 transition-opacity"
  },
  "variants": {
    "animation": {
      "carousel": "",
      "carousel-inverse": "",
      "swing": "",
      "elastic": ""
    },
    "color": {
      "primary": {
        "indicator": "bg-primary",
        "steps": "text-primary"
      },
      "secondary": {
        "indicator": "bg-secondary",
        "steps": "text-secondary"
      },
      "success": {
        "indicator": "bg-success",
        "steps": "text-success"
      },
      "info": {
        "indicator": "bg-info",
        "steps": "text-info"
      },
      "warning": {
        "indicator": "bg-warning",
        "steps": "text-warning"
      },
      "error": {
        "indicator": "bg-error",
        "steps": "text-error"
      },
      "neutral": {
        "indicator": "bg-inverted",
        "steps": "text-inverted"
      }
    },
    "size": {
      "2xs": {
        "status": "text-xs",
        "steps": "text-xs"
      },
      "xs": {
        "status": "text-xs",
        "steps": "text-xs"
      },
      "sm": {
        "status": "text-sm",
        "steps": "text-sm"
      },
      "md": {
        "status": "text-sm",
        "steps": "text-sm"
      },
      "lg": {
        "status": "text-sm",
        "steps": "text-sm"
      },
      "xl": {
        "status": "text-base",
        "steps": "text-base"
      },
      "2xl": {
        "status": "text-base",
        "steps": "text-base"
      }
    },
    "step": {
      "active": {
        "step": "opacity-100"
      },
      "first": {
        "step": "opacity-100 text-muted"
      },
      "other": {
        "step": "opacity-0"
      },
      "last": {
        "step": ""
      }
    },
    "orientation": {
      "horizontal": {
        "root": "w-full flex flex-col",
        "base": "w-full",
        "status": "flex-row"
      },
      "vertical": {
        "root": "h-full flex flex-row-reverse",
        "base": "h-full",
        "status": "flex-col"
      }
    },
    "inverted": {
      "true": {
        "status": "self-end"
      }
    }
  },
  "compoundVariants": [
    {
      "inverted": true,
      "orientation": "horizontal",
      "class": {
        "step": "text-start",
        "status": "flex-row-reverse"
      }
    },
    {
      "inverted": true,
      "orientation": "vertical",
      "class": {
        "steps": "items-start",
        "status": "flex-col-reverse"
      }
    },
    {
      "orientation": "horizontal",
      "size": "2xs",
      "class": "h-px"
    },
    {
      "orientation": "horizontal",
      "size": "xs",
      "class": "h-0.5"
    },
    {
      "orientation": "horizontal",
      "size": "sm",
      "class": "h-1"
    },
    {
      "orientation": "horizontal",
      "size": "md",
      "class": "h-2"
    },
    {
      "orientation": "horizontal",
      "size": "lg",
      "class": "h-3"
    },
    {
      "orientation": "horizontal",
      "size": "xl",
      "class": "h-4"
    },
    {
      "orientation": "horizontal",
      "size": "2xl",
      "class": "h-5"
    },
    {
      "orientation": "vertical",
      "size": "2xs",
      "class": "w-px"
    },
    {
      "orientation": "vertical",
      "size": "xs",
      "class": "w-0.5"
    },
    {
      "orientation": "vertical",
      "size": "sm",
      "class": "w-1"
    },
    {
      "orientation": "vertical",
      "size": "md",
      "class": "w-2"
    },
    {
      "orientation": "vertical",
      "size": "lg",
      "class": "w-3"
    },
    {
      "orientation": "vertical",
      "size": "xl",
      "class": "w-4"
    },
    {
      "orientation": "vertical",
      "size": "2xl",
      "class": "w-5"
    },
    {
      "orientation": "horizontal",
      "animation": "carousel",
      "class": {
        "indicator": "data-[state=indeterminate]:animate-[carousel_2s_ease-in-out_infinite] data-[state=indeterminate]:rtl:animate-[carousel-rtl_2s_ease-in-out_infinite]"
      }
    },
    {
      "orientation": "vertical",
      "animation": "carousel",
      "class": {
        "indicator": "data-[state=indeterminate]:animate-[carousel-vertical_2s_ease-in-out_infinite]"
      }
    },
    {
      "orientation": "horizontal",
      "animation": "carousel-inverse",
      "class": {
        "indicator": "data-[state=indeterminate]:animate-[carousel-inverse_2s_ease-in-out_infinite] data-[state=indeterminate]:rtl:animate-[carousel-inverse-rtl_2s_ease-in-out_infinite]"
      }
    },
    {
      "orientation": "vertical",
      "animation": "carousel-inverse",
      "class": {
        "indicator": "data-[state=indeterminate]:animate-[carousel-inverse-vertical_2s_ease-in-out_infinite]"
      }
    },
    {
      "orientation": "horizontal",
      "animation": "swing",
      "class": {
        "indicator": "data-[state=indeterminate]:animate-[swing_2s_ease-in-out_infinite]"
      }
    },
    {
      "orientation": "vertical",
      "animation": "swing",
      "class": {
        "indicator": "data-[state=indeterminate]:animate-[swing-vertical_2s_ease-in-out_infinite]"
      }
    },
    {
      "orientation": "horizontal",
      "animation": "elastic",
      "class": {
        "indicator": "data-[state=indeterminate]:animate-[elastic_2s_ease-in-out_infinite]"
      }
    },
    {
      "orientation": "vertical",
      "animation": "elastic",
      "class": {
        "indicator": "data-[state=indeterminate]:animate-[elastic-vertical_2s_ease-in-out_infinite]"
      }
    }
  ],
  "defaultVariants": {
    "animation": "carousel",
    "color": "primary",
    "size": "md"
  }
};
const _sfc_main$1 = {
  __name: "Progress",
  __ssrInlineRender: true,
  props: {
    as: { type: null, required: false },
    max: { type: [Number, Array], required: false },
    status: { type: Boolean, required: false },
    inverted: { type: Boolean, required: false, default: false },
    size: { type: null, required: false },
    color: { type: null, required: false },
    orientation: { type: null, required: false, default: "horizontal" },
    animation: { type: null, required: false },
    class: { type: null, required: false },
    ui: { type: null, required: false },
    getValueLabel: { type: Function, required: false },
    modelValue: { type: [Number, null], required: false, default: null }
  },
  emits: ["update:modelValue", "update:max"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const slots = useSlots();
    const { dir } = useLocale();
    const appConfig = useAppConfig();
    const rootProps = useForwardPropsEmits(reactivePick(props, "getValueLabel", "modelValue"), emits);
    const isIndeterminate = computed(() => rootProps.value.modelValue === null);
    const hasSteps = computed(() => Array.isArray(props.max));
    const realMax = computed(() => {
      if (isIndeterminate.value || !props.max) {
        return void 0;
      }
      if (Array.isArray(props.max)) {
        return props.max.length - 1;
      }
      return Number(props.max);
    });
    const percent = computed(() => {
      var _a, _b;
      if (isIndeterminate.value) {
        return void 0;
      }
      switch (true) {
        case rootProps.value.modelValue < 0:
          return 0;
        case rootProps.value.modelValue > ((_a = realMax.value) != null ? _a : 100):
          return 100;
        default:
          return Math.round(rootProps.value.modelValue / ((_b = realMax.value) != null ? _b : 100) * 100);
      }
    });
    const indicatorStyle = computed(() => {
      if (percent.value === void 0) {
        return;
      }
      if (props.orientation === "vertical") {
        return {
          transform: `translateY(${props.inverted ? "" : "-"}${100 - percent.value}%)`
        };
      } else {
        if (dir.value === "rtl") {
          return {
            transform: `translateX(${props.inverted ? "-" : ""}${100 - percent.value}%)`
          };
        } else {
          return {
            transform: `translateX(${props.inverted ? "" : "-"}${100 - percent.value}%)`
          };
        }
      }
    });
    const statusStyle = computed(() => {
      return {
        [props.orientation === "vertical" ? "height" : "width"]: percent.value ? `${percent.value}%` : "fit-content"
      };
    });
    function isActive(index) {
      return index === Number(props.modelValue);
    }
    function isFirst(index) {
      return index === 0;
    }
    function isLast(index) {
      return index === realMax.value;
    }
    function stepVariant(index) {
      index = Number(index);
      if (isActive(index) && !isFirst(index)) {
        return "active";
      }
      if (isFirst(index) && isActive(index)) {
        return "first";
      }
      if (isLast(index) && isActive(index)) {
        return "last";
      }
      return "other";
    }
    const ui = computed(() => {
      var _a;
      return tv({ extend: tv(theme), ...((_a = appConfig.ui) == null ? void 0 : _a.progress) || {} })({
        animation: props.animation,
        size: props.size,
        color: props.color,
        orientation: props.orientation,
        inverted: props.inverted
      });
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      _push(ssrRenderComponent(unref(Primitive), mergeProps({
        as: __props.as,
        class: ui.value.root({ class: [(_a = props.ui) == null ? void 0 : _a.root, props.class] })
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a2, _b, _c, _d, _e, _f;
          if (_push2) {
            if (!isIndeterminate.value && (__props.status || !!slots.status)) {
              _push2(`<div class="${ssrRenderClass(ui.value.status({ class: (_a2 = props.ui) == null ? void 0 : _a2.status }))}" style="${ssrRenderStyle(statusStyle.value)}"${_scopeId}>`);
              ssrRenderSlot(_ctx.$slots, "status", { percent: percent.value }, () => {
                _push2(`${ssrInterpolate(percent.value)}% `);
              }, _push2, _parent2, _scopeId);
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(unref(ProgressRoot), mergeProps(unref(rootProps), {
              max: realMax.value,
              class: ui.value.base({ class: (_b = props.ui) == null ? void 0 : _b.base }),
              style: { "transform": "translateZ(0)" }
            }), {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                var _a3, _b2;
                if (_push3) {
                  _push3(ssrRenderComponent(unref(ProgressIndicator), {
                    class: ui.value.indicator({ class: (_a3 = props.ui) == null ? void 0 : _a3.indicator }),
                    style: indicatorStyle.value
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(ProgressIndicator), {
                      class: ui.value.indicator({ class: (_b2 = props.ui) == null ? void 0 : _b2.indicator }),
                      style: indicatorStyle.value
                    }, null, 8, ["class", "style"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            if (hasSteps.value) {
              _push2(`<div class="${ssrRenderClass(ui.value.steps({ class: (_c = props.ui) == null ? void 0 : _c.steps }))}"${_scopeId}><!--[-->`);
              ssrRenderList(__props.max, (step, index) => {
                var _a3;
                _push2(`<div class="${ssrRenderClass(ui.value.step({ class: (_a3 = props.ui) == null ? void 0 : _a3.step, step: stepVariant(index) }))}"${_scopeId}>`);
                ssrRenderSlot(_ctx.$slots, `step-${index}`, { step }, () => {
                  _push2(`${ssrInterpolate(step)}`);
                }, _push2, _parent2, _scopeId);
                _push2(`</div>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              !isIndeterminate.value && (__props.status || !!slots.status) ? (openBlock(), createBlock("div", {
                key: 0,
                class: ui.value.status({ class: (_d = props.ui) == null ? void 0 : _d.status }),
                style: statusStyle.value
              }, [
                renderSlot(_ctx.$slots, "status", { percent: percent.value }, () => [
                  createTextVNode(toDisplayString(percent.value) + "% ", 1)
                ])
              ], 6)) : createCommentVNode("", true),
              createVNode(unref(ProgressRoot), mergeProps(unref(rootProps), {
                max: realMax.value,
                class: ui.value.base({ class: (_e = props.ui) == null ? void 0 : _e.base }),
                style: { "transform": "translateZ(0)" }
              }), {
                default: withCtx(() => {
                  var _a3;
                  return [
                    createVNode(unref(ProgressIndicator), {
                      class: ui.value.indicator({ class: (_a3 = props.ui) == null ? void 0 : _a3.indicator }),
                      style: indicatorStyle.value
                    }, null, 8, ["class", "style"])
                  ];
                }),
                _: 1
              }, 16, ["max", "class"]),
              hasSteps.value ? (openBlock(), createBlock("div", {
                key: 1,
                class: ui.value.steps({ class: (_f = props.ui) == null ? void 0 : _f.steps })
              }, [
                (openBlock(true), createBlock(Fragment, null, renderList(__props.max, (step, index) => {
                  var _a3;
                  return openBlock(), createBlock("div", {
                    key: index,
                    class: ui.value.step({ class: (_a3 = props.ui) == null ? void 0 : _a3.step, step: stepVariant(index) })
                  }, [
                    renderSlot(_ctx.$slots, `step-${index}`, { step }, () => [
                      createTextVNode(toDisplayString(step), 1)
                    ])
                  ], 2);
                }), 128))
              ], 2)) : createCommentVNode("", true)
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui/dist/runtime/components/Progress.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "login",
  __ssrInlineRender: true,
  setup(__props) {
    const client = useSupabaseClient();
    const { toastError, toastSuccess } = useAppToast();
    const show = ref(false);
    function checkStrength(str) {
      const requirements = [
        { regex: /.{8,}/, text: "\u0639\u0644\u0649 \u0627\u0644\u0623\u0642\u0644 8 \u062D\u0631\u0648\u0641" },
        { regex: /\d/, text: "\u0639\u0644\u0649 \u0627\u0644\u0623\u0642\u0644 1 \u0631\u0642\u0645" },
        { regex: /[a-z]/, text: "\u0639\u0644\u0649 \u0627\u0644\u0623\u0642\u0644 1 \u062D\u0631\u0641 \u0635\u063A\u064A\u0631" },
        { regex: /[A-Z]/, text: "\u0639\u0644\u0649 \u0627\u0644\u0623\u0642\u0644 1 \u062D\u0631\u0641 \u0643\u0628\u064A\u0631" }
      ];
      return requirements.map((req) => ({
        met: req.regex.test(str),
        text: req.text
      }));
    }
    const strength = computed(() => checkStrength(state.password));
    const score = computed(() => strength.value.filter((req) => req.met).length);
    const color = computed(() => {
      if (score.value === 0) return "neutral";
      if (score.value <= 1) return "error";
      if (score.value <= 2) return "warning";
      if (score.value === 3) return "warning";
      return "success";
    });
    const text = computed(() => {
      if (score.value === 0) return "\u0623\u062F\u062E\u0644 \u0643\u0644\u0645\u0629 \u0627\u0644\u0633\u0631";
      if (score.value <= 2) return "\u0643\u0644\u0645\u0629 \u0633\u0631 \u0636\u0639\u064A\u0641\u0629";
      if (score.value === 3) return "\u0643\u0644\u0645\u0629 \u0633\u0631 \u0645\u062A\u0648\u0633\u0637\u0629";
      return "\u0643\u0644\u0645\u0629 \u0633\u0631 \u0642\u0648\u064A\u0629";
    });
    const schema = object({
      email: string().email("\u0627\u0644\u0625\u064A\u0645\u064A\u0644 \u063A\u064A\u0631 \u0635\u0627\u0644\u062D").required("\u0627\u0644\u0625\u064A\u0645\u064A\u0644 \u0645\u0637\u0644\u0648\u0628"),
      password: string().min(8, "\u064A\u062C\u0628 \u0623\u0646 \u062A\u0643\u0648\u0646 8 \u0623\u062D\u0631\u0641 \u0639\u0644\u0649 \u0627\u0644\u0623\u0642\u0644").required("\u0643\u0644\u0645\u0629 \u0627\u0644\u0633\u0631 \u0645\u0637\u0644\u0648\u0628\u0629")
    });
    const state = reactive({
      email: "",
      password: ""
    });
    const loading = ref(false);
    async function onSubmit(event) {
      loading.value = true;
      try {
        const { error } = await client.auth.signInWithPassword({
          email: state.email || "",
          password: state.password || ""
        });
        if (error) {
          throw new Error(error.message);
        }
        await api.post("/notifications/send-telegram", {
          message: `\u{1F514} \u062A\u0645 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 \u0628\u062D\u0633\u0627\u0628 ${state.email}`
        });
        toastSuccess({ title: "\u062A\u0645 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 \u0628\u0646\u062C\u0627\u062D" });
        navigateTo({ name: "auth-callback" });
      } catch (error) {
        toastError({
          title: "\u0641\u0634\u0644 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644",
          description: error instanceof Error ? error.message : String(error)
        });
      } finally {
        loading.value = false;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UCard = _sfc_main$2;
      const _component_UForm = _sfc_main$3;
      const _component_UFormField = _sfc_main$4;
      const _component_UInput = _sfc_main$5;
      const _component_UButton = _sfc_main$7;
      const _component_UProgress = _sfc_main$1;
      const _component_UIcon = _sfc_main$b;
      _push(ssrRenderComponent(_component_UCard, mergeProps({ class: "max-w-3xl mx-auto hover:shadow-2xl transition-all p-10" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UForm, {
              schema: unref(schema),
              state: unref(state),
              class: "space-y-2",
              onSubmit
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<h1 class="flex justify-center mb-10 font-bold text-3xl"${_scopeId2}> \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 \u0644\u0645\u0648\u0642\u0639 \u0627\u0644\u0645\u062F\u0631\u0633\u0629 </h1>`);
                  _push3(ssrRenderComponent(_component_UFormField, {
                    label: "\u0627\u0644\u0625\u064A\u0645\u064A\u0644",
                    name: "email",
                    required: ""
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          modelValue: unref(state).email,
                          "onUpdate:modelValue": ($event) => unref(state).email = $event,
                          class: "w-full"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            modelValue: unref(state).email,
                            "onUpdate:modelValue": ($event) => unref(state).email = $event,
                            class: "w-full"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UFormField, {
                    label: "\u0643\u0644\u0645\u0629 \u0627\u0644\u0633\u0631",
                    name: "password",
                    required: ""
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          modelValue: unref(state).password,
                          "onUpdate:modelValue": ($event) => unref(state).password = $event,
                          type: unref(show) ? "text" : "password",
                          class: "w-full"
                        }, {
                          trailing: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_UButton, {
                                color: "neutral",
                                variant: "link",
                                size: "sm",
                                icon: unref(show) ? "i-lucide-eye-off" : "i-lucide-eye",
                                "aria-label": unref(show) ? "Hide password" : "Show password",
                                "aria-pressed": unref(show),
                                "aria-controls": "password",
                                onClick: ($event) => show.value = !unref(show)
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_UButton, {
                                  color: "neutral",
                                  variant: "link",
                                  size: "sm",
                                  icon: unref(show) ? "i-lucide-eye-off" : "i-lucide-eye",
                                  "aria-label": unref(show) ? "Hide password" : "Show password",
                                  "aria-pressed": unref(show),
                                  "aria-controls": "password",
                                  onClick: ($event) => show.value = !unref(show)
                                }, null, 8, ["icon", "aria-label", "aria-pressed", "onClick"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            modelValue: unref(state).password,
                            "onUpdate:modelValue": ($event) => unref(state).password = $event,
                            type: unref(show) ? "text" : "password",
                            class: "w-full"
                          }, {
                            trailing: withCtx(() => [
                              createVNode(_component_UButton, {
                                color: "neutral",
                                variant: "link",
                                size: "sm",
                                icon: unref(show) ? "i-lucide-eye-off" : "i-lucide-eye",
                                "aria-label": unref(show) ? "Hide password" : "Show password",
                                "aria-pressed": unref(show),
                                "aria-controls": "password",
                                onClick: ($event) => show.value = !unref(show)
                              }, null, 8, ["icon", "aria-label", "aria-pressed", "onClick"])
                            ]),
                            _: 1
                          }, 8, ["modelValue", "onUpdate:modelValue", "type"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UProgress, {
                    color: unref(color),
                    indicator: unref(text),
                    "model-value": unref(score),
                    max: 4,
                    size: "sm"
                  }, null, _parent3, _scopeId2));
                  _push3(`<p id="password-strength" class="text-sm font-medium flex justify-end"${_scopeId2}>${ssrInterpolate(unref(text))}</p><ul class="space-y-1" aria-label="Password requirements"${_scopeId2}><!--[-->`);
                  ssrRenderList(unref(strength), (req, index) => {
                    _push3(`<li class="${ssrRenderClass([req.met ? "text-success" : "text-muted", "flex items-center gap-0.5 justify-end"])}"${_scopeId2}>`);
                    _push3(ssrRenderComponent(_component_UIcon, {
                      name: req.met ? "i-lucide-circle-check" : "i-lucide-circle-x",
                      class: "size-4 shrink-0"
                    }, null, _parent3, _scopeId2));
                    _push3(`<span class="text-sm font-light"${_scopeId2}>${ssrInterpolate(req.text)} <span class="sr-only"${_scopeId2}>${ssrInterpolate(req.met ? " - Requirement met" : " - Requirement not met")}</span></span></li>`);
                  });
                  _push3(`<!--]--></ul>`);
                  _push3(ssrRenderComponent(_component_UButton, {
                    type: "submit",
                    class: "w-full flex justify-center hover:cursor-pointer",
                    color: "secondary",
                    loading: unref(loading)
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(` \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 `);
                      } else {
                        return [
                          createTextVNode(" \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode("h1", { class: "flex justify-center mb-10 font-bold text-3xl" }, " \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 \u0644\u0645\u0648\u0642\u0639 \u0627\u0644\u0645\u062F\u0631\u0633\u0629 "),
                    createVNode(_component_UFormField, {
                      label: "\u0627\u0644\u0625\u064A\u0645\u064A\u0644",
                      name: "email",
                      required: ""
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          modelValue: unref(state).email,
                          "onUpdate:modelValue": ($event) => unref(state).email = $event,
                          class: "w-full"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UFormField, {
                      label: "\u0643\u0644\u0645\u0629 \u0627\u0644\u0633\u0631",
                      name: "password",
                      required: ""
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          modelValue: unref(state).password,
                          "onUpdate:modelValue": ($event) => unref(state).password = $event,
                          type: unref(show) ? "text" : "password",
                          class: "w-full"
                        }, {
                          trailing: withCtx(() => [
                            createVNode(_component_UButton, {
                              color: "neutral",
                              variant: "link",
                              size: "sm",
                              icon: unref(show) ? "i-lucide-eye-off" : "i-lucide-eye",
                              "aria-label": unref(show) ? "Hide password" : "Show password",
                              "aria-pressed": unref(show),
                              "aria-controls": "password",
                              onClick: ($event) => show.value = !unref(show)
                            }, null, 8, ["icon", "aria-label", "aria-pressed", "onClick"])
                          ]),
                          _: 1
                        }, 8, ["modelValue", "onUpdate:modelValue", "type"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UProgress, {
                      color: unref(color),
                      indicator: unref(text),
                      "model-value": unref(score),
                      max: 4,
                      size: "sm"
                    }, null, 8, ["color", "indicator", "model-value"]),
                    createVNode("p", {
                      id: "password-strength",
                      class: "text-sm font-medium flex justify-end"
                    }, toDisplayString(unref(text)), 1),
                    createVNode("ul", {
                      class: "space-y-1",
                      "aria-label": "Password requirements"
                    }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(unref(strength), (req, index) => {
                        return openBlock(), createBlock("li", {
                          key: index,
                          class: ["flex items-center gap-0.5 justify-end", req.met ? "text-success" : "text-muted"]
                        }, [
                          createVNode(_component_UIcon, {
                            name: req.met ? "i-lucide-circle-check" : "i-lucide-circle-x",
                            class: "size-4 shrink-0"
                          }, null, 8, ["name"]),
                          createVNode("span", { class: "text-sm font-light" }, [
                            createTextVNode(toDisplayString(req.text) + " ", 1),
                            createVNode("span", { class: "sr-only" }, toDisplayString(req.met ? " - Requirement met" : " - Requirement not met"), 1)
                          ])
                        ], 2);
                      }), 128))
                    ]),
                    createVNode(_component_UButton, {
                      type: "submit",
                      class: "w-full flex justify-center hover:cursor-pointer",
                      color: "secondary",
                      loading: unref(loading)
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 ")
                      ]),
                      _: 1
                    }, 8, ["loading"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UForm, {
                schema: unref(schema),
                state: unref(state),
                class: "space-y-2",
                onSubmit
              }, {
                default: withCtx(() => [
                  createVNode("h1", { class: "flex justify-center mb-10 font-bold text-3xl" }, " \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 \u0644\u0645\u0648\u0642\u0639 \u0627\u0644\u0645\u062F\u0631\u0633\u0629 "),
                  createVNode(_component_UFormField, {
                    label: "\u0627\u0644\u0625\u064A\u0645\u064A\u0644",
                    name: "email",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_UInput, {
                        modelValue: unref(state).email,
                        "onUpdate:modelValue": ($event) => unref(state).email = $event,
                        class: "w-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_UFormField, {
                    label: "\u0643\u0644\u0645\u0629 \u0627\u0644\u0633\u0631",
                    name: "password",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_UInput, {
                        modelValue: unref(state).password,
                        "onUpdate:modelValue": ($event) => unref(state).password = $event,
                        type: unref(show) ? "text" : "password",
                        class: "w-full"
                      }, {
                        trailing: withCtx(() => [
                          createVNode(_component_UButton, {
                            color: "neutral",
                            variant: "link",
                            size: "sm",
                            icon: unref(show) ? "i-lucide-eye-off" : "i-lucide-eye",
                            "aria-label": unref(show) ? "Hide password" : "Show password",
                            "aria-pressed": unref(show),
                            "aria-controls": "password",
                            onClick: ($event) => show.value = !unref(show)
                          }, null, 8, ["icon", "aria-label", "aria-pressed", "onClick"])
                        ]),
                        _: 1
                      }, 8, ["modelValue", "onUpdate:modelValue", "type"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_UProgress, {
                    color: unref(color),
                    indicator: unref(text),
                    "model-value": unref(score),
                    max: 4,
                    size: "sm"
                  }, null, 8, ["color", "indicator", "model-value"]),
                  createVNode("p", {
                    id: "password-strength",
                    class: "text-sm font-medium flex justify-end"
                  }, toDisplayString(unref(text)), 1),
                  createVNode("ul", {
                    class: "space-y-1",
                    "aria-label": "Password requirements"
                  }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(strength), (req, index) => {
                      return openBlock(), createBlock("li", {
                        key: index,
                        class: ["flex items-center gap-0.5 justify-end", req.met ? "text-success" : "text-muted"]
                      }, [
                        createVNode(_component_UIcon, {
                          name: req.met ? "i-lucide-circle-check" : "i-lucide-circle-x",
                          class: "size-4 shrink-0"
                        }, null, 8, ["name"]),
                        createVNode("span", { class: "text-sm font-light" }, [
                          createTextVNode(toDisplayString(req.text) + " ", 1),
                          createVNode("span", { class: "sr-only" }, toDisplayString(req.met ? " - Requirement met" : " - Requirement not met"), 1)
                        ])
                      ], 2);
                    }), 128))
                  ]),
                  createVNode(_component_UButton, {
                    type: "submit",
                    class: "w-full flex justify-center hover:cursor-pointer",
                    color: "secondary",
                    loading: unref(loading)
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 ")
                    ]),
                    _: 1
                  }, 8, ["loading"])
                ]),
                _: 1
              }, 8, ["schema", "state"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=login-J0mwLa5h.mjs.map
