import { h } from 'vue'
import VPopover from '@hina-ui/vue/components/popover/Popover.vue'
import VButton from '@hina-ui/vue/components/button/Button.vue'
import VIconButton from '@hina-ui/vue/components/icon-button/IconButton.vue'
import { Popover } from '@hina-ui/react/components/popover/Popover'
import { Button } from '@hina-ui/react/components/button/Button'
import { IconButton } from '@hina-ui/react/components/icon-button/IconButton'
import { defineCases, type ParityCase } from '../src/cases'

const content = () => h('p', 'Panel')

const sides = ['top', 'right', 'bottom', 'left'] as const
const aligns = ['start', 'center', 'end'] as const

const placements: ParityCase[] = sides.flatMap(side =>
  aligns.map(align => ({
    name: `trigger press origin for ${side} ${align}`,
    vue: () => h(VPopover, { side, align }, { default: () => h(VButton, () => 'Open'), content }),
    react: () => (
      <Popover side={side} align={align} content={<p>Panel</p>}>
        <Button>Open</Button>
      </Popover>
    ),
  })),
)

export default defineCases('Popover', [
  {
    name: 'closed trigger with dialog wiring',
    vue: () =>
      h(VPopover, null, {
        default: () => h(VButton, { variant: 'outline', tone: 'neutral' }, () => 'Open'),
        content,
      }),
    react: () => (
      <Popover content={<p>Panel</p>}>
        <Button variant="outline" tone="neutral">
          Open
        </Button>
      </Popover>
    ),
  },
  ...placements,
  {
    name: 'closed non-modal unpadded popover renders only the trigger',
    vue: () =>
      h(
        VPopover,
        { modal: false, padded: false, class: 'w-64', 'aria-label': 'Details' },
        { default: () => h(VButton, () => 'Open'), content },
      ),
    react: () => (
      <Popover
        modal={false}
        padded={false}
        className="w-64"
        aria-label="Details"
        content={<p>Panel</p>}
      >
        <Button>Open</Button>
      </Popover>
    ),
  },
  {
    name: 'link trigger',
    vue: () =>
      h(VPopover, { align: 'start' }, { default: () => h('a', { href: '#' }, 'Link'), content }),
    react: () => (
      <Popover align="start" content={<p>Panel</p>}>
        <a href="#">Link</a>
      </Popover>
    ),
  },
  {
    name: 'IconButton trigger',
    vue: () =>
      h(VPopover, null, {
        default: () => h(VIconButton, { label: 'Info', tooltip: false }, () => h('svg')),
        content,
      }),
    react: () => (
      <Popover content={<p>Panel</p>}>
        <IconButton label="Info" tooltip={false}>
          <svg />
        </IconButton>
      </Popover>
    ),
  },
  {
    name: 'open external anchor renders nothing on the server',
    vue: () => h('div', [h(VPopover, { anchor: null, open: true }, { content })]),
    react: () => (
      <div>
        <Popover anchor={null} open content={<p>Panel</p>} />
      </div>
    ),
  },
  {
    name: 'controlled open renders the expanded trigger state only after mount',
    vue: () => h(VPopover, { open: true }, { default: () => h(VButton, () => 'Open'), content }),
    react: () => (
      <Popover open content={<p>Panel</p>}>
        <Button>Open</Button>
      </Popover>
    ),
  },
])
