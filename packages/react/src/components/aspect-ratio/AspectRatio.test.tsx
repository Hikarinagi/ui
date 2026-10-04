import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import { AspectRatio } from './AspectRatio'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(cleanup)

describe('渲染', () => {
  it('默认 16:9,经 reka 的 padding-bottom 机制成比例;class 落在自持外壳上', () => {
    const element = render(
      <AspectRatio className="w-40">
        <div>内容</div>
      </AspectRatio>,
    ).container.firstElementChild as HTMLElement
    expect([...element.classList]).toContain('w-40')
    const wrapper = element.firstElementChild as HTMLElement
    expect(wrapper.style.paddingBottom).toBe(`${(9 / 16) * 100}%`)
  })

  it('ratio 可覆写', () => {
    const element = render(
      <AspectRatio ratio={1}>
        <div>方</div>
      </AspectRatio>,
    ).container.firstElementChild as HTMLElement
    expect((element.firstElementChild as HTMLElement).style.paddingBottom).toBe('100%')
  })
})

describe('a11y', () => {
  it('无 a11y 违规', async () => {
    const element = render(
      <AspectRatio>
        <p>内容</p>
      </AspectRatio>,
    ).container.firstElementChild as HTMLElement
    await expectNoA11yViolations(element)
  })
})
