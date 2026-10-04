import { DescriptionDetails, DescriptionList, DescriptionTerm, Inline, Tag } from '@hina-ui/react'

export default function Demo() {
  return (
    <DescriptionList className="max-w-sm">
      <DescriptionTerm>Author</DescriptionTerm>
      <DescriptionDetails>Isuna Hasekura</DescriptionDetails>
      <DescriptionDetails>Jyuu Ayakura</DescriptionDetails>
      <DescriptionTerm>Tags</DescriptionTerm>
      <DescriptionDetails>
        <Inline align="center">
          <Tag>Sci-fi</Tag>
          <Tag>School</Tag>
          <Tag>Healing</Tag>
        </Inline>
      </DescriptionDetails>
    </DescriptionList>
  )
}
