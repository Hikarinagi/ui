<script setup lang="ts" generic="T extends SelectOption = SelectOption">
  import { computed } from 'vue'
  import { cn } from '../../lib/cn'
  import { useUiLocale } from '../../locale'
  import { useVirtualChoices } from '../../lib/reka/useVirtualChoices'
  import type { VirtualizeOptions } from '../../lib/virtual/types'
  import ScrollArea from '../scroll-area/ScrollArea.vue'
  import { selectEmpty, selectLabel } from '../select/select.variants'
  import type { SelectItems, SelectOption, SelectOptionGroup } from '../select/types'
  import {
    virtualChoiceHeading,
    virtualChoiceHeadings,
    virtualListContent,
    virtualListItem,
  } from './virtual-list.variants'

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
  const slots = defineSlots<{
    default(props: { option: T; attrs: ReturnType<typeof itemAttrs> }): unknown
    group?(props: { group: SelectOptionGroup<T> }): unknown
    empty?(): unknown
  }>()
  const held = (index: number) => !!slots.group && !rows.value[index]!.option
  const origin = computed(() =>
    entries.value[0] ? entries.value[0].start - parseFloat(bodyStyle.value.paddingBlockStart) : 0,
  )
</script>

<template>
  <ScrollArea
    ref="area"
    :class="props.class"
    :style="{
      maxHeight: typeof props.maxHeight === 'number' ? `${props.maxHeight}px` : props.maxHeight,
    }"
  >
    <div :class="cn(slots.group && 'relative', props.padded !== false && 'p-1') || undefined">
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
          :ref="held(entry.index) ? undefined : measure"
          :data-index="entry.index"
          role="presentation"
          :class="virtualListItem({ orientation: 'vertical' })"
          :style="{
            marginBlockStart: `${entry.gapBefore}px`,
            height: held(entry.index) ? `${entry.size}px` : undefined,
          }"
        >
          <slot
            v-if="rows[entry.index]!.option"
            :option="rows[entry.index]!.option!"
            :attrs="itemAttrs(entry.index)"
          />
          <span v-else-if="slots.group" :id="labelId(entry.index)" hidden>
            {{ rows[entry.index]!.label }}
          </span>
          <div v-else :id="labelId(entry.index)" :class="selectLabel()">
            {{ rows[entry.index]!.label }}
          </div>
        </div>
      </div>
      <div v-if="!rows.length" :class="selectEmpty()">
        <slot name="empty">{{ t.select.empty }}</slot>
      </div>
      <div v-else-if="slots.group" :class="virtualChoiceHeadings()">
        <div class="relative">
          <template v-for="entry in entries" :key="entry.key">
            <div
              v-if="rows[entry.index]!.source"
              :ref="measure"
              :data-index="entry.index"
              :class="virtualChoiceHeading()"
              :style="{ top: `${entry.start - origin}px` }"
            >
              <slot name="group" :group="rows[entry.index]!.source!" />
            </div>
          </template>
        </div>
      </div>
    </div>
  </ScrollArea>
</template>
