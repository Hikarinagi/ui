import { Breadcrumb, BreadcrumbItem, BreadcrumbSeparator } from '@hina-ui/react'

export default function Demo() {
  return (
    <Breadcrumb>
      <BreadcrumbItem href="#">Home</BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem href="#">Light novels</BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem current>Spring and Asura</BreadcrumbItem>
    </Breadcrumb>
  )
}
