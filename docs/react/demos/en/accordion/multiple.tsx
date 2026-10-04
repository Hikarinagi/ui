import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Accordion type="multiple" defaultValue={['intro', 'staff']} className="w-full max-w-md">
      <AccordionItem value="intro">
        <AccordionTrigger>Synopsis</AccordionTrigger>
        <AccordionContent>
          <Text tone="muted" size="sm">
            On my first day at the new school I met a girl on the roof holding an old camera.
          </Text>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="staff">
        <AccordionTrigger>Staff</AccordionTrigger>
        <AccordionContent>
          <Text tone="muted" size="sm">
            Story, script and art are all by the same author.
          </Text>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="release">
        <AccordionTrigger>Release</AccordionTrigger>
        <AccordionContent>
          <Text tone="muted" size="sm">
            Released in winter 2024, with Simplified Chinese support.
          </Text>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
