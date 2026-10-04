import { h } from 'vue'
import VLightbox from '@hina-ui/vue/components/lightbox/Lightbox.vue'
import { Lightbox } from '@hina-ui/react/components/lightbox/Lightbox'
import { defineCases } from '../src/cases'

const items = [
  { id: 'a', src: '/a.webp', alt: '第一张' },
  { id: 'b', src: '/b.webp', alt: '第二张' },
]

export default defineCases('Lightbox', [
  {
    name: 'closed renders nothing in place',
    vue: () => h('div', { class: 'host' }, [h(VLightbox, { items })]),
    react: () => (
      <div className="host">
        <Lightbox items={items} />
      </div>
    ),
  },
  {
    name: 'open renders only after mount',
    vue: () =>
      h('div', { class: 'host' }, [h(VLightbox, { items, open: true, index: 1, loop: true })]),
    react: () => (
      <div className="host">
        <Lightbox items={items} open index={1} loop />
      </div>
    ),
  },
])
