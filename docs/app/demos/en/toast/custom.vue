<script setup lang="ts">
  import { defineComponent, h } from 'vue'
  import { BookOpen } from '@lucide/vue'
  import { Button, Heading, Inline, Stack, Text, toast } from '@hina-ui/vue'

  const ChapterToast = defineComponent({
    props: { title: { type: String, required: true }, chapter: { type: String, required: true } },
    setup(props) {
      return () =>
        h(
          Inline,
          { align: 'center', class: 'gap-3' },
          {
            default: () => [
              h(
                'div',
                { class: 'bg-inset grid size-10 shrink-0 place-items-center rounded-md' },
                h(BookOpen, { class: 'size-5' }),
              ),
              h(
                Stack,
                { gap: 'none', class: 'min-w-0 flex-1' },
                {
                  default: () => [
                    h(Heading, { level: 4, size: 'sm' }, () => props.title),
                    h(Text, { tone: 'muted', size: 'sm' }, () => props.chapter),
                  ],
                },
              ),
              h(
                Button,
                { size: 'sm', onClick: () => toast.dismiss('chapter') },
                { default: () => 'Read' },
              ),
            ],
          },
        )
    },
  })

  function notify() {
    toast.custom(ChapterToast, {
      id: 'chapter',
      duration: 6000,
      props: { title: 'Beyond the Stars', chapter: 'Chapter 42 Dawn of the Observer' },
    })
  }
</script>

<template>
  <Button variant="outline" tone="neutral" @click="notify">New chapter</Button>
</template>
