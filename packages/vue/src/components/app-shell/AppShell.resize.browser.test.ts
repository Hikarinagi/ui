import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { page } from 'vitest/browser'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref, shallowRef } from 'vue'
import AppShell from './AppShell.vue'
import Sidebar from '../sidebar/Sidebar.vue'
import type { SidebarState } from '../sidebar/context'
import '../../../test/browser.css'

const mounted: VueWrapper[] = []

beforeEach(async () => {
  await page.viewport(1280, 800)
})

afterEach(() => {
  mounted.splice(0).forEach(wrapper => wrapper.unmount())
  vi.restoreAllMocks()
  document.body.innerHTML = ''
})

async function harness(count = 80) {
  const state = ref<SidebarState>('expanded')
  const rows = ref(count)
  const showSidebar = ref(true)
  const shell = shallowRef<InstanceType<typeof AppShell>>()
  const stable = vi.fn()
  const wrapper = mount(
    defineComponent({
      setup: () => () =>
        h(
          AppShell,
          { ref: shell, sidebar: state.value, onSizeStable: stable },
          {
            sidebar: showSidebar.value
              ? () =>
                  h(Sidebar, {}, () =>
                    h(
                      'div',
                      { 'data-child': '', style: 'width: 100px; transition: width 0.1s' },
                      'Navigation',
                    ),
                  )
              : undefined,
            default: () =>
              h(
                'div',
                {},
                Array.from({ length: rows.value }, (_, index) =>
                  h('section', { key: index, class: 'flex h-12 items-center gap-2' }, [
                    h('label', { for: `field-${index}` }, `Field ${index}`),
                    h('input', { id: `field-${index}`, value: `Value ${index}` }),
                    ...Array.from({ length: 7 }, (_, item) => h('span', `Text ${item}`)),
                  ]),
                ),
              ),
          },
        ),
    }),
    { attachTo: document.body },
  )
  mounted.push(wrapper)
  await vi.waitFor(() => expect(shell.value?.mainArea?.instance).toBeTruthy())
  const instance = shell.value!.mainArea!.instance!
  const viewport = instance.elements().viewport
  const sidebar = document.querySelector('aside')!
  return { state, rows, showSidebar, wrapper, instance, viewport, sidebar, stable }
}

async function settled(
  instance: Awaited<ReturnType<typeof harness>>['instance'],
  sidebar: HTMLElement,
  width: number,
) {
  await vi.waitFor(() => {
    if (width === 0) expect(sidebar.getBoundingClientRect().width).toBeLessThanOrEqual(1)
    else expect(sidebar.getBoundingClientRect().width).toBe(width)
    expect(instance.state().sleeping).toBe(false)
  })
}

