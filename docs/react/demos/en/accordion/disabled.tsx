import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Stack,
  Text,
} from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack gap="lg" className="w-full max-w-md">
      <Accordion defaultValue="intro">
        <AccordionItem value="intro">
          <AccordionTrigger>Synopsis</AccordionTrigger>
          <AccordionContent>
            <Text tone="muted" size="sm">
              On my first day at the new school I met a girl on the roof holding an old camera.
            </Text>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="staff" disabled>
          <AccordionTrigger>Staff</AccordionTrigger>
          <AccordionContent>
            <Text tone="muted" size="sm">
              Story, script and art are all by the same author.
            </Text>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Accordion disabled>
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
      </Accordion>
    </Stack>
  )
}
