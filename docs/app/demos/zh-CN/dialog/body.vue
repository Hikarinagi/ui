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
  <Dialog title="发布动态" placement="top" class="max-w-[600px]">
    <Button variant="outline" tone="neutral">自定义面板</Button>
    <template #body="{ close }">
      <Stack gap="none" class="min-h-0">
        <Inline justify="between" class="border-line shrink-0 border-b px-3 py-2.5">
          <Button variant="ghost" tone="neutral" size="sm" @click="close">取消</Button>
          <Button size="sm" :disabled="(!content.trim() && !attached) || overLimit" @click="close">
            发布
          </Button>
        </Inline>

        <ScrollArea class="min-h-0">
          <Inline align="start" :wrap="false" class="gap-3 p-4">
            <Avatar src="/avatars/paper.webp" name="星见书音" />
            <Stack gap="sm" class="min-w-0 flex-1">
              <Stack gap="xs">
                <Text weight="medium">星见书音</Text>
                <Inline gap="xs">
                  <Globe class="text-muted size-3.5" aria-hidden="true" />
                  <Text size="xs" tone="muted">公开</Text>
                </Inline>
              </Stack>
              <Textarea
                v-model="content"
                variant="secondary"
                :autosize="{ minRows: 5 }"
                :invalid="overLimit"
                aria-label="动态正文"
                placeholder="分享你的发现、推荐或此刻的想法…"
                class="rounded-none border-0 [--hn-field-bg:transparent] [--hn-textarea-px:0px]"
              />
              <Stack v-if="attached" class="relative">
                <Image src="/sample.webp" alt="示例图片" class="aspect-video w-full rounded-md" />
                <CloseButton
                  label="移除图片"
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
              label="添加示例图片"
              size="sm"
              :aria-pressed="attached"
              @click="attached = !attached"
            >
              <ImagePlus />
            </IconButton>
            <IconButton label="插入表情" size="sm" @click="content += '😊'">
              <Smile />
            </IconButton>
            <IconButton label="插入 @" size="sm" @click="content += '@'">
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
