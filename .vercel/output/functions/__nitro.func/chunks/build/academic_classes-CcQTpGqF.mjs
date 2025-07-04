import { _ as _sfc_main$1 } from './card-Ai27NEhF.mjs';
import { defineComponent, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent } from 'vue/server-renderer';
import { u as useAcademicClassesStore } from './academic_classes-C4vfu9w7.mjs';
import './Card-ClkFNDdW.mjs';
import 'reka-ui';
import './server.mjs';
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
import './Badge-CPUrxw_P.mjs';
import './students-C5l8o5u3.mjs';
import './useAppToast-BZDaw0os.mjs';
import './constants-CI-Eb238.mjs';
import './api-Bx7QNuNm.mjs';
import 'axios';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "academic_classes",
  __ssrInlineRender: true,
  setup(__props) {
    const classesStore = useAcademicClassesStore();
    const numberedClasses = computed(
      () => classesStore.classesWithStudentsCount.map((_class, index) => ({
        ..._class,
        rowNumber: index + 1
      }))
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ClassesCard = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "grid lg:grid-cols-3 gap-4 mt-5" }, _attrs))}><!--[-->`);
      ssrRenderList(unref(numberedClasses), (_class) => {
        _push(ssrRenderComponent(_component_ClassesCard, {
          key: _class.id || Math.random(),
          _class
        }, null, _parent));
      });
      _push(`<!--]--></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/classes/view/academic_classes.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=academic_classes-CcQTpGqF.mjs.map
