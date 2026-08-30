<script setup lang="ts">
  import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
  import { cn } from '../../lib/cn'
  import { useUiLocale } from '../../locale'
  import ScrollArea from '../scroll-area/ScrollArea.vue'
  import TooltipProvider from '../tooltip/TooltipProvider.vue'
  import Drawer from '../drawer/Drawer.vue'
  import DrawerScope from '../sidebar/DrawerScope'
  import { provideSidebar, type SidebarState } from '../sidebar/context'

  defineOptions({ name: 'HnAppShell' })

  const props = withDefaults(
    defineProps<{
      collapsible?: 'rail' | 'hidden'
      class?: string
    }>(),
    { collapsible: 'rail' },
  )

  const t = useUiLocale()

  const sidebar = defineModel<SidebarState>('sidebar', { default: 'expanded' })
  const mobileOpen = ref(false)

  const media = ref<MediaQueryList>()
  const isDesktop = ref(true)

  function onMedia() {
    isDesktop.value = media.value?.matches ?? true
  }

  onMounted(() => {
    media.value = window.matchMedia('(min-width: 64rem)')
    media.value.addEventListener('change', onMedia)
    onMedia()
  })

  onBeforeUnmount(() => media.value?.removeEventListener('change', onMedia))

  function toggle() {
    if (!isDesktop.value) {
      mobileOpen.value = !mobileOpen.value
      return
    }
    sidebar.value = sidebar.value === 'expanded' ? props.collapsible : 'expanded'
  }

  provideSidebar({
    state: computed(() => sidebar.value),
    toggle,
    openMobile: () => (mobileOpen.value = true),
  })
</script>

<template>
  <TooltipProvider>
    <div :class="cn('bg-canvas text-fg flex h-screen overflow-hidden', props.class)">
      <div v-if="$slots.sidebar" class="hidden h-full shrink-0 lg:block">
        <slot name="sidebar" />
      </div>
      <div class="flex min-h-0 min-w-0 flex-1 flex-col">
        <header v-if="$slots.header" class="border-line bg-canvas shrink-0 border-b">
          <div class="flex h-14 items-center gap-3 px-4 sm:px-6">
            <slot name="header" />
          </div>
        </header>
        <main class="min-h-0 min-w-0 flex-1">
          <ScrollArea class="h-full">
            <slot />
          </ScrollArea>
        </main>
      </div>
      <Drawer
        v-if="$slots.sidebar"
        v-model:open="mobileOpen"
        :title="t.sidebar.navLabel"
        side="start"
        size="sm"
        class="lg:hidden"
      >
        <template #content>
          <DrawerScope>
            <slot name="sidebar" />
          </DrawerScope>
        </template>
      </Drawer>
    </div>
  </TooltipProvider>
</template>
