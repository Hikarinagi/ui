import { h } from 'vue'
import VProse from '@hina-ui/vue/components/prose/Prose.vue'
import { Prose } from '@hina-ui/react/components/prose/Prose'
import { defineCases } from '../src/cases'

const html = '<h3>标题</h3><p>一段来自接口的 HTML。</p>'

export default defineCases('Prose', [
  {
    name: 'default',
    vue: () =>
      h(VProse, { class: 'max-w-xl' }, () => [
        h('h2', '狼と香辛料'),
        h('p', '这是一段来自后端的富文本。'),
        h('blockquote', '书页翻动的声音'),
        h('ul', [h('li', '第一卷 启航'), h('li', '第二卷 远洋')]),
      ]),
    react: () => (
      <Prose className="max-w-xl">
        <h2>狼と香辛料</h2>
        <p>这是一段来自后端的富文本。</p>
        <blockquote>书页翻动的声音</blockquote>
        <ul>
          <li>第一卷 启航</li>
          <li>第二卷 远洋</li>
        </ul>
      </Prose>
    ),
  },
  {
    name: 'as article',
    vue: () => h(VProse, { as: 'article', class: 'max-w-lg' }, () => [h('h3', '渲染为 article')]),
    react: () => (
      <Prose as="article" className="max-w-lg">
        <h3>渲染为 article</h3>
      </Prose>
    ),
  },
  {
    name: 'inner html',
    vue: () => h(VProse, { class: 'max-w-lg', innerHTML: html }),
    react: () => <Prose className="max-w-lg" dangerouslySetInnerHTML={{ __html: html }} />,
  },
  {
    name: 'as child',
    vue: () => h(VProse, { asChild: true }, () => h('section', { id: 's' }, [h('p', '段落')])),
    react: () => (
      <Prose asChild>
        <section id="s">
          <p>段落</p>
        </section>
      </Prose>
    ),
  },
])
