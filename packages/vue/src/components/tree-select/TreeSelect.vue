<script setup lang="ts">
  import { useId } from 'vue'
  import { Check } from '@lucide/vue'
  import {
    PopoverContent,
    PopoverPortal,
    PopoverRoot,
    PopoverTrigger,
    TreeItem,
    TreeRoot,
  } from 'reka-ui'
  import { cn } from '../../lib/cn'
  import { rekaPopoverStyle } from '../../lib/reka/styles'
  import { useUiLocale } from '../../locale'
  import Card from '../card/Card.vue'
  import DisclosureIcon from '../disclosure-icon/DisclosureIcon.vue'
  import { useFieldControl } from '../form-field/context'
  import { injectInputGroup } from '../input-group/context'
  import {
    inputAdornment,
    inputEmbedded,
    inputHost,
    type InputVariants,
  } from '../input/input.variants'
  import TreeRows from '../tree/TreeRows.vue'
  import type { VirtualizeOptions } from '../../lib/virtual/types'
  import { selectEmpty, selectTrigger } from '../select/select.variants'
  import {
    treeSelectContent,
    treeSelectList,
    treeSelectRow,
    treeSelectToggle,
  } from './tree-select.variants'
  import type { TreeSelectNode } from './types'
  import TreeSelectSearch from './TreeSelectSearch.vue'
  import { useTreeSelect } from './composables/useTreeSelect'

  defineOptions({ name: 'HnTreeSelect', inheritAttrs: false })

  const props = withDefaults(
    defineProps<{
      items: TreeSelectNode[]
      placeholder?: string
      searchable?: boolean
      searchPlaceholder?: string
      defaultExpanded?: Array<string | number>
      variant?: InputVariants['variant']
      size?: InputVariants['size']
      disabled?: boolean
      invalid?: boolean
      virtualize?: VirtualizeOptions
      class?: string
    }>(),
    { defaultExpanded: () => [] },
  )

  const model = defineModel<string | number | null>()
  const open = defineModel<boolean>('open', { default: false })
  const search = defineModel<string>('search', { default: '' })
  const treeId = useId()
  const triggerId = useId()

  defineSlots<{ node(props: { node: TreeSelectNode }): unknown }>()

  const t = useUiLocale()
  const group = injectInputGroup()

  const {
    id: fieldId,
    invalid,
    disabled,
    describedBy,
    labelledBy,
  } = useFieldControl({
    invalid: () => props.invalid || !!group?.invalid.value,
    disabled: () => props.disabled || !!group?.disabled.value,
  })
  const {
    selected,
    items,
    expanded,
    input,
    tree,
    rows,
    getChildren,
    key,
    choose,
    keepRowClick,
    focusSearch,
    clearSearch,
    onEscape,
    onSearchKeydown,
    onTreeKeydown,
  } = useTreeSelect(props, model, open, search)
</script>

<template>
  <PopoverRoot v-model:open="open" modal>
    <PopoverTrigger as-child>
      <button
        type="button"
        v-bind="$attrs"
        :id="fieldId ?? triggerId"
        :aria-describedby="describedBy"
        data-hn-tree-select
        role="combobox"
        :aria-expanded="open"
        :disabled="disabled"
        :data-placeholder="selected ? undefined : ''"
        :data-invalid="invalid ? '' : undefined"
        :data-disabled="disabled ? '' : undefined"
        :aria-invalid="invalid || undefined"
        :class="
          cn(
            group ? inputEmbedded() : inputHost({ variant: props.variant, size: props.size }),
            selectTrigger(),
            props.class,
          )
        "
      >
        <span class="min-w-0 flex-1 truncate">
          {{ selected ? selected.label : (props.placeholder ?? t.select.placeholder) }}
        </span>
        <span :class="inputAdornment()">
          <DisclosureIcon />
        </span>
      </button>
    </PopoverTrigger>
    <PopoverPortal>
      <PopoverContent
        as-child
        align="start"
        :side-offset="8"
        @open-auto-focus="focusSearch"
        @escape-key-down="onEscape"
      >
        <Card
          :padded="false"
          data-hn-tree-select-content
          :aria-label="$attrs['aria-label'] as string | undefined"
          :aria-labelledby="
            labelledBy ?? ($attrs['aria-label'] ? undefined : (fieldId ?? triggerId))
          "
          :class="treeSelectContent()"
          :style="rekaPopoverStyle"
        >
          <TreeSelectSearch
            v-if="props.searchable"
            ref="input"
            v-model="search"
            :placeholder="props.searchPlaceholder ?? t.treeSelect.search"
            :controls="treeId"
            @clear="clearSearch"
            @keydown="onSearchKeydown"
          />
          <TreeRoot
            as="div"
            :id="treeId"
            ref="tree"
            v-slot="{ flattenItems }"
            v-model:expanded="expanded"
            :items="items"
            :get-key="key"
            :get-children="getChildren"
            :model-value="selected"
            :aria-label="$attrs['aria-label'] as string | undefined"
            :aria-labelledby="labelledBy"
            class="flex flex-col p-1 outline-none"
            @update:model-value="choose"
            @keydown.capture="onTreeKeydown"
          >
            <TreeRows
              ref="rows"
              :items="flattenItems"
              :virtualize="props.virtualize"
              initial-scroll-to-selected
              scrollable
              :class="treeSelectList()"
            >
              <template #default="{ item }">
                <TreeItem
                  as="div"
                  v-slot="{ isExpanded, isSelected, handleToggle }"
                  :key="item._id"
                  v-bind="item.bind"
                  :value="item.value"
                  :level="item.level"
                  :disabled="item.value.disabled"
                  :class="treeSelectRow()"
                  :style="{ paddingInlineStart: `calc(0.375rem + ${(item.level - 1) * 1.25}rem)` }"
                  @toggle="keepRowClick"
                >
                  <span
                    v-if="item.hasChildren"
                    :class="treeSelectToggle()"
                    @click.stop="handleToggle()"
                  >
                    <DisclosureIcon direction="end" :open="isExpanded" />
                  </span>
                  <span v-else class="size-5 shrink-0" />
                  <span class="min-w-0 flex-1">
                    <slot name="node" :node="item.value">
                      <span class="block truncate">{{ item.value.label }}</span>
                      <span v-if="item.value.description" class="text-muted block truncate text-xs">
                        {{ item.value.description }}
                      </span>
                    </slot>
                  </span>
                  <span class="flex size-4 shrink-0 items-center justify-center">
                    <Check v-if="isSelected" />
                  </span>
                </TreeItem>
              </template>
              <template #empty>
                <div role="none" :class="selectEmpty()">
                  <span role="status">{{ t.select.empty }}</span>
                </div>
              </template>
            </TreeRows>
          </TreeRoot>
        </Card>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
