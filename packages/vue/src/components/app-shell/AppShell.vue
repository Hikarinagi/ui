<script setup lang="ts">
  import { computed, getCurrentInstance, shallowRef, watch } from 'vue'
  import { cn } from '../../lib/cn'
  import { useUiLocale } from '../../locale'
  import ScrollArea from '../scroll-area/ScrollArea.vue'
  import TooltipProvider from '../tooltip/TooltipProvider.vue'
  import Drawer from '../drawer/Drawer.vue'
  import DrawerScope from '../sidebar/DrawerScope'
  import { provideSidebar, type SidebarState } from '../sidebar/context'
  import { useDesktopQuery } from './composables/useDesktopQuery'

  defineOptions({ name: 'HnAppShell' })

  const props = withDefaults(
    defineProps<{
      collapsible?: 'rail' | 'hidden'
      restoreKey?: string
      autoClose?: boolean
      class?: string
    }>(),
    { collapsible: 'rail', autoClose: true },
  )

  const t = useUiLocale()

  const sidebar = defineModel<SidebarState>('sidebar', { default: 'expanded' })
  const mobileOpen = defineModel<boolean>('mobileOpen', { default: false })
  const main = shallowRef<InstanceType<typeof ScrollArea>>()

  defineExpose({
    mainViewport: computed(() => main.value?.viewport),
    mainArea: main,
  })

  const isDesktop = useDesktopQuery()

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

  type Navigable = { currentRoute?: { value?: { fullPath?: string } } }
  const router = getCurrentInstance()?.appContext.config.globalProperties.$router as
    Navigable | undefined

  watch(
    () => router?.currentRoute?.value?.fullPath,
    () => {
      if (props.autoClose) mobileOpen.value = false
    },
  )
</script>

<template>
  <TooltipProvider>
    <div :class="cn('bg-canvas text-fg flex h-screen flex-col overflow-hidden', props.class)">
      <div v-if="$slots.banner" class="shrink-0">
        <slot name="banner" />
      </div>
      <div class="flex min-h-0 flex-1">
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
            <ScrollArea ref="main" :data-scroll-restore="props.restoreKey" class="h-full">
              <slot />
            </ScrollArea>
          </main>
        </div>
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
