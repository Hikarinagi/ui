import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { createRef, type ComponentType, type ReactNode } from 'react'
import { Form, type FormHandle } from './Form'
import { useFormHandle } from './hooks/useFormHandle'
import { Button } from '../button/Button'
import { Dialog } from '../dialog/Dialog'
import { Drawer } from '../drawer/Drawer'
import { Sheet } from '../sheet/Sheet'
import type { FormErrors, FormValues } from './standard-schema'
import { mount } from '../../../test/mount'
import { signal } from '../../../test/signal'
import '../../../test/browser.css'

const mounted: Array<{ unmount: () => Promise<void> }> = []
afterEach(async () => {
  for (const w of mounted.splice(0)) await w.unmount()
  document.body.innerHTML = ''
})

function deferred() {
  let resolve!: () => void
  const promise = new Promise<void>(done => (resolve = done))
  return { promise, resolve }
}

const pause = (ms = 60) => new Promise(done => setTimeout(done, ms))
const button = (name: string) => document.querySelector(`[data-${name}]`) as HTMLButtonElement

function userLocked() {
  const close = document.querySelector<HTMLButtonElement>(
    '[role="dialog"] button[aria-label="关闭"]',
  )
  if (close) return close.disabled
  return document
    .querySelector('[data-hn-sheet-grip] > [aria-hidden]')!
    .hasAttribute('data-disabled')
}

describe('useFormHandle', () => {
  it('返回的句柄可以读到 submitting、submitted、invalid 与 errors,并随提交过程变化', async () => {
    const gate = deferred()
    const name = signal('')
    const rules = (current: FormValues): FormErrors => (current.name ? {} : { name: '请输入名称' })
    function Harness() {
      const form = useFormHandle()
      return (
        <>
          <Form
            form={form}
            values={{ name: name.use() }}
            rules={rules}
            onSubmit={() => gate.promise}
          />
          <Button data-save="" loading={form.submitting} onClick={form.submit}>
            保存
          </Button>
          <output>
            {JSON.stringify({
              submitting: form.submitting,
              submitted: form.submitted,
              invalid: form.invalid,
              errors: form.errors,
            })}
          </output>
        </>
      )
    }
    const w = await mount(<Harness />)
    mounted.push(w)
    const state = () => JSON.parse(document.querySelector('output')!.textContent!)
    expect(state()).toEqual({ submitting: false, submitted: false, invalid: false, errors: {} })

    await userEvent.click(button('save'))
    await vi.waitFor(() => expect(state().submitted).toBe(true))
    expect(state()).toMatchObject({
      submitting: false,
      invalid: true,
      errors: { name: '请输入名称' },
    })

    name.value = '罗伦斯'
    await userEvent.click(button('save'))
    await vi.waitFor(() => expect(state().submitting).toBe(true))
    expect(state()).toMatchObject({ invalid: false, errors: {} })
    expect(button('save').disabled).toBe(true)

    gate.resolve()
    await vi.waitFor(() => expect(state().submitting).toBe(false))
    expect(button('save').disabled).toBe(false)
  })

  it('ref 句柄上可以读到调用时刻的状态', async () => {
    const gate = deferred()
    const handle = createRef<FormHandle>()
    const w = await mount(
      <Form ref={handle} values={{ name: 'a' }} onSubmit={() => gate.promise} />,
    )
    mounted.push(w)
    expect(handle.current).toMatchObject({ submitting: false, submitted: false, invalid: false })
    const pending = handle.current!.submit()
    await vi.waitFor(() => expect(handle.current!.submitting).toBe(true))
    gate.resolve()
    await pending
    expect(handle.current).toMatchObject({ submitting: false, submitted: true, errors: {} })
  })

  it('未绑定到 Form 时方法不抛错,表单卸载后状态归零', async () => {
    const shown = signal(true)
    const gate = deferred()
    let handle!: ReturnType<typeof useFormHandle>
    function Harness() {
      handle = useFormHandle()
      return shown.use() ? (
        <Form form={handle} values={{ name: 'a' }} onSubmit={() => gate.promise} />
      ) : null
    }
    const w = await mount(<Harness />)
    mounted.push(w)
    void handle.submit()
    await vi.waitFor(() => expect(handle.submitting).toBe(true))
    shown.value = false
    await vi.waitFor(() => expect(handle.submitting).toBe(false))
    await expect(handle.submit()).resolves.toBeUndefined()
    await expect(handle.validate()).resolves.toBe(false)
    expect(() => handle.reset()).not.toThrow()
  })
})

interface OverlayProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  locked?: boolean
  renderContent: () => ReactNode
  renderFooter: (props: { close: () => void; submitting: boolean }) => ReactNode
}

const overlays: Array<[string, ComponentType<OverlayProps>]> = [
  ['Dialog', Dialog],
  ['Drawer', Drawer],
  ['Sheet', Sheet],
]

