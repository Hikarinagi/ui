import { defineComponent, h } from 'vue'
import VMeterGroup from '@hina-ui/vue/components/meter-group/MeterGroup.vue'
import { provideUiLocale, enUS as vueEnUS } from '@hina-ui/vue/locale'
import { MeterGroup } from '@hina-ui/react/components/meter-group/MeterGroup'
import type { MeterItem } from '@hina-ui/react/components/meter-group/types'
import { UiLocaleProvider, enUS } from '@hina-ui/react/locale'
import { defineCases } from '../src/cases'

const storage: MeterItem[] = [
  { label: '文档', value: 42 },
  { label: '图片', value: 27 },
  { label: '视频', value: 13 },
  { label: '其他', value: 8 },
]

const reading: MeterItem[] = [
  { label: '已读', value: 56 },
  { label: '在读', value: 19 },
]

const many: MeterItem[] = Array.from({ length: 8 }, (_, index) => ({
  label: `第 ${index + 1} 项`,
  value: 10,
}))

const formatGb = (value: number) => `${value} GB`
const formatRatio = (value: number, max: number) => `${value} / ${max} GB`

export default defineCases('MeterGroup', [
  {
    name: 'hero with label and total',
    vue: () => h(VMeterGroup, { label: '存储空间', items: storage, class: 'w-96' }),
    react: () => <MeterGroup label="存储空间" items={storage} className="w-96" />,
  },
  {
    name: 'basic without label',
    vue: () => h(VMeterGroup, { items: reading, class: 'w-96' }),
    react: () => <MeterGroup items={reading} className="w-96" />,
  },
  {
    name: 'unit test tones and labels',
    vue: () =>
      h(VMeterGroup, {
        label: '存储空间',
        items: [
          { label: '文档', value: 40 },
          { label: '图片', value: 25, tone: 'warning' },
        ],
      }),
    react: () => (
      <MeterGroup
        label="存储空间"
        items={[
          { label: '文档', value: 40 },
          { label: '图片', value: 25, tone: 'warning' },
        ]}
      />
    ),
  },
  {
    name: 'explicit tones',
    vue: () =>
      h(VMeterGroup, {
        label: '审核结果',
        items: [
          { label: '通过', value: 62, tone: 'success' },
          { label: '待定', value: 21, tone: 'warning' },
          { label: '退回', value: 9, tone: 'danger' },
        ],
      }),
    react: () => (
      <MeterGroup
        label="审核结果"
        items={[
          { label: '通过', value: 62, tone: 'success' },
          { label: '待定', value: 21, tone: 'warning' },
          { label: '退回', value: 9, tone: 'danger' },
        ]}
      />
    ),
  },
  {
    name: 'tone sequence wraps around',
    vue: () => h(VMeterGroup, { items: many }),
    react: () => <MeterGroup items={many} />,
  },
  {
    name: 'format and max',
    vue: () =>
      h(VMeterGroup, {
        label: '存储空间',
        items: storage.slice(0, 3),
        max: 256,
        format: formatGb,
        class: 'w-96',
      }),
    react: () => (
      <MeterGroup
        label="存储空间"
        items={storage.slice(0, 3)}
        max={256}
        format={formatGb}
        className="w-96"
      />
    ),
  },
  {
    name: 'out of range clamps and format reaches aria-valuetext',
    vue: () =>
      h(VMeterGroup, { max: 128, items: [{ label: '视频', value: 200 }], format: formatRatio }),
    react: () => (
      <MeterGroup max={128} items={[{ label: '视频', value: 200 }]} format={formatRatio} />
    ),
  },
  {
    name: 'negative value and total over max',
    vue: () =>
      h(VMeterGroup, {
        label: '溢出',
        max: 50,
        items: [
          { label: '甲', value: -5 },
          { label: '乙', value: 40 },
          { label: '丙', value: 30 },
        ],
      }),
    react: () => (
      <MeterGroup
        label="溢出"
        max={50}
        items={[
          { label: '甲', value: -5 },
          { label: '乙', value: 40 },
          { label: '丙', value: 30 },
        ]}
      />
    ),
  },
  {
    name: 'zero max',
    vue: () => h(VMeterGroup, { max: 0, items: [{ label: '空', value: 3 }] }),
    react: () => <MeterGroup max={0} items={[{ label: '空', value: 3 }]} />,
  },
  {
    name: 'legend false',
    vue: () =>
      h(VMeterGroup, {
        label: '存储空间',
        items: storage.slice(0, 3),
        legend: false,
        class: 'w-96',
      }),
    react: () => (
      <MeterGroup label="存储空间" items={storage.slice(0, 3)} legend={false} className="w-96" />
    ),
  },
  {
    name: 'legend false without label renders only the track',
    vue: () => h(VMeterGroup, { legend: false, items: [{ label: '文档', value: 40 }] }),
    react: () => <MeterGroup legend={false} items={[{ label: '文档', value: 40 }]} />,
  },
  ...(['sm', 'md', 'lg'] as const).map(size => ({
    name: `size ${size}`,
    vue: () => h(VMeterGroup, { items: reading, size, legend: false }),
    react: () => <MeterGroup items={reading} size={size} legend={false} />,
  })),
  {
    name: 'attributes reach the group track',
    vue: () =>
      h(VMeterGroup, {
        items: reading,
        id: 'm',
        'data-x': '1',
        style: 'margin-top: 4px',
        'aria-describedby': 'hint',
      }),
    react: () => (
      <MeterGroup
        items={reading}
        id="m"
        data-x="1"
        style={{ marginTop: '4px' }}
        aria-describedby="hint"
      />
    ),
  },
  {
    name: 'locale percent format',
    vue: () =>
      h(
        defineComponent({
          setup() {
            provideUiLocale(vueEnUS)
            return () => h(VMeterGroup, { label: 'Storage', items: reading })
          },
        }),
      ),
    react: () => (
      <UiLocaleProvider messages={enUS}>
        <MeterGroup label="Storage" items={reading} />
      </UiLocaleProvider>
    ),
  },
])
