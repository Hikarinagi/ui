<script setup lang="ts">
  import { cn } from '../../lib/cn'
  import { affix } from './affix.variants'
  import { useAffix } from './composables/useAffix'
  import type { AffixProps, AffixSlotProps } from './types'

  defineOptions({ name: 'HnAffix' })
  const props = withDefaults(defineProps<AffixProps>(), { as: 'div', position: 'top', offset: 0 })
  const emit = defineEmits<{ change: [affixed: boolean] }>()
  defineSlots<{ default?(props: AffixSlotProps): unknown }>()
  const { element, affixed, offset, update } = useAffix(props, value => emit('change', value))
  defineExpose({ element, affixed, update })
</script>

<template>
  <component
    :is="props.as"
    ref="element"
    data-hn-affix
    :data-position="props.position"
    :data-affixed="affixed ? '' : undefined"
    :data-disabled="props.disabled ? '' : undefined"
    :class="cn(affix({ position: props.position, disabled: props.disabled }), props.class)"
    :style="{ '--hn-affix-offset': `${offset}px` }"
  >
    <slot :affixed="affixed" />
  </component>
</template>
