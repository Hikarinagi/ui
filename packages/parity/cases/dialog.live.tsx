import { h, type VNode } from 'vue'
import { userEvent } from 'vitest/browser'
import { vi } from 'vitest'
import VDialog from '@hina-ui/vue/components/dialog/Dialog.vue'
import VButton from '@hina-ui/vue/components/button/Button.vue'
import { Dialog } from '@hina-ui/react/components/dialog/Dialog'
import { Button } from '@hina-ui/react/components/button/Button'
import { defineLiveCases, frames } from '../src/live'

function describeFocus() {
  const active = document.activeElement
  if (!active || active === document.body) return 'body'
  const label = active.getAttribute('aria-label') ?? active.textContent?.trim() ?? ''
  return `${active.tagName.toLowerCase()} ${active.getAttribute('role') ?? ''} ${label}`
}

export async function finished() {
  await Promise.allSettled(
    document
      .getAnimations()
      .filter(
        animation =>
          animation.timeline === document.timeline &&
          animation.effect?.getTiming().iterations !== Infinity,
      )
      .map(animation => animation.finished),
  )
}

async function stamp() {
  await frames(3)
  const marker = document.createElement('div')
  marker.setAttribute('data-parity-focus', describeFocus())
  document.body.appendChild(marker)
}

export function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function settleOpen(selector = '[role="dialog"]', count = 1) {
  return async () => {
    await vi.waitFor(() => {
      if (document.querySelectorAll(selector).length !== count) throw new Error('not open')
    })
    await finished()
    await frames(6)
    await finished()
    await stamp()
  }
}

export function settleClosed(selector = '[role="dialog"],[role="alertdialog"]') {
  return async () => {
    await vi.waitFor(() => {
      if (document.querySelector(selector)) throw new Error('still open')
    })
    await finished()
    await stamp()
  }
}

export async function clickTrigger(container: HTMLElement) {
  await userEvent.hover(container, { force: true, position: { x: 0, y: 0 } })
  container.querySelector('button')!.focus()
  await userEvent.keyboard('{Enter}')
}

export function clickFirst(selector: string) {
  return async () => {
    await userEvent.click(document.querySelector<HTMLElement>(selector)!)
  }
}

export function clickText(scope: string, text: string) {
  return async () => {
    const buttons = [...document.querySelectorAll<HTMLElement>(`${scope} button`)]
    await userEvent.click(buttons.find(button => button.textContent?.trim() === text)!)
  }
}

export async function clickScrim() {
  await userEvent.click(document.querySelector<HTMLElement>('.hn-scrim')!, {
    force: true,
    position: { x: 4, y: 4 },
  })
}

export async function pressEscape() {
  await userEvent.keyboard('{Escape}')
}

export function unstamp() {
  document.querySelector('[data-parity-focus]')?.remove()
}

export function sequence(...steps: Array<(container: HTMLElement) => Promise<unknown> | unknown>) {
  return async (container: HTMLElement) => {
    for (const step of steps) await step(container)
  }
}

const opened = settleOpen()
const closed = settleClosed()
const openAndSettle = sequence(clickTrigger, opened, unstamp)

const vueTrigger = () => h(VButton, { variant: 'outline', tone: 'neutral' }, () => '打开')
const reactTrigger = (
  <Button variant="outline" tone="neutral">
    打开
  </Button>
)

const base = { title: '删除条目', description: '此操作不可撤销。' }
const vueContent = () => h('p', '正文内容')
const vueFooter = ({ close }: { close: () => void }) => [
  h(VButton, { variant: 'soft', tone: 'neutral', onClick: close }, () => '取消'),
  h(VButton, { tone: 'danger' }, () => '确认删除'),
]
const reactContent = () => <p>正文内容</p>
const reactFooter = ({ close }: { close: () => void }) => (
  <>
    <Button variant="soft" tone="neutral" onClick={close}>
      取消
    </Button>
    <Button tone="danger">确认删除</Button>
  </>
)

function vueDialog(props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) {
  return () =>
    h(
      VDialog,
      { ...base, ...props },
      { default: vueTrigger, content: vueContent, footer: vueFooter, ...slots },
    ) as VNode
}

const nestedVue = () =>
  h(
    VDialog,
    { title: '外层对话框' },
    {
      default: vueTrigger,
      content: () =>
        h(
          VDialog,
          { title: '内层对话框' },
          {
            default: () => h(VButton, { variant: 'soft', tone: 'neutral' }, () => '开B'),
            content: () => h('p', '内层正文'),
          },
        ),
    },
  )

