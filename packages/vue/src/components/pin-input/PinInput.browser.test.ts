import { afterEach, describe, expect, it, vi } from 'vitest'
import { cdp, userEvent } from 'vitest/browser'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createSSRApp, defineComponent, h, ref, type App } from 'vue'
import { renderToString } from 'vue/server-renderer'
import PinInput from './PinInput.vue'
import FormField from '../form-field/FormField.vue'
import Input from '../input/Input.vue'
import '../../../test/browser.css'

const mounted: VueWrapper[] = []
const apps: App[] = []
afterEach(async () => {
  mounted.splice(0).forEach(wrapper => wrapper.unmount())
  apps.splice(0).forEach(app => app.unmount())
  document.body.innerHTML = ''
  await userEvent.click(document.body, { position: { x: 1, y: 1 } })
})

function attach() {
  const host = document.createElement('div')
  host.style.cssText = 'width: 420px; padding: 40px'
  document.body.appendChild(host)
  return host
}

const send = (method: string, params: object) =>
  (cdp() as unknown as { send(method: string, params: object): Promise<unknown> }).send(
    method,
    params,
  )
const compose = (text: string) =>
  send('Input.imeSetComposition', {
    text,
    selectionStart: text.length,
    selectionEnd: text.length,
  })
const insert = (text: string) => send('Input.insertText', { text })

async function mountPin(
  props: Record<string, unknown> = {},
  accept: (next: string) => string | null = next => next,
) {
  const changes: string[] = []
  const completes: string[] = []
  const value = ref((props.value as string | undefined) ?? '')
  const { value: _initial, ...rest } = props
  const host = attach()
  const wrapper = mount(
    defineComponent({
      render: () =>
        h(PinInput, {
          'aria-label': '验证码',
          ...rest,
          modelValue: value.value,
          'onUpdate:modelValue': (next: string) => {
            changes.push(next)
            const accepted = accept(next)
            if (accepted !== null) value.value = accepted
          },
          onComplete: (next: string) => completes.push(next),
        }),
    }),
    { attachTo: host },
  )
  mounted.push(wrapper)
  const root = host.querySelector('[data-hn-pin-input]') as HTMLElement
  const native = root.querySelector('input') as HTMLInputElement
  const cells = () => Array.from(root.querySelectorAll<HTMLElement>('[data-hn-pin-cell]'))
  return {
    root,
    native,
    cells,
    changes,
    completes,
    set: (next: string) => {
      value.value = next
    },
    value: () => changes.at(-1) ?? (props.value as string | undefined) ?? '',
    text: () => cells().map(cell => cell.textContent ?? ''),
    active: () =>
      cells()
        .map((cell, index) => (cell.getAttribute('data-state') === 'active' ? index : -1))
        .filter(index => index >= 0),
    caret: () => cells().findIndex(cell => cell.querySelector('.hn-pin-caret')),
    click: (index: number, options: { clickCount?: number } = {}) =>
      userEvent.click(cells()[index]!, { force: true, ...options } as never),
  }
}

