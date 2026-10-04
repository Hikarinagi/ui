import { Breadcrumb, BreadcrumbItem, BreadcrumbSeparator } from '@hina-ui/react'

export default function Demo() {
  return (
    <Breadcrumb label="作品位置">
      <BreadcrumbItem href="#">首页</BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem href="#">轻小说</BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem current>第三卷</BreadcrumbItem>
    </Breadcrumb>
  )
}
