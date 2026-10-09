import { h } from 'vue'
import { userEvent } from 'vitest/browser'
import { vi } from 'vitest'
import VLightbox from '@hina-ui/vue/components/lightbox/Lightbox.vue'
import VImage from '@hina-ui/vue/components/image/Image.vue'
import VImageGroup from '@hina-ui/vue/components/image/ImageGroup.vue'
import { Lightbox } from '@hina-ui/react/components/lightbox/Lightbox'
import { Image } from '@hina-ui/react/components/image/Image'
import { ImageGroup } from '@hina-ui/react/components/image/ImageGroup'
import { defineLiveCases, frames } from '../src/live'

export function picture(width: number, height: number, fill = '#39c5bb') {
  return `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="100%" height="100%" fill="${fill}"/></svg>`,
  )}`
}

export async function quiet(stable = 10) {
  let last = ''
  let count = 0
  await vi.waitFor(
    () => {
      const running = document
        .getAnimations()
        .filter(
          animation =>
            animation.playState === 'running' &&
            animation.effect?.getTiming().iterations !== Infinity &&
            !((animation.effect as KeyframeEffect | null)?.target as Element | null)?.closest(
              '.os-scrollbar',
            ),
        )
      if (running.length)
        throw new Error(
          `animating ${running
            .map(animation => {
              const target = (animation.effect as KeyframeEffect | null)?.target as Element | null
              return `${animation.constructor.name}:${target?.outerHTML.slice(0, 160)}`
            })
            .join(' | ')}`,
        )
      const key = document.body.innerHTML
      count = key === last ? count + 1 : 0
      last = key
      if (count < stable) throw new Error('changing')
    },
    { timeout: 8000, interval: 16 },
  )
  await frames(2)
}

export function opened(phase = 'open') {
  return async () => {
    await vi.waitFor(
      () => {
        if (document.querySelector('[role="dialog"]')?.getAttribute('data-hn-phase') !== phase)
          throw new Error('not open')
      },
      { timeout: 5000 },
    )
    await quiet()
  }
}

const tool = (label: string) =>
  document.querySelector<HTMLElement>(`[data-hn-chrome] [aria-label="${label}"]`)!

const viewport = { width: 1024, height: 768 }

const wide = picture(2440, 1220)
const tall = picture(1220, 2440)
const square = picture(1800, 1800, '#171717')

const single = [{ id: 'one', src: wide, alt: '海边', previewSize: { width: 2440, height: 1220 } }]

const group = [
  { id: 'a', src: wide, alt: '第一张', previewSize: { width: 2440, height: 1220 } },
  { id: 'b', src: tall, alt: '第二张', previewSize: { width: 1220, height: 2440 } },
  { id: 'c', src: square, alt: '第三张', previewSize: { width: 1800, height: 1800 } },
]

export default defineLiveCases('lightbox', [
  {
    name: 'single item open with chrome and toolbar',
    vue: () => h(VLightbox, { items: single, open: true }),
    react: () => <Lightbox items={single} open />,
    viewport,
    settle: opened(),
  },
  {
    name: 'group open in the middle with strip, arrows and thumbs',
    vue: () => h(VLightbox, { items: group, open: true, index: 1 }),
    react: () => <Lightbox items={group} open defaultIndex={1} />,
    viewport,
    settle: opened(),
  },
  {
    name: 'looping group at the end keeps both arrows enabled',
    vue: () => h(VLightbox, { items: group, open: true, index: 2, loop: true }),
    react: () => <Lightbox items={group} open defaultIndex={2} loop />,
    viewport,
    settle: opened(),
  },
  {
    name: 'paging with the keyboard moves the strip',
    vue: () => h(VLightbox, { items: group, open: true }),
    react: () => <Lightbox items={group} open />,
    viewport,
    interact: async () => {
      await opened()()
      await userEvent.keyboard('{ArrowRight}')
    },
    settle: async () => {
      await vi.waitFor(() => {
        if (
          document.querySelector('[aria-current="true"]')?.getAttribute('aria-label') !== '第二张'
        )
          throw new Error('not paged')
      })
      await quiet()
    },
  },
  {
    name: 'zoom in from the toolbar enables reset and zoom out',
    vue: () => h(VLightbox, { items: single, open: true }),
    react: () => <Lightbox items={single} open />,
    viewport,
    interact: async () => {
      await opened()()
      await userEvent.click(tool('放大'))
    },
    settle: async () => {
      await vi.waitFor(() => {
        if ((tool('适应窗口') as HTMLButtonElement).disabled) throw new Error('not zoomed')
      })
      await quiet()
    },
  },
  {
    name: 'actual size at the original zoom level',
    vue: () => h(VLightbox, { items: single, open: true }),
    react: () => <Lightbox items={single} open />,
    viewport,
    interact: async () => {
      await opened()()
      await userEvent.click(tool('原始尺寸'))
    },
    settle: async () => {
      await vi.waitFor(() => {
        if (!(tool('原始尺寸') as HTMLButtonElement).disabled) throw new Error('not original')
      })
      await quiet()
    },
  },
  {
    name: 'rotate turns the current frame',
    vue: () => h(VLightbox, { items: single, open: true }),
    react: () => <Lightbox items={single} open />,
    viewport,
    interact: async () => {
      await opened()()
      await userEvent.click(tool('旋转'))
    },
    settle: () => quiet(),
  },
  {
    name: 'closed after Escape',
    vue: () => h(VLightbox, { items: single, open: true }),
    react: () => <Lightbox items={single} open />,
    viewport,
    interact: async () => {
      await opened()()
      await userEvent.keyboard('{Escape}')
    },
    settle: async () => {
      await vi.waitFor(() => {
        if (document.querySelector('[role="dialog"]')) throw new Error('still open')
      })
      await quiet()
    },
  },
  {
    name: 'image preview opens from its thumbnail',
    vue: () =>
      h('div', { style: 'padding: 80px' }, [
        h(VImage, { src: wide, alt: '海边', lazy: false, preview: true, class: 'size-48' }),
      ]),
    react: () => (
      <div style={{ padding: '80px' }}>
        <Image src={wide} alt="海边" lazy={false} preview className="size-48" />
      </div>
    ),
    viewport,
    interact: async container => {
      await vi.waitFor(() => {
        if (!container.querySelector('img')?.naturalWidth) throw new Error('loading')
      })
      await quiet()
      await userEvent.click(container.querySelector('button')!)
    },
    settle: opened(),
  },
  {
    name: 'image group opens at the clicked image',
    vue: () =>
      h(VImageGroup, null, () =>
        h(
          'div',
          { style: 'padding: 80px; display: flex; gap: 16px' },
          group.map(item =>
            h(VImage, {
              src: item.src,
              alt: item.alt,
              lazy: false,
              preview: true,
              class: 'size-48',
            }),
          ),
        ),
      ),
    react: () => (
      <ImageGroup>
        <div style={{ padding: '80px', display: 'flex', gap: '16px' }}>
          {group.map(item => (
            <Image
              key={item.id}
              src={item.src}
              alt={item.alt}
              lazy={false}
              preview
              className="size-48"
            />
          ))}
        </div>
      </ImageGroup>
    ),
    viewport,
    interact: async container => {
      await vi.waitFor(() => {
        const images = [...container.querySelectorAll('img')]
        if (images.length !== 3 || images.some(img => !img.naturalWidth)) throw new Error('loading')
      })
      await quiet()
      await userEvent.click(container.querySelectorAll('button')[2]!)
    },
    settle: opened(),
  },
])
