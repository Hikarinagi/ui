<script setup lang="ts">
  import { computed, nextTick, shallowRef, watch } from 'vue'
  import { cn } from '../../lib/cn'
  import { useDirection } from '../../lib/useDirection'
  import { useUiLocale } from '../../locale'
  import Button from '../button/Button.vue'
  import ButtonGroup from '../button-group/ButtonGroup.vue'
  import DisclosureIcon from '../disclosure-icon/DisclosureIcon.vue'
  import DropdownMenu from '../dropdown-menu/DropdownMenu.vue'
  import { splitButton, splitButtonAction } from './split-button.variants'
  import type { SplitButtonProps } from './types'

  defineOptions({ name: 'HnSplitButton', inheritAttrs: false })
  const props = withDefaults(defineProps<SplitButtonProps>(), {
    as: 'button',
    type: 'button',
    variant: 'solid',
    tone: 'accent',
    ripple: true,
    modal: true,
    side: 'bottom',
    align: 'end',
    sideOffset: 8,
  })
  const open = defineModel<boolean>('open', { default: false })
  const emit = defineEmits<{ click: [event: MouseEvent] }>()
  defineSlots<{
    default(): unknown
    icon?(): unknown
    trailing?(): unknown
    content(props: { close: () => void }): unknown
  }>()
  const t = useUiLocale()
  const group = shallowRef<InstanceType<typeof ButtonGroup>>()
  const action = shallowRef<InstanceType<typeof Button>>()
  const trigger = shallowRef<InstanceType<typeof Button>>()
  const { root, direction, rootDirection } = useDirection(() => props.dir)
  watch(group, instance => {
    root.value = instance?.$el
  })
  const primaryBlocked = computed(() => props.disabled || props.loading || props.primaryDisabled)
  const menuBlocked = computed(() => props.disabled || props.loading || props.menuDisabled)
  const menuOpen = computed({
    get: () => open.value && !menuBlocked.value,
    set: value => {
      open.value = value && !menuBlocked.value
    },
  })
  watch(
    [open, menuBlocked],
    ([isOpen, blocked]) => {
      if (isOpen && blocked) open.value = false
    },
    { immediate: true },
  )

  function focus() {
    if (!primaryBlocked.value)
      (action.value?.$el as HTMLElement | undefined)?.focus({ preventScroll: true })
  }
  async function openMenu() {
    if (menuBlocked.value) return
    ;(trigger.value?.$el as HTMLElement | undefined)?.focus({ preventScroll: true })
    await nextTick()
    if (!menuBlocked.value) menuOpen.value = true
  }
  function closeMenu() {
    menuOpen.value = false
  }
  function onKeydown(event: KeyboardEvent) {
    if (
      event.defaultPrevented ||
      event.isComposing ||
      event.key !== 'ArrowDown' ||
      menuBlocked.value
    )
      return
    event.preventDefault()
    void openMenu()
  }
  defineExpose({ focus, openMenu, closeMenu })
</script>

<template>
  <ButtonGroup
    ref="group"
    :label="props.label"
    :dir="rootDirection"
    :divider="props.variant !== 'outline'"
    :class="cn(splitButton({ block: props.block }), props.class)"
    :style="props.style"
    data-hn-split-button
    :aria-busy="props.loading || undefined"
  >
    <Button
      ref="action"
      v-bind="$attrs"
      data-hn-split-action
      :as="props.as"
      :type="props.type"
      :variant="props.variant"
      :tone="props.tone"
      :size="props.size"
      :pill="props.pill"
      :ripple="props.ripple"
      :loading="props.loading"
      :disabled="primaryBlocked"
      :class="splitButtonAction()"
      @click="emit('click', $event)"
      @keydown="onKeydown"
    >
      <template v-if="$slots.icon" #icon><slot name="icon" /></template>
      <span class="min-w-0 truncate"><slot /></span>
      <template v-if="$slots.trailing" #trailing><slot name="trailing" /></template>
    </Button>
    <DropdownMenu
      v-model:open="menuOpen"
      :anchor="root"
      :label="props.menuLabel ?? t.splitButton.more"
      :modal="props.modal"
      :dir="direction"
      :side="props.side"
      :align="props.align"
      :side-offset="props.sideOffset"
      :class="props.menuClass"
    >
      <Button
        ref="trigger"
        data-hn-split-trigger
        type="button"
        icon-only
        :variant="props.variant"
        :tone="props.tone"
        :size="props.size"
        :pill="props.pill"
        :ripple="props.ripple"
        :disabled="menuBlocked"
        :aria-label="props.menuLabel ?? t.splitButton.more"
      >
        <DisclosureIcon :open="menuOpen" />
      </Button>
      <template #content><slot name="content" :close="closeMenu" /></template>
    </DropdownMenu>
  </ButtonGroup>
</template>
