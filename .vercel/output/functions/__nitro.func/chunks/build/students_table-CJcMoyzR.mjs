import { _ as _export_sfc, g as useRoute, e as _sfc_main$7, n as navigateTo } from './server.mjs';
import { _ as _sfc_main$a } from './DropdownMenu-BleUNEq_.mjs';
import { _ as _sfc_main$9 } from './Badge-CPUrxw_P.mjs';
import { _ as _sfc_main$2 } from './Modal-BKEezCeD.mjs';
import { _ as _sfc_main$3 } from './Form-xmP0I2N6.mjs';
import { _ as _sfc_main$4 } from './FormField-1OWKP-81.mjs';
import { _ as _sfc_main$5 } from './Select-CUYWYClZ.mjs';
import { _ as _sfc_main$6 } from './Input-Y7FMS0Nh.mjs';
import { _ as _sfc_main$8 } from './table-DqOvd6TH.mjs';
import { defineComponent, ref, computed, unref, isRef, withCtx, createVNode, createBlock, createCommentVNode, openBlock, Fragment, renderList, toDisplayString, h, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderAttrs, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { u as useStudentStore } from './students-C5l8o5u3.mjs';
import { u as useAcademicClassesStore } from './academic_classes-C4vfu9w7.mjs';
import { u as useQuranClassesStore } from './quran_classes-BKWJ4W-E.mjs';
import { u as useDriversStore } from './drivers-BuRykaFo.mjs';
import { object, number } from 'yup';
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
import 'reka-ui/namespaced';
import './Table-BkFiQvBt.mjs';
import '@tanstack/vue-table';
import 'lodash/upperFirst.js';
import './useAppToast-BZDaw0os.mjs';
import './constants-CI-Eb238.mjs';
import './api-Bx7QNuNm.mjs';
import 'axios';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "main",
  __ssrInlineRender: true,
  setup(__props) {
    const schema = object({
      selectedClassId: number().required("\u0627\u0644\u0635\u0641 \u0645\u0637\u0644\u0648\u0628")
    });
    const assignDriverSchema = object({
      selectedDriverId: number().required("\u0627\u0644\u0633\u0627\u0626\u0642 \u0645\u0637\u0644\u0648\u0628")
    });
    const studentsStore = useStudentStore();
    const quranClassesStore = useQuranClassesStore();
    const academicClassesStore = useAcademicClassesStore();
    const driversStore = useDriversStore();
    const route = useRoute();
    const UButton = _sfc_main$7;
    const UDropdownMenu = _sfc_main$a;
    const UBadge = _sfc_main$9;
    const sorting = ref([
      {
        id: "id",
        desc: false
      }
    ]);
    const globalFilter = ref();
    const table = ref();
    const tableKey = ref(Math.random());
    const rowSelection = ref({});
    const selectedStudent = ref();
    const showModal = ref(false);
    const selectedFlag = ref();
    const selectedClassId = ref(void 0);
    const selectedDriverId = ref(void 0);
    const columns = [
      {
        accessorKey: "rowNumber",
        header: "\u0627\u0644\u0631\u0642\u0645"
      },
      {
        accessorKey: "identity_number",
        header: "\u0647\u0648\u064A\u0629 \u0627\u0644\u0637\u0627\u0644\u0628"
      },
      {
        accessorKey: "father_identity_number",
        header: "\u0647\u0648\u064A\u0629 \u0627\u0644\u0623\u0628"
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
            class: "-mx-2.5",
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
        accessorKey: "address",
        header: "\u0627\u0644\u0639\u0646\u0648\u0627\u0646"
      },
      {
        accessorKey: "masjed",
        header: "\u0627\u0644\u0645\u0633\u062C\u062F"
      },
      {
        accessorKey: "academic_class",
        header: "\u0627\u0644\u0635\u0641 \u0627\u0644\u062F\u0631\u0627\u0633\u064A",
        cell: ({ row }) => {
          const academicClass = row.original.academic_class;
          let academicClassName = "";
          if (academicClass && typeof academicClass.title === "string" && typeof academicClass.group === "string") {
            academicClassName = `${academicClass.title} - ${academicClass.group}`;
          } else {
            academicClassName = "\u063A\u064A\u0631 \u0645\u0636\u0627\u0641";
          }
          return h(
            UBadge,
            {
              class: `capitalize hover:cursor-pointer hover:outline`,
              variant: `${academicClass ? "subtle" : "outline"}`,
              color: `neutral`,
              onClick: (e) => {
                e.stopPropagation();
                showBasedModal("academic_class", row.original);
              }
            },
            () => academicClassName
          );
        }
      },
      {
        accessorKey: "quran_class",
        header: "\u0627\u0644\u0635\u0641 \u0627\u0644\u0642\u0631\u0622\u0646\u064A",
        cell: ({ row }) => {
          const quranClass = row.original.quran_class;
          let quranClassName = "";
          if (quranClass && typeof quranClass.title === "string" && typeof quranClass.group === "string") {
            quranClassName = `${quranClass.title} - ${quranClass.group}`;
          } else {
            quranClassName = "\u063A\u064A\u0631 \u0645\u0636\u0627\u0641";
          }
          return h(
            UBadge,
            {
              class: `capitalize hover:cursor-pointer hover:outline`,
              variant: `${quranClass ? "subtle" : "outline"}`,
              color: `neutral`,
              onClick: (e) => {
                e.stopPropagation();
                showBasedModal("quran_class", row.original);
              }
            },
            () => quranClassName
          );
        }
      },
      {
        accessorKey: "driver",
        header: "\u0627\u0644\u0633\u0627\u0626\u0642",
        cell: ({ row }) => {
          const driver = row.original.driver;
          let driverName = "";
          if (driver && typeof driver.name === "string" && typeof driver.car_type === "string" && typeof driver.car_color === "string") {
            driverName = `${driver.name}`;
          } else {
            driverName = "\u0644\u0627 \u064A\u0648\u062C\u062F \u0633\u0627\u0626\u0642";
          }
          return h(
            UBadge,
            {
              class: `capitalize hover:cursor-pointer hover:outline`,
              variant: `${driver ? "subtle" : "outline"}`,
              color: `neutral`,
              onClick: (e) => {
                e.stopPropagation();
                showBasedModal("driver_info", row.original);
              }
            },
            () => driverName
          );
        }
      },
      {
        accessorKey: "behavioral_issues",
        header: "\u0627\u0644\u0645\u062E\u0627\u0644\u0641\u0627\u062A \u0627\u0644\u0633\u0644\u0648\u0643\u064A\u0629",
        cell: ({ row }) => {
          const issues = row.original.behavioral_issues || [];
          return h(
            UBadge,
            {
              class: `capitalize hover:cursor-pointer hover:outline ${issues.length > 0 ? "font-bold" : "font-normal"} `,
              variant: `${issues.length > 0 ? "subtle" : "soft"}`,
              color: `${issues.length > 0 ? "error" : "success"}`,
              onClick: (e) => {
                e.stopPropagation();
                showBasedModal("studentIssue", row.original);
              }
            },
            () => `${issues.length} \u0645\u062E\u0627\u0644\u0641\u0629`
          );
        }
      },
      {
        id: "action"
      }
    ];
    function showBasedModal(flag, student) {
      selectedFlag.value = flag;
      showModal.value = true;
      if (!!student) {
        selectedStudent.value = student;
      }
    }
    function getDropdownActions(student) {
      return [
        [
          {
            label: "\u0625\u0636\u0627\u0641\u0629 \u0645\u062E\u0627\u0644\u0641\u0629 \u0633\u0644\u0648\u0643\u064A\u0629",
            color: "warning",
            icon: "i-heroicons-exclamation-triangle",
            onSelect: () => {
              navigateTo(`/students/${student.id}/add_behavioral_issue`);
            }
          },
          {
            label: "\u0625\u0636\u0627\u0641\u0629 \u0643\u0634\u0641 \u062F\u0631\u062C\u0627\u062A",
            icon: "i-heroicons-academic-cap",
            color: "info",
            onSelect: () => {
              navigateTo(`/students/${student.id}/add_grades_report`);
            }
          }
        ],
        [
          {
            label: "Edit",
            icon: "i-lucide-edit",
            onSelect: () => {
              navigateTo(`/students/${student.id}/edit_student`);
            }
          },
          {
            label: "Delete",
            icon: "i-lucide-trash",
            color: "error",
            onSelect: () => {
              studentsStore.deleteStudent(
                typeof student.id === "string" ? student.id : ""
              );
              tableKey.value = Math.random();
            }
          }
        ]
      ];
    }
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
    const dayNameArabic = (date) => new Date(date).toLocaleDateString("ar-EG", { weekday: "long" });
    const deleteSelectedStudents = async () => {
      if (selectedStudentsIds.value.length === 0) return;
      await studentsStore.deleteMultipleStudents(
        selectedStudentsIds.value.filter(
          (id) => typeof id === "string"
        )
      );
      rowSelection.value = {};
    };
    const assignStudentsToAcademicClass = async () => {
      if (!selectedClassId.value || selectedStudents.value.length === 0) return;
      await academicClassesStore.updateAcademicClassForStudents(
        selectedStudentsIds.value.filter(
          (id) => typeof id === "string"
        ),
        selectedClassId.value
      );
      rowSelection.value = {};
      selectedClassId.value = void 0;
    };
    const assignStudentsToQuranClass = async () => {
      if (!selectedClassId.value || selectedStudents.value.length === 0) return;
      await quranClassesStore.updateQuranClassForStudents(
        selectedStudentsIds.value.filter(
          (id) => typeof id === "string"
        ),
        selectedClassId.value
      );
      rowSelection.value = {};
      selectedClassId.value = void 0;
    };
    const assignStudentsToDriver = async () => {
      if (!selectedDriverId.value || selectedStudents.value.length === 0) return;
      await driversStore.updatesDriverForStudents(
        selectedStudentsIds.value.filter(
          (id) => typeof id === "string"
        ),
        selectedDriverId.value
      );
      rowSelection.value = {};
      selectedDriverId.value = void 0;
    };
    async function onSubmit() {
      if (selectedFlag.value === "move_academic_class") {
        await assignStudentsToAcademicClass();
        await studentsStore.fetchStudents();
      } else if (selectedFlag.value === "move_quran_class") {
        await assignStudentsToQuranClass();
        await studentsStore.fetchStudents();
      } else if (selectedFlag.value === "assign_driver") {
        await assignStudentsToDriver();
        await studentsStore.fetchStudents();
      }
      showModal.value = false;
    }
    const driver_id_query = route.query.driver_id;
    const level_query = route.query.level;
    const class_group_query = route.query.class_group;
    const classType_query = typeof route.query.classType === "string" && (route.query.classType === "quran" || route.query.classType === "academic") ? route.query.classType : void 0;
    const selectedStudents = computed(
      () => Object.keys(rowSelection.value).map((index) => numberedStudents.value[+index])
    );
    const filteredStudents = computed(() => {
      if (driver_id_query) {
        return studentsStore.sortedStudents.filter(
          (student) => driver_id_query !== null && driver_id_query !== void 0 && student.driver_id === +driver_id_query
        );
      } else if (level_query && class_group_query) {
        if (classType_query === "academic") {
          return studentsStore.sortedStudents.filter(
            (student) => {
              var _a, _b;
              return ((_a = student.academic_class) == null ? void 0 : _a.title) === level_query && String((_b = student.academic_class) == null ? void 0 : _b.group) === String(class_group_query);
            }
          );
        } else if (classType_query === "quran") {
          return studentsStore.sortedStudents.filter(
            (student) => {
              var _a, _b;
              return ((_a = student.quran_class) == null ? void 0 : _a.title) === level_query && String((_b = student.quran_class) == null ? void 0 : _b.group) === String(class_group_query);
            }
          );
        }
      } else if (level_query) {
        return studentsStore.sortedStudents.filter(
          (student) => {
            var _a;
            return ((_a = student.academic_class) == null ? void 0 : _a.title) === level_query;
          }
        );
      } else {
        return studentsStore.sortedStudents;
      }
    });
    const numberedStudents = computed(
      () => {
        var _a;
        return ((_a = filteredStudents.value) != null ? _a : []).map((student, index) => {
          return {
            ...student,
            rowNumber: index + 1
          };
        });
      }
    );
    const selectedStudentsIds = computed(
      () => selectedStudents.value.map((student) => student == null ? void 0 : student.id)
    );
    const modelTitle = computed(
      () => selectedFlag.value === "studentIssue" ? "\u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u0645\u062E\u0627\u0644\u0641\u0627\u062A" : selectedFlag.value === "move_academic_class" ? "\u0646\u0642\u0644 \u0644\u0635\u0641 \u062F\u0631\u0627\u0633\u064A" : selectedFlag.value === "move_quran_class" ? "\u0646\u0642\u0644 \u0644\u0635\u0641 \u0642\u0631\u0622\u0646" : selectedFlag.value === "academic_class" ? "\u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u0635\u0641 \u0627\u0644\u062F\u0631\u0627\u0633\u064A" : selectedFlag.value === "quran_class" ? "\u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u0635\u0641 \u0627\u0644\u0642\u0631\u0622\u0646\u064A" : selectedFlag.value === "driver_info" ? "\u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u0633\u0627\u0626\u0642" : ""
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UModal = _sfc_main$2;
      const _component_UForm = _sfc_main$3;
      const _component_UFormField = _sfc_main$4;
      const _component_USelect = _sfc_main$5;
      const _component_UInput = _sfc_main$6;
      const _component_BaseTable = _sfc_main$8;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_UModal, {
        open: unref(showModal),
        "onUpdate:open": ($event) => isRef(showModal) ? showModal.value = $event : null,
        title: unref(modelTitle)
      }, {
        body: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D, _E, _F, _G, _H;
          if (_push2) {
            if (unref(selectedFlag) === "studentIssue") {
              _push2(`<div${_scopeId}>`);
              if ((_b = (_a = unref(selectedStudent)) == null ? void 0 : _a.behavioral_issues) == null ? void 0 : _b.length) {
                _push2(`<div${_scopeId}><ul${_scopeId}><li class="grid grid-cols-3 justify-between items-center gap-2 border-b py-2"${_scopeId}><span class="font-bold"${_scopeId}>\u0627\u0644\u064A\u0648\u0645</span><span class="font-bold"${_scopeId}>\u0627\u0644\u062A\u0627\u0631\u064A\u062E</span><span class="font-bold"${_scopeId}>\u0627\u0644\u0645\u062E\u0627\u0644\u0641\u0629</span></li><!--[-->`);
                ssrRenderList(unref(selectedStudent).behavioral_issues, (issue, index) => {
                  _push2(`<li class="grid grid-cols-3 justify-between items-center gap-2 border-b border-dashed border-gray-200 py-2 mb-2"${_scopeId}><span${_scopeId}>${ssrInterpolate(dayNameArabic(issue.date + ""))}</span><span${_scopeId}>${ssrInterpolate(issue.date)}</span><span${_scopeId}>${ssrInterpolate(issue.description)}</span></li>`);
                });
                _push2(`<!--]--></ul><div class="pt-3"${_scopeId}><span${_scopeId}> \u0627\u0644\u0645\u062C\u0645\u0648\u0639: </span><span class="font-bold"${_scopeId}>${ssrInterpolate(unref(selectedStudent).behavioral_issues.length)}</span></div></div>`);
              } else {
                _push2(`<p${_scopeId}>\u0644\u0627 \u062A\u0648\u062C\u062F \u0645\u062E\u0627\u0644\u0641\u0627\u062A.</p>`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (unref(selectedFlag) === "academic_class") {
              _push2(`<div${_scopeId}>`);
              if ((_c = unref(selectedStudent)) == null ? void 0 : _c.academic_class) {
                _push2(`<div${_scopeId}><ul${_scopeId}><li class="grid grid-cols-4 justify-between items-center gap-2 border-b py-2"${_scopeId}><span class="font-bold"${_scopeId}>\u0627\u0644\u0635\u0641</span><span class="font-bold"${_scopeId}>\u0627\u0644\u0634\u0639\u0628\u0629</span><span class="font-bold"${_scopeId}>\u0627\u0644\u0637\u0627\u0628\u0642</span><span class="font-bold"${_scopeId}>\u0627\u0644\u062C\u0647\u0629</span></li><li class="grid grid-cols-4 justify-between items-center gap-2 py-2"${_scopeId}><span class="font-bold"${_scopeId}>${ssrInterpolate((_d = unref(selectedStudent)) == null ? void 0 : _d.academic_class.title)}</span><span class="font-bold"${_scopeId}>${ssrInterpolate((_e = unref(selectedStudent)) == null ? void 0 : _e.academic_class.group)}</span><span class="font-bold"${_scopeId}>${ssrInterpolate((_f = unref(selectedStudent)) == null ? void 0 : _f.academic_class.floor)}</span><span class="font-bold"${_scopeId}>${ssrInterpolate((_g = unref(selectedStudent)) == null ? void 0 : _g.academic_class.wing)}</span></li></ul></div>`);
              } else {
                _push2(`<p${_scopeId}>\u0644\u0645 \u064A\u062A\u0645 \u062A\u0639\u064A\u064A\u0646 \u0635\u0641 \u0628\u0639\u062F</p>`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (unref(selectedFlag) === "quran_class") {
              _push2(`<div${_scopeId}>`);
              if ((_h = unref(selectedStudent)) == null ? void 0 : _h.quran_class) {
                _push2(`<div${_scopeId}><ul${_scopeId}><li class="grid grid-cols-4 justify-between items-center gap-2 border-b py-2"${_scopeId}><span class="font-bold"${_scopeId}>\u0627\u0644\u0635\u0641</span><span class="font-bold"${_scopeId}>\u0627\u0644\u0634\u0639\u0628\u0629</span><span class="font-bold"${_scopeId}>\u0627\u0644\u0637\u0627\u0628\u0642</span><span class="font-bold"${_scopeId}>\u0627\u0644\u062C\u0647\u0629</span></li><li class="grid grid-cols-4 justify-between items-center gap-2 py-2"${_scopeId}><span class="font-bold"${_scopeId}>${ssrInterpolate((_i = unref(selectedStudent)) == null ? void 0 : _i.quran_class.title)}</span><span class="font-bold"${_scopeId}>${ssrInterpolate((_j = unref(selectedStudent)) == null ? void 0 : _j.quran_class.group)}</span><span class="font-bold"${_scopeId}>${ssrInterpolate((_k = unref(selectedStudent)) == null ? void 0 : _k.quran_class.floor)}</span><span class="font-bold"${_scopeId}>${ssrInterpolate((_l = unref(selectedStudent)) == null ? void 0 : _l.quran_class.wing)}</span></li></ul></div>`);
              } else {
                _push2(`<p${_scopeId}>\u0644\u0645 \u064A\u062A\u0645 \u062A\u0639\u064A\u064A\u0646 \u0635\u0641 \u0628\u0639\u062F</p>`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (unref(selectedFlag) === "driver_info") {
              _push2(`<div${_scopeId}>`);
              if ((_m = unref(selectedStudent)) == null ? void 0 : _m.driver) {
                _push2(`<div${_scopeId}><ul${_scopeId}><li class="grid grid-cols-4 justify-between items-center gap-2 border-b py-2"${_scopeId}><span class="font-bold"${_scopeId}>\u0627\u0644\u0627\u0633\u0645</span><span class="font-bold"${_scopeId}>\u0646\u0648\u0639 \u0627\u0644\u0633\u064A\u0627\u0631\u0629</span><span class="font-bold"${_scopeId}>\u0644\u0648\u0646 \u0627\u0644\u0633\u064A\u0627\u0631\u0629</span><span class="font-bold"${_scopeId}>\u0631\u0642\u0645 \u0627\u0644\u062C\u0648\u0627\u0644</span></li><li class="grid grid-cols-4 justify-between items-center gap-2 py-2"${_scopeId}><span class="font-bold"${_scopeId}>${ssrInterpolate((_n = unref(selectedStudent)) == null ? void 0 : _n.driver.name)}</span><span class="font-bold"${_scopeId}>${ssrInterpolate((_o = unref(selectedStudent)) == null ? void 0 : _o.driver.car_type)}</span><span class="font-bold"${_scopeId}>${ssrInterpolate((_p = unref(selectedStudent)) == null ? void 0 : _p.driver.car_color)}</span><span class="font-bold"${_scopeId}>${ssrInterpolate((_q = unref(selectedStudent)) == null ? void 0 : _q.driver.phone_no)}</span></li></ul></div>`);
              } else {
                _push2(`<p${_scopeId}>\u0644\u0645 \u064A\u062A\u0645 \u062A\u0639\u064A\u064A\u0646 \u0633\u0627\u0626\u0642 \u0628\u0639\u062F</p>`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (unref(selectedFlag) === "move_academic_class") {
              _push2(`<div${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UForm, {
                schema: unref(schema),
                state: { selectedClassId: unref(selectedClassId) },
                class: "space-y-4",
                onSubmit
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_UFormField, {
                      label: "\u0627\u062E\u062A\u0631 \u0627\u0644\u0635\u0641 \u0627\u0644\u062F\u0631\u0627\u0633\u064A",
                      required: "",
                      name: "classId"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_USelect, {
                            class: "w-full",
                            modelValue: unref(selectedClassId),
                            "onUpdate:modelValue": ($event) => isRef(selectedClassId) ? selectedClassId.value = $event : null,
                            items: unref(academicClassesStore).classesData.map((c) => ({
                              label: `${c.title} - \u0634\u0639\u0628\u0629 ${c.group}`,
                              value: c.id
                            })),
                            placeholder: "\u0627\u062E\u062A\u0631 \u0627\u0644\u0635\u0641 \u0627\u0644\u062F\u0631\u0627\u0633\u064A"
                          }, null, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_USelect, {
                              class: "w-full",
                              modelValue: unref(selectedClassId),
                              "onUpdate:modelValue": ($event) => isRef(selectedClassId) ? selectedClassId.value = $event : null,
                              items: unref(academicClassesStore).classesData.map((c) => ({
                                label: `${c.title} - \u0634\u0639\u0628\u0629 ${c.group}`,
                                value: c.id
                              })),
                              placeholder: "\u0627\u062E\u062A\u0631 \u0627\u0644\u0635\u0641 \u0627\u0644\u062F\u0631\u0627\u0633\u064A"
                            }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`<div class="flex gap-3 items-center"${_scopeId2}>`);
                    _push3(ssrRenderComponent(unref(UButton), {
                      type: "submit",
                      label: "\u0646\u0642\u0644",
                      color: "secondary",
                      loading: unref(academicClassesStore).loading,
                      class: "w-30 flex justify-center mt-5 hover:cursor-pointer font-bold"
                    }, null, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(unref(UButton), {
                      label: "\u0625\u0644\u063A\u0627\u0621",
                      color: "neutral",
                      variant: "soft",
                      class: "w-30 flex justify-center mt-5 hover:cursor-pointer",
                      onClick: ($event) => showModal.value = false
                    }, null, _parent3, _scopeId2));
                    _push3(`</div>`);
                  } else {
                    return [
                      createVNode(_component_UFormField, {
                        label: "\u0627\u062E\u062A\u0631 \u0627\u0644\u0635\u0641 \u0627\u0644\u062F\u0631\u0627\u0633\u064A",
                        required: "",
                        name: "classId"
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_USelect, {
                            class: "w-full",
                            modelValue: unref(selectedClassId),
                            "onUpdate:modelValue": ($event) => isRef(selectedClassId) ? selectedClassId.value = $event : null,
                            items: unref(academicClassesStore).classesData.map((c) => ({
                              label: `${c.title} - \u0634\u0639\u0628\u0629 ${c.group}`,
                              value: c.id
                            })),
                            placeholder: "\u0627\u062E\u062A\u0631 \u0627\u0644\u0635\u0641 \u0627\u0644\u062F\u0631\u0627\u0633\u064A"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                        ]),
                        _: 1
                      }),
                      createVNode("div", { class: "flex gap-3 items-center" }, [
                        createVNode(unref(UButton), {
                          type: "submit",
                          label: "\u0646\u0642\u0644",
                          color: "secondary",
                          loading: unref(academicClassesStore).loading,
                          class: "w-30 flex justify-center mt-5 hover:cursor-pointer font-bold"
                        }, null, 8, ["loading"]),
                        createVNode(unref(UButton), {
                          label: "\u0625\u0644\u063A\u0627\u0621",
                          color: "neutral",
                          variant: "soft",
                          class: "w-30 flex justify-center mt-5 hover:cursor-pointer",
                          onClick: ($event) => showModal.value = false
                        }, null, 8, ["onClick"])
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (unref(selectedFlag) === "move_quran_class") {
              _push2(`<div${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UForm, {
                schema: unref(schema),
                state: { selectedClassId: unref(selectedClassId) },
                class: "space-y-4",
                onSubmit
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_UFormField, {
                      label: "\u0627\u062E\u062A\u0631 \u0635\u0641 \u0627\u0644\u0642\u0631\u0622\u0646",
                      required: "",
                      name: "classId"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_USelect, {
                            class: "w-full",
                            modelValue: unref(selectedClassId),
                            "onUpdate:modelValue": ($event) => isRef(selectedClassId) ? selectedClassId.value = $event : null,
                            items: unref(quranClassesStore).classesData.map((c) => ({
                              label: `${c.title} - \u0634\u0639\u0628\u0629 ${c.group}`,
                              value: c.id
                            })),
                            placeholder: "\u0627\u062E\u062A\u0631 \u0635\u0641 \u0627\u0644\u0642\u0631\u0622\u0646"
                          }, null, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_USelect, {
                              class: "w-full",
                              modelValue: unref(selectedClassId),
                              "onUpdate:modelValue": ($event) => isRef(selectedClassId) ? selectedClassId.value = $event : null,
                              items: unref(quranClassesStore).classesData.map((c) => ({
                                label: `${c.title} - \u0634\u0639\u0628\u0629 ${c.group}`,
                                value: c.id
                              })),
                              placeholder: "\u0627\u062E\u062A\u0631 \u0635\u0641 \u0627\u0644\u0642\u0631\u0622\u0646"
                            }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`<div class="flex gap-3 items-center"${_scopeId2}>`);
                    _push3(ssrRenderComponent(unref(UButton), {
                      type: "submit",
                      label: "\u0646\u0642\u0644",
                      color: "secondary",
                      loading: unref(quranClassesStore).loading,
                      class: "w-30 flex justify-center mt-5 hover:cursor-pointer font-bold"
                    }, null, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(unref(UButton), {
                      label: "\u0625\u0644\u063A\u0627\u0621",
                      color: "neutral",
                      variant: "soft",
                      class: "w-30 flex justify-center mt-5 hover:cursor-pointer",
                      onClick: ($event) => showModal.value = false
                    }, null, _parent3, _scopeId2));
                    _push3(`</div>`);
                  } else {
                    return [
                      createVNode(_component_UFormField, {
                        label: "\u0627\u062E\u062A\u0631 \u0635\u0641 \u0627\u0644\u0642\u0631\u0622\u0646",
                        required: "",
                        name: "classId"
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_USelect, {
                            class: "w-full",
                            modelValue: unref(selectedClassId),
                            "onUpdate:modelValue": ($event) => isRef(selectedClassId) ? selectedClassId.value = $event : null,
                            items: unref(quranClassesStore).classesData.map((c) => ({
                              label: `${c.title} - \u0634\u0639\u0628\u0629 ${c.group}`,
                              value: c.id
                            })),
                            placeholder: "\u0627\u062E\u062A\u0631 \u0635\u0641 \u0627\u0644\u0642\u0631\u0622\u0646"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                        ]),
                        _: 1
                      }),
                      createVNode("div", { class: "flex gap-3 items-center" }, [
                        createVNode(unref(UButton), {
                          type: "submit",
                          label: "\u0646\u0642\u0644",
                          color: "secondary",
                          loading: unref(quranClassesStore).loading,
                          class: "w-30 flex justify-center mt-5 hover:cursor-pointer font-bold"
                        }, null, 8, ["loading"]),
                        createVNode(unref(UButton), {
                          label: "\u0625\u0644\u063A\u0627\u0621",
                          color: "neutral",
                          variant: "soft",
                          class: "w-30 flex justify-center mt-5 hover:cursor-pointer",
                          onClick: ($event) => showModal.value = false
                        }, null, 8, ["onClick"])
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (unref(selectedFlag) === "assign_driver") {
              _push2(`<div${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UForm, {
                schema: unref(assignDriverSchema),
                state: { selectedDriverId: unref(selectedDriverId) },
                class: "space-y-4",
                onSubmit
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_UFormField, {
                      label: "\u0627\u062E\u062A\u0631 \u0627\u0644\u0633\u0627\u0626\u0642",
                      required: "",
                      name: "driverId"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_USelect, {
                            class: "w-full",
                            modelValue: unref(selectedDriverId),
                            "onUpdate:modelValue": ($event) => isRef(selectedDriverId) ? selectedDriverId.value = $event : null,
                            items: unref(driversStore).driversData.map((driver) => ({
                              label: `${driver.name} - ${driver.car_type} - ${driver.car_color}`,
                              value: driver.id
                            })),
                            placeholder: "\u0627\u062E\u062A\u0631 \u0627\u0644\u0633\u0627\u0626\u0642"
                          }, null, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_USelect, {
                              class: "w-full",
                              modelValue: unref(selectedDriverId),
                              "onUpdate:modelValue": ($event) => isRef(selectedDriverId) ? selectedDriverId.value = $event : null,
                              items: unref(driversStore).driversData.map((driver) => ({
                                label: `${driver.name} - ${driver.car_type} - ${driver.car_color}`,
                                value: driver.id
                              })),
                              placeholder: "\u0627\u062E\u062A\u0631 \u0627\u0644\u0633\u0627\u0626\u0642"
                            }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`<div class="flex gap-3 items-center"${_scopeId2}>`);
                    _push3(ssrRenderComponent(unref(UButton), {
                      type: "submit",
                      label: "\u062A\u0639\u064A\u064A\u0646",
                      color: "secondary",
                      loading: unref(driversStore).loading,
                      class: "w-30 flex justify-center mt-5 hover:cursor-pointer font-bold"
                    }, null, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(unref(UButton), {
                      label: "\u0625\u0644\u063A\u0627\u0621",
                      color: "neutral",
                      variant: "soft",
                      class: "w-30 flex justify-center mt-5 hover:cursor-pointer",
                      onClick: ($event) => showModal.value = false
                    }, null, _parent3, _scopeId2));
                    _push3(`</div>`);
                  } else {
                    return [
                      createVNode(_component_UFormField, {
                        label: "\u0627\u062E\u062A\u0631 \u0627\u0644\u0633\u0627\u0626\u0642",
                        required: "",
                        name: "driverId"
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_USelect, {
                            class: "w-full",
                            modelValue: unref(selectedDriverId),
                            "onUpdate:modelValue": ($event) => isRef(selectedDriverId) ? selectedDriverId.value = $event : null,
                            items: unref(driversStore).driversData.map((driver) => ({
                              label: `${driver.name} - ${driver.car_type} - ${driver.car_color}`,
                              value: driver.id
                            })),
                            placeholder: "\u0627\u062E\u062A\u0631 \u0627\u0644\u0633\u0627\u0626\u0642"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                        ]),
                        _: 1
                      }),
                      createVNode("div", { class: "flex gap-3 items-center" }, [
                        createVNode(unref(UButton), {
                          type: "submit",
                          label: "\u062A\u0639\u064A\u064A\u0646",
                          color: "secondary",
                          loading: unref(driversStore).loading,
                          class: "w-30 flex justify-center mt-5 hover:cursor-pointer font-bold"
                        }, null, 8, ["loading"]),
                        createVNode(unref(UButton), {
                          label: "\u0625\u0644\u063A\u0627\u0621",
                          color: "neutral",
                          variant: "soft",
                          class: "w-30 flex justify-center mt-5 hover:cursor-pointer",
                          onClick: ($event) => showModal.value = false
                        }, null, 8, ["onClick"])
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              unref(selectedFlag) === "studentIssue" ? (openBlock(), createBlock("div", { key: 0 }, [
                ((_s = (_r = unref(selectedStudent)) == null ? void 0 : _r.behavioral_issues) == null ? void 0 : _s.length) ? (openBlock(), createBlock("div", { key: 0 }, [
                  createVNode("ul", null, [
                    createVNode("li", { class: "grid grid-cols-3 justify-between items-center gap-2 border-b py-2" }, [
                      createVNode("span", { class: "font-bold" }, "\u0627\u0644\u064A\u0648\u0645"),
                      createVNode("span", { class: "font-bold" }, "\u0627\u0644\u062A\u0627\u0631\u064A\u062E"),
                      createVNode("span", { class: "font-bold" }, "\u0627\u0644\u0645\u062E\u0627\u0644\u0641\u0629")
                    ]),
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(selectedStudent).behavioral_issues, (issue, index) => {
                      return openBlock(), createBlock("li", {
                        key: index,
                        class: "grid grid-cols-3 justify-between items-center gap-2 border-b border-dashed border-gray-200 py-2 mb-2"
                      }, [
                        createVNode("span", null, toDisplayString(dayNameArabic(issue.date + "")), 1),
                        createVNode("span", null, toDisplayString(issue.date), 1),
                        createVNode("span", null, toDisplayString(issue.description), 1)
                      ]);
                    }), 128))
                  ]),
                  createVNode("div", { class: "pt-3" }, [
                    createVNode("span", null, " \u0627\u0644\u0645\u062C\u0645\u0648\u0639: "),
                    createVNode("span", { class: "font-bold" }, toDisplayString(unref(selectedStudent).behavioral_issues.length), 1)
                  ])
                ])) : (openBlock(), createBlock("p", { key: 1 }, "\u0644\u0627 \u062A\u0648\u062C\u062F \u0645\u062E\u0627\u0644\u0641\u0627\u062A."))
              ])) : createCommentVNode("", true),
              unref(selectedFlag) === "academic_class" ? (openBlock(), createBlock("div", { key: 1 }, [
                ((_t = unref(selectedStudent)) == null ? void 0 : _t.academic_class) ? (openBlock(), createBlock("div", { key: 0 }, [
                  createVNode("ul", null, [
                    createVNode("li", { class: "grid grid-cols-4 justify-between items-center gap-2 border-b py-2" }, [
                      createVNode("span", { class: "font-bold" }, "\u0627\u0644\u0635\u0641"),
                      createVNode("span", { class: "font-bold" }, "\u0627\u0644\u0634\u0639\u0628\u0629"),
                      createVNode("span", { class: "font-bold" }, "\u0627\u0644\u0637\u0627\u0628\u0642"),
                      createVNode("span", { class: "font-bold" }, "\u0627\u0644\u062C\u0647\u0629")
                    ]),
                    createVNode("li", { class: "grid grid-cols-4 justify-between items-center gap-2 py-2" }, [
                      createVNode("span", { class: "font-bold" }, toDisplayString((_u = unref(selectedStudent)) == null ? void 0 : _u.academic_class.title), 1),
                      createVNode("span", { class: "font-bold" }, toDisplayString((_v = unref(selectedStudent)) == null ? void 0 : _v.academic_class.group), 1),
                      createVNode("span", { class: "font-bold" }, toDisplayString((_w = unref(selectedStudent)) == null ? void 0 : _w.academic_class.floor), 1),
                      createVNode("span", { class: "font-bold" }, toDisplayString((_x = unref(selectedStudent)) == null ? void 0 : _x.academic_class.wing), 1)
                    ])
                  ])
                ])) : (openBlock(), createBlock("p", { key: 1 }, "\u0644\u0645 \u064A\u062A\u0645 \u062A\u0639\u064A\u064A\u0646 \u0635\u0641 \u0628\u0639\u062F"))
              ])) : createCommentVNode("", true),
              unref(selectedFlag) === "quran_class" ? (openBlock(), createBlock("div", { key: 2 }, [
                ((_y = unref(selectedStudent)) == null ? void 0 : _y.quran_class) ? (openBlock(), createBlock("div", { key: 0 }, [
                  createVNode("ul", null, [
                    createVNode("li", { class: "grid grid-cols-4 justify-between items-center gap-2 border-b py-2" }, [
                      createVNode("span", { class: "font-bold" }, "\u0627\u0644\u0635\u0641"),
                      createVNode("span", { class: "font-bold" }, "\u0627\u0644\u0634\u0639\u0628\u0629"),
                      createVNode("span", { class: "font-bold" }, "\u0627\u0644\u0637\u0627\u0628\u0642"),
                      createVNode("span", { class: "font-bold" }, "\u0627\u0644\u062C\u0647\u0629")
                    ]),
                    createVNode("li", { class: "grid grid-cols-4 justify-between items-center gap-2 py-2" }, [
                      createVNode("span", { class: "font-bold" }, toDisplayString((_z = unref(selectedStudent)) == null ? void 0 : _z.quran_class.title), 1),
                      createVNode("span", { class: "font-bold" }, toDisplayString((_A = unref(selectedStudent)) == null ? void 0 : _A.quran_class.group), 1),
                      createVNode("span", { class: "font-bold" }, toDisplayString((_B = unref(selectedStudent)) == null ? void 0 : _B.quran_class.floor), 1),
                      createVNode("span", { class: "font-bold" }, toDisplayString((_C = unref(selectedStudent)) == null ? void 0 : _C.quran_class.wing), 1)
                    ])
                  ])
                ])) : (openBlock(), createBlock("p", { key: 1 }, "\u0644\u0645 \u064A\u062A\u0645 \u062A\u0639\u064A\u064A\u0646 \u0635\u0641 \u0628\u0639\u062F"))
              ])) : createCommentVNode("", true),
              unref(selectedFlag) === "driver_info" ? (openBlock(), createBlock("div", { key: 3 }, [
                ((_D = unref(selectedStudent)) == null ? void 0 : _D.driver) ? (openBlock(), createBlock("div", { key: 0 }, [
                  createVNode("ul", null, [
                    createVNode("li", { class: "grid grid-cols-4 justify-between items-center gap-2 border-b py-2" }, [
                      createVNode("span", { class: "font-bold" }, "\u0627\u0644\u0627\u0633\u0645"),
                      createVNode("span", { class: "font-bold" }, "\u0646\u0648\u0639 \u0627\u0644\u0633\u064A\u0627\u0631\u0629"),
                      createVNode("span", { class: "font-bold" }, "\u0644\u0648\u0646 \u0627\u0644\u0633\u064A\u0627\u0631\u0629"),
                      createVNode("span", { class: "font-bold" }, "\u0631\u0642\u0645 \u0627\u0644\u062C\u0648\u0627\u0644")
                    ]),
                    createVNode("li", { class: "grid grid-cols-4 justify-between items-center gap-2 py-2" }, [
                      createVNode("span", { class: "font-bold" }, toDisplayString((_E = unref(selectedStudent)) == null ? void 0 : _E.driver.name), 1),
                      createVNode("span", { class: "font-bold" }, toDisplayString((_F = unref(selectedStudent)) == null ? void 0 : _F.driver.car_type), 1),
                      createVNode("span", { class: "font-bold" }, toDisplayString((_G = unref(selectedStudent)) == null ? void 0 : _G.driver.car_color), 1),
                      createVNode("span", { class: "font-bold" }, toDisplayString((_H = unref(selectedStudent)) == null ? void 0 : _H.driver.phone_no), 1)
                    ])
                  ])
                ])) : (openBlock(), createBlock("p", { key: 1 }, "\u0644\u0645 \u064A\u062A\u0645 \u062A\u0639\u064A\u064A\u0646 \u0633\u0627\u0626\u0642 \u0628\u0639\u062F"))
              ])) : createCommentVNode("", true),
              unref(selectedFlag) === "move_academic_class" ? (openBlock(), createBlock("div", { key: 4 }, [
                createVNode(_component_UForm, {
                  schema: unref(schema),
                  state: { selectedClassId: unref(selectedClassId) },
                  class: "space-y-4",
                  onSubmit
                }, {
                  default: withCtx(() => [
                    createVNode(_component_UFormField, {
                      label: "\u0627\u062E\u062A\u0631 \u0627\u0644\u0635\u0641 \u0627\u0644\u062F\u0631\u0627\u0633\u064A",
                      required: "",
                      name: "classId"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_USelect, {
                          class: "w-full",
                          modelValue: unref(selectedClassId),
                          "onUpdate:modelValue": ($event) => isRef(selectedClassId) ? selectedClassId.value = $event : null,
                          items: unref(academicClassesStore).classesData.map((c) => ({
                            label: `${c.title} - \u0634\u0639\u0628\u0629 ${c.group}`,
                            value: c.id
                          })),
                          placeholder: "\u0627\u062E\u062A\u0631 \u0627\u0644\u0635\u0641 \u0627\u0644\u062F\u0631\u0627\u0633\u064A"
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                      ]),
                      _: 1
                    }),
                    createVNode("div", { class: "flex gap-3 items-center" }, [
                      createVNode(unref(UButton), {
                        type: "submit",
                        label: "\u0646\u0642\u0644",
                        color: "secondary",
                        loading: unref(academicClassesStore).loading,
                        class: "w-30 flex justify-center mt-5 hover:cursor-pointer font-bold"
                      }, null, 8, ["loading"]),
                      createVNode(unref(UButton), {
                        label: "\u0625\u0644\u063A\u0627\u0621",
                        color: "neutral",
                        variant: "soft",
                        class: "w-30 flex justify-center mt-5 hover:cursor-pointer",
                        onClick: ($event) => showModal.value = false
                      }, null, 8, ["onClick"])
                    ])
                  ]),
                  _: 1
                }, 8, ["schema", "state"])
              ])) : createCommentVNode("", true),
              unref(selectedFlag) === "move_quran_class" ? (openBlock(), createBlock("div", { key: 5 }, [
                createVNode(_component_UForm, {
                  schema: unref(schema),
                  state: { selectedClassId: unref(selectedClassId) },
                  class: "space-y-4",
                  onSubmit
                }, {
                  default: withCtx(() => [
                    createVNode(_component_UFormField, {
                      label: "\u0627\u062E\u062A\u0631 \u0635\u0641 \u0627\u0644\u0642\u0631\u0622\u0646",
                      required: "",
                      name: "classId"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_USelect, {
                          class: "w-full",
                          modelValue: unref(selectedClassId),
                          "onUpdate:modelValue": ($event) => isRef(selectedClassId) ? selectedClassId.value = $event : null,
                          items: unref(quranClassesStore).classesData.map((c) => ({
                            label: `${c.title} - \u0634\u0639\u0628\u0629 ${c.group}`,
                            value: c.id
                          })),
                          placeholder: "\u0627\u062E\u062A\u0631 \u0635\u0641 \u0627\u0644\u0642\u0631\u0622\u0646"
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                      ]),
                      _: 1
                    }),
                    createVNode("div", { class: "flex gap-3 items-center" }, [
                      createVNode(unref(UButton), {
                        type: "submit",
                        label: "\u0646\u0642\u0644",
                        color: "secondary",
                        loading: unref(quranClassesStore).loading,
                        class: "w-30 flex justify-center mt-5 hover:cursor-pointer font-bold"
                      }, null, 8, ["loading"]),
                      createVNode(unref(UButton), {
                        label: "\u0625\u0644\u063A\u0627\u0621",
                        color: "neutral",
                        variant: "soft",
                        class: "w-30 flex justify-center mt-5 hover:cursor-pointer",
                        onClick: ($event) => showModal.value = false
                      }, null, 8, ["onClick"])
                    ])
                  ]),
                  _: 1
                }, 8, ["schema", "state"])
              ])) : createCommentVNode("", true),
              unref(selectedFlag) === "assign_driver" ? (openBlock(), createBlock("div", { key: 6 }, [
                createVNode(_component_UForm, {
                  schema: unref(assignDriverSchema),
                  state: { selectedDriverId: unref(selectedDriverId) },
                  class: "space-y-4",
                  onSubmit
                }, {
                  default: withCtx(() => [
                    createVNode(_component_UFormField, {
                      label: "\u0627\u062E\u062A\u0631 \u0627\u0644\u0633\u0627\u0626\u0642",
                      required: "",
                      name: "driverId"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_USelect, {
                          class: "w-full",
                          modelValue: unref(selectedDriverId),
                          "onUpdate:modelValue": ($event) => isRef(selectedDriverId) ? selectedDriverId.value = $event : null,
                          items: unref(driversStore).driversData.map((driver) => ({
                            label: `${driver.name} - ${driver.car_type} - ${driver.car_color}`,
                            value: driver.id
                          })),
                          placeholder: "\u0627\u062E\u062A\u0631 \u0627\u0644\u0633\u0627\u0626\u0642"
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                      ]),
                      _: 1
                    }),
                    createVNode("div", { class: "flex gap-3 items-center" }, [
                      createVNode(unref(UButton), {
                        type: "submit",
                        label: "\u062A\u0639\u064A\u064A\u0646",
                        color: "secondary",
                        loading: unref(driversStore).loading,
                        class: "w-30 flex justify-center mt-5 hover:cursor-pointer font-bold"
                      }, null, 8, ["loading"]),
                      createVNode(unref(UButton), {
                        label: "\u0625\u0644\u063A\u0627\u0621",
                        color: "neutral",
                        variant: "soft",
                        class: "w-30 flex justify-center mt-5 hover:cursor-pointer",
                        onClick: ($event) => showModal.value = false
                      }, null, 8, ["onClick"])
                    ])
                  ]),
                  _: 1
                }, 8, ["schema", "state"])
              ])) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="w-full flex justify-between gap-2 mt-5 mb-5"><!--[-->`);
      _push(ssrRenderComponent(_component_UInput, {
        icon: "i-lucide-search",
        size: "md",
        color: "secondary",
        variant: "outline",
        modelValue: unref(globalFilter),
        "onUpdate:modelValue": ($event) => isRef(globalFilter) ? globalFilter.value = $event : null,
        placeholder: "\u0627\u0644\u0628\u062D\u062B \u0639\u0646 \u0637\u0627\u0644\u0628...",
        class: "w-full md:col-span-4"
      }, null, _parent));
      if (unref(selectedStudents).length) {
        _push(`<div class="flex items-center justify-end gap-2">`);
        _push(ssrRenderComponent(unref(UButton), {
          icon: "heroicons-trash",
          variant: "outline",
          color: "error",
          size: "xs",
          class: "p-2 font-bold h-full",
          loading: unref(studentsStore).loading,
          onClick: deleteSelectedStudents
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span${_scopeId}>\u062D\u0630\u0641</span><span${_scopeId}>(${ssrInterpolate(unref(selectedStudents).length)})</span>`);
            } else {
              return [
                createVNode("span", null, "\u062D\u0630\u0641"),
                createVNode("span", null, "(" + toDisplayString(unref(selectedStudents).length) + ")", 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(unref(UButton), {
          icon: "i-heroicons-arrow-right-on-rectangle",
          variant: "outline",
          color: "info",
          size: "xs",
          class: "p-2 font-bold h-full",
          onClick: ($event) => showBasedModal("move_quran_class")
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span${_scopeId}>\u0646\u0642\u0644</span><span${_scopeId}>\u0644\u0635\u0641</span><span${_scopeId}>\u0642\u0631\u0622\u0646</span><span${_scopeId}>(${ssrInterpolate(unref(selectedStudents).length)})</span>`);
            } else {
              return [
                createVNode("span", null, "\u0646\u0642\u0644"),
                createVNode("span", null, "\u0644\u0635\u0641"),
                createVNode("span", null, "\u0642\u0631\u0622\u0646"),
                createVNode("span", null, "(" + toDisplayString(unref(selectedStudents).length) + ")", 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(unref(UButton), {
          icon: "i-heroicons-arrow-right-on-rectangle",
          variant: "outline",
          color: "info",
          size: "xs",
          class: "p-2 font-bold h-full",
          onClick: ($event) => showBasedModal("move_academic_class")
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span${_scopeId}>\u0646\u0642\u0644</span><span${_scopeId}>\u0644\u0635\u0641</span><span${_scopeId}>\u062F\u0631\u0627\u0633\u064A</span><span${_scopeId}>(${ssrInterpolate(unref(selectedStudents).length)})</span>`);
            } else {
              return [
                createVNode("span", null, "\u0646\u0642\u0644"),
                createVNode("span", null, "\u0644\u0635\u0641"),
                createVNode("span", null, "\u062F\u0631\u0627\u0633\u064A"),
                createVNode("span", null, "(" + toDisplayString(unref(selectedStudents).length) + ")", 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(unref(UButton), {
          icon: "lucide-car-taxi-front",
          variant: "outline",
          color: "warning",
          size: "xs",
          class: "p-2 font-bold h-full",
          onClick: ($event) => showBasedModal("assign_driver")
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span${_scopeId}>\u062A\u0639\u064A\u064A\u0646</span><span${_scopeId}>\u0633\u0627\u0626\u0642</span><span${_scopeId}>(${ssrInterpolate(unref(selectedStudents).length)})</span>`);
            } else {
              return [
                createVNode("span", null, "\u062A\u0639\u064A\u064A\u0646"),
                createVNode("span", null, "\u0633\u0627\u0626\u0642"),
                createVNode("span", null, "(" + toDisplayString(unref(selectedStudents).length) + ")", 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(unref(UButton), {
          icon: "heroicons-document-chart-bar-solid",
          variant: "outline",
          color: "primary",
          size: "xs",
          class: "p-2 font-bold text-green-700 h-full"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span${_scopeId}>(${ssrInterpolate(unref(selectedStudents).length)})</span><span${_scopeId}> Excel </span>`);
            } else {
              return [
                createVNode("span", null, "(" + toDisplayString(unref(selectedStudents).length) + ")", 1),
                createVNode("span", null, " Excel ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(unref(UButton), {
          icon: "heroicons-document-chart-bar-solid",
          variant: "outline",
          color: "secondary",
          size: "sm",
          class: "p-2 font-bold text-blue-700 h-full"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span${_scopeId}>(${ssrInterpolate(unref(selectedStudents).length)})</span><span${_scopeId}> PDF </span>`);
            } else {
              return [
                createVNode("span", null, "(" + toDisplayString(unref(selectedStudents).length) + ")", 1),
                createVNode("span", null, " PDF ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      }
      _push(`<!--]--></div>`);
      _push(ssrRenderComponent(_component_BaseTable, {
        loading: unref(studentsStore).loading,
        key: unref(studentsStore).tableKey,
        "global-filter": unref(globalFilter),
        "onUpdate:globalFilter": ($event) => isRef(globalFilter) ? globalFilter.value = $event : null,
        "row-selection": unref(rowSelection),
        "onUpdate:rowSelection": ($event) => isRef(rowSelection) ? rowSelection.value = $event : null,
        ref: unref(table),
        data: unref(numberedStudents),
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/students/main.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_StudentsMain = _sfc_main$1;
  _push(ssrRenderComponent(_component_StudentsMain, _attrs, null, _parent));
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/students/view/students_table.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const students_table = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { students_table as default };
//# sourceMappingURL=students_table-CJcMoyzR.mjs.map
