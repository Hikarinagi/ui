import { createApp, type VNode } from 'vue'
import type { ReactElement } from 'react'
import { page } from 'vitest/browser'
import { createRoot } from 'react-dom/client'
import { flushSync } from 'react-dom'

export interface LiveCase {
  name: string
  vue: () => VNode
  react: () => ReactElement
  viewport?: { width: number; height: number }
  interact?: (container: HTMLElement) => Promise<void> | void
  settle: () => Promise<void> | void
  ignoreAttributes?: string[]
  reason?: string
}

export interface LiveSuite {
  component: string
  cases: LiveCase[]
}

export function defineLiveCases(component: string, cases: LiveCase[]): LiveSuite {
  for (const entry of cases)
    if (entry.ignoreAttributes?.length && !entry.reason)
      throw new Error(`${component} / ${entry.name}: ignored attributes need a reason`)
  return { component, cases }
}

function frame() {
  return new Promise<void>(resolve => requestAnimationFrame(() => resolve()))
}

export async function frames(count = 3) {
  for (let i = 0; i < count; i++) await frame()
}

const SCROLLBAR_MEASUREMENTS = ['--os-viewport-percent', '--os-scroll-percent']

function unrendered(element: Element) {
  const rect = element.getBoundingClientRect()
  return rect.width === 0 && rect.height === 0
}

function serializedBody() {
  const hidden = [...document.querySelectorAll('[data-overlayscrollbars="host"]')].filter(
    unrendered,
  )
  const marks = hidden.map((host, index) => {
    host.setAttribute('data-parity-unrendered', String(index))
    return host
  })
  const copy = document.body.cloneNode(true) as HTMLElement
  for (const host of marks) host.removeAttribute('data-parity-unrendered')
  for (const scrollbar of copy.querySelectorAll('.os-scrollbar'))
    scrollbar.classList.remove('os-scrollbar-auto-hide-hidden')
  for (const host of copy.querySelectorAll('[data-parity-unrendered]')) {
    host.removeAttribute('data-parity-unrendered')
    for (const scrollbar of host.querySelectorAll<HTMLElement>(':scope > .os-scrollbar')) {
      scrollbar.classList.remove('os-scrollbar-unusable')
      for (const name of SCROLLBAR_MEASUREMENTS) scrollbar.style.removeProperty(name)
    }
  }
  return copy.innerHTML
}

function snapshot() {
  const root = document.documentElement.getAttribute('style') ?? ''
  const body = [...document.body.attributes]
    .map(attribute => `${attribute.name}="${attribute.value}"`)
    .join(' ')
  return `<html-root style="${root}"></html-root><body-root ${body}></body-root>${serializedBody()}`
}

async function stableSnapshot() {
  let previous = snapshot()
  for (let attempt = 0; attempt < 30; attempt += 1) {
    await frames(2)
    const current = snapshot()
    if (current === previous) return current
    previous = current
  }
  return previous
}

function reset() {
  document.body.innerHTML = ''
  document.body.removeAttribute('style')
  document.documentElement.removeAttribute('style')
}

function resetFocus() {
  if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
  ;(window.frameElement as HTMLElement | null)?.focus()
  window.focus()
}

export const LIVE_VIEWPORT = { width: 414, height: 896 }

async function host({ viewport = LIVE_VIEWPORT }: LiveCase) {
  await page.viewport(viewport.width, viewport.height)
  reset()
  resetFocus()
  const container = document.createElement('div')
  container.id = 'parity-host'
  document.body.appendChild(container)
  return container
}

export async function liveVue(entry: LiveCase) {
  const container = await host(entry)
  const app = createApp({ render: entry.vue })
  app.mount(container)
  await frames()
  await entry.interact?.(container)
  await entry.settle()
  const html = await stableSnapshot()
  app.unmount()
  await frames()
  reset()
  return html
}

export async function liveReact(entry: LiveCase) {
  const container = await host(entry)
  const root = createRoot(container)
  flushSync(() => root.render(entry.react()))
  await frames()
  await entry.interact?.(container)
  await entry.settle()
  const html = await stableSnapshot()
  root.unmount()
  await frames()
  reset()
  return html
}
