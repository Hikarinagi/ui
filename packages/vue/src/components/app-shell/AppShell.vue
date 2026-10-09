<script setup lang="ts">
  import {
    computed,
    getCurrentInstance,
    h,
    inject,
    onMounted,
    shallowRef,
    ssrContextKey,
    watch,
  } from 'vue'
  import { cn } from '../../lib/cn'
  import { useUiLocale } from '../../locale'
  import ScrollArea from '../scroll-area/ScrollArea.vue'
  import TooltipProvider from '../tooltip/TooltipProvider.vue'
  import Drawer from '../drawer/Drawer.vue'
  import DrawerScope from '../sidebar/DrawerScope'
  import { provideSidebar, type SidebarState } from '../sidebar/context'
  import {
    createScrollRestoreSession,
    scrollRestoreScript,
  } from '../../../../shared/src/lib/scroll-restore'
  import { useDesktopQuery } from './composables/useDesktopQuery'
  import { useSidebarScrollUpdates } from './composables/useSidebarScrollUpdates'

  defineOptions({ name: 'HnAppShell' })

  const props = withDefaults(
    defineProps<{
      collapsible?: 'rail' | 'hidden'
      restoreKey?: string
      autoClose?: boolean
      mobileTitle?: string
      class?: string
    }>(),
    { collapsible: 'rail', autoClose: true },
  )

  const t = useUiLocale()

  const sidebar = defineModel<SidebarState>('sidebar', { default: 'expanded' })
  const mobileOpen = defineModel<boolean>('mobileOpen', { default: false })
  const main = shallowRef<InstanceType<typeof ScrollArea>>()
  const emit = defineEmits<{ sizeStable: [] }>()

  defineExpose({
    mainViewport: computed(() => main.value?.viewport),
    mainArea: main,
  })

  const isDesktop = useDesktopQuery()
  const onTransitionRun = useSidebarScrollUpdates(
    () => sidebar.value,
    () => emit('sizeStable'),
  )

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
    onTransitionRun,
  })

  const RestoreScript = () => h('script', { innerHTML: scrollRestoreScript() })
  const scripted = shallowRef(!!inject(ssrContextKey, null) || !!getCurrentInstance()?.vnode.el)
  onMounted(() => {
    scripted.value = false
  })

  let restoredKey: string | undefined
  watch(
    () => [props.restoreKey, main.value?.instance] as const,
    ([key, instance], _previous, onCleanup) => {
      if (!key || !instance) return
      const { viewport, target } = instance.elements()
      const session = createScrollRestoreSession({
        key,
        viewport,
        target,
        initial: restoredKey === undefined || restoredKey === key,
        onUpdated: listener => instance.on('updated', listener),
        onScroll: listener => instance.on('scroll', listener),
      })
      restoredKey = key
      onCleanup(() => session.dispose())
    },
    { immediate: true, flush: 'post' },
  )

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
    <div
      :class="
        cn(
          'bg-canvas text-fg flex h-screen flex-col overflow-hidden [--hn-app-shell-header-h:calc(3.5rem+1px)]',
          props.class,
        )
      "
    >
      <div v-if="$slots.banner" class="shrink-0">
        <slot name="banner" />
      </div>
      <div class="flex min-h-0 flex-1">
        <div v-if="$slots.sidebar" class="hidden h-full shrink-0 lg:block">
          <slot name="sidebar" />
        </div>
        <div class="flex min-h-0 min-w-0 flex-1 flex-col">
          <header
            v-if="$slots.header"
            class="border-line bg-canvas h-(--hn-app-shell-header-h) shrink-0 border-b"
          >
            <div class="flex h-full items-center gap-3 px-4 sm:px-6">
              <slot name="header" />
            </div>
          </header>
          <main class="min-h-0 min-w-0 flex-1">
            <ScrollArea ref="main" :data-scroll-restore="props.restoreKey" class="h-full">
              <slot />
            </ScrollArea>
            <RestoreScript v-if="props.restoreKey && scripted" />
          </main>
        </div>
      </div>
      <Drawer
        v-if="$slots.sidebar"
        v-model:open="mobileOpen"
        :title="props.mobileTitle ?? t.sidebar.navLabel"
        side="start"
        size="sm"
        class="lg:hidden"
      >
        <template #body="{ close }">
          <DrawerScope :close="close">
            <slot name="sidebar" />
          </DrawerScope>
        </template>
      </Drawer>
    </div>
  </TooltipProvider>
</template>
