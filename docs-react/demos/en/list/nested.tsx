import { List, ListItem } from '@hina-ui/react'

export default function Demo() {
  return (
    <List className="max-w-md">
      <ListItem>
        Typography
        <List>
          <ListItem>Text</ListItem>
          <ListItem>Heading</ListItem>
        </List>
      </ListItem>
      <ListItem>
        Atoms
        <List>
          <ListItem>Button</ListItem>
          <ListItem>Tag</ListItem>
        </List>
      </ListItem>
    </List>
  )
}
