import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import type { ReactNode } from 'react'
import { Space } from './Space'

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(cleanup)

const mount = (ui: ReactNode) => render(ui).container.firstElementChild as HTMLElement
const classes = (element: Element) => [...element.classList]

describe('渲染', () => {
  it('默认弹性撑开,aria-hidden', () => {
    const element = mount(<Space />)
    expect(classes(element)).toContain('flex-1')
    expect(classes(element)).toContain('self-stretch')
    expect(element.getAttribute('aria-hidden')).toBe('true')
  })

  it('给 size 后变定长占位,不再弹性', () => {
    const element = mount(<Space size="md" />)
    expect(classes(element)).toContain('size-4')
    expect(classes(element)).not.toContain('flex-1')
  })
})
