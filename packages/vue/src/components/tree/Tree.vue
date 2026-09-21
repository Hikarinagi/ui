<script setup lang="ts">
  import { TreeItem, TreeRoot } from 'reka-ui'
  import { cn } from '../../lib/cn'
  import { useUiLocale } from '../../locale'
  import { useFieldControl } from '../form-field/context'
  import DisclosureIcon from '../disclosure-icon/DisclosureIcon.vue'
  import TreeCheck from './TreeCheck.vue'
  import TreeRows from './TreeRows.vue'
  import type { VirtualizeOptions } from '../../lib/virtual/types'
  import { useTree } from './composables/useTree'
  import { tree, treeEmpty, treeRow, treeToggle } from './tree.variants'
  import type { TreeNode, TreeNodeSlot, TreeValue } from './types'

  defineOptions({ name: 'HnTree', inheritAttrs: false })
  const props = withDefaults(
    defineProps<{
      items: TreeNode[]
      multiple?: boolean
      defaultExpanded?: TreeValue[]
      disabled?: boolean
      invalid?: boolean
      virtualize?: VirtualizeOptions
      maxHeight?: string | number
      class?: string
    }>(),
    { defaultExpanded: () => [], maxHeight: 320 },
  )
  const model = defineModel<TreeValue | TreeValue[] | null>()
  const expandedModel = defineModel<TreeValue[]>('expanded')
  defineSlots<{
    node?(props: TreeNodeSlot): unknown
    trailing?(props: TreeNodeSlot): unknown
    empty?(): unknown
  }>()
  const t = useUiLocale()
  const { id, labelledBy, describedBy, disabled, invalid } = useFieldControl({
    disabled: () => props.disabled,
    invalid: () => props.invalid,
  })
  const { selected, expanded, key, getChildren, state, select, toggle, keepRowClick } = useTree(
    props,
    model,
    expandedModel,
    disabled,
  )
</script>

<template>
  <div
    v-if="props.items.length === 0"
    v-bind="$attrs"
    :id="id"
    role="status"
    :aria-labelledby="labelledBy"
    :aria-describedby="describedBy"
    data-hn-tree
    :class="cn(treeEmpty(), props.class)"
  >
    <slot name="empty">{{ t.tree.empty }}</slot>
  </div>
  <TreeRoot
    v-else
    v-bind="$attrs"
    :id="id"
    v-slot="{ flattenItems }"
    v-model:expanded="expanded"
    :items="props.items"
    :as="props.virtualize ? 'div' : 'ul'"
    :get-key="key"
    :get-children="getChildren"
    :model-value="props.multiple ? selected : selected[0]"
    :multiple="props.multiple"
    :disabled="disabled"
    :aria-labelledby="labelledBy"
    :aria-describedby="describedBy"
    :aria-invalid="invalid || undefined"
    :aria-disabled="disabled || undefined"
    data-hn-tree
    :data-disabled="disabled ? '' : undefined"
    :data-invalid="invalid ? '' : undefined"
    :class="cn(tree(), props.class)"
  >
    <TreeRows
      :items="flattenItems"
      :virtualize="props.virtualize"
      :max-height="props.virtualize ? props.maxHeight : undefined"
      :disabled="node => state(node).disabled"
      v-slot="{ item }"
    >
      <TreeItem
        :key="item._id"
        v-slot="{ isExpanded }"
        v-bind="item.bind"
        :disabled="state(item.value).disabled"
        as-child
        @select="select"
        @toggle="keepRowClick"
      >
        <component
          :is="props.virtualize ? 'div' : 'li'"
          :aria-selected="props.multiple ? undefined : state(item.value).selected"
          :aria-checked="
            props.multiple
              ? state(item.value).indeterminate
                ? 'mixed'
                : state(item.value).selected
              : undefined
          "
          :style="{ '--hn-tree-level': item.level - 1 }"
          :class="treeRow()"
        >
          <span
            v-if="item.hasChildren"
            :class="treeToggle()"
            aria-hidden="true"
            data-hn-tree-toggle
            @click.stop="toggle(item.value)"
          >
            <DisclosureIcon direction="end" :open="isExpanded" />
          </span>
          <span v-else class="size-5 shrink-0" aria-hidden="true" />
          <TreeCheck
            v-if="props.multiple"
            :selected="state(item.value).selected"
            :indeterminate="state(item.value).indeterminate"
          />
          <span class="min-w-0 flex-1">
            <slot name="node" :node="item.value" :expanded="isExpanded" v-bind="state(item.value)">
              <span class="block truncate">{{ item.value.label }}</span>
              <span v-if="item.value.description" class="text-muted block truncate text-xs">
                {{ item.value.description }}
              </span>
            </slot>
          </span>
          <slot
            name="trailing"
            :node="item.value"
            :expanded="isExpanded"
            v-bind="state(item.value)"
          />
        </component>
      </TreeItem>
    </TreeRows>
  </TreeRoot>
</template>
