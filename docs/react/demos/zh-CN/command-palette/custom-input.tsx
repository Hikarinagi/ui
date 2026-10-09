import { CommandPalette, CommandPaletteInput, Inline, Tag, type CommandItems } from '@hina-ui/react'

const items: CommandItems = [
  { id: 'spice', label: '狼与香辛料', description: '支仓冻砂' },
  { id: 'kino', label: '奇诺之旅', description: '时雨泽惠一' },
  { id: 'hyouka', label: '冰菓', description: '米泽穗信' },
  { id: 'book-girl', label: '文学少女', description: '野村美月' },
]

export default function Demo() {
  return (
    <CommandPalette
      inline
      items={items}
      className="max-w-sm"
      input={
        <Inline gap="sm" wrap={false} className="border-line h-12 shrink-0 border-b px-4">
          <Tag>书库</Tag>
          <CommandPaletteInput placeholder="在书库中搜索" />
        </Inline>
      }
    />
  )
}
