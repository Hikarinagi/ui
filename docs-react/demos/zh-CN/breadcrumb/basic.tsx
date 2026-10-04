import { Breadcrumb, BreadcrumbItem, BreadcrumbSeparator } from '@hina-ui/react'

export default function Demo() {
  return (
    <Breadcrumb>
      <BreadcrumbItem href="#">首页</BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem href="#">轻小说</BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem current>春与修罗</BreadcrumbItem>
    </Breadcrumb>
  )
}
