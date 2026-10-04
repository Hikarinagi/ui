import { Stack, Switch } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack gap="sm">
      <Switch size="sm" checked>
        Small
      </Switch>
      <Switch size="md" checked>
        Medium
      </Switch>
      <Switch size="lg" checked>
        Large
      </Switch>
    </Stack>
  )
}
