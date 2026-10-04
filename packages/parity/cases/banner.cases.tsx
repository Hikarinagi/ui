import { h, type Component } from 'vue'
import { Sparkles as VSparkles } from '@hina-ui/vue/../node_modules/@lucide/vue'
import { Sparkles } from '@hina-ui/react/../node_modules/lucide-react'
import VBannerComponent from '@hina-ui/vue/components/banner/Banner.vue'
import VLink from '@hina-ui/vue/components/link/Link.vue'
import VButton from '@hina-ui/vue/components/button/Button.vue'
import { Banner } from '@hina-ui/react/components/banner/Banner'
import { Link } from '@hina-ui/react/components/link/Link'
import { Button } from '@hina-ui/react/components/button/Button'
import { lucide } from '@hina-ui/react/lib/icon'
import { defineCases } from '../src/cases'

const VBanner = VBannerComponent as unknown as Component
const SparklesIcon = lucide(Sparkles)
const tones = ['neutral', 'accent', 'info', 'success', 'warning', 'danger'] as const

type Notice = { text: string; tone?: (typeof tones)[number]; link?: string }
const notices: Notice[] = [{ text: '一' }, { text: '二' }, { text: '三' }]
const mixed: Notice[] = [
  { text: 'Hina UI 1.2 已发布。', link: '查看更新说明' },
  { text: '本站将于 3 月 1 日 02:00 至 04:00 停机维护。', tone: 'warning' },
  { text: '周年活动进行中。', link: '了解详情' },
]
const vueMixed = [mixed[0], mixed[1], { ...mixed[2], icon: VSparkles }]
const reactMixed = [mixed[0], mixed[1], { ...mixed[2], icon: SparklesIcon }]

const vueItem = ({ item }: { item: Notice }) => [
  item.text,
  item.link ? h(VLink, { href: '#', underline: true }, () => item.link) : null,
]
const reactItem = ({ item }: { item: Notice }) => (
  <>
    {item.text}
    {item.link ? (
      <Link href="#" underline>
        {item.link}
      </Link>
    ) : null}
  </>
)

export default defineCases('Banner', [
  {
    name: 'default accent bar with icon',
    vue: () => h(VBanner, null, () => '新版本已发布。'),
    react: () => <Banner>新版本已发布。</Banner>,
  },
  ...tones.map(tone => ({
    name: `${tone} tone`,
    vue: () => h(VBanner, { tone }, () => '新版本已发布。'),
    react: () => <Banner tone={tone}>新版本已发布。</Banner>,
  })),
  {
    name: 'icon off with actions slot',
    vue: () =>
      h(
        VBanner,
        { tone: 'warning', icon: false },
        {
          default: () => '新版本已发布。',
          actions: () => h(VButton, { size: 'sm', tone: 'neutral' }, () => '延长'),
        },
      ),
    react: () => (
      <Banner
        tone="warning"
        icon={false}
        actions={
          <Button size="sm" tone="neutral">
            延长
          </Button>
        }
      >
        新版本已发布。
      </Banner>
    ),
  },
  {
    name: 'closable with link content',
    vue: () =>
      h(VBanner, { closable: true }, () => [
        'Hina UI 1.2 已发布。',
        h(VLink, { href: '#', underline: true }, () => '查看更新说明'),
      ]),
    react: () => (
      <Banner closable>
        Hina UI 1.2 已发布。
        <Link href="#" underline>
          查看更新说明
        </Link>
      </Banner>
    ),
  },
  {
    name: 'icon slot',
    vue: () =>
      h(VBanner, null, {
        default: () => '周年活动进行中。',
        icon: () => h(VSparkles, { class: 'size-4 shrink-0' }),
      }),
    react: () => (
      <Banner icon={<SparklesIcon className="size-4 shrink-0" />}>周年活动进行中。</Banner>
    ),
  },
  {
    name: 'closed banner renders nothing',
    vue: () => h('div', null, [h(VBanner, { open: false }, () => '新版本已发布。')]),
    react: () => (
      <div>
        <Banner open={false}>新版本已发布。</Banner>
      </div>
    ),
  },
  {
    name: 'class goes to the bar, attributes fall through to the shell',
    vue: () =>
      h(VBanner, { class: 'rounded-md', id: 'notice', 'data-test': 'x' }, () => '新版本已发布。'),
    react: () => (
      <Banner className="rounded-md" id="notice" data-test="x">
        新版本已发布。
      </Banner>
    ),
  },
  {
    name: 'items render only the current notice with controls and a polite live region',
    vue: () => h(VBanner, { items: notices }, { item: vueItem }),
    react: () => <Banner items={notices} renderItem={reactItem} />,
  },
  {
    name: 'items with closable',
    vue: () => h(VBanner, { items: notices, closable: true }, { item: vueItem }),
    react: () => <Banner items={notices} closable renderItem={reactItem} />,
  },
  {
    name: 'single item has no controls and no live region',
    vue: () => h(VBanner, { items: [notices[0]] }, { item: vueItem }),
    react: () => <Banner items={[notices[0]!]} renderItem={reactItem} />,
  },
  {
    name: 'autoplay has no live region',
    vue: () => h(VBanner, { items: notices, autoplay: 4000, tone: 'info' }, { item: vueItem }),
    react: () => <Banner items={notices} autoplay={4000} tone="info" renderItem={reactItem} />,
  },
  ...[0, 1, 2, 3, -1].map(index => ({
    name: `items at index ${index} with per-item tone and icon`,
    vue: () => h(VBanner, { items: vueMixed, index, closable: true }, { item: vueItem }),
    react: () => <Banner items={reactMixed} index={index} closable renderItem={reactItem} />,
  })),
  {
    name: 'defaultIndex',
    vue: () => h(VBanner, { items: vueMixed, index: 1 }, { item: vueItem }),
    react: () => <Banner items={reactMixed} defaultIndex={1} renderItem={reactItem} />,
  },
  {
    name: 'icon slot wins over per-item icons',
    vue: () =>
      h(
        VBanner,
        { items: vueMixed, index: 2 },
        { item: vueItem, icon: () => h('i', { 'data-probe': '' }) },
      ),
    react: () => (
      <Banner items={reactMixed} index={2} icon={<i data-probe="" />} renderItem={reactItem} />
    ),
  },
  {
    name: 'items with icon off and actions',
    vue: () =>
      h(
        VBanner,
        { items: notices, icon: false },
        { item: vueItem, actions: () => h('button', { type: 'button' }, '查看') },
      ),
    react: () => (
      <Banner
        items={notices}
        icon={false}
        actions={<button type="button">查看</button>}
        renderItem={reactItem}
      />
    ),
  },
  {
    name: 'empty items',
    vue: () => h(VBanner, { items: [] }, { item: () => '空' }),
    react: () => <Banner items={[]} renderItem={() => '空'} />,
  },
])
