import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderSlot } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "header",
  __ssrInlineRender: true,
  props: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "ps-13 lg:ps-0" }, _attrs))}><div class="flex flex-wrap gap-4 p-7 shadow-sm rounded-md bg-gradient-to-l from-blue-800 to-purple-500 dark:from-gray-900 dark:to-gray-800 items-center justify-between bg-blue-600 dark:bg-gray-800 text-white"><div><h2 class="text-2xl font-bold">${ssrInterpolate(__props.title)}</h2><p class="text-sm text-blue-200 dark:text-gray-400">${ssrInterpolate(__props.description)}</p></div><div class="flex gap-1">`);
      ssrRenderSlot(_ctx.$slots, "actions", {}, null, _push, _parent);
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/base/header.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=header-CXonAB11.mjs.map
