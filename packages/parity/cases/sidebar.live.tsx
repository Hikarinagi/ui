import { h } from 'vue'
import { page, userEvent } from 'vitest/browser'
import { vi } from 'vitest'
import { Star as VStar } from '@hina-ui/vue/../node_modules/@lucide/vue'
import { Star as RStarIcon } from '@hina-ui/react/../node_modules/lucide-react'
import VAppShell from '@hina-ui/vue/components/app-shell/AppShell.vue'
import VSidebar from '@hina-ui/vue/components/sidebar/Sidebar.vue'
import VSidebarGroup from '@hina-ui/vue/components/sidebar/SidebarGroup.vue'
import VSidebarLabel from '@hina-ui/vue/components/sidebar/SidebarLabel.vue'
import VSidebarTrigger from '@hina-ui/vue/components/sidebar/SidebarTrigger.vue'
import VNavLink from '@hina-ui/vue/components/nav-link/NavLink.vue'
import { AppShell, type AppShellProps } from '@hina-ui/react/components/app-shell/AppShell'
import { Sidebar } from '@hina-ui/react/components/sidebar/Sidebar'
import { SidebarGroup } from '@hina-ui/react/components/sidebar/SidebarGroup'
import { SidebarLabel } from '@hina-ui/react/components/sidebar/SidebarLabel'
import { SidebarTrigger } from '@hina-ui/react/components/sidebar/SidebarTrigger'
import { NavLink } from '@hina-ui/react/components/nav-link/NavLink'
import { lucide } from '@hina-ui/react/lib/icon'
import { defineLiveCases, frames, type LiveCase } from '../src/live'

const RStar = lucide(RStarIcon)

export function viewport(width: number, height: number) {
  return async () => {
    await page.viewport(width, height)
    await frames(2)
  }
}

export const desktop = viewport(1280, 800)
export const mobile = viewport(414, 896)

function pending() {
  return document.getAnimations().filter(animation => {
    const target = (animation.effect as KeyframeEffect | null)?.target
    return (
      animation.playState === 'running' &&
      animation.effect?.getTiming().iterations !== Infinity &&
      !target?.closest('.os-scrollbar')
    )
  })
}

export async function idle() {
  await frames(2)
  await vi.waitFor(
    () => {
      if (pending().length || document.querySelector('[data-pressed]')) throw new Error('busy')
    },
    { timeout: 4000 },
  )
  await Promise.allSettled(pending().map(animation => animation.finished))
  await frames(6)
}

function describeFocus() {
  const active = document.activeElement
  if (!active || active === document.body) return 'body'
  const label = active.getAttribute('aria-label') ?? active.textContent?.trim() ?? ''
  return `${active.tagName.toLowerCase()} ${active.getAttribute('role') ?? ''} ${label}`
}

async function stamp() {
  await frames(3)
  const marker = document.createElement('div')
  marker.setAttribute('data-parity-focus', describeFocus())
  document.body.appendChild(marker)
}

export function unstamp() {
  document.querySelector('[data-parity-focus]')?.remove()
}

export function steps(...list: Array<(container: HTMLElement) => Promise<unknown> | unknown>) {
  return async (container: HTMLElement) => {
    for (const step of list) await step(container)
  }
}

export async function pressEscape() {
  await userEvent.keyboard('{Escape}')
}

export function settleOpen() {
  return async () => {
    await vi.waitFor(() => {
      if (document.querySelectorAll('[role="dialog"]').length !== 1) throw new Error('not open')
    })
    await idle()
    await stamp()
  }
}

export function settleClosed() {
  return async () => {
    await vi.waitFor(() => {
      if (document.querySelector('[role="dialog"]')) throw new Error('still open')
    })
    await idle()
    await stamp()
  }
}

export function clickToggle() {
  return async () => {
    await userEvent.click(document.querySelector<HTMLElement>('[aria-label="切换侧栏"]')!)
  }
}

