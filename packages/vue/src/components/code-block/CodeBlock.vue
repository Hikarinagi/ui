<script setup lang="ts">
  import { computed, onBeforeUnmount, onMounted, shallowRef, watch } from 'vue'
  import { Check, Copy } from '@lucide/vue'
  import type { ThemedToken } from 'shiki/core'
  import { cn } from '../../lib/cn'
  import { devWarn } from '../../lib/dev'
  import { useUiLocale } from '../../locale'
  import Button from '../button/Button.vue'
  import ScrollArea from '../scroll-area/ScrollArea.vue'
  import { tokenize } from './highlighter'

  defineOptions({ name: 'HnCodeBlock' })

  const props = withDefaults(
    defineProps<{
      code: string
      lang?: string
      label?: string
      copyable?: boolean
      class?: string
    }>(),
    { copyable: true },
  )

  const t = useUiLocale()
  const tag = computed(() => props.label ?? props.lang)

  const tokens = shallowRef<ThemedToken[][] | null>(null)

  onMounted(() => {
    watch(
      () => [props.code, props.lang] as const,
      async ([code, lang]) => {
        if (!lang) {
          tokens.value = null
          return
        }
        try {
          const result = await tokenize(code, lang)
          if (code === props.code && lang === props.lang) tokens.value = result
        } catch (error) {
          tokens.value = null
          devWarn('CodeBlock', `着色管线失败,已退回素文本(lang="${lang}"):${String(error)}`, lang)
        }
      },
      { immediate: true },
    )
  })

  const copied = shallowRef(false)
  let timer: ReturnType<typeof setTimeout> | undefined

  async function copy() {
    await navigator.clipboard.writeText(props.code)
    copied.value = true
    clearTimeout(timer)
    timer = setTimeout(() => {
      copied.value = false
    }, 2000)
  }

  onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <div :class="cn('relative', props.class)">
    <ScrollArea
      direction="horizontal"
      focusable
      :label="tag"
      :class="cn('hn-pre', copyable && 'pe-12')"
    >
      <pre
        class="m-0"
      ><code v-if="tokens"><template v-for="(line, i) of tokens" :key="i">{{ i ? '\n' : '' }}<span v-for="(tk, j) of line" :key="j" :style="tk.htmlStyle">{{ tk.content }}</span></template></code><code v-else>{{ code }}</code></pre>
    </ScrollArea>
    <div class="absolute top-2 end-2 flex items-center gap-2">
      <span v-if="tag" class="text-faint font-mono text-xs select-none">{{ tag }}</span>
      <Button
        v-if="copyable"
        variant="ghost"
        tone="neutral"
        size="sm"
        icon-only
        :aria-label="copied ? t.codeblock.copied : t.codeblock.copy"
        @click="copy"
      >
        <Check v-if="copied" />
        <Copy v-else />
      </Button>
    </div>
  </div>
</template>
