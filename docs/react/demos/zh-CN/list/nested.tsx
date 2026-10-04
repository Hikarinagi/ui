import { List, ListItem } from '@hina-ui/react'

export default function Demo() {
  return (
    <List className="max-w-md">
      <ListItem>
        排版
        <List>
          <ListItem>Text</ListItem>
          <ListItem>Heading</ListItem>
        </List>
      </ListItem>
      <ListItem>
        原子
        <List>
          <ListItem>Button</ListItem>
          <ListItem>Tag</ListItem>
        </List>
      </ListItem>
    </List>
  )
}