export async function positioned() {
  await vi.waitFor(() => {
    const wrapper = document.querySelector<HTMLElement>(
      '[data-reka-popper-content-wrapper],[data-radix-popper-content-wrapper]',
    )
    if (!wrapper || wrapper.style.transform.includes('-200%')) throw new Error('not positioned')
  })
  await idle()
}

type Options = {
  icon?: boolean
  wordmark?: boolean
  footer?: boolean
  header?: boolean
  closable?: boolean
  shell?: Record<string, unknown>
}

function vueScene({ icon, wordmark, footer, header, closable, shell = {} }: Options) {
  return () =>
    h(VAppShell, shell, {
      header: () => h(VSidebarTrigger),
      sidebar: () =>
        h(VSidebar, closable === false ? { closable: false } : {}, {
          ...(header ? { header: () => h('span', { 'data-header': '' }, 'Hina UI') } : {}),
          ...(icon
            ? {
                icon: ({ state }: { state: string }) =>
                  h(
                    'svg',
                    {
                      viewBox: '0 0 32 32',
                      'data-state-mark': state,
                      role: 'img',
                      'aria-label': 'Hina',
                    },
                    [h('rect', { width: 32, height: 32 })],
                  ),
              }
            : {}),
          ...(wordmark ? { wordmark: () => h('span', { class: 'font-medium' }, 'Hina UI') } : {}),
          ...(footer
            ? {
                footer: () =>
                  h('div', { class: 'flex items-center gap-2' }, [
                    h('span', { class: 'size-8 shrink-0' }, 'A'),
                    h(VSidebarLabel, { class: 'whitespace-nowrap' }, () => '账户设置'),
                  ]),
              }
            : {}),
          default: () => [
            h(
              VNavLink,
              { href: '#overview', label: '概览', active: true },
              {
                icon: () => h(VStar),
                default: () => '概览',
              },
            ),
            h(VSidebarGroup, { label: '组件' }, () => [
              h(
                VNavLink,
                { href: '#button', label: 'Button' },
                {
                  icon: () => h(VStar),
                  default: () => 'Button',
                },
              ),
              h(
                VNavLink,
                { href: '#input', label: 'Input' },
                {
                  icon: () => h(VStar),
                  default: () => 'Input',
                },
              ),
            ]),
            h(VSidebarGroup, { label: '设计语言', defaultOpen: false }, () =>
              h(VNavLink, { href: '#ink', label: '薄墨' }, () => '薄墨'),
            ),
          ],
        }),
      default: () => h('p', '正文内容'),
    })
}

function reactScene({ icon, wordmark, footer, header, closable, shell = {} }: Options) {
  return () => (
    <AppShell
      {...(shell as AppShellProps)}
      header={<SidebarTrigger />}
      sidebarContent={
        <Sidebar
          {...(closable === false ? { closable: false } : {})}
          renderHeader={header ? () => <span data-header="">Hina UI</span> : undefined}
          renderIcon={
            icon
              ? ({ state }) => (
                  <svg viewBox="0 0 32 32" data-state-mark={state} role="img" aria-label="Hina">
                    <rect width={32} height={32} />
                  </svg>
                )
              : undefined
          }
          renderWordmark={wordmark ? () => <span className="font-medium">Hina UI</span> : undefined}
          renderFooter={
            footer
              ? () => (
                  <div className="flex items-center gap-2">
                    <span className="size-8 shrink-0">A</span>
                    <SidebarLabel className="whitespace-nowrap">账户设置</SidebarLabel>
                  </div>
                )
              : undefined
          }
        >
          <NavLink href="#overview" label="概览" active icon={<RStar />}>
            概览
          </NavLink>
          <SidebarGroup label="组件">
            <NavLink href="#button" label="Button" icon={<RStar />}>
              Button
            </NavLink>
            <NavLink href="#input" label="Input" icon={<RStar />}>
              Input
            </NavLink>
          </SidebarGroup>
          <SidebarGroup label="设计语言" defaultOpen={false}>
            <NavLink href="#ink" label="薄墨">
              薄墨
            </NavLink>
          </SidebarGroup>
        </Sidebar>
      }
    >
      <p>正文内容</p>
    </AppShell>
  )
}

