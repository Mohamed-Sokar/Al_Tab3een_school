<script setup lang="ts">
import type { PropType, Ref } from "vue";
import { h, resolveComponent } from "vue";
import type { TableRow } from "@nuxt/ui";
import { getPaginationRowModel } from "@tanstack/vue-table";
import upperFirst from "lodash/upperFirst";

const UCheckbox = resolveComponent("UCheckbox");
// If DropdownMenuItem is a type from your UI library, import it here. Otherwise, define a placeholder type:
type DropdownMenuItem = any;

const props = defineProps({
  data: {
    type: Array as PropType<any[]>,
    required: true,
  },
  key: {
    type: [String, Number],
    required: true,
  },
  loading: {
    type: Boolean,
    required: true,
  },
  globalFilter: {
    type: String,
    required: false,
  },
  rowSelection: {
    type: Object as PropType<Record<string, boolean> | undefined>,
    required: false,
  },
  ref: {
    type: Object as PropType<Ref<any>>,
    required: false,
  },
  columns: {
    type: Array as PropType<any[]>,
    required: true,
  },
  expanded: {
    type: Boolean,
    required: false,
  },
  getDropdownActions: {
    type: Function as PropType<
      (row: any) => DropdownMenuItem[][] | DropdownMenuItem[]
    >,
    required: false,
  },
});

const table = useTemplateRef("table");
const emit = defineEmits([
  "update:globalFilter",
  "update:rowSelection",
  "update:pagination",
]);
const newColumns = computed(() => [
  {
    id: "select",
    header: ({ table }: { table: any }) =>
      h(UCheckbox, {
        color: "secondary",
        modelValue: table.getIsSomePageRowsSelected()
          ? "indeterminate"
          : table.getIsAllPageRowsSelected(),
        "onUpdate:modelValue": (value: boolean | "indeterminate") =>
          table.toggleAllPageRowsSelected(!!value),
        "aria-label": "Select all",
      }),

    cell: ({ row }: { row: any }) =>
      h(UCheckbox, {
        color: "secondary",
        modelValue: row.getIsSelected(),
        "onUpdate:modelValue": (value: boolean | "indeterminate") =>
          row.toggleSelected(!!value),
        "aria-label": "Select row",
      }),
  },
  ...props.columns,
]);

function onSelect(row: TableRow<any>, e?: Event) {
  /* If you decide to also select the column you can do this  */
  row.toggleSelected(!row.getIsSelected());
}
const columnVisibility = ref({
  id: false,
});
// watch(columnVisibility, () => console.log(columnVisibility.value));
</script>

<template>
  <div class="flex flex-col flex-1 w-full">
    <!-- {{ table?.tableApi?.getAllColumns()[1].columnDef.header }} -->
    <div class="flex items-center justify-between gap-2">
      <!-- columns choice -->
      <div class="flex justify-start self-end">
        <UDropdownMenu
          :items="
          table?.tableApi
            ?.getAllColumns()
            .filter((column) => column.getCanHide())
            .map((column) => ({
              label: upperFirst(column.id),
              type: 'checkbox' as const,
              checked: column.getIsVisible(),
              onUpdateChecked(checked: boolean) {
                table?.tableApi?.getColumn(column.id)?.toggleVisibility(!!checked)
              },
              onSelect(e?: Event) {
                e?.preventDefault()
              }
            }))
        "
          :content="{ align: 'end' }"
        >
          <UButton
            label="الأعمدة"
            color="neutral"
            variant="outline"
            trailing-icon="i-lucide-chevron-down"
          />
        </UDropdownMenu>
      </div>

      <TransitionGroup :duration="300" mode="out-in" name="fade">
        <slot name="actions"></slot>
      </TransitionGroup>
    </div>
    <UTable
      ref="table"
      :loading="loading"
      :key="key"
      :global-filter="globalFilter"
      @update:global-filter="(value) => emit('update:globalFilter', value)"
      :row-selection="props.rowSelection"
      @update:row-selection="(value) => emit('update:rowSelection', value)"
      v-model:column-visibility="columnVisibility"
      @select="onSelect"
      :data="data"
      :columns="newColumns"
      class="border border-accented rounded-tr-md rounded-tl-md mt-3"
    >
      <template #action-cell="{ row }">
        <slot name="action-cell" :row="row">
          <UDropdownMenu
            :items="getDropdownActions ? getDropdownActions(row.original) : []"
          >
            <UButton
              icon="i-lucide-ellipsis-vertical"
              color="neutral"
              variant="soft"
              aria-label="Actions"
              class="p-2"
            />
          </UDropdownMenu>
        </slot>
      </template>
      <template #expanded="{ row }" v-if="expanded">
        <pre>{{ row.original }}</pre>
      </template>
    </UTable>
    <div class="px-4 py-3.5 border-accented text-sm text-muted">
      {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length || 0 }} من
      {{ table?.tableApi?.getFilteredRowModel().rows.length || 0 }} صف محدد
    </div>
  </div>
</template>

<style scoped></style>
