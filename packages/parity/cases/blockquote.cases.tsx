import { h } from 'vue'
import VBlockquote from '@hina-ui/vue/components/blockquote/Blockquote.vue'
import { Blockquote } from '@hina-ui/react/components/blockquote/Blockquote'
import { defineCases } from '../src/cases'

export default defineCases('Blockquote', [
  {
    name: 'default',
    vue: () => h(VBlockquote, { class: 'max-w-lg' }, () => '设计的第一要务'),
    react: () => <Blockquote className="max-w-lg">设计的第一要务</Blockquote>,
  },
  {
    name: 'with cite',
    vue: () => h(VBlockquote, { cite: '夏目漱石' }, () => '书页翻动的声音'),
    react: () => <Blockquote cite="夏目漱石">书页翻动的声音</Blockquote>,
  },
  {
    name: 'empty cite renders no footer',
    vue: () => h(VBlockquote, { cite: '' }, () => '引用'),
    react: () => <Blockquote cite="">引用</Blockquote>,
  },
  {
    name: 'paragraphs with merged class and attributes',
    vue: () =>
      h(VBlockquote, { cite: '访谈记录', class: 'flex max-w-lg flex-col gap-3', id: 'q' }, () => [
        h('p', '最初的版本'),
        h('p', '后来加进去的'),
      ]),
    react: () => (
      <Blockquote cite="访谈记录" className="flex max-w-lg flex-col gap-3" id="q">
        <p>最初的版本</p>
        <p>后来加进去的</p>
      </Blockquote>
    ),
  },
])
