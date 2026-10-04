import { defineComponent, h, type PropType } from 'vue'
import { userEvent } from 'vitest/browser'
import { vi } from 'vitest'
import { useState } from 'react'
import VToaster from '@hina-ui/vue/components/toast/Toaster.vue'
import * as vueStore from '@hina-ui/vue/components/toast/store'
import { Toaster } from '@hina-ui/react/components/toast/Toaster'
import * as reactStore from '@hina-ui/react/components/toast/store'
import { DURATION } from '@hina-ui/react/motion'
import { defineLiveCases, frames, type LiveCase } from '../src/live'

type Position = vueStore.ToasterPosition
type Api = typeof reactStore.toast

const VueFresh = defineComponent({
  props: { position: String as PropType<Position>, label: String },
  setup(props) {
    vueStore.toastState.items.splice(0)
    for (const reason of ['hover', 'focus', 'hidden']) vueStore.resumeTimers(reason)
    return () => h(VToaster, { position: props.position, label: props.label })
  },
})

function ReactFresh({ position, label }: { position?: Position; label?: string }) {
  useState(() => {
    reactStore.toastState.items.splice(0)
    for (const reason of ['hover', 'focus', 'hidden']) reactStore.resumeTimers(reason)
    return true
  })
  return <Toaster position={position} label={label} />
}

function api(container: HTMLElement): Api {
  return (container.hasAttribute('data-v-app') ? vueStore.toast : reactStore.toast) as Api
}

async function park() {
  const element = document.createElement('div')
  element.style.cssText = 'position: fixed; top: 0; left: 0; width: 8px; height: 8px'
  document.body.appendChild(element)
  await userEvent.hover(element)
  element.remove()
}

async function idle() {
  await vi.waitFor(
    () => {
      const running = document
        .getAnimations()
        .filter(a => a.playState === 'running' && a.effect?.getTiming().iterations !== Infinity)
      if (running.length || document.querySelector('[data-pressed]')) throw new Error('busy')
    },
    { timeout: 4000 },
  )
  await frames(6)
}

const items = () => [...document.querySelectorAll<HTMLElement>('ol li')]

function count(expected: number) {
  return async () => {
    await vi.waitFor(
      () => {
        if (items().length !== expected) throw new Error(`expected ${expected} toasts`)
      },
      { timeout: 4000 },
    )
    await idle()
  }
}

async function shown(expected: number) {
  await vi.waitFor(() => {
    if (items().length !== expected) throw new Error(`expected ${expected} toasts`)
  })
}

function live(
  name: string,
  show: (toast: Api, container: HTMLElement) => Promise<void> | void,
  extra: Partial<LiveCase> & { position?: Position; label?: string; expect?: number } = {},
): LiveCase {
  const { position, label, expect: expected = 1, ...rest } = extra
  return {
    name,
    vue: () => h(VueFresh, { position, label }),
    react: () => <ReactFresh position={position} label={label} />,
    interact: async container => {
      await park()
      await show(api(container), container)
    },
    settle: count(expected),
    ...rest,
  }
}

const positions: Position[] = [
  'top-start',
  'top-center',
  'top-end',
  'bottom-start',
  'bottom-center',
  'bottom-end',
]

const settleDelay = (DURATION.exit + 0.06) * 1000

const VueChapter = defineComponent({
  props: { toastId: { type: [String, Number], required: true }, title: String },
  setup: props => () =>
    h('div', { class: 'custom-probe flex gap-2' }, [
      h('strong', props.title),
      h('span', `来自 #${props.toastId}`),
    ]),
})

function ReactChapter({ toastId, title }: { toastId: string | number; title?: string }) {
  return (
    <div className="custom-probe flex gap-2">
      <strong>{title}</strong>
      <span>{`来自 #${toastId}`}</span>
    </div>
  )
}

