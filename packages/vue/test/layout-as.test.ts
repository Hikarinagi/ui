import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h, markRaw, type FunctionalComponent } from 'vue'
import { renderToString } from 'vue/server-renderer'
import Inline from '../src/components/inline/Inline.vue'
import Flex from '../src/components/flex/Flex.vue'
import Stack from '../src/components/stack/Stack.vue'

const ObjectLink = markRaw(
  defineComponent({
    props: { to: { type: String, required: true } },
    emits: ['activate'],
    setup(props, { slots, emit }) {
      return () =>
        h(
          'a',
          {
            href: props.to,
            class: 'custom-root',
            onClick: (event: MouseEvent) => {
              event.preventDefault()
              emit('activate', props.to)
            },
          },
          slots.default?.(),
        )
    },
  }),
)
const FunctionalLink: FunctionalComponent<{ to: string }, { activate: [destination: string] }> = (
  props,
  { slots, emit },
) =>
  h(
    'a',
    {
      href: props.to,
      class: 'custom-root',
      onClick: (event: MouseEvent) => {
        event.preventDefault()
        emit('activate', props.to)
      },
    },
    slots.default?.(),
  )
FunctionalLink.props = ['to']
FunctionalLink.emits = ['activate']

afterEach(() => vi.restoreAllMocks())

describe.each([
  ['Inline', Inline],
  ['Flex', Flex],
  ['Stack', Stack],
] as const)('%s component roots', (_, Layout) => {
  it.each([ObjectLink, FunctionalLink])(
    'forwards layout, props, attributes, content and events',
    async as => {
      const warn = vi.spyOn(console, 'warn')
      const activate = vi.fn()
      const w = mount(Layout, {
        props: { as, gap: 'sm', class: 'caller-class' },
        attrs: { to: '/destination', 'aria-label': 'Destination', onActivate: activate },
        slots: { default: () => h('span', 'Open destination') },
      })
      try {
        expect(w.element.tagName).toBe('A')
        expect(w.classes()).toEqual(
          expect.arrayContaining(['flex', 'gap-2', 'custom-root', 'caller-class']),
        )
        expect(w.attributes('href')).toBe('/destination')
        expect(w.attributes('aria-label')).toBe('Destination')
        expect(w.get('span').text()).toBe('Open destination')
        await w.trigger('click')
        expect(activate).toHaveBeenCalledExactlyOnceWith('/destination')
        expect(warn).not.toHaveBeenCalled()
      } finally {
        w.unmount()
      }
    },
  )

  it.each([ObjectLink, FunctionalLink])(
    'renders the component root and layout during SSR',
    async as => {
      const warn = vi.spyOn(console, 'warn')
      const html = await renderToString(
        h(Layout, { as, gap: 'sm', to: '/destination' }, () => 'Destination'),
      )
      const host = document.createElement('div')
      host.innerHTML = html
      expect(host.childElementCount).toBe(1)
      const root = host.firstElementChild!
      expect(root.tagName).toBe('A')
      expect(root.getAttribute('href')).toBe('/destination')
      expect([...root.classList]).toEqual(expect.arrayContaining(['flex', 'gap-2', 'custom-root']))
      expect(root.textContent).toBe('Destination')
      expect(warn).not.toHaveBeenCalled()
    },
  )
})
