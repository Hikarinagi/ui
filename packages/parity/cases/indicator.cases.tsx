import { h } from 'vue'
import VIndicator from '@hina-ui/vue/components/indicator/Indicator.vue'
import { Indicator } from '@hina-ui/react/components/indicator/Indicator'
import { defineCases } from '../src/cases'

const tones = ['neutral', 'accent', 'success', 'warning', 'danger', 'info'] as const

export default defineCases('Indicator', [
  {
    name: 'default is hidden from assistive technology',
    vue: () => h(VIndicator),
    react: () => <Indicator />,
  },
  ...tones.map(tone => ({
    name: `tone ${tone}`,
    vue: () => h(VIndicator, { tone }),
    react: () => <Indicator tone={tone} />,
  })),
  ...(['sm', 'md', 'lg'] as const).map(size => ({
    name: `size ${size}`,
    vue: () => h(VIndicator, { size, tone: 'accent' }),
    react: () => <Indicator size={size} tone="accent" />,
  })),
  {
    name: 'label is exposed and visually hidden',
    vue: () => h(VIndicator, { tone: 'success', label: '在线' }),
    react: () => <Indicator tone="success" label="在线" />,
  },
  {
    name: 'pulse layer',
    vue: () => h(VIndicator, { tone: 'danger', pulse: true }),
    react: () => <Indicator tone="danger" pulse />,
  },
  {
    name: 'pulse with label',
    vue: () => h(VIndicator, { tone: 'accent', size: 'lg', pulse: true, label: '正在更新' }),
    react: () => <Indicator tone="accent" size="lg" pulse label="正在更新" />,
  },
  {
    name: 'as i with class and attributes',
    vue: () => h(VIndicator, { as: 'i', class: 'ms-1', id: 'dot', title: 'dot' }),
    react: () => <Indicator as="i" className="ms-1" id="dot" title="dot" />,
  },
])
