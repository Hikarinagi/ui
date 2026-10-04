import { h } from 'vue'
import { Star as VStar } from '@hina-ui/vue/../node_modules/@lucide/vue'
import { Star as RStarIcon } from '@hina-ui/react/../node_modules/lucide-react'
import VAppShell from '@hina-ui/vue/components/app-shell/AppShell.vue'
import VSidebar from '@hina-ui/vue/components/sidebar/Sidebar.vue'
import VSidebarGroup from '@hina-ui/vue/components/sidebar/SidebarGroup.vue'
import VSidebarLabel from '@hina-ui/vue/components/sidebar/SidebarLabel.vue'
import VSidebarTrigger from '@hina-ui/vue/components/sidebar/SidebarTrigger.vue'
import VNavLink from '@hina-ui/vue/components/nav-link/NavLink.vue'
import VInline from '@hina-ui/vue/components/inline/Inline.vue'
import { AppShell } from '@hina-ui/react/components/app-shell/AppShell'
import { Sidebar, type SidebarProps } from '@hina-ui/react/components/sidebar/Sidebar'
import { SidebarGroup } from '@hina-ui/react/components/sidebar/SidebarGroup'
import { SidebarLabel } from '@hina-ui/react/components/sidebar/SidebarLabel'
import { SidebarTrigger } from '@hina-ui/react/components/sidebar/SidebarTrigger'
import type { SidebarState } from '@hina-ui/react/components/sidebar/context'
import { NavLink } from '@hina-ui/react/components/nav-link/NavLink'
import { Inline } from '@hina-ui/react/components/inline/Inline'
import { lucide } from '@hina-ui/react/lib/icon'
import type { ParityCase } from '../src/cases'
import { defineCases } from '../src/cases'

const RStar = lucide(RStarIcon)

const vueGroups = () => [
  h(VSidebarGroup, { label: '组件' }, () => [
    h(VNavLink, { href: '#a', active: true, label: 'Button' }, () => 'Button'),
    h(VNavLink, { href: '#b', label: 'Input' }, () => 'Input'),
  ]),
  h(VSidebarGroup, { label: '设计语言', defaultOpen: false }, () =>
    h(VNavLink, { href: '#c', label: '薄墨' }, () => '薄墨'),
  ),
]

const reactGroups = (
  <>
    <SidebarGroup label="组件">
      <NavLink href="#a" active label="Button">
        Button
      </NavLink>
      <NavLink href="#b" label="Input">
        Input
      </NavLink>
    </SidebarGroup>
    <SidebarGroup label="设计语言" defaultOpen={false}>
      <NavLink href="#c" label="薄墨">
        薄墨
      </NavLink>
    </SidebarGroup>
  </>
)

type Slots = 'header' | 'icon' | 'wordmark' | 'footer'

const vueSlot: Record<Slots, (props: { state: SidebarState }) => unknown> = {
  header: ({ state }) => h('span', { 'data-header': state }, 'Hina UI'),
  icon: ({ state }) =>
    h('svg', { 'data-icon': state, viewBox: '0 0 32 32', role: 'img', 'aria-label': 'Hina' }),
  wordmark: ({ state }) => h('span', { 'data-wordmark': state }, 'Hina UI'),
  footer: ({ state }) =>
    h(VInline, { gap: 'sm', wrap: false }, () => [
      h('span', { 'data-footer': state }, 'A'),
      h(VSidebarLabel, { class: 'whitespace-nowrap' }, () => '账户设置'),
    ]),
}

const reactSlot: Record<Slots, NonNullable<SidebarProps['renderHeader']>> = {
  header: ({ state }) => <span data-header={state}>Hina UI</span>,
  icon: ({ state }) => <svg data-icon={state} viewBox="0 0 32 32" role="img" aria-label="Hina" />,
  wordmark: ({ state }) => <span data-wordmark={state}>Hina UI</span>,
  footer: ({ state }) => (
    <Inline gap="sm" wrap={false}>
      <span data-footer={state}>A</span>
      <SidebarLabel className="whitespace-nowrap">账户设置</SidebarLabel>
    </Inline>
  ),
}

const render = {
  header: 'renderHeader',
  icon: 'renderIcon',
  wordmark: 'renderWordmark',
  footer: 'renderFooter',
} as const

