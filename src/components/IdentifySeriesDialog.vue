<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" :persistent="loading" @keyup.enter="handleEnterKeyPress">
    <q-card class="q-dialog-plugin" style="max-width: 820px; width: 820px">
      <q-card-section>

        <div class="text-h6 gt-xs q-pb-lg">
          <q-icon :name="settings.mediaServer === MediaServer.Komga?
           'mdi-pencil' :'fa fa-pen'"
          />
          Identify
        </div>

        <q-card flat v-if="search">

          <q-toolbar class="lt-sm" id="identify_toolbar">
            <q-btn flat icon="mdi-close" @click="onDialogCancel" />
            <q-toolbar-title>Identify</q-toolbar-title>
            <q-space />
            <q-btn color="secondary" :loading="loading" :disable="loading || form.title === ''" @click="searchSeries">
              Search
            </q-btn>
          </q-toolbar>


          <div class="col">
            <q-input class="q-pt-sm q-pb-sm" v-model="form.title" label="title" filled />
            <q-input class="q-pt-sm q-pb-sm" v-model="form.edition" label="edition" filled />
          </div>

          <q-card-actions align="right" class="gt-xs q-pt-lg q-pb-sm">
            <q-btn :disable="loading" @click="onDialogCancel">Cancel</q-btn>
            <q-btn :loading="loading" :disable="loading || form.title === ''" color="secondary" @click="searchSeries">
              Search
            </q-btn>
          </q-card-actions>
        </q-card>

        <q-card flat v-if="!search && linkHits.length > 0">
          <q-toolbar class="lt-sm">
            <q-btn flat icon="mdi-close" @click="onDialogCancel" />
            <q-toolbar-title>Identify</q-toolbar-title>
            <q-space />
            <q-btn color="secondary" :disable="loading || (!selectedLink && !aggregateMode)" @click="dialogConfirm">Confirm</q-btn>
          </q-toolbar>
          <div class="q-pa-md">
            <div class="text-body2 q-pb-sm">Choose a series link:</div>
            <q-list bordered separator>
              <q-item
                v-if="linkHits.length > 1"
                clickable
                :active="aggregateMode"
                @click="aggregateMode = true; selectedLink = null"
              >
                <q-item-section avatar>
                  <q-icon name="mdi-layers" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Aggregate all providers</q-item-label>
                  <q-item-label caption>Merge metadata from all {{ linkHits.length }} provider links</q-item-label>
                </q-item-section>
              </q-item>
              <q-item
                v-for="(hit, i) in linkHits"
                :key="i"
                clickable
                :active="!aggregateMode && selectedLink === hit"
                @click="aggregateMode = false; selectedLink = hit"
              >
                <q-item-section avatar>
                  <q-icon name="mdi-link" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ hit.label }}</q-item-label>
                  <q-item-label caption>{{ hit.provider }} · {{ hit.providerSeriesId }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
          <q-card-actions align="right" class="gt-xs q-pt-lg q-pb-sm">
            <q-btn :disable="loading" @click="onDialogCancel">Cancel</q-btn>
            <q-btn :loading="loading" color="secondary" :disable="!selectedLink && !aggregateMode" @click="dialogConfirm">Confirm</q-btn>
          </q-card-actions>
        </q-card>

        <q-card flat v-if="results">

          <q-toolbar class="lt-sm">
            <q-btn flat icon="mdi-close" @click="onDialogCancel">
            </q-btn>
            <q-toolbar-title>Identify</q-toolbar-title>
            <q-space />
            <q-btn color="secondary" :disable="!selected" @click="dialogConfirm">Confirm</q-btn>
          </q-toolbar>

          <div class="row">
            <div class="col-auto"
                 style="padding: 16px 16px 16px 16px;"
                 v-for="(item, index) in searchResults"
                 :key="index"
            >
              <identify-card :item="item" :selected="isResultSelected(item)" @on-select-result="selectResult" />
            </div>
          </div>
          <q-card-actions align="right" class="gt-xs q-pt-lg q-pb-sm" v-if="results">
            <q-btn flat :disable="loading" @click="onDialogCancel">Cancel</q-btn>
            <q-btn color="secondary" :disable="!selected || loading" :loading="loading" @click="dialogConfirm">Confirm
            </q-btn>
          </q-card-actions>
        </q-card>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, inject, reactive, ref } from 'vue'
import type { IdentifyRequest, SearchResult } from '@/types/metadata'
import IdentifyCard from '@/components/IdentifyCard.vue'
import type KomfMetadataService from '../services/komf-metadata.service'
import { komfMetadataKey } from '@/injection-keys'
import { useSettingsStore } from '@/stores/settings'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { errorNotification } from '@/errorNotification'
import MediaServer from '@/types/mediaServer'

defineEmits([
    ...useDialogPluginComponent.emits
])
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const metadataService = inject<KomfMetadataService>(
    komfMetadataKey
) as KomfMetadataService

const props = defineProps({
    seriesTitle: {
        type: String
    }
})

const $q = useQuasar()
const settings = useSettingsStore()

