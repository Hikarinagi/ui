<script setup lang="ts">
  import {
    Button,
    Card,
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
    DisclosureIcon,
    Stack,
    Text,
  } from '@hikarinagi/ui'
</script>

<template>
  <Card class="w-full max-w-md">
    <Collapsible>
      <Stack gap="sm" align="start">
        <Text tone="muted" size="sm">
          On my first day at the new school I met a girl on the roof holding an old camera. She said
          it could photograph tomorrow.
        </Text>
        <CollapsibleTrigger as-child>
          <Button variant="link" size="sm">
            <template #trailing>
              <DisclosureIcon />
            </template>
            Read the full synopsis
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Text tone="muted" size="sm">
            Every day after that we climbed the rusted ladder once class let out. She pressed the
            shutter and I kept the time. Then one evening something appeared in the viewfinder that
            should not have been there.
          </Text>
        </CollapsibleContent>
      </Stack>
    </Collapsible>
  </Card>
</template>
