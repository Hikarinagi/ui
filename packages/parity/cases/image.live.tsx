import { h } from 'vue'
import { page } from 'vitest/browser'
import { vi } from 'vitest'
import VImage from '@hina-ui/vue/components/image/Image.vue'
import { Image } from '@hina-ui/react/components/image/Image'
import { defineLiveCases } from '../src/live'
import { picture, quiet } from './lightbox.live'

const photo = picture(800, 400)
const broken = 'data:image/png;base64,bm90LWFuLWltYWdl'

function loaded(selector = 'img') {
  return async () => {
    await vi.waitFor(
      () => {
        const img = document.querySelector<HTMLImageElement>(selector)
        if (!img?.naturalWidth) throw new Error('loading')
        if (document.querySelector('.hn-skeleton')) throw new Error('skeleton')
      },
      { timeout: 5000 },
    )
    await quiet()
  }
}

function settled(check: () => boolean) {
  return async () => {
    await vi.waitFor(
      () => {
        if (!check()) throw new Error('pending')
      },
      { timeout: 5000 },
    )
    await quiet()
  }
}

export default defineLiveCases('image', [
  {
    name: 'lazy image fades in and drops the skeleton',
    vue: () => h(VImage, { src: photo, alt: '海边', ratio: 2, class: 'w-40 rounded-md' }),
    react: () => <Image src={photo} alt="海边" ratio={2} className="w-40 rounded-md" />,
    settle: loaded(),
  },
  {
    name: 'eager image reveals without fading',
    vue: () => h(VImage, { src: photo, alt: '海边', lazy: false, eager: true, class: 'w-40' }),
    react: () => <Image src={photo} alt="海边" lazy={false} eager className="w-40" />,
    settle: loaded(),
  },
  {
    name: 'below the fold keeps the skeleton and no source',
    vue: () =>
      h('div', [
        h('div', { style: 'height: 300vh' }),
        h(VImage, { src: photo, alt: '海边', class: 'block h-20 w-20' }),
      ]),
    react: () => (
      <div>
        <div style={{ height: '300vh' }} />
        <Image src={photo} alt="海边" className="block h-20 w-20" />
      </div>
    ),
    interact: () => page.viewport(1024, 768),
    settle: settled(() => !!document.querySelector('.hn-skeleton')),
  },
  {
    name: 'failed image renders the error slot',
    vue: () =>
      h(
        VImage,
        { src: broken, alt: '', ratio: 1, class: 'bg-inset w-40 rounded-md' },
        { error: () => h('p', '图片不可用') },
      ),
    react: () => (
      <Image
        src={broken}
        alt=""
        ratio={1}
        className="bg-inset w-40 rounded-md"
        error={<p>图片不可用</p>}
      />
    ),
    settle: settled(() => !document.querySelector('img') && !!document.querySelector('p')),
  },
  {
    name: 'failed image switches to the fallback',
    vue: () => h(VImage, { src: broken, fallback: photo, alt: '海边', lazy: false, class: 'w-40' }),
    react: () => <Image src={broken} fallback={photo} alt="海边" lazy={false} className="w-40" />,
    settle: loaded(),
  },
  {
    name: 'skeleton disabled still fades the image in',
    vue: () => h(VImage, { src: photo, alt: '海边', skeleton: false, class: 'h-20 w-20' }),
    react: () => <Image src={photo} alt="海边" skeleton={false} className="h-20 w-20" />,
    settle: loaded(),
  },
  {
    name: 'preview frame after load',
    vue: () =>
      h(VImage, {
        src: photo,
        alt: '海边',
        preview: true,
        style: { width: '160px', height: '90px' },
        imageStyle: { objectPosition: 'left top' },
      }),
    react: () => (
      <Image
        src={photo}
        alt="海边"
        preview
        style={{ width: '160px', height: '90px' }}
        imageStyle={{ objectPosition: 'left top' }}
      />
    ),
    settle: loaded(),
  },
])
