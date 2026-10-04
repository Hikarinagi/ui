import { h } from 'vue'
import VCallout from '@hina-ui/vue/components/callout/Callout.vue'
import { Callout } from '@hina-ui/react/components/callout/Callout'
import { defineCases } from '../src/cases'

const tones = ['neutral', 'accent', 'info', 'success', 'warning', 'danger'] as const

export default defineCases('Callout', [
  ...tones.map(tone => ({
    name: `${tone} with default icon and title`,
    vue: () => h(VCallout, { tone, title: '标题' }, () => '正文。'),
    react: () => (
      <Callout tone={tone} title="标题">
        正文。
      </Callout>
    ),
  })),
  {
    name: 'default tone without title',
    vue: () => h(VCallout, { class: 'max-w-md' }, () => '正文内容。'),
    react: () => <Callout className="max-w-md">正文内容。</Callout>,
  },
  ...tones.map(tone => ({
    name: `${tone} without icon`,
    vue: () => h(VCallout, { tone, icon: false, title: '标题' }, () => '正文。'),
    react: () => (
      <Callout tone={tone} icon={false} title="标题">
        正文。
      </Callout>
    ),
  })),
  {
    name: 'icon slot replaces the default icon',
    vue: () =>
      h(VCallout, null, {
        default: () => '文',
        icon: () => h('span', { 'data-probe': '' }, '☆'),
      }),
    react: () => <Callout icon={<span data-probe="">☆</span>}>文</Callout>,
  },
  {
    name: 'icon slot wins over icon false',
    vue: () =>
      h(VCallout, { icon: false, tone: 'info' }, { default: () => '文', icon: () => h('i') }),
    react: () => (
      <Callout tone="info" icon={<i />}>
        文
      </Callout>
    ),
  },
  {
    name: 'empty title is omitted and attributes fall through',
    vue: () => h(VCallout, { title: '', icon: false, id: 'note', role: 'alert' }, () => '正文'),
    react: () => (
      <Callout title="" icon={false} id="note" role="alert">
        正文
      </Callout>
    ),
  },
])
