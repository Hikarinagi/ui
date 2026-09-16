import { afterEach, describe, expect, it } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref } from 'vue'
import Timeline from './Timeline.vue'
import type { TimelineItem, TimelineSlotProps } from './types'
import { expectNoA11yViolations } from '../../../test/axe'

const wrappers: VueWrapper[] = []
afterEach(() => wrappers.splice(0).forEach(wrapper => wrapper.unmount()))

const items: TimelineItem[] = [
  {
    id: 'a',
    title: 'First',
    description: 'First description',
    time: '09:00',
    dateTime: '2026-09-16T09:00:00Z',
  },
  { id: 'b', title: 'Second', time: 'Yesterday', tone: 'success' },
  { id: 'c', title: 'Third' },
]

describe('Timeline', () => {
  it('renders an accessible ordered list, machine-readable dates and decorative markers', async () => {
    const wrapper = mount(Timeline, {
      attachTo: document.body,
      props: { items },
      attrs: { 'aria-label': 'Changes', dir: 'rtl' },
    })
    wrappers.push(wrapper)
    expect(wrapper.element.tagName).toBe('OL')
    expect(wrapper.attributes('aria-label')).toBe('Changes')
    expect(wrapper.attributes('dir')).toBe('rtl')
    expect(wrapper.findAll('li')).toHaveLength(3)
    expect(wrapper.find('time').attributes('datetime')).toBe(items[0]!.dateTime)
    expect(wrapper.findAll('time')).toHaveLength(1)
    expect(wrapper.findAll('.hn-timeline-connector')).toHaveLength(2)
    expect(
      wrapper
        .findAll('.hn-timeline-separator')
        .every(node => node.attributes('aria-hidden') === 'true'),
    ).toBe(true)
    expect(wrapper.find('[tabindex]').exists()).toBe(false)
    await expectNoA11yViolations(wrapper.element)
  })

  it('reverses DOM order without mutating data and reuses keyed content', async () => {
    const wrapper = mount(Timeline, { props: { items } })
    wrappers.push(wrapper)
    const first = wrapper.find('li').element
    await wrapper.setProps({ reverse: true })
    const rows = wrapper.findAll('li')
    expect(rows.map(row => row.find('.font-medium').text())).toEqual(['Third', 'Second', 'First'])
    expect(rows[2]!.element).toBe(first)
    expect(rows[2]!.find('.hn-timeline-connector').exists()).toBe(false)
    expect(items[0]!.id).toBe('a')
  })

  it('handles empty, singleton and dynamically appended items without a dangling connector', async () => {
    const wrapper = mount(Timeline, { props: { items: [] as TimelineItem[] } })
    wrappers.push(wrapper)
    expect(wrapper.find('li').exists()).toBe(false)
    await wrapper.setProps({ items: items.slice(0, 1) })
    expect(wrapper.find('.hn-timeline-connector').exists()).toBe(false)
    await wrapper.setProps({ items })
    expect(wrapper.findAll('.hn-timeline-connector')).toHaveLength(2)
    await wrapper.setProps({ items: items.slice(1, 2) })
    expect(wrapper.find('.hn-timeline-connector').exists()).toBe(false)
  })

  it('moves time labels to the opposite region without duplicating them', async () => {
    const wrapper = mount(Timeline, { props: { items } })
    wrappers.push(wrapper)
    expect(wrapper.find('.hn-timeline-opposite').exists()).toBe(false)
    await wrapper.setProps({ timePosition: 'opposite' })
    expect(wrapper.find('.hn-timeline-opposite time').text()).toBe('09:00')
    expect(wrapper.find('.hn-timeline-content time').exists()).toBe(false)
    expect(wrapper.findAll('time')).toHaveLength(1)
    await wrapper.setProps({ items: [{ title: 'No time' }] })
    expect(wrapper.find('.hn-timeline-opposite').exists()).toBe(false)
  })

  it('preserves custom item fields in every slot and gives opposite content priority', async () => {
    const custom = [{ id: 'a', title: 'Default', author: 'Hina', time: 'Hidden time' }]
    type Item = (typeof custom)[number]
    const scope = ({ item, index }: TimelineSlotProps<Item>) => `${item.author}:${index}`
    const wrapper = mount(Timeline<Item>, {
      props: { items: custom, timePosition: 'opposite' },
      slots: {
        marker: props => h('span', { 'data-marker': '' }, scope(props)),
        title: props => h('strong', scope(props)),
        description: props => h('a', { href: '#details' }, scope(props)),
        opposite: props => h('span', { 'data-opposite': '' }, scope(props)),
        time: () => h('span', 'Overridden time'),
      },
    })
    wrappers.push(wrapper)
    expect(wrapper.find('[data-marker]').text()).toBe('Hina:0')
    expect(wrapper.find('strong').text()).toBe('Hina:0')
    expect(wrapper.find('a').text()).toBe('Hina:0')
    expect(wrapper.find('.hn-timeline-opposite [data-opposite]').text()).toBe('Hina:0')
    expect(wrapper.text()).not.toContain('Overridden time')
    expect(wrapper.text()).not.toContain('Hidden time')
    await wrapper.setProps({ timePosition: 'content' })
    expect(wrapper.find('.hn-timeline-content').text()).toContain('Overridden time')
  })

  it('lets content replace all defaults and reports indexes in displayed order', () => {
    const wrapper = mount(Timeline, {
      props: { items, reverse: true },
      slots: {
        content: ({ item, index }: TimelineSlotProps) => h('button', `${index}:${item.id}`),
      },
    })
    wrappers.push(wrapper)
    expect(wrapper.findAll('button').map(button => button.text())).toEqual(['0:c', '1:b', '2:a'])
    expect(wrapper.find('time').exists()).toBe(false)
    expect(wrapper.text()).not.toContain('First description')
  })

  it('adds and removes the opposite region when a conditional slot changes', async () => {
    const show = ref(false)
    const wrapper = mount(
      defineComponent({
        setup: () => () =>
          h(Timeline, { items }, show.value ? { opposite: () => h('span', 'Extra') } : {}),
      }),
    )
    wrappers.push(wrapper)
    expect(wrapper.find('.hn-timeline-opposite').exists()).toBe(false)
    show.value = true
    await nextTick()
    expect(wrapper.find('.hn-timeline-opposite').text()).toBe('Extra')
    show.value = false
    await nextTick()
    expect(wrapper.find('.hn-timeline-opposite').exists()).toBe(false)
  })
})
