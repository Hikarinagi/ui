import { Editable, FormField, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="w-full max-w-sm" gap="lg">
      <FormField
        label="Double click"
        description="Press Enter or Space when focused to edit with a keyboard."
      >
        <Editable defaultValue="Double-click to rename this document" activationMode="dblclick" />
      </FormField>
      <FormField
        label="Manual activation"
        description="The draft stays open until you save or cancel."
      >
        <Editable
          defaultValue="Use the edit button to make changes"
          activationMode="manual"
          submitMode="manual"
        />
      </FormField>
    </Stack>
  )
}
