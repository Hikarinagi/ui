import { h } from 'vue'
import VDrawer from '@hina-ui/vue/components/drawer/Drawer.vue'
import VButton from '@hina-ui/vue/components/button/Button.vue'
import { Drawer, type DrawerProps } from '@hina-ui/react/components/drawer/Drawer'
import { Button } from '@hina-ui/react/components/button/Button'
import { defineLiveCases } from '../src/live'
import {
  clickFirst,
  clickScrim,
  clickText,
  clickTrigger,
  pressEscape,
  settleClosed,
  settleOpen,
  sequence,
  unstamp,
  wait,
} from './dialog.live'

const opened = settleOpen()
const closed = settleClosed()
const openAndSettle = sequence(clickTrigger, opened, unstamp)

const base = { title: '筛选条件', description: '按标签与年份过滤。' }
const vueTrigger = () => h(VButton, { variant: 'outline', tone: 'neutral' }, () => '打开抽屉')
const reactTrigger = (
  <Button variant="outline" tone="neutral">
    打开抽屉
  </Button>
)
const vueSlots = {
  default: vueTrigger,
  content: () => h('p', '抽屉正文'),
  footer: ({ close }: { close: () => void }) => h(VButton, { onClick: close }, () => '应用'),
}
const reactSlots = {
  renderContent: () => <p>抽屉正文</p>,
  renderFooter: ({ close }: { close: () => void }) => <Button onClick={close}>应用</Button>,
}

function pair(name: string, props: Partial<DrawerProps> & Record<string, unknown>) {
  const { className, ...rest } = props
  return {
    name,
    vue: () => h(VDrawer, { ...base, ...rest, class: className }, vueSlots),
    react: () => (
      <Drawer {...base} {...reactSlots} {...props}>
        {reactTrigger}
      </Drawer>
    ),
    interact: clickTrigger,
    settle: opened,
  }
}

export default defineLiveCases('Drawer', [
  pair('default end side', {}),
  pair('start side, size sm', { side: 'start', size: 'sm' }),
  pair('size lg with class', { size: 'lg', className: 'shadow-xl' }),
  pair('header hidden', { header: false }),
  pair('not closable without a description', { closable: false, description: undefined }),
  pair('locked disables the close button', { locked: true }),
  {
    name: 'icon and title slots',
    vue: () =>
      h(VDrawer, base, {
        ...vueSlots,
        icon: () => h('svg', { 'data-icon': '' }),
        title: () => h('span', '自定义标题'),
      }),
    react: () => (
      <Drawer {...base} {...reactSlots} icon={<svg data-icon="" />} title={<span>自定义标题</span>}>
        {reactTrigger}
      </Drawer>
    ),
    interact: clickTrigger,
    settle: opened,
  },
  {
    name: 'custom body',
    vue: () =>
      h(VDrawer, base, {
        ...vueSlots,
        body: ({ close }: { close: () => void }) =>
          h('div', { 'data-body': '' }, [h('button', { onClick: close }, '完成')]),
      }),
    react: () => (
      <Drawer
        {...base}
        {...reactSlots}
        renderBody={({ close }) => (
          <div data-body="">
            <button onClick={close}>完成</button>
          </div>
        )}
      >
        {reactTrigger}
      </Drawer>
    ),
    interact: clickTrigger,
    settle: opened,
  },
  {
    name: 'Escape closes and returns focus to the trigger',
    vue: () => h(VDrawer, base, vueSlots),
    react: () => (
      <Drawer {...base} {...reactSlots}>
        {reactTrigger}
      </Drawer>
    ),
    interact: sequence(openAndSettle, pressEscape),
    settle: closed,
  },
  {
    name: 'scrim click closes',
    vue: () => h(VDrawer, base, vueSlots),
    react: () => (
      <Drawer {...base} {...reactSlots}>
        {reactTrigger}
      </Drawer>
    ),
    interact: sequence(openAndSettle, clickScrim),
    settle: closed,
  },
  {
    name: 'close button closes',
    vue: () => h(VDrawer, base, vueSlots),
    react: () => (
      <Drawer {...base} {...reactSlots}>
        {reactTrigger}
      </Drawer>
    ),
    interact: sequence(openAndSettle, clickFirst('[role="dialog"] [aria-label="关闭"]')),
    settle: closed,
  },
  {
    name: 'footer close',
    vue: () => h(VDrawer, base, vueSlots),
    react: () => (
      <Drawer {...base} {...reactSlots}>
        {reactTrigger}
      </Drawer>
    ),
    interact: sequence(openAndSettle, clickText('[role="dialog"]', '应用')),
    settle: closed,
  },
  {
    name: 'locked ignores Escape and scrim clicks',
    vue: () => h(VDrawer, { ...base, locked: true }, vueSlots),
    react: () => (
      <Drawer {...base} {...reactSlots} locked>
        {reactTrigger}
      </Drawer>
    ),
    interact: sequence(openAndSettle, pressEscape, clickScrim, () => wait(300)),
    settle: opened,
  },
])
