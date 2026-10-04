import { Menubar, MenubarItem, MenubarMenu } from '@hina-ui/react'

export default function Demo() {
  return (
    <Menubar label="Example menu">
      <MenubarMenu label="File">
        <MenubarItem>New</MenubarItem>
        <MenubarItem>Open</MenubarItem>
        <MenubarItem>Save</MenubarItem>
      </MenubarMenu>
      <MenubarMenu label="Edit">
        <MenubarItem>Undo</MenubarItem>
        <MenubarItem>Redo</MenubarItem>
      </MenubarMenu>
      <MenubarMenu label="Help">
        <MenubarItem>Documentation</MenubarItem>
        <MenubarItem>About</MenubarItem>
      </MenubarMenu>
    </Menubar>
  )
}