function sidebarCase(
  name: string,
  slots: Slots[],
  options: { state?: SidebarState; props?: Record<string, unknown>; groups?: boolean } = {},
): ParityCase {
  const { state, props = {}, groups = true } = options
  const vueSidebar = () =>
    h(VSidebar, props, {
      ...Object.fromEntries(slots.map(slot => [slot, vueSlot[slot]])),
      default: () =>
        groups ? vueGroups() : h(VNavLink, { href: '#a', label: '概览' }, () => '概览'),
    })
  const { class: className, ...rest } = props as { class?: string }
  const reactSidebar = (
    <Sidebar
      {...rest}
      className={className}
      {...Object.fromEntries(slots.map(slot => [render[slot], reactSlot[slot]]))}
    >
      {groups ? (
        reactGroups
      ) : (
        <NavLink href="#a" label="概览">
          概览
        </NavLink>
      )}
    </Sidebar>
  )
  if (!state) return { name, vue: vueSidebar, react: () => reactSidebar }
  return {
    name,
    vue: () =>
      h(VAppShell, { sidebar: state }, { sidebar: vueSidebar, header: () => h(VSidebarTrigger) }),
    react: () => (
      <AppShell sidebar={state} sidebarContent={reactSidebar} header={<SidebarTrigger />} />
    ),
  }
}

export default defineCases('Sidebar', [
  sidebarCase('standalone with groups', []),
  sidebarCase('standalone header and footer', ['header', 'footer']),
  sidebarCase('label overrides the navigation name', [], { props: { label: '文档目录' } }),
  sidebarCase('class and attributes', [], {
    props: { class: 'bg-surface', id: 'docs-sidebar', 'data-test': 'sidebar' },
    groups: false,
  }),
  sidebarCase('standalone icon and wordmark', ['icon', 'wordmark']),
  sidebarCase('standalone icon only', ['icon']),
  sidebarCase('standalone wordmark only', ['wordmark']),
  sidebarCase('header replaces the brand slots', ['header', 'icon', 'wordmark']),
  sidebarCase('closable has no effect outside the drawer', ['header'], {
    props: { closable: false },
  }),
  ...(['expanded', 'rail', 'hidden'] as const).flatMap(state => [
    sidebarCase(`${state} with groups`, [], { state }),
    sidebarCase(`${state} with icon, wordmark and footer`, ['icon', 'wordmark', 'footer'], {
      state,
    }),
    sidebarCase(`${state} with wordmark only`, ['wordmark'], { state, groups: false }),
    sidebarCase(`${state} with icon only`, ['icon'], { state, groups: false }),
    sidebarCase(`${state} with header and footer`, ['header', 'footer'], { state }),
  ]),
  {
    name: 'standalone SidebarLabel',
    vue: () =>
      h('div', [
        h(VSidebarLabel, () => '说明'),
        h(VSidebarLabel, { as: 'div', class: 'flex-1', 'data-x': '' }, () => '块级'),
      ]),
    react: () => (
      <div>
        <SidebarLabel>说明</SidebarLabel>
        <SidebarLabel as="div" className="flex-1" data-x="">
          块级
        </SidebarLabel>
      </div>
    ),
  },
  {
    name: 'SidebarTrigger outside AppShell renders nothing',
    vue: () => h('div', { 'data-host': '' }, [h(VSidebarTrigger)]),
    react: () => (
      <div data-host="">
        <SidebarTrigger />
      </div>
    ),
  },
  {
    name: 'SidebarTrigger with class and attributes',
    vue: () =>
      h(VAppShell, null, {
        header: () => h(VSidebarTrigger, { class: 'me-2', 'aria-label': '菜单', 'data-x': '' }),
      }),
    react: () => (
      <AppShell header={<SidebarTrigger className="me-2" aria-label="菜单" data-x="" />} />
    ),
  },
  {
    name: 'SidebarGroup with class and attributes',
    vue: () =>
      h(VSidebarGroup, { label: '作品库', class: 'mt-2', id: 'library' }, () =>
        h(VNavLink, { href: '#' }, { icon: () => h(VStar), default: () => '收藏' }),
      ),
    react: () => (
      <SidebarGroup label="作品库" className="mt-2" id="library">
        <NavLink href="#" icon={<RStar />}>
          收藏
        </NavLink>
      </SidebarGroup>
    ),
  },
])
