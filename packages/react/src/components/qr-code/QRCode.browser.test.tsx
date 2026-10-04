import { afterEach, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { cleanup } from 'vitest-browser-react'
import { act, createRef, type ReactNode } from 'react'
import { hydrateRoot, type Root } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import jsQR from 'jsqr'
import axe from 'axe-core'
import { QRCode } from './QRCode'
import { exportQRCode } from '../../../../shared/src/lib/qr-code-export'
import type { QRCodeExpose, QRCodeProps } from './types'
import { mount } from '../../../test/mount'
import '../../../test/browser.css'

const value = 'https://hinaui.dev/guide/installation'
async function setup(props: Partial<QRCodeProps> = {}) {
  const ref = createRef<QRCodeExpose>()
  const emitted = { refresh: vi.fn(), error: vi.fn(), logoError: vi.fn() }
  let current: Partial<QRCodeProps> = { value, ...props }
  const ui = () => (
    <QRCode
      value={value}
      {...current}
      ref={ref}
      onRefresh={emitted.refresh}
      onError={emitted.error}
      onLogoError={emitted.logoError}
    />
  )
  const w = await mount(ui())
  return {
    w,
    emitted,
    get api() {
      return ref.current!
    },
    setProps(next: Partial<QRCodeProps>) {
      current = { ...current, ...next }
      return w.rerender(ui())
    },
  }
}
afterEach(async () => {
  await cleanup()
  document.body.innerHTML = ''
  document.documentElement.classList.remove('dark')
  vi.restoreAllMocks()
})
async function decode(blob: Blob) {
  const image = new Image()
  const url = URL.createObjectURL(blob)
  try {
    image.src = url
    await image.decode()
    const canvas = document.createElement('canvas')
    canvas.width = image.width
    canvas.height = image.height
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(image, 0, 0)
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height)
    return jsQR(pixels.data, pixels.width, pixels.height, { inversionAttempts: 'dontInvert' })?.data
  } finally {
    URL.revokeObjectURL(url)
  }
}
async function hydrate(host: Element, ui: ReactNode) {
  const env = globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
  env.IS_REACT_ACT_ENVIRONMENT = true
  try {
    let root: Root | undefined
    await act(async () => {
      root = hydrateRoot(host, ui, { onRecoverableError: error => console.error(error) })
    })
    return root!
  } finally {
    env.IS_REACT_ACT_ENVIRONMENT = false
  }
}

it.each(['L', 'M', 'Q', 'H'] as const)(
  'exports a decodable code with correction level %s and updates Unicode content',
  async level => {
    const s = await setup({ level })
    expect(await decode(await s.api.toBlob())).toBe(value)
    const next = 'https://hinaui.dev/搜索?q=光&emoji=🌸'
    await s.setProps({ value: next })
    expect(await decode(await s.api.toBlob({ type: 'image/svg+xml' }))).toBe(next)
  },
)

it('resolves theme tokens for standalone export, keeps dark-on-light contrast and preserves a logo', async () => {
  const logo =
    'data:image/svg+xml,' +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><rect width="32" height="32" fill="#168bad"/><path d="M8 6v20m16-20v20M8 16h16" stroke="white" stroke-width="4"/></svg>',
    )
  const s = await setup({ logo, color: 'var(--hn-accent-text)' })
  const light = getComputedStyle(s.w.element.querySelector('svg > rect')!).fill
  document.documentElement.classList.add('dark')
  expect(getComputedStyle(s.w.element.querySelector('svg > rect')!).fill).toBe(light)
  await s.setProps({ color: undefined })
  const vector = await s.api.toBlob({ type: 'image/svg+xml' })
  const xml = await vector.text()
  expect(xml).not.toContain('var(')
  expect(xml).toContain('<image')
  expect(xml).toContain('data:image/svg+xml,')
  expect(await decode(await s.api.toBlob())).toBe(value)
  s.w.element.querySelector('image')!.dispatchEvent(new Event('error'))
  await vi.waitFor(() => expect(s.w.element.querySelector('image')).toBeNull())
  expect(s.emitted.logoError).toHaveBeenCalledTimes(1)
  expect(await decode(await s.api.toBlob())).toBe(value)
})

