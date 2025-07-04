import { _ as _sfc_main$2 } from './header-CXonAB11.mjs';
import { _ as _export_sfc, e as _sfc_main$7, n as navigateTo } from './server.mjs';
import { _ as _sfc_main$3 } from './Badge-CPUrxw_P.mjs';
import { _ as _sfc_main$4 } from './Input-Y7FMS0Nh.mjs';
import { _ as _sfc_main$5 } from './Select-CUYWYClZ.mjs';
import { _ as _sfc_main$6 } from './table-DqOvd6TH.mjs';
import { withCtx, createVNode, createTextVNode, defineComponent, ref, watch, computed, unref, isRef, toDisplayString, h, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderClass } from 'vue/server-renderer';
import { m as months } from './constants-CI-Eb238.mjs';
import { u as usePaymentsStore } from './paymnets-DpmBuoF8.mjs';
import { u as useDateUtils } from './useDateUtils-BpWrcJKf.mjs';
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
import 'reka-ui';
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
import './DropdownMenu-BleUNEq_.mjs';
import 'reka-ui/namespaced';
import './Table-BkFiQvBt.mjs';
import '@tanstack/vue-table';
import 'lodash/upperFirst.js';
import './useAppToast-BZDaw0os.mjs';
import './api-Bx7QNuNm.mjs';
import 'axios';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "main",
  __ssrInlineRender: true,
  setup(__props) {
    const paymentsStore = usePaymentsStore();
    const { getArabicDayName } = useDateUtils();
    const UBadge = _sfc_main$3;
    const globalFilter = ref("");
    const currentMonthIndex = (/* @__PURE__ */ new Date()).getMonth();
    const selectedMonth = ref(months[currentMonthIndex]);
    const tableKey = ref(Math.random());
    watch(selectedMonth, () => tableKey.value = Math.random());
    const columns = [
      {
        accessorKey: "rowNumber",
        header: "\u0627\u0644\u0631\u0642\u0645"
      },
      {
        accessorKey: "type",
        header: "\u0646\u0648\u0639 \u0627\u0644\u062F\u0641\u0639\u0629",
        cell: ({ row }) => {
          var _a;
          const status = (_a = row.original.type) != null ? _a : "\u0648\u0627\u0631\u062F";
          const color = {
            \u0648\u0627\u0631\u062F: "success",
            \u0635\u0627\u062F\u0631: "error"
          }[status];
          return h(
            UBadge,
            { class: "capitalize", variant: "subtle", color },
            () => status
          );
        }
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
        header: "\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u062F\u0641\u0639\u0629"
      },
      {
        accessorKey: "description",
        header: "\u0648\u0635\u0641 \u0627\u0644\u062F\u0641\u0639\u0629"
      },
      {
        accessorKey: "amount",
        header: "\u0627\u0644\u0642\u064A\u0645\u0629"
      },
      {
        id: "action"
      }
    ];
    function getDropdownActions(payment) {
      return [
        {
          label: "Edit",
          icon: "i-lucide-edit",
          onSelect: () => {
            navigateTo(`/payments/${payment.id}/edit_payment`);
          }
        },
        {
          label: "Delete",
          icon: "i-lucide-trash",
          color: "error",
          onSelect: () => {
            var _a;
            paymentsStore.deletePayment((_a = payment.id) != null ? _a : 0);
          }
        }
      ];
    }
    const filteredPayments = computed(() => {
      return paymentsStore.sortedPayment.filter(
        (payment) => {
          var _a;
          return new Date((_a = payment.date) != null ? _a : /* @__PURE__ */ new Date()).getMonth() === months.indexOf(selectedMonth.value);
        }
      );
    });
    const numberedPayments = computed(
      () => filteredPayments.value.map((payment, index2) => ({
        ...payment,
        rowNumber: index2 + 1
      }))
    );
    const total = computed(
      () => numberedPayments.value.reduce((sum, payment) => {
        var _a;
        if (payment.type === "\u0648\u0627\u0631\u062F") {
          return sum += payment.amount;
        } else {
          return sum -= (_a = payment.amount) != null ? _a : 0;
        }
      }, 0)
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UInput = _sfc_main$4;
      const _component_USelect = _sfc_main$5;
      const _component_UButton = _sfc_main$7;
      const _component_BaseTable = _sfc_main$6;
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="w-full grid md:grid-cols-6 gap-3 mt-5">`);
      _push(ssrRenderComponent(_component_UInput, {
        icon: "i-lucide-search",
        size: "lg",
        color: "secondary",
        variant: "outline",
        modelValue: unref(globalFilter),
        "onUpdate:modelValue": ($event) => isRef(globalFilter) ? globalFilter.value = $event : null,
        placeholder: "\u0627\u0644\u0628\u062D\u062B \u0639\u0646 \u062F\u0641\u0639\u0629...",
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
          var _a, _b;
          if (_push2) {
            _push2(`<span${_scopeId}>\u062A\u0635\u062F\u064A\u0631</span><span${_scopeId}>(${ssrInterpolate((_a = unref(paymentsStore).paymentsData) == null ? void 0 : _a.length)})</span><span${_scopeId}> PDF </span>`);
          } else {
            return [
              createVNode("span", null, "\u062A\u0635\u062F\u064A\u0631"),
              createVNode("span", null, "(" + toDisplayString((_b = unref(paymentsStore).paymentsData) == null ? void 0 : _b.length) + ")", 1),
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
          var _a, _b;
          if (_push2) {
            _push2(`<span${_scopeId}>\u062A\u0635\u062F\u064A\u0631</span><span${_scopeId}>(${ssrInterpolate((_a = unref(paymentsStore).paymentsData) == null ? void 0 : _a.length)})</span><span${_scopeId}> Excel </span>`);
          } else {
            return [
              createVNode("span", null, "\u062A\u0635\u062F\u064A\u0631"),
              createVNode("span", null, "(" + toDisplayString((_b = unref(paymentsStore).paymentsData) == null ? void 0 : _b.length) + ")", 1),
              createVNode("span", null, " Excel ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="flex items-center gap-4 mb-5"><div>\u0645\u062C\u0645\u0648\u0639 \u0627\u0644\u0635\u0627\u062F\u0631 \u0648\u0627\u0644\u0648\u0627\u0631\u062F:</div><div class="${ssrRenderClass([{
        "text-black dark:text-white font-normal": unref(total) === 0,
        "text-success": unref(total) > 0,
        "text-error": unref(total) < 0
      }, "font-bold text-2xl"])}">`);
      _push(ssrRenderComponent(unref(UBadge), {
        color: unref(total) >= 0 ? "success" : "error",
        size: "xl",
        class: "font-bold"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(total))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(total)), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
      _push(ssrRenderComponent(_component_BaseTable, {
        loading: unref(paymentsStore).loading,
        key: unref(tableKey),
        "global-filter": unref(globalFilter),
        "onUpdate:globalFilter": ($event) => isRef(globalFilter) ? globalFilter.value = $event : null,
        data: unref(numberedPayments),
        columns,
        "get-dropdown-actions": getDropdownActions
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/payment/main.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_BaseHeader = _sfc_main$2;
  const _component_UButton = _sfc_main$7;
  const _component_UBadge = _sfc_main$3;
  const _component_PaymentMain = _sfc_main$1;
  _push(`<div${ssrRenderAttrs(_attrs)}>`);
  _push(ssrRenderComponent(_component_BaseHeader, {
    title: "\u0627\u0644\u0645\u0635\u0631\u0648\u0641\u0627\u062A",
    description: "\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0645\u0635\u0631\u0648\u0641\u0627\u062A \u0627\u0644\u0634\u0647\u0631\u064A\u0629 \u0644\u0644\u0637\u0644\u0627\u0628"
  }, {
    actions: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(ssrRenderComponent(_component_UButton, {
          icon: "heroicons-plus-circle-20-solid",
          size: "lg",
          color: "secondary",
          class: "bg-blue-600 px-3 py-2 font-bold",
          variant: "solid",
          to: "/payments/add"
        }, {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(`\u0625\u0636\u0627\u0641\u0629 \u062F\u0641\u0639\u0629 \u062C\u062F\u064A\u062F\u0629`);
            } else {
              return [
                createTextVNode("\u0625\u0636\u0627\u0641\u0629 \u062F\u0641\u0639\u0629 \u062C\u062F\u064A\u062F\u0629")
              ];
            }
          }),
          _: 1
        }, _parent2, _scopeId));
      } else {
        return [
          createVNode(_component_UButton, {
            icon: "heroicons-plus-circle-20-solid",
            size: "lg",
            color: "secondary",
            class: "bg-blue-600 px-3 py-2 font-bold",
            variant: "solid",
            to: "/payments/add"
          }, {
            default: withCtx(() => [
              createTextVNode("\u0625\u0636\u0627\u0641\u0629 \u062F\u0641\u0639\u0629 \u062C\u062F\u064A\u062F\u0629")
            ]),
            _: 1
          })
        ];
      }
    }),
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(ssrRenderComponent(_component_UBadge, { color: "neutral" }, null, _parent2, _scopeId));
      } else {
        return [
          createVNode(_component_UBadge, { color: "neutral" })
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(ssrRenderComponent(_component_PaymentMain, null, null, _parent));
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/payments/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { index as default };
//# sourceMappingURL=index-CcXaSJId.mjs.map
