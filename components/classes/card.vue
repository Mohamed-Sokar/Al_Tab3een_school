<script setup lang="ts">
import type { Class } from "~/types";

defineProps<{
  _class: Class;
}>();

const academicClassesStore = useAcademicClassesStore();
const quranClassesStore = useQuranClassesStore();

console.log(academicClassesStore.loading);
const route = useRoute();
const isLoading = ref(false);
const classT = route.path.split("/")[route.path.split("/").length - 1];

const classType = computed(() =>
  classT === "academic_classes"
    ? "academic"
    : classT === "quran_classes"
    ? "quran"
    : ""
);

const query = (_class: Class) => {
  if (classType.value === "academic") {
    return {
      academic_class_id: _class.id,
    };
  }
  if (classType.value === "quran") {
    return {
      quran_class_id: _class.id,
    };
  }
  return {};
};

const onDeleteHandler = async (_class: Class) => {
  classType.value === "academic"
    ? academicClassesStore.deleteClass(_class.id ?? 0)
    : quranClassesStore.deleteClass(_class.id ?? 0);
};
</script>

<template>
  <UCard
    class="h-full border-t-4 border-secondary hover:shadow-xl transition-all"
  >
    <div class="flex justify-between">
      <div class="flex items-center gap-1">
        <UIcon
          name="i-heroicons-presentation-chart-bar"
          class="text-secondary w-8 h-8"
        />
        <span class="text-secondary-600 font-semibold">
          {{ _class.title }}
        </span>
      </div>
      <div>
        <UBadge
          :label="`الشعبة: ${_class.group}`"
          variant="soft"
          color="secondary"
          class="text-secondary-600 font-bold"
        />
      </div>
    </div>

    <div class="flex flex-col gap-5 mt-5">
      <div
        class="flex justify-between items-center px-4 py-2 rounded-sm bg-gray-50 dark:bg-secondary-950"
      >
        <div class="flex items-center gap-1">
          <UIcon
            name="heroicons-user-group-solid"
            class="text-secondary w-5 h-5"
          />
          <span class="text-xs font-bold">عدد الطلاب</span>
        </div>
        <div class="font-bold text-secondary-600">
          {{ _class?.students?.[0]?.count ?? 0 }}
        </div>
      </div>

      <div
        class="flex justify-between items-center px-4 py-2 rounded-sm bg-gray-50 dark:bg-secondary-950"
      >
        <div class="flex items-center gap-1">
          <UIcon
            name="i-heroicons-user-group-solid"
            class="text-error w-5 h-5"
          />
          <span class="text-xs font-bold">السعة القصوى</span>
        </div>
        <div class="text-error text-sm flex items-center gap-1">
          <div class="font-bold">
            {{ _class.maximum_capacity }}
          </div>
          <div class="font-semibold">طالب</div>
        </div>
      </div>
      <div
        class="flex justify-between items-center px-4 py-2 rounded-sm bg-gray-50 dark:bg-secondary-950"
      >
        <div class="flex items-center gap-1">
          <UIcon name="i-heroicons-cube" class="text-gray-400 w-5 h-5" />
          <span class="text-xs font-bold">المقاعد الفارغة</span>
        </div>
        <div
          class="text-sm flex items-center gap-1"
          :class="`text-${
            (_class.maximum_capacity ?? 0) -
              (_class?.students?.[0]?.count ?? 0) >
            0
              ? 'success'
              : 'error'
          }`"
        >
          <div class="font-bold">
            {{
              (_class.maximum_capacity ?? 0) -
              (_class?.students?.[0]?.count ?? 0)
            }}
          </div>
          <div class="font-semibold">مقعد</div>
        </div>
      </div>
      <div
        class="flex justify-between items-center px-4 py-2 rounded-sm bg-gray-50 dark:bg-secondary-950"
      >
        <div class="flex items-center gap-1">
          <UIcon name="heroicons-building-library" class="w-5 h-5 text-info" />
          <span class="text-xs font-bold">الطابق</span>
        </div>
        <div class="text-warning text-sm flex items-center gap-1">
          <div class="font-bold">
            {{ _class.floor }}
          </div>
        </div>
      </div>

      <div
        class="flex justify-between items-center px-4 py-2 rounded-sm bg-gray-50 dark:bg-secondary-950"
      >
        <div class="flex items-center gap-1">
          <UIcon name="i-heroicons-globe-alt" class="text-info w-5 h-5" />
          <span class="text-xs font-bold">الجهة</span>
        </div>
        <div class="text-warning text-sm flex items-center gap-1">
          <div class="font-bold">
            {{ _class.wing }}
          </div>
        </div>
      </div>

      <div class="grid grid-cols-5 gap-2 text-center">
        <UButton
          label="عرض الطلاب"
          class="hover:cursor-pointer col-span-5 xl:col-span-3 flex justify-center"
          color="secondary"
          variant="subtle"
          size="sm"
          @click="
            navigateTo({
              name: 'students-view',
              query: query(_class),
            })
          "
        />
        <UButton
          label="تعديل"
          class="hover:cursor-pointer flex justify-center col-span-5 xl:col-span-1"
          color="secondary"
          variant="solid"
          size="sm"
          @click="
            navigateTo({
              name: 'classes-id-edit_class',
              params: { id: _class.id },
              query: { classType: classType },
            })
          "
        />
        <UButton
          label="حذف"
          class="hover:cursor-pointer flex justify-center col-span-5 xl:col-span-1"
          color="error"
          variant="solid"
          :loading="isLoading"
          @click="onDeleteHandler(_class)"
        />
      </div>
    </div>
  </UCard>
</template>

<style scoped></style>
