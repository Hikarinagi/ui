<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { AtSign, Globe, ImagePlus, Smile } from '@lucide/vue'
  import {
    Avatar,
    Button,
    CloseButton,
    Dialog,
    IconButton,
    Image,
    Inline,
    ScrollArea,
    Stack,
    Text,
    Textarea,
  } from '@hina-ui/vue'

  const content = ref('')
  const attached = ref(false)
  const count = computed(() => Array.from(content.value).length)
  const overLimit = computed(() => count.value > 280)
</script>

<template>
  <Dialog title="New post" placement="top" class="max-w-[600px]">
    <Button variant="outline" tone="neutral">Custom panel</Button>
    <template #body="{ close }">
      <Stack gap="none" class="min-h-0">
        <Inline justify="between" class="border-line shrink-0 border-b px-3 py-2.5">
          <Button variant="ghost" tone="neutral" size="sm" @click="close">Cancel</Button>
          <Button size="sm" :disabled="(!content.trim() && !attached) || overLimit" @click="close">
            Post
          </Button>
        </Inline>

        <ScrollArea class="min-h-0">
          <Inline align="start" :wrap="false" class="gap-3 p-4">
            <Avatar src="/avatars/paper.webp" name="Shion" />
            <Stack gap="sm" class="min-w-0 flex-1">
              <Stack gap="xs">
                <Text weight="medium">Shion</Text>
                <Inline gap="xs">
                  <Globe class="text-muted size-3.5" aria-hidden="true" />
                  <Text size="xs" tone="muted">Public</Text>
                </Inline>
              </Stack>
              <Textarea
                v-model="content"
                variant="secondary"
                :autosize="{ minRows: 5 }"
                :invalid="overLimit"
                aria-label="Post content"
                placeholder="Share a discovery, a recommendation, or a thought…"
                class="rounded-none border-0 [--hn-field-bg:transparent] [--hn-textarea-px:0px]"
              />
              <Stack v-if="attached" class="relative">
                <Image
                  src="/sample.webp"
                  alt="Sample image"
                  class="aspect-video w-full rounded-md"
                />
                <CloseButton
                  label="Remove image"
                  class="bg-surface/90 absolute top-2 right-2 shadow-sm"
                  @click="attached = false"
                />
              </Stack>
            </Stack>
          </Inline>
        </ScrollArea>

        <Inline justify="between" :wrap="false" class="border-line shrink-0 border-t px-3 py-2">
          <Inline gap="xs">
            <IconButton
              label="Add sample image"
              size="sm"
              :aria-pressed="attached"
              @click="attached = !attached"
            >
              <ImagePlus />
            </IconButton>
            <IconButton label="Insert emoji" size="sm" @click="content += '😊'">
              <Smile />
            </IconButton>
            <IconButton label="Insert @" size="sm" @click="content += '@'">
              <AtSign />
            </IconButton>
          </Inline>
          <Text
            as="span"
            size="xs"
            :tone="overLimit ? 'danger' : 'muted'"
            class="shrink-0 tabular-nums"
          >
            {{ count }} / 280
          </Text>
        </Inline>
      </Stack>
    </template>
  </Dialog>
</template>
