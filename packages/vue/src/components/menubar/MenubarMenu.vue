<script setup lang="ts">
  import { shallowRef } from 'vue'
  import { MenubarContent, MenubarMenu, MenubarPortal, MenubarTrigger } from 'reka-ui'
  import { cn } from '../../lib/cn'
  import Card from '../card/Card.vue'
  import { menubarContent, menubarTrigger } from './menubar.variants'

  defineOptions({ name: 'HnMenubarMenu' })

  const props = defineProps<{
    label?: string
    value?: string
    disabled?: boolean
    class?: string
  }>()

  const panel = shallowRef<{ $el: HTMLElement } | null>(null)

  function ignoreWhileClosing(event: Event) {
    if (panel.value?.$el.dataset.state === 'closed') event.preventDefault()
  }
</script>

<template>
  <MenubarMenu :value="props.value">
    <MenubarTrigger :disabled="props.disabled" :class="menubarTrigger()">
      <slot name="label">{{ props.label }}</slot>
    </MenubarTrigger>
    <MenubarPortal>
      <MenubarContent
        as-child
        align="start"
        :side-offset="4"
        @focus-outside="ignoreWhileClosing"
        @interact-outside="ignoreWhileClosing"
      >
        <Card ref="panel" :padded="false" :class="cn(menubarContent(), props.class)">
          <slot />
        </Card>
      </MenubarContent>
    </MenubarPortal>
  </MenubarMenu>
</template>
