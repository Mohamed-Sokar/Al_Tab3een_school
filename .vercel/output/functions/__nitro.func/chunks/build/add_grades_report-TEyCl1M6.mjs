import { _ as _sfc_main$1 } from './Card-ClkFNDdW.mjs';
import { _ as _sfc_main$2 } from './Form-xmP0I2N6.mjs';
import { _ as _sfc_main$3 } from './FormField-1OWKP-81.mjs';
import { _ as _sfc_main$4 } from './Input-Y7FMS0Nh.mjs';
import { _ as _sfc_main$5 } from './Select-CUYWYClZ.mjs';
import { g as useRoute, e as _sfc_main$7, n as navigateTo } from './server.mjs';
import { defineComponent, reactive, ref, mergeProps, withCtx, unref, createVNode, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import { object, string, number } from 'yup';
import { s as students, b as grades_level_options, g as gradesReports } from './constants-CI-Eb238.mjs';
import { u as useAppToast } from './useAppToast-BZDaw0os.mjs';
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
  __name: "add_grades_report",
  __ssrInlineRender: true,
  setup(__props) {
    const schema = object({
      arabic: number().required("\u0627\u0644\u0644\u063A\u0629 \u0627\u0644\u0639\u0631\u0628\u064A\u0629 \u0645\u0637\u0644\u0648\u0628\u0629"),
      math: number().required("\u0627\u0644\u0631\u064A\u0627\u0636\u064A\u0627\u062A \u0645\u0637\u0644\u0648\u0628\u0629"),
      science: number().required("\u0627\u0644\u0639\u0644\u0648\u0645 \u0645\u0637\u0644\u0648\u0628"),
      quran: number().required("\u0627\u0644\u0642\u0631\u0622\u0646 \u0645\u0637\u0644\u0648\u0628"),
      english: number().required("\u0627\u0644\u0644\u063A\u0629 \u0627\u0644\u0625\u0646\u062C\u0644\u064A\u0632\u064A\u0629 \u0645\u0637\u0644\u0648\u0628\u0629"),
      relegion: number().required("\u0627\u0644\u062A\u0631\u0628\u064A\u0629 \u0627\u0644\u0625\u0633\u0644\u0627\u0645\u064A\u0629 \u0645\u0637\u0644\u0648\u0628\u0629"),
      maxmumGrade: number().required("\u0627\u0644\u0646\u0647\u0627\u064A\u0629 \u0627\u0644\u0642\u0635\u0648\u0649 \u0645\u0637\u0644\u0648\u0628\u0629"),
      minmumGrade: number().required("\u0627\u0644\u0646\u0647\u0627\u064A\u0629 \u0627\u0644\u062F\u0646\u064A\u0627 \u0645\u0637\u0644\u0648\u0628\u0629"),
      type: string().required("\u0646\u0648\u0639 \u0627\u0644\u0643\u0634\u0641 \u0645\u0637\u0644\u0648\u0628")
    });
    const state = reactive({
      id: void 0,
      student_name: void 0,
      level: void 0,
      section: void 0,
      arabic: void 0,
      math: void 0,
      science: void 0,
      quran: void 0,
      english: void 0,
      relegion: void 0,
      maxmumGrade: void 0,
      minmumGrade: void 0,
      average: void 0,
      type: void 0
    });
    const route = useRoute();
    const { toastSuccess } = useAppToast();
    const isLoading = ref(false);
    const form = ref();
    const studentsData = ref(students);
    const targetedStudent = studentsData.value.find(
      (student) => student.id.toString() === route.params.id.toString()
    );
    const addReport = async () => {
      isLoading.value = true;
      gradesReports.unshift({
        id: Math.random(),
        student_name: targetedStudent == null ? void 0 : targetedStudent.full_name,
        level: targetedStudent == null ? void 0 : targetedStudent.level,
        section: targetedStudent == null ? void 0 : targetedStudent.section,
        arabic: state == null ? void 0 : state.arabic,
        math: state == null ? void 0 : state.math,
        science: state == null ? void 0 : state.science,
        english: state == null ? void 0 : state.english,
        relegion: state == null ? void 0 : state.relegion,
        type: state == null ? void 0 : state.type,
        maxmumGrade: state == null ? void 0 : state.maxmumGrade,
        minmumGrade: state == null ? void 0 : state.minmumGrade,
        quran: state == null ? void 0 : state.quran,
        average: `${Math.round(
          ((state == null ? void 0 : state.arabic) + (state == null ? void 0 : state.math) + (state == null ? void 0 : state.science) + (state == null ? void 0 : state.quran) + (state == null ? void 0 : state.english) + (state == null ? void 0 : state.relegion)) / 6
        )}%`
      });
      setTimeout(() => {
        isLoading.value = false;
        toastSuccess({
          title: "\u062A\u0645 \u0625\u0636\u0627\u0641\u0629 \u062A\u0642\u0631\u064A\u0631 \u0627\u0644\u062F\u0631\u062C\u0627\u062A \u0628\u0646\u062C\u0627\u062D"
        });
        navigateTo("/students/view/grades");
      }, 500);
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
              class: "grid grid-cols-2 gap-4",
              onSubmit: addReport
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UFormField, {
                    label: "\u0627\u0644\u0646\u0647\u0627\u064A\u0629 \u0627\u0644\u0642\u0635\u0648\u0649",
                    name: "maxmumGrade"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          type: "number",
                          modelValue: unref(state).maxmumGrade,
                          "onUpdate:modelValue": ($event) => unref(state).maxmumGrade = $event,
                          modelModifiers: { number: true },
                          placeholder: "\u0627\u0644\u0646\u0647\u0627\u064A\u0629 \u0627\u0644\u0642\u0635\u0648\u0649",
                          label: "\u0627\u0644\u0646\u0647\u0627\u064A\u0629 \u0627\u0644\u0642\u0635\u0648\u0649",
                          class: "w-full"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            type: "number",
                            modelValue: unref(state).maxmumGrade,
                            "onUpdate:modelValue": ($event) => unref(state).maxmumGrade = $event,
                            modelModifiers: { number: true },
                            placeholder: "\u0627\u0644\u0646\u0647\u0627\u064A\u0629 \u0627\u0644\u0642\u0635\u0648\u0649",
                            label: "\u0627\u0644\u0646\u0647\u0627\u064A\u0629 \u0627\u0644\u0642\u0635\u0648\u0649",
                            class: "w-full"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UFormField, {
                    label: "\u0627\u0644\u0646\u0647\u0627\u064A\u0629 \u0627\u0644\u062F\u0646\u064A\u0627",
                    name: "minmumGrade"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          type: "number",
                          modelValue: unref(state).minmumGrade,
                          "onUpdate:modelValue": ($event) => unref(state).minmumGrade = $event,
                          modelModifiers: { number: true },
                          placeholder: "\u0627\u0644\u0646\u0647\u0627\u064A\u0629 \u0627\u0644\u062F\u0646\u064A\u0627",
                          label: "\u0627\u0644\u0646\u0647\u0627\u064A\u0629 \u0627\u0644\u062F\u0646\u064A\u0627",
                          class: "w-full"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            type: "number",
                            modelValue: unref(state).minmumGrade,
                            "onUpdate:modelValue": ($event) => unref(state).minmumGrade = $event,
                            modelModifiers: { number: true },
                            placeholder: "\u0627\u0644\u0646\u0647\u0627\u064A\u0629 \u0627\u0644\u062F\u0646\u064A\u0627",
                            label: "\u0627\u0644\u0646\u0647\u0627\u064A\u0629 \u0627\u0644\u062F\u0646\u064A\u0627",
                            class: "w-full"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UFormField, {
                    label: "\u0627\u0644\u0644\u063A\u0629 \u0627\u0644\u0639\u0631\u0628\u064A\u0629",
                    name: "arabic"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          type: "number",
                          modelValue: unref(state).arabic,
                          "onUpdate:modelValue": ($event) => unref(state).arabic = $event,
                          modelModifiers: { number: true },
                          placeholder: "\u0627\u0644\u0644\u063A\u0629 \u0627\u0644\u0639\u0631\u0628\u064A\u0629",
                          label: "\u0627\u0644\u0644\u063A\u0629 \u0627\u0644\u0639\u0631\u0628\u064A\u0629",
                          class: "w-full"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            type: "number",
                            modelValue: unref(state).arabic,
                            "onUpdate:modelValue": ($event) => unref(state).arabic = $event,
                            modelModifiers: { number: true },
                            placeholder: "\u0627\u0644\u0644\u063A\u0629 \u0627\u0644\u0639\u0631\u0628\u064A\u0629",
                            label: "\u0627\u0644\u0644\u063A\u0629 \u0627\u0644\u0639\u0631\u0628\u064A\u0629",
                            class: "w-full"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UFormField, {
                    label: "\u0627\u0644\u0644\u063A\u0629 \u0627\u0644\u0625\u0646\u062C\u0644\u064A\u0632\u064A\u0629",
                    name: "english"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          type: "number",
                          modelValue: unref(state).english,
                          "onUpdate:modelValue": ($event) => unref(state).english = $event,
                          modelModifiers: { number: true },
                          placeholder: "\u0627\u0644\u0644\u063A\u0629 \u0627\u0644\u0625\u0646\u062C\u0644\u064A\u0632\u064A\u0629",
                          label: "\u0627\u0644\u0644\u063A\u0629 \u0627\u0644\u0625\u0646\u062C\u0644\u064A\u0632\u064A\u0629",
                          class: "w-full"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            type: "number",
                            modelValue: unref(state).english,
                            "onUpdate:modelValue": ($event) => unref(state).english = $event,
                            modelModifiers: { number: true },
                            placeholder: "\u0627\u0644\u0644\u063A\u0629 \u0627\u0644\u0625\u0646\u062C\u0644\u064A\u0632\u064A\u0629",
                            label: "\u0627\u0644\u0644\u063A\u0629 \u0627\u0644\u0625\u0646\u062C\u0644\u064A\u0632\u064A\u0629",
                            class: "w-full"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UFormField, {
                    label: "\u0627\u0644\u062A\u0631\u0628\u064A\u0629 \u0627\u0644\u0625\u0633\u0644\u0627\u0645\u064A\u0629",
                    name: "relegion"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          type: "number",
                          modelValue: unref(state).relegion,
                          "onUpdate:modelValue": ($event) => unref(state).relegion = $event,
                          modelModifiers: { number: true },
                          placeholder: "\u0627\u0644\u062A\u0631\u0628\u064A\u0629 \u0627\u0644\u0625\u0633\u0644\u0627\u0645\u064A\u0629",
                          label: "\u0627\u0644\u062A\u0631\u0628\u064A\u0629 \u0627\u0644\u0625\u0633\u0644\u0627\u0645\u064A\u0629",
                          class: "w-full"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            type: "number",
                            modelValue: unref(state).relegion,
                            "onUpdate:modelValue": ($event) => unref(state).relegion = $event,
                            modelModifiers: { number: true },
                            placeholder: "\u0627\u0644\u062A\u0631\u0628\u064A\u0629 \u0627\u0644\u0625\u0633\u0644\u0627\u0645\u064A\u0629",
                            label: "\u0627\u0644\u062A\u0631\u0628\u064A\u0629 \u0627\u0644\u0625\u0633\u0644\u0627\u0645\u064A\u0629",
                            class: "w-full"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UFormField, {
                    label: "\u0631\u064A\u0627\u0636\u064A\u0627\u062A",
                    name: "math"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          type: "number",
                          modelValue: unref(state).math,
                          "onUpdate:modelValue": ($event) => unref(state).math = $event,
                          modelModifiers: { number: true },
                          placeholder: "\u0631\u064A\u0627\u0636\u064A\u0627\u062A",
                          label: "\u0631\u064A\u0627\u0636\u064A\u0627\u062A",
                          class: "w-full"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            type: "number",
                            modelValue: unref(state).math,
                            "onUpdate:modelValue": ($event) => unref(state).math = $event,
                            modelModifiers: { number: true },
                            placeholder: "\u0631\u064A\u0627\u0636\u064A\u0627\u062A",
                            label: "\u0631\u064A\u0627\u0636\u064A\u0627\u062A",
                            class: "w-full"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UFormField, {
                    label: "\u0639\u0644\u0648\u0645",
                    name: "science"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          type: "number",
                          modelValue: unref(state).science,
                          "onUpdate:modelValue": ($event) => unref(state).science = $event,
                          modelModifiers: { number: true },
                          placeholder: "\u0639\u0644\u0648\u0645",
                          label: "\u0639\u0644\u0648\u0645",
                          class: "w-full"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            type: "number",
                            modelValue: unref(state).science,
                            "onUpdate:modelValue": ($event) => unref(state).science = $event,
                            modelModifiers: { number: true },
                            placeholder: "\u0639\u0644\u0648\u0645",
                            label: "\u0639\u0644\u0648\u0645",
                            class: "w-full"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UFormField, {
                    label: "\u0642\u0631\u0622\u0646",
                    name: "quran"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          type: "number",
                          modelValue: unref(state).quran,
                          "onUpdate:modelValue": ($event) => unref(state).quran = $event,
                          modelModifiers: { number: true },
                          placeholder: "\u0642\u0631\u0622\u0646",
                          label: "\u0642\u0631\u0622\u0646",
                          class: "w-full"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            type: "number",
                            modelValue: unref(state).quran,
                            "onUpdate:modelValue": ($event) => unref(state).quran = $event,
                            modelModifiers: { number: true },
                            placeholder: "\u0642\u0631\u0622\u0646",
                            label: "\u0642\u0631\u0622\u0646",
                            class: "w-full"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UFormField, {
                    label: "\u0646\u0648\u0639 \u0627\u0644\u0643\u0634\u0641",
                    name: "type"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_USelect, {
                          modelValue: unref(state).type,
                          "onUpdate:modelValue": ($event) => unref(state).type = $event,
                          items: unref(grades_level_options),
                          placeholder: "\u0646\u0648\u0639 \u0627\u0644\u0643\u0634\u0641",
                          label: "\u0646\u0648\u0639 \u0627\u0644\u0643\u0634\u0641",
                          class: "w-full"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_USelect, {
                            modelValue: unref(state).type,
                            "onUpdate:modelValue": ($event) => unref(state).type = $event,
                            items: unref(grades_level_options),
                            placeholder: "\u0646\u0648\u0639 \u0627\u0644\u0643\u0634\u0641",
                            label: "\u0646\u0648\u0639 \u0627\u0644\u0643\u0634\u0641",
                            class: "w-full"
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
                    label: "\u0625\u0636\u0627\u0641\u0629",
                    loading: unref(isLoading)
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UButton, {
                    variant: "soft",
                    class: "flex w-20 py-2 justify-center font-bold lg:col-span-2 hover:cursor-pointer",
                    color: "secondary",
                    onClick: ($event) => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))("/students/view"),
                    label: "\u0625\u0644\u063A\u0627\u0621"
                  }, null, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode(_component_UFormField, {
                      label: "\u0627\u0644\u0646\u0647\u0627\u064A\u0629 \u0627\u0644\u0642\u0635\u0648\u0649",
                      name: "maxmumGrade"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          type: "number",
                          modelValue: unref(state).maxmumGrade,
                          "onUpdate:modelValue": ($event) => unref(state).maxmumGrade = $event,
                          modelModifiers: { number: true },
                          placeholder: "\u0627\u0644\u0646\u0647\u0627\u064A\u0629 \u0627\u0644\u0642\u0635\u0648\u0649",
                          label: "\u0627\u0644\u0646\u0647\u0627\u064A\u0629 \u0627\u0644\u0642\u0635\u0648\u0649",
                          class: "w-full"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UFormField, {
                      label: "\u0627\u0644\u0646\u0647\u0627\u064A\u0629 \u0627\u0644\u062F\u0646\u064A\u0627",
                      name: "minmumGrade"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          type: "number",
                          modelValue: unref(state).minmumGrade,
                          "onUpdate:modelValue": ($event) => unref(state).minmumGrade = $event,
                          modelModifiers: { number: true },
                          placeholder: "\u0627\u0644\u0646\u0647\u0627\u064A\u0629 \u0627\u0644\u062F\u0646\u064A\u0627",
                          label: "\u0627\u0644\u0646\u0647\u0627\u064A\u0629 \u0627\u0644\u062F\u0646\u064A\u0627",
                          class: "w-full"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UFormField, {
                      label: "\u0627\u0644\u0644\u063A\u0629 \u0627\u0644\u0639\u0631\u0628\u064A\u0629",
                      name: "arabic"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          type: "number",
                          modelValue: unref(state).arabic,
                          "onUpdate:modelValue": ($event) => unref(state).arabic = $event,
                          modelModifiers: { number: true },
                          placeholder: "\u0627\u0644\u0644\u063A\u0629 \u0627\u0644\u0639\u0631\u0628\u064A\u0629",
                          label: "\u0627\u0644\u0644\u063A\u0629 \u0627\u0644\u0639\u0631\u0628\u064A\u0629",
                          class: "w-full"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UFormField, {
                      label: "\u0627\u0644\u0644\u063A\u0629 \u0627\u0644\u0625\u0646\u062C\u0644\u064A\u0632\u064A\u0629",
                      name: "english"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          type: "number",
                          modelValue: unref(state).english,
                          "onUpdate:modelValue": ($event) => unref(state).english = $event,
                          modelModifiers: { number: true },
                          placeholder: "\u0627\u0644\u0644\u063A\u0629 \u0627\u0644\u0625\u0646\u062C\u0644\u064A\u0632\u064A\u0629",
                          label: "\u0627\u0644\u0644\u063A\u0629 \u0627\u0644\u0625\u0646\u062C\u0644\u064A\u0632\u064A\u0629",
                          class: "w-full"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UFormField, {
                      label: "\u0627\u0644\u062A\u0631\u0628\u064A\u0629 \u0627\u0644\u0625\u0633\u0644\u0627\u0645\u064A\u0629",
                      name: "relegion"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          type: "number",
                          modelValue: unref(state).relegion,
                          "onUpdate:modelValue": ($event) => unref(state).relegion = $event,
                          modelModifiers: { number: true },
                          placeholder: "\u0627\u0644\u062A\u0631\u0628\u064A\u0629 \u0627\u0644\u0625\u0633\u0644\u0627\u0645\u064A\u0629",
                          label: "\u0627\u0644\u062A\u0631\u0628\u064A\u0629 \u0627\u0644\u0625\u0633\u0644\u0627\u0645\u064A\u0629",
                          class: "w-full"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UFormField, {
                      label: "\u0631\u064A\u0627\u0636\u064A\u0627\u062A",
                      name: "math"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          type: "number",
                          modelValue: unref(state).math,
                          "onUpdate:modelValue": ($event) => unref(state).math = $event,
                          modelModifiers: { number: true },
                          placeholder: "\u0631\u064A\u0627\u0636\u064A\u0627\u062A",
                          label: "\u0631\u064A\u0627\u0636\u064A\u0627\u062A",
                          class: "w-full"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UFormField, {
                      label: "\u0639\u0644\u0648\u0645",
                      name: "science"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          type: "number",
                          modelValue: unref(state).science,
                          "onUpdate:modelValue": ($event) => unref(state).science = $event,
                          modelModifiers: { number: true },
                          placeholder: "\u0639\u0644\u0648\u0645",
                          label: "\u0639\u0644\u0648\u0645",
                          class: "w-full"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UFormField, {
                      label: "\u0642\u0631\u0622\u0646",
                      name: "quran"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          type: "number",
                          modelValue: unref(state).quran,
                          "onUpdate:modelValue": ($event) => unref(state).quran = $event,
                          modelModifiers: { number: true },
                          placeholder: "\u0642\u0631\u0622\u0646",
                          label: "\u0642\u0631\u0622\u0646",
                          class: "w-full"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UFormField, {
                      label: "\u0646\u0648\u0639 \u0627\u0644\u0643\u0634\u0641",
                      name: "type"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_USelect, {
                          modelValue: unref(state).type,
                          "onUpdate:modelValue": ($event) => unref(state).type = $event,
                          items: unref(grades_level_options),
                          placeholder: "\u0646\u0648\u0639 \u0627\u0644\u0643\u0634\u0641",
                          label: "\u0646\u0648\u0639 \u0627\u0644\u0643\u0634\u0641",
                          class: "w-full"
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                      ]),
                      _: 1
                    }),
                    createVNode("div", { class: "col-span-2 flex gap-2 mt-5" }, [
                      createVNode(_component_UButton, {
                        type: "submit",
                        class: "flex w-40 py-2 justify-center font-bold lg:col-span-2 hover:cursor-pointer",
                        color: "secondary",
                        label: "\u0625\u0636\u0627\u0641\u0629",
                        loading: unref(isLoading)
                      }, null, 8, ["loading"]),
                      createVNode(_component_UButton, {
                        variant: "soft",
                        class: "flex w-20 py-2 justify-center font-bold lg:col-span-2 hover:cursor-pointer",
                        color: "secondary",
                        onClick: ($event) => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))("/students/view"),
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
                onSubmit: addReport
              }, {
                default: withCtx(() => [
                  createVNode(_component_UFormField, {
                    label: "\u0627\u0644\u0646\u0647\u0627\u064A\u0629 \u0627\u0644\u0642\u0635\u0648\u0649",
                    name: "maxmumGrade"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_UInput, {
                        type: "number",
                        modelValue: unref(state).maxmumGrade,
                        "onUpdate:modelValue": ($event) => unref(state).maxmumGrade = $event,
                        modelModifiers: { number: true },
                        placeholder: "\u0627\u0644\u0646\u0647\u0627\u064A\u0629 \u0627\u0644\u0642\u0635\u0648\u0649",
                        label: "\u0627\u0644\u0646\u0647\u0627\u064A\u0629 \u0627\u0644\u0642\u0635\u0648\u0649",
                        class: "w-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_UFormField, {
                    label: "\u0627\u0644\u0646\u0647\u0627\u064A\u0629 \u0627\u0644\u062F\u0646\u064A\u0627",
                    name: "minmumGrade"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_UInput, {
                        type: "number",
                        modelValue: unref(state).minmumGrade,
                        "onUpdate:modelValue": ($event) => unref(state).minmumGrade = $event,
                        modelModifiers: { number: true },
                        placeholder: "\u0627\u0644\u0646\u0647\u0627\u064A\u0629 \u0627\u0644\u062F\u0646\u064A\u0627",
                        label: "\u0627\u0644\u0646\u0647\u0627\u064A\u0629 \u0627\u0644\u062F\u0646\u064A\u0627",
                        class: "w-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_UFormField, {
                    label: "\u0627\u0644\u0644\u063A\u0629 \u0627\u0644\u0639\u0631\u0628\u064A\u0629",
                    name: "arabic"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_UInput, {
                        type: "number",
                        modelValue: unref(state).arabic,
                        "onUpdate:modelValue": ($event) => unref(state).arabic = $event,
                        modelModifiers: { number: true },
                        placeholder: "\u0627\u0644\u0644\u063A\u0629 \u0627\u0644\u0639\u0631\u0628\u064A\u0629",
                        label: "\u0627\u0644\u0644\u063A\u0629 \u0627\u0644\u0639\u0631\u0628\u064A\u0629",
                        class: "w-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_UFormField, {
                    label: "\u0627\u0644\u0644\u063A\u0629 \u0627\u0644\u0625\u0646\u062C\u0644\u064A\u0632\u064A\u0629",
                    name: "english"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_UInput, {
                        type: "number",
                        modelValue: unref(state).english,
                        "onUpdate:modelValue": ($event) => unref(state).english = $event,
                        modelModifiers: { number: true },
                        placeholder: "\u0627\u0644\u0644\u063A\u0629 \u0627\u0644\u0625\u0646\u062C\u0644\u064A\u0632\u064A\u0629",
                        label: "\u0627\u0644\u0644\u063A\u0629 \u0627\u0644\u0625\u0646\u062C\u0644\u064A\u0632\u064A\u0629",
                        class: "w-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_UFormField, {
                    label: "\u0627\u0644\u062A\u0631\u0628\u064A\u0629 \u0627\u0644\u0625\u0633\u0644\u0627\u0645\u064A\u0629",
                    name: "relegion"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_UInput, {
                        type: "number",
                        modelValue: unref(state).relegion,
                        "onUpdate:modelValue": ($event) => unref(state).relegion = $event,
                        modelModifiers: { number: true },
                        placeholder: "\u0627\u0644\u062A\u0631\u0628\u064A\u0629 \u0627\u0644\u0625\u0633\u0644\u0627\u0645\u064A\u0629",
                        label: "\u0627\u0644\u062A\u0631\u0628\u064A\u0629 \u0627\u0644\u0625\u0633\u0644\u0627\u0645\u064A\u0629",
                        class: "w-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_UFormField, {
                    label: "\u0631\u064A\u0627\u0636\u064A\u0627\u062A",
                    name: "math"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_UInput, {
                        type: "number",
                        modelValue: unref(state).math,
                        "onUpdate:modelValue": ($event) => unref(state).math = $event,
                        modelModifiers: { number: true },
                        placeholder: "\u0631\u064A\u0627\u0636\u064A\u0627\u062A",
                        label: "\u0631\u064A\u0627\u0636\u064A\u0627\u062A",
                        class: "w-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_UFormField, {
                    label: "\u0639\u0644\u0648\u0645",
                    name: "science"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_UInput, {
                        type: "number",
                        modelValue: unref(state).science,
                        "onUpdate:modelValue": ($event) => unref(state).science = $event,
                        modelModifiers: { number: true },
                        placeholder: "\u0639\u0644\u0648\u0645",
                        label: "\u0639\u0644\u0648\u0645",
                        class: "w-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_UFormField, {
                    label: "\u0642\u0631\u0622\u0646",
                    name: "quran"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_UInput, {
                        type: "number",
                        modelValue: unref(state).quran,
                        "onUpdate:modelValue": ($event) => unref(state).quran = $event,
                        modelModifiers: { number: true },
                        placeholder: "\u0642\u0631\u0622\u0646",
                        label: "\u0642\u0631\u0622\u0646",
                        class: "w-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_UFormField, {
                    label: "\u0646\u0648\u0639 \u0627\u0644\u0643\u0634\u0641",
                    name: "type"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_USelect, {
                        modelValue: unref(state).type,
                        "onUpdate:modelValue": ($event) => unref(state).type = $event,
                        items: unref(grades_level_options),
                        placeholder: "\u0646\u0648\u0639 \u0627\u0644\u0643\u0634\u0641",
                        label: "\u0646\u0648\u0639 \u0627\u0644\u0643\u0634\u0641",
                        class: "w-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                    ]),
                    _: 1
                  }),
                  createVNode("div", { class: "col-span-2 flex gap-2 mt-5" }, [
                    createVNode(_component_UButton, {
                      type: "submit",
                      class: "flex w-40 py-2 justify-center font-bold lg:col-span-2 hover:cursor-pointer",
                      color: "secondary",
                      label: "\u0625\u0636\u0627\u0641\u0629",
                      loading: unref(isLoading)
                    }, null, 8, ["loading"]),
                    createVNode(_component_UButton, {
                      variant: "soft",
                      class: "flex w-20 py-2 justify-center font-bold lg:col-span-2 hover:cursor-pointer",
                      color: "secondary",
                      onClick: ($event) => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))("/students/view"),
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/students/[id]/add_grades_report.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=add_grades_report-TEyCl1M6.mjs.map
