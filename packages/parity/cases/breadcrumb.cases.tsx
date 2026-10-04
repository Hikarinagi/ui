import { defineComponent, h } from 'vue'
import type { ReactNode } from 'react'
import VBreadcrumb from '@hina-ui/vue/components/breadcrumb/Breadcrumb.vue'
import VBreadcrumbItem from '@hina-ui/vue/components/breadcrumb/BreadcrumbItem.vue'
import VBreadcrumbSeparator from '@hina-ui/vue/components/breadcrumb/BreadcrumbSeparator.vue'
import { Breadcrumb } from '@hina-ui/react/components/breadcrumb/Breadcrumb'
import { BreadcrumbItem } from '@hina-ui/react/components/breadcrumb/BreadcrumbItem'
import { BreadcrumbSeparator } from '@hina-ui/react/components/breadcrumb/BreadcrumbSeparator'
import { defineCases } from '../src/cases'

const VRouterLink = defineComponent({
  props: { to: { type: String, required: true } },
  setup:
    (props, { slots }) =>
    () =>
      h('a', { href: props.to, 'data-router': '' }, slots.default?.()),
})

function RouterLink({ to, children, ...rest }: { to: string; children?: ReactNode }) {
  return (
    <a {...rest} href={to} data-router="">
      {children}
    </a>
  )
}

export default defineCases('Breadcrumb', [
  {
    name: 'trail with default separators',
    vue: () =>
      h(VBreadcrumb, null, () => [
        h(VBreadcrumbItem, { href: '/' }, () => '首页'),
        h(VBreadcrumbSeparator),
        h(VBreadcrumbItem, { href: '/components' }, () => '组件'),
        h(VBreadcrumbSeparator),
        h(VBreadcrumbItem, { current: true }, () => 'Button'),
      ]),
    react: () => (
      <Breadcrumb>
        <BreadcrumbItem href="/">首页</BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem href="/components">组件</BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem current>Button</BreadcrumbItem>
      </Breadcrumb>
    ),
  },
  {
    name: 'trail with text separators and a label',
    vue: () =>
      h(VBreadcrumb, { label: '作品位置' }, () => [
        h(VBreadcrumbItem, { href: '#' }, () => '首页'),
        h(VBreadcrumbSeparator, null, () => '·'),
        h(VBreadcrumbItem, { current: true }, () => '第三卷'),
      ]),
    react: () => (
      <Breadcrumb label="作品位置">
        <BreadcrumbItem href="#">首页</BreadcrumbItem>
        <BreadcrumbSeparator>·</BreadcrumbSeparator>
        <BreadcrumbItem current>第三卷</BreadcrumbItem>
      </Breadcrumb>
    ),
  },
  {
    name: 'nav class merge and attributes',
    vue: () => h(VBreadcrumb, { class: 'mb-4', id: 'trail' }, () => []),
    react: () => <Breadcrumb className="mb-4" id="trail" />,
  },
  {
    name: 'separator slot with class',
    vue: () => h(VBreadcrumbSeparator, { class: 'text-muted', id: 's' }, () => h('svg')),
    react: () => (
      <BreadcrumbSeparator className="text-muted" id="s">
        <svg />
      </BreadcrumbSeparator>
    ),
  },
  {
    name: 'default separator icon',
    vue: () => h(VBreadcrumbSeparator),
    react: () => <BreadcrumbSeparator />,
  },
  {
    name: 'link item class merge and attributes',
    vue: () =>
      h(
        VBreadcrumbItem,
        { href: '#', class: 'inline-flex items-center', target: '_blank', id: 'home' },
        () => '首页',
      ),
    react: () => (
      <BreadcrumbItem href="#" className="inline-flex items-center" target="_blank" id="home">
        首页
      </BreadcrumbItem>
    ),
  },
  {
    name: 'current item receives attributes',
    vue: () =>
      h(
        VBreadcrumbItem,
        { current: true, class: 'font-normal', id: 'here', href: '/x' },
        () => '这里',
      ),
    react: () => (
      <BreadcrumbItem current className="font-normal" id="here" href="/x">
        这里
      </BreadcrumbItem>
    ),
  },
  {
    name: 'polymorphic router link',
    vue: () => h(VBreadcrumbItem, { as: VRouterLink, to: '/guide' }, () => '指南'),
    react: () => (
      <BreadcrumbItem as={RouterLink} {...{ to: '/guide' }}>
        指南
      </BreadcrumbItem>
    ),
  },
  {
    name: 'as child',
    vue: () => h(VBreadcrumbItem, { asChild: true }, () => h('a', { href: '/docs' }, 'Docs')),
    react: () => (
      <BreadcrumbItem asChild>
        <a href="/docs">Docs</a>
      </BreadcrumbItem>
    ),
  },
])
