<script setup lang="ts">
  import { computed, onMounted, shallowRef, watch } from 'vue'
  import type { ThemedToken } from 'shiki/core'
  import { cn } from '../../lib/cn'
  import { devWarn } from '../../lib/dev'
  import { useUiLocale } from '../../locale'
  import CopyButton from '../copy-button/CopyButton.vue'
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
</script>

<template>
  <div :class="cn('relative', props.class)">
    <ScrollArea direction="horizontal" focusable :label="tag" class="hn-pre">
      <pre
        class="m-0"
      ><code v-if="tokens"><template v-for="(line, i) of tokens" :key="i">{{ i ? '\n' : '' }}<span v-for="(tk, j) of line" :key="j" :style="tk.htmlStyle">{{ tk.content }}</span></template></code><code v-else>{{ code }}</code></pre>
    </ScrollArea>
    <div class="absolute top-2 end-2 flex items-center gap-2">
      <span v-if="tag" class="text-faint font-mono text-xs select-none">{{ tag }}</span>
      <CopyButton v-if="copyable" :text="props.code" :label="t.codeblock.copy" />
    </div>
  </div>
</template>
