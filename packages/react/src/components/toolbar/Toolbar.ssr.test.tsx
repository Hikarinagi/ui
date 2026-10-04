import { expect, it } from 'vitest'
import { renderToString } from 'react-dom/server'
import {
  Toolbar,
  ToolbarButton,
  ToolbarLink,
  ToolbarToggleGroup,
  ToolbarToggleItem,
  ToolbarSeparator,
} from '../../index'

it('renders all toolbar parts from package exports without browser globals', async () => {
  const html = renderToString(
    <Toolbar label="Tools" dir="rtl" orientation="vertical">
      <ToolbarButton>Action</ToolbarButton>
      <ToolbarSeparator />
      <ToolbarToggleGroup type="multiple" defaultValue={['bold']}>
        <ToolbarToggleItem value="bold">Bold</ToolbarToggleItem>
      </ToolbarToggleGroup>
      <ToolbarLink href="#help">Help</ToolbarLink>
    </Toolbar>,
  )
  expect(html).toContain('role="toolbar"')
  expect(html).toContain('aria-label="Tools"')
  expect(html).toContain('dir="rtl"')
  expect(html).toContain('aria-orientation="vertical"')
  expect(html).toContain('aria-pressed="true"')
  expect(html).toContain('href="#help"')
})
