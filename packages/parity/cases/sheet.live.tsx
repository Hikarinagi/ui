import { h } from 'vue'
import VSheet from '@hina-ui/vue/components/sheet/Sheet.vue'
import VButton from '@hina-ui/vue/components/button/Button.vue'
import { Sheet, type SheetProps } from '@hina-ui/react/components/sheet/Sheet'
import { Button } from '@hina-ui/react/components/button/Button'
import { defineLiveCases } from '../src/live'
import {
  clickFirst,
  clickScrim,
  clickTrigger,
  pressEscape,
  settleClosed,
  settleOpen,
  sequence,
  unstamp,
  wait,
} from './dialog.live'

const opened = settleOpen('[data-hn-sheet]')
const closed = settleClosed()
const openAndSettle = sequence(clickTrigger, opened, unstamp)

const base = { title: '分享到', description: '选择一个去处。' }
const vueTrigger = () => h(VButton, { variant: 'outline', tone: 'neutral' }, () => '打开')
const reactTrigger = (
  <Button variant="outline" tone="neutral">
    打开
  </Button>
)
const vueSlots = {
  default: vueTrigger,
  content: () => h('div', { style: 'height: 160px' }, '正文'),
  footer: ({ close }: { close: () => void }) => h(VButton, { onClick: close }, () => '完成'),
}
const reactSlots = {
  renderContent: () => <div style={{ height: '160px' }}>正文</div>,
  renderFooter: ({ close }: { close: () => void }) => <Button onClick={close}>完成</Button>,
}

function pair(name: string, props: Partial<SheetProps> & Record<string, unknown>) {
  const { className, ...rest } = props
  return {
    name,
    vue: () => h(VSheet, { ...base, ...rest, class: className }, vueSlots),
    react: () => (
      <Sheet {...base} {...reactSlots} {...props}>
        {reactTrigger}
      </Sheet>
    ),
    interact: clickTrigger,
    settle: opened,
  }
}

async function drag(from: number, to: number) {
  const grip = document.querySelector<HTMLElement>('[data-hn-sheet-grip]')!
  const pointer = (type: string, y: number) =>
    new PointerEvent(type, {
      bubbles: true,
      cancelable: true,
      pointerId: 7,
      pointerType: 'touch',
      isPrimary: true,
      button: type === 'pointerdown' ? 0 : -1,
      clientX: 100,
      clientY: y,
    })
  grip.dispatchEvent(pointer('pointerdown', from))
  for (let i = 1; i <= 4; i++) {
    await wait(40)
    grip.dispatchEvent(pointer('pointermove', from + ((to - from) * i) / 4))
  }
}

export default defineLiveCases('Sheet', [
  pair('default with handle', {}),
  pair('handle hidden shows the close button', { handle: false }),
  pair('header hidden with handle', { header: false }),
  pair('header and handle hidden without description', {
    header: false,
    handle: false,
    description: undefined,
  }),
  pair('locked disables the handle', { locked: true }),
  pair('class merges', { className: 'sm:max-w-lg' }),
  {
    name: 'icon and title slots without handle',
    vue: () =>
      h(
        VSheet,
        { ...base, handle: false },
        {
          ...vueSlots,
          icon: () => h('svg', { 'data-icon': '' }),
          title: () => h('span', '自定义标题'),
        },
      ),
    react: () => (
      <Sheet
        {...base}
        {...reactSlots}
        handle={false}
        icon={<svg data-icon="" />}
        title={<span>自定义标题</span>}
      >
        {reactTrigger}
      </Sheet>
    ),
    interact: clickTrigger,
    settle: opened,
  },
  {
    name: 'custom body keeps the standalone grip',
    vue: () =>
      h(VSheet, base, {
        ...vueSlots,
        body: () => h('div', { 'data-body': '', style: 'height: 200px' }, '自定义'),
      }),
    react: () => (
      <Sheet
        {...base}
        {...reactSlots}
        renderBody={() => (
          <div data-body="" style={{ height: '200px' }}>
            自定义
          </div>
        )}
      >
        {reactTrigger}
      </Sheet>
    ),
    interact: clickTrigger,
    settle: opened,
  },
  {
    name: 'dragging the handle offsets the panel',
    vue: () => h(VSheet, base, vueSlots),
    react: () => (
      <Sheet {...base} {...reactSlots}>
        {reactTrigger}
      </Sheet>
    ),
    interact: sequence(openAndSettle, () => drag(600, 640)),
    settle: async () => {
      await wait(50)
    },
  },
  {
    name: 'Escape closes and returns focus to the trigger',
    vue: () => h(VSheet, base, vueSlots),
    react: () => (
      <Sheet {...base} {...reactSlots}>
        {reactTrigger}
      </Sheet>
    ),
    interact: sequence(openAndSettle, pressEscape),
    settle: closed,
  },
  {
    name: 'scrim click closes',
    vue: () => h(VSheet, base, vueSlots),
    react: () => (
      <Sheet {...base} {...reactSlots}>
        {reactTrigger}
      </Sheet>
    ),
    interact: sequence(openAndSettle, clickScrim),
    settle: closed,
  },
  {
    name: 'close button closes when the handle is hidden',
    vue: () => h(VSheet, { ...base, handle: false }, vueSlots),
    react: () => (
      <Sheet {...base} {...reactSlots} handle={false}>
        {reactTrigger}
      </Sheet>
    ),
    interact: sequence(openAndSettle, clickFirst('[role="dialog"] [aria-label="关闭"]')),
    settle: closed,
  },
  {
    name: 'locked ignores Escape and scrim clicks',
    vue: () => h(VSheet, { ...base, locked: true }, vueSlots),
    react: () => (
      <Sheet {...base} {...reactSlots} locked>
        {reactTrigger}
      </Sheet>
    ),
    interact: sequence(openAndSettle, pressEscape, clickScrim, () => wait(300)),
    settle: opened,
  },
])
