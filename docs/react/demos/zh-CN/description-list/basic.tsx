import { DescriptionDetails, DescriptionList, DescriptionTerm } from '@hina-ui/react'

export default function Demo() {
  return (
    <DescriptionList className="max-w-sm">
      <DescriptionTerm>状态</DescriptionTerm>
      <DescriptionDetails>连载中</DescriptionDetails>
      <DescriptionTerm>分级</DescriptionTerm>
      <DescriptionDetails>全年龄</DescriptionDetails>
    </DescriptionList>
  )
}
