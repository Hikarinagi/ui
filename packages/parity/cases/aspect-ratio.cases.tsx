import { h } from 'vue'
import VAspectRatio from '@hina-ui/vue/components/aspect-ratio/AspectRatio.vue'
import { AspectRatio } from '@hina-ui/react/components/aspect-ratio/AspectRatio'
import { defineCases } from '../src/cases'

export default defineCases('AspectRatio', [
  {
    name: 'default 16:9 with class on the outer shell',
    vue: () => h(VAspectRatio, { class: 'w-40' }, () => h('div', '内容')),
    react: () => (
      <AspectRatio className="w-40">
        <div>内容</div>
      </AspectRatio>
    ),
  },
  ...[1, 3 / 4, 4 / 3, 21 / 9].map(ratio => ({
    name: `ratio ${ratio}`,
    vue: () =>
      h(VAspectRatio, { ratio, class: 'bg-inset overflow-hidden rounded-md' }, () =>
        h('video', { src: '/sample.webm', 'aria-label': 'Sample' }),
      ),
    react: () => (
      <AspectRatio ratio={ratio} className="bg-inset overflow-hidden rounded-md">
        <video src="/sample.webm" aria-label="Sample" />
      </AspectRatio>
    ),
  })),
  {
    name: 'attributes fall through to the outer shell',
    vue: () => h(VAspectRatio, { id: 'cover', 'data-kind': 'cover', style: 'max-width:20rem' }),
    react: () => <AspectRatio id="cover" data-kind="cover" style={{ maxWidth: '20rem' }} />,
  },
])
