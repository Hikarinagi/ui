<script setup lang="ts">
  import { Plus } from '@lucide/vue'
  import {
    Button,
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
    DisclosureIcon,
    Stack,
    Text,
  } from '@hikarinagi/ui'
</script>

<template>
  <Stack class="w-full max-w-md">
    <Collapsible>
      <Stack gap="sm" align="start">
        <CollapsibleTrigger>
          Swap the glyph
          <template #icon>
            <Plus />
          </template>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Text tone="muted" size="sm">
            A plus turns a quarter into a cross, and the component still owns the rotation.
          </Text>
        </CollapsibleContent>
      </Stack>
    </Collapsible>
    <Collapsible>
      <Stack gap="sm" align="start">
        <CollapsibleTrigger as-child>
          <Button variant="outline" tone="neutral" block class="justify-between">
            Bring your own trigger
            <template #trailing>
              <DisclosureIcon />
            </template>
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Text tone="muted" size="sm">
            On this path the appearance and the indicator are both yours — place a DisclosureIcon
            and it still finds the state.
          </Text>
        </CollapsibleContent>
      </Stack>
    </Collapsible>
  </Stack>
</template>
