import { h } from 'vue'
import { userEvent } from 'vitest/browser'
import { House as VHouse } from '@hina-ui/vue/../node_modules/@lucide/vue'
import { House as RHouseIcon } from '@hina-ui/react/../node_modules/lucide-react'
import VAppShell from '@hina-ui/vue/components/app-shell/AppShell.vue'
import VSidebar from '@hina-ui/vue/components/sidebar/Sidebar.vue'
import VSidebarTrigger from '@hina-ui/vue/components/sidebar/SidebarTrigger.vue'
import VNavLink from '@hina-ui/vue/components/nav-link/NavLink.vue'
import { AppShell, type AppShellProps } from '@hina-ui/react/components/app-shell/AppShell'
import { Sidebar } from '@hina-ui/react/components/sidebar/Sidebar'
import { SidebarTrigger } from '@hina-ui/react/components/sidebar/SidebarTrigger'
import { NavLink } from '@hina-ui/react/components/nav-link/NavLink'
import { lucide } from '@hina-ui/react/lib/icon'
import { defineLiveCases, type LiveCase } from '../src/live'
import {
  clickToggle,
  desktop,
  hoverDrawer,
  idle,
  mobile,
  pressEscape,
  settleClosed,
  settleOpen,
  steps,
  unstamp,
} from './sidebar.live'

const RHouse = lucide(RHouseIcon)

type Options = {
  shell?: Record<string, unknown>
  sidebar?: Record<string, unknown>
  banner?: boolean
  header?: boolean
  withSidebar?: boolean
}

function scene(
  name: string,
  { shell = {}, sidebar = {}, banner = true, header = true, withSidebar = true }: Options,
  interact: LiveCase['interact'],
  settle: LiveCase['settle'] = idle,
): LiveCase {
  return {
    name,
    vue: () =>
      h(VAppShell, shell, {
        ...(banner ? { banner: () => h('p', { class: 'p-2' }, 'Hina UI 1.2 已发布。') } : {}),
        ...(header
          ? { header: () => [h(VSidebarTrigger), h('h2', { class: 'text-sm' }, '首页')] }
          : {}),
        ...(withSidebar
          ? {
              sidebar: () =>
                h(VSidebar, sidebar, {
                  wordmark: () => h('span', 'Hina UI'),
                  default: () => [
                    h(
                      VNavLink,
                      { href: '#home', label: '首页', active: true },
                      { icon: () => h(VHouse), default: () => '首页' },
                    ),
                    h(VNavLink, { href: '#shelf', label: '我的书架' }, () => '我的书架'),
                  ],
                }),
            }
          : {}),
        default: () =>
          h(
            'div',
            { class: 'p-6' },
            Array.from({ length: 30 }, (_, index) =>
              h('p', { key: index }, `第 ${index + 1} 段正文。`),
            ),
          ),
      }),
    react: () => (
      <AppShell
        {...(shell as AppShellProps)}
        className={shell.class as string | undefined}
        banner={banner ? <p className="p-2">Hina UI 1.2 已发布。</p> : undefined}
        header={
          header ? (
            <>
              <SidebarTrigger />
              <h2 className="text-sm">首页</h2>
            </>
          ) : undefined
        }
        sidebarContent={
          withSidebar ? (
            <Sidebar {...sidebar} renderWordmark={() => <span>Hina UI</span>}>
              <NavLink href="#home" label="首页" active icon={<RHouse />}>
                首页
              </NavLink>
              <NavLink href="#shelf" label="我的书架">
                我的书架
              </NavLink>
            </Sidebar>
          ) : undefined
        }
      >
        <div className="p-6">
          {Array.from({ length: 30 }, (_, index) => (
            <p key={index}>{`第 ${index + 1} 段正文。`}</p>
          ))}
        </div>
      </AppShell>
    ),
    interact,
    settle,
  }
}

async function clickScrimEnd() {
  const scrim = document.querySelector<HTMLElement>('.hn-scrim')!
  const { width } = scrim.getBoundingClientRect()
  await userEvent.click(scrim, { force: true, position: { x: width - 8, y: 8 } })
}

const openDrawer = steps(mobile, clickToggle(), hoverDrawer)
const opened = settleOpen()

export default defineLiveCases('AppShell', [
  scene('mobile drawer opens with the default title', {}, openDrawer, opened),
  scene(
    'mobile drawer uses mobileTitle as its name',
    { shell: { mobileTitle: 'Hina Studio' } },
    openDrawer,
    opened,
  ),
  scene(
    'mobile drawer without the close button',
    { shell: { mobileTitle: 'Hina Studio' }, sidebar: { closable: false } },
    openDrawer,
    opened,
  ),
  scene(
    'mobile drawer Escape closes and returns focus to the trigger',
    {},
    steps(openDrawer, opened, unstamp, pressEscape),
    settleClosed(),
  ),
  scene(
    'mobile drawer scrim click closes',
    {},
    steps(openDrawer, opened, unstamp, clickScrimEnd),
    settleClosed(),
  ),
  scene(
    'controlled mobileOpen renders the drawer open',
    { shell: { mobileOpen: true } },
    steps(mobile, hoverDrawer),
    opened,
  ),
  scene(
    'main only at desktop width',
    { banner: false, header: false, withSidebar: false },
    desktop,
  ),
  scene('desktop banner, header and sidebar', {}, desktop),
  scene(
    'desktop trigger hides the sidebar with collapsible hidden',
    { shell: { collapsible: 'hidden', restoreKey: 'docs' } },
    steps(desktop, clickToggle()),
  ),
  scene(
    'desktop trigger collapses to rail',
    { shell: { class: 'h-96' } },
    steps(desktop, clickToggle()),
  ),
  scene('main only at mobile width', { banner: false, header: false, withSidebar: false }, mobile),
])
