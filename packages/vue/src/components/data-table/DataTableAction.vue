<script setup lang="ts">
  import Spinner from '../spinner/Spinner.vue'
  defineProps<{ disabled?: boolean; loading?: boolean }>()
</script>
<template>
  <button
    type="button"
    class="hn-table-action hn-focus-ring"
    :disabled="disabled || loading"
    :aria-busy="loading || undefined"
  >
    <Spinner v-if="loading" size="sm" />
    <slot v-else />
  </button>
</template>
