import { h } from 'vue'
import VContainer from '@hina-ui/vue/components/container/Container.vue'
import { Container } from '@hina-ui/react/components/container/Container'
import { defineCases } from '../src/cases'

export default defineCases('Container', [
  {
    name: 'default md',
    vue: () => h(VContainer, null, () => h('p', '内容')),
    react: () => (
      <Container>
        <p>内容</p>
      </Container>
    ),
  },
  ...(['sm', 'md', 'lg', 'xl'] as const).map(size => ({
    name: `size ${size}`,
    vue: () => h(VContainer, { size }),
    react: () => <Container size={size} />,
  })),
  {
    name: 'as main with class override',
    vue: () => h(VContainer, { as: 'main', class: 'px-8 max-w-none' }),
    react: () => <Container as="main" className="px-8 max-w-none" />,
  },
])
