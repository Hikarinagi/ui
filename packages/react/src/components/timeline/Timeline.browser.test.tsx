import { describe, expect, it } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { Timeline } from './Timeline'
import type { TimelineAlign, TimelineOrientation } from './types'
import { mount } from '../../../test/mount'
import '../../../test/browser.css'

const items = [
  { id: 'a', title: 'Short', description: 'Description', time: '09:00' },
  {
    id: 'b',
    title: 'A title with many words that wraps across lines',
    description: 'Long content '.repeat(14),
    time: '09:20',
  },
  { id: 'c', title: 'UnbrokenTitle'.repeat(8), time: '09:40' },
]

function rect(element: Element) {
  return element.getBoundingClientRect()
}
function centerX(element: Element) {
  const box = rect(element)
  return box.x + box.width / 2
}
function centerY(element: Element) {
  const box = rect(element)
  return box.y + box.height / 2
}

describe('Timeline layout', () => {
  const cases = (['vertical', 'horizontal'] as TimelineOrientation[]).flatMap(orientation =>
    (['start', 'end', 'alternate'] as TimelineAlign[]).flatMap(align =>
      (['ltr', 'rtl'] as const).map(dir => ({ orientation, align, dir })),
    ),
  )

  it.each(cases)(
    'aligns markers and connectors with wrapped content ($orientation / $align / $dir)',
    async ({ orientation, align, dir }) => {
      await page.viewport(900, 900)
      const wrapper = await mount(
        <Timeline
          items={items}
          orientation={orientation}
          align={align}
          timePosition="opposite"
          dir={dir}
          style={{ width: '600px' }}
        />,
      )
      const rows = [...wrapper.element.querySelectorAll('li')]
      const markers = rows.map(row => row.querySelector('.hn-timeline-marker')!)
      const content = rows.map(row => row.querySelector('.hn-timeline-content')!)
      const opposite = rows.map(row => row.querySelector('.hn-timeline-opposite')!)
      const root = rect(wrapper.element)
      expect(wrapper.element.scrollWidth).toBeLessThanOrEqual(601)
      for (let index = 0; index < rows.length; index++) {
        const flipped = align === 'end' || (align === 'alternate' && index % 2 === 1)
        expect(rect(content[index]!).left).toBeGreaterThanOrEqual(root.left - 1)
        expect(rect(content[index]!).right).toBeLessThanOrEqual(root.right + 1)
        if (orientation === 'vertical') {
          expect(Math.abs(centerX(markers[index]!) - centerX(markers[0]!))).toBeLessThan(1)
          const contentAfter = centerX(content[index]!) > centerX(markers[index]!)
          expect(contentAfter).toBe(flipped === (dir === 'rtl'))
          expect(centerX(opposite[index]!) > centerX(markers[index]!)).toBe(!contentAfter)
          if (index < rows.length - 1) {
            const line = rows[index]!.querySelector('.hn-timeline-connector')!
            expect(Math.abs(centerX(line) - centerX(markers[index]!))).toBeLessThan(1)
            expect(rect(line).bottom).toBeGreaterThan(rect(content[index]!).bottom - 10)
            expect(rect(line).bottom).toBeLessThanOrEqual(rect(markers[index + 1]!).top)
            expect(rect(content[index + 1]!).top).toBeGreaterThanOrEqual(
              rect(content[index]!).bottom,
            )
          }
        } else {
          expect(Math.abs(centerY(markers[index]!) - centerY(markers[0]!))).toBeLessThan(1)
          expect(centerY(content[index]!) > centerY(markers[index]!)).toBe(!flipped)
          expect(centerY(opposite[index]!) > centerY(markers[index]!)).toBe(flipped)
          if (index < rows.length - 1) {
            const line = rows[index]!.querySelector('.hn-timeline-connector')!
            expect(Math.abs(centerY(line) - centerY(markers[index]!))).toBeLessThan(1)
            expect(rect(line).width).toBeGreaterThan(150)
            expect(centerX(markers[index + 1]!) > centerX(markers[index]!)).toBe(dir === 'ltr')
          }
        }
      }
    },
  )

  it.each(['vertical', 'horizontal'] as const)(
    'keeps differently sized custom markers on the same axis (%s)',
    async orientation => {
      const wrapper = await mount(
        <Timeline
          items={items}
          orientation={orientation}
          style={{ width: '600px' }}
          renderMarker={({ index }) => (
            <span style={{ width: `${(index + 1) * 16}px`, height: `${(index + 1) * 16}px` }}>
              {String(index)}
            </span>
          )}
        />,
      )
      const markers = [...wrapper.element.querySelectorAll('.hn-timeline-marker')]
      const axis = orientation === 'vertical' ? centerX : centerY
      expect(Math.abs(axis(markers[0]!) - axis(markers[2]!))).toBeLessThan(1)
      for (const line of wrapper.element.querySelectorAll('.hn-timeline-connector'))
        expect(Math.abs(axis(line) - axis(markers[0]!))).toBeLessThan(1)
    },
  )

  it('fits a narrow container and leaves links keyboard accessible', async () => {
    const wrapper = await mount(
      <Timeline
        items={items}
        align="alternate"
        style={{ width: '280px' }}
        renderDescription={() => <a href="#details">Open details</a>}
      />,
    )
    expect(wrapper.element.scrollWidth).toBeLessThanOrEqual(280)
    await userEvent.tab()
    expect(document.activeElement).toBe(wrapper.element.querySelector('a'))
  })

  it('uses density spacing and lets callers override root layout classes', async () => {
    const wrapper = await mount(<Timeline items={items} className="w-72" />)
    expect(rect(wrapper.element).width).toBe(288)
    const content = wrapper.element.querySelector('.hn-timeline-content')!
    const comfortable = parseFloat(getComputedStyle(content).paddingBottom)
    wrapper.element.setAttribute('data-density', 'compact')
    expect(parseFloat(getComputedStyle(content).paddingBottom)).toBeLessThan(comfortable)
  })
})
