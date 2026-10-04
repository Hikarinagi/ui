import { h } from 'vue'
import VSection from '@hina-ui/vue/components/section/Section.vue'
import { Section } from '@hina-ui/react/components/section/Section'
import { defineCases } from '../src/cases'

export default defineCases('Section', [
  {
    name: 'titled',
    vue: () => h(VSection, { title: '发售信息' }, () => h('p', '正文')),
    react: () => (
      <Section title="发售信息">
        <p>正文</p>
      </Section>
    ),
  },
  {
    name: 'untitled',
    vue: () => h(VSection, null, () => h('p', '正文')),
    react: () => (
      <Section>
        <p>正文</p>
      </Section>
    ),
  },
  {
    name: 'anchor id and class',
    vue: () => h(VSection, { id: 'intro', title: '简介', class: 'p-4' }, () => h('p', '正文')),
    react: () => (
      <Section id="intro" title="简介" className="p-4">
        <p>正文</p>
      </Section>
    ),
  },
  {
    name: 'empty title renders no heading',
    vue: () => h(VSection, { title: '', 'aria-label': 'Group' }),
    react: () => <Section title="" aria-label="Group" />,
  },
])
