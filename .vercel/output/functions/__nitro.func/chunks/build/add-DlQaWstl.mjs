import { _ as _sfc_main$1 } from './Card-ClkFNDdW.mjs';
import { _ as _sfc_main$2 } from './Form-xmP0I2N6.mjs';
import { _ as _sfc_main$3 } from './FormField-1OWKP-81.mjs';
import { _ as _sfc_main$4 } from './Input-Y7FMS0Nh.mjs';
import { e as _sfc_main$7, n as navigateTo } from './server.mjs';
import { defineComponent, reactive, ref, mergeProps, withCtx, unref, createVNode, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import { object, string, number } from 'yup';
import { u as useDriversStore } from './drivers-BuRykaFo.mjs';
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
import './students-C5l8o5u3.mjs';
import './useAppToast-BZDaw0os.mjs';
import './constants-CI-Eb238.mjs';
import './api-Bx7QNuNm.mjs';
import 'axios';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "add",
  __ssrInlineRender: true,
  setup(__props) {
    const driversStore = useDriversStore();
    const schema = object({
      name: string().required("\u0627\u0644\u0627\u0633\u0645 \u0645\u0637\u0644\u0648\u0628"),
      phone_no: string().required("\u0631\u0642\u0645 \u0627\u0644\u062C\u0648\u0627\u0644 \u0645\u0637\u0644\u0648\u0628"),
      maximum_capacity: number().required("\u0627\u0644\u0642\u064A\u0645\u0629 \u0627\u0644\u0642\u0635\u0648\u0649 \u0645\u0637\u0644\u0648\u0628\u0629"),
      car_type: string().required("\u0646\u0648\u0639 \u0627\u0644\u0633\u064A\u0627\u0631\u0629 \u0645\u0637\u0644\u0648\u0628\u0629"),
      car_color: string().required("\u0644\u0648\u0646 \u0627\u0644\u0633\u064A\u0627\u0631\u0629 \u0645\u0637\u0644\u0648\u0628\u0629"),
      address: string().required("\u0627\u0644\u0639\u0646\u0648\u0627\u0646 \u0645\u0637\u0644\u0648\u0628")
    });
    const state = reactive({
      // id: undefined,
      name: void 0,
      maximum_capacity: void 0,
      phone_no: void 0,
      car_type: void 0,
      car_color: void 0,
      address: void 0
    });
    const form = ref();
    const onSubmit = async () => {
      await driversStore.addDriver({ ...state });
      navigateTo({ name: "drivers" });
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UCard = _sfc_main$1;
      const _component_UForm = _sfc_main$2;
      const _component_UFormField = _sfc_main$3;
      const _component_UInput = _sfc_main$4;
      const _component_UButton = _sfc_main$7;
      _push(ssrRenderComponent(_component_UCard, mergeProps({ class: "max-w-3xl mx-auto mt-15" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UForm, {
              ref_key: "form",
              ref: form,
              schema: unref(schema),
              state: unref(state),
              class: "grid grid-cols-1 md:grid-cols-2 gap-y-1 gap-x-4",
              onSubmit
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UFormField, {
                    required: "",
                    label: "\u0627\u0644\u0627\u0633\u0645",
                    name: "name"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          modelValue: unref(state).name,
                          "onUpdate:modelValue": ($event) => unref(state).name = $event,
                          placeholder: "\u0627\u0644\u0627\u0633\u0645",
                          label: "\u0627\u0644\u0627\u0633\u0645",
                          class: "w-full"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            modelValue: unref(state).name,
                            "onUpdate:modelValue": ($event) => unref(state).name = $event,
                            placeholder: "\u0627\u0644\u0627\u0633\u0645",
                            label: "\u0627\u0644\u0627\u0633\u0645",
                            class: "w-full"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UFormField, {
                    required: "",
                    label: "\u0631\u0642\u0645 \u0627\u0644\u062C\u0648\u0627\u0644",
                    name: "phone_no"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          type: "number",
                          modelValue: unref(state).phone_no,
                          "onUpdate:modelValue": ($event) => unref(state).phone_no = $event,
                          placeholder: "\u0631\u0642\u0645 \u0627\u0644\u062C\u0648\u0627\u0644",
                          label: "\u0631\u0642\u0645 \u0627\u0644\u062C\u0648\u0627\u0644",
                          class: "w-full"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            type: "number",
                            modelValue: unref(state).phone_no,
                            "onUpdate:modelValue": ($event) => unref(state).phone_no = $event,
                            placeholder: "\u0631\u0642\u0645 \u0627\u0644\u062C\u0648\u0627\u0644",
                            label: "\u0631\u0642\u0645 \u0627\u0644\u062C\u0648\u0627\u0644",
                            class: "w-full"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UFormField, {
                    required: "",
                    label: "\u0627\u0644\u0633\u0639\u0629 \u0627\u0644\u0642\u0635\u0648\u0649",
                    name: "maximum_capacity"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          type: "number",
                          modelValue: unref(state).maximum_capacity,
                          "onUpdate:modelValue": ($event) => unref(state).maximum_capacity = $event,
                          modelModifiers: { number: true },
                          placeholder: "\u0627\u0644\u0633\u0639\u0629 \u0627\u0644\u0642\u0635\u0648\u0649",
                          label: "\u0627\u0644\u0633\u0639\u0629 \u0627\u0644\u0642\u0635\u0648\u0649",
                          class: "w-full"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            type: "number",
                            modelValue: unref(state).maximum_capacity,
                            "onUpdate:modelValue": ($event) => unref(state).maximum_capacity = $event,
                            modelModifiers: { number: true },
                            placeholder: "\u0627\u0644\u0633\u0639\u0629 \u0627\u0644\u0642\u0635\u0648\u0649",
                            label: "\u0627\u0644\u0633\u0639\u0629 \u0627\u0644\u0642\u0635\u0648\u0649",
                            class: "w-full"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UFormField, {
                    required: "",
                    label: "\u0627\u0644\u0639\u0646\u0648\u0627\u0646",
                    name: "address"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          modelValue: unref(state).address,
                          "onUpdate:modelValue": ($event) => unref(state).address = $event,
                          placeholder: "\u0627\u0644\u0639\u0646\u0648\u0627\u0646",
                          label: "\u0627\u0644\u0639\u0646\u0648\u0627\u0646",
                          class: "w-full"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            modelValue: unref(state).address,
                            "onUpdate:modelValue": ($event) => unref(state).address = $event,
                            placeholder: "\u0627\u0644\u0639\u0646\u0648\u0627\u0646",
                            label: "\u0627\u0644\u0639\u0646\u0648\u0627\u0646",
                            class: "w-full"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UFormField, {
                    required: "",
                    label: "\u0646\u0648\u0639 \u0627\u0644\u0633\u064A\u0627\u0631\u0629",
                    name: "car_type"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          modelValue: unref(state).car_type,
                          "onUpdate:modelValue": ($event) => unref(state).car_type = $event,
                          placeholder: "\u0646\u0648\u0639 \u0627\u0644\u0633\u064A\u0627\u0631\u0629",
                          label: "\u0646\u0648\u0639 \u0627\u0644\u0633\u064A\u0627\u0631\u0629",
                          class: "w-full"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            modelValue: unref(state).car_type,
                            "onUpdate:modelValue": ($event) => unref(state).car_type = $event,
                            placeholder: "\u0646\u0648\u0639 \u0627\u0644\u0633\u064A\u0627\u0631\u0629",
                            label: "\u0646\u0648\u0639 \u0627\u0644\u0633\u064A\u0627\u0631\u0629",
                            class: "w-full"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UFormField, {
                    required: "",
                    label: "\u0644\u0648\u0646 \u0627\u0644\u0633\u064A\u0627\u0631\u0629",
                    name: "car_color"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          modelValue: unref(state).car_color,
                          "onUpdate:modelValue": ($event) => unref(state).car_color = $event,
                          placeholder: "\u0644\u0648\u0646 \u0627\u0644\u0633\u064A\u0627\u0631\u0629",
                          label: "\u0644\u0648\u0646 \u0627\u0644\u0633\u064A\u0627\u0631\u0629",
                          class: "w-full"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            modelValue: unref(state).car_color,
                            "onUpdate:modelValue": ($event) => unref(state).car_color = $event,
                            placeholder: "\u0644\u0648\u0646 \u0627\u0644\u0633\u064A\u0627\u0631\u0629",
                            label: "\u0644\u0648\u0646 \u0627\u0644\u0633\u064A\u0627\u0631\u0629",
                            class: "w-full"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`<div class="md:col-span-2 flex flex-wrap gap-2 mt-5"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UButton, {
                    type: "submit",
                    class: "flex w-full md:w-40 py-2 justify-center font-bold lg:col-span-2 hover:cursor-pointer",
                    color: "secondary",
                    loading: unref(driversStore).loading,
                    label: "\u0625\u0636\u0627\u0641\u0629"
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UButton, {
                    variant: "soft",
                    class: "flex w-full md:w-20 py-2 justify-center font-bold lg:col-span-2 hover:cursor-pointer",
                    color: "secondary",
                    onClick: ($event) => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))({ name: "drivers" }),
                    label: "\u0625\u0644\u063A\u0627\u0621"
                  }, null, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode(_component_UFormField, {
                      required: "",
                      label: "\u0627\u0644\u0627\u0633\u0645",
                      name: "name"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          modelValue: unref(state).name,
                          "onUpdate:modelValue": ($event) => unref(state).name = $event,
                          placeholder: "\u0627\u0644\u0627\u0633\u0645",
                          label: "\u0627\u0644\u0627\u0633\u0645",
                          class: "w-full"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UFormField, {
                      required: "",
                      label: "\u0631\u0642\u0645 \u0627\u0644\u062C\u0648\u0627\u0644",
                      name: "phone_no"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          type: "number",
                          modelValue: unref(state).phone_no,
                          "onUpdate:modelValue": ($event) => unref(state).phone_no = $event,
                          placeholder: "\u0631\u0642\u0645 \u0627\u0644\u062C\u0648\u0627\u0644",
                          label: "\u0631\u0642\u0645 \u0627\u0644\u062C\u0648\u0627\u0644",
                          class: "w-full"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UFormField, {
                      required: "",
                      label: "\u0627\u0644\u0633\u0639\u0629 \u0627\u0644\u0642\u0635\u0648\u0649",
                      name: "maximum_capacity"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          type: "number",
                          modelValue: unref(state).maximum_capacity,
                          "onUpdate:modelValue": ($event) => unref(state).maximum_capacity = $event,
                          modelModifiers: { number: true },
                          placeholder: "\u0627\u0644\u0633\u0639\u0629 \u0627\u0644\u0642\u0635\u0648\u0649",
                          label: "\u0627\u0644\u0633\u0639\u0629 \u0627\u0644\u0642\u0635\u0648\u0649",
                          class: "w-full"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UFormField, {
                      required: "",
                      label: "\u0627\u0644\u0639\u0646\u0648\u0627\u0646",
                      name: "address"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          modelValue: unref(state).address,
                          "onUpdate:modelValue": ($event) => unref(state).address = $event,
                          placeholder: "\u0627\u0644\u0639\u0646\u0648\u0627\u0646",
                          label: "\u0627\u0644\u0639\u0646\u0648\u0627\u0646",
                          class: "w-full"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UFormField, {
                      required: "",
                      label: "\u0646\u0648\u0639 \u0627\u0644\u0633\u064A\u0627\u0631\u0629",
                      name: "car_type"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          modelValue: unref(state).car_type,
                          "onUpdate:modelValue": ($event) => unref(state).car_type = $event,
                          placeholder: "\u0646\u0648\u0639 \u0627\u0644\u0633\u064A\u0627\u0631\u0629",
                          label: "\u0646\u0648\u0639 \u0627\u0644\u0633\u064A\u0627\u0631\u0629",
                          class: "w-full"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UFormField, {
                      required: "",
                      label: "\u0644\u0648\u0646 \u0627\u0644\u0633\u064A\u0627\u0631\u0629",
                      name: "car_color"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          modelValue: unref(state).car_color,
                          "onUpdate:modelValue": ($event) => unref(state).car_color = $event,
                          placeholder: "\u0644\u0648\u0646 \u0627\u0644\u0633\u064A\u0627\u0631\u0629",
                          label: "\u0644\u0648\u0646 \u0627\u0644\u0633\u064A\u0627\u0631\u0629",
                          class: "w-full"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode("div", { class: "md:col-span-2 flex flex-wrap gap-2 mt-5" }, [
                      createVNode(_component_UButton, {
                        type: "submit",
                        class: "flex w-full md:w-40 py-2 justify-center font-bold lg:col-span-2 hover:cursor-pointer",
                        color: "secondary",
                        loading: unref(driversStore).loading,
                        label: "\u0625\u0636\u0627\u0641\u0629"
                      }, null, 8, ["loading"]),
                      createVNode(_component_UButton, {
                        variant: "soft",
                        class: "flex w-full md:w-20 py-2 justify-center font-bold lg:col-span-2 hover:cursor-pointer",
                        color: "secondary",
                        onClick: ($event) => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))({ name: "drivers" }),
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
                class: "grid grid-cols-1 md:grid-cols-2 gap-y-1 gap-x-4",
                onSubmit
              }, {
                default: withCtx(() => [
                  createVNode(_component_UFormField, {
                    required: "",
                    label: "\u0627\u0644\u0627\u0633\u0645",
                    name: "name"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_UInput, {
                        modelValue: unref(state).name,
                        "onUpdate:modelValue": ($event) => unref(state).name = $event,
                        placeholder: "\u0627\u0644\u0627\u0633\u0645",
                        label: "\u0627\u0644\u0627\u0633\u0645",
                        class: "w-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_UFormField, {
                    required: "",
                    label: "\u0631\u0642\u0645 \u0627\u0644\u062C\u0648\u0627\u0644",
                    name: "phone_no"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_UInput, {
                        type: "number",
                        modelValue: unref(state).phone_no,
                        "onUpdate:modelValue": ($event) => unref(state).phone_no = $event,
                        placeholder: "\u0631\u0642\u0645 \u0627\u0644\u062C\u0648\u0627\u0644",
                        label: "\u0631\u0642\u0645 \u0627\u0644\u062C\u0648\u0627\u0644",
                        class: "w-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_UFormField, {
                    required: "",
                    label: "\u0627\u0644\u0633\u0639\u0629 \u0627\u0644\u0642\u0635\u0648\u0649",
                    name: "maximum_capacity"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_UInput, {
                        type: "number",
                        modelValue: unref(state).maximum_capacity,
                        "onUpdate:modelValue": ($event) => unref(state).maximum_capacity = $event,
                        modelModifiers: { number: true },
                        placeholder: "\u0627\u0644\u0633\u0639\u0629 \u0627\u0644\u0642\u0635\u0648\u0649",
                        label: "\u0627\u0644\u0633\u0639\u0629 \u0627\u0644\u0642\u0635\u0648\u0649",
                        class: "w-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_UFormField, {
                    required: "",
                    label: "\u0627\u0644\u0639\u0646\u0648\u0627\u0646",
                    name: "address"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_UInput, {
                        modelValue: unref(state).address,
                        "onUpdate:modelValue": ($event) => unref(state).address = $event,
                        placeholder: "\u0627\u0644\u0639\u0646\u0648\u0627\u0646",
                        label: "\u0627\u0644\u0639\u0646\u0648\u0627\u0646",
                        class: "w-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_UFormField, {
                    required: "",
                    label: "\u0646\u0648\u0639 \u0627\u0644\u0633\u064A\u0627\u0631\u0629",
                    name: "car_type"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_UInput, {
                        modelValue: unref(state).car_type,
                        "onUpdate:modelValue": ($event) => unref(state).car_type = $event,
                        placeholder: "\u0646\u0648\u0639 \u0627\u0644\u0633\u064A\u0627\u0631\u0629",
                        label: "\u0646\u0648\u0639 \u0627\u0644\u0633\u064A\u0627\u0631\u0629",
                        class: "w-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_UFormField, {
                    required: "",
                    label: "\u0644\u0648\u0646 \u0627\u0644\u0633\u064A\u0627\u0631\u0629",
                    name: "car_color"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_UInput, {
                        modelValue: unref(state).car_color,
                        "onUpdate:modelValue": ($event) => unref(state).car_color = $event,
                        placeholder: "\u0644\u0648\u0646 \u0627\u0644\u0633\u064A\u0627\u0631\u0629",
                        label: "\u0644\u0648\u0646 \u0627\u0644\u0633\u064A\u0627\u0631\u0629",
                        class: "w-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  createVNode("div", { class: "md:col-span-2 flex flex-wrap gap-2 mt-5" }, [
                    createVNode(_component_UButton, {
                      type: "submit",
                      class: "flex w-full md:w-40 py-2 justify-center font-bold lg:col-span-2 hover:cursor-pointer",
                      color: "secondary",
                      loading: unref(driversStore).loading,
                      label: "\u0625\u0636\u0627\u0641\u0629"
                    }, null, 8, ["loading"]),
                    createVNode(_component_UButton, {
                      variant: "soft",
                      class: "flex w-full md:w-20 py-2 justify-center font-bold lg:col-span-2 hover:cursor-pointer",
                      color: "secondary",
                      onClick: ($event) => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))({ name: "drivers" }),
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/drivers/add.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=add-DlQaWstl.mjs.map
