<script setup lang="ts">
  import { useId } from 'vue'
  import { cn } from '../../lib/cn'
  import Text from '../text/Text.vue'

  defineOptions({ name: 'HnPageAside' })

  const props = defineProps<{
    label?: string
    class?: string
  }>()

  const titleId = useId()
</script>

<template>
  <aside
    :aria-labelledby="props.label ? titleId : undefined"
    :class="cn('hidden w-56 shrink-0 xl:block', props.class)"
  >
    <div class="sticky top-8 flex flex-col gap-3">
      <Text v-if="props.label" :id="titleId" as="h2" size="sm" tone="muted" weight="medium">
        {{ props.label }}
      </Text>
      <slot />
    </div>
  </aside>
</template>
