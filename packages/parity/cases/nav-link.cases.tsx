import { defineComponent, h, type PropType } from 'vue'
import { House as VHouse, Star as VStar } from '@hina-ui/vue/../node_modules/@lucide/vue'
import { House as RHouseIcon, Star as RStarIcon } from '@hina-ui/react/../node_modules/lucide-react'
import type { ReactNode } from 'react'
import VNavLink from '@hina-ui/vue/components/nav-link/NavLink.vue'
import VAppShell from '@hina-ui/vue/components/app-shell/AppShell.vue'
import VSidebar from '@hina-ui/vue/components/sidebar/Sidebar.vue'
import VStack from '@hina-ui/vue/components/stack/Stack.vue'
import { NavLink } from '@hina-ui/react/components/nav-link/NavLink'
import { AppShell } from '@hina-ui/react/components/app-shell/AppShell'
import { Sidebar } from '@hina-ui/react/components/sidebar/Sidebar'
import { Stack } from '@hina-ui/react/components/stack/Stack'
import { lucide } from '@hina-ui/react/lib/icon'
import { defineCases } from '../src/cases'

const RHouse = lucide(RHouseIcon)
const RStar = lucide(RStarIcon)

const VRouterStub = defineComponent({
  props: { to: { type: String as PropType<string>, required: true } },
  setup:
    (props, { slots }) =>
    () =>
      h('a', { href: props.to, 'data-router': '' }, slots.default?.()),
})

function RRouterStub({ to, children, ...rest }: { to: string; children?: ReactNode }) {
  return (
    <a {...rest} href={to} data-router="">
      {children}
    </a>
  )
}

function vueShell(state: 'expanded' | 'rail' | 'hidden', links: () => unknown) {
  return () => h(VAppShell, { sidebar: state }, { sidebar: () => h(VSidebar, null, () => links()) })
}

