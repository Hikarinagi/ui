<script setup lang="ts" generic="T extends SelectOption = SelectOption">
  import { useUiLocale } from '../../locale'
  import { useVirtualChoices } from '../../lib/reka/useVirtualChoices'
  import type { VirtualizeOptions } from '../../lib/virtual/types'
  import ScrollArea from '../scroll-area/ScrollArea.vue'
  import { selectEmpty, selectLabel } from '../select/select.variants'
  import type { SelectItems, SelectOption } from '../select/types'
  import { virtualListContent, virtualListItem } from './virtual-list.variants'

  defineOptions({ name: 'HnVirtualChoices', inheritAttrs: false })
  const props = defineProps<{
    options: SelectItems<T>
    kind: 'select' | 'combobox' | 'listbox'
    virtualize?: VirtualizeOptions
    input?: HTMLElement
    class?: string
    padded?: boolean
    maxHeight?: string | number
  }>()
  const t = useUiLocale()
  const { area, body, rows, entries, bodyStyle, measure, itemAttrs, labelId } =
    useVirtualChoices(props)
  defineSlots<{
    default(props: { option: T; attrs: ReturnType<typeof itemAttrs> }): unknown
    empty?(): unknown
  }>()
</script>

<template>
  <ScrollArea
    ref="area"
    :class="props.class"
    :style="{
      maxHeight: typeof props.maxHeight === 'number' ? `${props.maxHeight}px` : props.maxHeight,
    }"
  >
    <div :class="props.padded === false ? undefined : 'p-1'">
      <div
        ref="body"
        v-bind="$attrs"
        data-hn-virtual-choices
        :class="virtualListContent({ orientation: 'vertical' })"
        :style="bodyStyle"
      >
        <div
          v-for="entry in entries"
          :key="entry.key"
          :ref="measure"
          :data-index="entry.index"
          role="presentation"
          :class="virtualListItem({ orientation: 'vertical' })"
          :style="{ marginBlockStart: `${entry.gapBefore}px` }"
        >
          <slot
            v-if="rows[entry.index]!.option"
            :option="rows[entry.index]!.option!"
            :attrs="itemAttrs(entry.index)"
          />
          <div v-else :id="labelId(entry.index)" :class="selectLabel()">
            {{ rows[entry.index]!.label }}
          </div>
        </div>
      </div>
      <div v-if="!rows.length" :class="selectEmpty()">
        <slot name="empty">{{ t.select.empty }}</slot>
      </div>
    </div>
  </ScrollArea>
</template>
