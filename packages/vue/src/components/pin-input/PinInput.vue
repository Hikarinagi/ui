<script setup lang="ts">
  import { PinInputInput, PinInputRoot } from 'reka-ui'
  import { computed } from 'vue'
  import { cn } from '../../lib/cn'
  import { useUiLocale } from '../../locale'
  import { pinInput, pinInputCell, type PinInputVariants } from './pin-input.variants'

  defineOptions({ name: 'HnPinInput' })

  const props = withDefaults(
    defineProps<{
      length?: number
      type?: 'text' | 'number'
      mask?: boolean
      otp?: boolean
      placeholder?: string
      name?: string
      variant?: PinInputVariants['variant']
      size?: PinInputVariants['size']
      disabled?: boolean
      invalid?: boolean
      class?: string
    }>(),
    { length: 6, type: 'text', placeholder: '' },
  )

  const emit = defineEmits<{ complete: [value: string] }>()

  const model = defineModel<string>({ default: '' })

  const t = useUiLocale()

  const cells = computed(() => Array.from({ length: props.length }, (_, i) => model.value[i] ?? ''))

  function update(value: (string | number)[] | undefined) {
    const next = (value ?? []).map(cell => (cell === undefined ? '' : String(cell))).join('')
    if (next !== model.value) model.value = next
  }
</script>

<template>
  <PinInputRoot
    role="group"
    :model-value="cells"
    :type="props.type"
    :mask="props.mask"
    :otp="props.otp"
    :placeholder="props.placeholder"
    :name="props.name"
    :disabled="props.disabled"
    data-hn-pin-input
    :data-invalid="props.invalid ? '' : undefined"
    :class="cn(pinInput(), props.class)"
    @update:model-value="update"
    @complete="value => emit('complete', value.map(String).join(''))"
  >
    <PinInputInput
      v-for="index in props.length"
      :key="index"
      :index="index - 1"
      :aria-label="t.pinInput.cellLabel(index, props.length)"
      :aria-invalid="props.invalid || undefined"
      :data-invalid="props.invalid ? '' : undefined"
      :class="pinInputCell({ variant: props.variant, size: props.size })"
    />
  </PinInputRoot>
</template>
