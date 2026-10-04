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
          <CollapsibleTrigger icon={<Plus />}>更换字形</CollapsibleTrigger>
          <CollapsibleContent>
            <Text tone="muted" size="sm">
              加号旋转四分之一圈后成为叉号，旋转仍由组件负责。
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
              自行提供整个触发器
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <Text tone="muted" size="sm">
              此时外观与指示物均由调用方决定，放置一个 DisclosureIcon 即可。
            </Text>
          </CollapsibleContent>
        </Stack>
      </Collapsible>
    </Stack>
  )
}
