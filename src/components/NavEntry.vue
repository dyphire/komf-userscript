<template>
  <button
    type="button"
    :class="['komf-nav-entry', `komf-nav-entry--${variant}`]"
    @click="$emit('click')"
  >
    <svg class="komf-nav-icon" :viewBox="svg.vb" aria-hidden="true">
      <path :d="svg.d" />
    </svg>
    <span v-if="label" class="komf-nav-label">{{ label }}</span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { mdiSvgPaths } from '@/mdi-svg-paths'

/**
 * Shared sidebar entry for all three hosts. Renders a native <button> +
 * inline SVG (Phosphor puzzlePiece, matching kmweb's icon style) so the entry
 * aligns pixel-perfectly with the host's own nav items — previously each View
 * hand-rolled its own entry (q-btn / native button) with divergent markup.
 *
 * Visual metrics are host-specific and driven by the variant modifier class:
 *   --kmweb : 36px row / 18px icon / 13.5px label
 *   --komga : 48px row / 24px icon / 16px label   (Vuetify v-list-item)
 *   --kavita: icon-only 22px button / ~40px touch target (Kavita toolbar)
 */
export type NavEntryVariant = 'kmweb' | 'komga' | 'kavita'

const props = withDefaults(
  defineProps<{
    variant: NavEntryVariant
    /** icon key into mdiSvgPaths (without the mdi- prefix); defaults to puzzle */
    icon?: string
    /** row-item label; omit for icon-only variants */
    label?: string
  }>(),
  {
    icon: 'puzzle',
    label: '',
  },
)

defineEmits<{ (e: 'click'): void }>()

/** mdiSvgPaths values use QIcon's `path|viewBox` syntax (single pipe). */
const svg = computed(() => {
  const raw = mdiSvgPaths[props.icon] ?? mdiSvgPaths['puzzle'] ?? ''
  const [d, vb = '0 0 256 256'] = raw.split('|')
  return { d, vb }
})
</script>
