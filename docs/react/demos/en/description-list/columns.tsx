import { DescriptionDetails, DescriptionList, DescriptionTerm } from '@hina-ui/react'

export default function Demo() {
  return (
    <DescriptionList orientation="horizontal" className="max-w-md">
      <DescriptionTerm>Title</DescriptionTerm>
      <DescriptionDetails>Spice and Wolf</DescriptionDetails>
      <DescriptionTerm>Publisher</DescriptionTerm>
      <DescriptionDetails>Dengeki Bunko</DescriptionDetails>
      <DescriptionTerm>Volumes</DescriptionTerm>
      <DescriptionDetails>7 in total</DescriptionDetails>
    </DescriptionList>
  )
}