describe('AppShell sidebar resize updates', () => {
  it('suspends before the sidebar changes layout without reading animation geometry', async () => {
    const { state, instance, sidebar, stable } = await harness()
    const animations = vi.spyOn(sidebar, 'getAnimations')
    state.value = 'rail'
    await nextTick()
    expect(instance.state().sleeping).toBe(true)
    await settled(instance, sidebar, 56)
    await vi.waitFor(() => expect(stable).toHaveBeenCalledTimes(1))
    expect(animations).not.toHaveBeenCalled()
  })
  it('keeps the main area inside the shell throughout the existing width transition', async () => {
    const { state, sidebar, viewport, stable } = await harness()
    const before = viewport.getBoundingClientRect()
    const samples: DOMRect[] = []
    let done = false
    const sample = () => {
      samples.push(viewport.getBoundingClientRect())
      if (!done) requestAnimationFrame(sample)
    }
    requestAnimationFrame(sample)
    state.value = 'rail'
    await vi.waitFor(() => expect(stable).toHaveBeenCalledTimes(1))
    done = true
    const after = viewport.getBoundingClientRect()
    expect(sidebar.getBoundingClientRect().width).toBe(56)
    expect(after.width - before.width).toBe(200)
    expect(samples.some(rect => rect.width > before.width && rect.width < after.width)).toBe(true)
    for (const rect of samples) expect(rect.right).toBeCloseTo(before.right, 1)
    expect(getComputedStyle(viewport).transform).toBe('none')
    expect(getComputedStyle(viewport.closest('main')!).transform).toBe('none')
  })

  it('notifies consumers once for instant changes and once after a reversed transition settles', async () => {
    const { state, sidebar, stable } = await harness()
    sidebar.style.transition = 'none'
    state.value = 'rail'
    await vi.waitFor(() => expect(stable).toHaveBeenCalledTimes(1))
    sidebar.style.transition = ''
    state.value = 'expanded'
    await vi.waitFor(() => expect(sidebar.getBoundingClientRect().width).toBeGreaterThan(100))
    state.value = 'rail'
    await vi.waitFor(() => expect(stable).toHaveBeenCalledTimes(2))
    expect(sidebar.getBoundingClientRect().width).toBe(56)
  })

  it('batches repeated measurements on a large main subtree while keeping native scrolling available', async () => {
    const { state, rows, instance, viewport, sidebar } = await harness(320)
    const updates = vi.fn()
    instance.on('updated', updates)
    const before = viewport.clientWidth
    state.value = 'rail'
    await vi.waitFor(() => expect(instance.state().sleeping).toBe(true))
    const during = updates.mock.calls.length
    rows.value += 40
    await nextTick()
    viewport.scrollTop = 400
    expect(viewport.scrollTop).toBe(400)
    await new Promise(requestAnimationFrame)
    expect(updates).toHaveBeenCalledTimes(during)
    await settled(instance, sidebar, 56)
    expect(viewport.clientWidth).toBe(before + 200)
    expect(viewport.scrollTop).toBe(400)
    expect(instance.state().overflowAmount.y).toBe(viewport.scrollHeight - viewport.clientHeight)
    expect(updates.mock.calls.length).toBeGreaterThan(during)
    expect(updates.mock.calls.length).toBeLessThanOrEqual(6)
    instance.off('updated', updates)
  })

  it('resumes after an interrupted reversal and a transition to hidden', async () => {
    const { state, instance, sidebar } = await harness()
    state.value = 'rail'
    await vi.waitFor(() => expect(sidebar.getBoundingClientRect().width).toBeLessThan(180))
    expect(instance.state().sleeping).toBe(true)
    state.value = 'expanded'
    await settled(instance, sidebar, 256)
    state.value = 'hidden'
    await vi.waitFor(() => expect(instance.state().sleeping).toBe(true))
    await settled(instance, sidebar, 0)
    state.value = 'expanded'
    await settled(instance, sidebar, 256)
  })

  it('resumes when the sidebar is removed before its transition finishes', async () => {
    const { state, rows, showSidebar, instance, viewport } = await harness()
    state.value = 'rail'
    await vi.waitFor(() => expect(instance.state().sleeping).toBe(true))
    showSidebar.value = false
    await vi.waitFor(() => {
      expect(document.querySelector('aside')).toBeNull()
      expect(instance.state().sleeping).toBe(false)
    })
    rows.value += 20
    await vi.waitFor(() =>
      expect(instance.state().overflowAmount.y).toBe(viewport.scrollHeight - viewport.clientHeight),
    )
  })

  it('resumes when an animated change is replaced with an instant change', async () => {
    const { state, instance, sidebar, stable } = await harness()
    state.value = 'rail'
    await vi.waitFor(() => expect(instance.state().sleeping).toBe(true))
    sidebar.style.transition = 'none'
    state.value = 'expanded'
    await settled(instance, sidebar, 256)
    await vi.waitFor(() => expect(stable).toHaveBeenCalledTimes(1))
  })

  it('ignores descendant transitions and resumes after an instant sidebar change', async () => {
    const { state, instance, sidebar } = await harness()
    const sleep = vi.spyOn(instance, 'sleep')
    const child = sidebar.querySelector('[data-child]') as HTMLElement
    child.getBoundingClientRect()
    child.style.width = '50px'
    await vi.waitFor(() => expect(child.getBoundingClientRect().width).toBe(50))
    expect(sleep).not.toHaveBeenCalled()
    sidebar.style.transition = 'none'
    state.value = 'rail'
    await settled(instance, sidebar, 56)
    expect(sleep).toHaveBeenLastCalledWith(false)
  })

  it('preserves an instance already paused by its caller and cleans up on unmount', async () => {
    const { state, instance, wrapper, sidebar } = await harness()
    instance.sleep(true)
    state.value = 'rail'
    await vi.waitFor(() => expect(sidebar.getBoundingClientRect().width).toBe(56))
    await new Promise(requestAnimationFrame)
    expect(instance.state().sleeping).toBe(true)
    instance.sleep(false)
    state.value = 'expanded'
    await vi.waitFor(() => expect(instance.state().sleeping).toBe(true))
    wrapper.unmount()
    expect(instance.state().destroyed).toBe(true)
    await new Promise(requestAnimationFrame)
  })
})
