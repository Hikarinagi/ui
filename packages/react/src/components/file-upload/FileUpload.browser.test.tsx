import { describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { render } from 'vitest-browser-react'
import { useState } from 'react'
import { FileUpload, type FileUploadProps } from './FileUpload'
import '../../../test/browser.css'

function attach() {
  const host = document.createElement('div')
  host.style.cssText = 'width: 360px; padding: 40px'
  document.body.appendChild(host)
  return host
}

async function mountUpload(props: Partial<FileUploadProps> = {}) {
  const state: { modelValue: File | File[] | null } = { modelValue: null }
  function Harness() {
    const [value, setValue] = useState<File | File[] | null>(null)
    return (
      <FileUpload
        {...props}
        value={value}
        aria-label="上传"
        onValueChange={next => {
          state.modelValue = next
          setValue(next)
        }}
      />
    )
  }
  const host = attach()
  await render(<Harness />, { container: host })
  const root = host.querySelector('[data-hn-file-upload]') as HTMLElement
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
    const { state, area, root } = await mountUpload()
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
    const { root, area } = await mountUpload({ className: 'aspect-square' })
    expect(root.offsetHeight).toBe(root.offsetWidth)
    expect(area.offsetHeight).toBe(root.offsetHeight)
  })

  it('拖放区可以用键盘触达，Enter 打开系统选择框', async () => {
    const click = vi.spyOn(HTMLInputElement.prototype, 'click').mockImplementation(() => {})
    const { area } = await mountUpload()
    area.focus()
    await userEvent.keyboard('{Enter}')
    expect(click).toHaveBeenCalledTimes(1)
    expect(getComputedStyle(area).outlineStyle).toBe('solid')
    click.mockRestore()
  })
})
