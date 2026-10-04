import { describe, expect, it } from 'vitest'
import { List } from './List'
import { ListItem } from './ListItem'
import { Prose } from '../prose/Prose'
import { mount } from '../../../test/mount'
import '../../../test/browser.css'

describe('list 与 prose 列表同源', () => {
  it('无序与有序的缩进、记号、项距、marker 色全部一致 —— hn-list 是唯一来源', async () => {
    const items = () => [<li key="a">甲</li>, <li key="b">乙</li>]
    const ul = await mount(<List>{items()}</List>)
    const ol = await mount(<List ordered>{items()}</List>)
    const prose = await mount(
      <Prose>
        <ul>
          <li>甲</li>
          <li>乙</li>
        </ul>
        <ol>
          <li>甲</li>
          <li>乙</li>
        </ol>
      </Prose>,
    )

    const pairs = [
      [ul.element, prose.element.querySelector('ul')!],
      [ol.element, prose.element.querySelector('ol')!],
    ] as const
    for (const [mine, ref] of pairs) {
      const a = getComputedStyle(mine)
      const b = getComputedStyle(ref)
      expect(a.paddingInlineStart).toBe(b.paddingInlineStart)
      expect(a.listStyleType).toBe(b.listStyleType)

      const secondA = mine.querySelectorAll('li')[1]!
      const secondB = ref.querySelectorAll('li')[1]!
      expect(getComputedStyle(secondA).marginBlockStart).toBe(
        getComputedStyle(secondB).marginBlockStart,
      )
      expect(getComputedStyle(secondA, '::marker').color).toBe(
        getComputedStyle(secondB, '::marker').color,
      )
    }
    expect(getComputedStyle(ul.element).listStyleType).toBe('disc')
    expect(getComputedStyle(ol.element).listStyleType).toBe('decimal')
    expect(getComputedStyle(ul.element.querySelector('li')!, '::marker').color).not.toBe(
      getComputedStyle(ul.element.querySelector('li')!).color,
    )
  })

  it('ListItem 与裸 li 在同一容器下计算样式完全一致 —— 替换是等价的', async () => {
    const raw = await mount(
      <List>
        <li>甲</li>
        <li>乙</li>
      </List>,
    )
    const wrapped = await mount(
      <List>
        <ListItem>甲</ListItem>
        <ListItem>乙</ListItem>
      </List>,
    )

    const secondRaw = raw.element.querySelectorAll('li')[1]!
    const secondWrapped = wrapped.element.querySelectorAll('li')[1]!
    expect(secondWrapped.tagName).toBe('LI')
    expect(getComputedStyle(secondWrapped).marginBlockStart).toBe(
      getComputedStyle(secondRaw).marginBlockStart,
    )
    expect(getComputedStyle(secondWrapped, '::marker').color).toBe(
      getComputedStyle(secondRaw, '::marker').color,
    )
    expect(getComputedStyle(secondWrapped, '::marker').color).not.toBe(
      getComputedStyle(secondWrapped).color,
    )
  })
})
