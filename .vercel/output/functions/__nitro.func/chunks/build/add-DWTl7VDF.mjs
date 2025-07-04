import { _ as _sfc_main$1 } from './Card-ClkFNDdW.mjs';
import { _ as _sfc_main$2 } from './Form-xmP0I2N6.mjs';
import { _ as _sfc_main$3 } from './FormField-1OWKP-81.mjs';
import { _ as _sfc_main$4 } from './Input-Y7FMS0Nh.mjs';
import { _ as _sfc_main$5 } from './Select-CUYWYClZ.mjs';
import { e as _sfc_main$7, n as navigateTo } from './server.mjs';
import { defineComponent, ref, reactive, mergeProps, withCtx, unref, createVNode, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import { object, string } from 'yup';
import { c as courses_options } from './constants-CI-Eb238.mjs';
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
  __name: "add",
  __ssrInlineRender: true,
  setup(__props) {
    const teachersStore = useTeachersStore();
    const form = ref();
    const schema = object({
      full_name: string().required("\u0627\u0644\u0627\u0633\u0645 \u0645\u0637\u0644\u0648\u0628"),
      identity_number: string().required("\u0631\u0642\u0645 \u0627\u0644\u0647\u0648\u064A\u0629 \u0645\u0637\u0644\u0648\u0628").matches(/^\d{9}$/, "\u0631\u0642\u0645 \u0627\u0644\u0647\u0648\u064A\u0629 \u064A\u062C\u0628 \u0623\u0646 \u064A\u062A\u0643\u0648\u0646 \u0645\u0646 9 \u0623\u0631\u0642\u0627\u0645"),
      phone_number: string().required("\u0631\u0642\u0645 \u0627\u0644\u062C\u0648\u0627\u0644 \u0645\u0637\u0644\u0648\u0628").matches(/^\d{10}$/, "\u0631\u0642\u0645 \u0627\u0644\u062C\u0648\u0627\u0644 \u064A\u062C\u0628 \u0623\u0646 \u064A\u062A\u0643\u0648\u0646 \u0645\u0646 10 \u0623\u0631\u0642\u0627\u0645"),
      birth_date: string().required("\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u0645\u064A\u0644\u0627\u062F \u0645\u0637\u0644\u0648\u0628"),
      subject: string().required("\u0627\u0644\u0645\u0627\u062F\u0629 \u0627\u0644\u062A\u064A \u064A\u062A\u0645 \u062A\u062F\u0631\u064A\u0633\u0647\u0627 \u0645\u0637\u0644\u0648\u0628\u0629")
    });
    const state = reactive({
      // id: undefined,
      full_name: void 0,
      identity_number: void 0,
      phone_number: void 0,
      birth_date: void 0,
      subject: void 0
      // has_behavioral_issues: undefined,
      // ubsent_days_count: undefined,
      // loans: undefined,
    });
    const createTeacher = async () => {
      await teachersStore.addTeacher({ ...state, manager_id: null });
      navigateTo({ name: "teachers-view-teachers_table" });
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UCard = _sfc_main$1;
      const _component_UForm = _sfc_main$2;
      const _component_UFormField = _sfc_main$3;
      const _component_UInput = _sfc_main$4;
      const _component_USelect = _sfc_main$5;
      const _component_UButton = _sfc_main$7;
      _push(ssrRenderComponent(_component_UCard, mergeProps({ class: "max-w-3xl mx-auto mt-15" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UForm, {
              ref_key: "form",
              ref: form,
              schema: unref(schema),
              state: unref(state),
              class: "grid grid-cols-1 lg:grid-cols-2 gap-4",
              onSubmit: createTeacher
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UFormField, {
                    label: "\u0627\u0644\u0627\u0633\u0645 \u0631\u0628\u0627\u0639\u064A",
                    name: "full_name"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          modelValue: unref(state).full_name,
                          "onUpdate:modelValue": ($event) => unref(state).full_name = $event,
                          placeholder: "\u0627\u0644\u0627\u0633\u0645 \u0631\u0628\u0627\u0639\u064A",
                          label: "\u0627\u0644\u0627\u0633\u0645",
                          class: "w-full"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            modelValue: unref(state).full_name,
                            "onUpdate:modelValue": ($event) => unref(state).full_name = $event,
                            placeholder: "\u0627\u0644\u0627\u0633\u0645 \u0631\u0628\u0627\u0639\u064A",
                            label: "\u0627\u0644\u0627\u0633\u0645",
                            class: "w-full"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UFormField, {
                    label: "\u0631\u0642\u0645 \u0627\u0644\u0647\u0648\u064A\u0629",
                    name: "identity_number"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          modelValue: unref(state).identity_number,
                          "onUpdate:modelValue": ($event) => unref(state).identity_number = $event,
                          modelModifiers: { number: true },
                          placeholder: "\u0631\u0642\u0645 \u0627\u0644\u0647\u0648\u064A\u0629",
                          label: "\u0631\u0642\u0645 \u0627\u0644\u0647\u0648\u064A\u0629",
                          class: "w-full"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            modelValue: unref(state).identity_number,
                            "onUpdate:modelValue": ($event) => unref(state).identity_number = $event,
                            modelModifiers: { number: true },
                            placeholder: "\u0631\u0642\u0645 \u0627\u0644\u0647\u0648\u064A\u0629",
                            label: "\u0631\u0642\u0645 \u0627\u0644\u0647\u0648\u064A\u0629",
                            class: "w-full"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UFormField, {
                    label: "\u0631\u0642\u0645 \u0627\u0644\u062C\u0648\u0627\u0644",
                    name: "phone_number"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          modelValue: unref(state).phone_number,
                          "onUpdate:modelValue": ($event) => unref(state).phone_number = $event,
                          modelModifiers: { number: true },
                          placeholder: "05xxxxxxxx",
                          label: "\u0631\u0642\u0645 \u0627\u0644\u062C\u0648\u0627\u0644",
                          class: "w-full"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            modelValue: unref(state).phone_number,
                            "onUpdate:modelValue": ($event) => unref(state).phone_number = $event,
                            modelModifiers: { number: true },
                            placeholder: "05xxxxxxxx",
                            label: "\u0631\u0642\u0645 \u0627\u0644\u062C\u0648\u0627\u0644",
                            class: "w-full"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UFormField, {
                    label: "\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u0645\u064A\u0644\u0627\u062F",
                    name: "birth_date"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          type: "date",
                          modelValue: unref(state).birth_date,
                          "onUpdate:modelValue": ($event) => unref(state).birth_date = $event,
                          class: "w-full",
                          placeholder: "\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u0645\u064A\u0644\u0627\u062F",
                          icon: "heroicons-calendar-days-solid"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            type: "date",
                            modelValue: unref(state).birth_date,
                            "onUpdate:modelValue": ($event) => unref(state).birth_date = $event,
                            class: "w-full",
                            placeholder: "\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u0645\u064A\u0644\u0627\u062F",
                            icon: "heroicons-calendar-days-solid"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UFormField, {
                    label: "\u0627\u0644\u0645\u0627\u062F\u0629",
                    name: "subject"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_USelect, {
                          modelValue: unref(state).subject,
                          "onUpdate:modelValue": ($event) => unref(state).subject = $event,
                          items: unref(courses_options),
                          type: "text",
                          class: "w-full",
                          placeholder: "\u0627\u0644\u0645\u0648\u0627\u062F \u0627\u0644\u062A\u064A \u064A\u062A\u0645 \u062A\u062F\u0631\u064A\u0633\u0647\u0627"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_USelect, {
                            modelValue: unref(state).subject,
                            "onUpdate:modelValue": ($event) => unref(state).subject = $event,
                            items: unref(courses_options),
                            type: "text",
                            class: "w-full",
                            placeholder: "\u0627\u0644\u0645\u0648\u0627\u062F \u0627\u0644\u062A\u064A \u064A\u062A\u0645 \u062A\u062F\u0631\u064A\u0633\u0647\u0627"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
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
                    loading: unref(teachersStore).loading,
                    label: "\u0625\u0636\u0627\u0641\u0629"
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UButton, {
                    variant: "soft",
                    class: "flex w-20 py-2 justify-center font-bold lg:col-span-2 hover:cursor-pointer",
                    color: "secondary",
                    onClick: ($event) => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))("/teachers/view"),
                    label: "\u0625\u0644\u063A\u0627\u0621"
                  }, null, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode(_component_UFormField, {
                      label: "\u0627\u0644\u0627\u0633\u0645 \u0631\u0628\u0627\u0639\u064A",
                      name: "full_name"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          modelValue: unref(state).full_name,
                          "onUpdate:modelValue": ($event) => unref(state).full_name = $event,
                          placeholder: "\u0627\u0644\u0627\u0633\u0645 \u0631\u0628\u0627\u0639\u064A",
                          label: "\u0627\u0644\u0627\u0633\u0645",
                          class: "w-full"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UFormField, {
                      label: "\u0631\u0642\u0645 \u0627\u0644\u0647\u0648\u064A\u0629",
                      name: "identity_number"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          modelValue: unref(state).identity_number,
                          "onUpdate:modelValue": ($event) => unref(state).identity_number = $event,
                          modelModifiers: { number: true },
                          placeholder: "\u0631\u0642\u0645 \u0627\u0644\u0647\u0648\u064A\u0629",
                          label: "\u0631\u0642\u0645 \u0627\u0644\u0647\u0648\u064A\u0629",
                          class: "w-full"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UFormField, {
                      label: "\u0631\u0642\u0645 \u0627\u0644\u062C\u0648\u0627\u0644",
                      name: "phone_number"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          modelValue: unref(state).phone_number,
                          "onUpdate:modelValue": ($event) => unref(state).phone_number = $event,
                          modelModifiers: { number: true },
                          placeholder: "05xxxxxxxx",
                          label: "\u0631\u0642\u0645 \u0627\u0644\u062C\u0648\u0627\u0644",
                          class: "w-full"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UFormField, {
                      label: "\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u0645\u064A\u0644\u0627\u062F",
                      name: "birth_date"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          type: "date",
                          modelValue: unref(state).birth_date,
                          "onUpdate:modelValue": ($event) => unref(state).birth_date = $event,
                          class: "w-full",
                          placeholder: "\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u0645\u064A\u0644\u0627\u062F",
                          icon: "heroicons-calendar-days-solid"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UFormField, {
                      label: "\u0627\u0644\u0645\u0627\u062F\u0629",
                      name: "subject"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_USelect, {
                          modelValue: unref(state).subject,
                          "onUpdate:modelValue": ($event) => unref(state).subject = $event,
                          items: unref(courses_options),
                          type: "text",
                          class: "w-full",
                          placeholder: "\u0627\u0644\u0645\u0648\u0627\u062F \u0627\u0644\u062A\u064A \u064A\u062A\u0645 \u062A\u062F\u0631\u064A\u0633\u0647\u0627"
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                      ]),
                      _: 1
                    }),
                    createVNode("div", { class: "col-span-2 flex gap-2 mt-5" }, [
                      createVNode(_component_UButton, {
                        type: "submit",
                        class: "flex w-40 py-2 justify-center font-bold lg:col-span-2 hover:cursor-pointer",
                        color: "secondary",
                        loading: unref(teachersStore).loading,
                        label: "\u0625\u0636\u0627\u0641\u0629"
                      }, null, 8, ["loading"]),
                      createVNode(_component_UButton, {
                        variant: "soft",
                        class: "flex w-20 py-2 justify-center font-bold lg:col-span-2 hover:cursor-pointer",
                        color: "secondary",
                        onClick: ($event) => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))("/teachers/view"),
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
                class: "grid grid-cols-1 lg:grid-cols-2 gap-4",
                onSubmit: createTeacher
              }, {
                default: withCtx(() => [
                  createVNode(_component_UFormField, {
                    label: "\u0627\u0644\u0627\u0633\u0645 \u0631\u0628\u0627\u0639\u064A",
                    name: "full_name"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_UInput, {
                        modelValue: unref(state).full_name,
                        "onUpdate:modelValue": ($event) => unref(state).full_name = $event,
                        placeholder: "\u0627\u0644\u0627\u0633\u0645 \u0631\u0628\u0627\u0639\u064A",
                        label: "\u0627\u0644\u0627\u0633\u0645",
                        class: "w-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_UFormField, {
                    label: "\u0631\u0642\u0645 \u0627\u0644\u0647\u0648\u064A\u0629",
                    name: "identity_number"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_UInput, {
                        modelValue: unref(state).identity_number,
                        "onUpdate:modelValue": ($event) => unref(state).identity_number = $event,
                        modelModifiers: { number: true },
                        placeholder: "\u0631\u0642\u0645 \u0627\u0644\u0647\u0648\u064A\u0629",
                        label: "\u0631\u0642\u0645 \u0627\u0644\u0647\u0648\u064A\u0629",
                        class: "w-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_UFormField, {
                    label: "\u0631\u0642\u0645 \u0627\u0644\u062C\u0648\u0627\u0644",
                    name: "phone_number"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_UInput, {
                        modelValue: unref(state).phone_number,
                        "onUpdate:modelValue": ($event) => unref(state).phone_number = $event,
                        modelModifiers: { number: true },
                        placeholder: "05xxxxxxxx",
                        label: "\u0631\u0642\u0645 \u0627\u0644\u062C\u0648\u0627\u0644",
                        class: "w-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_UFormField, {
                    label: "\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u0645\u064A\u0644\u0627\u062F",
                    name: "birth_date"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_UInput, {
                        type: "date",
                        modelValue: unref(state).birth_date,
                        "onUpdate:modelValue": ($event) => unref(state).birth_date = $event,
                        class: "w-full",
                        placeholder: "\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u0645\u064A\u0644\u0627\u062F",
                        icon: "heroicons-calendar-days-solid"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_UFormField, {
                    label: "\u0627\u0644\u0645\u0627\u062F\u0629",
                    name: "subject"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_USelect, {
                        modelValue: unref(state).subject,
                        "onUpdate:modelValue": ($event) => unref(state).subject = $event,
                        items: unref(courses_options),
                        type: "text",
                        class: "w-full",
                        placeholder: "\u0627\u0644\u0645\u0648\u0627\u062F \u0627\u0644\u062A\u064A \u064A\u062A\u0645 \u062A\u062F\u0631\u064A\u0633\u0647\u0627"
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                    ]),
                    _: 1
                  }),
                  createVNode("div", { class: "col-span-2 flex gap-2 mt-5" }, [
                    createVNode(_component_UButton, {
                      type: "submit",
                      class: "flex w-40 py-2 justify-center font-bold lg:col-span-2 hover:cursor-pointer",
                      color: "secondary",
                      loading: unref(teachersStore).loading,
                      label: "\u0625\u0636\u0627\u0641\u0629"
                    }, null, 8, ["loading"]),
                    createVNode(_component_UButton, {
                      variant: "soft",
                      class: "flex w-20 py-2 justify-center font-bold lg:col-span-2 hover:cursor-pointer",
                      color: "secondary",
                      onClick: ($event) => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))("/teachers/view"),
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/teachers/add.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=add-DWTl7VDF.mjs.map
