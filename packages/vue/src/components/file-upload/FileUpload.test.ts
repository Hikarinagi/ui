import { describe, expect, it, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createSSRApp, defineComponent, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import FileUpload from './FileUpload.vue'
import { selectFiles } from './utils/select'
import { formatSize } from './utils/size'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

const file = (name: string, size = 1024, type = 'image/png') =>
  new File([new Uint8Array(size)], name, { type, lastModified: 1 })

function mountUpload(props: Record<string, unknown> = {}) {
  const w = mount(FileUpload, {
    props: {
      modelValue: null,
      ...props,
      'onUpdate:modelValue': (value: File | File[] | null) => w.setProps({ modelValue: value }),
    },
    attrs: { 'aria-label': '上传封面' },
    attachTo: document.body,
  })
  return w
}

async function choose(w: ReturnType<typeof mount>, files: File[]) {
  const input = w.find('input[type="file"]').element as HTMLInputElement
  Object.defineProperty(input, 'files', { value: files, configurable: true })
  await w.find('input[type="file"]').trigger('change')
}

describe('结构', () => {
  it('拖放区是一枚按钮，attrs 落在它身上；隐藏的文件输入带 accept、multiple 与 name', () => {
    const w = mountUpload({ accept: 'image/*', multiple: true, name: 'cover' })
    const area = w.find('[data-hn-file-upload-area]')
    expect(area.element.tagName).toBe('BUTTON')
    expect(area.attributes('aria-label')).toBe('上传封面')
    expect(area.text()).toContain('拖拽文件到此处，或点击选择')
    const input = w.find('input[type="file"]')
    expect(input.attributes('accept')).toBe('image/*')
    expect(input.attributes('multiple')).toBeDefined()
    expect(input.attributes('name')).toBe('cover')
    expect(input.attributes('aria-hidden')).toBe('true')
  })

  it('list 关闭时只有拖放区，选中的文件不列出来', async () => {
    const w = mountUpload({ list: false, multiple: true })
    await choose(w, [file('a.png')])
    expect(w.emitted('update:modelValue')?.[0]?.[0]).toHaveLength(1)
    expect(w.find('ul').exists()).toBe(false)
  })

  it('loading 时拖放区显示加载指示、标为 aria-busy 并禁用；icon 插槽换掉图标', async () => {
    const click = vi.spyOn(HTMLInputElement.prototype, 'click').mockImplementation(() => {})
    const w = mount(FileUpload, {
      props: { loading: true },
      slots: { icon: () => h('svg', { 'data-probe': 'icon' }) },
      attachTo: document.body,
    })
    const area = w.find('[data-hn-file-upload-area]')
    expect(area.attributes('aria-busy')).toBe('true')
    expect(area.attributes('disabled')).toBeDefined()
    expect(area.find('[role="status"]').exists()).toBe(true)
    await area.trigger('click')
    expect(click).not.toHaveBeenCalled()
    click.mockRestore()
    const custom = mount(FileUpload, { slots: { icon: () => h('svg', { 'data-probe': 'icon' }) } })
    expect(custom.find('[data-hn-file-upload-area] svg[data-probe="icon"]').exists()).toBe(true)
  })

  it('button 形态渲染为一颗「选择文件」按钮', () => {
    const w = mountUpload({ variant: 'button' })
    expect(w.find('[data-hn-file-upload-area]').exists()).toBe(false)
    expect(w.find('button').text()).toContain('选择文件')
  })

  it('点击拖放区打开系统选择框；禁用时不打开', async () => {
    const click = vi.spyOn(HTMLInputElement.prototype, 'click').mockImplementation(() => {})
    await mountUpload().find('[data-hn-file-upload-area]').trigger('click')
    expect(click).toHaveBeenCalledTimes(1)
    await mountUpload({ disabled: true }).find('[data-hn-file-upload-area]').trigger('click')
    expect(click).toHaveBeenCalledTimes(1)
    click.mockRestore()
  })
})

describe('值', () => {
  it('单选时交出一个 File，再选即替换；列表显示文件名、可读大小与移除按钮', async () => {
    const w = mountUpload()
    await choose(w, [file('a.png')])
    expect(w.emitted('update:modelValue')?.[0]?.[0]).toBeInstanceOf(File)
    expect(w.find('li').text()).toContain('a.png')
    expect(w.find('li').text()).toMatch(/kB/i)
    expect(w.find('button[aria-label="移除 a.png"]').exists()).toBe(true)
    await choose(w, [file('b.png')])
    expect((w.emitted('update:modelValue')?.[1]?.[0] as File).name).toBe('b.png')
    expect(w.findAll('li')).toHaveLength(1)
  })

  it('多选时交出数组并追加，重复的文件只留一份；移除按钮删掉对应的文件', async () => {
    const w = mountUpload({ multiple: true })
    await choose(w, [file('a.png'), file('b.png')])
    await choose(w, [file('b.png'), file('c.png')])
    const last = w.emitted('update:modelValue')?.at(-1)?.[0] as File[]
    expect(last.map(f => f.name)).toEqual(['a.png', 'b.png', 'c.png'])
    await w.find('button[aria-label="移除 b.png"]').trigger('click')
    expect((w.emitted('update:modelValue')?.at(-1)?.[0] as File[]).map(f => f.name)).toEqual([
      'a.png',
      'c.png',
    ])
  })

  it('accept、maxSize 与 maxFiles 之外的文件被拒绝，以 reject 事件交出原因', async () => {
    const w = mountUpload({ multiple: true, accept: 'image/*', maxSize: 2048, maxFiles: 2 })
    await choose(w, [
      file('a.png'),
      file('doc.pdf', 1024, 'application/pdf'),
      file('big.png', 4096),
      file('b.png'),
      file('c.png'),
    ])
    const rejected = w.emitted('reject')?.[0]?.[0] as Array<{ file: File; reason: string }>
    expect(rejected.map(r => [r.file.name, r.reason])).toEqual([
      ['doc.pdf', 'type'],
      ['big.png', 'size'],
      ['c.png', 'count'],
    ])
    expect((w.emitted('update:modelValue')?.[0]?.[0] as File[]).map(f => f.name)).toEqual([
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
  it('首屏渲染出拖放区与提示', async () => {
    const html = await renderToString(
      createSSRApp(defineComponent({ render: () => h(FileUpload, { 'aria-label': '上传' }) })),
    )
    expect(html).toContain('data-hn-file-upload-area')
    expect(html).toContain('拖拽文件到此处，或点击选择')
  })
})

describe('无障碍', () => {
  it('无违规', async () => {
    const w = mountUpload({ multiple: true })
    await choose(w, [file('a.png')])
    await expectNoA11yViolations(w.element)
  })
})
