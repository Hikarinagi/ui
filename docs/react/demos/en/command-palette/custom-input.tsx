import { CommandPalette, CommandPaletteInput, Inline, Tag, type CommandItems } from '@hina-ui/react'

const items: CommandItems = [
  { id: 'spice', label: 'Spice and Wolf', description: 'Isuna Hasekura' },
  { id: 'kino', label: "Kino's Journey", description: 'Keiichi Sigsawa' },
  { id: 'hyouka', label: 'Hyouka', description: 'Honobu Yonezawa' },
  { id: 'book-girl', label: 'Book Girl', description: 'Mizuki Nomura' },
]

export default function Demo() {
  return (
    <CommandPalette
      inline
      items={items}
      className="max-w-sm"
      input={
        <Inline gap="sm" wrap={false} className="border-line h-12 shrink-0 border-b px-4">
          <Tag>Library</Tag>
          <CommandPaletteInput placeholder="Search the library" />
        </Inline>
      }
    />
  )
}