const search = ref(true)
const results = ref(false)
const loading = ref(false)
const selected = ref(false)
const form = reactive({ title: props.seriesTitle ?? '', edition: '' })
const edition = ref('')
const searchResults = ref<SearchResult[]>()
const selectedResult = ref<SearchResult>({} as SearchResult)
const linkHits = ref<{ provider: string, providerSeriesId: string, label: string, url: string }[]>([])
const selectedLink = ref<{ provider: string, providerSeriesId: string, label: string, url: string } | null>(null)
const aggregateMode = ref(false)

const seriesId = computed(() => {
    let path = window.location.pathname.split('/')
    return path[path.findIndex(el => el == 'series' || el == 'oneshot') + 1]
})

const libraryId = computed(() => {
    if (settings.mediaServer == MediaServer.Komga) {
        return Array.from(document.querySelector('.v-main__wrap .v-toolbar__content')?.children ?? [])
            .find(el => {
                let link = el.getAttribute('href')
                if (!link) return false
                return /\/libraries.*/.test(link)
            })?.getAttribute('href')!.split('/')[2]
    } else {
        let pathTokens = window.location.pathname.split('/')
        if (pathTokens[1] == 'library') {
            return pathTokens[2]
        } else {
            return undefined
        }
    }
})

async function dialogConfirm() {
    loading.value = true
    await editMetadata()
    onDialogOK()
}

async function searchSeries() {
    loading.value = true
    try {
        searchResults.value = await metadataService.searchSeries(form.title, libraryId.value, seriesId.value)
    } catch (e) {
        errorNotification(e, $q)
        onDialogCancel()
        return
    }
    results.value = true
    search.value = false
    loading.value = false
    edition.value = form.edition
}

async function editMetadata() {
    if (seriesId.value) {
        // aggregateMode 时服务端自动用所有 links（受 aggregateMetadata 控制），
        // 这里传第一个命中作为 fallback provider
        const info = aggregateMode.value ? linkHits.value[0] : selectedLink.value
        const request: IdentifyRequest = {
            libraryId: libraryId.value,
            seriesId: seriesId.value,
            provider: info ? info.provider : selectedResult.value.provider,
            providerSeriesId: info ? info.providerSeriesId : selectedResult.value.resultId,
            edition: edition.value == '' ? undefined : edition.value
        }

        try {
            await metadataService.identifySeries(request)
        } catch (e) {
            errorNotification(e, $q)
            onDialogCancel()
            return
        }
    }
}

function selectResult(searchResult: SearchResult) {
    selectedResult.value = searchResult
    selected.value = true
}

function isResultSelected(item: SearchResult): boolean {
    return selectedResult.value === item
}

function handleEnterKeyPress() {
    if (search.value && !loading.value && form.title) {
        searchSeries()
    }
}

function parseProviderLink(link: { url?: string, label?: string }) {
    const url = (link.url || '').toLowerCase()
    const label = link.label || ''
    if ((url.includes('bgm.tv') || url.includes('bangumi.tv')) && url.includes('/subject/')) {
        const m = url.match(/\/subject\/([^/?]+)/)
        if (m) return { provider: 'bangumi', providerSeriesId: m[1], label, url: link.url || '' }
    }
    if (url.includes('e-hentai.org') || url.includes('exhentai.org')) {
        const m = url.match(/\/g\/([^/]+)\/([^/]+)/)
        if (m) return { provider: 'ehentai', providerSeriesId: m[1] + ';' + m[2], label, url: link.url || '' }
    }
    if (url.includes('anilist.co')) {
        const m = url.match(/\/(anime|manga)\/(\d+)/)
        if (m) return { provider: 'anilist', providerSeriesId: m[2], label, url: link.url || '' }
    }
    if (url.includes('myanimelist.net')) {
        const m = url.match(/\/(anime|manga)\/(\d+)/)
        if (m) return { provider: 'mal', providerSeriesId: m[2], label, url: link.url || '' }
    }
    if (url.includes('mangadex.org')) {
        const m = url.match(/\/title\/([^/?]+)/)
        if (m) return { provider: 'mangadex', providerSeriesId: m[1], label, url: link.url || '' }
    }
    if (url.includes('mangaupdates.com')) {
        const m = url.match(/\/series\/([^/?]+)/) || url.match(/series\.html\?id=(\d+)/)
        if (m) return { provider: 'mangaupdates', providerSeriesId: m[1], label, url: link.url || '' }
    }
    return null
}

async function fetchProviderLink() {
    if (settings.mediaServer == MediaServer.Komga && seriesId.value && settings.linksMatchEnabled) {
        try {
            const resp = await fetch(`/api/v1/series/${seriesId.value}`, { credentials: 'include' })
            if (resp.ok) {
                const s = await resp.json()
                const links = (s.metadata && s.metadata.links) || []
                const hits = links.map(parseProviderLink).filter(Boolean) as { provider: string, providerSeriesId: string, label: string, url: string }[]
                if (hits.length > 0) {
                    linkHits.value = hits
                    selectedLink.value = hits[0]
                    search.value = false
                }
            }
        } catch (_e) { /* ignore */ }
    }
}

fetchProviderLink()
</script>

<style scoped lang="scss">
@import '../styles/scoped.scss';
</style>
