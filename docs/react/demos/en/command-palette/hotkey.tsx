import { Button, CommandPalette, Inline, Kbd, Text, type CommandItems } from '@hina-ui/react'

const items: CommandItems = [
  { id: 'home', label: 'Home' },
  { id: 'library', label: 'Library' },
  { id: 'settings', label: 'Settings' },
]

export default function Demo() {
  return (
    <Inline gap="md" align="center">
      <CommandPalette items={items} hotkey="mod+shift+p">
        <Button variant="outline" tone="neutral">
          Search
        </Button>
      </CommandPalette>
      <Text size="sm" tone="muted">
        Or press
        <Kbd>⌘</Kbd>
        <Kbd>⇧</Kbd>
        <Kbd>P</Kbd>
      </Text>
    </Inline>
  )
}
