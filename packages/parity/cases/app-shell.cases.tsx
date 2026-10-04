import { h } from 'vue'
import VAppShell from '@hina-ui/vue/components/app-shell/AppShell.vue'
import VSidebar from '@hina-ui/vue/components/sidebar/Sidebar.vue'
import VSidebarTrigger from '@hina-ui/vue/components/sidebar/SidebarTrigger.vue'
import VNavLink from '@hina-ui/vue/components/nav-link/NavLink.vue'
import { AppShell } from '@hina-ui/react/components/app-shell/AppShell'
import { Sidebar } from '@hina-ui/react/components/sidebar/Sidebar'
import { SidebarTrigger } from '@hina-ui/react/components/sidebar/SidebarTrigger'
import { NavLink } from '@hina-ui/react/components/nav-link/NavLink'
import { defineCases } from '../src/cases'

const vueSidebar = () =>
  h(VSidebar, null, () => h(VNavLink, { href: '#a', active: true, label: '组件' }, () => '组件'))
const reactSidebar = (
  <Sidebar>
    <NavLink href="#a" active label="组件">
      组件
    </NavLink>
  </Sidebar>
)

export default defineCases('AppShell', [
  {
    name: 'header, sidebar and main',
    vue: () =>
      h(VAppShell, null, {
        header: () => h('span', 'Hina Docs'),
        sidebar: vueSidebar,
        default: () => h('p', '正文内容'),
      }),
    react: () => (
      <AppShell header={<span>Hina Docs</span>} sidebarContent={reactSidebar}>
        <p>正文内容</p>
      </AppShell>
    ),
  },
  {
    name: 'banner spans the shell above sidebar and content',
    vue: () =>
      h(VAppShell, null, {
        banner: () => h('p', '公告'),
        sidebar: () => h(VSidebar),
        default: () => h('p', '正文'),
      }),
    react: () => (
      <AppShell banner={<p>公告</p>} sidebarContent={<Sidebar />}>
        <p>正文</p>
      </AppShell>
    ),
  },
  {
    name: 'banner, header with trigger, sidebar and main',
    vue: () =>
      h(
        VAppShell,
        { collapsible: 'hidden' },
        {
          banner: () => h('p', '公告'),
          sidebar: vueSidebar,
          header: () => [h(VSidebarTrigger), h('h2', '首页')],
          default: () => h('p', '正文'),
        },
      ),
    react: () => (
      <AppShell
        collapsible="hidden"
        banner={<p>公告</p>}
        sidebarContent={reactSidebar}
        header={
          <>
            <SidebarTrigger />
            <h2>首页</h2>
          </>
        }
      >
        <p>正文</p>
      </AppShell>
    ),
  },
  {
    name: 'main only',
    vue: () => h(VAppShell, null, { default: () => h('p', '仅正文') }),
    react: () => (
      <AppShell>
        <p>仅正文</p>
      </AppShell>
    ),
  },
  {
    name: 'empty shell',
    vue: () => h(VAppShell),
    react: () => <AppShell />,
  },
  {
    name: 'restoreKey, class and mobileTitle',
    vue: () =>
      h(
        VAppShell,
        { restoreKey: 'docs', class: 'h-64 rounded-lg', mobileTitle: 'Hina Studio' },
        { sidebar: vueSidebar, default: () => h('p', '正文') },
      ),
    react: () => (
      <AppShell
        restoreKey="docs"
        className="h-64 rounded-lg"
        mobileTitle="Hina Studio"
        sidebarContent={reactSidebar}
      >
        <p>正文</p>
      </AppShell>
    ),
  },
  {
    name: 'controlled rail state with open mobile model before the portal mounts',
    vue: () =>
      h(
        VAppShell,
        { sidebar: 'rail', mobileOpen: true, autoClose: false },
        { sidebar: vueSidebar, header: () => h(VSidebarTrigger), default: () => h('p', '正文') },
      ),
    react: () => (
      <AppShell
        sidebar="rail"
        mobileOpen
        autoClose={false}
        sidebarContent={reactSidebar}
        header={<SidebarTrigger />}
      >
        <p>正文</p>
      </AppShell>
    ),
  },
  {
    name: 'hidden state',
    vue: () =>
      h(
        VAppShell,
        { sidebar: 'hidden', collapsible: 'hidden' },
        { sidebar: vueSidebar, default: () => h('p', '正文') },
      ),
    react: () => (
      <AppShell sidebar="hidden" collapsible="hidden" sidebarContent={reactSidebar}>
        <p>正文</p>
      </AppShell>
    ),
  },
  {
    name: 'fallthrough attributes are not rendered',
    vue: () =>
      h(
        VAppShell,
        { dir: 'rtl', id: 'shell', 'data-density': 'compact' },
        { default: () => h('p', '正文') },
      ),
    react: () => (
      <AppShell {...{ dir: 'rtl', id: 'shell' }} data-density="compact">
        <p>正文</p>
      </AppShell>
    ),
  },
])
