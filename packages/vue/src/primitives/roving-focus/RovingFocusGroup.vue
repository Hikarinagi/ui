<script lang="ts">
  export interface RovingFocusGroupProps extends PrimitiveProps {
    orientation?: Orientation
    dir?: Direction
    loop?: boolean
    currentTabStopId?: string | null
    defaultCurrentTabStopId?: string
    preventScrollOnEntryFocus?: boolean
  }

  export type RovingFocusGroupEmits = {
    entryFocus: [event: Event]
    'update:currentTabStopId': [value: string | null | undefined]
  }
</script>

<script setup lang="ts">
  import { ref, toRefs } from 'vue'
  import {
    ENTRY_FOCUS,
    ENTRY_FOCUS_OPTIONS,
    focusFirstCandidate,
    type Orientation,
  } from '../../../../shared/src/primitives/roving-focus'
  import { useCollection } from '../collection'
  import { Primitive, type PrimitiveProps } from '../primitive'
  import { useDirection, type Direction } from '../utils/useDirection'
  import { useVModel } from '../utils/useVModel'
  import { provideRovingFocusGroupContext } from './context'

  const props = withDefaults(defineProps<RovingFocusGroupProps>(), {
    orientation: undefined,
    loop: false,
    preventScrollOnEntryFocus: false,
  })
  const emits = defineEmits<RovingFocusGroupEmits>()
  const { loop, orientation, dir: propDir } = toRefs(props)
  const dir = useDirection(propDir)
  const currentTabStopId = useVModel(
    props,
    'currentTabStopId',
    (_, value) => emits('update:currentTabStopId', value),
    {
      defaultValue: props.defaultCurrentTabStopId,
      passive: props.currentTabStopId === undefined,
    },
  )
  const isTabbingBackOut = ref(false)
  const isClickFocus = ref(false)
  const focusableItemsCount = ref(0)
  const { getItems, CollectionSlot } = useCollection({ isProvider: true })

  function handleFocus(event: FocusEvent) {
    const isKeyboardFocus = !isClickFocus.value
    if (
      event.currentTarget &&
      event.target === event.currentTarget &&
      isKeyboardFocus &&
      !isTabbingBackOut.value
    ) {
      const entryFocusEvent = new CustomEvent(ENTRY_FOCUS, ENTRY_FOCUS_OPTIONS)
      event.currentTarget.dispatchEvent(entryFocusEvent)
      emits('entryFocus', entryFocusEvent)
      if (!entryFocusEvent.defaultPrevented) {
        const items = getItems()
          .map(item => item.ref)
          .filter(item => item.dataset.disabled !== '')
        const activeItem = items.find(item => item.getAttribute('data-active') === '')
        const highlightedItem = items.find(item => item.getAttribute('data-highlighted') === '')
        const currentItem = items.find(item => item.id === currentTabStopId.value)
        const candidates = [activeItem, highlightedItem, currentItem, ...items].filter(
          (item): item is HTMLElement => !!item,
        )
        focusFirstCandidate(candidates, props.preventScrollOnEntryFocus)
      }
    }
    isClickFocus.value = false
  }

  function handleMouseUp() {
    setTimeout(() => {
      isClickFocus.value = false
    }, 1)
  }

  defineExpose({ getItems })

  provideRovingFocusGroupContext({
    loop,
    dir,
    orientation,
    currentTabStopId,
    onItemFocus: tabStopId => {
      currentTabStopId.value = tabStopId
    },
    onItemShiftTab: () => {
      isTabbingBackOut.value = true
    },
    onFocusableItemAdd: () => {
      focusableItemsCount.value++
    },
    onFocusableItemRemove: () => {
      focusableItemsCount.value--
    },
  })
</script>

<template>
  <CollectionSlot>
    <Primitive
      :tabindex="isTabbingBackOut || focusableItemsCount === 0 ? -1 : 0"
      :data-orientation="orientation"
      :as="as"
      :as-child="asChild"
      :dir="dir"
      style="outline: none"
      @mousedown="isClickFocus = true"
      @mouseup="handleMouseUp"
      @focus="handleFocus"
      @blur="isTabbingBackOut = false"
    >
      <slot />
    </Primitive>
  </CollectionSlot>
</template>
