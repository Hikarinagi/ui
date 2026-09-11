<script setup lang="ts">
  import { computed } from 'vue'
  import { cn } from '../../lib/cn'
  import { useUiLocale } from '../../locale'
  import CopyButton from '../copy-button/CopyButton.vue'
  import ScrollArea from '../scroll-area/ScrollArea.vue'
  import { useCodeHighlight } from './composables/useCodeHighlight'
  import {
    codeBlock,
    codeBlockArea,
    codeBlockContent,
    codeBlockActions,
    codeBlockLabel,
  } from './code-block.variants'

  defineOptions({ name: 'HnCodeBlock' })

  const props = withDefaults(
    defineProps<{
      code: string
      lang?: string
      label?: string
      html?: string
      copyable?: boolean
      class?: string
    }>(),
    { copyable: true },
  )

  const t = useUiLocale()
  const tag = computed(() => props.label ?? props.lang)

  const tokens = useCodeHighlight(props)
</script>

<template>
  <div :data-lang="props.lang" :class="cn(codeBlock(), props.class)">
    <ScrollArea direction="both" focusable :label="tag" :class="codeBlockArea()">
      <pre
        :class="codeBlockContent()"
      ><code v-if="props.html" v-html="props.html"></code><code v-else-if="tokens"><template v-for="(line, i) of tokens" :key="i">{{ i ? '\n' : '' }}<span v-for="(tk, j) of line" :key="j" :style="tk.htmlStyle">{{ tk.content }}</span></template></code><code v-else>{{ code }}</code></pre>
    </ScrollArea>
    <div :class="codeBlockActions()">
      <span v-if="tag" :class="codeBlockLabel()">{{ tag }}</span>
      <CopyButton v-if="copyable" :text="props.code" :label="t.codeblock.copy" />
    </div>
  </div>
</template>
