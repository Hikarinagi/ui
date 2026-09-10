<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
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
  import ScrollArea from '../scroll-area/ScrollArea.vue'
  import { selectEmpty, selectTrigger } from '../select/select.variants'
  import {
    treeSelectContent,
    treeSelectList,
    treeSelectRow,
    treeSelectToggle,
  } from './tree-select.variants'
  import { findNode, pathTo, type TreeSelectNode } from './types'

  defineOptions({ name: 'HnTreeSelect', inheritAttrs: false })

  const props = withDefaults(
    defineProps<{
      items: TreeSelectNode[]
      placeholder?: string
      defaultExpanded?: Array<string | number>
      variant?: InputVariants['variant']
      size?: InputVariants['size']
      disabled?: boolean
      invalid?: boolean
      class?: string
    }>(),
    { defaultExpanded: () => [] },
  )

  const model = defineModel<string | number | null>()
  const open = defineModel<boolean>('open', { default: false })

  defineSlots<{ node(props: { node: TreeSelectNode }): unknown }>()

  const t = useUiLocale()
  const group = injectInputGroup()

  const {
    id: fieldId,
    invalid,
    disabled,
    describedBy,
  } = useFieldControl({
    invalid: () => props.invalid || !!group?.invalid.value,
    disabled: () => props.disabled || !!group?.disabled.value,
  })
  const selected = computed(() => findNode(props.items, model.value))
  const expanded = ref<string[]>([])

  watch(
    open,
    isOpen => {
      if (!isOpen) return
      const path = pathTo(props.items, model.value) ?? []
      expanded.value = Array.from(
        new Set([...props.defaultExpanded, ...path].map(value => String(value))),
      )
    },
    { immediate: true },
  )

  function key(node: TreeSelectNode) {
    return String(node.value)
  }

  function choose(node: TreeSelectNode | undefined) {
    if (!node || node.disabled) return
    model.value = node.value
    open.value = false
  }

  function keepRowClick(event: CustomEvent<{ originalEvent: Event }>) {
    if (event.detail.originalEvent.type === 'click') event.preventDefault()
  }
</script>

<template>
  <PopoverRoot v-model:open="open" modal>
    <PopoverTrigger
      v-bind="$attrs"
      :id="fieldId"
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
    </PopoverTrigger>
    <PopoverPortal>
      <PopoverContent as-child align="start" :side-offset="8">
        <Card :padded="false" data-hn-tree-select-content :class="treeSelectContent()">
          <ScrollArea :class="treeSelectList()">
            <TreeRoot
              v-slot="{ flattenItems }"
              v-model:expanded="expanded"
              :items="props.items"
              :get-key="key"
              :get-children="node => node.children"
              :model-value="selected"
              class="flex flex-col p-1 outline-none"
              @update:model-value="choose"
            >
              <TreeItem
                v-for="item in flattenItems"
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
              <div v-if="props.items.length === 0" :class="selectEmpty()">{{ t.select.empty }}</div>
            </TreeRoot>
          </ScrollArea>
        </Card>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
