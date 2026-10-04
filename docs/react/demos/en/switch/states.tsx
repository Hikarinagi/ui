import { Stack, Switch } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack gap="sm">
      <Switch invalid>Must be on to continue</Switch>
      <Switch disabled>Disabled</Switch>
      <Switch disabled checked>
        Disabled and on
      </Switch>
    </Stack>
  )
}