describe('pin-input · 输入', () => {
  it('点击后逐位输入,当前格跟着前进;填满后停在末格;退格逐位删除', async () => {
    const s = await mountPin({ length: 4 })
    await s.click(0)
    expect(document.activeElement).toBe(s.native)
    await vi.waitFor(() => expect(s.caret()).toBe(0))
    await userEvent.keyboard('1')
    await vi.waitFor(() => expect(s.text()).toEqual(['1', '', '', '']))
    expect(s.caret()).toBe(1)
    await userEvent.keyboard('234')
    await vi.waitFor(() => expect(s.text()).toEqual(['1', '2', '3', '4']))
    expect(s.changes).toEqual(['1', '12', '123', '1234'])
    expect(s.completes).toEqual(['1234'])
    expect(s.active()).toEqual([3])
    expect(s.native.value).toBe('1234')
    await userEvent.keyboard('{Backspace}')
    await vi.waitFor(() => expect(s.text()).toEqual(['1', '2', '3', '']))
    expect(s.caret()).toBe(3)
    await userEvent.keyboard('{Backspace}{Backspace}')
    await vi.waitFor(() => expect(s.value()).toBe('1'))
    expect(s.caret()).toBe(1)
  })

  it('字母与数字都能直接输入,大小写保持原样', async () => {
    const s = await mountPin({ length: 6 })
    await s.click(0)
    await userEvent.keyboard('aB3x')
    await vi.waitFor(() => expect(s.value()).toBe('aB3x'))
    expect(s.text()).toEqual(['a', 'B', '3', 'x', '', ''])
    expect(s.caret()).toBe(4)
  })

  it('数字模式不接受其他字符,全角数字折成半角', async () => {
    const s = await mountPin({ length: 4, type: 'number' })
    await s.click(0)
    await userEvent.keyboard('a7b8')
    await vi.waitFor(() => expect(s.value()).toBe('78'))
    expect(s.changes).toEqual(['7', '78'])
    await insert('９x０')
    await vi.waitFor(() => expect(s.value()).toBe('7890'))
    expect(s.native.value).toBe('7890')
    expect(s.native.inputMode).toBe('numeric')
  })

  it('已填的格子点击后被选中,输入覆盖它并前进到下一格', async () => {
    const s = await mountPin({ length: 4, value: '1234' })
    await s.click(1)
    await vi.waitFor(() => expect(s.active()).toEqual([1]))
    await userEvent.keyboard('9')
    await vi.waitFor(() => expect(s.value()).toBe('1934'))
    expect(s.active()).toEqual([2])
    await userEvent.keyboard('87')
    await vi.waitFor(() => expect(s.value()).toBe('1987'))
    expect(s.active()).toEqual([3])
    await userEvent.keyboard('6')
    await vi.waitFor(() => expect(s.value()).toBe('1986'))
    expect(s.completes).toEqual(['1934', '1984', '1987', '1986'])
  })

  it('点击空格子落到第一个空位;双击选中全部,输入替换整段', async () => {
    const s = await mountPin({ length: 6, value: '12' })
    await s.click(5)
    await vi.waitFor(() => expect(s.caret()).toBe(2))
    await s.click(0, { clickCount: 2 })
    await vi.waitFor(() => expect(s.active()).toEqual([0, 1]))
    await userEvent.keyboard('7')
    await vi.waitFor(() => expect(s.value()).toBe('7'))
    expect(s.caret()).toBe(1)
  })

  it('方向键、Home、End 在已填的格子与第一个空位之间移动;Shift 扩选', async () => {
    const s = await mountPin({ length: 6, value: '1234' })
    await s.click(4)
    await vi.waitFor(() => expect(s.caret()).toBe(4))
    await userEvent.keyboard('{ArrowLeft}')
    await vi.waitFor(() => expect(s.active()).toEqual([3]))
    await userEvent.keyboard('{ArrowLeft}{ArrowLeft}')
    await vi.waitFor(() => expect(s.active()).toEqual([1]))
    await userEvent.keyboard('{Home}')
    await vi.waitFor(() => expect(s.active()).toEqual([0]))
    await userEvent.keyboard('{ArrowLeft}')
    expect(s.active()).toEqual([0])
    await userEvent.keyboard('{End}')
    await vi.waitFor(() => expect(s.caret()).toBe(4))
    await userEvent.keyboard('{ArrowRight}')
    expect(s.caret()).toBe(4)
    await userEvent.keyboard('{Shift>}{ArrowLeft}{ArrowLeft}{/Shift}')
    await vi.waitFor(() => expect(s.active()).toEqual([2, 3]))
    await userEvent.keyboard('{Shift>}{ArrowRight}{/Shift}')
    await vi.waitFor(() => expect(s.active()).toEqual([3]))
    await userEvent.keyboard('{Shift>}{Home}{/Shift}')
    await vi.waitFor(() => expect(s.active()).toEqual([0, 1, 2, 3]))
    await userEvent.keyboard('5')
    await vi.waitFor(() => expect(s.value()).toBe('5'))
  })

  it('rtl 下左右方向键按视觉方向移动', async () => {
    const s = await mountPin({ length: 4, value: '123', dir: 'rtl' })
    await s.click(0)
    await vi.waitFor(() => expect(s.active()).toEqual([0]))
    await userEvent.keyboard('{ArrowLeft}')
    await vi.waitFor(() => expect(s.active()).toEqual([1]))
    await userEvent.keyboard('{ArrowRight}{ArrowRight}')
    await vi.waitFor(() => expect(s.active()).toEqual([0]))
  })

  it('Tab 聚焦时未填满落在第一个空位,失焦后没有当前格', async () => {
    const s = await mountPin({ length: 4, value: '12' })
    await userEvent.keyboard('{Tab}')
    expect(document.activeElement).toBe(s.native)
    await vi.waitFor(() => expect(s.caret()).toBe(2))
    await userEvent.keyboard('3')
    await vi.waitFor(() => expect(s.value()).toBe('123'))
    s.native.blur()
    await vi.waitFor(() => expect(s.active()).toEqual([]))
  })

  it('Tab 聚焦时已填满则选中全部,输入替换整段', async () => {
    const s = await mountPin({ length: 4, value: '1234' })
    await userEvent.keyboard('{Tab}')
    expect(document.activeElement).toBe(s.native)
    await vi.waitFor(() => expect(s.active()).toEqual([0, 1, 2, 3]))
    await userEvent.keyboard('98')
    await vi.waitFor(() => expect(s.value()).toBe('98'))
    expect(s.caret()).toBe(2)
  })

  it('整段插入从当前格起覆盖,超出的丢弃;长度够一整段时替换全部', async () => {
    const s = await mountPin({ length: 6, value: '123456' })
    await s.click(2)
    await vi.waitFor(() => expect(s.active()).toEqual([2]))
    await insert('ab')
    await vi.waitFor(() => expect(s.value()).toBe('12ab56'))
    expect(s.active()).toEqual([4])
    await insert(' 98 7 ')
    await vi.waitFor(() => expect(s.value()).toBe('12ab98'))
    expect(s.active()).toEqual([5])
    await s.click(3)
    await insert('654 321')
    await vi.waitFor(() => expect(s.value()).toBe('654321'))
    expect(s.active()).toEqual([5])
  })

  it('粘贴验证码:数字模式只取数字', async () => {
    const s = await mountPin({ length: 6, type: 'number' })
    await s.click(0)
    const data = new DataTransfer()
    data.setData('text/plain', '验证码 493-215')
    s.native.dispatchEvent(
      new ClipboardEvent('paste', { clipboardData: data, bubbles: true, cancelable: true }),
    )
    document.execCommand('insertText', false, '验证码 493-215')
    await vi.waitFor(() => expect(s.value()).toBe('493215'))
    expect(s.completes).toEqual(['493215'])
  })
})

