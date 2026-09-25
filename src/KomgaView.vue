<template>
  <Teleport :to="menuElement">
    <NavEntry variant="komga" label="Komf Settings" @click="settingsDialog" />
  </Teleport>
  <Teleport :to="libraryActionsElement">
    <KomgaLibraryActions />
  </Teleport>
  <Teleport :to="seriesActionsElement">
    <KomgaSeriesActions />
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import NavEntry from '@/components/NavEntry.vue'
import SettingsDialog from './components/settings/SettingsDialog.vue'
import KomgaSeriesActions from '@/components/KomgaSeriesActions.vue'
import KomgaLibraryActions from '@/components/KomgaLibraryActions.vue'
import { hostDarkProbe } from '@/host'
import { useHostTheme } from '@/composables/useHostTheme'
import { useInjection, type InjectionPoint } from '@/composables/useInjection'

const $q = useQuasar()

const menuElement = ref<HTMLElement>(document.createElement('div'))
const libraryActionsElement = ref<HTMLElement>(document.createElement('div'))
const seriesActionsElement = ref<HTMLElement>(document.createElement('div'))

function settingsDialog() {
    refreshTheme()
    $q.dialog({
        component: SettingsDialog
    })
}

const points: InjectionPoint[] = [
    {
        id: 'menu',
        locate: () => {
            // Komga's Vuetify drawer: the nav list is the 3rd child of the NAV
            // element; inject before its last child
            const drawer = Array.from(
                document.querySelectorAll('.v-navigation-drawer__content'),
            ).find((n) => n.parentElement?.tagName === 'NAV')
            const menus = drawer?.children.item(2)
            const last = menus?.children.item(menus.children.length - 1)
            return last ? { insert: 'beforebegin', ref: last } : null
        },
    },
    {
        id: 'library',
        locate: () => {
            const toolbar = document.querySelector('.v-main__wrap .v-toolbar__content')
            if (!toolbar?.parentElement || toolbar.parentElement.classList.contains('hidden-sm-and-up')) return null
            const seg = window.location.pathname.split('/').reverse()
            const slot = toolbar.children.item(4)
            return seg.includes('libraries') && slot ? { insert: 'afterend', ref: slot } : null
        },
    },
    {
        id: 'series',
        locate: () => {
            const toolbar = document.querySelector('.v-main__wrap .v-toolbar__content')
            if (!toolbar?.parentElement || toolbar.parentElement.classList.contains('hidden-sm-and-up')) return null
            const seg = window.location.pathname.split('/').reverse()
            // DETAIL pages only: /series/<id> → seg[1]==='series'; /oneshot/<id>
            // → seg[1]==='oneshot'. A library's series LIST (/libraries/<id>/series)
            // ends with 'series' (seg[0]) and must NOT match — previously the
            // detail-only button leaked onto the list toolbar.
            if (seg[1] === 'series') {
                const slot = toolbar.children.item(4)
                return slot ? { insert: 'afterend', ref: slot } : null
            }
            if (seg[1] === 'oneshot') {
                const edit = Array.from(toolbar.children).find((el) => el.tagName === 'BUTTON')
                return edit ? { insert: 'afterend', ref: edit } : null
            }
            return null
        },
    },
]

useInjection(points, {
    menu: menuElement,
    library: libraryActionsElement,
    series: seriesActionsElement,
})

// Follow the Komga HOST's actual theme first (Vuetify 2 stamps
// theme--dark on .v-application). The data-komf-theme marker drives the
// unified dialog palette, so it must reflect the page, not the script's own
// setting — otherwise a manually-dark Komga gets a light dialog.
// Fall back to the script theme preference when the marker is absent.
const { refresh: refreshTheme } = useHostTheme(hostDarkProbe('komga'), {
    // Observe each theme-stamping root's own class only (no subtree — Vuetify
    // churns descendant classes constantly, and subtree watching on <html>
    // storms the observer and loops on Quasar's own body--dark stamp).
    // Vuetify 2 flips theme--dark on .v-application, Vuetify 3 on <html>;
    // both roots are observed so flips land regardless of the stamp location.
    element: [
        document.documentElement,
        () => document.querySelector('.v-application'),
    ],
    attribute: 'class',
    subtree: false,
})
</script>