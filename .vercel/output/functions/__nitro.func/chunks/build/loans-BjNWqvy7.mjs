import { _ as _sfc_main$2 } from './Input-Y7FMS0Nh.mjs';
import { _ as _sfc_main$3 } from './Select-CUYWYClZ.mjs';
import { _ as _export_sfc, e as _sfc_main$7, n as navigateTo } from './server.mjs';
import { _ as _sfc_main$4 } from './Table-BkFiQvBt.mjs';
import { _ as _sfc_main$5 } from './DropdownMenu-BleUNEq_.mjs';
import { defineComponent, ref, computed, unref, isRef, withCtx, createVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { m as months } from './constants-CI-Eb238.mjs';
import { u as useTeachersStore } from './teachers-Cx5Wl_TR.mjs';
import { u as useDateUtils } from './useDateUtils-BpWrcJKf.mjs';
import 'reka-ui';
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
import '@vueuse/core';
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
import '@tanstack/vue-table';
import 'reka-ui/namespaced';
import './useAppToast-BZDaw0os.mjs';
import './api-Bx7QNuNm.mjs';
import 'axios';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "loans",
  __ssrInlineRender: true,
  setup(__props) {
    const { getArabicDayName } = useDateUtils();
    const teachersStore = useTeachersStore();
    const globalFilter = ref("");
    const tableKey = ref(Math.random());
    const currentMonthIndex = (/* @__PURE__ */ new Date()).getMonth();
    const selectedMonth = ref(months[currentMonthIndex]);
    const columns = [
      {
        accessorKey: "rowNumber",
        header: "\u0627\u0644\u0631\u0642\u0645"
      },
      {
        accessorKey: "teacher_name",
        header: "\u0627\u0633\u0645 \u0627\u0644\u0645\u0639\u0644\u0645"
      },
      {
        accessorKey: "date",
        header: "\u0627\u0644\u064A\u0648\u0645",
        cell: ({ row }) => {
          const day = getArabicDayName(String(row.original.date));
          return day;
        }
      },
      {
        accessorKey: "date",
        header: "\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u0633\u0644\u0641\u0629"
      },
      {
        accessorKey: "amount",
        header: "\u0642\u064A\u0645\u0629 \u0627\u0644\u0633\u0644\u0641\u0629"
      },
      {
        id: "action"
      }
    ];
    function getDropdownActions(loan) {
      return [
        [
          {
            label: "Edit",
            icon: "i-lucide-edit",
            onSelect: () => {
              navigateTo(`/teachers/${loan.id}/edit_loan`);
            }
          },
          {
            label: "Delete",
            icon: "i-lucide-trash",
            color: "error",
            onSelect: () => {
              teachersStore.deleteTeacherLoan(
                typeof loan.id === "number" ? loan.id : 0
              );
            }
          }
        ]
      ];
    }
    const filteredLoans = computed(() => {
      tableKey.value = Math.random();
      return teachersStore.sortedLoans.filter(
        (loan) => new Date(loan.date || /* @__PURE__ */ new Date()).getMonth() === months.indexOf(selectedMonth.value)
      );
    });
    const numberedLoans = computed(
      () => filteredLoans.value.map((loan, index) => ({
        ...loan,
        rowNumber: index + 1
      }))
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UInput = _sfc_main$2;
      const _component_USelect = _sfc_main$3;
      const _component_UButton = _sfc_main$7;
      const _component_UTable = _sfc_main$4;
      const _component_UDropdownMenu = _sfc_main$5;
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="w-full grid md:grid-cols-6 gap-3 mt-5">`);
      _push(ssrRenderComponent(_component_UInput, {
        icon: "i-lucide-search",
        size: "lg",
        color: "secondary",
        variant: "outline",
        modelValue: unref(globalFilter),
        "onUpdate:modelValue": ($event) => isRef(globalFilter) ? globalFilter.value = $event : null,
        placeholder: "\u0627\u0644\u0628\u062D\u062B \u0639\u0646 \u0645\u0639\u0644\u0645...",
        class: "w-full md:col-span-4"
      }, null, _parent));
      _push(ssrRenderComponent(_component_USelect, {
        modelValue: unref(selectedMonth),
        "onUpdate:modelValue": ($event) => isRef(selectedMonth) ? selectedMonth.value = $event : null,
        items: unref(months),
        size: "lg",
        color: "secondary",
        class: "w-full"
      }, null, _parent));
      _push(`</div><div class="flex items-center justify-end gap-2 mt-8 mb-2">`);
      _push(ssrRenderComponent(_component_UButton, {
        icon: "heroicons-document-chart-bar-solid",
        variant: "outline",
        color: "secondary",
        size: "sm",
        class: "p-2 font-bold text-blue-700"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span${_scopeId}>\u062A\u0635\u062F\u064A\u0631</span><span${_scopeId}>(${ssrInterpolate(unref(numberedLoans).length)})</span><span${_scopeId}> PDF </span>`);
          } else {
            return [
              createVNode("span", null, "\u062A\u0635\u062F\u064A\u0631"),
              createVNode("span", null, "(" + toDisplayString(unref(numberedLoans).length) + ")", 1),
              createVNode("span", null, " PDF ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UButton, {
        icon: "heroicons-document-chart-bar-solid",
        variant: "outline",
        color: "primary",
        size: "sm",
        class: "p-2 font-bold text-green-700"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span${_scopeId}>\u062A\u0635\u062F\u064A\u0631</span><span${_scopeId}>(${ssrInterpolate(unref(numberedLoans).length)})</span><span${_scopeId}> Excel </span>`);
          } else {
            return [
              createVNode("span", null, "\u062A\u0635\u062F\u064A\u0631"),
              createVNode("span", null, "(" + toDisplayString(unref(numberedLoans).length) + ")", 1),
              createVNode("span", null, " Excel ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_UTable, {
        loading: unref(teachersStore).loading,
        key: unref(tableKey),
        "global-filter": unref(globalFilter),
        "onUpdate:globalFilter": ($event) => isRef(globalFilter) ? globalFilter.value = $event : null,
        ref: "table",
        data: unref(numberedLoans),
        columns
      }, {
        "action-cell": withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UDropdownMenu, {
              items: getDropdownActions(row.original)
            }, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UButton, {
                    icon: "i-lucide-ellipsis-vertical",
                    color: "neutral",
                    variant: "soft",
                    "aria-label": "Actions",
                    class: "p-2"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UButton, {
                      icon: "i-lucide-ellipsis-vertical",
                      color: "neutral",
                      variant: "soft",
                      "aria-label": "Actions",
                      class: "p-2"
                    })
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UDropdownMenu, {
                items: getDropdownActions(row.original)
              }, {
                default: withCtx(() => [
                  createVNode(_component_UButton, {
                    icon: "i-lucide-ellipsis-vertical",
                    color: "neutral",
                    variant: "soft",
                    "aria-label": "Actions",
                    class: "p-2"
                  })
                ]),
                _: 2
              }, 1032, ["items"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/teachers/loans.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_TeachersLoans = _sfc_main$1;
  _push(`<div${ssrRenderAttrs(_attrs)}>`);
  _push(ssrRenderComponent(_component_TeachersLoans, null, null, _parent));
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/teachers/view/loans.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const loans = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { loans as default };
//# sourceMappingURL=loans-BjNWqvy7.mjs.map
