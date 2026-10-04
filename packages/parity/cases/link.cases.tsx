import { h } from 'vue'
import VLink from '@hina-ui/vue/components/link/Link.vue'
import { Link } from '@hina-ui/react/components/link/Link'
import { defineCases } from '../src/cases'

export default defineCases('Link', [
  {
    name: 'default accent',
    vue: () => h(VLink, { href: '#usage' }, () => '回到用法一节'),
    react: () => <Link href="#usage">回到用法一节</Link>,
  },
  {
    name: 'neutral tone',
    vue: () => h(VLink, { href: '#tones', tone: 'neutral' }, () => '中性色链接'),
    react: () => (
      <Link href="#tones" tone="neutral">
        中性色链接
      </Link>
    ),
  },
  {
    name: 'underline with external attributes',
    vue: () =>
      h(
        VLink,
        { href: 'https://example.com', target: '_blank', rel: 'noreferrer', underline: true },
        () => '仓库首页',
      ),
    react: () => (
      <Link href="https://example.com" target="_blank" rel="noreferrer" underline>
        仓库首页
      </Link>
    ),
  },
  {
    name: 'underline false and class merge',
    vue: () =>
      h(VLink, { href: '#', underline: false, class: 'cursor-default font-medium' }, () => '链接'),
    react: () => (
      <Link href="#" underline={false} className="cursor-default font-medium">
        链接
      </Link>
    ),
  },
  {
    name: 'as button',
    vue: () => h(VLink, { as: 'button', type: 'button' }, () => '按钮样式的链接'),
    react: () => (
      <Link as="button" type="button">
        按钮样式的链接
      </Link>
    ),
  },
  {
    name: 'as child',
    vue: () =>
      h(VLink, { asChild: true, underline: true }, () => h('a', { href: '/docs' }, 'Docs')),
    react: () => (
      <Link asChild underline>
        <a href="/docs">Docs</a>
      </Link>
    ),
  },
])
