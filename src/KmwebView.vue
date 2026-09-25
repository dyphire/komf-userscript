<template>
  <Teleport :to="navElement">
    <NavEntry variant="kmweb" label="Komf Settings" @click="settingsDialog" />
  </Teleport>
  <Teleport :to="seriesActionsElement">
    <div class="kmweb-integration">
      <KomgaSeriesActions />
    </div>
  </Teleport>
  <Teleport :to="libraryActionsElement">
    <div class="kmweb-integration">
      <KomgaLibraryActions />
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import NavEntry from '@/components/NavEntry.vue'
import SettingsDialog from '@/components/settings/SettingsDialog.vue'
import KomgaSeriesActions from '@/components/KomgaSeriesActions.vue'
import KomgaLibraryActions from '@/components/KomgaLibraryActions.vue'
import { useHostTheme } from '@/composables/useHostTheme'
import { useInjection, type InjectionPoint } from '@/composables/useInjection'

const $q = useQuasar()

const navElement = ref<HTMLElement>(document.createElement('div'))
const libraryActionsElement = ref<HTMLElement>(document.createElement('div'))
const seriesActionsElement = ref<HTMLElement>(document.createElement('div'))

function settingsDialog() {
    refreshTheme()
    $q.dialog({
        component: SettingsDialog
    })
}

const isDetailPath = () => /\/series\/|\/oneshot\//.test(window.location.pathname)
const isLibraryPath = () =>
    window.location.pathname.includes('libraries') && !window.location.pathname.includes('/admin/')

/** kmweb renders <aside><nav> (desktop + mobile drawer). */
const points: InjectionPoint[] = [
    {
        id: 'nav',
        locate: () => {
            const nav = document.querySelector('aside nav')
            return nav ? { insert: 'append', ref: nav } : null
        },
    },
    {
        id: 'series',
        locate: () => {
            if (!isDetailPath()) return null
            // detail hero: insert before "More actions" if present, else append
            // to the button group (`mt-4 flex flex-wrap items-center gap-2`)
            const moreActions = document.querySelector('button[aria-label="More actions"]')
            if (moreActions?.parentElement) return { insert: 'beforebegin', ref: moreActions }
            const h1 = document.querySelector('main h1')
            const group = h1?.parentElement?.querySelector(':scope > div')
            return group ? { insert: 'append', ref: group } : null
        },
    },
    {
        id: 'library',
        locate: () => {
            if (!isLibraryPath()) return null
            // browse pages render a PageHeader (h1 wrapped in two divs)
            const h1 = document.querySelector('main h1')
            const pageHeader = h1?.parentElement?.parentElement
            return pageHeader ? { insert: 'append', ref: pageHeader } : null
        },
    },
]

useInjection(points, {
    nav: navElement,
    series: seriesActionsElement,
    library: libraryActionsElement,
})

// kmweb toggles <html class="dark|light">; keep the Quasar dialogs in sync
const { refresh: refreshTheme } = useHostTheme(
    () => document.documentElement.classList.contains('dark'),
    { element: document.documentElement, attribute: 'class' },
)
</script>

<style scoped lang="scss">
@import '@/styles/scoped.scss';
</style>