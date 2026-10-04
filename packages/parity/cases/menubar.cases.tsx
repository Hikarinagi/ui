import { h } from 'vue'
import VMenubar from '@hina-ui/vue/components/menubar/Menubar.vue'
import VMenubarMenu from '@hina-ui/vue/components/menubar/MenubarMenu.vue'
import VMenubarItem from '@hina-ui/vue/components/menubar/MenubarItem.vue'
import { Menubar } from '@hina-ui/react/components/menubar/Menubar'
import { MenubarMenu } from '@hina-ui/react/components/menubar/MenubarMenu'
import { MenubarItem } from '@hina-ui/react/components/menubar/MenubarItem'
import { defineCases } from '../src/cases'

const vueMenus = () => [
  h(VMenubarMenu, { label: 'File', value: 'file' }, () => h(VMenubarItem, () => 'New')),
  h(VMenubarMenu, { label: 'View', value: 'view' }, () => h(VMenubarItem, () => 'Zoom')),
  h(VMenubarMenu, { label: 'Help', value: 'help', disabled: true }, () =>
    h(VMenubarItem, () => 'About'),
  ),
]
const reactMenus = (
  <>
    <MenubarMenu label="File" value="file">
      <MenubarItem>New</MenubarItem>
    </MenubarMenu>
    <MenubarMenu label="View" value="view">
      <MenubarItem>Zoom</MenubarItem>
    </MenubarMenu>
    <MenubarMenu label="Help" value="help" disabled>
      <MenubarItem>About</MenubarItem>
    </MenubarMenu>
  </>
)

export default defineCases('Menubar', [
  {
    name: 'closed bar with enabled and disabled menus',
    vue: () => h(VMenubar, { label: 'Application' }, vueMenus),
    react: () => <Menubar label="Application">{reactMenus}</Menubar>,
  },
  {
    name: 'non-looping bar with class and attributes',
    vue: () => h(VMenubar, { loop: false, class: 'w-full', 'data-testid': 'bar' }, vueMenus),
    react: () => (
      <Menubar loop={false} className="w-full" data-testid="bar">
        {reactMenus}
      </Menubar>
    ),
  },
  {
    name: 'controlled value renders closed triggers on the server',
    vue: () => h(VMenubar, { modelValue: 'file' }, vueMenus),
    react: () => <Menubar value="file">{reactMenus}</Menubar>,
  },
  {
    name: 'rich label slot and menu class',
    vue: () =>
      h(VMenubar, null, () =>
        h(
          VMenubarMenu,
          { value: 'edit', class: 'w-56' },
          {
            label: () => [h('strong', 'Edit'), ' menu'],
            default: () => h(VMenubarItem, () => 'Undo'),
          },
        ),
      ),
    react: () => (
      <Menubar>
        <MenubarMenu
          value="edit"
          className="w-56"
          label={
            <>
              <strong>Edit</strong> menu
            </>
          }
        >
          <MenubarItem>Undo</MenubarItem>
        </MenubarMenu>
      </Menubar>
    ),
  },
  {
    name: 'menus without values use generated identifiers',
    vue: () =>
      h(VMenubar, null, () => [
        h(VMenubarMenu, { label: 'One' }, () => h(VMenubarItem, () => 'A')),
        h(VMenubarMenu, { label: 'Two' }, () => h(VMenubarItem, () => 'B')),
      ]),
    react: () => (
      <Menubar>
        <MenubarMenu label="One">
          <MenubarItem>A</MenubarItem>
        </MenubarMenu>
        <MenubarMenu label="Two">
          <MenubarItem>B</MenubarItem>
        </MenubarMenu>
      </Menubar>
    ),
  },
])