export default defineLiveCases('Toast', [
  {
    name: 'empty toaster renders an inert region',
    vue: () => h(VueFresh),
    react: () => <ReactFresh />,
    settle: idle,
  },
  live('neutral toast', toast => {
    toast('草稿已保存', { duration: 0 })
  }),
  ...(['success', 'danger', 'warning', 'info', 'loading'] as const).map(tone =>
    live(`${tone} toast`, toast => {
      toast[tone](`${tone} 消息`, { duration: 0 })
    }),
  ),
  live('toast with a description', toast => {
    toast.success('导入完成', {
      duration: 0,
      description: '共导入 128 本书，其中 3 本因格式不符被跳过。',
    })
  }),
  live('action and cancel buttons', toast => {
    toast.warning('确定要清空吗', {
      duration: 0,
      action: { label: '清空' },
      cancel: { label: '取消' },
    })
  }),
  live(
    'custom label for the region',
    toast => {
      toast('标签', { duration: 0 })
    },
    { label: 'Alerts' },
  ),
  ...positions.map(position =>
    live(
      `position ${position}`,
      toast => {
        toast.info(`位于 ${position}`, { duration: 0 })
      },
      { position },
    ),
  ),
  live(
    'stacked toasts collapse behind the front card',
    toast => {
      toast('一', { duration: 0 })
      toast('二', { duration: 0 })
      toast.success('三', { duration: 0 })
      toast.danger('四', { duration: 0, description: '殿后的这张更高,矮背卡必须跟着长到同高。' })
    },
    { expect: 4 },
  ),
  live(
    'more than five toasts drop the oldest',
    async toast => {
      for (const word of ['一', '二', '三', '四', '五', '六']) toast(word, { duration: 0 })
    },
    {
      settle: async () => {
        await vi.waitFor(
          () => {
            if (items().length !== 5) throw new Error('expected the oldest to settle out')
          },
          { timeout: 4000 },
        )
        await idle()
      },
    },
  ),
  live(
    'hover expands the stack',
    async toast => {
      toast('一', { duration: 0 })
      toast('二', { duration: 0 })
      toast('三', { duration: 0, description: '展开后逐张排开。' })
      await shown(3)
      await idle()
      await userEvent.hover(items().at(-1)!)
    },
    { expect: 3 },
  ),
  live('loading resolves through a promise', async toast => {
    let resolve!: (value: string) => void
    void toast.promise(new Promise<string>(done => (resolve = done)), {
      loading: '正在上传',
      success: name => `${name} 上传完成`,
      error: '上传失败，请重试',
    })
    await shown(1)
    await idle()
    resolve('ATRI.epub')
    await vi.waitFor(() => {
      if (!items()[0]!.textContent?.includes('上传完成')) throw new Error('not resolved')
    })
  }),
  live('loading rejects through a promise', async toast => {
    let reject!: (reason: unknown) => void
    toast
      .promise(new Promise<string>((_done, fail) => (reject = fail)), {
        loading: '正在上传',
        success: '好了',
        error: { message: '上传失败', description: '文件超过 20 MB。' },
      })
      .catch(() => {})
    await shown(1)
    await idle()
    reject(new Error('boom'))
    await vi.waitFor(() => {
      if (!items()[0]!.textContent?.includes('上传失败')) throw new Error('not rejected')
    })
  }),
  live('same id updates in place', async toast => {
    toast.loading('正在同步', { id: 'sync' })
    await shown(1)
    await idle()
    toast.loading('已同步 12 / 30', { id: 'sync' })
    await idle()
    toast.success('同步完成', { id: 'sync', duration: 0 })
  }),
  live('custom component toast', (toast, container) => {
    const component = container.hasAttribute('data-v-app') ? VueChapter : ReactChapter
    toast.custom(component as never, { duration: 0, props: { title: 'ATRI' } })
  }),
  live(
    'close button dismisses and settles out',
    async toast => {
      toast('挥之即去', { duration: 0 })
      await shown(1)
      await idle()
      await userEvent.hover(items()[0]!)
      await userEvent.click(items()[0]!.querySelector<HTMLElement>('[aria-label="关闭"]')!)
    },
    { expect: 0 },
  ),
  live(
    'action runs and dismisses',
    async toast => {
      toast('已移入回收站', { duration: 0, action: { label: '撤销' } })
      await shown(1)
      await idle()
      await userEvent.click(
        [...items()[0]!.querySelectorAll<HTMLElement>('button')].find(
          button => button.textContent === '撤销',
        )!,
      )
    },
    { expect: 0 },
  ),
  live(
    'removed toast mid exit keeps its slot',
    async toast => {
      toast('一', { duration: 0 })
      toast('二', { id: 'second', duration: 0 })
      await shown(2)
      await idle()
      toast.dismiss('second')
    },
    {
      expect: 2,
      settle: async () => {
        await vi.waitFor(() => {
          if (!document.querySelector('[data-hn-removed]')) throw new Error('not removed')
        })
        await idle()
      },
    },
  ),
  live(
    'auto close after its duration',
    async toast => {
      toast('转瞬即逝', { duration: 200 })
      await shown(1)
    },
    {
      settle: async () => {
        await vi.waitFor(
          () => {
            if (items().length) throw new Error('still shown')
          },
          { timeout: 4000 },
        )
        await new Promise(resolve => setTimeout(resolve, settleDelay))
        await idle()
      },
    },
  ),
  live(
    'Escape dismisses every toast',
    async toast => {
      toast('一', { duration: 0 })
      toast.info('二', { duration: 0 })
      await shown(2)
      await idle()
      await userEvent.keyboard('{Escape}')
    },
    { expect: 0 },
  ),
  live(
    'F8 focuses the viewport and expands the stack',
    async toast => {
      toast('一', { duration: 0 })
      toast('二', { duration: 0 })
      await shown(2)
      await idle()
      await userEvent.keyboard('{F8}')
    },
    { expect: 2 },
  ),
  live(
    'swipe beyond the threshold dismisses',
    async toast => {
      toast('划走我', { duration: 0 })
      await shown(1)
      await idle()
      swipe(items()[0]!, [4, 30, 80], true)
    },
    { expect: 0 },
  ),
  live(
    'short swipe cancels',
    async toast => {
      toast('别走', { duration: 0 })
      await shown(1)
      await idle()
      swipe(items()[0]!, [4, 20], true)
    },
    { expect: 1 },
  ),
  live(
    'swipe in progress follows the pointer',
    async toast => {
      toast('跟手', { duration: 0 })
      await shown(1)
      await idle()
      swipe(items()[0]!, [4, 36], false)
    },
    { expect: 1 },
  ),
])

function swipe(target: HTMLElement, steps: number[], release: boolean) {
  const rect = target.getBoundingClientRect()
  const x = rect.left + rect.width / 2
  const y = rect.top + rect.height / 2
  const init = {
    bubbles: true,
    cancelable: true,
    pointerId: 1,
    pointerType: 'mouse',
    isPrimary: true,
  }
  target.dispatchEvent(
    new PointerEvent('pointerdown', { ...init, button: 0, clientX: x, clientY: y }),
  )
  for (const step of steps)
    target.dispatchEvent(
      new PointerEvent('pointermove', { ...init, button: -1, clientX: x + step, clientY: y }),
    )
  if (release)
    target.dispatchEvent(
      new PointerEvent('pointerup', { ...init, button: 0, clientX: x + steps.at(-1)!, clientY: y }),
    )
}
