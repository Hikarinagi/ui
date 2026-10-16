import { h } from 'vue'
import { userEvent } from 'vitest/browser'
import { vi } from 'vitest'
import VTour from '@hina-ui/vue/components/tour/Tour.vue'
import { Tour, type TourStep } from '@hina-ui/react/components/tour/Tour'
import { defineLiveCases, frames } from '../src/live'

const steps: TourStep[] = [
  {
    target: '#tour-first',
    title: 'Create',
    description: 'Start a project here.',
    blockTarget: true,
  },
  { target: '#tour-second', title: 'Search', description: 'Find it by name.' },
  { target: '#tour-missing', title: 'Welcome', description: 'Nothing to point at.' },
  {
    target: '#tour-third',
    title: 'Settings',
    side: 'right',
    align: 'start',
    padding: 4,
    radius: 2,
  },
]

const hostStyle = 'display:flex;gap:64px;padding:96px 48px'

function vueHost(props: Record<string, unknown>) {
  return () =>
    h('div', { style: hostStyle }, [
      h('button', { id: 'tour-first' }, 'First'),
      h('input', { id: 'tour-second', 'aria-label': 'Search' }),
      h('button', { id: 'tour-third' }, 'Third'),
      h(VTour, { steps, ...props }),
    ])
}

function reactHost(props: Partial<Parameters<typeof Tour>[0]>) {
  return () => (
    <div style={{ display: 'flex', gap: 64, padding: '96px 48px' }}>
      <button id="tour-first">First</button>
      <input id="tour-second" aria-label="Search" />
      <button id="tour-third">Third</button>
      <Tour steps={steps} {...props} />
    </div>
  )
}

async function shown() {
  await vi.waitFor(() => {
    const card = document.querySelector<HTMLElement>('[data-hn-tour]')
    if (!card || !card.contains(document.activeElement)) throw new Error('card not focused')
    const wrapper = card.closest<HTMLElement>(
      '[data-reka-popper-content-wrapper],[data-radix-popper-content-wrapper]',
    )
    if (wrapper?.style.transform.includes('-200%')) throw new Error('not positioned')
  })
  const animated = document.querySelectorAll<HTMLElement>('[data-hn-tour], [data-hn-tour-mask]')
  await Promise.allSettled(
    [...animated].flatMap(node => node.getAnimations().map(animation => animation.finished)),
  )
  await frames()
}

async function beaconShown() {
  await vi.waitFor(() => {
    if (!document.querySelector('[data-hn-tour-beacon]')) throw new Error('no beacon')
  })
  await frames()
}

export default defineLiveCases('Tour', [
  {
    name: 'first step with the spotlight',
    vue: vueHost({ open: true }),
    react: reactHost({ open: true }),
    settle: shown,
  },
  {
    name: 'a step without blockTarget leaves the target clickable',
    vue: vueHost({ open: true, step: 2 }),
    react: reactHost({ open: true, step: 2 }),
    settle: shown,
  },
  {
    name: 'missing target centres the card',
    vue: vueHost({ open: true, step: 3 }),
    react: reactHost({ open: true, step: 3 }),
    settle: shown,
  },
  {
    name: 'last step placed on the side with custom padding and texts',
    vue: vueHost({ open: true, step: 4, finishText: 'Got it', prevText: 'Previous' }),
    react: reactHost({ open: true, step: 4, finishText: 'Got it', prevText: 'Previous' }),
    settle: shown,
  },
  {
    name: 'locked without a mask',
    vue: vueHost({ open: true, locked: true, mask: false, class: 'w-96' }),
    react: reactHost({ open: true, locked: true, mask: false, className: 'w-96' }),
    settle: shown,
  },
  {
    name: 'beacon waits for a click',
    vue: vueHost({ open: true, beacon: true }),
    react: reactHost({ open: true, beacon: true }),
    settle: beaconShown,
  },
  {
    name: 'beacon opens the card',
    vue: vueHost({ open: true, beacon: true }),
    react: reactHost({ open: true, beacon: true }),
    interact: async () => {
      await beaconShown()
      await userEvent.click(document.querySelector<HTMLElement>('[data-hn-tour-beacon]')!)
    },
    settle: shown,
  },
  {
    name: 'after the beacon, next goes straight to the next card',
    vue: vueHost({ open: true, beacon: true }),
    react: reactHost({ open: true, beacon: true }),
    interact: async () => {
      await beaconShown()
      await userEvent.click(document.querySelector<HTMLElement>('[data-hn-tour-beacon]')!)
      await shown()
      await userEvent.click(document.querySelector<HTMLElement>('[data-hn-tour-next]')!)
    },
    settle: async () => {
      await vi.waitFor(() => {
        if (!document.querySelector('[data-hn-tour]')?.textContent?.includes('Search'))
          throw new Error('still on the first step')
      })
      await shown()
    },
  },
  {
    name: 'next moves to the second step',
    vue: vueHost({ open: true }),
    react: reactHost({ open: true }),
    interact: async () => {
      await shown()
      await userEvent.click(document.querySelector<HTMLElement>('[data-hn-tour-next]')!)
    },
    settle: async () => {
      await vi.waitFor(() => {
        if (!document.querySelector('[data-hn-tour]')?.textContent?.includes('Search'))
          throw new Error('still on the first step')
      })
      await shown()
    },
  },
])
