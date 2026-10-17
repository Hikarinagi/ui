<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, Drawer, Inline, List, ListItem, Text, Tour, type TourStep } from '@hina-ui/vue'

  const open = ref(false)
  const contents = ref(false)
  const page = ref(12)

  const steps: TourStep[] = [
    {
      target: '#tour-play-contents',
      title: 'Contents',
      description: 'Open the contents here.',
      play: async ({ pointer }) => {
        await pointer.move('#tour-play-contents')
        await pointer.tap()
      },
    },
    {
      target: '#tour-play-chapter',
      title: 'Jump to a chapter',
      description: 'Pick a chapter in the contents to go there.',
      wait: 2000,
      play: async ({ pointer, defer, waitFor }) => {
        contents.value = true
        defer(() => (contents.value = false))
        await waitFor('#tour-play-chapter')
        await pointer.move('#tour-play-chapter')
        await pointer.tap()
      },
    },
    {
      target: '#tour-play-page',
      title: 'Turn pages',
      description: 'Press ← and → to turn pages.',
      play: async ({ pointer, sleep }) => {
        await pointer.key('→')
        page.value += 1
        await sleep(400)
        await pointer.key('←')
        page.value -= 1
      },
    },
  ]
</script>

<template>
  <Inline gap="sm" align="center" wrap>
    <Button id="tour-play-contents" variant="outline" tone="neutral" @click="contents = true">
      Contents
    </Button>
    <Text id="tour-play-page" tone="muted" class="tabular-nums">Page {{ page }}</Text>
    <Button variant="ghost" tone="neutral" @click="open = true">Show me how</Button>
  </Inline>
  <Drawer v-model:open="contents" title="Contents">
    <template #content>
      <List>
        <ListItem>Chapter 1 · Equinox</ListItem>
        <ListItem>Chapter 2 · Distant thunder</ListItem>
        <ListItem id="tour-play-chapter">Chapter 3 · Night rain</ListItem>
      </List>
    </template>
  </Drawer>
  <Tour v-model:open="open" :steps="steps" mask="dim" block-page />
</template>
