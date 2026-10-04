import { h } from 'vue'
import VGrid from '@hina-ui/vue/components/grid/Grid.vue'
import { Grid } from '@hina-ui/react/components/grid/Grid'
import { defineCases } from '../src/cases'

const cols = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const
const gaps = ['none', 'xs', 'sm', 'md', 'lg', 'xl'] as const

export default defineCases('Grid', [
  {
    name: 'default',
    vue: () => h(VGrid, null, () => [h('p', '甲'), h('p', '乙')]),
    react: () => (
      <Grid>
        <p>甲</p>
        <p>乙</p>
      </Grid>
    ),
  },
  ...cols.map(count => ({
    name: `cols ${count}`,
    vue: () => h(VGrid, { cols: count }),
    react: () => <Grid cols={count} />,
  })),
  ...gaps.map(gap => ({
    name: `gap ${gap}`,
    vue: () => h(VGrid, { cols: 2, gap }),
    react: () => <Grid cols={2} gap={gap} />,
  })),
  {
    name: 'as ul with responsive class',
    vue: () => h(VGrid, { as: 'ul', class: 'sm:grid-cols-2 lg:grid-cols-4' }),
    react: () => <Grid as="ul" className="sm:grid-cols-2 lg:grid-cols-4" />,
  },
])
