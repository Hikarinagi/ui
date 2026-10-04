import { h } from 'vue'
import VScrollTop from '@hina-ui/vue/components/scroll-top/ScrollTop.vue'
import { ScrollTop } from '@hina-ui/react/components/scroll-top/ScrollTop'
import { defineCases } from '../src/cases'

export default defineCases('ScrollTop', [
  {
    name: 'renders no button before mount with the default target',
    vue: () => h('div', null, [h(VScrollTop)]),
    react: () => (
      <div>
        <ScrollTop />
      </div>
    ),
  },
  {
    name: 'renders no button before mount with a getter target',
    vue: () =>
      h('div', null, [
        h(VScrollTop, {
          target: () => {
            throw new Error('Client-only target')
          },
          threshold: 120,
          position: 'absolute',
          offset: 16,
        }),
      ]),
    react: () => (
      <div>
        <ScrollTop
          target={() => {
            throw new Error('Client-only target')
          }}
          threshold={120}
          position="absolute"
          offset={16}
        />
      </div>
    ),
  },
])
