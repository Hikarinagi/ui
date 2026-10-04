import { Breadcrumb, BreadcrumbItem, BreadcrumbSeparator } from '@hina-ui/react'

export default function Demo() {
  return (
    <Breadcrumb label="Title location">
      <BreadcrumbItem href="#">Home</BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem href="#">Light novels</BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem current>Volume 3</BreadcrumbItem>
    </Breadcrumb>
  )
}
