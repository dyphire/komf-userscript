<template>
  <q-menu class="text-body2 text-weight-medium" @before-show="syncTheme">
    <q-item clickable @click="promptIdentifySeries" v-close-popup>
      <q-item-section no-wrap>Identify</q-item-section>
    </q-item>
    <q-item clickable @click="autoIdentify" v-close-popup>
      <q-item-section no-wrap>Auto-Identify</q-item-section>
    </q-item>
    <q-item clickable @click="promptResetSeries" v-close-popup>
      <q-item-section no-wrap>Reset Metadata</q-item-section>
    </q-item>
  </q-menu>

  <q-dialog v-model="loading" maximized transition-duration="0">
    <div class="q-pa-md flex flex-center" style="background-color: rgba(89, 89, 89, 0.5)">
      <q-circular-progress indeterminate rounded size="50px" color="lime" class="q-ma-md" />
    </div>
  </q-dialog>
</template>

<script setup lang="ts">
import { inject, ref } from 'vue'
import type KomfMetadataService from '../services/komf-metadata.service'
import ConfirmationDialog from '@/components/ConfirmationDialog.vue'
import IdentifySeriesDialog from '@/components/IdentifySeriesDialog.vue'
import { komfMetadataKey } from '@/injection-keys'
import { useQuasar } from 'quasar'
import { errorNotification } from '@/errorNotification'
import { hostDarkProbe, detectHost } from '@/host'
import { useHostTheme } from '@/composables/useHostTheme'

const $q = useQuasar()

// Keep the Quasar dark state in sync with the host each time this menu opens,
// so a theme flip on the host page is reflected immediately.
const { refresh: syncTheme } = useHostTheme(hostDarkProbe(detectHost(document.title)))

const metadataService = inject<KomfMetadataService>(komfMetadataKey) as KomfMetadataService

const loading = ref(false)

function seriesId() {
    let path = window.location.pathname.split('/')
    return path[path.findIndex(el => el == 'series' || el == 'oneshot') + 1]
}

async function resolveContext() {
    return metadataService.resolveSeriesContext(seriesId())
}

function promptIdentifySeries() {
    resolveContext().then(({ title }) => {
        $q.dialog({
            component: IdentifySeriesDialog,

            componentProps: {
                seriesTitle: title || ''
            }
        })
    }).catch(() => {
        $q.dialog({
            component: IdentifySeriesDialog,

            componentProps: {
                seriesTitle: ''
            }
        })
    })
}

function promptResetSeries() {
    $q.dialog({
        component: ConfirmationDialog,

        componentProps: {
            title: 'Reset Series',
            bodyHtml: 'All series metadata will be reset including field locks and thumbnails uploaded by Komf. No files will be modified. Continue?',
            confirmText: 'Yes, reset series',
            buttonConfirm: 'Reset',
            buttonConfirmColor: 'negative'
        }
    }).onOk(() => {
        resetSeries()
    })
}

async function resetSeries() {
    try {
        const { libraryId } = await resolveContext()
        if (!libraryId) throw new Error('Could not resolve library id')
        await metadataService?.resetSeries(libraryId, seriesId())
    } catch (e) {
        errorNotification(e, $q)
    }
}

async function autoIdentify() {
    loading.value = true
    try {
        const { libraryId } = await resolveContext()
        if (!libraryId) throw new Error('Could not resolve library id')
        await metadataService.matchSeries(libraryId, seriesId())
    } catch (e) {
        errorNotification(e, $q)
    }
    loading.value = false
}
</script>

<style scoped lang="scss">
@import '../styles/scoped.scss';
</style>
