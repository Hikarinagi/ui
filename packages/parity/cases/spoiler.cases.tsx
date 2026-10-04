import { defineComponent, h } from 'vue'
import VSpoiler from '@hina-ui/vue/components/spoiler/Spoiler.vue'
import { enUS as vueEnUS, provideUiLocale } from '@hina-ui/vue/locale'
import { Spoiler } from '@hina-ui/react/components/spoiler/Spoiler'
import { UiLocaleProvider, enUS } from '@hina-ui/react/locale'
import { defineCases } from '../src/cases'

const English = defineComponent({
  setup(_, { slots }) {
    provideUiLocale(vueEnUS)
    return () => slots.default?.()
  },
})

export default defineCases('Spoiler', [
  {
    name: 'hidden by default, click to reveal',
    vue: () => h(VSpoiler, null, () => '真凶是园丁'),
    react: () => <Spoiler>真凶是园丁</Spoiler>,
  },
  {
    name: 'hover reveal has no button role',
    vue: () => h(VSpoiler, { revealOn: 'hover' }, () => '悬停揭示的内容'),
    react: () => <Spoiler revealOn="hover">悬停揭示的内容</Spoiler>,
  },
  {
    name: 'force fallback',
    vue: () => h(VSpoiler, { forceFallback: true }, () => '底色加模糊'),
    react: () => <Spoiler forceFallback>底色加模糊</Spoiler>,
  },
  {
    name: 'revealed through the model',
    vue: () => h(VSpoiler, { hidden: false }, () => '交易在最后一刻反转'),
    react: () => <Spoiler hidden={false}>交易在最后一刻反转</Spoiler>,
  },
  {
    name: 'revealed by default value',
    vue: () => h(VSpoiler, { hidden: false, revealOn: 'hover' }, () => '已揭示'),
    react: () => (
      <Spoiler defaultHidden={false} revealOn="hover">
        已揭示
      </Spoiler>
    ),
  },
  {
    name: 'class and attributes',
    vue: () =>
      h(VSpoiler, { class: 'font-medium', id: 's', 'data-kind': 'plot' }, () => [
        h('strong', '真凶'),
        '是园丁',
      ]),
    react: () => (
      <Spoiler className="font-medium" id="s" data-kind="plot">
        <strong>真凶</strong>是园丁
      </Spoiler>
    ),
  },
  {
    name: 'labels follow the locale',
    vue: () =>
      h(English, null, () => [
        h(VSpoiler, null, () => 'hidden'),
        h(VSpoiler, { hidden: false }, () => 'shown'),
      ]),
    react: () => (
      <UiLocaleProvider messages={enUS}>
        <Spoiler>hidden</Spoiler>
        <Spoiler hidden={false}>shown</Spoiler>
      </UiLocaleProvider>
    ),
  },
])
