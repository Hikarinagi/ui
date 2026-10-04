import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { useState } from 'react'
import { FileUpload, type FileUploadProps } from './FileUpload'
import { selectFiles } from '../../../../shared/src/lib/file-upload/select'
import { formatSize } from '../../../../shared/src/lib/file-upload/size'
import { expectNoA11yViolations } from '../../../test/axe'

type Value = File | File[] | null

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(cleanup)

const file = (name: string, size = 1024, type = 'image/png') =>
  new File([new Uint8Array(size)], name, { type, lastModified: 1 })

function mountUpload(props: Partial<FileUploadProps> = {}) {
  const onValueChange = vi.fn()
  const onReject = vi.fn()
  const state: { value: Value } = { value: null }
  function Harness() {
    const [value, setValue] = useState<Value>(null)
    state.value = value
    return (
      <FileUpload
        aria-label="上传封面"
        {...props}
        value={value}
        onValueChange={next => {
          setValue(next)
          onValueChange(next)
        }}
        onReject={onReject}
      />
    )
  }
  const screen = render(<Harness />)
  const root = screen.container.firstElementChild as HTMLElement
  return { ...screen, root, state, onValueChange, onReject }
}

function choose(root: HTMLElement, files: File[]) {
  const input = root.querySelector('input[type="file"]') as HTMLInputElement
  Object.defineProperty(input, 'files', { value: files, configurable: true })
  fireEvent.change(input)
}

describe('结构', () => {
  it('拖放区是一枚按钮，attrs 落在它身上；隐藏的文件输入带 accept、multiple 与 name', () => {
    const w = mountUpload({ accept: 'image/*', multiple: true, name: 'cover' })
    const area = w.root.querySelector('[data-hn-file-upload-area]')!
    expect(area.tagName).toBe('BUTTON')
    expect(area.getAttribute('aria-label')).toBe('上传封面')
    expect(area.textContent).toContain('拖拽文件到此处，或点击选择')
    const input = w.root.querySelector('input[type="file"]')!
    expect(input.getAttribute('accept')).toBe('image/*')
    expect(input.getAttribute('multiple')).not.toBeNull()
    expect(input.getAttribute('name')).toBe('cover')
    expect(input.getAttribute('aria-hidden')).toBe('true')
  })

  it('list 关闭时只有拖放区，选中的文件不列出来', () => {
    const w = mountUpload({ list: false, multiple: true })
    choose(w.root, [file('a.png')])
    expect(w.onValueChange.mock.calls[0]?.[0]).toHaveLength(1)
    expect(w.root.querySelector('ul')).toBeNull()
  })

  it('loading 时拖放区显示加载指示、标为 aria-busy 并禁用；icon 插槽换掉图标', () => {
    const click = vi.spyOn(HTMLInputElement.prototype, 'click').mockImplementation(() => {})
    const { container } = render(<FileUpload loading icon={<svg data-probe="icon" />} />)
    const area = container.querySelector('[data-hn-file-upload-area]')!
    expect(area.getAttribute('aria-busy')).toBe('true')
    expect(area.getAttribute('disabled')).not.toBeNull()
    expect(area.querySelector('[role="status"]')).not.toBeNull()
    fireEvent.click(area)
    expect(click).not.toHaveBeenCalled()
    click.mockRestore()
    const custom = render(<FileUpload icon={<svg data-probe="icon" />} />)
    expect(
      custom.container.querySelector('[data-hn-file-upload-area] svg[data-probe="icon"]'),
    ).not.toBeNull()
  })

  it('button 形态渲染为一颗「选择文件」按钮', () => {
    const w = mountUpload({ variant: 'button' })
    expect(w.root.querySelector('[data-hn-file-upload-area]')).toBeNull()
    expect(w.root.querySelector('button')!.textContent).toContain('选择文件')
  })

  it('点击拖放区打开系统选择框；禁用时不打开', () => {
    const click = vi.spyOn(HTMLInputElement.prototype, 'click').mockImplementation(() => {})
    fireEvent.click(mountUpload().root.querySelector('[data-hn-file-upload-area]')!)
    expect(click).toHaveBeenCalledTimes(1)
    fireEvent.click(
      mountUpload({ disabled: true }).root.querySelector('[data-hn-file-upload-area]')!,
    )
    expect(click).toHaveBeenCalledTimes(1)
    click.mockRestore()
  })
})

