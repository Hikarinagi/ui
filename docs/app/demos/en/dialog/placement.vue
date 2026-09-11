<script setup lang="ts">
  import { Button, Dialog, Inline, Text } from '@hina-ui/vue'
</script>

<template>
  <Inline align="center" class="gap-6">
    <Dialog title="Centred" placement="center">
      <Button variant="outline" tone="neutral">center</Button>
      <template #content>
        <Text>Stays centred at every screen width.</Text>
      </template>
    </Dialog>
    <Dialog title="Along the top" placement="top">
      <Button variant="outline" tone="neutral">top</Button>
      <template #content>
        <Text>Slides in from above with space at the top, including on narrow screens.</Text>
      </template>
    </Dialog>
    <Dialog title="Along the bottom" placement="bottom">
      <Button variant="outline" tone="neutral">bottom</Button>
      <template #content>
        <Text>Slides up from the bottom and keeps its rounded corners.</Text>
      </template>
    </Dialog>
    <Dialog title="Following the screen">
      <Button variant="outline" tone="neutral">default</Button>
      <template #content>
        <Text>
          Centred on a wide screen; on a narrow one it sits along the bottom and fills the width.
          Narrow the window and open it again to see it.
        </Text>
      </template>
    </Dialog>
  </Inline>
</template>
