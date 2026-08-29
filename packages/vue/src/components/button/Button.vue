<script setup lang="ts">
  import { computed, useSlots } from 'vue'
  import { Primitive, type PrimitiveProps } from 'reka-ui'
  import { cn } from '../../lib/cn'
  import { useAccessibleName } from '../../lib/a11y'
  import { button, buttonIconBox, type ButtonVariants } from './button.variants'
  import IconSlot from './IconSlot.vue'
  import Ripple from '../ripple/Ripple.vue'
  import Spinner from '../spinner/Spinner.vue'

  defineOptions({ name: 'HnButton' })

  const props = withDefaults(
    defineProps<
      PrimitiveProps & {
        variant?: ButtonVariants['variant']
        tone?: ButtonVariants['tone']
        size?: ButtonVariants['size']
        type?: 'button' | 'submit' | 'reset'
        iconOnly?: boolean
        block?: boolean
        pill?: boolean
        loading?: boolean
        disabled?: boolean
        ripple?: boolean
        class?: string
      }
    >(),
    { as: 'button', type: 'button', ripple: true },
  )

  const slots = useSlots()

  useAccessibleName('Button', () => !!props.iconOnly)

  const isDisabled = computed(() => props.disabled || props.loading)
  const isNativeButton = computed(() => props.as === 'button' && !props.asChild)

  const spinnerAt = computed<'icon' | 'trailing' | 'center'>(() =>
    slots.icon ? 'icon' : slots.trailing ? 'trailing' : 'center',
  )

  const withRipple = computed(() => props.ripple && props.variant !== 'link')

  const nativeAttrs = computed(() => {
    if (isNativeButton.value) {
      return { type: props.type, disabled: isDisabled.value }
    }
    return isDisabled.value
      ? { 'data-disabled': '', 'aria-disabled': 'true', tabindex: -1 }
      : undefined
  })

  const spinnerSize = computed<'sm' | 'md'>(() => (props.size === 'lg' ? 'md' : 'sm'))
  const iconBox = computed(() => buttonIconBox({ size: props.size }))

  function guard(event: MouseEvent) {
    if (!isDisabled.value) return
    event.preventDefault()
    event.stopImmediatePropagation()
  }
</script>

<template>
  <Primitive
    :as="props.as"
    :as-child="props.asChild"
    v-bind="nativeAttrs"
    :aria-busy="props.loading || undefined"
    :data-loading="props.loading ? '' : undefined"
    :class="
      cn(
        button({
          variant: props.variant,
          tone: props.tone,
          size: props.size,
          iconOnly: props.iconOnly,
          block: props.block,
          pill: props.pill,
        }),
        props.class,
      )
    "
    @click.capture="guard"
  >
    <Ripple v-if="withRipple" :disabled="isDisabled" />

    <IconSlot
      v-if="slots.icon"
      :box-class="iconBox"
      :swapped="!!props.loading && spinnerAt === 'icon'"
      :spinner-size="spinnerSize"
    >
      <slot name="icon" />
    </IconSlot>

    <span
      v-if="slots.default"
      class="hn-transition inline-flex items-center"
      :class="props.loading && spinnerAt === 'center' ? 'opacity-0' : 'opacity-100'"
    >
      <slot />
    </span>

    <IconSlot
      v-if="slots.trailing"
      :box-class="iconBox"
      :swapped="!!props.loading && spinnerAt === 'trailing'"
      :spinner-size="spinnerSize"
    >
      <slot name="trailing" />
    </IconSlot>

    <Transition
      enter-active-class="hn-transition-base"
      enter-from-class="opacity-0"
      leave-active-class="hn-transition"
      leave-to-class="opacity-0"
    >
      <span
        v-if="props.loading && spinnerAt === 'center'"
        aria-hidden="true"
        class="absolute inset-0 flex items-center justify-center"
      >
        <Spinner :size="spinnerSize" />
      </span>
    </Transition>
  </Primitive>
</template>
