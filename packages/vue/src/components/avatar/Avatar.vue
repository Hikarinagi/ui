<script setup lang="ts">
  import { computed } from 'vue'
  import { User } from '@lucide/vue'
  import { cn } from '../../lib/cn'
  import Image from '../image/Image.vue'
  import { avatar, type AvatarVariants } from './avatar.variants'
  import { useAvatarGroup } from './context'

  defineOptions({ name: 'HnAvatar', inheritAttrs: false })

  const props = defineProps<{
    src?: string
    alt?: string
    name?: string
    size?: AvatarVariants['size']
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
  <Image
    :src="props.src"
    :alt="props.alt ?? props.name ?? ''"
    :class="cn(avatar({ size }), props.class)"
    v-bind="$attrs"
  >
    <template #empty>
      <slot>
        <template v-if="initials">{{ initials }}</template>
        <User v-else aria-hidden="true" />
      </slot>
    </template>
    <template #error>
      <slot>
        <template v-if="initials">{{ initials }}</template>
        <User v-else aria-hidden="true" />
      </slot>
    </template>
  </Image>
</template>
