import { Editable, FormField, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="w-full max-w-sm">
      <Editable size="sm" value="Small text" aria-label="Small" />
      <Editable size="md" value="Default text" aria-label="Default" />
      <Editable size="lg" value="Large text" aria-label="Large" />
      <FormField label="Read only" description="Text can still be selected and copied.">
        <Editable value="Read-only project name" readonly />
      </FormField>
      <FormField label="Disabled">
        <Editable value="Editing unavailable" disabled />
      </FormField>
      <FormField label="Empty value">
        <Editable placeholder="Add a note…" />
      </FormField>
    </Stack>
  )
}
