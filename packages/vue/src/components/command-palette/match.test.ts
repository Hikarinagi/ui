import { describe, expect, it } from 'vitest'
import type { CommandItems } from './types'
import { filterCommands } from './utils/match'
import { matchesHotkey, parseHotkey } from './utils/hotkey'

const items: CommandItems = [
  {
    label: '页面',
    items: [
      { id: 'home', label: '首页', keywords: ['home'] },
      { id: 'settings', label: '设置', description: '账号与偏好' },
      { id: 'theme-settings', label: '主题设置' },
    ],
  },
  { id: 'theme', label: '切换主题' },
]

describe('filterCommands', () => {
  it('空查询保留全部分组与顺序，不标记匹配片段', () => {
    const sections = filterCommands(items, '')
    expect(sections.map(section => section.label)).toEqual(['页面', undefined])
    expect(sections[0]!.matches.map(match => match.item.id)).toEqual([
      'home',
      'settings',
      'theme-settings',
    ])
    expect(sections[0]!.matches[0]!.start).toBe(-1)
  })

  it('按标签全等、前缀、包含、关键词、说明的顺序排名，并给出标签中的匹配片段', () => {
    const sections = filterCommands(items, '设置')
    expect(sections).toHaveLength(1)
    expect(sections[0]!.matches.map(match => match.item.id)).toEqual(['settings', 'theme-settings'])
    expect(sections[0]!.matches[1]).toMatchObject({ start: 2, end: 4 })
    expect(filterCommands(items, 'HOME')[0]!.matches[0]!.item.id).toBe('home')
    expect(filterCommands(items, '偏好')[0]!.matches[0]!.item.id).toBe('settings')
  })

  it('没有匹配的分组被丢弃，全部无匹配时返回空数组', () => {
    expect(filterCommands(items, '主题').map(section => section.label)).toEqual(['页面', undefined])
    expect(filterCommands(items, '不存在')).toEqual([])
  })

  it('有查询时，含最佳匹配的分组排在前面；关键词全等高于关键词包含与说明', () => {
    const grouped: CommandItems = [
      {
        label: '浮层',
        items: [
          { id: 'drawer', label: 'Drawer', description: '从屏幕边缘滑入的模态面板' },
          { id: 'sheet', label: 'Sheet', keywords: ['底部面板'] },
        ],
      },
      { label: '展示', items: [{ id: 'panel', label: 'Panel', keywords: ['面板'] }] },
    ]
    const sections = filterCommands(grouped, '面板')
    expect(sections.map(section => section.label)).toEqual(['展示', '浮层'])
    expect(sections[1]!.matches.map(match => match.item.id)).toEqual(['sheet', 'drawer'])
    expect(filterCommands(grouped, '').map(section => section.label)).toEqual(['浮层', '展示'])
  })
})

describe('hotkey', () => {
  it('解析 mod、shift、alt 与按键', () => {
    expect(parseHotkey('mod+k')).toEqual({ key: 'k', mod: true, shift: false, alt: false })
    expect(parseHotkey('Mod + Shift + P')).toEqual({ key: 'p', mod: true, shift: true, alt: false })
  })

  it('mod 同时接受 Meta 与 Ctrl，修饰键必须完全一致', () => {
    const hotkey = parseHotkey('mod+k')
    expect(matchesHotkey(new KeyboardEvent('keydown', { key: 'k', metaKey: true }), hotkey)).toBe(
      true,
    )
    expect(matchesHotkey(new KeyboardEvent('keydown', { key: 'K', ctrlKey: true }), hotkey)).toBe(
      true,
    )
    expect(matchesHotkey(new KeyboardEvent('keydown', { key: 'k' }), hotkey)).toBe(false)
    expect(
      matchesHotkey(
        new KeyboardEvent('keydown', { key: 'k', metaKey: true, shiftKey: true }),
        hotkey,
      ),
    ).toBe(false)
  })
})
