import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h, reactive, ref, shallowRef, type Component } from 'vue'
import Form from './Form.vue'
import Button from '../button/Button.vue'
import Dialog from '../dialog/Dialog.vue'
import Drawer from '../drawer/Drawer.vue'
import Sheet from '../sheet/Sheet.vue'
import type { FormErrors, FormValues } from './standard-schema'
import '../../../test/browser.css'

const mounted: VueWrapper[] = []
afterEach(() => {
  mounted.splice(0).forEach(w => w.unmount())
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

describe('Form 句柄上的状态', () => {
  it('模板引用可以读到 submitting、submitted、invalid 与 errors,并随提交过程变化', async () => {
    const gate = deferred()
    const form = shallowRef<InstanceType<typeof Form>>()
    const values = reactive({ name: '' })
    const rules = (current: FormValues): FormErrors => (current.name ? {} : { name: '请输入名称' })
    const w = mount(
      defineComponent({
        setup: () => () => [
          h(Form, { ref: form, values, rules, onSubmit: () => gate.promise }),
          h(
            Button,
            {
              'data-save': '',
              loading: form.value?.submitting,
              onClick: () => form.value?.submit(),
            },
            () => '保存',
          ),
          h(
            'output',
            JSON.stringify({
              submitting: form.value?.submitting,
              submitted: form.value?.submitted,
              invalid: form.value?.invalid,
              errors: form.value?.errors,
            }),
          ),
        ],
      }),
      { attachTo: document.body },
    )
    mounted.push(w)
    const state = () => JSON.parse(w.get('output').text())
    await vi.waitFor(() =>
      expect(state()).toEqual({ submitting: false, submitted: false, invalid: false, errors: {} }),
    )

    await userEvent.click(button('save'))
    await vi.waitFor(() => expect(state().submitted).toBe(true))
    expect(state()).toMatchObject({
      submitting: false,
      invalid: true,
      errors: { name: '请输入名称' },
    })

    values.name = '罗伦斯'
    await userEvent.click(button('save'))
    await vi.waitFor(() => expect(state().submitting).toBe(true))
    expect(state()).toMatchObject({ invalid: false, errors: {} })
    expect(button('save').disabled).toBe(true)

    gate.resolve()
    await vi.waitFor(() => expect(state().submitting).toBe(false))
    expect(button('save').disabled).toBe(false)
  })
})

const overlays: Array<[string, Component]> = [
  ['Dialog', Dialog],
  ['Drawer', Drawer],
  ['Sheet', Sheet],
]

describe.each(overlays)('%s 跟随内部 Form 的提交状态', (_, Overlay) => {
  function setup(options: { locked?: boolean; outside?: boolean } = {}) {
    const gate = deferred()
    const open = ref(true)
    const values = reactive({ name: '罗伦斯' })
    const profile = () => h(Form, { id: 'profile', values, onSubmit: () => gate.promise })
    const w = mount(
      defineComponent({
        setup: () => () => [
          options.outside ? profile() : null,
          h(
            Overlay,
            {
              open: open.value,
              'onUpdate:open': (value: boolean) => (open.value = value),
              title: '编辑资料',
              locked: options.locked,
            },
            {
              content: () => (options.outside ? '正文' : profile()),
              footer: (slot: { close: () => void; submitting: boolean }) => [
                h(
                  Button,
                  { 'data-cancel': '', disabled: slot.submitting, onClick: slot.close },
                  () => '取消',
                ),
                h(
                  Button,
                  { 'data-save': '', type: 'submit', form: 'profile', loading: slot.submitting },
                  () => '保存',
                ),
              ],
            },
          ),
        ],
      }),
      { attachTo: document.body },
    )
    mounted.push(w)
    return { gate, open }
  }

  it('提交期间自动锁定:Esc 不关闭、关闭按钮不可用,footer 插槽的 submitting 为 true;结束后恢复', async () => {
    const s = setup()
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
    const s = setup()
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
    const s = setup({ outside: true })
    await vi.waitFor(() => expect(button('save')).toBeTruthy())
    await userEvent.click(button('save'))
    await pause()
    expect(button('cancel').disabled).toBe(false)
    expect(userLocked()).toBe(false)
    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(s.open.value).toBe(false))
  })

  it('locked 属性仍然生效,与表单状态取或', async () => {
    const s = setup({ locked: true })
    await vi.waitFor(() => expect(button('cancel')).toBeTruthy())
    expect(userLocked()).toBe(true)
    expect(button('cancel').disabled).toBe(false)
    await userEvent.keyboard('{Escape}')
    await pause()
    expect(s.open.value).toBe(true)
  })
})
