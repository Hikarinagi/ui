<script setup lang="ts">
  import { computed, useSlots } from 'vue'
  import { cn } from '../../lib/cn'
  import Avatar from './Avatar.vue'
  import { flattenChildren } from './utils/children'
  import type { AvatarVariants } from './avatar.variants'
  import { avatarGroupItem } from './avatar-group.variants'
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
  const item = computed(() => avatarGroupItem({ size: props.size }))

  provideAvatarGroup(computed(() => ({ size: props.size })))
</script>

<template>
  <div :class="cn('flex flex-row-reverse justify-end', props.class)">
    <Avatar v-if="hidden > 0" :class="item">+{{ hidden }}</Avatar>
    <component :is="node" v-for="(node, i) in [...visible].reverse()" :key="i" :class="item" />
  </div>
</template>