describe.each(overlays)('%s 跟随内部 Form 的提交状态', (_, Overlay) => {
  async function setup(options: { locked?: boolean; outside?: boolean } = {}) {
    const gate = deferred()
    const open = signal(true)
    const profile = <Form id="profile" values={{ name: '罗伦斯' }} onSubmit={() => gate.promise} />
    function Harness() {
      return (
        <>
          {options.outside ? profile : null}
          <Overlay
            open={open.use()}
            onOpenChange={value => (open.value = value)}
            title="编辑资料"
            locked={options.locked}
            renderContent={() => (options.outside ? '正文' : profile)}
            renderFooter={({ close, submitting }) => (
              <>
                <Button data-cancel="" disabled={submitting} onClick={close}>
                  取消
                </Button>
                <Button data-save="" type="submit" form="profile" loading={submitting}>
                  保存
                </Button>
              </>
            )}
          />
        </>
      )
    }
    const w = await mount(<Harness />)
    mounted.push(w)
    return { gate, open }
  }

  it('提交期间自动锁定:Esc 不关闭、关闭按钮不可用,renderFooter 的 submitting 为 true;结束后恢复', async () => {
    const s = await setup()
    await vi.waitFor(() => expect(button('save')).toBeTruthy())
    expect(button('cancel').disabled).toBe(false)
    expect(userLocked()).toBe(false)

    await userEvent.click(button('save'))
    await vi.waitFor(() => expect(button('cancel').disabled).toBe(true))
    expect(button('save').disabled).toBe(true)
    expect(userLocked()).toBe(true)
    await userEvent.keyboard('{Escape}')
    await pause()
    expect(s.open.value).toBe(true)

    s.gate.resolve()
    await vi.waitFor(() => expect(button('cancel').disabled).toBe(false))
    expect(userLocked()).toBe(false)
    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(s.open.value).toBe(false))
  })

  it('提交中关闭并卸载表单后不再锁定', async () => {
    const s = await setup()
    await vi.waitFor(() => expect(button('save')).toBeTruthy())
    await userEvent.click(button('save'))
    await vi.waitFor(() => expect(userLocked()).toBe(true))
    s.open.value = false
    await vi.waitFor(() => expect(document.querySelector('[role="dialog"]')).toBeNull())
    s.open.value = true
    await vi.waitFor(() => expect(button('cancel')).toBeTruthy())
    expect(userLocked()).toBe(false)
    expect(button('cancel').disabled).toBe(false)
  })

  it('弹层之外的 Form 提交不影响弹层', async () => {
    const s = await setup({ outside: true })
    await vi.waitFor(() => expect(button('save')).toBeTruthy())
    await userEvent.click(button('save'))
    await pause()
    expect(button('cancel').disabled).toBe(false)
    expect(userLocked()).toBe(false)
    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(s.open.value).toBe(false))
  })

  it('locked 属性仍然生效,与表单状态取或', async () => {
    const s = await setup({ locked: true })
    await vi.waitFor(() => expect(button('cancel')).toBeTruthy())
    expect(userLocked()).toBe(true)
    expect(button('cancel').disabled).toBe(false)
    await userEvent.keyboard('{Escape}')
    await pause()
    expect(s.open.value).toBe(true)
  })
})

describe.each(overlays)('%s 里每次渲染都新建 rules 的 Form', (_, Overlay) => {
  it('先报出校验错误,填好后调用 onSubmit', async () => {
    const submit = vi.fn()
    const name = signal('')
    function Harness() {
      const current = name.use()
      return (
        <Overlay
          open
          onOpenChange={() => {}}
          title="编辑资料"
          renderContent={() => (
            <Form
              id="inline"
              values={{ name: current }}
              rules={(input: FormValues): FormErrors => (input.name ? {} : { name: '请输入名称' })}
              onSubmit={submit}
            >
              {({ errors }) => (
                <>
                  <input
                    data-name=""
                    value={current}
                    onChange={event => (name.value = event.target.value)}
                  />
                  <output>{errors.name ?? ''}</output>
                </>
              )}
            </Form>
          )}
          renderFooter={() => (
            <Button data-save="" type="submit" form="inline">
              保存
            </Button>
          )}
        />
      )
    }
    const w = await mount(<Harness />)
    mounted.push(w)
    await vi.waitFor(() => expect(button('save')).toBeTruthy())

    await userEvent.click(button('save'))
    await vi.waitFor(() => expect(document.querySelector('output')!.textContent).toBe('请输入名称'))
    expect(submit).not.toHaveBeenCalled()

    await userEvent.type(document.querySelector('[data-name]')!, 'Lawrence')
    await userEvent.click(button('save'))
    await vi.waitFor(() => expect(submit).toHaveBeenCalledWith({ name: 'Lawrence' }))
    expect(document.querySelector('output')!.textContent).toBe('')
  })
})
