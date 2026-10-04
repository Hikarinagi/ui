import { h } from 'vue'
import { userEvent } from 'vitest/browser'
import { House as VHouse, Star as VStar } from '@hina-ui/vue/../node_modules/@lucide/vue'
import { House as RHouseIcon, Star as RStarIcon } from '@hina-ui/react/../node_modules/lucide-react'
import VAppShell from '@hina-ui/vue/components/app-shell/AppShell.vue'
import VSidebar from '@hina-ui/vue/components/sidebar/Sidebar.vue'
import VSidebarTrigger from '@hina-ui/vue/components/sidebar/SidebarTrigger.vue'
import VNavLink from '@hina-ui/vue/components/nav-link/NavLink.vue'
import { AppShell } from '@hina-ui/react/components/app-shell/AppShell'
import { Sidebar } from '@hina-ui/react/components/sidebar/Sidebar'
import { SidebarTrigger } from '@hina-ui/react/components/sidebar/SidebarTrigger'
import { NavLink } from '@hina-ui/react/components/nav-link/NavLink'
import { lucide } from '@hina-ui/react/lib/icon'
import type { SidebarState } from '@hina-ui/react/components/sidebar/context'
import { defineLiveCases, type LiveCase } from '../src/live'
import {
  clickToggle,
  desktop,
  hoverDrawer,
  idle,
  mobile,
  positioned,
  settleOpen,
  steps,
} from './sidebar.live'

const RHouse = lucide(RHouseIcon)
const RStar = lucide(RStarIcon)

function scene(
  name: string,
  state: SidebarState | undefined,
  interact: LiveCase['interact'],
  settle: LiveCase['settle'] = idle,
): LiveCase {
  return {
    name,
    vue: () =>
      h(VAppShell, state ? { sidebar: state } : null, {
        header: () => h(VSidebarTrigger),
        sidebar: () =>
          h(VSidebar, null, () => [
            h(
              VNavLink,
              { href: '#overview', label: '概览', active: true },
              { icon: () => h(VHouse), default: () => '概览' },
            ),
            h(
              VNavLink,
              { href: '#components', label: '组件' },
              { icon: () => h(VStar), default: () => '组件' },
            ),
            h(VNavLink, { href: '#plain' }, { icon: () => h(VStar), default: () => '无标签' }),
          ]),
        default: () => h('p', '正文内容'),
      }),
    react: () => (
      <AppShell
        {...(state ? { sidebar: state } : {})}
        header={<SidebarTrigger />}
        sidebarContent={
          <Sidebar>
            <NavLink href="#overview" label="概览" active icon={<RHouse />}>
              概览
            </NavLink>
            <NavLink href="#components" label="组件" icon={<RStar />}>
              组件
            </NavLink>
            <NavLink href="#plain" icon={<RStar />}>
              无标签
            </NavLink>
          </Sidebar>
        }
      >
        <p>正文内容</p>
      </AppShell>
    ),
    interact,
    settle,
  }
}

function standalone(name: string, interact: LiveCase['interact']): LiveCase {
  return {
    name,
    vue: () =>
      h('nav', { class: 'flex w-56 flex-col' }, [
        h(VNavLink, { href: '#a', label: '概览', active: true }, () => '概览'),
        h(VNavLink, { href: '#b', label: '收藏' }, () => '收藏'),
        h(VNavLink, { href: '#c', disabled: true }, () => '创作中心'),
      ]),
    react: () => (
      <nav className="flex w-56 flex-col">
        <NavLink href="#a" label="概览" active>
          概览
        </NavLink>
        <NavLink href="#b" label="收藏">
          收藏
        </NavLink>
        <NavLink href="#c" disabled>
          创作中心
        </NavLink>
      </nav>
    ),
    interact,
    settle: idle,
  }
}

const hoverLink = (selector: string) => async () => {
  await userEvent.hover(document.querySelector<HTMLElement>(selector)!)
}

const parkPointer = async () => {
  await userEvent.hover(document.querySelector<HTMLElement>('main p')!)
}

export default defineLiveCases('NavLink', [
  scene(
    'drawer links stay labelled and show no tooltip on hover',
    'rail',
    steps(mobile, clickToggle(), hoverDrawer, hoverLink('[role="dialog"] a[href="#components"]')),
    settleOpen(),
  ),
  standalone(
    'standalone links ignore the label on hover',
    steps(desktop, hoverLink('a[href="#b"]')),
  ),
  scene(
    'expanded sidebar shows no tooltip on hover',
    'expanded',
    steps(desktop, hoverLink('aside a[href="#components"]')),
  ),
  scene(
    'rail tooltip opens on keyboard focus',
    'rail',
    steps(desktop, parkPointer, async () => {
      await userEvent.tab()
    }),
    positioned,
  ),
  scene(
    'rail link without a label shows no tooltip',
    'rail',
    steps(desktop, parkPointer, hoverLink('aside a[href="#plain"]')),
  ),
  scene(
    'rail tooltip opens on hover',
    'rail',
    steps(desktop, parkPointer, hoverLink('aside a[href="#components"]')),
    positioned,
  ),
  scene(
    'collapsing to rail names links and enables tooltips',
    undefined,
    steps(desktop, parkPointer, clickToggle(), idle, hoverLink('aside a[href="#overview"]')),
    positioned,
  ),
  standalone('standalone links at mobile width', mobile),
])
