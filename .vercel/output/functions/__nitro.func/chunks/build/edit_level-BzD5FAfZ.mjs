import { _ as _sfc_main$1 } from './Card-ClkFNDdW.mjs';
import { _ as _sfc_main$2 } from './Form-xmP0I2N6.mjs';
import { _ as _sfc_main$3 } from './FormField-1OWKP-81.mjs';
import { _ as _sfc_main$4 } from './Select-CUYWYClZ.mjs';
import { _ as _sfc_main$5 } from './Input-Y7FMS0Nh.mjs';
import { g as useRoute, e as _sfc_main$7, n as navigateTo } from './server.mjs';
import { defineComponent, reactive, ref, mergeProps, withCtx, unref, createVNode, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import { object, number, string } from 'yup';
import { l as level_options } from './constants-CI-Eb238.mjs';
import { u as useLevelsStore } from './levels-wubGyWhj.mjs';
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
import './api-Bx7QNuNm.mjs';
import 'axios';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "edit_level",
  __ssrInlineRender: true,
  setup(__props) {
    const levelsStore = useLevelsStore();
    const schema = object({
      title: string().required("\u0627\u0644\u0635\u0641 \u0627\u0644\u062F\u0631\u0627\u0633\u064A \u0645\u0637\u0644\u0648\u0628"),
      maximum_capacity: number().required("\u0627\u0644\u0633\u0639\u0629 \u0627\u0644\u0642\u0635\u0648\u0649 \u0645\u0637\u0644\u0648\u0628\u0629"),
      fees: number().required("\u0627\u0644\u0631\u0633\u0648\u0645 \u0645\u0637\u0644\u0648\u0628\u0629")
    });
    const state = reactive({
      // id: undefined,
      title: void 0,
      maximum_capacity: void 0,
      fees: void 0
      // studentsCount: undefined,
    });
    const route = useRoute();
    const form = ref();
    const levelId = route.params.id instanceof Array ? +route.params.id[0] : +route.params.id;
    const targetedLevel = levelsStore.getSpecificLevel(levelId);
    Object.assign(state, targetedLevel);
    const updateLevel = async () => {
      await levelsStore.updateLevel(levelId, state);
      navigateTo({ name: "levels" });
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
              class: "grid grid-cols-1 lg:grid-cols-2 gap-4",
              onSubmit: updateLevel
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UFormField, {
                    label: "\u0627\u0644\u0635\u0641 \u0627\u0644\u062F\u0631\u0627\u0633\u064A",
                    name: "title"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_USelect, {
                          items: unref(level_options),
                          modelValue: unref(state).title,
                          "onUpdate:modelValue": ($event) => unref(state).title = $event,
                          placeholder: "\u0627\u0644\u0635\u0641 \u0627\u0644\u062F\u0631\u0627\u0633\u064A",
                          label: "\u0627\u0644\u0635\u0641 \u0627\u0644\u062F\u0631\u0627\u0633\u064A",
                          class: "w-full"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_USelect, {
                            items: unref(level_options),
                            modelValue: unref(state).title,
                            "onUpdate:modelValue": ($event) => unref(state).title = $event,
                            placeholder: "\u0627\u0644\u0635\u0641 \u0627\u0644\u062F\u0631\u0627\u0633\u064A",
                            label: "\u0627\u0644\u0635\u0641 \u0627\u0644\u062F\u0631\u0627\u0633\u064A",
                            class: "w-full"
                          }, null, 8, ["items", "modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UFormField, {
                    label: "\u0627\u0644\u0633\u0639\u0629 \u0627\u0644\u0642\u0635\u0648\u0649",
                    name: "maximumCapacity"
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
                    label: "\u0627\u0644\u0631\u0633\u0648\u0645 \u0627\u0644\u0634\u0647\u0631\u064A\u0629",
                    name: "fees"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          type: "number",
                          modelValue: unref(state).fees,
                          "onUpdate:modelValue": ($event) => unref(state).fees = $event,
                          modelModifiers: { number: true },
                          placeholder: "\u0627\u0644\u0631\u0633\u0648\u0645 \u0627\u0644\u0634\u0647\u0631\u064A\u0629",
                          label: "\u0627\u0644\u0631\u0633\u0648\u0645 \u0627\u0644\u0634\u0647\u0631\u064A\u0629",
                          class: "w-full"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            type: "number",
                            modelValue: unref(state).fees,
                            "onUpdate:modelValue": ($event) => unref(state).fees = $event,
                            modelModifiers: { number: true },
                            placeholder: "\u0627\u0644\u0631\u0633\u0648\u0645 \u0627\u0644\u0634\u0647\u0631\u064A\u0629",
                            label: "\u0627\u0644\u0631\u0633\u0648\u0645 \u0627\u0644\u0634\u0647\u0631\u064A\u0629",
                            class: "w-full"
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
                    loading: unref(levelsStore).loading,
                    label: "\u062A\u0639\u062F\u064A\u0644"
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UButton, {
                    variant: "soft",
                    class: "flex w-20 py-2 justify-center font-bold lg:col-span-2 hover:cursor-pointer",
                    color: "secondary",
                    onClick: ($event) => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))({ name: "levels" }),
                    label: "\u0625\u0644\u063A\u0627\u0621"
                  }, null, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode(_component_UFormField, {
                      label: "\u0627\u0644\u0635\u0641 \u0627\u0644\u062F\u0631\u0627\u0633\u064A",
                      name: "title"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_USelect, {
                          items: unref(level_options),
                          modelValue: unref(state).title,
                          "onUpdate:modelValue": ($event) => unref(state).title = $event,
                          placeholder: "\u0627\u0644\u0635\u0641 \u0627\u0644\u062F\u0631\u0627\u0633\u064A",
                          label: "\u0627\u0644\u0635\u0641 \u0627\u0644\u062F\u0631\u0627\u0633\u064A",
                          class: "w-full"
                        }, null, 8, ["items", "modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UFormField, {
                      label: "\u0627\u0644\u0633\u0639\u0629 \u0627\u0644\u0642\u0635\u0648\u0649",
                      name: "maximumCapacity"
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
                      label: "\u0627\u0644\u0631\u0633\u0648\u0645 \u0627\u0644\u0634\u0647\u0631\u064A\u0629",
                      name: "fees"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          type: "number",
                          modelValue: unref(state).fees,
                          "onUpdate:modelValue": ($event) => unref(state).fees = $event,
                          modelModifiers: { number: true },
                          placeholder: "\u0627\u0644\u0631\u0633\u0648\u0645 \u0627\u0644\u0634\u0647\u0631\u064A\u0629",
                          label: "\u0627\u0644\u0631\u0633\u0648\u0645 \u0627\u0644\u0634\u0647\u0631\u064A\u0629",
                          class: "w-full"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode("div", { class: "col-span-2 flex gap-2 mt-5" }, [
                      createVNode(_component_UButton, {
                        type: "submit",
                        class: "flex w-40 py-2 justify-center font-bold lg:col-span-2 hover:cursor-pointer",
                        color: "secondary",
                        loading: unref(levelsStore).loading,
                        label: "\u062A\u0639\u062F\u064A\u0644"
                      }, null, 8, ["loading"]),
                      createVNode(_component_UButton, {
                        variant: "soft",
                        class: "flex w-20 py-2 justify-center font-bold lg:col-span-2 hover:cursor-pointer",
                        color: "secondary",
                        onClick: ($event) => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))({ name: "levels" }),
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
                onSubmit: updateLevel
              }, {
                default: withCtx(() => [
                  createVNode(_component_UFormField, {
                    label: "\u0627\u0644\u0635\u0641 \u0627\u0644\u062F\u0631\u0627\u0633\u064A",
                    name: "title"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_USelect, {
                        items: unref(level_options),
                        modelValue: unref(state).title,
                        "onUpdate:modelValue": ($event) => unref(state).title = $event,
                        placeholder: "\u0627\u0644\u0635\u0641 \u0627\u0644\u062F\u0631\u0627\u0633\u064A",
                        label: "\u0627\u0644\u0635\u0641 \u0627\u0644\u062F\u0631\u0627\u0633\u064A",
                        class: "w-full"
                      }, null, 8, ["items", "modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_UFormField, {
                    label: "\u0627\u0644\u0633\u0639\u0629 \u0627\u0644\u0642\u0635\u0648\u0649",
                    name: "maximumCapacity"
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
                    label: "\u0627\u0644\u0631\u0633\u0648\u0645 \u0627\u0644\u0634\u0647\u0631\u064A\u0629",
                    name: "fees"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_UInput, {
                        type: "number",
                        modelValue: unref(state).fees,
                        "onUpdate:modelValue": ($event) => unref(state).fees = $event,
                        modelModifiers: { number: true },
                        placeholder: "\u0627\u0644\u0631\u0633\u0648\u0645 \u0627\u0644\u0634\u0647\u0631\u064A\u0629",
                        label: "\u0627\u0644\u0631\u0633\u0648\u0645 \u0627\u0644\u0634\u0647\u0631\u064A\u0629",
                        class: "w-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  createVNode("div", { class: "col-span-2 flex gap-2 mt-5" }, [
                    createVNode(_component_UButton, {
                      type: "submit",
                      class: "flex w-40 py-2 justify-center font-bold lg:col-span-2 hover:cursor-pointer",
                      color: "secondary",
                      loading: unref(levelsStore).loading,
                      label: "\u062A\u0639\u062F\u064A\u0644"
                    }, null, 8, ["loading"]),
                    createVNode(_component_UButton, {
                      variant: "soft",
                      class: "flex w-20 py-2 justify-center font-bold lg:col-span-2 hover:cursor-pointer",
                      color: "secondary",
                      onClick: ($event) => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))({ name: "levels" }),
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/levels/[id]/edit_level.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=edit_level-BzD5FAfZ.mjs.map
