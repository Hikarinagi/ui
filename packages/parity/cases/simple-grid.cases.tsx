import { h } from 'vue'
import VSimpleGrid from '@hina-ui/vue/components/simple-grid/SimpleGrid.vue'
import { SimpleGrid } from '@hina-ui/react/components/simple-grid/SimpleGrid'
import { defineCases } from '../src/cases'

export default defineCases('SimpleGrid', [
  {
    name: 'default auto-fill',
    vue: () => h(VSimpleGrid, null, () => [h('p', '甲'), h('p', '乙')]),
    react: () => (
      <SimpleGrid>
        <p>甲</p>
        <p>乙</p>
      </SimpleGrid>
    ),
  },
  {
    name: 'fit with custom min',
    vue: () => h(VSimpleGrid, { fit: true, min: '10rem' }),
    react: () => <SimpleGrid fit min="10rem" />,
  },
  ...(['none', 'xs', 'sm', 'md', 'lg', 'xl'] as const).map(gap => ({
    name: `gap ${gap}`,
    vue: () => h(VSimpleGrid, { gap }),
    react: () => <SimpleGrid gap={gap} />,
  })),
  {
    name: 'as ul with caller style',
    vue: () => h(VSimpleGrid, { as: 'ul', class: 'w-full', style: { maxWidth: '40rem' } }),
    react: () => <SimpleGrid as="ul" className="w-full" style={{ maxWidth: '40rem' }} />,
  },
  {
    name: 'caller style wins over the min variable',
    vue: () => h(VSimpleGrid, { min: '10rem', style: { '--hn-simple-grid-min': '5rem' } }),
    react: () => (
      <SimpleGrid min="10rem" style={{ '--hn-simple-grid-min': '5rem' } as React.CSSProperties} />
    ),
  },
])
