<script setup lang="ts">
  import { computed } from 'vue'
  import { cn } from '../../lib/cn'
  import { useUiLocale } from '../../locale'
  import CloseButton from '../close-button/CloseButton.vue'
  import ScrollArea from '../scroll-area/ScrollArea.vue'
  import { useSidebar, type SidebarState } from './context'
  import SidebarLabel from './SidebarLabel.vue'
  import {
    sidebarRoot,
    sidebarRegion,
    sidebarBrand,
    sidebarIcon,
    sidebarWordmark,
  } from './sidebar.variants'

  defineOptions({ name: 'HnSidebar' })

  const props = defineProps<{
    label?: string
    class?: string
  }>()

  defineSlots<{
    default?(): unknown
    header?(props: { state: SidebarState }): unknown
    icon?(props: { state: SidebarState }): unknown
    wordmark?(props: { state: SidebarState }): unknown
    footer?(props: { state: SidebarState }): unknown
  }>()

  const t = useUiLocale()
  const sidebar = useSidebar()
  const state = computed(() => sidebar?.state.value ?? 'expanded')
  const inDrawer = computed(() => sidebar?.inDrawer ?? false)
</script>

<template>
  <aside
    :data-state="state"
    :inert="state === 'hidden'"
    :class="cn(sidebarRoot({ inDrawer }), props.class)"
    @transitionrun="sidebar?.onTransitionRun"
  >
    <div v-if="$slots.header" :class="cn(sidebarRegion({ inDrawer }), 'flex items-center gap-2')">
      <div class="min-w-0 flex-1">
        <slot name="header" :state="state" />
      </div>
      <CloseButton v-if="inDrawer" class="shrink-0" @click="sidebar?.toggle()" />
    </div>
    <div
      v-else-if="$slots.icon || $slots.wordmark"
      class="hn-collapse shrink-0"
      :data-state="state === 'rail' && !$slots.icon ? 'closed' : 'open'"
      :inert="state === 'rail' && !$slots.icon"
    >
      <div class="hn-collapse-body">
        <div :class="sidebarRegion({ inDrawer })">
          <div :class="sidebarBrand()">
            <div v-if="$slots.icon" :class="sidebarIcon()">
              <slot name="icon" :state="state" />
            </div>
            <SidebarLabel v-if="$slots.wordmark" as="div" :class="sidebarWordmark()">
              <slot name="wordmark" :state="state" />
            </SidebarLabel>
            <CloseButton v-if="inDrawer" class="ms-auto shrink-0" @click="sidebar?.toggle()" />
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="inDrawer" :class="cn(sidebarRegion({ inDrawer }), 'flex justify-end')">
      <CloseButton @click="sidebar?.toggle()" />
    </div>
    <ScrollArea class="min-h-0 flex-1">
      <nav
        :aria-label="props.label ?? t.sidebar.navLabel"
        :class="cn('flex flex-col gap-1 py-2', !inDrawer && 'px-2.5')"
      >
        <slot />
      </nav>
    </ScrollArea>
    <div v-if="$slots.footer" :class="sidebarRegion({ inDrawer, footer: true })">
      <slot name="footer" :state="state" />
    </div>
  </aside>
</template>
