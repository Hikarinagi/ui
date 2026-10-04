import { defineComponent, h, shallowRef } from 'vue'
import { vi } from 'vitest'
import { useRef } from 'react'
import VScrollTop from '@hina-ui/vue/components/scroll-top/ScrollTop.vue'
import VTooltipProvider from '@hina-ui/vue/components/tooltip/TooltipProvider.vue'
import { ScrollTop } from '@hina-ui/react/components/scroll-top/ScrollTop'
import type { ScrollTopProps } from '@hina-ui/react/components/scroll-top/types'
import { TooltipProvider } from '@hina-ui/react/components/tooltip/TooltipProvider'
import { defineLiveCases, frames } from '../src/live'

type Options = Pick<
  ScrollTopProps,
  'label' | 'extended' | 'size' | 'variant' | 'tone' | 'shape' | 'position' | 'offset'
> & { provider?: boolean }

const scrollerStyle = 'height:200px;width:300px;overflow:auto'

function VHarness(options: Options) {
  const { provider, ...props } = options
  return defineComponent({
    setup() {
      const element = shallowRef<HTMLElement>()
      const control = () =>
        h(VScrollTop, {
          target: () => element.value,
          threshold: 100,
          position: 'static',
          behavior: 'instant',
          ...props,
        })
      return () =>
        h('div', [
          h('div', { ref: element, id: 'scroller', style: scrollerStyle }, [
            h('div', { style: 'height:1800px' }, 'Content'),
          ]),
          provider ? h(VTooltipProvider, { delayDuration: 0 }, control) : control(),
        ])
    },
  })
}

function Harness(options: Options) {
  const { provider, ...props } = options
  const element = useRef<HTMLDivElement>(null)
  const control = (
    <ScrollTop
      target={() => element.current}
      threshold={100}
      position="static"
      behavior="instant"
      {...props}
    />
  )
  return (
    <div>
      <div
        ref={element}
        id="scroller"
        style={{ height: '200px', width: '300px', overflow: 'auto' }}
      >
        <div style={{ height: '1800px' }}>Content</div>
      </div>
      {provider ? <TooltipProvider delayDuration={0}>{control}</TooltipProvider> : control}
    </div>
  )
}

function both(name: string, options: Options, top: number) {
  const Vue = VHarness(options)
  return {
    name,
    vue: () => h(Vue),
    react: () => <Harness {...options} />,
    interact: (container: HTMLElement) => {
      container.querySelector<HTMLElement>('#scroller')!.scrollTop = top
    },
    settle: async () => {
      await vi.waitFor(() => {
        const visible = !!document.querySelector('[data-hn-scroll-top]')
        if (visible !== top > 100) throw new Error('visibility pending')
        if (document.querySelector('[class*="hn-transition-base"]')) throw new Error('entering')
      })
      await frames()
    },
  }
}

export default defineLiveCases('ScrollTop', [
  both('hidden below the threshold', {}, 50),
  both('visible past the threshold with the default icon', {}, 500),
  both(
    'extended label inside a tooltip provider',
    { extended: true, provider: true, size: 'sm' },
    500,
  ),
  both(
    'custom label, placement and appearance',
    {
      label: '返回检查项开头',
      variant: 'soft',
      tone: 'accent',
      shape: 'square',
      position: 'absolute',
      offset: 16,
      provider: true,
    },
    500,
  ),
])
