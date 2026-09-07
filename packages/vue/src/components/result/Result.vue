<script setup lang="ts">
  import { CircleCheck, CircleX, Info, TriangleAlert } from '@lucide/vue'
  import { useSlots } from 'vue'
  import Empty from '../empty/Empty.vue'
  import { resultIcon, type ResultVariants } from './result.variants'

  defineOptions({ name: 'HnResult' })

  const props = withDefaults(
    defineProps<{
      status?: ResultVariants['status']
      title?: string
      description?: string
      size?: ResultVariants['size']
      class?: string
    }>(),
    { status: 'info', size: 'md' },
  )

  const slots = useSlots()

  const icons = {
    success: CircleCheck,
    error: CircleX,
    warning: TriangleAlert,
    info: Info,
  }
</script>

<template>
  <Empty
    data-hn-result
    :data-status="props.status"
    :title="props.title"
    :description="props.description"
    :size="props.size"
    :class="props.class"
  >
    <template #icon>
      <slot name="icon">
        <span :class="resultIcon({ status: props.status, size: props.size })">
          <component :is="icons[props.status]" />
        </span>
      </slot>
    </template>
    <slot />
    <template v-if="slots.actions" #actions>
      <slot name="actions" />
    </template>
  </Empty>
</template>
