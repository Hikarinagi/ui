<script setup lang="ts">
  import { computed, useSlots } from 'vue'
  import { Primitive, type PrimitiveProps } from 'reka-ui'
  import { cn } from '../../lib/cn'
  import { devWarn } from '../../lib/dev'
  import { useUiLocale } from '../../locale'
  import Ripple from '../ripple/Ripple.vue'
  import CloseButton from '../close-button/CloseButton.vue'
  import IconSlot from './IconSlot.vue'
  import { useChipRoot } from './composables/useChipRoot'
  import { chip, chipRemove, type ChipVariants } from './chip.variants'

  defineOptions({ name: 'HnChip' })

  const props = withDefaults(
    defineProps<
      PrimitiveProps & {
        variant?: ChipVariants['variant']
        tone?: ChipVariants['tone']
        size?: ChipVariants['size']
        selectable?: boolean
        removable?: boolean
        disabled?: boolean
        ripple?: boolean
        class?: string
      }
    >(),
    { ripple: true },
  )

  const selected = defineModel<boolean>('selected', { default: false })

  const emit = defineEmits<{ remove: [] }>()

  const slots = useSlots()
  const t = useUiLocale()

  if (props.selectable && props.removable) {
    devWarn('Chip', 'selectable 与 removable 不能同时使用，removable 已忽略')
  }

  const { tag, interactive, attrs } = useChipRoot(props)
  const removable = computed(() => props.removable && !props.selectable)
  const showCheck = computed(() => props.selectable && selected.value)

  function guard(event: MouseEvent) {
    if (!props.disabled) return
    event.preventDefault()
    event.stopImmediatePropagation()
  }

  function toggle() {
    if (props.selectable) selected.value = !selected.value
  }

  function onRemoveKeydown(event: KeyboardEvent) {
    if (event.key !== 'Backspace' && event.key !== 'Delete') return
    event.preventDefault()
    emit('remove')
  }
</script>

<template>
  <Primitive
    :as="tag"
    :as-child="props.asChild"
    v-bind="attrs"
    :aria-pressed="props.selectable ? selected : undefined"
    :data-state="showCheck ? 'selected' : undefined"
    :class="
      cn(
        chip({
          variant: props.variant,
          tone: props.tone,
          size: props.size,
          interactive,
          selected: showCheck,
          disabled: props.disabled,
        }),
        props.class,
      )
    "
    @click.capture="guard"
    @click="toggle"
  >
    <Ripple v-if="interactive && props.ripple" :disabled="props.disabled" />
    <IconSlot
      v-if="props.selectable || slots.icon"
      :size="props.size"
      :checked="showCheck"
      :icon="!!slots.icon"
    >
      <slot name="icon" />
    </IconSlot>
    <slot />
    <CloseButton
      v-if="removable"
      size="xs"
      :label="t.chip.remove"
      :disabled="props.disabled"
      :class="chipRemove({ size: props.size })"
      @click.stop="emit('remove')"
      @keydown="onRemoveKeydown"
    />
  </Primitive>
</template>
