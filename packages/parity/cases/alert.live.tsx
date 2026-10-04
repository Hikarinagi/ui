import { defineComponent, h, ref } from 'vue'
import { userEvent } from 'vitest/browser'
import { vi } from 'vitest'
import { useState } from 'react'
import VAlert from '@hina-ui/vue/components/alert/Alert.vue'
import VButton from '@hina-ui/vue/components/button/Button.vue'
import { Alert } from '@hina-ui/react/components/alert/Alert'
import { Button } from '@hina-ui/react/components/button/Button'
import { defineLiveCases, frames } from '../src/live'

async function idle() {
  await vi.waitFor(
    () => {
      const running = document.getAnimations().filter(a => a.playState === 'running')
      if (running.length || document.querySelector('[data-pressed]')) throw new Error('busy')
    },
    { timeout: 3000 },
  )
  await frames(4)
}

async function removed() {
  await vi.waitFor(() => {
    if (document.querySelector('[data-hn-alert]')) throw new Error('still mounted')
  })
  await idle()
}

const stack = { display: 'flex', flexDirection: 'column', rowGap: '12px', width: '480px' } as const

const VueClosable = defineComponent(() => {
  const open = ref(true)
  return () =>
    h('div', { style: stack }, [
      h(
        VAlert,
        {
          tone: 'success',
          title: '已发布',
          closable: true,
          open: open.value,
          'onUpdate:open': (value: boolean) => (open.value = value),
        },
        () => '文章现在对所有人可见。',
      ),
      h(
        VButton,
        {
          variant: 'soft',
          tone: 'neutral',
          disabled: open.value,
          onClick: () => (open.value = true),
        },
        () => '再次显示',
      ),
    ])
})

function ReactClosable() {
  const [open, setOpen] = useState(true)
  return (
    <div style={stack}>
      <Alert tone="success" title="已发布" closable open={open} onOpenChange={setOpen}>
        文章现在对所有人可见。
      </Alert>
      <Button variant="soft" tone="neutral" disabled={open} onClick={() => setOpen(true)}>
        再次显示
      </Button>
    </div>
  )
}

const closeButton = (container: HTMLElement) =>
  container.querySelector<HTMLElement>('[data-hn-alert] button')!
const showButton = (container: HTMLElement) =>
  container.querySelector<HTMLElement>(':scope > div > button')!

export default defineLiveCases('Alert', [
  {
    name: 'mounted open alert',
    vue: () => h(VueClosable),
    react: () => <ReactClosable />,
    settle: idle,
  },
  {
    name: 'close button collapses and removes the alert',
    vue: () => h(VueClosable),
    react: () => <ReactClosable />,
    interact: async container => {
      await userEvent.click(closeButton(container))
    },
    settle: removed,
  },
  {
    name: 'keyboard Enter on the close button closes',
    vue: () => h(VueClosable),
    react: () => <ReactClosable />,
    interact: async container => {
      closeButton(container).focus()
      await userEvent.keyboard('{Enter}')
    },
    settle: removed,
  },
  {
    name: 'reopening after close expands again',
    vue: () => h(VueClosable),
    react: () => <ReactClosable />,
    interact: async container => {
      await userEvent.click(closeButton(container))
      await removed()
      await userEvent.click(showButton(container))
    },
    settle: async () => {
      await vi.waitFor(() => {
        if (!document.querySelector('[data-hn-alert]')) throw new Error('not reopened')
      })
      await idle()
    },
  },
  {
    name: 'uncontrolled closable danger alert with actions closes',
    vue: () =>
      h(
        VAlert,
        { tone: 'danger', title: '发布失败', closable: true },
        {
          default: () => '服务器暂时无法响应，草稿已保留。',
          actions: () => h(VButton, { size: 'sm', variant: 'soft', tone: 'danger' }, () => '重试'),
        },
      ),
    react: () => (
      <Alert
        tone="danger"
        title="发布失败"
        closable
        actions={
          <Button size="sm" variant="soft" tone="danger">
            重试
          </Button>
        }
      >
        服务器暂时无法响应，草稿已保留。
      </Alert>
    ),
    interact: async container => {
      await userEvent.click(container.querySelector<HTMLElement>('button[aria-label]')!)
    },
    settle: removed,
  },
])
