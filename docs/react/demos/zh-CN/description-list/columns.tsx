import { DescriptionDetails, DescriptionList, DescriptionTerm } from '@hina-ui/react'

export default function Demo() {
  return (
    <DescriptionList orientation="horizontal" className="max-w-md">
      <DescriptionTerm>作品名称</DescriptionTerm>
      <DescriptionDetails>狼と香辛料</DescriptionDetails>
      <DescriptionTerm>出版社</DescriptionTerm>
      <DescriptionDetails>電撃文庫</DescriptionDetails>
      <DescriptionTerm>册数</DescriptionTerm>
      <DescriptionDetails>全 7 卷</DescriptionDetails>
    </DescriptionList>
  )
}
