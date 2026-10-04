import { FormField, Input, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="w-full">
      <FormField
        label="Display name"
        orientation="responsive"
        descriptionPlacement="label"
        description="Shown on your public profile."
      >
        <Input defaultValue="Hina" />
      </FormField>
      <FormField
        label="Email address"
        orientation="responsive"
        descriptionPlacement="control"
        description="Use an address that can receive notifications."
        error="Enter an email address."
      >
        <Input defaultValue="" type="email" />
      </FormField>
    </Stack>
  )
}
