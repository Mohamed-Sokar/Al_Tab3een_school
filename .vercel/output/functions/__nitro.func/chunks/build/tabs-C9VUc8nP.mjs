import { g as useRoute, a as __nuxt_component_0$2, c as _sfc_main$b } from './server.mjs';
import { defineComponent, computed, mergeProps, unref, withCtx, createVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "tabs",
  __ssrInlineRender: true,
  props: {
    links: {}
  },
  setup(__props) {
    const props = __props;
    const route = useRoute();
    const wrraperLinksClasses = computed(() => {
      return `text-sm grid grid-cols-${props.links.length} gap-1 p-1 bg-secondary-50 border border-secondary-200 dark:bg-secondary-950 dark:border-secondary-500 rounded-sm mt-2 mb-8 `;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$2;
      const _component_UIcon = _sfc_main$b;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: unref(wrraperLinksClasses) }, _attrs))}><!--[-->`);
      ssrRenderList(_ctx.links, (link) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: link.to,
          to: link.to,
          class: ["flex items-center justify-center gap-2 w-full h-full p-2 rounded-md hover:bg-secondary hover:dark:bg-secondary-600 hover:text-white hover:font-bold", {
            "bg-secondary dark:bg-secondary-600 text-white font-bold": link.to === unref(route).path
          }]
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span${_scopeId}>${ssrInterpolate(link.label)}</span>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: link.icon,
                class: "text-lg"
              }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode("span", null, toDisplayString(link.label), 1),
                createVNode(_component_UIcon, {
                  name: link.icon,
                  class: "text-lg"
                }, null, 8, ["name"])
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/base/tabs.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=tabs-C9VUc8nP.mjs.map