describe('pin-input · 输入法', () => {
  it('组字过程中的字母实时落进格子,按原样上屏后保留', async () => {
    const s = await mountPin({ length: 6 })
    await s.click(0)
    await compose('a')
    await vi.waitFor(() => expect(s.text()).toEqual(['a', '', '', '', '', '']))
    await compose('ab')
    await compose('abc')
    await vi.waitFor(() => expect(s.value()).toBe('abc'))
    expect(s.caret()).toBe(3)
    await insert('abc')
    await vi.waitFor(() => expect(s.native.value).toBe('abc'))
    expect(s.value()).toBe('abc')
    expect(s.caret()).toBe(3)
    await userEvent.keyboard('1')
    await vi.waitFor(() => expect(s.value()).toBe('abc1'))
  })

  it('选了候选字时以上屏的文字为准', async () => {
    const s = await mountPin({ length: 6, value: '12' })
    await s.click(2)
    await compose('ni')
    await vi.waitFor(() => expect(s.value()).toBe('12ni'))
    await insert('你')
    await vi.waitFor(() => expect(s.value()).toBe('12你'))
    expect(s.native.value).toBe('12你')
    expect(s.caret()).toBe(3)
  })

  it('数字模式下组字不改动值,上屏的非数字被丢弃,之后仍可正常输入', async () => {
    const s = await mountPin({ length: 4, type: 'number', value: '12' })
    await s.click(2)
    await compose('ni')
    await new Promise(done => setTimeout(done, 50))
    expect(s.changes).toEqual([])
    expect(s.text()).toEqual(['1', '2', '', ''])
    await insert('你')
    await vi.waitFor(() => expect(s.native.value).toBe('12'))
    expect(s.changes).toEqual([])
    expect(s.caret()).toBe(2)
    await userEvent.keyboard('34')
    await vi.waitFor(() => expect(s.value()).toBe('1234'))
  })

  it('在已填的格子上组字时覆盖该格,不挤掉后面的字符', async () => {
    const s = await mountPin({ length: 6, value: '123456' })
    await s.click(2)
    await vi.waitFor(() => expect(s.active()).toEqual([2]))
    await compose('x')
    await vi.waitFor(() => expect(s.value()).toBe('12x456'))
    await compose('xy')
    await vi.waitFor(() => expect(s.value()).toBe('12xy56'))
    await insert('xy')
    await vi.waitFor(() => expect(s.native.value).toBe('12xy56'))
    expect(s.active()).toEqual([4])
  })

  it('组字超出格数时只取放得下的部分,填满即触发 complete', async () => {
    const s = await mountPin({ length: 4, value: '12' })
    await s.click(2)
    await compose('abc')
    await vi.waitFor(() => expect(s.value()).toBe('12ab'))
    expect(s.completes).toEqual(['12ab'])
    await insert('abc')
    await vi.waitFor(() => expect(s.native.value).toBe('12ab'))
    expect(s.completes).toEqual(['12ab'])
    expect(s.active()).toEqual([3])
  })

  it('取消组字后值回到组字之前', async () => {
    const s = await mountPin({ length: 4, value: '12' })
    await s.click(2)
    await compose('ab')
    await vi.waitFor(() => expect(s.value()).toBe('12ab'))
    await compose('')
    await vi.waitFor(() => expect(s.value()).toBe('12'))
    await insert('')
    expect(s.native.value).toBe('12')
  })
})

