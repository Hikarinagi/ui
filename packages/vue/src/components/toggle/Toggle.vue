<script setup lang="ts">
  import { Toggle as ToggleRoot, injectTooltipProviderContext } from 'reka-ui'
  import { computed, useSlots } from 'vue'
  import { cn } from '../../lib/cn'
  import { useAccessibleName } from '../../lib/a11y'
  import { Passthrough } from '../../lib/passthrough'
  import { buttonIconBox } from '../button/button.variants'
  import Ripple from '../ripple/Ripple.vue'
  import Tooltip from '../tooltip/Tooltip.vue'
  import { toggle, type ToggleVariants } from './toggle.variants'

  defineOptions({ name: 'HnToggle', inheritAttrs: false })

  const props = withDefaults(
    defineProps<{
      label?: string
      tooltip?: boolean
      side?: 'top' | 'right' | 'bottom' | 'left'
      variant?: Extract<ToggleVariants['variant'], 'ghost' | 'outline'>
      size?: ToggleVariants['size']
      pill?: boolean
      disabled?: boolean
      ripple?: boolean
      class?: string
    }>(),
    { tooltip: true, side: 'top', variant: 'ghost', ripple: true },
  )

  const pressed = defineModel<boolean>({ default: false })

  const slots = useSlots()

  defineSlots<{
    default(): unknown
    icon(props: { pressed: boolean }): unknown
    'pressed-icon'(): unknown
  }>()

  useAccessibleName('Toggle', () => !props.label && !slots.default)

  const provider = injectTooltipProviderContext(null)
  const Wrapper = provider ? Tooltip : Passthrough

  const iconBox = computed(() => buttonIconBox({ size: props.size }))
  const swapped = computed(() => pressed.value && !!slots['pressed-icon'])
</script>

<template>
  <Wrapper
    :disabled="!props.tooltip || !props.label"
    :content="props.label ?? ''"
    :side="props.side"
  >
    <ToggleRoot
      v-bind="$attrs"
      v-model="pressed"
      :disabled="props.disabled"
      :aria-label="props.label"
      data-hn-toggle
      :class="
        cn(
          toggle({
            variant: props.variant,
            size: props.size,
            iconOnly: !!props.label,
            pill: props.pill,
          }),
          props.class,
        )
      "
    >
      <Ripple v-if="props.ripple" :disabled="props.disabled" />
      <span v-if="slots.icon" :class="iconBox">
        <Transition
          enter-active-class="hn-transition-base"
          enter-from-class="scale-90 opacity-0"
          leave-active-class="hn-transition absolute"
          leave-to-class="scale-90 opacity-0"
        >
          <span v-if="swapped" key="on" class="inline-flex items-center justify-center">
            <slot name="pressed-icon" />
          </span>
          <span v-else key="off" class="inline-flex items-center justify-center">
            <slot name="icon" :pressed="pressed" />
          </span>
        </Transition>
      </span>
      <span v-if="slots.default" class="inline-flex items-center"><slot /></span>
    </ToggleRoot>
  </Wrapper>
</template>
