import { h } from 'vue'
import VCenter from '@hina-ui/vue/components/center/Center.vue'
import { Center } from '@hina-ui/react/components/center/Center'
import { defineCases } from '../src/cases'

export default defineCases('Center', [
  {
    name: 'default block flex',
    vue: () => h(VCenter, null, () => h('p', '居中内容')),
    react: () => (
      <Center>
        <p>居中内容</p>
      </Center>
    ),
  },
  {
    name: 'inline',
    vue: () => h(VCenter, { inline: true, class: 'gap-1' }, () => 'Link'),
    react: () => (
      <Center inline className="gap-1">
        Link
      </Center>
    ),
  },
  {
    name: 'as figure with attributes',
    vue: () => h(VCenter, { as: 'figure', class: 'h-32', 'aria-label': 'Figure' }),
    react: () => <Center as="figure" className="h-32" aria-label="Figure" />,
  },
])
