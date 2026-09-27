import { afterEach, describe, expect, it, vi } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { frame } from 'motion-v'
import Image from '../image/Image.vue'
import ImageGroup from '../image/ImageGroup.vue'
import Lightbox from './Lightbox.vue'

afterEach(() => vi.restoreAllMocks())

describe('Image preview SSR', () => {
  const items = [{ id: 'photo', src: '/photo.webp', alt: 'Photo' }]

  it.each([
    ['Image', () => h(Image, { src: '/photo.webp', alt: 'Photo', lazy: false })],
    [
      'Image preview',
      () => h(Image, { src: '/photo.webp', alt: 'Photo', lazy: false, preview: true }),
    ],
    [
      'ImageGroup',
      () =>
        h(ImageGroup, null, {
          default: () => h(Image, { src: '/photo.webp', alt: 'Photo', lazy: false, preview: true }),
        }),
    ],
    ['Lightbox closed', () => h(Lightbox, { items })],
    ['Lightbox open', () => h(Lightbox, { items, open: true })],
  ])('%s does not retain requests in the animation frame queue', async (_name, render) => {
    const read = vi.spyOn(frame, 'read')
    const preRender = vi.spyOn(frame, 'preRender')

    for (let request = 0; request < 3; request++) {
      const html = await renderToString(createSSRApp({ render }))
      if (_name.startsWith('Image')) {
        expect(html).toContain('src="/photo.webp"')
        expect(html).toContain('alt="Photo"')
      }
    }

    expect(read).not.toHaveBeenCalled()
    expect(preRender).not.toHaveBeenCalled()
  })
})
