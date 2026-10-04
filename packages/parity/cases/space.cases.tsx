import { h } from 'vue'
import VSpace from '@hina-ui/vue/components/space/Space.vue'
import { Space } from '@hina-ui/react/components/space/Space'
import { defineCases } from '../src/cases'

export default defineCases('Space', [
  {
    name: 'default flex',
    vue: () => h(VSpace),
    react: () => <Space />,
  },
  ...(['xs', 'sm', 'md', 'lg', 'xl', 'flex'] as const).map(size => ({
    name: `size ${size}`,
    vue: () => h(VSpace, { size }),
    react: () => <Space size={size} />,
  })),
  {
    name: 'caller attributes override aria-hidden',
    vue: () => h(VSpace, { class: 'basis-4', 'aria-hidden': 'false', 'data-gap': '' }),
    react: () => <Space className="basis-4" aria-hidden="false" data-gap="" />,
  },
])
