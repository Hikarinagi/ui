import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import { Page } from './Page'
import { PageHeader } from './PageHeader'
import { PageBody } from './PageBody'
import { PageAside } from './PageAside'
import { Section } from '../section/Section'
import { expectNoA11yViolations } from '../../../test/axe'

afterEach(cleanup)

function harness() {
  return render(
    <Page
      aside={
        <PageAside label="本页目录">
          <p>目录</p>
        </PageAside>
      }
    >
      <PageHeader
        title="Button"
        description="按钮组件的用法与变体。"
        actions={<button>源码</button>}
      />
      <PageBody>
        <Section title="变体" id="variants">
          <p>四种变体</p>
        </Section>
        <Section title="尺寸" id="sizes">
          <p>三档尺寸</p>
        </Section>
      </PageBody>
    </Page>,
  ).container.firstElementChild as HTMLElement
}

describe('页面解剖', () => {
  it('Page = Container 定宽 + 纵向节奏 + 右侧栏行', () => {
    const w = harness()
    expect([...w.classList]).toContain('mx-auto')
    expect([...w.classList]).toContain('max-w-5xl')
    expect([...w.classList]).toContain('py-8')
    expect(w.querySelector('aside')).not.toBeNull()
  })

  it('PageHeader:h1 唯一、描述 muted、actions 靠右;Section 出 h2 且带锚点 id', () => {
    const w = harness()
    const h1s = w.querySelectorAll('h1')
    expect(h1s.length).toBe(1)
    expect(h1s[0]!.textContent).toBe('Button')
    expect(w.querySelector('header')!.textContent).toContain('按钮组件的用法与变体。')
    expect(w.querySelector('header button')!.textContent).toBe('源码')

    const sections = w.querySelectorAll('section')
    expect(sections.length).toBe(2)
    expect(sections[0]!.getAttribute('id')).toBe('variants')
    expect(sections[0]!.querySelector('h2')!.textContent).toBe('变体')
    expect([...sections[0]!.classList].join(' ')).toContain('scroll-mt')
  })

  it('PageAside:xl 以下隐藏、内容 sticky、可带地标名;无 aside 槽则不渲染', () => {
    const w = harness()
    const aside = w.querySelector('aside')!
    const titleId = aside.getAttribute('aria-labelledby')
    expect(titleId).toBeTruthy()
    expect(aside.querySelector(`#${CSS.escape(titleId!)}`)!.textContent).toBe('本页目录')
    expect([...aside.classList]).toContain('hidden')
    expect([...aside.classList]).toContain('xl:block')
    expect((aside.firstElementChild as HTMLElement).className).toContain('sticky')

    const bare = render(
      <Page>
        <p>正文</p>
      </Page>,
    ).container.firstElementChild as HTMLElement
    expect(bare.querySelector('aside')).toBeNull()
  })
})

describe('a11y', () => {
  it('无 a11y 违规', async () => {
    const w = harness()
    await expectNoA11yViolations(w)
  })
})
