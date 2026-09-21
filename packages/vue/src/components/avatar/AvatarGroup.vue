<script setup lang="ts">
  import { computed, useSlots } from 'vue'
  import { cn } from '../../lib/cn'
  import Avatar from './Avatar.vue'
  import { flattenChildren } from './utils/children'
  import type { AvatarVariants } from './avatar.variants'
  import { avatarGroup } from './avatar-group.variants'
  import { provideAvatarGroup } from './context'

  defineOptions({ name: 'HnAvatarGroup' })

  const props = defineProps<{
    max?: number
    size?: AvatarVariants['size']
    class?: string
  }>()

  const slots = useSlots()

  const children = computed(() => flattenChildren(slots.default?.()))
  const visible = computed(() =>
    props.max && props.max > 0 ? children.value.slice(0, props.max) : children.value,
  )
  const hidden = computed(() => children.value.length - visible.value.length)

  provideAvatarGroup(computed(() => ({ size: props.size })))
</script>

<template>
  <div :class="cn(avatarGroup({ size: props.size }), props.class)">
    <Avatar v-if="hidden > 0">+{{ hidden }}</Avatar>
    <component :is="node" v-for="(node, i) in [...visible].reverse()" :key="i" />
  </div>
</template>
