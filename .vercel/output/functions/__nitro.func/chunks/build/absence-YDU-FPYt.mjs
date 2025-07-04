import { _ as _sfc_main$2 } from './Input-Y7FMS0Nh.mjs';
import { _ as _sfc_main$3 } from './Select-CUYWYClZ.mjs';
import { _ as _export_sfc, e as _sfc_main$7, n as navigateTo } from './server.mjs';
import { _ as _sfc_main$4 } from './table-DqOvd6TH.mjs';
import { defineComponent, ref, computed, unref, isRef, withCtx, createVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderAttrs, ssrInterpolate } from 'vue/server-renderer';
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
import './DropdownMenu-BleUNEq_.mjs';
import 'reka-ui/namespaced';
import './Table-BkFiQvBt.mjs';
import '@tanstack/vue-table';
import 'lodash/upperFirst.js';
import './useAppToast-BZDaw0os.mjs';
import './api-Bx7QNuNm.mjs';
import 'axios';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "absence",
  __ssrInlineRender: true,
  setup(__props) {
    const teachersStore = useTeachersStore();
    const { getArabicDayName } = useDateUtils();
    const globalFilter = ref("");
    const tableKey = ref(Math.random());
    const currentMonthIndex = (/* @__PURE__ */ new Date()).getMonth();
    const selectedMonth = ref(months[currentMonthIndex]);
    const selectedDate = ref((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
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
        header: "\u0627\u0644\u062A\u0627\u0631\u064A\u062E"
      },
      {
        accessorKey: "excuse_status",
        header: "\u062D\u0627\u0644\u0629 \u0627\u0644\u0639\u0630\u0631"
      },
      {
        accessorKey: "reason",
        header: "\u0627\u0644\u0633\u0628\u0628"
      },
      {
        id: "action"
      }
    ];
    function getDropdownActions(report) {
      return [
        [
          {
            label: "Edit",
            icon: "i-lucide-edit",
            onSelect: () => {
              navigateTo(`/teachers/${report.id}/edit_absence_report`);
            }
          },
          {
            label: "Delete",
            icon: "i-lucide-trash",
            color: "error",
            onSelect: () => {
              teachersStore.deleteTeacherAbsenceReport(
                typeof report.id === "number" ? report.id : 0
              );
            }
          }
        ]
      ];
    }
    const filteredAbsenceReports = computed(() => {
      tableKey.value = Math.random();
      return teachersStore.sortedAbsenceReports.filter(
        (report) => (
          // report.date === selectedDate.value &&
          new Date(report.date || /* @__PURE__ */ new Date()).getMonth() === months.indexOf(selectedMonth.value)
        )
      );
    });
    const numberedAbsenceReports = computed(
      () => filteredAbsenceReports.value.map(
        (report, index) => ({
          ...report,
          rowNumber: index + 1
        })
      )
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UInput = _sfc_main$2;
      const _component_USelect = _sfc_main$3;
      const _component_UButton = _sfc_main$7;
      const _component_BaseTable = _sfc_main$4;
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
      _push(ssrRenderComponent(_component_UInput, {
        modelValue: unref(selectedDate),
        "onUpdate:modelValue": ($event) => isRef(selectedDate) ? selectedDate.value = $event : null,
        type: "date",
        size: "lg",
        color: "secondary",
        class: "w-full"
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
            _push2(`<span${_scopeId}>\u062A\u0635\u062F\u064A\u0631</span><span${_scopeId}>(${ssrInterpolate(unref(numberedAbsenceReports).length)})</span><span${_scopeId}> PDF </span>`);
          } else {
            return [
              createVNode("span", null, "\u062A\u0635\u062F\u064A\u0631"),
              createVNode("span", null, "(" + toDisplayString(unref(numberedAbsenceReports).length) + ")", 1),
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
            _push2(`<span${_scopeId}>\u062A\u0635\u062F\u064A\u0631</span><span${_scopeId}>(${ssrInterpolate(unref(numberedAbsenceReports).length)})</span><span${_scopeId}> Excel </span>`);
          } else {
            return [
              createVNode("span", null, "\u062A\u0635\u062F\u064A\u0631"),
              createVNode("span", null, "(" + toDisplayString(unref(numberedAbsenceReports).length) + ")", 1),
              createVNode("span", null, " Excel ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_BaseTable, {
        loading: unref(teachersStore).loading,
        key: unref(tableKey),
        "global-filter": unref(globalFilter),
        "onUpdate:globalFilter": ($event) => isRef(globalFilter) ? globalFilter.value = $event : null,
        data: unref(numberedAbsenceReports),
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/teachers/absence.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_TeachersAbsence = _sfc_main$1;
  _push(ssrRenderComponent(_component_TeachersAbsence, _attrs, null, _parent));
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/teachers/view/absence.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const absence = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { absence as default };
//# sourceMappingURL=absence-YDU-FPYt.mjs.map
