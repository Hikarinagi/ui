import { h } from 'vue'
import VScrollArea from '@hina-ui/vue/components/scroll-area/ScrollArea.vue'
import { ScrollArea } from '@hina-ui/react/components/scroll-area/ScrollArea'
import { defineCases } from '../src/cases'

const body = () => h('p', 'Content')

export default defineCases('ScrollArea', [
  {
    name: 'vertical by default',
    vue: () => h(VScrollArea, null, body),
    react: () => (
      <ScrollArea>
        <p>Content</p>
      </ScrollArea>
    ),
  },
  ...(['horizontal', 'both'] as const).map(direction => ({
    name: `${direction} edge shadows`,
    vue: () => h(VScrollArea, { direction }, body),
    react: () => (
      <ScrollArea direction={direction}>
        <p>Content</p>
      </ScrollArea>
    ),
  })),
  {
    name: 'without shadows, with class, attributes and direction',
    vue: () =>
      h(
        VScrollArea,
        { shadow: false, class: 'max-h-40', dir: 'rtl', id: 'feed', 'data-testid': 'area' },
        body,
      ),
    react: () => (
      <ScrollArea shadow={false} className="max-h-40" dir="rtl" id="feed" data-testid="area">
        <p>Content</p>
      </ScrollArea>
    ),
  },
  {
    name: 'focusable region with the default label',
    vue: () => h(VScrollArea, { focusable: true }, body),
    react: () => (
      <ScrollArea focusable>
        <p>Content</p>
      </ScrollArea>
    ),
  },
  {
    name: 'focusable region with a custom label',
    vue: () => h(VScrollArea, { focusable: true, label: 'Changelog' }, body),
    react: () => (
      <ScrollArea focusable label="Changelog">
        <p>Content</p>
      </ScrollArea>
    ),
  },
])
