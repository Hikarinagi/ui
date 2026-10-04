import { defineComponent, h } from 'vue'
import VImage from '@hina-ui/vue/components/image/Image.vue'
import VImageGroup from '@hina-ui/vue/components/image/ImageGroup.vue'
import { provideImageResolver } from '@hina-ui/vue/components/image/resolver'
import { Image } from '@hina-ui/react/components/image/Image'
import { ImageGroup } from '@hina-ui/react/components/image/ImageGroup'
import { ImageResolverProvider } from '@hina-ui/react/components/image/resolver'
import { defineCases } from '../src/cases'

const fits = ['cover', 'contain', 'fill', 'none', 'scale-down'] as const

const cdn = (src: string, variant: string) => `https://cdn.test${src}?v=${variant}`

const VResolver = defineComponent({
  setup(_, { slots }) {
    provideImageResolver(cdn)
    return () => slots.default?.()
  },
})

export default defineCases('Image', [
  {
    name: 'lazy default keeps the source until intersection',
    vue: () => h(VImage, { src: '/a.webp', alt: '海边' }),
    react: () => <Image src="/a.webp" alt="海边" />,
  },
  {
    name: 'eager image renders its source',
    vue: () => h(VImage, { src: '/a.webp', alt: '海边', lazy: false, loading: 'lazy' }),
    react: () => <Image src="/a.webp" alt="海边" lazy={false} loading="lazy" />,
  },
  ...fits.map(fit => ({
    name: `fit ${fit}`,
    vue: () => h(VImage, { src: '/a.webp', alt: '海边', fit }),
    react: () => <Image src="/a.webp" alt="海边" fit={fit} />,
  })),
  {
    name: 'ratio on the frame',
    vue: () => h(VImage, { src: '/a.webp', alt: '', ratio: 16 / 9, class: 'w-40 rounded-md' }),
    react: () => <Image src="/a.webp" alt="" ratio={16 / 9} className="w-40 rounded-md" />,
  },
  {
    name: 'eager priority and sync decoding',
    vue: () =>
      h(VImage, { src: '/a.webp', alt: '海边', lazy: false, eager: true, loading: 'lazy' }),
    react: () => <Image src="/a.webp" alt="海边" lazy={false} eager loading="lazy" />,
  },
  {
    name: 'draggable image',
    vue: () => h(VImage, { src: '/a.webp', alt: '', draggable: true }),
    react: () => <Image src="/a.webp" alt="" draggable />,
  },
  {
    name: 'without skeleton',
    vue: () => h(VImage, { src: '/a.webp', alt: '', skeleton: false }),
    react: () => <Image src="/a.webp" alt="" skeleton={false} />,
  },
  {
    name: 'custom skeleton slot',
    vue: () =>
      h(
        VImage,
        { src: '/a.webp', alt: '' },
        { skeleton: () => h('p', { class: 'p-2' }, '载入中') },
      ),
    react: () => <Image src="/a.webp" alt="" skeletonContent={<p className="p-2">载入中</p>} />,
  },
  {
    name: 'empty slot without a source',
    vue: () =>
      h(VImage, { ratio: 1, class: 'bg-inset rounded-md' }, { empty: () => h('p', '暂无图片') }),
    react: () => <Image ratio={1} className="bg-inset rounded-md" empty={<p>暂无图片</p>} />,
  },
  {
    name: 'empty without a slot',
    vue: () => h(VImage, { alt: '' }),
    react: () => <Image alt="" />,
  },
  {
    name: 'fallback only renders the empty state',
    vue: () => h(VImage, { fallback: '/f.webp' }, { empty: () => h('span', '空') }),
    react: () => <Image fallback="/f.webp" empty={<span>空</span>} />,
  },
  {
    name: 'preview renders a button frame',
    vue: () => h(VImage, { src: '/a.webp', alt: '海边', preview: true }),
    react: () => <Image src="/a.webp" alt="海边" preview />,
  },
  {
    name: 'preview with a separate source and size',
    vue: () =>
      h(VImage, {
        src: '/thumb.webp',
        alt: '海边',
        preview: '/large.webp',
        previewSize: { width: 1200, height: 675 },
        ratio: 16 / 9,
        class: 'rounded-xl',
      }),
    react: () => (
      <Image
        src="/thumb.webp"
        alt="海边"
        preview="/large.webp"
        previewSize={{ width: 1200, height: 675 }}
        ratio={16 / 9}
        className="rounded-xl"
      />
    ),
  },
  {
    name: 'frame and image styles with forwarded image attributes',
    vue: () =>
      h(VImage, {
        src: '/a.webp',
        alt: '海边',
        lazy: false,
        loading: 'lazy',
        sizes: '160px',
        'data-test': 'cover',
        class: 'rounded-md',
        style: { width: '240px', height: '160px' },
        imageClass: 'object-left',
        imageStyle: { objectPosition: 'left center' },
      }),
    react: () => (
      <Image
        src="/a.webp"
        alt="海边"
        lazy={false}
        loading="lazy"
        sizes="160px"
        data-test="cover"
        className="rounded-md"
        style={{ width: '240px', height: '160px' }}
        imageClass="object-left"
        imageStyle={{ objectPosition: 'left center' }}
      />
    ),
  },
  {
    name: 'explicit style overrides the ratio',
    vue: () => h(VImage, { ratio: 1, style: { aspectRatio: '2' } }),
    react: () => <Image ratio={1} style={{ aspectRatio: '2' }} />,
  },
  {
    name: 'resolver rewrites the source',
    vue: () =>
      h(VResolver, null, () =>
        h(VImage, { src: '/a.webp', alt: '海边', lazy: false, loading: 'lazy' }),
      ),
    react: () => (
      <ImageResolverProvider resolver={cdn}>
        <Image src="/a.webp" alt="海边" lazy={false} loading="lazy" />
      </ImageResolverProvider>
    ),
  },
  {
    name: 'group of previews',
    vue: () =>
      h('div', [
        h(VImageGroup, { loop: true }, () => [
          h(VImage, { src: '/a.webp', alt: '一', preview: true, class: 'h-28 w-48' }),
          h(VImage, { src: '/b.webp', alt: '二', preview: true, class: 'h-28 w-20' }),
        ]),
      ]),
    react: () => (
      <div>
        <ImageGroup loop>
          <Image src="/a.webp" alt="一" preview className="h-28 w-48" />
          <Image src="/b.webp" alt="二" preview className="h-28 w-20" />
        </ImageGroup>
      </div>
    ),
  },
])
