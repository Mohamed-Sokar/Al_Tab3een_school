import { _ as _sfc_main$5 } from './Badge-CPUrxw_P.mjs';
import { _ as _export_sfc, e as _sfc_main$7, n as navigateTo } from './server.mjs';
import { _ as _sfc_main$6 } from './DropdownMenu-BleUNEq_.mjs';
import { _ as _sfc_main$2 } from './Modal-BKEezCeD.mjs';
import { _ as _sfc_main$3 } from './Input-Y7FMS0Nh.mjs';
import { _ as _sfc_main$4 } from './table-DqOvd6TH.mjs';
import { defineComponent, ref, computed, unref, isRef, withCtx, createBlock, createCommentVNode, openBlock, createVNode, Fragment, renderList, toDisplayString, h, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderAttrs, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
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
import 'pinia';
import 'vue-router';
import '@supabase/ssr';
import 'tailwindcss/colors';
import '@iconify/vue';
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
    const teachersStore = useTeachersStore();
    const { getArabicDayName } = useDateUtils();
    const globalFilter = ref("");
    const sorting = ref([
      {
        id: "id",
        desc: false
      }
    ]);
    const tableKey = ref(Math.random());
    const UBadge = _sfc_main$5;
    const UButton = _sfc_main$7;
    const UDropdownMenu = _sfc_main$6;
    const selectedTeacher = ref();
    const selectedArrayFlag = ref();
    const showModal = ref(false);
    const table = ref();
    function showIssuesModal(teacher, flag) {
      selectedArrayFlag.value = flag;
      selectedTeacher.value = teacher;
      showModal.value = true;
    }
    const columns = [
      {
        accessorKey: "rowNumber",
        header: "\u0627\u0644\u0631\u0642\u0645"
      },
      {
        accessorKey: "identity_number",
        header: "\u0627\u0644\u0647\u0648\u064A\u0629"
      },
      {
        accessorKey: "full_name",
        header: ({ column }) => {
          const isSorted = column.getIsSorted();
          return h(UButton, {
            color: "neutral",
            variant: "ghost",
            label: "\u0627\u0644\u0627\u0633\u0645 \u0631\u0628\u0627\u0639\u064A",
            icon: isSorted ? isSorted === "asc" ? "i-lucide-arrow-up-narrow-wide" : "i-lucide-arrow-down-wide-narrow" : "i-lucide-arrow-up-down",
            class: "-mx-2.5 ",
            onClick: () => column.toggleSorting(column.getIsSorted() === "asc")
          });
        }
      },
      {
        accessorKey: "phone_number",
        header: "\u0631\u0642\u0645 \u0627\u0644\u062C\u0648\u0627\u0644"
      },
      {
        accessorKey: "birth_date",
        // header: "تاريخ الميلاد",
        header: ({ column }) => getHeader(column, "\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u0645\u064A\u0644\u0627\u062F"),
        cell: ({ row }) => {
          return row.original.birth_date;
        }
      },
      {
        accessorKey: "subject",
        header: "\u0627\u0644\u0645\u0627\u062F\u0629"
      },
      {
        accessorKey: "teachers_behavioral_issues",
        header: "\u0627\u0644\u0645\u062E\u0627\u0644\u0641\u0627\u062A \u0627\u0644\u0625\u062F\u0627\u0631\u064A\u0629",
        cell: ({ row }) => {
          const issues = row.original.teachers_behavioral_issues || [];
          return h(
            UBadge,
            {
              class: `capitalize hover:cursor-pointer hover:outline ${issues.length > 0 ? "font-bold" : "font-normal"}`,
              variant: `${issues.length > 0 ? "subtle" : "soft"}`,
              color: `${issues.length > 0 ? "error" : "success"}`,
              onClick: () => showIssuesModal(row.original, "behavioral_issues")
            },
            () => `${issues.length} \u0645\u062E\u0627\u0644\u0641\u0629`
          );
        }
      },
      {
        accessorKey: "teachers_loans",
        header: "\u0627\u0644\u0633\u0644\u0641 \u0627\u0644\u0645\u0633\u062A\u062D\u0642\u0629",
        cell: ({ row }) => {
          const loans = row.original.teachers_loans || [];
          return h(
            UBadge,
            {
              class: `capitalize hover:cursor-pointer hover:outline ${loans.length > 0 ? "font-bold" : "font-normal"}`,
              variant: `${loans.length ? "subtle" : "soft"}`,
              color: `${loans.length ? "error" : "success"}`,
              onClick: () => showIssuesModal(row.original, "loans")
            },
            () => `${loans.length} \u0633\u0644\u0641\u0629`
          );
        }
      },
      {
        accessorKey: "teachers_absence",
        header: "\u0623\u064A\u0627\u0645 \u0627\u0644\u063A\u064A\u0627\u0628",
        cell: ({ row }) => {
          const absences = row.original.teachers_absence || [];
          return h(
            UBadge,
            {
              class: `capitalize hover:cursor-pointer hover:outline ${absences.length > 0 ? "font-bold" : "font-normal"}`,
              variant: `${absences.length ? "subtle" : "soft"}`,
              color: `${absences.length ? "error" : "success"}`,
              onClick: () => showIssuesModal(row.original, "absence")
            },
            () => `${absences.length} \u064A\u0648\u0645`
          );
        }
      },
      // {
      //   accessorKey: "upsent_reports_count",
      //   header: "عدد أيام الغياب",
      //   cell: ({ row }) => {
      //     const days_count = row.original.upsent_reports_count ?? 0;
      //     return h(
      //       UBadge,
      //       {
      //         class: `capitalize ${days_count ? "font-bold" : "font-normal"}`,
      //         variant: `${days_count === 0 ? "soft" : "subtle"}`,
      //         color: `${
      //           days_count === 1 || days_count === 2
      //             ? "warning"
      //             : days_count >= 3
      //             ? "error"
      //             : "success"
      //         }`,
      //       },
      //       () => days_count
      //     );
      //   },
      // },
      // {
      //   accessorKey: "loans_count",
      //   header: "عدد السلف",
      //   cell: ({ row }) => {
      //     const loansCount = row.original.loans_count ?? 0;
      //     return h(
      //       UBadge,
      //       {
      //         class: `capitalize ${loansCount ? "font-bold" : "font-normal"}`,
      //         variant: `${loansCount ? "subtle" : "soft"}`,
      //         color: `${loansCount ? "error" : "success"}`,
      //       },
      //       () => loansCount
      //     );
      //   },
      // },
      {
        id: "action"
      }
    ];
    function getHeader(column, label) {
      const isSorted = column.getIsSorted();
      return h(
        UDropdownMenu,
        {
          content: {
            align: "start"
          },
          "aria-label": "Actions dropdown",
          items: [
            {
              label: "Asc",
              type: "checkbox",
              icon: "i-lucide-arrow-up-narrow-wide",
              checked: isSorted === "asc",
              onSelect: () => {
                if (isSorted === "asc") {
                  column.clearSorting();
                } else {
                  column.toggleSorting(false);
                }
              }
            },
            {
              label: "Desc",
              icon: "i-lucide-arrow-down-wide-narrow",
              type: "checkbox",
              checked: isSorted === "desc",
              onSelect: () => {
                if (isSorted === "desc") {
                  column.clearSorting();
                } else {
                  column.toggleSorting(true);
                }
              }
            }
          ]
        },
        () => h(UButton, {
          color: "neutral",
          variant: "ghost",
          label,
          icon: isSorted ? isSorted === "asc" ? "i-lucide-arrow-up-narrow-wide" : "i-lucide-arrow-down-wide-narrow" : "i-lucide-arrow-up-down",
          class: "-mx-2.5 data-[state=open]:bg-elevated",
          "aria-label": `Sort by ${isSorted === "asc" ? "descending" : "ascending"}`
        })
      );
    }
    function getDropdownActions(teacher) {
      return [
        [
          {
            label: "\u0625\u0636\u0627\u0641\u0629 \u062A\u0642\u0631\u064A\u0631 \u063A\u064A\u0627\u0628",
            color: "error",
            icon: "i-heroicons-user-minus",
            onSelect: () => {
              navigateTo(`/teachers/${teacher.id}/add_absence_report`);
            }
          },
          {
            label: "\u0625\u0636\u0627\u0641\u0629 \u0645\u062E\u0627\u0644\u0641\u0629 \u0625\u062F\u0627\u0631\u064A\u0629",
            color: "warning",
            icon: "i-heroicons-exclamation-triangle",
            onSelect: () => {
              navigateTo(`/teachers/${teacher.id}/add_behavioral_issue`);
            }
          },
          {
            label: "\u0625\u0636\u0627\u0641\u0629 \u0633\u0644\u0641\u0629",
            color: "info",
            icon: "i-heroicons-banknotes",
            onSelect: () => {
              navigateTo(`/teachers/${teacher.id}/add_loan`);
            }
          }
        ],
        [
          {
            label: "Edit",
            icon: "i-lucide-edit",
            onSelect: () => {
              navigateTo(`/teachers/${teacher.id}/edit_teacher`);
            }
          },
          {
            label: "Delete",
            icon: "i-lucide-trash",
            color: "error",
            onSelect: () => {
              teachersStore.deleteTeacher(teacher.id || "");
            }
          }
        ]
      ];
    }
    const numberedTeachers = computed(() => {
      return teachersStore.sortedTeachers.map((teacher, index) => ({
        ...teacher,
        rowNumber: index + 1
      }));
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UModal = _sfc_main$2;
      const _component_UInput = _sfc_main$3;
      const _component_BaseTable = _sfc_main$4;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_UModal, {
        open: unref(showModal),
        "onUpdate:open": ($event) => isRef(showModal) ? showModal.value = $event : null,
        title: unref(selectedArrayFlag) === "behavioral_issues" ? "\u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u0645\u062E\u0627\u0644\u0641\u0627\u062A" : unref(selectedArrayFlag) === "loans" ? "\u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u0633\u0644\u0641" : unref(selectedArrayFlag) === "absence" ? "\u062A\u0641\u0627\u0635\u064A\u0644 \u0623\u064A\u0627\u0645 \u0627\u0644\u063A\u064A\u0627\u0628" : ""
      }, {
        body: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
          if (_push2) {
            if (unref(selectedArrayFlag) === "behavioral_issues") {
              _push2(`<div${_scopeId}>`);
              if ((_b = (_a = unref(selectedTeacher)) == null ? void 0 : _a.teachers_behavioral_issues) == null ? void 0 : _b.length) {
                _push2(`<div${_scopeId}><ul${_scopeId}><li class="grid grid-cols-3 justify-between items-center gap-2 border-b py-2"${_scopeId}><span class="font-bold"${_scopeId}>\u0627\u0644\u064A\u0648\u0645</span><span class="font-bold"${_scopeId}>\u0627\u0644\u062A\u0627\u0631\u064A\u062E</span><span class="font-bold"${_scopeId}>\u0627\u0644\u0645\u062E\u0627\u0644\u0641\u0629</span></li><!--[-->`);
                ssrRenderList(unref(selectedTeacher).teachers_behavioral_issues, (issue, index) => {
                  _push2(`<li class="grid grid-cols-3 justify-between items-center gap-2 border-b border-dashed border-gray-200 py-2 mb-2"${_scopeId}><span${_scopeId}>${ssrInterpolate(unref(getArabicDayName)(issue.date + ""))}</span><span${_scopeId}>${ssrInterpolate(issue.date)}</span><span${_scopeId}>${ssrInterpolate(issue.description)}</span></li>`);
                });
                _push2(`<!--]--></ul><div class="pt-3"${_scopeId}><span${_scopeId}> \u0627\u0644\u0645\u062C\u0645\u0648\u0639: </span><span class="font-bold"${_scopeId}>${ssrInterpolate(unref(selectedTeacher).teachers_behavioral_issues.length)}</span></div></div>`);
              } else {
                _push2(`<p${_scopeId}>\u0644\u0627 \u062A\u0648\u062C\u062F \u0645\u062E\u0627\u0644\u0641\u0627\u062A.</p>`);
              }
              _push2(`</div>`);
            } else if (unref(selectedArrayFlag) === "loans") {
              _push2(`<div${_scopeId}>`);
              if ((_d = (_c = unref(selectedTeacher)) == null ? void 0 : _c.teachers_loans) == null ? void 0 : _d.length) {
                _push2(`<div${_scopeId}><ul${_scopeId}><li class="grid grid-cols-3 justify-between items-center gap-2 border-b py-2"${_scopeId}><span class="font-bold"${_scopeId}>\u0627\u0644\u064A\u0648\u0645</span><span class="font-bold"${_scopeId}>\u0627\u0644\u062A\u0627\u0631\u064A\u062E</span><span class="font-bold"${_scopeId}>\u0627\u0644\u0642\u064A\u0645\u0629</span></li><!--[-->`);
                ssrRenderList(unref(selectedTeacher).teachers_loans, (loan, index) => {
                  _push2(`<li class="grid grid-cols-3 justify-between items-center gap-2 border-b border-dashed border-gray-200 py-2 mb-2"${_scopeId}><span${_scopeId}>${ssrInterpolate(unref(getArabicDayName)(loan.date + ""))}</span><span${_scopeId}>${ssrInterpolate(loan.date)}</span><span${_scopeId}>${ssrInterpolate(loan.amount)} \u20AA </span></li>`);
                });
                _push2(`<!--]--></ul><div class="pt-3"${_scopeId}><span${_scopeId}> \u0627\u0644\u0645\u062C\u0645\u0648\u0639: </span><span class="font-bold"${_scopeId}>${ssrInterpolate(unref(selectedTeacher).teachers_loans.reduce(
                  (previousValue, loan) => previousValue + (loan.amount || 0),
                  0
                ))} \u20AA </span></div></div>`);
              } else {
                _push2(`<p${_scopeId}>\u0644\u0627 \u062A\u0648\u062C\u062F \u0633\u0644\u0641 \u0645\u0633\u062A\u062D\u0642\u0629.</p>`);
              }
              _push2(`</div>`);
            } else if (unref(selectedArrayFlag) === "absence") {
              _push2(`<div${_scopeId}>`);
              if ((_f = (_e = unref(selectedTeacher)) == null ? void 0 : _e.teachers_absence) == null ? void 0 : _f.length) {
                _push2(`<div${_scopeId}><ul${_scopeId}><li class="grid grid-cols-4 justify-between items-center gap-2 border-b py-1"${_scopeId}><span class="font-bold"${_scopeId}>\u0627\u0644\u064A\u0648\u0645</span><span class="font-bold"${_scopeId}>\u0627\u0644\u062A\u0627\u0631\u064A\u062E</span><span class="font-bold"${_scopeId}>\u062D\u0627\u0644\u0629 \u0627\u0644\u0639\u0630\u0631</span><span class="font-bold"${_scopeId}>\u0633\u0628\u0628 \u0627\u0644\u063A\u064A\u0627\u0628</span></li><!--[-->`);
                ssrRenderList(unref(selectedTeacher).teachers_absence, (report, index) => {
                  _push2(`<li class="grid grid-cols-4 justify-center items-center gap-2 border-b border-dashed border-gray-200 py-2 mb-2"${_scopeId}><span${_scopeId}>${ssrInterpolate(unref(getArabicDayName)(report.date + ""))}</span><span${_scopeId}>${ssrInterpolate(report.date)}</span><span${_scopeId}>${ssrInterpolate(report.excuse_status)}</span><span${_scopeId}>${ssrInterpolate(report.reason)}</span></li>`);
                });
                _push2(`<!--]--></ul><div class="pt-3"${_scopeId}><span${_scopeId}> \u0627\u0644\u0645\u062C\u0645\u0648\u0639: </span><span class="font-bold"${_scopeId}>${ssrInterpolate(unref(selectedTeacher).teachers_absence.length)}</span></div></div>`);
              } else {
                _push2(`<p${_scopeId}>\u0644\u0627 \u064A\u0648\u062C\u062F \u0623\u064A\u0627\u0645 \u063A\u064A\u0627\u0628.</p>`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              unref(selectedArrayFlag) === "behavioral_issues" ? (openBlock(), createBlock("div", { key: 0 }, [
                ((_h = (_g = unref(selectedTeacher)) == null ? void 0 : _g.teachers_behavioral_issues) == null ? void 0 : _h.length) ? (openBlock(), createBlock("div", { key: 0 }, [
                  createVNode("ul", null, [
                    createVNode("li", { class: "grid grid-cols-3 justify-between items-center gap-2 border-b py-2" }, [
                      createVNode("span", { class: "font-bold" }, "\u0627\u0644\u064A\u0648\u0645"),
                      createVNode("span", { class: "font-bold" }, "\u0627\u0644\u062A\u0627\u0631\u064A\u062E"),
                      createVNode("span", { class: "font-bold" }, "\u0627\u0644\u0645\u062E\u0627\u0644\u0641\u0629")
                    ]),
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(selectedTeacher).teachers_behavioral_issues, (issue, index) => {
                      return openBlock(), createBlock("li", {
                        key: index,
                        class: "grid grid-cols-3 justify-between items-center gap-2 border-b border-dashed border-gray-200 py-2 mb-2"
                      }, [
                        createVNode("span", null, toDisplayString(unref(getArabicDayName)(issue.date + "")), 1),
                        createVNode("span", null, toDisplayString(issue.date), 1),
                        createVNode("span", null, toDisplayString(issue.description), 1)
                      ]);
                    }), 128))
                  ]),
                  createVNode("div", { class: "pt-3" }, [
                    createVNode("span", null, " \u0627\u0644\u0645\u062C\u0645\u0648\u0639: "),
                    createVNode("span", { class: "font-bold" }, toDisplayString(unref(selectedTeacher).teachers_behavioral_issues.length), 1)
                  ])
                ])) : (openBlock(), createBlock("p", { key: 1 }, "\u0644\u0627 \u062A\u0648\u062C\u062F \u0645\u062E\u0627\u0644\u0641\u0627\u062A."))
              ])) : unref(selectedArrayFlag) === "loans" ? (openBlock(), createBlock("div", { key: 1 }, [
                ((_j = (_i = unref(selectedTeacher)) == null ? void 0 : _i.teachers_loans) == null ? void 0 : _j.length) ? (openBlock(), createBlock("div", { key: 0 }, [
                  createVNode("ul", null, [
                    createVNode("li", { class: "grid grid-cols-3 justify-between items-center gap-2 border-b py-2" }, [
                      createVNode("span", { class: "font-bold" }, "\u0627\u0644\u064A\u0648\u0645"),
                      createVNode("span", { class: "font-bold" }, "\u0627\u0644\u062A\u0627\u0631\u064A\u062E"),
                      createVNode("span", { class: "font-bold" }, "\u0627\u0644\u0642\u064A\u0645\u0629")
                    ]),
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(selectedTeacher).teachers_loans, (loan, index) => {
                      return openBlock(), createBlock("li", {
                        key: index,
                        class: "grid grid-cols-3 justify-between items-center gap-2 border-b border-dashed border-gray-200 py-2 mb-2"
                      }, [
                        createVNode("span", null, toDisplayString(unref(getArabicDayName)(loan.date + "")), 1),
                        createVNode("span", null, toDisplayString(loan.date), 1),
                        createVNode("span", null, toDisplayString(loan.amount) + " \u20AA ", 1)
                      ]);
                    }), 128))
                  ]),
                  createVNode("div", { class: "pt-3" }, [
                    createVNode("span", null, " \u0627\u0644\u0645\u062C\u0645\u0648\u0639: "),
                    createVNode("span", { class: "font-bold" }, toDisplayString(unref(selectedTeacher).teachers_loans.reduce(
                      (previousValue, loan) => previousValue + (loan.amount || 0),
                      0
                    )) + " \u20AA ", 1)
                  ])
                ])) : (openBlock(), createBlock("p", { key: 1 }, "\u0644\u0627 \u062A\u0648\u062C\u062F \u0633\u0644\u0641 \u0645\u0633\u062A\u062D\u0642\u0629."))
              ])) : unref(selectedArrayFlag) === "absence" ? (openBlock(), createBlock("div", { key: 2 }, [
                ((_l = (_k = unref(selectedTeacher)) == null ? void 0 : _k.teachers_absence) == null ? void 0 : _l.length) ? (openBlock(), createBlock("div", { key: 0 }, [
                  createVNode("ul", null, [
                    createVNode("li", { class: "grid grid-cols-4 justify-between items-center gap-2 border-b py-1" }, [
                      createVNode("span", { class: "font-bold" }, "\u0627\u0644\u064A\u0648\u0645"),
                      createVNode("span", { class: "font-bold" }, "\u0627\u0644\u062A\u0627\u0631\u064A\u062E"),
                      createVNode("span", { class: "font-bold" }, "\u062D\u0627\u0644\u0629 \u0627\u0644\u0639\u0630\u0631"),
                      createVNode("span", { class: "font-bold" }, "\u0633\u0628\u0628 \u0627\u0644\u063A\u064A\u0627\u0628")
                    ]),
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(selectedTeacher).teachers_absence, (report, index) => {
                      return openBlock(), createBlock("li", {
                        key: index,
                        class: "grid grid-cols-4 justify-center items-center gap-2 border-b border-dashed border-gray-200 py-2 mb-2"
                      }, [
                        createVNode("span", null, toDisplayString(unref(getArabicDayName)(report.date + "")), 1),
                        createVNode("span", null, toDisplayString(report.date), 1),
                        createVNode("span", null, toDisplayString(report.excuse_status), 1),
                        createVNode("span", null, toDisplayString(report.reason), 1)
                      ]);
                    }), 128))
                  ]),
                  createVNode("div", { class: "pt-3" }, [
                    createVNode("span", null, " \u0627\u0644\u0645\u062C\u0645\u0648\u0639: "),
                    createVNode("span", { class: "font-bold" }, toDisplayString(unref(selectedTeacher).teachers_absence.length), 1)
                  ])
                ])) : (openBlock(), createBlock("p", { key: 1 }, "\u0644\u0627 \u064A\u0648\u062C\u062F \u0623\u064A\u0627\u0645 \u063A\u064A\u0627\u0628."))
              ])) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="w-full grid md:grid-cols-6 gap-3 mt-5">`);
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
      _push(`</div><div class="flex items-center justify-end gap-2 mt-8 mb-2">`);
      _push(ssrRenderComponent(unref(UButton), {
        icon: "heroicons-document-chart-bar-solid",
        variant: "outline",
        color: "secondary",
        size: "sm",
        class: "p-2 font-bold text-blue-700"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span${_scopeId}>\u062A\u0635\u062F\u064A\u0631</span><span${_scopeId}>(${ssrInterpolate(unref(numberedTeachers).length)})</span><span${_scopeId}> PDF </span>`);
          } else {
            return [
              createVNode("span", null, "\u062A\u0635\u062F\u064A\u0631"),
              createVNode("span", null, "(" + toDisplayString(unref(numberedTeachers).length) + ")", 1),
              createVNode("span", null, " PDF ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(UButton), {
        icon: "heroicons-document-chart-bar-solid",
        variant: "outline",
        color: "primary",
        size: "sm",
        class: "p-2 font-bold text-green-700"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span${_scopeId}>\u062A\u0635\u062F\u064A\u0631</span><span${_scopeId}>(${ssrInterpolate(unref(numberedTeachers).length)})</span><span${_scopeId}> Excel </span>`);
          } else {
            return [
              createVNode("span", null, "\u062A\u0635\u062F\u064A\u0631"),
              createVNode("span", null, "(" + toDisplayString(unref(numberedTeachers).length) + ")", 1),
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
        ref: unref(table),
        data: unref(numberedTeachers),
        columns,
        sorting: unref(sorting),
        "onUpdate:sorting": ($event) => isRef(sorting) ? sorting.value = $event : null,
        "get-dropdown-actions": getDropdownActions
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/teachers/main.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_TeachersMain = _sfc_main$1;
  _push(ssrRenderComponent(_component_TeachersMain, _attrs, null, _parent));
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/teachers/view/teachers_table.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const teachers_table = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { teachers_table as default };
//# sourceMappingURL=teachers_table-DdE5Jk_W.mjs.map