describe('pin-input · 受控与外部变化', () => {
  it('父级不接受时输入框回到原值', async () => {
    const s = await mountPin({ length: 4, value: '12' }, () => null)
    await s.click(2)
    await userEvent.keyboard('3')
    await vi.waitFor(() => expect(s.changes).toEqual(['123']))
    await vi.waitFor(() => expect(s.native.value).toBe('12'))
    expect(s.text()).toEqual(['1', '2', '', ''])
    expect(s.caret()).toBe(2)
  })

  it('父级改写时以改写后的值为准', async () => {
    const s = await mountPin({ length: 4 }, next => next.toUpperCase())
    await s.click(0)
    await userEvent.keyboard('ab')
    await vi.waitFor(() => expect(s.native.value).toBe('AB'))
    expect(s.text()).toEqual(['A', 'B', '', ''])
    expect(s.caret()).toBe(2)
  })

  it('外部清空后回到第一格,可以继续输入', async () => {
    const s = await mountPin({ length: 4 })
    await s.click(0)
    await userEvent.keyboard('1234')
    await vi.waitFor(() => expect(s.completes).toEqual(['1234']))
    s.set('')
    await vi.waitFor(() => expect(s.native.value).toBe(''))
    await vi.waitFor(() => expect(s.caret()).toBe(0))
    await userEvent.keyboard('56')
    await vi.waitFor(() => expect(s.native.value).toBe('56'))
    expect(s.text()).toEqual(['5', '6', '', ''])
  })
})

