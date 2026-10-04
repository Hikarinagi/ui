import { List, ListItem } from '@hina-ui/react'

export default function Demo() {
  return (
    <List ordered className="max-w-md">
      <ListItem>Install dependencies</ListItem>
      <ListItem>Import the styles</ListItem>
      <ListItem>Start the dev server</ListItem>
    </List>
  )
}
