import { Card, Editable, FormField, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Card className="w-full max-w-lg">
      <Stack gap="lg">
        <Text weight="medium">Project details</Text>
        <FormField label="Project name">
          <Editable defaultValue="Hina UI library" maxlength={60} />
        </FormField>
        <FormField label="Description">
          <Editable
            defaultValue="Consistent, restrained interactions for content sites and admin tools."
            multiline
            rows={3}
          />
        </FormField>
        <Text size="sm" tone="muted">
          Click text to edit. Enter saves and Esc cancels; use Ctrl / ⌘ + Enter for multiline text.
        </Text>
      </Stack>
    </Card>
  )
}
