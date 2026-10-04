import { h } from 'vue'
import * as V from '@hina-ui/vue/../node_modules/@lucide/vue'
import * as R from '@hina-ui/react/../node_modules/lucide-react'
import VStatistic from '@hina-ui/vue/components/statistic/Statistic.vue'
import VCard from '@hina-ui/vue/components/card/Card.vue'
import VGrid from '@hina-ui/vue/components/grid/Grid.vue'
import { Statistic } from '@hina-ui/react/components/statistic/Statistic'
import { Card } from '@hina-ui/react/components/card/Card'
import { Grid } from '@hina-ui/react/components/grid/Grid'
import { lucide } from '@hina-ui/react/lib/icon'
import { defineCases } from '../src/cases'

const BookOpen = lucide(R.BookOpen)
const Clock = lucide(R.Clock)
const Users = lucide(R.Users)
const Bookmark = lucide(R.Bookmark)

type Props = Record<string, unknown> & { label: string }

function both(name: string, props: Props) {
  return {
    name,
    vue: () => h(VStatistic, props),
    react: () => <Statistic {...(props as Parameters<typeof Statistic>[0])} />,
  }
}

const hero = [
  {
    label: '本月阅读页数',
    value: 12480,
    delta: 0.12,
    deltaLabel: '较上月',
    v: V.BookOpen,
    r: BookOpen,
  },
  {
    label: '阅读时长',
    value: 36.5,
    suffix: '小时',
    delta: -0.08,
    deltaLabel: '较上月',
    v: V.Clock,
    r: Clock,
  },
  { label: '新增关注', value: 212, delta: 0.31, deltaLabel: '较上月', v: V.Users, r: Users },
]

export default defineCases('Statistic', [
  {
    name: 'unit harness with suffix delta label and icon slot',
    vue: () =>
      h(
        VStatistic,
        { label: '本月阅读', value: 12345, suffix: '页', delta: 0.124, deltaLabel: '较上月' },
        { icon: () => h('svg') },
      ),
    react: () => (
      <Statistic
        label="本月阅读"
        value={12345}
        suffix="页"
        delta={0.124}
        deltaLabel="较上月"
        icon={<svg />}
      />
    ),
  },
  both('negative delta is danger', { label: '退货', value: 3, delta: -0.2 }),
  both('invert flips the tone', { label: '退货', value: 3, delta: -0.2, invert: true }),
  both('invert positive is danger', { label: '退货', value: 3, delta: 0.2, invert: true }),
  both('zero delta is neutral without arrow', { label: '退货', value: 3, delta: 0 }),
  both('string value', { label: '状态', value: '正常' }),
  both('null value shows a dash', { label: '状态', value: null }),
  both('missing value shows a dash', { label: '状态' }),
  both('loading hides value and delta', { label: '状态', value: 12, delta: 0.1, loading: true }),
  both('loading without delta', { label: '本月阅读', value: 12480, suffix: '页', loading: true }),
  both('prefix', { label: '余额', value: 2480, prefix: '¥' }),
  both('suffix', { label: '平均时长', value: 42, suffix: '分钟' }),
  both('compact format', { label: '总阅读量', value: 1284000, format: 'compact' }),
  both('percent with precision', {
    label: '完读率',
    value: 0.674,
    format: 'percent',
    precision: 1,
  }),
  both('currency', { label: '本月支出', value: 128.5, format: 'currency', currency: 'CNY' }),
  ...(['sm', 'md', 'lg'] as const).map(size =>
    both(`size ${size}`, { label: '在读', value: 12480, size }),
  ),
  {
    name: 'default slot after delta',
    vue: () =>
      h(VStatistic, { label: '新增书评', value: 86, delta: 0.18, deltaLabel: '较上周' }, () =>
        h('p', { class: 'extra' }, '统计至昨日'),
      ),
    react: () => (
      <Statistic label="新增书评" value={86} delta={0.18} deltaLabel="较上周">
        <p className="extra">统计至昨日</p>
      </Statistic>
    ),
  },
  {
    name: 'icon slot in a card',
    vue: () =>
      h(VCard, { class: 'w-56' }, () =>
        h(VStatistic, { label: '收藏', value: 318 }, { icon: () => h(V.Bookmark) }),
      ),
    react: () => (
      <Card className="w-56">
        <Statistic label="收藏" value={318} icon={<Bookmark />} />
      </Card>
    ),
  },
  {
    name: 'hero grid',
    vue: () =>
      h(VGrid, { cols: 3, gap: 'md', class: 'w-full max-w-3xl' }, () =>
        hero.map(({ v, r: _r, ...props }) =>
          h(VCard, null, () => h(VStatistic, props, { icon: () => h(v) })),
        ),
      ),
    react: () => (
      <Grid cols={3} gap="md" className="w-full max-w-3xl">
        {hero.map(({ v: _v, r: Icon, ...props }) => (
          <Card key={props.label}>
            <Statistic {...props} icon={<Icon />} />
          </Card>
        ))}
      </Grid>
    ),
  },
  {
    name: 'attributes reach the root',
    vue: () => h(VStatistic, { label: '在读', value: 1, id: 's', 'data-x': '1', class: 'p-2' }),
    react: () => <Statistic label="在读" value={1} id="s" data-x="1" className="p-2" />,
  },
])
