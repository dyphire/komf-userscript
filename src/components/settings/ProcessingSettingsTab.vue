<template>
  <q-tabs
    v-model="tab"
    dense
    class="text-grey"
    active-color="primary"
    indicator-color="primary"
    align="justify"
    narrow-indicator
    :key="tabsKey"
  >
    <q-tab name="default" label="Default" no-caps />
    <template v-for="(library,index) in model.library" :key="library.id">
      <q-tab :name="library.id" v-if="!library.deleted" no-caps>
        <div>
          {{ `${library.name}` }}
          <q-btn flat
                 size="xs"
                 :icon-right="settings.mediaServer === MediaServer.Komga? 'mdi-close' :'fa fa-xmark'"
                 @click="removeLibrary(index)"
          >
          </q-btn>
        </div>
      </q-tab>

    </template>
    <q-btn
      v-if="getLibraries().length"
      flat
    >
      <div class="col-auto">
        Library
      </div>
      <div class="col-auto q-ml-sm">
        <q-icon :name="settings.mediaServer === MediaServer.Komga? 'mdi-plus' :'fa fa-plus'" />
      </div>

      <q-menu fit>
        <q-list dense v-for="(library,index) in getLibraries()">
          <q-item clickable v-close-popup @click="addLibrary(library.id)">
            <q-item-section>
              <q-item-label>{{ library.name }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>

      </q-menu>
    </q-btn>

  </q-tabs>

  <q-separator />

  <q-tab-panels v-model="tab" ref="tabPanel" animated>
    <q-tab-panel name="default" style="padding: 8px 0 0 0">
      <div class="column">
        <div class="col-auto" style="width: 200px; padding: 8px 0 0 0">
          <q-select
            filled
            dense
            v-model="model.default.libraryType"
            :options="libraryTypeOptions"
            label="Library type"
            dropdown-icon="mdi-menu-down"
          />
        </div>
        <div class="row">
          <div class="col-auto">
            <q-checkbox v-model="model.default.aggregateMetadata" label="Aggregate from all providers" />
          </div>
          <div class="col-auto">
            <q-checkbox v-model="model.default.mergeGenres"
                        :disable="!model.default.aggregateMetadata"
                        label="Merge Genres"
            />
          </div>
          <div class="col-auto">
            <q-checkbox v-model="model.default.mergeTags"
                        :disable="!model.default.aggregateMetadata"
                        label="Merge Tags"
            />
          </div>
        </div>

        <div class="col-auto" style="padding: 8px 0 0 0">
          <q-checkbox v-model="model.default.orderBooks" label="Order Books" />
        </div>

        <div class="col-auto" style="padding: 8px 0 0 0">
          <div class="row">
            <div class="col-auto">
              <q-checkbox v-model="model.default.seriesCovers" label="Series Cover" />
            </div>

            <div class="col-auto">
              <q-checkbox v-model="model.default.bookCovers" label="Book Cover" />
            </div>
          </div>
        </div>

        <div v-if="settings.mediaServer === MediaServer.Komga" class="col-auto" style="padding: 8px 0 0 0">
          <q-checkbox v-model="model.default.overrideExistingCovers" label="Override Existing Covers" />
        </div>

        <div class="col-auto" style="padding: 8px 0 0 0">
          <div class="row">
            <div class="col-auto">
              <q-checkbox v-model="model.default.seriesTitle" label="Series Title" />
            </div>
            <div class="col-auto">
              <q-checkbox v-model="model.default.alternativeTitles" label="Alternative Series Titles" />
            </div>
          </div>
        </div>

        <div class="col-auto" style="padding: 8px 0 0 0">
          <div class="row">
            <div class="col-auto" style="width: 200px; margin: 0 16px 0 0">
              <q-input
                v-model="model.default.seriesTitleLanguage"
                label="Title Language"
                filled
                dense
                hint="BCP 47 language tag. ja-ro for romanized"
                hide-hint
                :rules="[val => isLangCode(val).res]"
              />
            </div>

            <div class="col-auto" style="width: 250px">
              <q-select
                v-model="model.default.alternativeTitleLanguages"
                label="Alternative Title Languages"
                filled
                dense
                use-input
                use-chips
                multiple
                hide-dropdown-icon
                input-debounce="0"
                @new-value="createValue"
                hint="BCP 47 language tag. ja-ro for romanized"
                hide-hint
              />
            </div>

          </div>
        </div>

        <div class="col-auto" style="width: 200px; padding: 8px 0 0 0">
          <q-select
            filled
            dense
            v-model="model.default.modes"
            multiple
            :options="updateModeOptions"
            label="Update modes"
            dropdown-icon="mdi-menu-down"
          />
        </div>

        <div class="col-auto" style="padding: 8px 0 0 0">
          <div class="row">
            <div v-if="settings.mediaServer === MediaServer.Komga" class="col-auto"
                 style="width: 200px; margin: 0 16px 0 0"
            >
              <q-select
                filled
                dense
                clearable
                v-model="model.default.readingDirectionValue"
                :options="readingDirectionOptions"
                label="Default Reading Direction"
                dropdown-icon="mdi-menu-down"
              />
            </div>

            <div class="col-auto" style="width: 200px">
              <q-input
                v-model="model.default.languageValue"
                label="Series Default Language"
                dense
                filled
                clearable
                hint="IETF BCP 47 language tag"
                hide-hint
                :rules="[val => val==='' || val==null || isLangCode(val).res]"
              />
            </div>
          </div>
        </div>

        <div class="col-auto">
          <q-checkbox v-model="model.default.lockCovers" label="Lock Covers" />
        </div>

        <div class="col-auto">
          <q-checkbox v-model="model.default.overrideComicInfo" label="Override ComicInfo" />
        </div>

        <div class="col-auto">
          <q-checkbox v-model="model.default.fallbackToAltTitle" label="Fallback to Alt Title" />
        </div>

        <div class="col-auto">
          <q-checkbox v-model="model.default.linksSkipEnabled" label="Links Skip Enabled" />
        </div>

        <div class="col-auto">
          <q-checkbox v-model="model.default.linksMatchEnabled" label="Links Match Enabled" />
        </div>

        <div class="col-auto">
          <q-checkbox v-model="model.default.mylarCovers" label="Mylar Covers" />
        </div>

        <div class="col-auto">
          <q-input
            v-model="model.default.mylarOutputDir"
            label="Mylar Output Dir"
            dense
            filled
            clearable
            hint="Mylar series.json export root dir"
          />
        </div>

        <div class="col-auto">
          <q-input
            v-model="model.default.scoreTagName"
            label="Score Tag Name"
            dense
            filled
            clearable
            hint="e.g. score:"
          />
        </div>

        <div class="col-auto">
          <q-input
            v-model="model.default.originalPublisherTagName"
            label="Original Publisher Tag Name"
            dense
            filled
            clearable
          />
        </div>

        <div class="col-auto">
          <div class="text-body2 q-pb-xs">Publisher Tag Names</div>
          <div v-for="(pt, i) in model.default.publisherTagNames" :key="i" class="row q-px-sm q-pb-xs items-start">
            <q-input v-model="pt.tagName" label="Tag" dense filled class="col" />
            <q-input v-model="pt.language" label="Language" dense filled class="col" hint="BCP-47 e.g. en, zh" />
            <q-btn flat round icon="mdi-delete" size="sm" class="q-mt-sm" @click="model.default.publisherTagNames.splice(i, 1)" />
          </div>
          <q-btn flat round icon="mdi-plus" size="sm" label="Add" @click="model.default.publisherTagNames.push({ tagName: '', language: '' })" />
        </div>

        <div class="col-auto">
          <q-input
            v-model="model.default.alternateTitleLabels.romaji"
            label="Alt Title Label (Romaji)"
            dense
            filled
            clearable
            hint="Empty = default Romaji"
          />
        </div>

        <div class="col-auto">
          <q-input
            v-model="model.default.alternateTitleLabels.native"
            label="Alt Title Label (Native)"
            dense
            filled
            clearable
            hint="Empty = default Native"
          />
        </div>

        <div class="col-auto">
          <q-input
            v-model="model.default.alternateTitleLabels.localized"
            label="Alt Title Label (Localized)"
            dense
            filled
            clearable
            hint="Empty = default Localized"
          />
        </div>

        <div class="col-auto">
          <q-input
            v-model="model.default.failedMatchCollectionName"
            label="Failed Match Collection Name"
            dense
            filled
            clearable
            hint="Auto-Identify Library failed series collection"
          />
        </div>



        <div class="col-12" style="padding: 8px 0 0 0">
          <q-expansion-item
            dense
            dense-toggle
            expand-separator
            label="Search Title Extraction"
          >
            <div class="row q-col-gutter-sm">
              <div class="col-auto" style="width: 200px">
                <q-checkbox v-model="model.default.searchTitleExtraction.enabled" label="Enabled" />
              </div>
              <div class="col-auto" style="width: 200px">
                <q-input
                  v-model="model.default.searchTitleExtraction.bracketRegex"
                  label="Bracket Regex"
                  dense
                  filled
                  clearable
                />
              </div>
            </div>
            <div class="row q-col-gutter-sm">
              <div class="col-auto" style="width: 200px">
                <q-input
                  v-model="model.default.searchTitleExtraction.authorSeparator"
                  label="Author Separator"
                  dense
                  filled
                  clearable
                />
              </div>
              <div class="col-auto" style="width: 200px">
                <q-input
                  v-model="model.default.searchTitleExtraction.symbolNormalizeRegex"
                  label="Symbol Normalize Regex"
                  dense
                  filled
                  clearable
                />
              </div>
            </div>
            <div class="row q-col-gutter-sm">
              <div class="col-auto" style="width: 200px">
                <q-input
                  v-model="model.default.searchTitleExtraction.titleSplitters"
                  label="Title Splitters"
                  dense
                  filled
                  clearable
                  hint="Comma-separated"
                  hide-hint
                />
              </div>
              <div class="col-auto" style="width: 200px">
                <q-input
                  v-model="model.default.searchTitleExtraction.charMappings"
                  label="Char Mappings"
                  dense
                  filled
                  clearable
                  hint='JSON array, e.g. [["／","/"]]'
                  hide-hint
                />
              </div>
            </div>
            <div class="row q-col-gutter-sm">
              <div class="col-auto" style="width: 200px">
                <q-input
                  v-model="model.default.searchTitleExtraction.cleanupRegex"
                  label="Cleanup Regex"
                  dense
                  filled
                  clearable
                  hint="Comma-separated regexes"
                  hide-hint
                />
              </div>
            </div>
          </q-expansion-item>
        </div>

        <div class="col-12" style="padding: 8px 0 16px 0">
          <q-expansion-item
            dense
            dense-toggle
            expand-separator
            label="Chinese Conversion"
          >
            <div class="row q-col-gutter-sm">
              <div class="col-auto" style="width: 200px">
                <q-checkbox v-model="model.default.chineseConversion.enabled" label="Enabled" />
              </div>
              <div class="col-auto" style="width: 200px">
                <q-select
                  v-model="model.default.chineseConversion.direction"
                  :options="['t2s', 's2t']"
                  label="Direction"
                  dense
                  filled
                />
              </div>
            </div>
            <div class="row q-col-gutter-sm">
              <div class="col-auto" style="width: 200px">
                <q-checkbox v-model="model.default.chineseConversion.search" label="Search" />
              </div>
              <div class="col-auto" style="width: 200px">
                <q-checkbox v-model="model.default.chineseConversion.matching" label="Matching" />
              </div>
            </div>
            <div class="row q-col-gutter-sm">
              <div class="col-auto" style="width: 200px">
                <q-checkbox v-model="model.default.chineseConversion.update.enabled" label="Update Enabled" />
              </div>
              <div class="col-auto" style="width: 200px">
                <q-input
                  v-model="model.default.chineseConversion.update.fields"
                  label="Update Fields"
                  dense
                  filled
                  clearable
                  hint="Comma-separated: title, genres, tags, summary"
                  hide-hint
                />
              </div>
            </div>
          </q-expansion-item>
        </div>

      </div>
    </q-tab-panel>

    <template v-for="(library,libraryIndex) in model.library" :key="library.id">
      <q-tab-panel :name="library.id" v-if="!library.deleted" style="padding: 8px 0 0 0">
        <div class="column">
          <div class="col-auto" style="width: 200px; padding: 8px 0 0 0">
            <q-select
              filled
              dense
              v-model="model.library[libraryIndex].libraryType"
              :options="libraryTypeOptions"
              label="Library type"
              dropdown-icon="mdi-menu-down"
            />
          </div>
          <div class="row">
            <div class="col-auto">
              <q-checkbox v-model="model.library[libraryIndex].aggregateMetadata"
                          label="Aggregate from all providers"
              />
            </div>

            <div class="col-auto">
              <q-checkbox v-model="model.library[libraryIndex].mergeGenres"
                          :disable="!model.library[libraryIndex].aggregateMetadata"
                          label="Merge Genres"
              />
            </div>
            <div class="col-auto">
              <q-checkbox v-model="model.library[libraryIndex].mergeTags"
                          :disable="!model.library[libraryIndex].aggregateMetadata"
                          label="Merge Tags"
              />
            </div>
          </div>

          <div class="col-auto" style="padding: 8px 0 0 0">
            <q-checkbox v-model="model.library[libraryIndex].orderBooks" label="Order Books" />
          </div>

          <div class="col-auto" style="padding: 8px 0 0 0">
            <div class="row">
              <div class="col-auto">
                <q-checkbox v-model="model.library[libraryIndex].seriesCovers" label="Series Cover" />
              </div>

              <div class="col-auto">
                <q-checkbox v-model="model.library[libraryIndex].bookCovers" label="Book Cover" />
              </div>
            </div>
          </div>

          <div v-if="settings.mediaServer === MediaServer.Komga" class="col-auto" style="padding: 8px 0 0 0">
            <q-checkbox v-model="model.library[libraryIndex].overrideExistingCovers" label="Override Existing Covers" />
          </div>

          <div class="col-auto" style="padding: 8px 0 0 0">
            <div class="row">
              <div class="col-auto">
                <q-checkbox v-model="model.library[libraryIndex].seriesTitle" label="Series Title" />
              </div>
              <div class="col-auto">
                <q-checkbox v-model="model.library[libraryIndex].alternativeTitles" label="Alternative Series Titles" />
              </div>
            </div>
          </div>

          <div class="col-auto" style="padding: 8px 0 0 0">
            <div class="row">
              <div class="col-auto" style="width: 200px; margin: 0 16px 0 0">
                <q-input
                  v-model="model.library[libraryIndex].seriesTitleLanguage"
                  label="Title Language"
                  filled
                  dense
                  hint="BCP 47 language tag. ja-ro for romanized"
                  hide-hint
                  :rules="[val => isLangCode(val).res]"
                />
              </div>

              <div class="col-auto" style="width: 250px">
                <q-select
                  v-model="model.library[libraryIndex].alternativeTitleLanguages"
                  label="Alternative Title Languages"
                  filled
                  dense
                  use-input
                  use-chips
                  multiple
                  hide-dropdown-icon
                  input-debounce="0"
                  new-value-mode="add-unique"
                  hint="BCP 47 language tag. ja-ro for romanized"
                  hide-hint
                />
              </div>
            </div>
          </div>

          <div class="col-auto" style="width: 200px; padding: 8px 0 0 0">
            <q-select
              filled
              dense
              v-model="model.library[libraryIndex].modes"
              multiple
              :options="updateModeOptions"
              label="Update modes"
              dropdown-icon="mdi-menu-down"
            />
          </div>

          <div class="col-auto" style="padding: 8px 0 0 0">
            <div class="row">
              <div v-if="settings.mediaServer === MediaServer.Komga" class="col-auto"
                   style="width: 200px; margin: 0 16px 0 0"
              >
                <q-select
                  filled
                  dense
                  clearable
                  v-model="model.library[libraryIndex].readingDirectionValue"
                  :options="readingDirectionOptions"
                  label="Default Reading Direction"
                  dropdown-icon="mdi-menu-down"
                />
              </div>

              <div class="col-auto" style="width: 200px">
                <q-input
                  v-model="model.library[libraryIndex].languageValue"
                  label="Series Default Language"
                  dense
                  filled
                  clearable
                  hint="IETF BCP 47 language tag"
                  hide-hint
                  :rules="[val => val==='' || val==null || isLangCode(val).res]"
                />
              </div>
            </div>
          </div>

          <div class="col-auto">
            <q-checkbox v-model="model.library[libraryIndex].lockCovers" label="Lock Covers" />
          </div>

          <div class="col-auto">
            <q-checkbox v-model="model.library[libraryIndex].overrideComicInfo" label="Override ComicInfo" />
          </div>

          <div class="col-auto">
            <q-checkbox v-model="model.library[libraryIndex].fallbackToAltTitle" label="Fallback to Alt Title" />
          </div>

          <div class="col-auto">
            <q-checkbox v-model="model.library[libraryIndex].linksSkipEnabled" label="Links Skip Enabled" />
          </div>

          <div class="col-auto">
            <q-checkbox v-model="model.library[libraryIndex].linksMatchEnabled" label="Links Match Enabled" />
          </div>

          <div class="col-auto">
            <q-checkbox v-model="model.library[libraryIndex].mylarCovers" label="Mylar Covers" />
          </div>

          <div class="col-auto">
            <q-input
              v-model="model.library[libraryIndex].mylarOutputDir"
              label="Mylar Output Dir"
              dense
              filled
              clearable
              hint="Mylar series.json export root dir"
            />
          </div>

          <div class="col-auto">
            <q-input
              v-model="model.library[libraryIndex].scoreTagName"
              label="Score Tag Name"
              dense
              filled
              clearable
              hint="e.g. score:"
            />
          </div>

          <div class="col-auto">
            <q-input
              v-model="model.library[libraryIndex].originalPublisherTagName"
              label="Original Publisher Tag Name"
              dense
              filled
              clearable
            />
          </div>

          <div class="col-auto">
            <div class="text-body2 q-pb-xs">Publisher Tag Names</div>
            <div v-for="(pt, i) in model.library[libraryIndex].publisherTagNames" :key="i" class="row q-px-sm q-pb-xs items-start">
              <q-input v-model="pt.tagName" label="Tag" dense filled class="col" />
              <q-input v-model="pt.language" label="Language" dense filled class="col" hint="BCP-47 e.g. en, zh" />
              <q-btn flat round icon="mdi-delete" size="sm" class="q-mt-sm" @click="model.library[libraryIndex].publisherTagNames.splice(i, 1)" />
            </div>
            <q-btn flat round icon="mdi-plus" size="sm" label="Add" @click="model.library[libraryIndex].publisherTagNames.push({ tagName: '', language: '' })" />
          </div>

          <div class="col-auto">
            <q-input
              v-model="model.library[libraryIndex].alternateTitleLabels.romaji"
              label="Alt Title Label (Romaji)"
              dense
              filled
              clearable
              hint="Empty = default Romaji"
            />
          </div>

          <div class="col-auto">
            <q-input
              v-model="model.library[libraryIndex].alternateTitleLabels.native"
              label="Alt Title Label (Native)"
              dense
              filled
              clearable
              hint="Empty = default Native"
            />
          </div>

          <div class="col-auto">
            <q-input
              v-model="model.library[libraryIndex].alternateTitleLabels.localized"
              label="Alt Title Label (Localized)"
              dense
              filled
              clearable
              hint="Empty = default Localized"
            />
          </div>

          <div class="col-auto">
            <q-input
              v-model="model.library[libraryIndex].failedMatchCollectionName"
              label="Failed Match Collection Name"
              dense
              filled
              clearable
              hint="Auto-Identify Library failed series collection"
            />
          </div>



          <div class="col-12" style="padding: 8px 0 0 0">
            <q-expansion-item
              dense
              dense-toggle
              expand-separator
              label="Search Title Extraction"
            >
              <div class="row q-col-gutter-sm">
                <div class="col-auto" style="width: 200px">
                  <q-checkbox v-model="model.library[libraryIndex].searchTitleExtraction.enabled" label="Enabled" />
                </div>
                <div class="col-auto" style="width: 200px">
                  <q-input
                    v-model="model.library[libraryIndex].searchTitleExtraction.bracketRegex"
                    label="Bracket Regex"
                    dense
                    filled
                    clearable
                  />
                </div>
              </div>
              <div class="row q-col-gutter-sm">
                <div class="col-auto" style="width: 200px">
                  <q-input
                    v-model="model.library[libraryIndex].searchTitleExtraction.authorSeparator"
                    label="Author Separator"
                    dense
                    filled
                    clearable
                  />
                </div>
                <div class="col-auto" style="width: 200px">
                  <q-input
                    v-model="model.library[libraryIndex].searchTitleExtraction.symbolNormalizeRegex"
                    label="Symbol Normalize Regex"
                    dense
                    filled
                    clearable
                  />
                </div>
              </div>
              <div class="row q-col-gutter-sm">
                <div class="col-auto" style="width: 200px">
                  <q-input
                    v-model="model.library[libraryIndex].searchTitleExtraction.titleSplitters"
                    label="Title Splitters"
                    dense
                    filled
                    clearable
                    hint="Comma-separated"
                    hide-hint
                  />
                </div>
                <div class="col-auto" style="width: 200px">
                  <q-input
                    v-model="model.library[libraryIndex].searchTitleExtraction.charMappings"
                    label="Char Mappings"
                    dense
                    filled
                    clearable
                    hint='JSON array, e.g. [["／","/"]]'
                    hide-hint
                  />
                </div>
              </div>
              <div class="row q-col-gutter-sm">
                <div class="col-auto" style="width: 200px">
                  <q-input
                    v-model="model.library[libraryIndex].searchTitleExtraction.cleanupRegex"
                    label="Cleanup Regex"
                    dense
                    filled
                    clearable
                    hint="Comma-separated regexes"
                    hide-hint
                  />
                </div>
              </div>
            </q-expansion-item>
          </div>

          <div class="col-12" style="padding: 8px 0 16px 0">
            <q-expansion-item
              dense
              dense-toggle
              expand-separator
              label="Chinese Conversion"
            >
              <div class="row q-col-gutter-sm">
                <div class="col-auto" style="width: 200px">
                  <q-checkbox v-model="model.library[libraryIndex].chineseConversion.enabled" label="Enabled" />
                </div>
                <div class="col-auto" style="width: 200px">
                  <q-select
                    v-model="model.library[libraryIndex].chineseConversion.direction"
                    :options="['t2s', 's2t']"
                    label="Direction"
                    dense
                    filled
                  />
                </div>
              </div>
              <div class="row q-col-gutter-sm">
                <div class="col-auto" style="width: 200px">
                  <q-checkbox v-model="model.library[libraryIndex].chineseConversion.search" label="Search" />
                </div>
                <div class="col-auto" style="width: 200px">
                  <q-checkbox v-model="model.library[libraryIndex].chineseConversion.matching" label="Matching" />
                </div>
              </div>
              <div class="row q-col-gutter-sm">
                <div class="col-auto" style="width: 200px">
                  <q-checkbox v-model="model.library[libraryIndex].chineseConversion.update.enabled" label="Update Enabled" />
                </div>
                <div class="col-auto" style="width: 200px">
                  <q-input
                    v-model="model.library[libraryIndex].chineseConversion.update.fields"
                    label="Update Fields"
                    dense
                    filled
                    clearable
                    hint="Comma-separated: title, genres, tags, summary"
                    hide-hint
                  />
                </div>
              </div>
            </q-expansion-item>
          </div>

        </div>
      </q-tab-panel>
    </template>
  </q-tab-panels>
</template>

<script setup lang="ts">
import { useSettingsStore } from '@/stores/settings'
import { useConfigUpdateStore } from '@/stores/configUpdate'
import { isLangCode } from 'is-language-code'
import MediaServer from '@/types/mediaServer'
import { QInput, QSelect, QTabPanels, QExpansionItem } from 'quasar'
import { computed, nextTick, ref } from 'vue'

const settings = useSettingsStore()
let config = useConfigUpdateStore()


const updateModeOptions = ['API', 'COMIC_INFO', 'MYLAR_SERIES_JSON']
const libraryTypeOptions = ['MANGA', 'NOVEL', 'COMIC']
const readingDirectionOptions = ['LEFT_TO_RIGHT', 'RIGHT_TO_LEFT', 'VERTICAL', 'WEBTOON']
const model = settings.mediaServer === MediaServer.Kavita
    ? config.kavitaMetadata
    : config.komgaMetadata

const tab = ref('default')
const tabsKey = computed(() => model.library.map(p => p.deleted).join())
const tabPanel = ref<InstanceType<typeof QTabPanels> | null>(null)

async function addLibrary(id: string) {
    let existing = model.library.find(library => library.id == id)
    if (existing) {
        existing.deleted = false
        await nextTick()
        tabPanel.value?.goTo(id)
        return
    }
    model.library.push({
        id: id,
        name: config.libraries.find(l => l.id == id)?.name ?? '',
        deleted: false,

        libraryType: 'MANGA',
        aggregateMetadata: false,
        mergeTags: false,
        mergeGenres: false,
        modes: ['API'],
        bookCovers: false,
        seriesCovers: false,
        overrideExistingCovers: true,
        lockCovers: true,
        overrideComicInfo: false,
        seriesTitle: false,
        seriesTitleLanguage: 'en',
        alternativeTitles: false,
        alternativeTitleLanguages: ['en', 'ja', 'ja-ro'],
        fallbackToAltTitle: false,
        orderBooks: false,
        readingDirectionValue: null,
        languageValue: null,
        scoreTagName: null,
        originalPublisherTagName: null,
        publisherTagNames: [],
        alternateTitleLabels: { romaji: null, native: null, localized: null },
        linksSkipEnabled: true,
        linksMatchEnabled: true,
        searchTitleExtraction: {
            enabled: false,
            bracketRegex: null,
            authorSeparator: null,
            titleSplitters: [],
            symbolNormalizeRegex: "[:：•·․,，。'’?？!！~⁓～]",
            charMappings: [],
            cleanupRegex: []
        },
        failedMatchCollectionName: null,
        mylarCovers: false,
        mylarOutputDir: null,
        chineseConversion: {
            enabled: false,
            direction: 't2s',
            search: true,
            matching: true,
            update: { enabled: true, fields: ['title'] }
        }
    })

    await nextTick()
    tabPanel.value?.goTo(id)
}

function removeLibrary(index: number) {
    model.library[index].deleted = true
    tabPanel.value?.goTo('default')
}

function getLibraries() {
    let libraryConfigs = model.library
    return config.libraries.filter(library => !libraryConfigs.find(conf => !conf.deleted && conf.id == library.id))
}

function createValue(val: string, done: Function) {
    if (isLangCode(val).res) done(val, 'add-unique')
}

</script>

<style scoped lang="scss">
@import '../../styles/scoped.scss';
</style>
