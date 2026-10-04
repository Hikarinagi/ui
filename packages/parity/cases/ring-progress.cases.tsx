import { h } from 'vue'
import { Check as VCheck } from '@hina-ui/vue/../node_modules/@lucide/vue'
import { Check } from '@hina-ui/react/../node_modules/lucide-react'
import VRingProgress from '@hina-ui/vue/components/ring-progress/RingProgress.vue'
import { RingProgress } from '@hina-ui/react/components/ring-progress/RingProgress'
import { lucide } from '@hina-ui/react/lib/icon'
import { defineCases } from '../src/cases'

const CheckIcon = lucide(Check)
const ratio = (value: number, max: number) => `${value}/${max}`

export default defineCases('RingProgress', [
  {
    name: 'value without center text',
    vue: () => h(VRingProgress, { value: 40 }),
    react: () => <RingProgress value={40} />,
  },
  {
    name: 'value with center percentage',
    vue: () => h(VRingProgress, { value: 40, showValue: true }),
    react: () => <RingProgress value={40} showValue />,
  },
  {
    name: 'label below the ring names the progressbar',
    vue: () => h(VRingProgress, { value: 72, label: '已完成', showValue: true }),
    react: () => <RingProgress value={72} label="已完成" showValue />,
  },
  {
    name: 'indeterminate with showValue renders no text',
    vue: () => h(VRingProgress, { showValue: true }),
    react: () => <RingProgress showValue />,
  },
  {
    name: 'indeterminate with label',
    vue: () => h(VRingProgress, { label: '正在连接' }),
    react: () => <RingProgress label="正在连接" />,
  },
  {
    name: 'default slot replaces the center and zero drops the round cap',
    vue: () => h(VRingProgress, { value: 0, showValue: true }, () => h('span', '自定义')),
    react: () => (
      <RingProgress value={0} showValue>
        <span>自定义</span>
      </RingProgress>
    ),
  },
  {
    name: 'complete with icon in the center',
    vue: () =>
      h(VRingProgress, { value: 100, tone: 'success' }, () =>
        h(VCheck, { class: 'text-success size-6' }),
      ),
    react: () => (
      <RingProgress value={100} tone="success">
        <CheckIcon className="text-success size-6" />
      </RingProgress>
    ),
  },
  {
    name: 'format with fractional offset',
    vue: () => h(VRingProgress, { value: 3, max: 8, showValue: true, format: ratio }),
    react: () => <RingProgress value={3} max={8} showValue format={ratio} />,
  },
  {
    name: 'repeating fraction',
    vue: () => h(VRingProgress, { value: 1, max: 3, showValue: true }),
    react: () => <RingProgress value={1} max={3} showValue />,
  },
  {
    name: 'clamped above max',
    vue: () => h(VRingProgress, { value: 140, showValue: true }),
    react: () => <RingProgress value={140} showValue />,
  },
  {
    name: 'clamped below zero',
    vue: () => h(VRingProgress, { value: -10, showValue: true }),
    react: () => <RingProgress value={-10} showValue />,
  },
  {
    name: 'large with label',
    vue: () => h(VRingProgress, { value: 30, showValue: true, size: 'lg' }),
    react: () => <RingProgress value={30} showValue size="lg" />,
  },
  ...(['sm', 'md', 'lg'] as const).map(size => ({
    name: `size ${size}`,
    vue: () => h(VRingProgress, { value: 60, size, showValue: true }),
    react: () => <RingProgress value={60} size={size} showValue />,
  })),
  ...(['accent', 'neutral', 'success', 'warning', 'danger', 'info'] as const).map(tone => ({
    name: `tone ${tone}`,
    vue: () => h(VRingProgress, { value: 70, tone }),
    react: () => <RingProgress value={70} tone={tone} />,
  })),
  {
    name: 'labelled tone info',
    vue: () => h(VRingProgress, { value: 91, showValue: true, label: '已收藏', tone: 'info' }),
    react: () => <RingProgress value={91} showValue label="已收藏" tone="info" />,
  },
  {
    name: 'attributes reach the progressbar and class the wrapper',
    vue: () =>
      h(VRingProgress, {
        value: 3,
        max: 8,
        label: '已处理',
        id: 'p',
        class: 'shrink-0',
        style: 'margin-top: 4px',
        'aria-label': '自定义名称',
        'data-x': '1',
      }),
    react: () => (
      <RingProgress
        value={3}
        max={8}
        label="已处理"
        id="p"
        className="shrink-0"
        style={{ marginTop: '4px' }}
        aria-label="自定义名称"
        data-x="1"
      />
    ),
  },
])
