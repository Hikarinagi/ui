<script lang="ts">
  export interface RovingFocusItemProps extends PrimitiveProps {
    tabStopId?: string
    focusable?: boolean
    active?: boolean
    allowShiftKey?: boolean
  }
</script>

<script setup lang="ts">
  import { computed, nextTick, onMounted, onUnmounted, watch } from 'vue'
  import {
    focusFirstCandidate,
    getFocusIntent,
    wrapArray,
  } from '../../../../shared/src/primitives/roving-focus'
  import { useCollection } from '../collection'
  import { Primitive, type PrimitiveProps } from '../primitive'
  import { useId } from '../utils/useId'
  import { injectRovingFocusGroupContext } from './context'

  const props = withDefaults(defineProps<RovingFocusItemProps>(), {
    focusable: true,
    as: 'span',
  })
  const context = injectRovingFocusGroupContext()
  const randomId = useId()
  const id = computed(() => props.tabStopId || randomId)
  const isCurrentTabStop = computed(() => context.currentTabStopId.value === id.value)
  const { getItems, CollectionItem } = useCollection()

  onMounted(() => {
    if (props.focusable) context.onFocusableItemAdd()
  })
  onUnmounted(() => {
    if (props.focusable) context.onFocusableItemRemove()
  })
  watch(
    () => props.focusable,
    (value, previous) => {
      if (value === previous) return
      if (value) context.onFocusableItemAdd()
      else context.onFocusableItemRemove()
    },
  )

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Tab' && event.shiftKey) {
      context.onItemShiftTab()
      return
    }
    if (event.target !== event.currentTarget) return
    const focusIntent = getFocusIntent(event, context.orientation.value, context.dir.value)
    if (focusIntent === undefined) return
    if (
      event.metaKey ||
      event.ctrlKey ||
      event.altKey ||
      (props.allowShiftKey ? false : event.shiftKey)
    )
      return
    event.preventDefault()
    let candidates = getItems()
      .map(item => item.ref)
      .filter(item => item.dataset.disabled !== '')
    if (focusIntent === 'last') candidates.reverse()
    else if (focusIntent === 'prev' || focusIntent === 'next') {
      if (focusIntent === 'prev') candidates.reverse()
      const currentIndex = candidates.indexOf(event.currentTarget as HTMLElement)
      candidates = context.loop.value
        ? wrapArray(candidates, currentIndex + 1)
        : candidates.slice(currentIndex + 1)
    }
    void nextTick(() => focusFirstCandidate(candidates))
  }
</script>

<template>
  <CollectionItem>
    <Primitive
      :tabindex="isCurrentTabStop ? 0 : -1"
      :data-orientation="context.orientation.value"
      :data-active="active ? '' : undefined"
      :data-disabled="!focusable ? '' : undefined"
      :as="as"
      :as-child="asChild"
      @mousedown="
        (event: MouseEvent) => {
          if (!focusable) event.preventDefault()
          else context.onItemFocus(id)
        }
      "
      @focus="context.onItemFocus(id)"
      @keydown="handleKeydown"
    >
      <slot />
    </Primitive>
  </CollectionItem>
</template>
