import { Breadcrumb, BreadcrumbItem, BreadcrumbSeparator } from '@hina-ui/react'

export default function Demo() {
  return (
    <Breadcrumb>
      <BreadcrumbItem href="#">首页</BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem href="#">Galgame</BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem href="#">枕</BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem current>サクラノ詩</BreadcrumbItem>
    </Breadcrumb>
  )
}
