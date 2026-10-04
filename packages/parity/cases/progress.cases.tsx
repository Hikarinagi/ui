import { h } from 'vue'
import VProgress from '@hina-ui/vue/components/progress/Progress.vue'
import { Progress } from '@hina-ui/react/components/progress/Progress'
import { defineCases } from '../src/cases'

const format = (value: number, max: number) => `${value} / ${max}`

export default defineCases('Progress', [
  {
    name: 'value with label and visible percentage',
    vue: () => h(VProgress, { value: 45, label: '上传中', showValue: true }),
    react: () => <Progress value={45} label="上传中" showValue />,
  },
  {
    name: 'indeterminate falls back to the locale name',
    vue: () => h(VProgress, { showValue: true }),
    react: () => <Progress showValue />,
  },
  {
    name: 'indeterminate with label',
    vue: () => h(VProgress, { label: '正在连接', class: 'w-80' }),
    react: () => <Progress label="正在连接" className="w-80" />,
  },
  {
    name: 'value only uses the percentage as name',
    vue: () => h(VProgress, { value: 40 }),
    react: () => <Progress value={40} />,
  },
  {
    name: 'clamped above max with format',
    vue: () => h(VProgress, { value: 12, max: 8, showValue: true, format }),
    react: () => <Progress value={12} max={8} showValue format={format} />,
  },
  {
    name: 'clamped below zero',
    vue: () => h(VProgress, { value: -3, showValue: true }),
    react: () => <Progress value={-3} showValue />,
  },
  {
    name: 'complete',
    vue: () => h(VProgress, { value: 100, tone: 'success' }),
    react: () => <Progress value={100} tone="success" />,
  },
  {
    name: 'fractional ratio',
    vue: () => h(VProgress, { value: 1, max: 3, showValue: true }),
    react: () => <Progress value={1} max={3} showValue />,
  },
  ...(['sm', 'md', 'lg'] as const).map(size => ({
    name: `size ${size}`,
    vue: () => h(VProgress, { value: 60, size }),
    react: () => <Progress value={60} size={size} />,
  })),
  ...(['accent', 'neutral', 'success', 'warning', 'danger', 'info'] as const).map(tone => ({
    name: `tone ${tone}`,
    vue: () => h(VProgress, { value: 70, tone }),
    react: () => <Progress value={70} tone={tone} />,
  })),
  {
    name: 'label without visible value',
    vue: () => h(VProgress, { value: 25, label: '正在同步收藏' }),
    react: () => <Progress value={25} label="正在同步收藏" />,
  },
  {
    name: 'attributes reach the progressbar and override its name',
    vue: () =>
      h(VProgress, {
        value: 3,
        max: 8,
        label: '已处理',
        id: 'p',
        style: 'margin-top: 4px',
        'aria-label': '自定义名称',
        'data-x': '1',
      }),
    react: () => (
      <Progress
        value={3}
        max={8}
        label="已处理"
        id="p"
        style={{ marginTop: '4px' }}
        aria-label="自定义名称"
        data-x="1"
      />
    ),
  },
])
