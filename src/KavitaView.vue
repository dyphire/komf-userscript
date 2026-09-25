<template>
  <Teleport :to="settingsElement">
    <NavEntry variant="kavita" @click="settingsDialog" />
  </Teleport>
  <Teleport :to="libraryActionsElement">
    <KavitaLibraryActions />
  </Teleport>
  <Teleport :to="seriesActionsElement">
    <KavitaSeriesActionsMenu />
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import NavEntry from '@/components/NavEntry.vue'
import SettingsDialog from './components/settings/SettingsDialog.vue'
import KavitaSeriesActionsMenu from '@/components/KavitaSeriesActionsMenu.vue'
import KavitaLibraryActions from '@/components/KavitaLibraryActions.vue'
import { hostDarkProbe } from '@/host'
import { useHostTheme } from '@/composables/useHostTheme'
import { useInjection, type InjectionPoint } from '@/composables/useInjection'

const $q = useQuasar()

const settingsElement = ref<HTMLElement>(document.createElement('div'))
const libraryActionsElement = ref<HTMLElement>(document.createElement('div'))
libraryActionsElement.value.setAttribute('class', 'col-auto')
const seriesActionsElement = ref<HTMLElement>(document.createElement('div'))
seriesActionsElement.value.setAttribute('class', 'col-auto ms-2')

function settingsDialog() {
    refreshTheme()
    $q.dialog({
        component: SettingsDialog
    })
}

const points: InjectionPoint[] = [
    {
        id: 'nav',
        locate: () => {
            const el = document.querySelector('app-nav-header') ?? document.querySelector('nav')
            const navBar = el?.nodeName === 'APP-NAV-HEADER'
                ? el.firstElementChild?.firstElementChild
                : el?.firstElementChild
            const slot = navBar?.children.item(4)
            return slot ? { insert: 'beforebegin', ref: slot } : null
        },
    },
    {
        id: 'series',
        locate: () => {
            const btn = document.querySelector('button#edit-btn--komf')
            return btn?.parentElement ? { insert: 'afterend', ref: btn.parentElement } : null
        },
    },
    {
        id: 'library',
        locate: () => {
            const btn = document.querySelector('button#filter-btn--komf')
            return btn?.parentElement ? { insert: 'append', ref: btn.parentElement } : null
        },
        // Kavita doesn't insert a container: the Teleport target is repointed
        // at the host's own filter container (original behavior)
        attach: (op, _el, retarget) => {
            retarget(op.ref as HTMLElement)
        },
    },
]

useInjection(points, {
    nav: settingsElement,
    series: seriesActionsElement,
    library: libraryActionsElement,
})

// Kavita's UI is always dark
const { refresh: refreshTheme } = useHostTheme(hostDarkProbe('kavita'))
</script>