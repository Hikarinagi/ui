import { FormField, Input, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="w-full max-w-2xl resize-x overflow-auto p-2">
      <FormField
        label="Display name"
        orientation="responsive"
        description="Resize this panel: fields stack below 32rem."
      >
        <Input defaultValue="Hina" />
      </FormField>
    </Stack>
  )
}
