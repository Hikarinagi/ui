<script setup lang="ts">
  import { shallowRef } from 'vue'
  import InputBase from './InputBase.vue'
  import type { TextInputVariants } from './input.variants'

  defineOptions({ name: 'HnInput', inheritAttrs: false })

  const props = defineProps<{
    variant?: TextInputVariants['variant']
    size?: TextInputVariants['size']
    clearable?: boolean
    loading?: boolean
    disabled?: boolean
    invalid?: boolean
    class?: string
  }>()
  const emit = defineEmits<{ clear: [] }>()

  const model = defineModel<string>()

  const base = shallowRef<InstanceType<typeof InputBase> | null>(null)

  defineExpose({ clear: () => base.value?.clear(), focus: () => base.value?.focus() })
</script>

<template>
  <InputBase
    ref="base"
    v-bind="$attrs"
    v-model="model"
    :variant="props.variant"
    :size="props.size"
    :clearable="props.clearable"
    :loading="props.loading"
    :disabled="props.disabled"
    :invalid="props.invalid"
    :class="props.class"
    @clear="emit('clear')"
  >
    <template v-if="$slots.leading" #leading><slot name="leading" /></template>
    <template v-if="$slots.trailing" #trailing><slot name="trailing" /></template>
  </InputBase>
</template>
