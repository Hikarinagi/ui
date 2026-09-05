import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { userEvent } from '@vitest/browser/context'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h, reactive } from 'vue'
import FileUpload from './FileUpload.vue'
import '../../../test/browser.css'

let mounted: VueWrapper[] = []

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(() => {
  mounted.forEach(w => w.unmount())
  mounted = []
})

function attach() {
  const host = document.createElement('div')
  host.style.cssText = 'width: 360px; padding: 40px'
  document.body.appendChild(host)
  return host
}

function mountUpload(props: Record<string, unknown> = {}) {
  const state = reactive<{ modelValue: File | File[] | null }>({ modelValue: null })
  const w = mount(
    defineComponent({
      render: () =>
        h(FileUpload, {
          ...state,
          ...props,
          'aria-label': '上传',
          'onUpdate:modelValue': (value: File | File[] | null) => (state.modelValue = value),
        }),
    }),
    { attachTo: attach() },
  )
  mounted.push(w)
  const root = w.find('[data-hn-file-upload]').element as HTMLElement
  return {
    state,
    root,
    area: root.querySelector('[data-hn-file-upload-area]') as HTMLButtonElement,
  }
}

function transfer(files: File[]) {
  const data = new DataTransfer()
  files.forEach(f => data.items.add(f))
  return data
}

const png = () =>
  new File(
    [
      Uint8Array.from(
        atob(
          'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
        ),
        c => c.charCodeAt(0),
      ),
    ],
    'dot.png',
    { type: 'image/png' },
  )

describe('file-upload · 拖放', () => {
  it('拖入时边框换成强调色，放下后文件进入列表并出现图片预览；离开后恢复', async () => {
    const { state, area, root } = mountUpload()
    const idle = getComputedStyle(area).borderColor
    area.dispatchEvent(new DragEvent('dragenter', { bubbles: true, dataTransfer: transfer([]) }))
    await vi.waitFor(() => expect(area.hasAttribute('data-dragging')).toBe(true))
    await vi.waitFor(() => expect(getComputedStyle(area).borderColor).not.toBe(idle))
    area.dispatchEvent(new DragEvent('dragleave', { bubbles: true }))
    await vi.waitFor(() => expect(area.hasAttribute('data-dragging')).toBe(false))
    area.dispatchEvent(new DragEvent('dragenter', { bubbles: true, dataTransfer: transfer([]) }))
    area.dispatchEvent(
      new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer: transfer([png()]) }),
    )
    await vi.waitFor(() => expect((state.modelValue as File | null)?.name).toBe('dot.png'))
    expect(area.hasAttribute('data-dragging')).toBe(false)
    await vi.waitFor(() =>
      expect(root.querySelector('li img')?.getAttribute('src')).toMatch(/^blob:/),
    )
  })

  it('根被撑成正方形时拖放区随之填满', async () => {
    const { root, area } = mountUpload({ class: 'aspect-square' })
    expect(root.offsetHeight).toBe(root.offsetWidth)
    expect(area.offsetHeight).toBe(root.offsetHeight)
  })

  it('拖放区可以用键盘触达，Enter 打开系统选择框', async () => {
    const click = vi.spyOn(HTMLInputElement.prototype, 'click').mockImplementation(() => {})
    const { area } = mountUpload()
    area.focus()
    await userEvent.keyboard('{Enter}')
    expect(click).toHaveBeenCalledTimes(1)
    expect(getComputedStyle(area).outlineStyle).toBe('solid')
    click.mockRestore()
  })
})
