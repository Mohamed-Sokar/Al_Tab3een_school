import { _ as _sfc_main$1 } from './Card-ClkFNDdW.mjs';
import { _ as _sfc_main$2 } from './Form-xmP0I2N6.mjs';
import { _ as _sfc_main$3 } from './FormField-1OWKP-81.mjs';
import { _ as _sfc_main$4 } from './Select-CUYWYClZ.mjs';
import { _ as _sfc_main$5 } from './Input-Y7FMS0Nh.mjs';
import { g as useRoute, e as _sfc_main$7, n as navigateTo } from './server.mjs';
import { defineComponent, ref, reactive, mergeProps, withCtx, unref, createVNode, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import { object, string } from 'yup';
import { u as useTeachersStore } from './teachers-Cx5Wl_TR.mjs';
import 'reka-ui';
import '@vueuse/core';
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
import './useAppToast-BZDaw0os.mjs';
import './api-Bx7QNuNm.mjs';
import 'axios';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "add_absence_report",
  __ssrInlineRender: true,
  setup(__props) {
    var _a;
    const teachersStore = useTeachersStore();
    const route = useRoute();
    const form = ref();
    const teacherId = Array.isArray(route.params.id) ? route.params.id[0] : (_a = route.params.id) != null ? _a : "";
    const excuse_status_options = ["\u0628\u0639\u0630\u0631", "\u0628\u063A\u064A\u0631 \u0639\u0630\u0631"];
    const schema = object({
      reason: string(),
      date: string().required("\u0627\u0644\u062A\u0627\u0631\u064A\u062E \u0645\u0637\u0644\u0648\u0628"),
      excuse_status: string().required("\u062D\u0627\u0644\u0629 \u0627\u0644\u0639\u0630\u0631 \u0645\u0637\u0644\u0648\u0628\u0629")
    });
    const state = reactive({
      reason: void 0,
      date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      excuse_status: excuse_status_options[0]
    });
    const onSubmit = async () => {
      await teachersStore.addTeacherAbsenceReport(teacherId, state);
      navigateTo({ name: "teachers-view-absence" });
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UCard = _sfc_main$1;
      const _component_UForm = _sfc_main$2;
      const _component_UFormField = _sfc_main$3;
      const _component_USelect = _sfc_main$4;
      const _component_UInput = _sfc_main$5;
      const _component_UButton = _sfc_main$7;
      _push(ssrRenderComponent(_component_UCard, mergeProps({ class: "max-w-3xl mx-auto mt-15" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UForm, {
              ref_key: "form",
              ref: form,
              schema: unref(schema),
              state: unref(state),
              class: "grid grid-cols-2 gap-4",
              onSubmit
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UFormField, {
                    label: "\u062D\u0627\u0644\u0629 \u0627\u0644\u0639\u0630\u0631",
                    name: "excuse_status",
                    required: ""
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_USelect, {
                          items: excuse_status_options,
                          modelValue: unref(state).excuse_status,
                          "onUpdate:modelValue": ($event) => unref(state).excuse_status = $event,
                          placeholder: "\u0623\u062F\u062E\u0644 \u062D\u0627\u0644\u0629 \u0627\u0644\u0639\u0630\u0631...",
                          label: "\u062D\u0627\u0644\u0629 \u0627\u0644\u0639\u0630\u0631",
                          class: "w-full mt-2"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_USelect, {
                            items: excuse_status_options,
                            modelValue: unref(state).excuse_status,
                            "onUpdate:modelValue": ($event) => unref(state).excuse_status = $event,
                            placeholder: "\u0623\u062F\u062E\u0644 \u062D\u0627\u0644\u0629 \u0627\u0644\u0639\u0630\u0631...",
                            label: "\u062D\u0627\u0644\u0629 \u0627\u0644\u0639\u0630\u0631",
                            class: "w-full mt-2"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UFormField, {
                    label: "\u0627\u0644\u062A\u0627\u0631\u064A\u062E",
                    name: "date",
                    required: ""
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          type: "date",
                          modelValue: unref(state).date,
                          "onUpdate:modelValue": ($event) => unref(state).date = $event,
                          placeholder: "\u0623\u062F\u062E\u0644 \u0627\u0644\u062A\u0627\u0631\u064A\u062E...",
                          label: "\u0627\u0644\u062A\u0627\u0631\u064A\u062E",
                          class: "w-full mt-2",
                          icon: "heroicons-calendar-days-solid"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            type: "date",
                            modelValue: unref(state).date,
                            "onUpdate:modelValue": ($event) => unref(state).date = $event,
                            placeholder: "\u0623\u062F\u062E\u0644 \u0627\u0644\u062A\u0627\u0631\u064A\u062E...",
                            label: "\u0627\u0644\u062A\u0627\u0631\u064A\u062E",
                            class: "w-full mt-2",
                            icon: "heroicons-calendar-days-solid"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UFormField, {
                    label: "\u0633\u0628\u0628 \u0627\u0644\u063A\u064A\u0627\u0628",
                    name: "reason"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          modelValue: unref(state).reason,
                          "onUpdate:modelValue": ($event) => unref(state).reason = $event,
                          placeholder: "\u0623\u062F\u062E\u0644 \u0633\u0628\u0628 \u0627\u0644\u063A\u064A\u0627\u0628...",
                          label: "\u0633\u0628\u0628 \u0627\u0644\u063A\u064A\u0627\u0628",
                          class: "w-full mt-2"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            modelValue: unref(state).reason,
                            "onUpdate:modelValue": ($event) => unref(state).reason = $event,
                            placeholder: "\u0623\u062F\u062E\u0644 \u0633\u0628\u0628 \u0627\u0644\u063A\u064A\u0627\u0628...",
                            label: "\u0633\u0628\u0628 \u0627\u0644\u063A\u064A\u0627\u0628",
                            class: "w-full mt-2"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`<div class="col-span-2 flex gap-2 mt-5"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UButton, {
                    type: "submit",
                    class: "flex w-40 py-2 justify-center font-bold lg:col-span-2 hover:cursor-pointer",
                    color: "secondary",
                    label: "\u0625\u0636\u0627\u0641\u0629",
                    loading: unref(teachersStore).loading
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UButton, {
                    variant: "soft",
                    class: "flex w-20 py-2 justify-center font-bold lg:col-span-2 hover:cursor-pointer",
                    color: "secondary",
                    onClick: ($event) => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))({ name: "teachers-view-teachers_table" }),
                    label: "\u0625\u0644\u063A\u0627\u0621"
                  }, null, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode(_component_UFormField, {
                      label: "\u062D\u0627\u0644\u0629 \u0627\u0644\u0639\u0630\u0631",
                      name: "excuse_status",
                      required: ""
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_USelect, {
                          items: excuse_status_options,
                          modelValue: unref(state).excuse_status,
                          "onUpdate:modelValue": ($event) => unref(state).excuse_status = $event,
                          placeholder: "\u0623\u062F\u062E\u0644 \u062D\u0627\u0644\u0629 \u0627\u0644\u0639\u0630\u0631...",
                          label: "\u062D\u0627\u0644\u0629 \u0627\u0644\u0639\u0630\u0631",
                          class: "w-full mt-2"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UFormField, {
                      label: "\u0627\u0644\u062A\u0627\u0631\u064A\u062E",
                      name: "date",
                      required: ""
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          type: "date",
                          modelValue: unref(state).date,
                          "onUpdate:modelValue": ($event) => unref(state).date = $event,
                          placeholder: "\u0623\u062F\u062E\u0644 \u0627\u0644\u062A\u0627\u0631\u064A\u062E...",
                          label: "\u0627\u0644\u062A\u0627\u0631\u064A\u062E",
                          class: "w-full mt-2",
                          icon: "heroicons-calendar-days-solid"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UFormField, {
                      label: "\u0633\u0628\u0628 \u0627\u0644\u063A\u064A\u0627\u0628",
                      name: "reason"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          modelValue: unref(state).reason,
                          "onUpdate:modelValue": ($event) => unref(state).reason = $event,
                          placeholder: "\u0623\u062F\u062E\u0644 \u0633\u0628\u0628 \u0627\u0644\u063A\u064A\u0627\u0628...",
                          label: "\u0633\u0628\u0628 \u0627\u0644\u063A\u064A\u0627\u0628",
                          class: "w-full mt-2"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode("div", { class: "col-span-2 flex gap-2 mt-5" }, [
                      createVNode(_component_UButton, {
                        type: "submit",
                        class: "flex w-40 py-2 justify-center font-bold lg:col-span-2 hover:cursor-pointer",
                        color: "secondary",
                        label: "\u0625\u0636\u0627\u0641\u0629",
                        loading: unref(teachersStore).loading
                      }, null, 8, ["loading"]),
                      createVNode(_component_UButton, {
                        variant: "soft",
                        class: "flex w-20 py-2 justify-center font-bold lg:col-span-2 hover:cursor-pointer",
                        color: "secondary",
                        onClick: ($event) => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))({ name: "teachers-view-teachers_table" }),
                        label: "\u0625\u0644\u063A\u0627\u0621"
                      }, null, 8, ["onClick"])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UForm, {
                ref_key: "form",
                ref: form,
                schema: unref(schema),
                state: unref(state),
                class: "grid grid-cols-2 gap-4",
                onSubmit
              }, {
                default: withCtx(() => [
                  createVNode(_component_UFormField, {
                    label: "\u062D\u0627\u0644\u0629 \u0627\u0644\u0639\u0630\u0631",
                    name: "excuse_status",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_USelect, {
                        items: excuse_status_options,
                        modelValue: unref(state).excuse_status,
                        "onUpdate:modelValue": ($event) => unref(state).excuse_status = $event,
                        placeholder: "\u0623\u062F\u062E\u0644 \u062D\u0627\u0644\u0629 \u0627\u0644\u0639\u0630\u0631...",
                        label: "\u062D\u0627\u0644\u0629 \u0627\u0644\u0639\u0630\u0631",
                        class: "w-full mt-2"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_UFormField, {
                    label: "\u0627\u0644\u062A\u0627\u0631\u064A\u062E",
                    name: "date",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_UInput, {
                        type: "date",
                        modelValue: unref(state).date,
                        "onUpdate:modelValue": ($event) => unref(state).date = $event,
                        placeholder: "\u0623\u062F\u062E\u0644 \u0627\u0644\u062A\u0627\u0631\u064A\u062E...",
                        label: "\u0627\u0644\u062A\u0627\u0631\u064A\u062E",
                        class: "w-full mt-2",
                        icon: "heroicons-calendar-days-solid"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_UFormField, {
                    label: "\u0633\u0628\u0628 \u0627\u0644\u063A\u064A\u0627\u0628",
                    name: "reason"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_UInput, {
                        modelValue: unref(state).reason,
                        "onUpdate:modelValue": ($event) => unref(state).reason = $event,
                        placeholder: "\u0623\u062F\u062E\u0644 \u0633\u0628\u0628 \u0627\u0644\u063A\u064A\u0627\u0628...",
                        label: "\u0633\u0628\u0628 \u0627\u0644\u063A\u064A\u0627\u0628",
                        class: "w-full mt-2"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  createVNode("div", { class: "col-span-2 flex gap-2 mt-5" }, [
                    createVNode(_component_UButton, {
                      type: "submit",
                      class: "flex w-40 py-2 justify-center font-bold lg:col-span-2 hover:cursor-pointer",
                      color: "secondary",
                      label: "\u0625\u0636\u0627\u0641\u0629",
                      loading: unref(teachersStore).loading
                    }, null, 8, ["loading"]),
                    createVNode(_component_UButton, {
                      variant: "soft",
                      class: "flex w-20 py-2 justify-center font-bold lg:col-span-2 hover:cursor-pointer",
                      color: "secondary",
                      onClick: ($event) => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))({ name: "teachers-view-teachers_table" }),
                      label: "\u0625\u0644\u063A\u0627\u0621"
                    }, null, 8, ["onClick"])
                  ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/teachers/[id]/add_absence_report.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=add_absence_report-D2-1UNjh.mjs.map
