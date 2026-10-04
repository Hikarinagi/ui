import { afterEach, describe, expect, it, vi } from 'vitest'
import type { ReactElement } from 'react'
import { renderToString } from 'react-dom/server'
import { frame } from 'motion/react'
import { Image } from '../image/Image'
import { ImageGroup } from '../image/ImageGroup'
import { Lightbox } from './Lightbox'

afterEach(() => vi.restoreAllMocks())

describe('Image preview SSR', () => {
  const items = [{ id: 'photo', src: '/photo.webp', alt: 'Photo' }]

  it.each<[string, () => ReactElement]>([
    ['Image', () => <Image src="/photo.webp" alt="Photo" lazy={false} />],
    ['Image preview', () => <Image src="/photo.webp" alt="Photo" lazy={false} preview />],
    [
      'ImageGroup',
      () => (
        <ImageGroup>
          <Image src="/photo.webp" alt="Photo" lazy={false} preview />
        </ImageGroup>
      ),
    ],
    ['Lightbox closed', () => <Lightbox items={items} />],
    ['Lightbox open', () => <Lightbox items={items} open />],
  ])('%s does not retain requests in the animation frame queue', async (_name, render) => {
    const read = vi.spyOn(frame, 'read')
    const preRender = vi.spyOn(frame, 'preRender')

    for (let request = 0; request < 3; request++) {
      const html = renderToString(render())
      if (_name.startsWith('Image')) {
        expect(html).toContain('src="/photo.webp"')
        expect(html).toContain('alt="Photo"')
      }
    }

    expect(read).not.toHaveBeenCalled()
    expect(preRender).not.toHaveBeenCalled()
  })
})
