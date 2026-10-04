import { Slash } from 'lucide-react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbSeparator, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack gap="md">
      <Stack gap="xs">
        <Text size="sm" tone="faint">
          Default
        </Text>
        <Breadcrumb>
          <BreadcrumbItem href="#">Home</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem href="#">Manga</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem current>Episode 12</BreadcrumbItem>
        </Breadcrumb>
      </Stack>

      <Stack gap="xs">
        <Text size="sm" tone="faint">
          Slash
        </Text>
        <Breadcrumb>
          <BreadcrumbItem href="#">Home</BreadcrumbItem>
          <BreadcrumbSeparator>
            <Slash className="size-3.5" />
          </BreadcrumbSeparator>
          <BreadcrumbItem href="#">Manga</BreadcrumbItem>
          <BreadcrumbSeparator>
            <Slash className="size-3.5" />
          </BreadcrumbSeparator>
          <BreadcrumbItem current>Episode 12</BreadcrumbItem>
        </Breadcrumb>
      </Stack>

      <Stack gap="xs">
        <Text size="sm" tone="faint">
          Text
        </Text>
        <Breadcrumb>
          <BreadcrumbItem href="#">Home</BreadcrumbItem>
          <BreadcrumbSeparator>·</BreadcrumbSeparator>
          <BreadcrumbItem href="#">Manga</BreadcrumbItem>
          <BreadcrumbSeparator>·</BreadcrumbSeparator>
          <BreadcrumbItem current>Episode 12</BreadcrumbItem>
        </Breadcrumb>
      </Stack>
    </Stack>
  )
}