it('embeds fetched logos in exported SVG and reports unavailable remote assets', async () => {
  const s = await setup({
    logo: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg"/>'),
  })
  const svg = s.api.svg!.cloneNode(true) as SVGSVGElement
  document.body.append(svg)
  svg.querySelector('image')!.setAttribute('href', '/logo-for-export.svg')
  const fetch = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response('<svg xmlns="http://www.w3.org/2000/svg"/>', {
      headers: { 'Content-Type': 'image/svg+xml' },
    }),
  )
  const xml = await (await exportQRCode(svg, 192, { type: 'image/svg+xml' })).text()
  expect(fetch).toHaveBeenCalledOnce()
  expect(xml).not.toContain('/logo-for-export.svg')
  expect(xml).toContain('data:image/svg+xml;base64,')
  fetch.mockResolvedValue(new Response('', { status: 403 }))
  await expect(exportQRCode(svg, 192)).rejects.toThrow('logo')
  fetch.mockResolvedValue(
    new Response('not an image', { headers: { 'Content-Type': 'image/png' } }),
  )
  await expect(exportQRCode(svg, 192, { type: 'image/svg+xml' })).rejects.toThrow()
})

it('keeps status transitions square, removes inactive codes, and leaves refresh under caller control', async () => {
  const s = await setup()
  const initial = s.w.element.getBoundingClientRect()
  for (const status of ['loading', 'expired', 'scanned'] as const) {
    await s.setProps({ status })
    expect(s.w.element.querySelector('svg[role="img"]')).toBeNull()
    expect(s.w.element.getBoundingClientRect().height).toBe(initial.height)
    await expect(s.api.toBlob()).rejects.toThrow('No active QR code')
    if (status === 'expired') {
      await userEvent.click(s.w.element.querySelector('button')!)
      expect(s.emitted.refresh).toHaveBeenCalledTimes(1)
      expect(s.w.element.getAttribute('data-state')).toBe('expired')
    }
  }
  await s.setProps({ status: 'active' })
  expect(await decode(await s.api.toBlob())).toBe(value)
  expect(
    (await axe.run(s.w.element, { rules: { region: { enabled: false } } })).violations,
  ).toEqual([])
})

it('handles empty and oversized data, recovers after edits and exposes custom status actions', async () => {
  const s = await setup({
    value: '',
    renderStatus: ({ status, refresh, error }) => (
      <button onClick={refresh}>{`${status}/${!!error}`}</button>
    ),
  })
  expect(s.w.element.textContent).toBe('empty/false')
  await s.setProps({ value: 'a'.repeat(4000) })
  expect(s.w.element.getAttribute('data-state')).toBe('error')
  expect(s.w.element.textContent).toBe('error/true')
  expect(s.emitted.error).toHaveBeenCalledTimes(1)
  await userEvent.click(s.w.element.querySelector('button')!)
  expect(s.emitted.refresh).toHaveBeenCalledTimes(1)
  await s.setProps({ value })
  expect(await decode(await s.api.toBlob())).toBe(value)
})

it('shrinks within narrow containers and retains SSR geometry and SVG nodes during hydration', async () => {
  const render = () => <QRCode value={value} size={192} label="Documentation QR" />
  const host = document.createElement('div')
  host.style.width = '128px'
  host.innerHTML = renderToString(render())
  document.body.append(host)
  const root = host.firstElementChild!
  const svg = host.querySelector('svg')!
  const path = host.querySelector('path')!.getAttribute('d')
  expect(root.getBoundingClientRect().width).toBe(128)
  expect(root.getBoundingClientRect().height).toBe(128)
  const error = vi.spyOn(console, 'error')
  const warn = vi.spyOn(console, 'warn')
  const app = await hydrate(host, render())
  try {
    expect(host.querySelector('svg')).toBe(svg)
    expect(svg.querySelector('path')!.getAttribute('d')).toBe(path)
    expect(root.getBoundingClientRect().height).toBe(128)
    expect(error).not.toHaveBeenCalled()
    expect(warn).not.toHaveBeenCalled()
  } finally {
    app.unmount()
  }
})
