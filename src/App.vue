<template>
  <KomgaView v-if="komga" />
  <KavitaView v-if="kavita" />
  <KmwebView v-if="kmweb" />
</template>

<script setup lang="ts">
import { useSettingsStore } from '@/stores/settings'
import MediaServer from '@/types/mediaServer'
import KomgaView from '@/KomgaView.vue'
import KmwebView from '@/KmwebView.vue'
import { onBeforeUnmount, ref } from 'vue'
import KavitaView from '@/KavitaView.vue'
import { useQuasar } from 'quasar'
import { detectHost, hostDarkProbe } from '@/host'
import { useHostTheme } from '@/composables/useHostTheme'
import mdiIconSet from 'quasar/icon-set/mdi-v6.js'
import fontAwesomeIconSet from 'quasar/icon-set/fontawesome-v6.js'

const $q = useQuasar()
const settings = useSettingsStore()
const title = document.title
const komga = ref(false)
const kavita = ref(false)
const kmweb = ref(false)

// Stump is recognized for the marker only; no View renders until proper
// support lands (komf supports Stump server-side).
const host = detectHost(title)
if (host) document.documentElement.dataset.komfHost = host

if (host) document.documentElement.dataset.komfHost = host

// Every $q.dialog() (SettingsDialog, but also IdentifySeriesDialog, Reset
// Metadata, Auto-Identify confirmations …) must open with the host theme
// marker already applied — otherwise a dialog opened before the host applied
// its theme class renders light-on-light. Wrap the plugin factory so each
// open re-reads the host dark state right now.
const { refresh: refreshTheme } = useHostTheme(hostDarkProbe(host))
const origDialog = $q.dialog.bind($q)
$q.dialog = ((opts) => {
  refreshTheme()
  const d = origDialog(opts)
  // Belt-and-braces: host CSS can still defeat the global centering rules on
  // some hosts. Pin the dialog inner container inline so every plugin dialog
  // stays centered no matter what the page stylesheet does (inline wins).
  // Plugin dialogs render asynchronously (transition + portal mount), so a
  // one-shot timeout can miss the element; a persistent observer catches the
  // inner container the moment it appears (WeakSet keeps it idempotent).
  const pinnedInners = new WeakSet<HTMLElement>()
  const pinInner = (el: HTMLElement) => {
    if (pinnedInners.has(el)) return
    pinnedInners.add(el)
    // Force the inner container to cover the whole viewport, then center
    // with flex. Hosts that defeat Quasar's fixed positioning (or shrink
    // the container) leave the dialog left-aligned otherwise.
    el.style.setProperty('position', 'fixed', 'important')
    el.style.setProperty('top', '0', 'important')
    el.style.setProperty('left', '0', 'important')
    el.style.setProperty('right', '0', 'important')
    el.style.setProperty('bottom', '0', 'important')
    // Never use vw/vh units here: hosts with page zoom (e.g. Firefox zoom)
    // resolve them to scaled values (100vw can compute to < viewport). Use
    // the measured CSS pixels instead so the container truly covers the viewport.
    el.style.setProperty('width', `${window.innerWidth}px`, 'important')
    el.style.setProperty('height', `${window.innerHeight}px`, 'important')
    el.style.setProperty('display', 'flex', 'important')
    el.style.setProperty('align-items', 'center', 'important')
    el.style.setProperty('justify-content', 'center', 'important')
    el.style.setProperty('flex-wrap', 'nowrap', 'important')
  }
  const pinAllInners = () => {
    document.querySelectorAll<HTMLElement>('[id^="q-portal--"] .q-dialog__inner').forEach(pinInner)
    // Card-level pinning: auto margins center under block layout; measured
    // pixel max-bounds keep the dialog inside the viewport (small windows and
    // page zoom alike, since vw/vh units are zoom-distorted here); internal
    // scroll keeps tall dialogs (Identify results grid) usable instead of
    // overflowing past the viewport edges.
    document.querySelectorAll<HTMLElement>('[id^="q-portal--"] .q-dialog__inner .q-dialog-plugin').forEach((card) => {
      card.style.setProperty('margin-left', 'auto', 'important')
      card.style.setProperty('margin-right', 'auto', 'important')
      card.style.setProperty('max-width', `${window.innerWidth - 32}px`, 'important')
      card.style.setProperty('max-height', `${window.innerHeight - 32}px`, 'important')
      card.style.setProperty('overflow-y', 'auto', 'important')
    })
    // Kavita's host wraps tab strips so Quasar paints spurious scroll
    // arrows; the stylesheet rule can lose to host/quasar inline styles,
    // so also pin the arrows hidden inline (inline !important always wins).
    if (document.documentElement.dataset.komfHost === 'kavita') {
      document.querySelectorAll<HTMLElement>('[id^="q-portal--"] .q-tabs__arrow').forEach((a) => {
        a.style.setProperty('display', 'none', 'important')
      })
    }
  }
  window.setTimeout(pinAllInners, 0)
  window.setTimeout(pinAllInners, 150)
  const startObserving = () => {
    if (!document.body) { window.setTimeout(startObserving, 50); return }
    const portalObserver = new MutationObserver(pinAllInners)
    portalObserver.observe(document.body, { childList: true, subtree: true })
    onBeforeUnmount(() => portalObserver.disconnect())
  }
  startObserving()
  return d
}) as typeof $q.dialog
if (title == 'Komga') {
    komga.value = true
    settings.mediaServer = MediaServer.Komga
    $q.iconSet.set(mdiIconSet)
} else if (title == 'Kavita') {
    kavita.value = true
    settings.mediaServer = MediaServer.Kavita
    $q.iconSet.set(fontAwesomeIconSet)
} else if (title.includes('KMReader')) {
    // kmrs serves kmweb: Komga-compatible API with a React/Tailwind UI
    kmweb.value = true
    settings.mediaServer = MediaServer.Komga
    $q.iconSet.set(mdiIconSet)
}

</script>

<style scoped lang="scss">
@import '@/styles/scoped.scss';
</style>
<style lang="scss">
@import '@/styles/global-overrides.scss';
</style>
