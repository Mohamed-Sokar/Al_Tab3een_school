<script setup lang="ts">
// props
const props = defineProps<{
  totalPages: number;
}>();

// emits
const emits = defineEmits<{
  (e: "update:pageNum", pageNum: number): void;
  (e: "update:pageSize", pageSize: number): void;
}>();

// data
const pageCountOptions = [1, 5, 10, 20, 50];

// state
const pageNum = ref(1);
const pageSize = ref(10);

// watches
watch(pageSize, () => {
  emits("update:pageSize", pageSize.value);
});
watch(pageNum, async () => {
  emits("update:pageNum", pageNum.value);
});
</script>
<template>
  <div>
    <!-- change pageSize -->
    <UFormField
      label="عدد الصفوف لكل صفحة"
      name="pageSize"
      class="flex items-center gap-2 mb-2"
    >
      <USelect v-model="pageSize" :items="pageCountOptions" id="pageSize" />
    </UFormField>
    <!-- default slot -->
    <slot></slot>
    <!-- pagination tools -->
    <div class="flex justify-between items-center mt-4">
      <!-- زر السابق -->
      <UButton
        :disabled="pageNum === 1"
        @click="pageNum--"
        color="secondary"
        class="px-4 py-2 text-white rounded hover:cursor-pointer disabled:bg-gray-300 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
        label="السابق"
      />

      <!-- عرض رقم الصفحة الحالية وعدد الصفحات -->
      <!-- <span> صفحة {{ pageNum }} من {{ totalPages }} </span> -->
      <!-- أرقام الصفحات -->
      <div class="flex gap-2">
        <UButton
          color="secondary"
          :variant="pageNum === p ? 'solid' : 'outline'"
          v-for="p in props.totalPages"
          :key="p"
          @click="pageNum = p"
          :class="['px-3 py-1 rounded hover:cursor-pointer']"
        >
          {{ p }}
        </UButton>
      </div>

      <!-- زر التالي -->
      <UButton
        :disabled="pageNum >= totalPages"
        @click="pageNum++"
        color="secondary"
        class="px-4 py-2 text-white rounded hover:cursor-pointer disabled:bg-gray-300 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
        label="التالي"
      />
    </div>
  </div>
</template>

<style scoped></style>
