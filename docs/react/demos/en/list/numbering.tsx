import { List, ListItem, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="max-w-md">
      <List ordered start={5}>
        <ListItem>Starts at five</ListItem>
        <ListItem>Then six</ListItem>
      </List>
      <List ordered reversed>
        <ListItem>First item, counting down</ListItem>
        <ListItem>Second item, counting down</ListItem>
      </List>
    </Stack>
  )
}
