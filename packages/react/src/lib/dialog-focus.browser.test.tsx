import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { useLayoutEffect, useRef, useState, type RefObject } from 'react'
import { AlertDialog } from '../components/alert-dialog/AlertDialog'
import { Dialog } from '../components/dialog/Dialog'
import { Button } from '../components/button/Button'
import { ScrollArea, type ScrollAreaHandle } from '../components/scroll-area/ScrollArea'
import { mount } from '../../test/mount'
import { signal, type Signal } from '../../test/signal'
import '../../test/browser.css'

let wrapper: { unmount: () => Promise<void> } | undefined
let finishLeave: (() => void) | undefined

beforeEach(async () => {
  await page.viewport(1000, 720)
  finishLeave = undefined
})

afterEach(async () => {
  finishLeave?.()
  await wrapper?.unmount()
  wrapper = undefined
  await vi.waitFor(() => expect(document.body.style.overflow).toBe(''))
  document.body.innerHTML = ''
})

const cases = (['alert', 'dialog'] as const).flatMap(kind =>
  (['native', 'scroll-area'] as const).map(container => ({ kind, container })),
)

interface Size {
  width: number
  height: number
}

function LeavingList({ rows, onOpen }: { rows: Signal<number[]>; onOpen: () => void }) {
  const ids = rows.use()
  const [previous, setPrevious] = useState(ids)
  const [leaving, setLeaving] = useState<Map<number, Size | undefined>>(new Map())
  const elements = useRef(new Map<number, HTMLElement>())

  if (previous !== ids) {
    const removed = previous.filter(id => !ids.includes(id))
    setPrevious(ids)
    if (removed.length) {
      const next = new Map(leaving)
      for (const id of removed) next.set(id, undefined)
      setLeaving(next)
    }
  }

  useLayoutEffect(() => {
    const pending = [...leaving].filter(([, size]) => !size).map(([id]) => id)
    if (!pending.length) return
    const next = new Map(leaving)
    for (const id of pending) {
      const item = elements.current.get(id)!
      next.set(id, { width: item.offsetWidth, height: item.offsetHeight })
    }
    setLeaving(next)
    finishLeave = () =>
      setLeaving(map => {
        const rest = new Map(map)
        for (const id of pending) rest.delete(id)
        return rest
      })
  }, [leaving])

  const rendered = Array.from({ length: 100 }, (_, id) => id).filter(
    id => ids.includes(id) || leaving.has(id),
  )

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', position: 'relative' }}>
      {rendered.map(id => {
        const size = leaving.get(id)
        return (
          <div
            key={id}
            data-item={id}
            ref={element => {
              if (element) elements.current.set(id, element)
              else elements.current.delete(id)
            }}
            style={{
              height: size ? `${size.height}px` : '48px',
              display: 'flex',
              alignItems: 'center',
              ...(size ? { width: `${size.width}px`, position: 'absolute' } : {}),
            }}
          >
            <Button onClick={onOpen}>{'删除 ' + id}</Button>
          </div>
        )
      })}
    </div>
  )
}

it.each(cases)(
  '$kind / $container 删除项仍在离场时归还焦点不改变滚动位置',
  async ({ kind, container }) => {
    const open = signal(false)
    const rows = signal(Array.from({ length: 100 }, (_, id) => id))
    const area: RefObject<ScrollAreaHandle | null> = { current: null }
    const remove = () => {
      rows.value = rows.value.filter(id => id !== 70)
    }
    function Harness() {
      const value = open.use()
      const list = <LeavingList rows={rows} onOpen={() => (open.value = true)} />
      return (
        <div style={{ width: '440px' }}>
          {container === 'scroll-area' ? (
            <ScrollArea ref={area} className="h-80">
              {list}
            </ScrollArea>
          ) : (
            <div data-viewport="" style={{ height: '320px', overflow: 'auto' }}>
              {list}
            </div>
          )}
          {kind === 'alert' ? (
            <AlertDialog
              open={value}
              onOpenChange={next => (open.value = !!next)}
              title="删除条目"
              description="确认删除"
              confirmText="确认删除"
              onConfirm={remove}
            />
          ) : (
            <Dialog
              open={value}
              onOpenChange={next => (open.value = !!next)}
              title="删除条目"
              renderFooter={() => (
                <Button
                  onClick={() => {
                    remove()
                    open.value = false
                  }}
                >
                  确认删除
                </Button>
              )}
            />
          )}
        </div>
      )
    }
    wrapper = await mount(<Harness />)
    let viewport: HTMLElement
    await vi.waitFor(
      () => {
        viewport =
          container === 'scroll-area'
            ? area.current!.viewport!
            : document.querySelector<HTMLElement>('[data-viewport]')!
        expect(viewport?.scrollHeight).toBeGreaterThan(2000)
      },
      { timeout: 5000 },
    )
    viewport!.scrollTop = 1550
    const trigger = document.querySelector<HTMLElement>('[data-item="70"] button')!
    await userEvent.click(trigger)
    const role = kind === 'alert' ? 'alertdialog' : 'dialog'
    await vi.waitFor(() => expect(document.querySelector('[role="' + role + '"]')).not.toBeNull())
    const before = viewport!.scrollTop
    const panel = document.querySelector('[role="' + role + '"]')!
    await userEvent.click(
      Array.from(panel.querySelectorAll('button')).find(
        button => button.textContent?.trim() === '确认删除',
      )!,
    )
    await vi.waitFor(() => expect(rows.value).not.toContain(70))
    expect(trigger.isConnected).toBe(true)
    expect(getComputedStyle(trigger.parentElement!).position).toBe('absolute')
    expect(
      trigger.getBoundingClientRect().top -
        viewport!.getBoundingClientRect().top +
        viewport!.scrollTop,
    ).toBeLessThan(48)
    await vi.waitFor(() => expect(document.querySelector('[role="' + role + '"]')).toBeNull())
    expect(document.activeElement).toBe(trigger)
    expect(viewport!.scrollTop).toBe(before)
    finishLeave!()
    await vi.waitFor(() => expect(trigger.isConnected).toBe(false))
    expect(viewport!.scrollTop).toBe(before)
  },
)

it.each(['alert', 'dialog'] as const)('%s 程序打开后仍归还到插槽触发器', async kind => {
  const open = signal(false)
  function Harness() {
    const value = open.use()
    return kind === 'alert' ? (
      <AlertDialog
        open={value}
        onOpenChange={next => (open.value = !!next)}
        title="确认"
        description="确认操作"
      >
        <Button data-trigger="">打开</Button>
      </AlertDialog>
    ) : (
      <Dialog open={value} onOpenChange={next => (open.value = !!next)} title="对话框">
        <Button data-trigger="">打开</Button>
      </Dialog>
    )
  }
  wrapper = await mount(<Harness />)
  expect(document.activeElement).toBe(document.body)
  open.value = true
  const role = kind === 'alert' ? 'alertdialog' : 'dialog'
  await vi.waitFor(() => expect(document.querySelector('[role="' + role + '"]')).not.toBeNull())
  await userEvent.keyboard('{Escape}')
  await vi.waitFor(() => expect(document.querySelector('[role="' + role + '"]')).toBeNull())
  expect(document.activeElement).toBe(document.querySelector('[data-trigger]'))
})