describe('pin-input · 表单与标签', () => {
  it('带 name 时随表单提交;FormField 的标签指向输入框,点击标签聚焦', async () => {
    const host = attach()
    const value = ref('')
    const wrapper = mount(
      defineComponent({
        render: () =>
          h('form', [
            h(FormField, { label: '验证码', description: '已发送到邮箱' }, () =>
              h(PinInput, {
                length: 4,
                name: 'code',
                required: true,
                modelValue: value.value,
                'onUpdate:modelValue': (next: string) => {
                  value.value = next
                },
              }),
            ),
          ]),
      }),
      { attachTo: host },
    )
    mounted.push(wrapper)
    const form = host.querySelector('form')!
    const native = host.querySelector<HTMLInputElement>('[data-hn-pin-input] input')!
    const label = host.querySelector('label')!
    expect(label.htmlFor).toBe(native.id)
    expect(native.getAttribute('aria-labelledby')).toBe(label.id)
    expect(native.getAttribute('aria-describedby')).toBeTruthy()
    expect(native.required).toBe(true)
    expect(form.checkValidity()).toBe(false)
    await userEvent.click(label)
    expect(document.activeElement).toBe(native)
    await userEvent.keyboard('2468')
    await vi.waitFor(() => expect(new FormData(form).get('code')).toBe('2468'))
    expect(form.checkValidity()).toBe(true)
  })

  it('禁用时不能聚焦也不能输入', async () => {
    const s = await mountPin({ length: 4, value: '12', disabled: true })
    await s.click(2)
    expect(document.activeElement).not.toBe(s.native)
    await userEvent.keyboard('3')
    expect(s.changes).toEqual([])
    expect(s.root.hasAttribute('data-disabled')).toBe(true)
  })

  it('遮蔽时格子显示圆点,输入框是密码类型', async () => {
    const s = await mountPin({ length: 4, mask: true })
    await s.click(0)
    await userEvent.keyboard('12')
    await vi.waitFor(() => expect(s.text()).toEqual(['•', '•', '', '']))
    expect(s.native.type).toBe('password')
    expect(s.native.value).toBe('12')
  })

  it('服务端输出激活后无警告,值与格子一致', async () => {
    const warn = vi.spyOn(console, 'warn')
    const Page = defineComponent({
      setup() {
        const value = ref('12')
        return () =>
          h(PinInput, {
            length: 4,
            placeholder: '○',
            'aria-label': '验证码',
            modelValue: value.value,
            'onUpdate:modelValue': (next: string) => {
              value.value = next
            },
          })
      },
    })
    const html = await renderToString(createSSRApp(Page))
    const host = attach()
    host.innerHTML = html
    const native = host.querySelector('input')!
    expect(native.value).toBe('12')
    expect(
      Array.from(host.querySelectorAll('[data-hn-pin-cell]')).map(cell => cell.textContent),
    ).toEqual(['1', '2', '○', '○'])
    const app = createSSRApp(Page)
    app.mount(host)
    apps.push(app)
    await userEvent.click(host.querySelectorAll('[data-hn-pin-cell]')[2]!, { force: true })
    await userEvent.keyboard('3')
    await vi.waitFor(() => expect(native.value).toBe('123'))
    expect(warn).not.toHaveBeenCalled()
    warn.mockRestore()
  })
})

describe('pin-input · 外观', () => {
  it('三档格子的高度与 Input 逐档相等,格子是正方形,输入框盖住整组', async () => {
    for (const size of ['sm', 'md', 'lg'] as const) {
      const wrapper = mount(Input, {
        props: { size },
        attrs: { 'aria-label': size },
        attachTo: attach(),
      })
      mounted.push(wrapper)
      const input = wrapper.element as HTMLElement
      const s = await mountPin({ size })
      const cell = s.cells()[0]!
      expect(cell.offsetHeight).toBe(input.offsetHeight)
      expect(cell.offsetWidth).toBe(cell.offsetHeight)
      const box = s.root.getBoundingClientRect()
      const native = s.native.getBoundingClientRect()
      expect(native.width).toBe(box.width)
      expect(native.height).toBe(box.height)
      expect(parseFloat(getComputedStyle(s.native).fontSize)).toBeGreaterThanOrEqual(16)
    }
  })

  it('聚焦时环长在当前格上,原生文字与光标不可见', async () => {
    const s = await mountPin({ length: 4, value: '12' })
    const rest = getComputedStyle(s.cells()[2]!).boxShadow
    await s.click(2)
    await vi.waitFor(() =>
      expect(getComputedStyle(s.cells()[2]!).boxShadow).toBe(
        rest.replace('0px 0px 0px 0px', '0px 0px 0px 2px'),
      ),
    )
    expect(getComputedStyle(s.cells()[0]!).boxShadow).toBe(rest)
    const style = getComputedStyle(s.native)
    expect(style.color).toBe('rgba(0, 0, 0, 0)')
    expect(style.caretColor).toBe('rgba(0, 0, 0, 0)')
    expect(style.opacity).toBe('1')
  })

  it('悬停时整组格子变色,聚焦后不再因悬停变色', async () => {
    const s = await mountPin({ length: 4 })
    const rest = getComputedStyle(s.cells()[3]!).backgroundColor
    await userEvent.hover(s.native)
    await vi.waitFor(() => expect(getComputedStyle(s.cells()[3]!).backgroundColor).not.toBe(rest))
    await s.click(0)
    await vi.waitFor(() => expect(getComputedStyle(s.cells()[3]!).backgroundColor).toBe(rest))
  })

  it('占位符显示在空格子里,当前格显示光标', async () => {
    const s = await mountPin({ length: 4, value: '1', placeholder: '○' })
    expect(s.text()).toEqual(['1', '○', '○', '○'])
    await s.click(1)
    await vi.waitFor(() => expect(s.caret()).toBe(1))
    expect(s.text()).toEqual(['1', '', '○', '○'])
  })
})
