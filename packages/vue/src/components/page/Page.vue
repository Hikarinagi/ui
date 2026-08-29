<script setup lang="ts">
  import { cn } from '../../lib/cn'
  import Container from '../container/Container.vue'
  import type { ContainerVariants } from '../container/container.variants'

  defineOptions({ name: 'HnPage' })

  const props = defineProps<{
    size?: ContainerVariants['size']
    class?: string
  }>()
</script>

<template>
  <Container :size="props.size" :class="cn('py-8', props.class)">
    <div class="flex gap-10">
      <div class="flex min-w-0 flex-1 flex-col gap-8">
        <slot />
      </div>
      <slot name="aside" />
    </div>
  </Container>
</template>
