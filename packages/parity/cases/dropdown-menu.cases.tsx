import { h } from 'vue'
import VDropdownMenu from '@hina-ui/vue/components/dropdown-menu/DropdownMenu.vue'
import VDropdownMenuItem from '@hina-ui/vue/components/dropdown-menu/DropdownMenuItem.vue'
import VButton from '@hina-ui/vue/components/button/Button.vue'
import VIconButton from '@hina-ui/vue/components/icon-button/IconButton.vue'
import VDisclosureIcon from '@hina-ui/vue/components/disclosure-icon/DisclosureIcon.vue'
import { DropdownMenu } from '@hina-ui/react/components/dropdown-menu/DropdownMenu'
import { DropdownMenuItem } from '@hina-ui/react/components/dropdown-menu/DropdownMenuItem'
import { Button } from '@hina-ui/react/components/button/Button'
import { IconButton } from '@hina-ui/react/components/icon-button/IconButton'
import { DisclosureIcon } from '@hina-ui/react/components/disclosure-icon/DisclosureIcon'
import { defineCases, type ParityCase } from '../src/cases'

const content = () => h(VDropdownMenuItem, () => 'Copy')
const reactContent = <DropdownMenuItem>Copy</DropdownMenuItem>

const sides = ['top', 'right', 'bottom', 'left'] as const
const aligns = ['start', 'center', 'end'] as const

const placements: ParityCase[] = sides.flatMap(side =>
  aligns.map(align => ({
    name: `trigger press origin for ${side} ${align}`,
    vue: () =>
      h(VDropdownMenu, { side, align }, { default: () => h(VButton, () => 'Open'), content }),
    react: () => (
      <DropdownMenu side={side} align={align} content={reactContent}>
        <Button>Open</Button>
      </DropdownMenu>
    ),
  })),
)

export default defineCases('DropdownMenu', [
  {
    name: 'closed trigger with menu wiring',
    vue: () =>
      h(
        VDropdownMenu,
        { label: 'More' },
        {
          default: () => h(VButton, { variant: 'outline', tone: 'neutral' }, () => 'Open'),
          content,
        },
      ),
    react: () => (
      <DropdownMenu label="More" content={reactContent}>
        <Button variant="outline" tone="neutral">
          Open
        </Button>
      </DropdownMenu>
    ),
  },
  ...placements,
  {
    name: 'closed non-modal menu with class and attributes renders only the trigger',
    vue: () =>
      h(
        VDropdownMenu,
        { modal: false, class: 'w-64', 'data-testid': 'menu', sideOffset: 4, dir: 'rtl' },
        { default: () => h(VButton, () => 'Open'), content },
      ),
    react: () => (
      <DropdownMenu
        modal={false}
        className="w-64"
        data-testid="menu"
        sideOffset={4}
        dir="rtl"
        content={reactContent}
      >
        <Button>Open</Button>
      </DropdownMenu>
    ),
  },
  {
    name: 'trigger with a disclosure icon',
    vue: () =>
      h(
        VDropdownMenu,
        { align: 'start' },
        {
          default: () =>
            h(
              VButton,
              { variant: 'outline', tone: 'neutral' },
              { default: () => 'File', trailing: () => h(VDisclosureIcon) },
            ),
          content,
        },
      ),
    react: () => (
      <DropdownMenu align="start" content={reactContent}>
        <Button variant="outline" tone="neutral" trailing={<DisclosureIcon />}>
          File
        </Button>
      </DropdownMenu>
    ),
  },
  {
    name: 'link trigger',
    vue: () =>
      h(
        VDropdownMenu,
        { align: 'start' },
        { default: () => h('a', { href: '#' }, 'Link'), content },
      ),
    react: () => (
      <DropdownMenu align="start" content={reactContent}>
        <a href="#">Link</a>
      </DropdownMenu>
    ),
  },
  {
    name: 'div trigger',
    vue: () => h(VDropdownMenu, null, { default: () => h('div', 'Area'), content }),
    react: () => (
      <DropdownMenu content={reactContent}>
        <div>Area</div>
      </DropdownMenu>
    ),
  },
  {
    name: 'IconButton trigger',
    vue: () =>
      h(VDropdownMenu, null, {
        default: () => h(VIconButton, { label: 'Actions', tooltip: false }, () => h('svg')),
        content,
      }),
    react: () => (
      <DropdownMenu content={reactContent}>
        <IconButton label="Actions" tooltip={false}>
          <svg />
        </IconButton>
      </DropdownMenu>
    ),
  },
  {
    name: 'open external anchor renders nothing on the server',
    vue: () => h('div', [h(VDropdownMenu, { anchor: null, open: true }, { content })]),
    react: () => (
      <div>
        <DropdownMenu anchor={null} open content={reactContent} />
      </div>
    ),
  },
  {
    name: 'controlled open renders the collapsed trigger on the server',
    vue: () =>
      h(VDropdownMenu, { open: true }, { default: () => h(VButton, () => 'Open'), content }),
    react: () => (
      <DropdownMenu open content={reactContent}>
        <Button>Open</Button>
      </DropdownMenu>
    ),
  },
])
