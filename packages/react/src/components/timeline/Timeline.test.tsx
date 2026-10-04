import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import { Timeline } from './Timeline'
import type { TimelineItem, TimelineSlotProps } from './types'
import { expectNoA11yViolations } from '../../../test/axe'

afterEach(cleanup)

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
    const { container } = render(<Timeline items={items} aria-label="Changes" dir="rtl" />)
    const element = container.firstElementChild!
    expect(element.tagName).toBe('OL')
    expect(element.getAttribute('aria-label')).toBe('Changes')
    expect(element.getAttribute('dir')).toBe('rtl')
    expect(element.querySelectorAll('li')).toHaveLength(3)
    expect(element.querySelector('time')!.getAttribute('datetime')).toBe(items[0]!.dateTime)
    expect(element.querySelectorAll('time')).toHaveLength(1)
    expect(element.querySelectorAll('.hn-timeline-connector')).toHaveLength(2)
    expect(
      [...element.querySelectorAll('.hn-timeline-separator')].every(
        node => node.getAttribute('aria-hidden') === 'true',
      ),
    ).toBe(true)
    expect(element.querySelector('[tabindex]')).toBeNull()
    await expectNoA11yViolations(element)
  })

  it('reverses DOM order without mutating data and reuses keyed content', () => {
    const { container, rerender } = render(<Timeline items={items} />)
    const first = container.querySelector('li')
    rerender(<Timeline items={items} reverse />)
    const rows = [...container.querySelectorAll('li')]
    expect(rows.map(row => row.querySelector('.font-medium')!.textContent)).toEqual([
      'Third',
      'Second',
      'First',
    ])
    expect(rows[2]).toBe(first)
    expect(rows[2]!.querySelector('.hn-timeline-connector')).toBeNull()
    expect(items[0]!.id).toBe('a')
  })

  it('handles empty, singleton and dynamically appended items without a dangling connector', () => {
    const { container, rerender } = render(<Timeline items={[] as TimelineItem[]} />)
    expect(container.querySelector('li')).toBeNull()
    rerender(<Timeline items={items.slice(0, 1)} />)
    expect(container.querySelector('.hn-timeline-connector')).toBeNull()
    rerender(<Timeline items={items} />)
    expect(container.querySelectorAll('.hn-timeline-connector')).toHaveLength(2)
    rerender(<Timeline items={items.slice(1, 2)} />)
    expect(container.querySelector('.hn-timeline-connector')).toBeNull()
  })

  it('moves time labels to the opposite region without duplicating them', () => {
    const { container, rerender } = render(<Timeline items={items} />)
    expect(container.querySelector('.hn-timeline-opposite')).toBeNull()
    rerender(<Timeline items={items} timePosition="opposite" />)
    expect(container.querySelector('.hn-timeline-opposite time')!.textContent).toBe('09:00')
    expect(container.querySelector('.hn-timeline-content time')).toBeNull()
    expect(container.querySelectorAll('time')).toHaveLength(1)
    rerender(<Timeline items={[{ title: 'No time' }]} timePosition="opposite" />)
    expect(container.querySelector('.hn-timeline-opposite')).toBeNull()
  })

  it('preserves custom item fields in every slot and gives opposite content priority', () => {
    const custom = [{ id: 'a', title: 'Default', author: 'Hina', time: 'Hidden time' }]
    type Item = (typeof custom)[number]
    const scope = ({ item, index }: TimelineSlotProps<Item>) => `${item.author}:${index}`
    const ui = (timePosition: 'content' | 'opposite') => (
      <Timeline<Item>
        items={custom}
        timePosition={timePosition}
        renderMarker={props => <span data-marker="">{scope(props)}</span>}
        renderTitle={props => <strong>{scope(props)}</strong>}
        renderDescription={props => <a href="#details">{scope(props)}</a>}
        renderOpposite={props => <span data-opposite="">{scope(props)}</span>}
        renderTime={() => <span>Overridden time</span>}
      />
    )
    const { container, rerender } = render(ui('opposite'))
    expect(container.querySelector('[data-marker]')!.textContent).toBe('Hina:0')
    expect(container.querySelector('strong')!.textContent).toBe('Hina:0')
    expect(container.querySelector('a')!.textContent).toBe('Hina:0')
    expect(container.querySelector('.hn-timeline-opposite [data-opposite]')!.textContent).toBe(
      'Hina:0',
    )
    expect(container.textContent).not.toContain('Overridden time')
    expect(container.textContent).not.toContain('Hidden time')
    rerender(ui('content'))
    expect(container.querySelector('.hn-timeline-content')!.textContent).toContain(
      'Overridden time',
    )
  })

  it('lets content replace all defaults and reports indexes in displayed order', () => {
    const { container } = render(
      <Timeline
        items={items}
        reverse
        renderContent={({ item, index }: TimelineSlotProps) => (
          <button>{`${index}:${item.id}`}</button>
        )}
      />,
    )
    expect([...container.querySelectorAll('button')].map(button => button.textContent)).toEqual([
      '0:c',
      '1:b',
      '2:a',
    ])
    expect(container.querySelector('time')).toBeNull()
    expect(container.textContent).not.toContain('First description')
  })

  it('adds and removes the opposite region when a conditional slot changes', () => {
    const ui = (show: boolean) => (
      <Timeline items={items} renderOpposite={show ? () => <span>Extra</span> : undefined} />
    )
    const { container, rerender } = render(ui(false))
    expect(container.querySelector('.hn-timeline-opposite')).toBeNull()
    rerender(ui(true))
    expect(container.querySelector('.hn-timeline-opposite')!.textContent).toBe('Extra')
    rerender(ui(false))
    expect(container.querySelector('.hn-timeline-opposite')).toBeNull()
  })
})
