<script setup lang="ts">
  import { Motion } from 'motion-v'
  import { Button, Card, Center, CodeBlock, TRANSITION, cn } from '@hikarinagi/ui'

  const props = withDefaults(
    defineProps<{
      code: string
      lang?: string
      html?: string
    }>(),
    { lang: 'vue', html: undefined },
  )

  const { t } = useI18n()

  const PEEK = 112
  const FADE = 56
  const mask = `linear-gradient(to bottom, #000 calc(100% - var(--demo-fade, ${FADE}px)), transparent 100%)`

  const collapsible = computed(() => props.code.split('\n').length > 8)
  const open = ref(false)
  const expanded = computed(() => !collapsible.value || open.value)

  const box = useTemplateRef<{ $el?: HTMLElement }>('box')
  const target = ref<number | null>(null)
  const height = computed(() => (collapsible.value ? (target.value ?? PEEK) : 'auto'))

  async function toggle() {
    if (open.value) {
      target.value = null
      open.value = false
      return
    }
    open.value = true
    await nextTick()
    target.value = box.value?.$el?.scrollHeight ?? null
  }
</script>

<template>
  <Card :padded="false" class="relative overflow-hidden">
    <Center class="min-h-80 p-10">
      <slot />
    </Center>
    <Motion
      ref="box"
      :initial="false"
      :animate="{
        height,
        '--demo-fade': `${expanded ? 0 : FADE}px`,
      }"
      :transition="TRANSITION.layout"
      :style="collapsible ? { maskImage: mask, maskRepeat: 'no-repeat' } : undefined"
      class="border-line overflow-hidden border-t"
    >
      <CodeBlock
        :code="props.code"
        :lang="props.lang"
        :html="props.html"
        :class="
          cn('[&_.hn-pre]:rounded-none [&_.hn-pre]:border-0', collapsible && '[&_.hn-pre]:pb-14')
        "
      />
    </Motion>
    <Button
      v-if="collapsible"
      variant="outline"
      tone="neutral"
      size="sm"
      pill
      class="absolute bottom-3 left-1/2 -translate-x-1/2 shadow-sm"
      :aria-expanded="open"
      @click="toggle"
    >
      {{ open ? t('actions.collapseCode') : t('actions.expandCode') }}
    </Button>
  </Card>
</template>
