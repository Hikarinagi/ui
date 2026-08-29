import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import SimpleGrid from './SimpleGrid.vue'
import '../../../test/browser.css'

beforeEach(() => {
  document.body.innerHTML = ''
})

function hostWidth(px: number) {
  const host = document.createElement('div')
  host.style.width = `${px}px`
  document.body.appendChild(host)
  return host
}

const kids = () => [h('p', '甲'), h('p', '乙'), h('p', '丙')]

describe('simple grid 按容器宽自动成列', () => {
  it('500px 容器 + 200px 最小列宽 = 2 列;auto-fit 时 3 个子项撑满', () => {
    const filled = mount(SimpleGrid, {
      props: { min: '200px' },
      slots: { default: kids },
      attachTo: hostWidth(500),
    })
    const tracks = getComputedStyle(filled.element).gridTemplateColumns.split(' ')
    expect(tracks.length).toBe(2)

    const narrow = mount(SimpleGrid, {
      props: { min: '100px' },
      slots: { default: kids },
      attachTo: hostWidth(500),
    })
    expect(getComputedStyle(narrow.element).gridTemplateColumns.split(' ').length).toBe(4)
  })
})
