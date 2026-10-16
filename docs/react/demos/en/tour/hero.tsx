'use client'

import { useState } from 'react'
import { Button, Inline, Input, Tour, type TourStep } from '@hina-ui/react'

const steps: TourStep[] = [
  { title: 'Welcome', description: 'Take half a minute to meet the main entry points.' },
  {
    target: '#tour-hero-create',
    title: 'New project',
    description: 'Create your first project here.',
  },
  { target: '#tour-hero-search', title: 'Search', description: 'Find projects by name or tag.' },
  {
    target: '#tour-hero-share',
    title: 'Invite people',
    description: 'Send the link to colleagues and edit together.',
    side: 'left',
  },
]

export default function Demo() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(1)

  function start() {
    setStep(1)
    setOpen(true)
  }

  return (
    <>
      <Inline gap="sm" align="center" wrap>
        <Button id="tour-hero-create">New project</Button>
        <Input id="tour-hero-search" placeholder="Search projects" className="w-48" />
        <Button id="tour-hero-share" variant="outline" tone="neutral">
          Invite
        </Button>
        <Button variant="ghost" tone="neutral" onClick={start}>
          Start tour
        </Button>
      </Inline>
      <Tour steps={steps} open={open} onOpenChange={setOpen} step={step} onStepChange={setStep} />
    </>
  )
}
