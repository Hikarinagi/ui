import { Plus } from 'lucide-react'
import {
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  DisclosureIcon,
  Stack,
  Text,
} from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="w-full max-w-md">
      <Collapsible>
        <Stack gap="sm" align="start">
          <CollapsibleTrigger icon={<Plus />}>Swap the glyph</CollapsibleTrigger>
          <CollapsibleContent>
            <Text tone="muted" size="sm">
              A plus turns a quarter into a cross, and the component still owns the rotation.
            </Text>
          </CollapsibleContent>
        </Stack>
      </Collapsible>
      <Collapsible>
        <Stack gap="sm" align="start">
          <CollapsibleTrigger asChild>
            <Button
              variant="outline"
              tone="neutral"
              block
              className="justify-between"
              trailing={<DisclosureIcon />}
            >
              Bring your own trigger
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <Text tone="muted" size="sm">
              On this path the appearance and the indicator are both yours — place a DisclosureIcon
              and it still finds the state.
            </Text>
          </CollapsibleContent>
        </Stack>
      </Collapsible>
    </Stack>
  )
}
