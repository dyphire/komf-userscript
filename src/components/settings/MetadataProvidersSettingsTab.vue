<template>
  <q-card flat style="max-height: 750px">
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
      <template v-for="(library,index) in config.libraryProviders" :key="library.id">
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
          <div class="col-auto" style="padding: 0">
            <Sortable
              :list="config.defaultProviders"
              item-key="name"
              :options="sortableOptions"
              :key="config.defaultProviders.length"
              @end="(event)=> moveItemInArray(config.defaultProviders,event.oldIndex!, event.newIndex!)"
              @start="() => hideExpandedProviders()"
            >
              <template #item="{element, index}">
                <q-card bordered class="draggable provider-card q-mb-sm" :key="element.name">
                  <q-card-section class="q-pa-sm">
                    <div class="column">
                      <div class="col-auto" style="padding: 0">
                        <div class="row">
                          <q-icon class="provider-handle"
                                  :size="settings.mediaServer === MediaServer.Komga? 'sm':'xs'"
                                  :name="settings.mediaServer === MediaServer.Komga?'mdi-drag' : 'fa fa-grip-vertical'"
                          />
                          {{ `${index + 1} - ${element.name}` }}
                          <q-space />
                          <q-btn
                            @click="disableProvider(index)"
                            flat
                            round
                            :icon="settings.mediaServer === MediaServer.Komga? 'mdi-close' :'fa fa-xmark'"
                            :size="settings.mediaServer === MediaServer.Komga? 'sm':'xs'"
                          />
                        </div>
                      </div>
                      <div class="col-auto full-width" style="padding: 0">
                        <q-expansion-item :ref="el => addExpansionItemRef(el)"
                                          dense
                                          dense-toggle
                                          expand-separator
                                          label="Options"
                        >
                          <q-card>
                            <q-card-section class="q-pa-sm">
<q-expansion-item dense
                                              dense-toggle
                                              expand-separator
                                              label="Series Metadata"
                                            >

                                            <q-checkbox v-model="config.defaultProviders[index].seriesMetadata.ageRating"
                                                        label="Age Rating"
                                            />
                                            <q-checkbox v-model="config.defaultProviders[index].seriesMetadata.authors"
                                                        label="Authors"
                                            />
                                            <q-checkbox v-model="config.defaultProviders[index].seriesMetadata.thumbnail"
                                                        label="Cover"
                                            />
                                            <q-checkbox v-model="config.defaultProviders[index].seriesMetadata.genres"
                                                        label="Genres"
                                            />
                                            <q-checkbox v-model="config.defaultProviders[index].seriesMetadata.language"
                                                        label="Language"
                                            />
                                            <q-checkbox v-model="config.defaultProviders[index].seriesMetadata.links"
                                                       label="Links"
                                            />
                                            <q-checkbox v-model="config.defaultProviders[index].seriesMetadata.publisher"
                                                        label="Publisher"
                                            />
                                            <q-checkbox v-model="config.defaultProviders[index].seriesMetadata.useOriginalPublisher"
                                                        label="Use Original Publisher"
                                            />
                                            <q-checkbox v-model="config.defaultProviders[index].seriesMetadata.releaseDate"
                                                        label="Release Date"
                                            />
                                            <q-checkbox v-model="config.defaultProviders[index].seriesMetadata.status"
                                                        label="Status"
                                            />
                                            <q-checkbox v-model="config.defaultProviders[index].seriesMetadata.summary"
                                                        label="Summary"
                                            />
                                            <q-checkbox v-model="config.defaultProviders[index].seriesMetadata.tags" label="Tags" />
