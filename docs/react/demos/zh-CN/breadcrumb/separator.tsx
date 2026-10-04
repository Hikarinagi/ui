import { Slash } from 'lucide-react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbSeparator, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack gap="md">
      <Stack gap="xs">
        <Text size="sm" tone="faint">
          默认
        </Text>
        <Breadcrumb>
          <BreadcrumbItem href="#">首页</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem href="#">漫画</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem current>第 12 话</BreadcrumbItem>
        </Breadcrumb>
      </Stack>

      <Stack gap="xs">
        <Text size="sm" tone="faint">
          斜线
        </Text>
        <Breadcrumb>
          <BreadcrumbItem href="#">首页</BreadcrumbItem>
          <BreadcrumbSeparator>
            <Slash className="size-3.5" />
          </BreadcrumbSeparator>
          <BreadcrumbItem href="#">漫画</BreadcrumbItem>
          <BreadcrumbSeparator>
            <Slash className="size-3.5" />
          </BreadcrumbSeparator>
          <BreadcrumbItem current>第 12 话</BreadcrumbItem>
        </Breadcrumb>
      </Stack>

      <Stack gap="xs">
        <Text size="sm" tone="faint">
          文字
        </Text>
        <Breadcrumb>
          <BreadcrumbItem href="#">首页</BreadcrumbItem>
          <BreadcrumbSeparator>·</BreadcrumbSeparator>
          <BreadcrumbItem href="#">漫画</BreadcrumbItem>
          <BreadcrumbSeparator>·</BreadcrumbSeparator>
          <BreadcrumbItem current>第 12 话</BreadcrumbItem>
        </Breadcrumb>
      </Stack>
    </Stack>
  )
}
