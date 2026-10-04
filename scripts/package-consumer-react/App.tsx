import { useState } from 'react'
import {
  Button,
  Card,
  IconButton,
  ScrollArea,
  Stack,
  Text,
  Tooltip,
  TooltipProvider,
  UiLocaleProvider,
  enUS,
  type ButtonProps,
} from '@hina-ui/react'

const action: ButtonProps = { variant: 'soft', tone: 'neutral' }

export function App() {
  const [loading, setLoading] = useState(false)
  return (
    <UiLocaleProvider messages={enUS}>
      <TooltipProvider>
        <Card>
          <Stack gap="sm">
            <Text tone="muted">Entry</Text>
            <ScrollArea className="max-h-40" focusable>
              <Text>Content</Text>
            </ScrollArea>
            <Tooltip content="Save the entry">
              <Button {...action} loading={loading} onClick={() => setLoading(true)}>
                Save
              </Button>
            </Tooltip>
            <IconButton label="Close">×</IconButton>
          </Stack>
        </Card>
      </TooltipProvider>
    </UiLocaleProvider>
  )
}
