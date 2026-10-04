import { h } from 'vue'
import VContextMenu from '@hina-ui/vue/components/context-menu/ContextMenu.vue'
import VContextMenuItem from '@hina-ui/vue/components/context-menu/ContextMenuItem.vue'
import { ContextMenu } from '@hina-ui/react/components/context-menu/ContextMenu'
import { ContextMenuItem } from '@hina-ui/react/components/context-menu/ContextMenuItem'
import { defineCases } from '../src/cases'

const content = () => h(VContextMenuItem, () => 'Copy')
const reactContent = <ContextMenuItem>Copy</ContextMenuItem>
const area = 'width:240px;height:120px'

export default defineCases('ContextMenu', [
  {
    name: 'closed trigger area',
    vue: () =>
      h(
        VContextMenu,
        { label: 'File actions' },
        { default: () => h('div', { 'data-area': '', style: area }, 'Right click'), content },
      ),
    react: () => (
      <ContextMenu label="File actions" content={reactContent}>
        <div data-area="" style={{ width: '240px', height: '120px' }}>
          Right click
        </div>
      </ContextMenu>
    ),
  },
  {
    name: 'disabled trigger area',
    vue: () =>
      h(
        VContextMenu,
        { disabled: true, class: 'w-64' },
        { default: () => h('div', { class: 'rounded-lg', style: area }, 'Disabled'), content },
      ),
    react: () => (
      <ContextMenu disabled className="w-64" content={reactContent}>
        <div className="rounded-lg" style={{ width: '240px', height: '120px' }}>
          Disabled
        </div>
      </ContextMenu>
    ),
  },
  {
    name: 'controlled open renders only the trigger on the server',
    vue: () => h(VContextMenu, { open: true }, { default: () => h('section', 'Area'), content }),
    react: () => (
      <ContextMenu open content={reactContent}>
        <section>Area</section>
      </ContextMenu>
    ),
  },
  {
    name: 'trigger without children renders nothing',
    vue: () => h('div', [h(VContextMenu, null, { content })]),
    react: () => (
      <div>
        <ContextMenu content={reactContent} />
      </div>
    ),
  },
])