const nestedReact = () => (
  <Dialog
    title="外层对话框"
    renderContent={() => (
      <Dialog title="内层对话框" renderContent={() => <p>内层正文</p>}>
        <Button variant="soft" tone="neutral">
          开B
        </Button>
      </Dialog>
    )}
  >
    {reactTrigger}
  </Dialog>
)

export default defineLiveCases('Dialog', [
  {
    name: 'opens from the trigger with title, description, content and footer',
    vue: vueDialog(),
    react: () => (
      <Dialog {...base} renderContent={reactContent} renderFooter={reactFooter}>
        {reactTrigger}
      </Dialog>
    ),
    interact: clickTrigger,
    settle: opened,
  },
  {
    name: 'controlled open without a trigger',
    vue: () =>
      h(
        VDialog,
        { title: '没有触发器', description: '由外部状态控制。', open: true },
        { content: () => h('p', '正文') },
      ),
    react: () => (
      <Dialog
        title="没有触发器"
        description="由外部状态控制。"
        open
        renderContent={() => <p>正文</p>}
      />
    ),
    settle: opened,
  },
  ...(['sm', 'md', 'lg', 'xl', '2xl'] as const).map(size => ({
    name: `size ${size}`,
    vue: vueDialog({ size }),
    react: () => (
      <Dialog {...base} size={size} renderContent={reactContent} renderFooter={reactFooter}>
        {reactTrigger}
      </Dialog>
    ),
    interact: clickTrigger,
    settle: opened,
  })),
  ...(['center', 'top', 'bottom'] as const).map(placement => ({
    name: `placement ${placement}`,
    vue: vueDialog({ placement }),
    react: () => (
      <Dialog
        {...base}
        placement={placement}
        renderContent={reactContent}
        renderFooter={reactFooter}
      >
        {reactTrigger}
      </Dialog>
    ),
    interact: clickTrigger,
    settle: opened,
  })),
  {
    name: 'class overrides the size preset',
    vue: vueDialog({ size: '2xl', class: 'max-w-[40rem]' }),
    react: () => (
      <Dialog
        {...base}
        size="2xl"
        className="max-w-[40rem]"
        renderContent={reactContent}
        renderFooter={reactFooter}
      >
        {reactTrigger}
      </Dialog>
    ),
    interact: clickTrigger,
    settle: opened,
  },
  {
    name: 'header hidden keeps a visually hidden title and description',
    vue: vueDialog({ header: false }),
    react: () => (
      <Dialog {...base} header={false} renderContent={reactContent} renderFooter={reactFooter}>
        {reactTrigger}
      </Dialog>
    ),
    interact: clickTrigger,
    settle: opened,
  },
  {
    name: 'not closable without a description',
    vue: vueDialog({ closable: false, description: undefined }),
    react: () => (
      <Dialog
        title={base.title}
        closable={false}
        renderContent={reactContent}
        renderFooter={reactFooter}
      >
        {reactTrigger}
      </Dialog>
    ),
    interact: clickTrigger,
    settle: opened,
  },
  {
    name: 'locked disables the close button',
    vue: vueDialog({ locked: true }),
    react: () => (
      <Dialog {...base} locked renderContent={reactContent} renderFooter={reactFooter}>
        {reactTrigger}
      </Dialog>
    ),
    interact: clickTrigger,
    settle: opened,
  },
  {
    name: 'icon and title slots',
    vue: vueDialog(
      {},
      {
        icon: () => h('svg', { 'data-icon': '', viewBox: '0 0 24 24' }),
        title: () => h('span', '自定义标题'),
      },
    ),
    react: () => (
      <Dialog
        {...base}
        icon={<svg data-icon="" viewBox="0 0 24 24" />}
        title={<span>自定义标题</span>}
        renderContent={reactContent}
        renderFooter={reactFooter}
      >
        {reactTrigger}
      </Dialog>
    ),
    interact: clickTrigger,
    settle: opened,
  },
  {
    name: 'content without footer and footer without content',
    vue: () =>
      h('div', [
        h(VDialog, { ...base, open: true }, { content: vueContent }),
        h(VDialog, { title: '仅页脚', open: true }, { footer: vueFooter }),
      ]),
    react: () => (
      <div>
        <Dialog {...base} open renderContent={reactContent} />
        <Dialog title="仅页脚" open renderFooter={reactFooter} />
      </div>
    ),
    settle: settleOpen('[role="dialog"]', 2),
  },
  {
    name: 'custom body replaces the layout',
    vue: vueDialog(
      { placement: 'top', class: 'max-w-[600px]' },
      {
        body: ({ close }: { close: () => void }) =>
          h('section', { 'data-body': '' }, [
            h('button', { 'data-first': '' }, '首个按钮'),
            h('button', { onClick: close }, '关闭正文'),
          ]),
      },
    ),
    react: () => (
      <Dialog
        {...base}
        placement="top"
        className="max-w-[600px]"
        renderContent={reactContent}
        renderFooter={reactFooter}
        renderBody={({ close }) => (
          <section data-body="">
            <button data-first="">首个按钮</button>
            <button onClick={close}>关闭正文</button>
          </section>
        )}
      >
        {reactTrigger}
      </Dialog>
    ),
    interact: clickTrigger,
    settle: opened,
  },
  {
    name: 'empty body',
    vue: vueDialog({}, { body: () => [] }),
    react: () => (
      <Dialog
        {...base}
        renderContent={reactContent}
        renderFooter={reactFooter}
        renderBody={() => null}
      >
        {reactTrigger}
      </Dialog>
    ),
    interact: clickTrigger,
    settle: opened,
  },
  {
    name: 'body slot close returns focus to the trigger',
    vue: vueDialog(
      {},
      { body: ({ close }: { close: () => void }) => h('button', { onClick: close }, '关闭正文') },
    ),
    react: () => (
      <Dialog {...base} renderBody={({ close }) => <button onClick={close}>关闭正文</button>}>
        {reactTrigger}
      </Dialog>
    ),
    interact: sequence(openAndSettle, clickText('[role="dialog"]', '关闭正文')),
    settle: closed,
  },
  {
    name: 'Escape closes and returns focus to the trigger',
    vue: vueDialog(),
    react: () => (
      <Dialog {...base} renderContent={reactContent} renderFooter={reactFooter}>
        {reactTrigger}
      </Dialog>
    ),
    interact: sequence(openAndSettle, pressEscape),
    settle: closed,
  },
  {
    name: 'scrim click closes',
    vue: vueDialog(),
    react: () => (
      <Dialog {...base} renderContent={reactContent} renderFooter={reactFooter}>
        {reactTrigger}
      </Dialog>
    ),
    interact: sequence(openAndSettle, clickScrim),
    settle: closed,
  },
  {
    name: 'close button closes',
    vue: vueDialog(),
    react: () => (
      <Dialog {...base} renderContent={reactContent} renderFooter={reactFooter}>
        {reactTrigger}
      </Dialog>
    ),
    interact: sequence(openAndSettle, clickFirst('[role="dialog"] [aria-label="关闭"]')),
    settle: closed,
  },
  {
    name: 'footer close from the slot props',
    vue: vueDialog(),
    react: () => (
      <Dialog {...base} renderContent={reactContent} renderFooter={reactFooter}>
        {reactTrigger}
      </Dialog>
    ),
    interact: sequence(openAndSettle, clickText('[role="dialog"]', '取消')),
    settle: closed,
  },
  {
    name: 'locked ignores Escape and scrim clicks',
    vue: vueDialog({ locked: true }),
    react: () => (
      <Dialog {...base} locked renderContent={reactContent} renderFooter={reactFooter}>
        {reactTrigger}
      </Dialog>
    ),
    interact: sequence(openAndSettle, pressEscape, clickScrim, () => wait(300)),
    settle: opened,
  },
  {
    name: 'closable=false still closes with Escape',
    vue: vueDialog({ closable: false }),
    react: () => (
      <Dialog {...base} closable={false} renderContent={reactContent} renderFooter={reactFooter}>
        {reactTrigger}
      </Dialog>
    ),
    interact: sequence(openAndSettle, pressEscape),
    settle: closed,
  },
  {
    name: 'nested dialogs stack in open order',
    vue: nestedVue,
    react: nestedReact,
    interact: sequence(openAndSettle, clickText('[role="dialog"]', '开B')),
    settle: settleOpen('[role="dialog"]', 2),
  },
  {
    name: 'nested inner Escape returns to the outer dialog',
    vue: nestedVue,
    react: nestedReact,
    interact: sequence(
      openAndSettle,
      clickText('[role="dialog"]', '开B'),
      settleOpen('[role="dialog"]', 2),
      unstamp,
      pressEscape,
      () =>
        vi.waitFor(() => {
          if (document.querySelectorAll('[role="dialog"]').length !== 1) throw new Error('open')
        }),
    ),
    settle: opened,
  },
  {
    name: 'scroll lock on a scrollable page',
    vue: () =>
      h('div', { style: 'height: 3000px' }, [
        h(VDialog, base, { default: vueTrigger, content: vueContent }),
      ]),
    react: () => (
      <div style={{ height: '3000px' }}>
        <Dialog {...base} renderContent={reactContent}>
          {reactTrigger}
        </Dialog>
      </div>
    ),
    interact: clickTrigger,
    settle: opened,
  },
])
