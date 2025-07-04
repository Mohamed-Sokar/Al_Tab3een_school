import { _ as _sfc_main$1 } from './Card-ClkFNDdW.mjs';
import { _ as _sfc_main$2 } from './Form-xmP0I2N6.mjs';
import { _ as _sfc_main$3 } from './FormField-1OWKP-81.mjs';
import { _ as _sfc_main$4 } from './Input-Y7FMS0Nh.mjs';
import { h as useSupabaseUser, e as _sfc_main$7 } from './server.mjs';
import { defineComponent, reactive, ref, withCtx, unref, createVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { object, string } from 'yup';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "profile",
  __ssrInlineRender: true,
  setup(__props) {
    var _a, _b;
    const user = useSupabaseUser();
    const schema = object({
      name: string().min(2, "String must contain at least 2 charachter").required("Required")
    });
    const state = reactive({
      name: ((_b = (_a = user.value) == null ? void 0 : _a.user_metadata) == null ? void 0 : _b.full_name) || ""
    });
    const pending = ref(false);
    const saveProfile = async (event) => {
      console.log("Save Profile");
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UCard = _sfc_main$1;
      const _component_UForm = _sfc_main$2;
      const _component_UFormField = _sfc_main$3;
      const _component_UInput = _sfc_main$4;
      const _component_UButton = _sfc_main$7;
      _push(`<div${ssrRenderAttrs(_attrs)}><h2 class="mb-4 font-bold">\u062A\u063A\u064A\u064A\u0631 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062A \u0627\u0644\u0634\u062E\u0635\u064A\u0629</h2>`);
      _push(ssrRenderComponent(_component_UCard, { class: "mb-5" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UForm, {
              schema: unref(schema),
              state: unref(state),
              class: "space-y-4",
              onSubmit: saveProfile
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UFormField, {
                    label: "\u0627\u0644\u0627\u0633\u0645 \u0627\u0644\u0631\u0628\u0627\u0639\u064A",
                    name: "name"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          modelValue: unref(state).name,
                          "onUpdate:modelValue": ($event) => unref(state).name = $event,
                          class: "w-full",
                          placeholder: "\u0627\u0644\u0627\u0633\u0645 \u0627\u0644\u0631\u0628\u0627\u0639\u064A"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            modelValue: unref(state).name,
                            "onUpdate:modelValue": ($event) => unref(state).name = $event,
                            class: "w-full",
                            placeholder: "\u0627\u0644\u0627\u0633\u0645 \u0627\u0644\u0631\u0628\u0627\u0639\u064A"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UButton, {
                    type: "submit",
                    loading: unref(pending),
                    color: "secondary"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(` \u062D\u0641\u0638 `);
                      } else {
                        return [
                          createTextVNode(" \u062D\u0641\u0638 ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UFormField, {
                      label: "\u0627\u0644\u0627\u0633\u0645 \u0627\u0644\u0631\u0628\u0627\u0639\u064A",
                      name: "name"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          modelValue: unref(state).name,
                          "onUpdate:modelValue": ($event) => unref(state).name = $event,
                          class: "w-full",
                          placeholder: "\u0627\u0644\u0627\u0633\u0645 \u0627\u0644\u0631\u0628\u0627\u0639\u064A"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UButton, {
                      type: "submit",
                      loading: unref(pending),
                      color: "secondary"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" \u062D\u0641\u0638 ")
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
                class: "space-y-4",
                onSubmit: saveProfile
              }, {
                default: withCtx(() => [
                  createVNode(_component_UFormField, {
                    label: "\u0627\u0644\u0627\u0633\u0645 \u0627\u0644\u0631\u0628\u0627\u0639\u064A",
                    name: "name"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_UInput, {
                        modelValue: unref(state).name,
                        "onUpdate:modelValue": ($event) => unref(state).name = $event,
                        class: "w-full",
                        placeholder: "\u0627\u0644\u0627\u0633\u0645 \u0627\u0644\u0631\u0628\u0627\u0639\u064A"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_UButton, {
                    type: "submit",
                    loading: unref(pending),
                    color: "secondary"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" \u062D\u0641\u0638 ")
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
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/settings/profile.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=profile-0Y41EgCl.mjs.map
