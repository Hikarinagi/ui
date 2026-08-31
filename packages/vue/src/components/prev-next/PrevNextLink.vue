<script setup lang="ts">
  import { Primitive, type PrimitiveProps } from 'reka-ui'
  import { ArrowLeft, ArrowRight } from '@lucide/vue'
  import Ripple from '../ripple/Ripple.vue'
  import { cn } from '../../lib/cn'
  import { useUiLocale } from '../../locale'
  import { prevNextLink, prevNextEyebrow, type PrevNextVariants } from './prev-next.variants'

  defineOptions({ name: 'HnPrevNextLink', inheritAttrs: false })

  const props = withDefaults(
    defineProps<
      PrimitiveProps & {
        direction: NonNullable<PrevNextVariants['direction']>
        label?: string
        class?: string
      }
    >(),
    { as: 'a' },
  )

  const t = useUiLocale()
</script>

<template>
  <Primitive
    v-bind="$attrs"
    :as="props.as"
    :as-child="props.asChild"
    :rel="props.direction"
    :data-direction="props.direction"
    :class="cn(prevNextLink({ direction: props.direction }), props.class)"
  >
    <Ripple />
    <span :class="prevNextEyebrow({ direction: props.direction })">
      <ArrowLeft v-if="props.direction === 'prev'" class="size-4" aria-hidden="true" />
      <ArrowRight v-else class="size-4" aria-hidden="true" />
      {{ props.label ?? (props.direction === 'prev' ? t.pagination.prev : t.pagination.next) }}
    </span>
    <span class="text-fg font-medium">
      <slot />
    </span>
  </Primitive>
</template>