<q-checkbox v-model="config.defaultProviders[index].seriesMetadata.title"
                                                    label="Title"
                                            />
                                            <q-checkbox v-model="config.defaultProviders[index].seriesMetadata.alternativeTitles"
                                                    label="Alternative Titles"
                                            />
                                            <q-checkbox v-model="config.defaultProviders[index].seriesMetadata.totalBookCount"
                                                        label="Book Count"
                                            />
                                            <q-checkbox v-model="config.defaultProviders[index].seriesMetadata.score"
                                                        label="Score"
                                            />
                              </q-expansion-item>

                              <q-expansion-item dense
                                                dense-toggle
                                                expand-separator
                                                label="Book Metadata"
                                                v-if="config.defaultProviders[index].books"
                              >
                                <q-checkbox v-model="config.defaultProviders[index].seriesMetadata.books"
                                            label="Enabled"
                                />
                                <q-checkbox v-model="config.defaultProviders[index].bookMetadata.authors"
                                            :disable="!config.defaultProviders[index].seriesMetadata.books"
                                            label="Authors"
                                />
                                <q-checkbox v-model="config.defaultProviders[index].bookMetadata.thumbnail"
                                            :disable="!config.defaultProviders[index].seriesMetadata.books"
                                            label="Cover"
                                />
                                <q-checkbox v-model="config.defaultProviders[index].bookMetadata.isbn"
                                            :disable="!config.defaultProviders[index].seriesMetadata.books"
                                            label="ISBN"
                                />
                                <q-checkbox v-model="config.defaultProviders[index].bookMetadata.links"
                                            :disable="!config.defaultProviders[index].seriesMetadata.books"
                                           label="Links"
                                />
                                <q-checkbox v-model="config.defaultProviders[index].bookMetadata.number"
                                            :disable="!config.defaultProviders[index].seriesMetadata.books"
                                            label="Number"
                                />
                                <q-checkbox v-model="config.defaultProviders[index].bookMetadata.releaseDate"
                                            :disable="!config.defaultProviders[index].seriesMetadata.books"
                                            label="Release Date"
                                />
                                <q-checkbox v-model="config.defaultProviders[index].bookMetadata.summary"
                                            :disable="!config.defaultProviders[index].seriesMetadata.books"
                                            label="Summary"
                                />
                                <q-checkbox v-model="config.defaultProviders[index].bookMetadata.tags"
                                            :disable="!config.defaultProviders[index].seriesMetadata.books"
                                            label="Tags"
                                />
                              </q-expansion-item>

                              <q-expansion-item dense
                                                dense-toggle
                                                expand-separator
                                                label="Misc"
                              >

                                <div v-if="config.defaultProviders[index].mediaTypeEnabled" class="col-auto"
                                     style="padding: 8px 0 0 0"
                                >
                                  <q-select v-model="config.defaultProviders[index].mediaType"
                                            :options="mediaTypeOptions"
                                            label="Media Type"
                                            dense
                                            filled
                                  />
                                </div>

                                <div class="col-auto" style="padding: 8px 0 0 0">
                                  <q-select v-model="config.defaultProviders[index].nameMatchingMode"
                                            :options="matchingModeOptions"
                                            label="Name Matching Mode"
                                            dense
                                            filled
                                            clearable
                                  />
                                </div>

                                <div class="col-auto" style="padding: 8px 0 0 0">
                                  <q-select v-model="config.defaultProviders[index].authorRoles"
                                            :options="rolesOptions"
                                            dense
                                            filled
                                            multiple
                                            label="Author Roles"
                                  />
                                </div>

                                <div class="col-auto" style="padding: 8px 0 0 0">
                                  <q-select v-model="config.defaultProviders[index].artistRoles"
                                            :options="rolesOptions"
                                            dense
                                            filled
                                            multiple
                                            label="Artist Roles"
                                  />
                                </div>

                                <div class="col-auto" style="padding: 8px 0 0 0">
                                  <q-input
                                    v-model="config.defaultProviders[index].seriesMetadata.englishPublisherTagName"
                                    label="English Publisher Tag Name"
                                    dense
                                    filled
                                  />
                                </div>
                                <div class="col-auto" style="padding: 8px 0 0 0">
                                  <q-input
                                    v-model="config.defaultProviders[index].seriesMetadata.originalPublisherTagName"
                                    label="Original Publisher Tag Name"
                                    dense
                                    filled
                                  />
                                </div>
                                <div class="col-auto" style="padding: 8px 0 0 0">
                                  <q-input
                                    v-model="config.defaultProviders[index].seriesMetadata.frenchPublisherTagName"
                                    label="French Publisher Tag Name"
                                    dense
                                    filled
                                  />
                                </div>

                                <div v-if="element.name === 'eHentai'" class="col-auto" style="padding: 8px 0 0 0">
                                  <q-input
                                    v-model="config.defaultProviders[index].preferredLanguages"
                                    label="Preferred Languages"
                                    dense
                                    filled
                                    hint="Comma-separated BCP-47 codes (e.g. en, ja)"
                                  />
                                  <q-select
                                    v-model="config.defaultProviders[index].titlePriority"
                                    :options="['jpn', 'eng']"
                                    label="Title Priority"
                                    dense
                                    filled
                                  />
                                  <q-input
                                    v-model="config.defaultProviders[index].translatorKeywords"
                                    label="Translator Keywords"
                                    dense
                                    filled
                                    hint="Comma-separated (e.g. 中国翻訳, 漢化)"
                                  />
                                  <q-input
                                    v-model="config.defaultProviders[index].maleOnlyTagsFile"
                                    label="Male Only Tags File"
                                    dense
                                    filled
                                  />
                                  <q-input
                                    v-model="config.defaultProviders[index].titleTemplate"
                                    label="Title Template"
                                    dense
                                    filled
                                    hint="e.g. {{'{{title}}'}}{% if translator %} [{{'{{ translator }}'}}]{% endif %}"
                                  />
                                  <q-checkbox
                                    v-model="config.defaultProviders[index].tagTranslationEnabled"
                                    label="Tag Translation Enabled"
                                  />
                                  <q-input
                                    v-model="config.defaultProviders[index].tagTranslationUrl"
                                    label="Tag Translation URL"
                                    dense
                                    filled
                                    hint="Custom tag translation JSON URL (empty = official release)"
                                  />
                                  <q-checkbox
                                    v-model="config.defaultProviders[index].gidOnlyMatch"
                                    label="GID Only Match"
                                  />
                                  <q-checkbox
                                    v-model="config.defaultProviders[index].archive!.enabled"
                                    label="Archive Offline (e-hentai-db)"
                                  />
                                  <q-input
                                    v-model="config.defaultProviders[index].archive!.url"
                                    label="Archive Download URL"
                                    dense
                                    filled
                                    hint="Leave empty for URenko nightly"
                                  />
                                  <q-input
                                    v-model="config.defaultProviders[index].archive!.dbFile"
                                    label="Archive DB File Path"
                                    dense
                                    filled
                                    hint="Leave empty for default (workDir/ehentai/e-hentai.db)"
                                  />
                                  <q-input
                                    v-model.number="config.defaultProviders[index].archive!.updateIntervalHours"
                                    label="Archive Update Interval (hours)"
                                    dense
                                    filled
                                    type="number"
                                  />
                                  <q-input
                                    v-model.number="config.defaultProviders[index].archive!.idleReleaseSecs"
                                    label="Archive Idle Release (secs, 0=off)"
                                    dense
                                    filled
                                    type="number"
                                  />
                                  <q-input
                                    v-model="config.defaultProviders[index].archive!.searchCategoryFilter"
                                    label="Archive Category Filter"
                                    dense
                                    filled
                                    hint="Comma-separated (e.g. Doujinshi, Manga); empty = no filter"
                                  />
                                  <q-input
                                    v-model="config.defaultProviders[index].archive!.searchUploaderFilter"
                                    label="Archive Uploader Filter"
                                    dense
                                    filled
                                    hint="Comma-separated uploader names; empty = no filter"
                                  />
                                  <q-select
                                    v-model="config.defaultProviders[index].searchDomain"
                                    :options="['e-hentai', 'exhentai']"
                                    label="Search Domain"
                                    dense
                                    filled
                                  />
                                  <q-input
                                    v-model="config.defaultProviders[index].ipbMemberId"
                                    label="IPB Member Id"
                                    dense
                                    filled
                                  />
                                  <q-input
                                    v-model="config.defaultProviders[index].ipbPassHash"
                                    label="IPB Pass Hash"
                                    dense
                                    filled
                                  />
                                </div>

                                <div v-if="element.name === 'bangumi'" class="col-auto" style="padding: 8px 0 0 0">
                                  <q-input
                                    v-model="config.defaultProviders[index].tagWhitelist"
                                    label="Tag Whitelist"
                                    dense
                                    filled
                                    hint="Comma-separated tags"
                                  />
                                  <q-input
                                    v-model="config.defaultProviders[index].tagWhitelistFile"
                                    label="Tag Whitelist File"
                                    dense
                                    filled
                                  />
                                  <q-toggle
                                    v-model="config.defaultProviders[index].archive!.enabled"
                                    label="Archive Offline"
                                    dense
                                  />
                                  <q-input
                                    v-model="config.defaultProviders[index].archive!.dir"
                                    label="Archive Dir"
                                    dense
                                    filled
                                    hint="Leave empty for default (workDir/bangumi-archive)"
                                  />
                                  <q-input
                                    v-model.number="config.defaultProviders[index].archive!.updateIntervalHours"
                                    label="Archive Update Interval (hours)"
                                    dense
                                    filled
                                    type="number"
                                  />
                                  <q-input
                                    v-model.number="config.defaultProviders[index].archive!.idleReleaseSecs"
                                    label="Archive Idle Release (secs, 0=off)"
                                    dense
                                    filled
                                    type="number"
                                  />
                                </div>

                                <div v-if="element.name === 'mangaDex'" class="col-auto" style="padding: 8px 0 0 0">
                                  <q-input
                                    v-model="config.defaultProviders[index].coverLanguages"
                                    label="Cover Languages"
                                    dense
                                    filled
                                    hint="Comma-separated BCP-47 codes (e.g. en, ja)"
                                  />

                                  <q-select v-model="config.defaultProviders[index].links" :options="['MANGADEX','ANILIST','ANIME_PLANET','BOOKWALKER_JP','MANGA_UPDATES','NOVEL_UPDATES','KITSU','AMAZON','EBOOK_JAPAN','MY_ANIME_LIST','CD_JAPAN','RAW','ENGLISH_TL']" label="Links" multiple dense filled />                                </div>

                                <div v-if="element.name === 'mangaBaka'" class="col-auto" style="padding: 8px 0 0 0">
                                  <q-select v-model="config.defaultProviders[index].mode" :options="['API','DATABASE']" label="Mode" dense filled />
                                </div>

                                <div v-if="element.name === 'aniList'" class="col-auto" style="padding: 8px 0 0 0">
                                  <q-input
                                    v-model.number="config.defaultProviders[index].tagsScoreThreshold"
                                    label="Tags Score Threshold"
                                    dense
                                    filled
                                    type="number"
                                  />
                                  <q-input
                                    v-model.number="config.defaultProviders[index].tagsSizeLimit"
                                    label="Tags Size Limit"
                                    dense
                                    filled
                                    type="number"
                                  />
                                </div>
                              </q-expansion-item>
                            </q-card-section>
                          </q-card>
                        </q-expansion-item>
                      </div>
                    </div>
                  </q-card-section>
                </q-card>
              </template>
            </Sortable>
          </div>

          <div class="col-auto">
            <q-btn color="secondary">
              <div class="col-auto">
                Add New
              </div>
              <div class="col-auto q-ml-sm">
                <q-icon :name="settings.mediaServer === MediaServer.Komga? 'mdi-plus' :'fa fa-plus'" />
              </div>
              <q-menu auto-close>
                <q-list>
                  <q-item
                    v-for="(provider,index) in config.defaultDisabledProviders"
                    clickable
                    @click="enableProvider(index)"
                  >
                    <q-item-section>
                      <q-item-label>{{ provider.name }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>

              </q-menu>
            </q-btn>
          </div>


          <div class="col-auto" style="padding: 8px 0 0 0">
            <q-select v-model="config.nameMatchingMode"
                      :options="matchingModeOptions"
                      label="Name Matching Mode"
                      dense
                      filled
            />
          </div>

          <div class="col-auto" style="padding: 8px 0 0 0">
            <div class="row">
              <div class="col" style="padding: 0">
                <q-input v-model="config.malClientId"
                         label="MyAnimeList ClientId"
                         dense
                         filled
                         :disable="config.malClientIdDisabled"
                />
              </div>
              <div class="col-auto" v-if="config.malClientIdDisabled" style="padding: 0">
                <q-btn
                  @click="config.malClientId=''; config.malClientIdDisabled=false"
                  flat
                  round
                  :icon="settings.mediaServer === MediaServer.Komga? 'mdi-pencil' :'fa fa-pencil'"
                  :size="settings.mediaServer === MediaServer.Komga? 'md':'sm'"
                />
              </div>
            </div>
            <div class="row">
              <div class="col" style="padding: 0">
                <q-input v-model="config.comicVineClientId"
                         label="ComicVine ClientId"
                         dense
                         filled
                         :disable="config.comicVineClientIdDisabled"
                />
              </div>
              <div class="col-auto" v-if="config.comicVineClientIdDisabled" style="padding: 0">
                <q-btn
                  @click="config.comicVineClientId=''; config.comicVineClientIdDisabled=false"
                  flat
                  round
                  :icon="settings.mediaServer === MediaServer.Komga? 'mdi-pencil' :'fa fa-pencil'"
                  :size="settings.mediaServer === MediaServer.Komga? 'md':'sm'"
                />
              </div>
            </div>
          </div>

          <div class="col-auto" style="padding: 8px 0 0 0">
            <div class="row">
              <div class="col" style="padding: 0">
                <q-input v-model="config.bangumiToken"
                         label="Bangumi Token"
                         dense
                         filled
                         :disable="config.bangumiTokenDisabled"
                />
              </div>
              <div class="col-auto" v-if="config.bangumiTokenDisabled" style="padding: 0">
                <q-btn
                  @click="config.bangumiToken=''; config.bangumiTokenDisabled=false"
                  flat
                  round
                  :icon="settings.mediaServer === MediaServer.Komga? 'mdi-pencil' :'fa fa-pencil'"
                  :size="settings.mediaServer === MediaServer.Komga? 'md':'sm'"
                />
              </div>
            </div>
          </div>

          <div class="col-auto" style="padding: 8px 0 0 0">
            <q-input v-model.number="config.comicVineSearchLimit"
                     label="ComicVine Search Limit"
                     dense
                     filled
                     type="number"
            />
          </div>

          <div class="col-auto" style="padding: 8px 0 0 0">
            <q-input v-model="config.comicVineIssueName"
                     label="ComicVine Issue Name"
                     dense
                     filled
            />
          </div>

          <div class="col-auto" style="padding: 8px 0 0 0">
            <q-input v-model="config.comicVineIdFormat"
                     label="ComicVine Id Format"
                     dense
                     filled
                     hint="One of SERIES, VOLUME, ISSUE"
            />
          </div>
        </div>

      </q-tab-panel>

      <template v-for="(library,libraryIndex) in config.libraryProviders" :key="library.id">
        <q-tab-panel :name="library.id" v-if="!library.deleted" style="padding: 8px 0 0 0">
          <Sortable
            :list="config.libraryProviders[libraryIndex].providers"
            item-key="name"
            :options="sortableOptions"
            :key="config.libraryProviders[libraryIndex].providers.length"
            @end="(event)=> moveItemInArray(config.libraryProviders[libraryIndex].providers, event.oldIndex!, event.newIndex!)"
            @start="() => hideExpandedProviders()"
          >
            <template #item="{element, index}">
              <q-card bordered class="draggable provider-card q-mb-sm" :key="element.name">
                <q-card-section class="q-pa-sm">
                  <div class="column">
                    <div class="col-auto" style="padding: 0">
                      <div class="row">
                        <q-icon class="provider-handle"
                                :size="settings.mediaServer === MediaServer.Komga? 'sm':'xs'"
                                :name="settings.mediaServer === MediaServer.Komga?'mdi-drag' : 'fa fa-grip-vertical'"
                        />
                        {{ `${index + 1} - ${element.name}` }}
                        <q-space />
                        <q-btn
                          @click="disableLibraryProvider(libraryIndex,index)"
                          flat
                          round
                          :icon="settings.mediaServer === MediaServer.Komga? 'mdi-close' :'fa fa-xmark'"
                          :size="settings.mediaServer === MediaServer.Komga? 'sm':'xs'"
                        />
                      </div>
                    </div>
                    <div class="col-auto full-width" style="padding: 0">
                      <q-expansion-item :ref="el => addExpansionItemRef(el)"
                                        dense
                                        dense-toggle
                                        expand-separator
                                        label="Options"
                      >
                        <q-card>
                          <q-card-section class="q-pa-sm">
<q-expansion-item dense
                                              dense-toggle
                                              expand-separator
                                              label="Series Metadata"
                                            >

                                            <q-checkbox
                                              v-model="config.libraryProviders[libraryIndex].providers[index].seriesMetadata.ageRating"
                                              label="Age Rating"
                                            />
                                            <q-checkbox
                                              v-model="config.libraryProviders[libraryIndex].providers[index].seriesMetadata.authors"
                                              label="Authors"
                                            />
                                            <q-checkbox
                                              v-model="config.libraryProviders[libraryIndex].providers[index].seriesMetadata.thumbnail"
                                              label="Cover"
                                            />
                                            <q-checkbox
                                              v-model="config.libraryProviders[libraryIndex].providers[index].seriesMetadata.genres"
                                              label="Genres"
                                            />
                                            <q-checkbox
                                              v-model="config.libraryProviders[libraryIndex].providers[index].seriesMetadata.language"
                                              label="Language"
                                            />
                                            <q-checkbox
                                              v-model="config.libraryProviders[libraryIndex].providers[index].seriesMetadata.links"
                                             label="Links"
                                            />
                                            <q-checkbox
                                              v-model="config.libraryProviders[libraryIndex].providers[index].seriesMetadata.publisher"
                                              label="Publisher"
                                            />
                                            <q-checkbox
                                              v-model="config.libraryProviders[libraryIndex].providers[index].seriesMetadata.useOriginalPublisher"
                                              label="Use Original Publisher"
                                            />
                                            <q-checkbox
                                              v-model="config.libraryProviders[libraryIndex].providers[index].seriesMetadata.releaseDate"
                                              label="Release Date"
                                            />
                                            <q-checkbox
                                              v-model="config.libraryProviders[libraryIndex].providers[index].seriesMetadata.status"
                                              label="Status"
                                            />
                                            <q-checkbox
                                              v-model="config.libraryProviders[libraryIndex].providers[index].seriesMetadata.summary"
                                              label="Summary"
                                            />
                                            <q-checkbox
                                              v-model="config.libraryProviders[libraryIndex].providers[index].seriesMetadata.tags"
                                              label="Tags"
                                            />
                                            <q-checkbox
                                              v-model="config.libraryProviders[libraryIndex].providers[index].seriesMetadata.title"
                                              label="Title"
                                            />
                                            <q-checkbox
                                              v-model="config.libraryProviders[libraryIndex].providers[index].seriesMetadata.alternativeTitles"
                                              label="Alternative Titles"
                                            />
                                            <q-checkbox
                                              v-model="config.libraryProviders[libraryIndex].providers[index].seriesMetadata.totalBookCount"
                                              label="Book Count"
                                            />
                                            <q-checkbox
                                              v-model="config.libraryProviders[libraryIndex].providers[index].seriesMetadata.score"
                                              label="Score"
                                            />
                            </q-expansion-item>

                            <q-expansion-item dense
                                              dense-toggle
                                              expand-separator
                                              label="Book Metadata"
                                              v-if="config.libraryProviders[libraryIndex].providers[index].books"
                            >
                              <q-checkbox
                                v-model="config.libraryProviders[libraryIndex].providers[index].seriesMetadata.books"
                                label="Enabled"
                              />
                              <q-checkbox
                                v-model="config.libraryProviders[libraryIndex].providers[index].bookMetadata.authors"
                                :disable="!config.libraryProviders[libraryIndex].providers[index].seriesMetadata.books"
                                label="Authors"
                              />
                              <q-checkbox
                                v-model="config.libraryProviders[libraryIndex].providers[index].bookMetadata.thumbnail"
                                :disable="!config.libraryProviders[libraryIndex].providers[index].seriesMetadata.books"
                                label="Cover"
                              />
                              <q-checkbox
                                v-model="config.libraryProviders[libraryIndex].providers[index].bookMetadata.isbn"
                                :disable="!config.libraryProviders[libraryIndex].providers[index].seriesMetadata.books"
                                label="ISBN"
                              />
                              <q-checkbox
                                v-model="config.libraryProviders[libraryIndex].providers[index].bookMetadata.links"
                                :disable="!config.libraryProviders[libraryIndex].providers[index].seriesMetadata.books"
                               label="Links"
                              />
                              <q-checkbox
                                v-model="config.libraryProviders[libraryIndex].providers[index].bookMetadata.number"
                                :disable="!config.libraryProviders[libraryIndex].providers[index].seriesMetadata.books"
                                label="Number"
                              />
                              <q-checkbox
                                v-model="config.libraryProviders[libraryIndex].providers[index].bookMetadata.releaseDate"
                                :disable="!config.libraryProviders[libraryIndex].providers[index].seriesMetadata.books"
                                label="Release Date"
                              />
                              <q-checkbox
                                v-model="config.libraryProviders[libraryIndex].providers[index].bookMetadata.summary"
                                :disable="!config.libraryProviders[libraryIndex].providers[index].seriesMetadata.books"
                                label="Summary"
                              />
                              <q-checkbox
                                v-model="config.libraryProviders[libraryIndex].providers[index].bookMetadata.tags"
                                :disable="!config.libraryProviders[libraryIndex].providers[index].seriesMetadata.books"
                                label="Tags"
                              />
                            </q-expansion-item>

                            <q-expansion-item dense
                                              dense-toggle
                                              expand-separator
                                              label="Misc"
                            >
                              <div v-if="config.libraryProviders[libraryIndex].providers[index].mediaTypeEnabled"
                                   class="col-auto" style="padding: 8px 0 0 0"
                              >
                                <q-select
                                  v-model="config.libraryProviders[libraryIndex].providers[index].mediaType"
                                  :options="mediaTypeOptions"
                                  label="Media Type"
                                  dense
                                  filled
                                />
                              </div>
                              <div class="col-auto" style="padding: 8px 0 0 0">
                                <q-select
                                  v-model="config.libraryProviders[libraryIndex].providers[index].nameMatchingMode"
                                  :options="matchingModeOptions"
                                  label="Name Matching Mode"
                                  dense
                                  filled
                                  clearable
                                />
                              </div>

                              <div class="col-auto" style="padding: 8px 0 0 0">
                                <q-select v-model="config.libraryProviders[libraryIndex].providers[index].authorRoles"
                                          :options="rolesOptions"
                                          dense
                                          filled
                                          multiple
                                          label="Author Roles"
                                />
                              </div>

                              <div class="col-auto" style="padding: 8px 0 0 0">
                                <q-select v-model="config.libraryProviders[libraryIndex].providers[index].artistRoles"
                                          :options="rolesOptions"
                                          dense
                                          filled
                                          multiple
                                          label="Artist Roles"
                                />
                              </div>

                              <div class="col-auto" style="padding: 8px 0 0 0">
                                <q-input
                                  v-model="config.libraryProviders[libraryIndex].providers[index].seriesMetadata.englishPublisherTagName"
                                  label="English Publisher Tag Name"
                                  dense
                                  filled
                                />
                              </div>
                              <div class="col-auto" style="padding: 8px 0 0 0">
                                <q-input
                                  v-model="config.libraryProviders[libraryIndex].providers[index].seriesMetadata.originalPublisherTagName"
                                  label="Original Publisher Tag Name"
                                  dense
                                  filled
                                />
                              </div>
                              <div class="col-auto" style="padding: 8px 0 0 0">
                                <q-input
                                  v-model="config.libraryProviders[libraryIndex].providers[index].seriesMetadata.frenchPublisherTagName"
                                  label="French Publisher Tag Name"
                                  dense
                                  filled
                                />
                              </div>

                              <div v-if="element.name === 'eHentai'" class="col-auto" style="padding: 8px 0 0 0">
                                <q-input
                                  v-model="config.libraryProviders[libraryIndex].providers[index].preferredLanguages"
                                  label="Preferred Languages"
                                  dense
                                  filled
                                  hint="Comma-separated BCP-47 codes (e.g. en, ja)"
                                />
                                <q-select
                                  v-model="config.libraryProviders[libraryIndex].providers[index].titlePriority"
                                  :options="['jpn', 'eng']"
                                  label="Title Priority"
                                  dense
                                  filled
                                />
                                <q-input
                                  v-model="config.libraryProviders[libraryIndex].providers[index].translatorKeywords"
                                  label="Translator Keywords"
                                  dense
                                  filled
                                  hint="Comma-separated (e.g. 中国翻訳, 漢化)"
                                />
                                <q-input
                                  v-model="config.libraryProviders[libraryIndex].providers[index].maleOnlyTagsFile"
                                  label="Male Only Tags File"
                                  dense
                                  filled
                                />
                                <q-input
                                  v-model="config.libraryProviders[libraryIndex].providers[index].titleTemplate"
                                  label="Title Template"
                                  dense
                                  filled
                                  hint="e.g. {{'{{title}}'}}{% if translator %} [{{'{{ translator }}'}}]{% endif %}"
                                />
                                <q-checkbox
                                  v-model="config.libraryProviders[libraryIndex].providers[index].tagTranslationEnabled"
                                  label="Tag Translation Enabled"
                                />
                                <q-input
                                  v-model="config.libraryProviders[libraryIndex].providers[index].tagTranslationUrl"
                                  label="Tag Translation URL"
                                  dense
                                  filled
                                  hint="Custom tag translation JSON URL (empty = official release)"
                                />
                                <q-checkbox
                                  v-model="config.libraryProviders[libraryIndex].providers[index].gidOnlyMatch"
                                  label="GID Only Match"
                                />
                                <q-checkbox
                                  v-model="config.libraryProviders[libraryIndex].providers[index].archive!.enabled"
                                  label="Archive Offline (e-hentai-db)"
                                />
                                <q-input
                                  v-model="config.libraryProviders[libraryIndex].providers[index].archive!.url"
                                  label="Archive Download URL"
                                  dense
                                  filled
                                  hint="Leave empty for URenko nightly"
                                />
                                <q-input
                                  v-model="config.libraryProviders[libraryIndex].providers[index].archive!.dbFile"
                                  label="Archive DB File Path"
                                  dense
                                  filled
                                  hint="Leave empty for default"
                                />
                                <q-input
                                  v-model.number="config.libraryProviders[libraryIndex].providers[index].archive!.updateIntervalHours"
                                  label="Archive Update Interval (hours)"
                                  dense
                                  filled
                                  type="number"
                                />
                                <q-input
                                  v-model.number="config.libraryProviders[libraryIndex].providers[index].archive!.idleReleaseSecs"
                                  label="Archive Idle Release (secs, 0=off)"
                                  dense
                                  filled
                                  type="number"
                                />
                                <q-input
                                  v-model="config.libraryProviders[libraryIndex].providers[index].archive!.searchCategoryFilter"
                                  label="Archive Category Filter"
                                  dense
                                  filled
                                  hint="Comma-separated (e.g. Doujinshi, Manga); empty = no filter"
                                />
                                <q-input
                                  v-model="config.libraryProviders[libraryIndex].providers[index].archive!.searchUploaderFilter"
                                  label="Archive Uploader Filter"
                                  dense
                                  filled
                                  hint="Comma-separated uploader names; empty = no filter"
                                />
                                <q-select
                                  v-model="config.libraryProviders[libraryIndex].providers[index].searchDomain"
                                  :options="['e-hentai', 'exhentai']"
                                  label="Search Domain"
                                  dense
                                  filled
                                />
                                <q-input
                                  v-model="config.libraryProviders[libraryIndex].providers[index].ipbMemberId"
                                  label="IPB Member Id"
                                  dense
                                  filled
                                />
                                <q-input
                                  v-model="config.libraryProviders[libraryIndex].providers[index].ipbPassHash"
                                  label="IPB Pass Hash"
                                  dense
                                  filled
                                />
                              </div>

                              <div v-if="element.name === 'bangumi'" class="col-auto" style="padding: 8px 0 0 0">
                                <q-input
                                  v-model="config.libraryProviders[libraryIndex].providers[index].tagWhitelist"
                                  label="Tag Whitelist"
                                  dense
                                  filled
                                  hint="Comma-separated tags"
                                />
                                <q-input
                                  v-model="config.libraryProviders[libraryIndex].providers[index].tagWhitelistFile"
                                  label="Tag Whitelist File"
                                  dense
                                  filled
                                />
                                <q-toggle
                                  v-model="config.libraryProviders[libraryIndex].providers[index].archive!.enabled"
                                  label="Archive Offline"
                                  dense
                                />
                                <q-input
                                  v-model="config.libraryProviders[libraryIndex].providers[index].archive!.dir"
                                  label="Archive Dir"
                                  dense
                                  filled
                                  hint="Leave empty for default"
                                />
                                <q-input
                                  v-model.number="config.libraryProviders[libraryIndex].providers[index].archive!.updateIntervalHours"
                                  label="Archive Update Interval (hours)"
                                  dense
                                  filled
                                  type="number"
                                />
                                <q-input
                                  v-model.number="config.libraryProviders[libraryIndex].providers[index].archive!.idleReleaseSecs"
                                  label="Archive Idle Release (secs, 0=off)"
                                  dense
                                  filled
                                  type="number"
                                />
                              </div>

                              <div v-if="element.name === 'mangaDex'" class="col-auto" style="padding: 8px 0 0 0">
                                <q-input
                                  v-model="config.libraryProviders[libraryIndex].providers[index].coverLanguages"
                                  label="Cover Languages"
                                  dense
                                  filled
                                  hint="Comma-separated BCP-47 codes (e.g. en, ja)"
                                />

                                  <q-select v-model="config.libraryProviders[libraryIndex].providers[index].links" :options="['MANGADEX','ANILIST','ANIME_PLANET','BOOKWALKER_JP','MANGA_UPDATES','NOVEL_UPDATES','KITSU','AMAZON','EBOOK_JAPAN','MY_ANIME_LIST','CD_JAPAN','RAW','ENGLISH_TL']" label="Links" multiple dense filled />                              </div>

                                <div v-if="element.name === 'mangaBaka'" class="col-auto" style="padding: 8px 0 0 0">
                                  <q-select v-model="config.libraryProviders[libraryIndex].providers[index].mode" :options="['API','DATABASE']" label="Mode" dense filled />
                                </div>

                              <div v-if="element.name === 'aniList'" class="col-auto" style="padding: 8px 0 0 0">
                                <q-input
                                  v-model.number="config.libraryProviders[libraryIndex].providers[index].tagsScoreThreshold"
                                  label="Tags Score Threshold"
                                  dense
                                  filled
                                  type="number"
                                />
                                <q-input
                                  v-model.number="config.libraryProviders[libraryIndex].providers[index].tagsSizeLimit"
                                  label="Tags Size Limit"
                                  dense
                                  filled
                                  type="number"
                                />
                              </div>
                            </q-expansion-item>
                          </q-card-section>
                        </q-card>
                      </q-expansion-item>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </template>
          </Sortable>

          <q-btn
            class="q-mb-sm"
            color="secondary"
          >
            <div class="col-auto">
              Add New
            </div>
            <div class="col-auto q-ml-sm">
              <q-icon :name="settings.mediaServer === MediaServer.Komga? 'mdi-plus' :'fa fa-plus'" />
            </div>
            <q-menu auto-close>
              <q-list v-for="(provider,index) in config.libraryProviders[libraryIndex].disabledProviders">
                <q-item clickable @click="enableLibraryProvider(libraryIndex,index)">
                  <q-item-section>
                    <q-item-label>{{ provider.name }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>

            </q-menu>
          </q-btn>
        </q-tab-panel>
      </template>

    </q-tab-panels>
  </q-card>

</template>

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import MediaServer from '@/types/mediaServer'
import { useConfigUpdateStore } from '@/stores/configUpdate'
import { Sortable } from 'sortablejs-vue3'
import type { SortableOptions } from 'sortablejs'
import type { AutoScrollOptions } from 'sortablejs/plugins'
import type { QExpansionItem } from 'quasar'
import { QTabPanels } from 'quasar'
import { DefaultProvidersConfig, type ProviderConfigDto } from '@/types/komf-config'

const settings = useSettingsStore()
const configStore = useConfigUpdateStore()
const config = configStore.metadataProviders

const tab = ref('default')
const tabsKey = computed(() => config.libraryProviders.map(p => p.deleted).join())

const expansionItems = ref<Set<(InstanceType<typeof QExpansionItem> | null)>>(new Set())
const matchingModeOptions = ['CLOSEST_MATCH', 'EXACT']
const rolesOptions = ['WRITER', 'PENCILLER', 'INKER', 'COLORIST', 'LETTERER', 'COVER', 'EDITOR', 'TRANSLATOR']
const mediaTypeOptions = ['MANGA', 'NOVEL']

const sortableOptions = computed<SortableOptions | AutoScrollOptions>(() => {
    return {
        draggable: '.draggable',
        animation: 150,
        ghostClass: 'ghost',
        dragClass: 'drag',
        scroll: true,
        scrollSensitivity: 50,
        scrollSpeed: 10,
        bubbleScroll: true,
        handle: '.provider-handle',
        forceFallback: true
    }
})

const tabPanel = ref<InstanceType<typeof QTabPanels> | null>(null)

const moveItemInArray = <T>(array: T[], from: number, to: number) => {
    const item = array.splice(from, 1)[0]
    array.splice(to, 0, item)
}

function hideExpandedProviders() {
    let filteredItems = Array.from(expansionItems.value).filter(item => item != null)
    filteredItems.forEach(item => item!.hide())
    expansionItems.value = new Set(filteredItems)
}

function addExpansionItemRef(item: any) {
    expansionItems.value.add(item)
}

function enableProvider(index: number) {
    let provider = config.defaultDisabledProviders[index]
    provider.enabled = true
    config.defaultProviders.push(provider)
    config.defaultDisabledProviders.splice(index, 1)
}

function enableLibraryProvider(libraryIndex: number, index: number) {
    let provider = config.libraryProviders[libraryIndex].disabledProviders[index]
    provider.enabled = true
    config.libraryProviders[libraryIndex].providers.push(provider)
    config.libraryProviders[libraryIndex].disabledProviders.splice(index, 1)
}

function disableProvider(index: number) {
    let provider = config.defaultProviders[index]
    provider.enabled = false
    config.defaultDisabledProviders.push(provider)
    config.defaultDisabledProviders.sort((a, b) => a.name.localeCompare(b.name))
    config.defaultProviders.splice(index, 1)
}

function disableLibraryProvider(libraryIndex: number, index: number) {
    let provider = config.libraryProviders[libraryIndex].providers[index]
    provider.enabled = false
    config.libraryProviders[libraryIndex].disabledProviders.push(provider)
    config.libraryProviders[libraryIndex].providers.splice(index, 1)
}

async function addLibrary(id: string) {
    let existing = config.libraryProviders.find(library => library.id == id)
    if (existing) {
        existing.deleted = false
        await nextTick()
        tabPanel.value?.goTo(id)
        return
    }

    let defaultProviders = Object.entries(new DefaultProvidersConfig())
        .map(([key, value]) => {
            let books = configStore.providersWithBooks.includes(key)
            let mediaTypeEnabled = configStore.providersWithMediaType.includes(key)
            return {
                name: key,
                books: books,
                mediaTypeEnabled: mediaTypeEnabled,
                ...value as ProviderConfigDto
            }
        }).sort((a, b) => a.name.localeCompare(b.name))
    config.libraryProviders.push({
        id: id,
        name: configStore.libraries.find(l => l.id == id)?.name ?? '',
        deleted: false,
        providers: [],
        disabledProviders: defaultProviders
    })

    await nextTick()
    tabPanel.value?.goTo(id)
}

function removeLibrary(index: number) {
    config.libraryProviders[index].deleted = true
    tabPanel.value?.goTo('default')
}

function getLibraries() {
    let libraryProviders = configStore.metadataProviders.libraryProviders
    return configStore.libraries.filter(library => !libraryProviders.find(libraryConfig => !libraryConfig.deleted && libraryConfig.id == library.id))
}

</script>

<style scoped lang="scss">
@import '../../styles/scoped.scss';

.provider-handle {
  cursor: move;
}

.ghost {
  opacity: 0.5;
  background: $dark;
  border: 1px dashed #ccc;
}

.drag {
  background: $dark;
  max-height: 82px;
  overflow: hidden;
}
</style>
