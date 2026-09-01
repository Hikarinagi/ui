<script setup lang="ts">
  import { computed } from 'vue'
  import { User } from '@lucide/vue'
  import { AvatarRoot, AvatarImage, AvatarFallback } from 'reka-ui'
  import { cn } from '../../lib/cn'
  import { avatar, type AvatarVariants } from './avatar.variants'
  import { useAvatarGroup } from './context'

  defineOptions({ name: 'HnAvatar' })

  const props = defineProps<{
    src?: string
    alt?: string
    name?: string
    size?: AvatarVariants['size']
    delayMs?: number
    class?: string
  }>()

  const group = useAvatarGroup()
  const size = computed(() => props.size ?? group?.value.size)

  const initials = computed(() => {
    const name = props.name?.trim()
    if (!name) return ''
    const words = name.split(/\s+/)
    if (words.length > 1)
      return words
        .slice(0, 2)
        .map(w => w[0]!.toUpperCase())
        .join('')
    return /^[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/u.test(name)
      ? name[0]!
      : name.slice(0, 2).toUpperCase()
  })
</script>

<template>
  <AvatarRoot :class="cn(avatar({ size }), props.class)">
    <AvatarImage
      v-if="props.src"
      :src="props.src"
      :alt="props.alt ?? props.name"
      class="size-full object-cover"
    />
    <AvatarFallback :delay-ms="props.delayMs" class="size-full">
      <span class="flex size-full items-center justify-center">
        <slot>
          <template v-if="initials">{{ initials }}</template>
          <User v-else aria-hidden="true" />
        </slot>
      </span>
    </AvatarFallback>
  </AvatarRoot>
</template>
