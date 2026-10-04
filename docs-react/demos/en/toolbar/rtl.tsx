import { Toolbar, ToolbarButton, ToolbarSeparator, ToolbarLink } from '@hina-ui/react'

export default function Demo() {
  return (
    <Toolbar label="RTL toolbar" dir="rtl" size="sm">
      <ToolbarButton>First</ToolbarButton>
      <ToolbarButton>Second</ToolbarButton>
      <ToolbarSeparator />
      <ToolbarLink href="#api">API</ToolbarLink>
    </Toolbar>
  )
}