function scene(
  name: string,
  options: Options,
  interact: LiveCase['interact'],
  settle: LiveCase['settle'] = idle,
): LiveCase {
  return { name, vue: vueScene(options), react: reactScene(options), interact, settle }
}

const brand = { icon: true, wordmark: true, footer: true }

export async function hoverDrawer() {
  await userEvent.hover(document.querySelector<HTMLElement>('[role="dialog"] nav')!)
}

const openDrawer = steps(mobile, clickToggle(), hoverDrawer)

function standalone(name: string, interact: LiveCase['interact']): LiveCase {
  return {
    name,
    vue: () =>
      h('div', { class: 'flex h-96 w-80' }, [
        h(
          VSidebar,
          { label: '文档目录' },
          {
            wordmark: () => h('span', 'Hina UI'),
            default: () => [
              h(VNavLink, { href: '#a', label: '概览', active: true }, () => '概览'),
              h(VNavLink, { href: '#b', label: '组件' }, () => '组件'),
            ],
          },
        ),
      ]),
    react: () => (
      <div className="flex h-96 w-80">
        <Sidebar label="文档目录" renderWordmark={() => <span>Hina UI</span>}>
          <NavLink href="#a" label="概览" active>
            概览
          </NavLink>
          <NavLink href="#b" label="组件">
            组件
          </NavLink>
        </Sidebar>
      </div>
    ),
    interact,
    settle: idle,
  }
}

export default defineLiveCases('Sidebar', [
  scene(
    'mobile drawer shows the expanded sidebar while the desktop state is rail',
    { ...brand, shell: { sidebar: 'rail', mobileTitle: 'Hina UI' } },
    openDrawer,
    settleOpen(),
  ),
  scene('mobile drawer without brand slots keeps a close row', {}, openDrawer, settleOpen()),
  scene(
    'mobile drawer with custom header and closable false',
    { header: true, closable: false, footer: true },
    openDrawer,
    settleOpen(),
  ),
  scene(
    'mobile drawer header close button closes',
    brand,
    steps(openDrawer, settleOpen(), unstamp, async () => {
      await userEvent.click(
        document.querySelector<HTMLElement>('[role="dialog"] aside [aria-label="关闭"]')!,
      )
    }),
    settleClosed(),
  ),
  standalone('standalone sidebar outside AppShell at desktop width', desktop),
  scene('expanded at desktop width', brand, desktop),
  scene('trigger collapses to rail', brand, steps(desktop, clickToggle())),
  scene('rail returns to expanded', brand, steps(desktop, clickToggle(), idle, clickToggle())),
  scene(
    'collapsible hidden collapses fully',
    { ...brand, shell: { collapsible: 'hidden' } },
    steps(desktop, clickToggle()),
  ),
  scene(
    'hidden returns to expanded',
    { ...brand, shell: { collapsible: 'hidden' } },
    steps(desktop, clickToggle(), idle, clickToggle()),
  ),
  scene(
    'wordmark only collapses the brand region',
    { wordmark: true },
    steps(desktop, clickToggle()),
  ),
  scene('icon only keeps the brand region', { icon: true }, steps(desktop, clickToggle())),
  scene(
    'custom header stays in rail',
    { header: true, footer: true },
    steps(desktop, clickToggle()),
  ),
  scene('controlled rail mounts collapsed', { ...brand, shell: { sidebar: 'rail' } }, desktop),
  scene(
    'group header click collapses the group',
    brand,
    steps(desktop, async (container: HTMLElement) => {
      const button = [...container.querySelectorAll<HTMLElement>('aside button')].find(element =>
        element.textContent?.includes('组件'),
      )!
      await userEvent.click(button)
    }),
  ),
  standalone('standalone sidebar outside AppShell at mobile width', mobile),
])
