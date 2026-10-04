import { DescriptionDetails, DescriptionList, DescriptionTerm } from '@hina-ui/react'

export default function Demo() {
  return (
    <DescriptionList className="max-w-sm">
      <DescriptionTerm>Title</DescriptionTerm>
      <DescriptionDetails>Spice and Wolf</DescriptionDetails>
      <DescriptionTerm>Author</DescriptionTerm>
      <DescriptionDetails>Isuna Hasekura</DescriptionDetails>
      <DescriptionTerm>Released</DescriptionTerm>
      <DescriptionDetails>14 March 2026</DescriptionDetails>
    </DescriptionList>
  )
}
