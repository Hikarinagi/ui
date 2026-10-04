<script setup lang="ts">
  import { Check, Copy, ExternalLink } from '@lucide/vue'
  import { siClaude, siMarkdown } from 'simple-icons'
  import openaiSvg from '@lobehub/icons-static-svg/icons/openai.svg?raw'
  import {
    Button,
    ButtonGroup,
    DisclosureIcon,
    DropdownMenu,
    DropdownMenuItem,
    IconButton,
    Stack,
    Text,
  } from '@hina-ui/vue'
  import type { Component } from 'vue'
  import BrandIcon from '~/components/docs/BrandIcon'
  import RawIcon from '~/components/docs/RawIcon'

  const props = defineProps<{
    title: string
  }>()

  const { t } = useI18n()
  const route = useRoute()
  const source = computed(() => `${route.path.replace(/\/$/, '')}.md`)
  prerenderRoutes(source.value)

  const copied = ref(false)
  const menuOpen = ref(false)
  let timer: ReturnType<typeof setTimeout> | undefined

  async function copy() {
    await navigator.clipboard.writeText(await $fetch<string>(source.value))
    copied.value = true
    clearTimeout(timer)
    timer = setTimeout(() => {
      copied.value = false
    }, 2000)
  }

  function viewMarkdown() {
    window.open(source.value, '_blank')
  }

  function askIn(base: string) {
    const prompt = t('actions.prompt', {
      url: `${location.origin}${source.value}`,
      title: props.title,
    })
    window.open(`${base}${encodeURIComponent(prompt)}`, '_blank')
  }

  const ClaudeGlyph = () => h(BrandIcon, { icon: siClaude })
  const MarkdownGlyph = () => h(BrandIcon, { icon: siMarkdown })
  const OpenAiGlyph = () => h(RawIcon, { svg: openaiSvg })

  interface MenuItem {
    icon: Component
    title: string
    description: string
    external?: boolean
    select: () => void
  }

  const items = computed<MenuItem[]>(() => [
    {
      icon: MarkdownGlyph,
      title: t('actions.viewMarkdown'),
      description: t('actions.openSource'),
      select: viewMarkdown,
    },
    {
      icon: OpenAiGlyph,
      title: t('actions.openInChatGPT'),
      description: t('actions.ask'),
      external: true,
      select: () => askIn('https://chatgpt.com/?q='),
    },
    {
      icon: ClaudeGlyph,
      title: t('actions.openInClaude'),
      description: t('actions.ask'),
      external: true,
      select: () => askIn('https://claude.ai/new?q='),
    },
  ])
</script>

<template>
  <ButtonGroup :label="t('actions.copyMarkdown')">
    <Button variant="outline" tone="neutral" size="sm" @click="copy">
      <template #icon>
        <Check v-if="copied" class="text-success-text" />
        <Copy v-else />
      </template>
      {{ t('actions.copyMarkdown') }}
    </Button>
    <DropdownMenu v-model:open="menuOpen" :label="t('actions.more')" align="end" class="w-80">
      <IconButton variant="outline" tone="neutral" size="sm" :label="t('actions.more')">
        <DisclosureIcon />
      </IconButton>
      <template #content>
        <DropdownMenuItem
          v-for="item in items"
          :key="item.title"
          :text-value="item.title"
          class="gap-3"
          @select="item.select()"
        >
          <template #icon>
            <component :is="item.icon" class="size-4 shrink-0" />
          </template>
          <Stack gap="none" class="items-start text-start">
            <Text as="span" size="sm">{{ item.title }}</Text>
            <Text as="span" size="xs" tone="muted">{{ item.description }}</Text>
          </Stack>
          <template #trailing>
            <ExternalLink v-if="item.external" class="text-faint size-3.5 shrink-0" />
          </template>
        </DropdownMenuItem>
      </template>
    </DropdownMenu>
  </ButtonGroup>
</template>
