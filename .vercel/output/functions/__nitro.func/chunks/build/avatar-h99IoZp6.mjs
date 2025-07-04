import { _ as _sfc_main$1 } from './FormField-1OWKP-81.mjs';
import { h as useSupabaseUser, i as _sfc_main$a, e as _sfc_main$7 } from './server.mjs';
import { ref, computed, withCtx, unref, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { u as useSupabaseClient } from './useSupabaseClient-L7lO71ll.mjs';
import { u as useAppToast } from './useAppToast-BZDaw0os.mjs';
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

const _sfc_main = {
  __name: "avatar",
  __ssrInlineRender: true,
  setup(__props) {
    const supabase = useSupabaseClient();
    const user = useSupabaseUser();
    const { toastSuccess, toastError } = useAppToast();
    const uploading = ref(false);
    const fileInput = ref();
    const avatarUrl = computed(() => "/images/avatar.avif");
    const saveAvatar = async () => {
      var _a, _b;
      const file = fileInput.value.files[0];
      if (!file) {
        toastError({ title: "Select a file to upload first" });
        return;
      }
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      try {
        uploading.value = true;
        const currentAvatarUrl = (_b = (_a = user.value) == null ? void 0 : _a.user_metadata) == null ? void 0 : _b.avatar_url;
        const { data, error } = await supabase.storage.from("avatars").upload(fileName, file);
        if (error) throw error;
        await supabase.auth.updateUser({
          data: {
            avatar_url: data.path
            // Use the path returned from the upload
          }
        });
        if (currentAvatarUrl) {
          const { error: deleteError } = await supabase.storage.from("avatars").remove([currentAvatarUrl]);
          if (deleteError) throw deleteError;
        }
        fileInput.value.value = "";
        toastSuccess({
          title: "Avatar uploaded"
        });
      } catch (error) {
        toastError({
          title: "Error uploading avatar",
          description: error.message
        });
      } finally {
        uploading.value = false;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UFormField = _sfc_main$1;
      const _component_UAvatar = _sfc_main$a;
      const _component_UButton = _sfc_main$7;
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="mb-4">`);
      _push(ssrRenderComponent(_component_UFormField, {
        label: "\u0627\u0644\u0635\u0648\u0631\u0629 \u0627\u0644\u0634\u062E\u0635\u064A\u0629 \u0627\u0644\u062D\u0627\u0644\u064A\u0629",
        class: "w-full"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UAvatar, {
              src: unref(avatarUrl),
              class: "w-30 h-30 border"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UAvatar, {
                src: unref(avatarUrl),
                class: "w-30 h-30 border"
              }, null, 8, ["src"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="mb-4">`);
      _push(ssrRenderComponent(_component_UFormField, {
        label: "\u0627\u062E\u062A\u0631 \u0635\u0648\u0631\u0629 \u062C\u062F\u064A\u062F\u0629",
        class: "w-full",
        name: "avatar",
        help: "\u0628\u0639\u062F \u0627\u062E\u062A\u064A\u0627\u0631\u0643 \u0644\u0644\u0635\u0648\u0631\u0629 \u0627\u0636\u063A\u0637 \u0639\u0644\u0649 \u0632\u0631 \u062D\u0641\u0638 \u0644\u064A\u062A\u0645 \u062D\u0641\u0638 \u0627\u0644\u0635\u0648\u0631\u0629 \u0627\u0644\u062C\u062F\u064A\u062F\u0629"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<input type="file" class="py-1.5 px-2 w-80 rounded-md border border-gray-300 dark:border-gray-600"${_scopeId}>`);
          } else {
            return [
              createVNode("input", {
                type: "file",
                ref_key: "fileInput",
                ref: fileInput,
                class: "py-1.5 px-2 w-80 rounded-md border border-gray-300 dark:border-gray-600"
              }, null, 512)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_UButton, {
        type: "submit",
        color: "secondary",
        variant: "solid",
        label: "\u062D\u0641\u0638",
        loading: unref(uploading),
        disabled: unref(uploading),
        onClick: saveAvatar
      }, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/settings/avatar.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=avatar-h99IoZp6.mjs.map