describe('值', () => {
  it('单选时交出一个 File，再选即替换；列表显示文件名、可读大小与移除按钮', () => {
    const w = mountUpload()
    choose(w.root, [file('a.png')])
    expect(w.onValueChange.mock.calls[0]?.[0]).toBeInstanceOf(File)
    expect(w.root.querySelector('li')!.textContent).toContain('a.png')
    expect(w.root.querySelector('li')!.textContent).toMatch(/kB/i)
    expect(w.root.querySelector('button[aria-label="移除 a.png"]')).not.toBeNull()
    choose(w.root, [file('b.png')])
    expect((w.onValueChange.mock.calls[1]?.[0] as File).name).toBe('b.png')
    expect(w.root.querySelectorAll('li')).toHaveLength(1)
  })

  it.each([
    { name: 'doc.pdf', type: 'application/pdf', size: 1024, reason: 'type' },
    { name: 'big.png', type: 'image/png', size: 4096, reason: 'size' },
  ])('单选拒绝 $reason 不清空旧文件，下一次合法选择仍能替换', rejected => {
    const previous = file('old.png')
    const w = mountUpload({ accept: 'image/*', maxSize: 2048 })
    choose(w.root, [previous])
    choose(w.root, [file(rejected.name, rejected.size, rejected.type)])
    expect(w.state.value).toEqual(previous)
    expect(w.root.querySelector('li')!.textContent).toContain('old.png')
    expect(w.onReject.mock.calls[0]?.[0]).toEqual([
      expect.objectContaining({ reason: rejected.reason }),
    ])
    const replacement = file('new.png')
    choose(w.root, [replacement])
    expect(w.state.value).toEqual(replacement)
    expect(w.root.querySelectorAll('li')).toHaveLength(1)
  })

  it('多选时交出数组并追加，重复的文件只留一份；移除按钮删掉对应的文件', () => {
    const w = mountUpload({ multiple: true })
    choose(w.root, [file('a.png'), file('b.png')])
    choose(w.root, [file('b.png'), file('c.png')])
    const last = w.onValueChange.mock.calls.at(-1)?.[0] as File[]
    expect(last.map(f => f.name)).toEqual(['a.png', 'b.png', 'c.png'])
    fireEvent.click(w.root.querySelector('button[aria-label="移除 b.png"]')!)
    expect((w.onValueChange.mock.calls.at(-1)?.[0] as File[]).map(f => f.name)).toEqual([
      'a.png',
      'c.png',
    ])
  })

  it('accept、maxSize 与 maxFiles 之外的文件被拒绝，以 reject 事件交出原因', () => {
    const w = mountUpload({ multiple: true, accept: 'image/*', maxSize: 2048, maxFiles: 2 })
    choose(w.root, [
      file('a.png'),
      file('doc.pdf', 1024, 'application/pdf'),
      file('big.png', 4096),
      file('b.png'),
      file('c.png'),
    ])
    const rejected = w.onReject.mock.calls[0]?.[0] as Array<{ file: File; reason: string }>
    expect(rejected.map(r => [r.file.name, r.reason])).toEqual([
      ['doc.pdf', 'type'],
      ['big.png', 'size'],
      ['c.png', 'count'],
    ])
    expect((w.onValueChange.mock.calls[0]?.[0] as File[]).map(f => f.name)).toEqual([
      'a.png',
      'b.png',
    ])
  })
})

describe('纯函数', () => {
  it('selectFiles 按后缀与 MIME 通配匹配 accept', () => {
    const jpg = file('x.JPG', 10, 'image/jpeg')
    expect(selectFiles([], [jpg], { accept: '.jpg' }).next).toHaveLength(1)
    expect(selectFiles([], [jpg], { accept: 'image/*' }).next).toHaveLength(1)
    expect(selectFiles([], [jpg], { accept: 'image/png' }).rejected[0]?.reason).toBe('type')
  })

  it('formatSize 按语言给出带单位的可读大小', () => {
    expect(formatSize('en-US', 512)).toMatch(/512\s?B/)
    expect(formatSize('en-US', 1536)).toMatch(/1\.5\s?kB/i)
    expect(formatSize('zh-CN', 3 * 1024 * 1024)).toMatch(/3\s?MB/)
  })
})

describe('服务端渲染', () => {
  it('首屏渲染出拖放区与提示', () => {
    const html = renderToString(<FileUpload aria-label="上传" />)
    expect(html).toContain('data-hn-file-upload-area')
    expect(html).toContain('拖拽文件到此处，或点击选择')
  })
})

describe('无障碍', () => {
  it('无违规', async () => {
    const w = mountUpload({ multiple: true })
    choose(w.root, [file('a.png')])
    await expectNoA11yViolations(w.root)
  })
})
