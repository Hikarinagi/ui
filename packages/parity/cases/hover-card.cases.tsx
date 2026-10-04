import { h } from 'vue'
import VHoverCard from '@hina-ui/vue/components/hover-card/HoverCard.vue'
import VLink from '@hina-ui/vue/components/link/Link.vue'
import { HoverCard } from '@hina-ui/react/components/hover-card/HoverCard'
import { Link } from '@hina-ui/react/components/link/Link'
import { defineCases } from '../src/cases'

const content = () => 'Content'

export default defineCases('HoverCard', [
  {
    name: 'closed link trigger',
    vue: () => h(VHoverCard, null, { default: () => h('a', { href: '#' }, 'Trigger'), content }),
    react: () => (
      <HoverCard content="Content">
        <a href="#">Trigger</a>
      </HoverCard>
    ),
  },
  {
    name: 'Link component trigger with placement and positioner class',
    vue: () =>
      h(
        VHoverCard,
        { side: 'top', align: 'start', positionerClass: 'positioner-only', class: 'w-64' },
        { default: () => h(VLink, { href: '#' }, () => 'Reka UI'), content },
      ),
    react: () => (
      <HoverCard
        side="top"
        align="start"
        positionerClass="positioner-only"
        className="w-64"
        content="Content"
      >
        <Link href="#">Reka UI</Link>
      </HoverCard>
    ),
  },
  {
    name: 'button trigger',
    vue: () =>
      h(VHoverCard, null, { default: () => h('button', { type: 'button' }, 'Trigger'), content }),
    react: () => (
      <HoverCard content="Content">
        <button type="button">Trigger</button>
      </HoverCard>
    ),
  },
  {
    name: 'open state renders only the trigger on the server',
    vue: () =>
      h(VHoverCard, { open: true }, { default: () => h('a', { href: '#' }, 'Trigger'), content }),
    react: () => (
      <HoverCard open content="Content">
        <a href="#">Trigger</a>
      </HoverCard>
    ),
  },
  {
    name: 'empty trigger slot with a null anchor renders nothing',
    vue: () =>
      h('div', [
        h(
          VHoverCard,
          { anchor: null, open: true, positionerClass: 'positioner-only' },
          { content },
        ),
      ]),
    react: () => (
      <div>
        <HoverCard anchor={null} open positionerClass="positioner-only" content="Content" />
      </div>
    ),
  },
])