export default defineCases('NavLink', [
  {
    name: 'default anchor with href',
    vue: () => h(VNavLink, { href: '/docs' }, () => '组件'),
    react: () => <NavLink href="/docs">组件</NavLink>,
  },
  {
    name: 'active marks the current page',
    vue: () => h(VNavLink, { href: '/docs', active: true }, () => '组件'),
    react: () => (
      <NavLink href="/docs" active>
        组件
      </NavLink>
    ),
  },
  {
    name: 'disabled leaves the tab order',
    vue: () => h(VNavLink, { href: '/x', disabled: true }, () => '创作中心'),
    react: () => (
      <NavLink href="/x" disabled>
        创作中心
      </NavLink>
    ),
  },
  {
    name: 'disabled without content',
    vue: () => h(VNavLink, { href: '/x', disabled: true }),
    react: () => <NavLink href="/x" disabled />,
  },
  {
    name: 'icon slot precedes the label',
    vue: () =>
      h(VNavLink, { href: '#', active: true }, { icon: () => h(VHouse), default: () => '概览' }),
    react: () => (
      <NavLink href="#" active icon={<RHouse />}>
        概览
      </NavLink>
    ),
  },
  {
    name: 'class and attributes',
    vue: () =>
      h(
        VNavLink,
        { href: '#', class: 'w-40', target: '_blank', 'data-test': 'x', id: 'link' },
        () => '外链',
      ),
    react: () => (
      <NavLink href="#" className="w-40" target="_blank" data-test="x" id="link">
        外链
      </NavLink>
    ),
  },
  {
    name: 'component attributes override caller attributes',
    vue: () =>
      h(
        VNavLink,
        { href: '#', 'aria-label': '外部', tabindex: 0, 'data-state': 'x', 'aria-current': 'step' },
        () => '概览',
      ),
    react: () => (
      <NavLink href="#" aria-label="外部" tabIndex={0} data-state="x" aria-current="step">
        概览
      </NavLink>
    ),
  },
  {
    name: 'label outside the sidebar renders no tooltip and no accessible name',
    vue: () => h(VNavLink, { href: '#', label: '概览' }, () => '概览'),
    react: () => (
      <NavLink href="#" label="概览">
        概览
      </NavLink>
    ),
  },
  {
    name: 'as renders a router component with forwarded props',
    vue: () =>
      h(
        VNavLink,
        { as: VRouterStub, to: '/guide' },
        { icon: () => h('svg', { class: 'nav-icon' }), default: () => '指南' },
      ),
    react: () => (
      <NavLink as={RRouterStub} {...{ to: '/guide' }} icon={<svg className="nav-icon" />}>
        指南
      </NavLink>
    ),
  },
  {
    name: 'as renders another tag',
    vue: () => h(VNavLink, { as: 'button', type: 'button' }, () => '按钮'),
    react: () => (
      <NavLink as="button" type="button">
        按钮
      </NavLink>
    ),
  },
  {
    name: 'asChild renders through the child element',
    vue: () =>
      h(VNavLink, { asChild: true, active: true }, () => h('a', { href: '/child' }, '子元素')),
    react: () => (
      <NavLink asChild active>
        <a href="/child">子元素</a>
      </NavLink>
    ),
  },
  {
    name: 'asChild with an icon slot merges onto the icon',
    vue: () =>
      h(
        VNavLink,
        { asChild: true, href: '/child' },
        { icon: () => h(VHouse), default: () => h('a', { href: '/child' }, '子元素') },
      ),
    react: () => (
      <NavLink asChild href="/child" icon={<RHouse />}>
        <a href="/child">子元素</a>
      </NavLink>
    ),
  },
  {
    name: 'asChild inside a rail sidebar',
    vue: vueShell('rail', () =>
      h(VNavLink, { asChild: true, label: '概览' }, () => h('a', { href: '/child' }, '概览')),
    ),
    react: () => (
      <AppShell
        sidebar="rail"
        sidebarContent={
          <Sidebar>
            <NavLink asChild label="概览">
              <a href="/child">概览</a>
            </NavLink>
          </Sidebar>
        }
      />
    ),
  },
  {
    name: 'expanded sidebar keeps the label visible',
    vue: vueShell('expanded', () =>
      h(
        VNavLink,
        { href: '#a', label: '收藏夹', active: true },
        {
          icon: () => h(VStar),
          default: () => '收藏夹',
        },
      ),
    ),
    react: () => (
      <AppShell
        sidebar="expanded"
        sidebarContent={
          <Sidebar>
            <NavLink href="#a" label="收藏夹" active icon={<RStar />}>
              收藏夹
            </NavLink>
          </Sidebar>
        }
      />
    ),
  },
  {
    name: 'rail sidebar hides the label and names the link',
    vue: vueShell('rail', () => [
      h(
        VNavLink,
        { href: '#a', label: '收藏夹', active: true },
        {
          icon: () => h(VStar),
          default: () => '收藏夹',
        },
      ),
      h(VNavLink, { href: '#b' }, { icon: () => h(VHouse), default: () => '无标签' }),
      h(VNavLink, { href: '#c', label: '停用', disabled: true }, () => '停用'),
    ]),
    react: () => (
      <AppShell
        sidebar="rail"
        sidebarContent={
          <Sidebar>
            <NavLink href="#a" label="收藏夹" active icon={<RStar />}>
              收藏夹
            </NavLink>
            <NavLink href="#b" icon={<RHouse />}>
              无标签
            </NavLink>
            <NavLink href="#c" label="停用" disabled>
              停用
            </NavLink>
          </Sidebar>
        }
      />
    ),
  },
  {
    name: 'hidden sidebar keeps the label markup',
    vue: vueShell('hidden', () => h(VNavLink, { href: '#a', label: '收藏夹' }, () => '收藏夹')),
    react: () => (
      <AppShell
        sidebar="hidden"
        sidebarContent={
          <Sidebar>
            <NavLink href="#a" label="收藏夹">
              收藏夹
            </NavLink>
          </Sidebar>
        }
      />
    ),
  },
  {
    name: 'stacked navigation list',
    vue: () =>
      h(VStack, { gap: 'none', as: 'nav', class: 'w-full max-w-56' }, () => [
        h(VNavLink, { href: '#' }, () => '概览'),
        h(VNavLink, { href: '#', active: true }, () => '我的书架'),
        h(VNavLink, { href: '#', disabled: true }, () => '创作中心'),
      ]),
    react: () => (
      <Stack gap="none" as="nav" className="w-full max-w-56">
        <NavLink href="#">概览</NavLink>
        <NavLink href="#" active>
          我的书架
        </NavLink>
        <NavLink href="#" disabled>
          创作中心
        </NavLink>
      </Stack>
    ),
  },
])
