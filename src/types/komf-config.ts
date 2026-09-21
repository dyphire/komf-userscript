export interface PublisherTagNameDto {
    tagName: string,
    language: string,
}

export interface KomfConfigUpdateDto {
    komga?: KomgaConfigUpdateDto,
    kavita?: KavitaConfigUpdateDto,
    notifications?: TopLevelNotificationsUpdateDto,
    metadataProviders?: MetadataProvidersConfigUpdateDto
}

export interface TopLevelNotificationsUpdateDto {
    discord?: DiscordConfigUpdateDto,
    apprise?: AppriseConfigUpdateDto,
}

export interface KomgaConfigUpdateDto {
    baseUri?: string,
    komgaUser?: string,
    komgaPassword?: string,
    apiKey?: string,
    eventListener?: EventListenerConfigUpdateDto,
    notifications?: NotificationConfigUpdateDto,
    metadataUpdate?: MetadataUpdateConfigUpdateDto,
}

export interface KavitaConfigUpdateDto {
    baseUri?: string,
    apiKey?: string,
    eventListener?: EventListenerConfigUpdateDto,
    notifications?: NotificationConfigUpdateDto,
    metadataUpdate?: MetadataUpdateConfigUpdateDto,
}

export interface DiscordConfigUpdateDto {
    webhooks?: Record<number, (string | null)>,
    seriesCover?: boolean,
}

export interface AppriseConfigUpdateDto {
    urls?: Record<number, (string | null)>,
    seriesCover?: boolean,
}

export interface EventListenerConfigUpdateDto {
    enabled?: boolean,
    metadataLibraryFilter?: string[],
    metadataSeriesExcludeFilter?: string[],
    notificationsLibraryFilter?: string[]
}

export interface NotificationConfigUpdateDto {
    libraries?: string [],
}

export interface MetadataUpdateConfigUpdateDto {
    default?: MetadataProcessingConfigUpdateDto,
    library?: Record<string, MetadataProcessingConfigUpdateDto | null>
}

export interface MetadataProcessingConfigUpdateDto {
    libraryType?: string,
    aggregate?: boolean,
    mergeTags?: boolean,
    mergeGenres?: boolean,
    bookCovers?: boolean,
    seriesCovers?: boolean,
    overrideExistingCovers?: boolean,
    lockCovers?: boolean,
    overrideComicInfo?: boolean,
    updateModes?: string[],
    postProcessing?: MetadataPostProcessingConfigUpdateDto,
    searchTitleExtraction?: SearchTitleExtractionConfigUpdateDto,
    failedMatchCollectionName?: string | null,
    mylarCovers?: boolean,
    mylarOutputDir?: string | null,
    chineseConversion?: ChineseConversionConfigUpdateDto
}

export interface SearchTitleExtractionConfigUpdateDto {
    enabled?: boolean,
    bracketRegex?: string | null,
    authorSeparator?: string | null,
    titleSplitters?: string[],
    symbolNormalizeRegex?: string | null,
    charMappings?: string[][],
    cleanupRegex?: string[]
}

export interface ChineseConversionUpdateFields {
    enabled?: boolean,
    fields?: string[]
}

export interface ChineseConversionConfigUpdateDto {
    enabled?: boolean,
    direction?: string,
    search?: boolean,
    matching?: boolean,
    update?: ChineseConversionUpdateFields
}

export interface AlternateTitleLabelsUpdateDto {
    romaji?: string | null,
    native?: string | null,
    localized?: string | null
}

export interface MetadataPostProcessingConfigUpdateDto {
    seriesTitle?: boolean,
    seriesTitleLanguage?: string,
    orderBooks?: boolean,
    alternativeSeriesTitles?: boolean,
    alternativeSeriesTitleLanguages?: string[],
    fallbackToAltTitle?: boolean,
    readingDirectionValue?: string | null,
    languageValue?: string | null,
    scoreTagName?: string | null,
    originalPublisherTagName?: string | null,
    publisherTagNames?: PublisherTagNameDto[],
    alternateTitleLabels?: AlternateTitleLabelsUpdateDto,
    linksSkipEnabled?: boolean,
    linksMatchEnabled?: boolean
}

export interface MetadataProvidersConfigUpdateDto {
    malClientId?: string,
    comicVineClientId?: string,
    bangumiToken?: string,
    comicVineSearchLimit?: number | null,
    comicVineIssueName?: string | null,
    comicVineIdFormat?: string | null,
    nameMatchingMode?: string,
    defaultProviders?: ProvidersConfigUpdateDto,
    libraryProviders?: Record<string, ProvidersConfigUpdateDto>,
}

export interface ProvidersConfigUpdateDto {
    mangaUpdates?: ProviderConfigUpdateDto,
    mal?: ProviderConfigUpdateDto,
    nautiljon?: ProviderConfigUpdateDto,
    aniList?: ProviderConfigUpdateDto,
    yenPress?: ProviderConfigUpdateDto,
    kodansha?: ProviderConfigUpdateDto,
    viz?: ProviderConfigUpdateDto,
    bookWalker?: ProviderConfigUpdateDto,
    mangaDex?: ProviderConfigUpdateDto,
    bangumi?: ProviderConfigUpdateDto,
    comicVine?: ProviderConfigUpdateDto,
    mangaBaka?: ProviderConfigUpdateDto,
    webtoons?: ProviderConfigUpdateDto,
    eHentai?: ProviderConfigUpdateDto,
}

export interface ProviderConfigUpdateDto {
    mediaType?: string,
    nameMatchingMode?: string,
    authorRoles?: string[],
    artistRoles?: string[],
    priority?: number,
    enabled?: boolean,
    seriesMetadata?: SeriesMetadataConfigUpdateDto,
    bookMetadata?: BookMetadataConfigUpdateDto,
    // eHentai specific
    preferredLanguages?: any,
    titlePriority?: string,
    translatorKeywords?: any,
    maleOnlyTagsFile?: string | null,
    titleTemplate?: string,
    tagTranslationEnabled?: boolean,
    tagTranslationUrl?: string,
    gidOnlyMatch?: boolean,
    searchDomain?: string,
    ipbMemberId?: string | null,
    ipbPassHash?: string | null,
    // bangumi specific
    tagWhitelist?: any,
    tagWhitelistFile?: string | null,
    archive?: any,
    // mangaDex specific
    coverLanguages?: any,
    // aniList specific
    tagsScoreThreshold?: number,
    tagsSizeLimit?: number,
    // mangaBaka specific
    mode?: string,
    // mangaDex specific
    links?: string[],
}

export interface SeriesMetadataConfigUpdateDto {
    status?: boolean
    title?: boolean
    summary?: boolean
    publisher?: boolean
    readingDirection?: boolean
    ageRating?: boolean
    language?: boolean
    genres?: boolean
    tags?: boolean
    totalBookCount?: boolean
    authors?: boolean
    releaseDate?: boolean
    thumbnail?: boolean
    books?: boolean
    useOriginalPublisher?: boolean
    links?: boolean,

    originalPublisherTagName?: string
    englishPublisherTagName?: string
    frenchPublisherTagName?: string
}

export interface BookMetadataConfigUpdateDto {
    title?: boolean,
    summary?: boolean,
    number?: boolean,
    releaseDate?: boolean,
    authors?: boolean,
    tags?: boolean,
    isbn?: boolean,
    links?: boolean,
    thumbnail?: boolean,
}

export interface KomfNotificationsDto {
    discord: DiscordConfigDto,
    apprise: AppriseConfigDto,
}

export interface KomfConfigDto {
    komga: KomgaConfigDto,
    kavita: KavitaConfigDto,
    notifications: KomfNotificationsDto,
    metadataProviders: MetadataProvidersConfigDto
}

export interface KomgaConfigDto {
    baseUri: string,
    komgaUser: string,
    komgaPassword?: string,
    apiKey?: string,
    eventListener: EventListenerConfigDto,
    notifications: NotificationConfigDto,
    metadataUpdate: MetadataUpdateConfigDto,
}

export interface KavitaConfigDto {
    baseUri: string,
    apiKey: string,
    eventListener: EventListenerConfigDto,
    notifications: NotificationConfigDto,
    metadataUpdate: MetadataUpdateConfigDto,
}

export interface DiscordConfigDto {
    webhooks?: Record<number, string>,
    seriesCover: boolean,
}

export interface AppriseConfigDto {
    urls?: Record<number, string>,
    seriesCover: boolean,
}

export interface EventListenerConfigDto {
    enabled: boolean,
    metadataLibraryFilter: string[],
    metadataSeriesExcludeFilter?: string[],
    notificationsLibraryFilter?: string[]
}

export interface NotificationConfigDto {
    libraries: string[],
}

export interface MetadataUpdateConfigDto {
    default: MetadataProcessingConfigDto,
    library: Record<string, MetadataProcessingConfigDto>
}

export interface SearchTitleExtractionConfigDto {
    enabled: boolean,
    bracketRegex: string | null,
    authorSeparator: string | null,
    titleSplitters: string[],
    symbolNormalizeRegex: string | null,
    charMappings: string[][],
    cleanupRegex: string[]
}

export interface ChineseConversionUpdateConfigDto {
    enabled: boolean,
    fields: string[]
}

export interface ChineseConversionConfigDto {
    enabled: boolean,
    direction: string,
    search: boolean,
    matching: boolean,
    update: ChineseConversionUpdateConfigDto
}

export interface AlternateTitleLabelsConfigDto {
    romaji: string | null,
    native: string | null,
    localized: string | null
}

export interface MetadataProcessingConfigDto {
    libraryType: string,
    aggregate: boolean,
    mergeTags: boolean,
    mergeGenres: boolean,
    bookCovers: boolean,
    seriesCovers: boolean,
    overrideExistingCovers: boolean,
    lockCovers?: boolean,
    overrideComicInfo?: boolean,
    updateModes: string[],
    postProcessing: MetadataPostProcessingConfigDto,
    searchTitleExtraction?: SearchTitleExtractionConfigDto,
    failedMatchCollectionName?: string | null,
    mylarCovers?: boolean,
    mylarOutputDir?: string | null,
    chineseConversion?: ChineseConversionConfigDto
}

export interface MetadataPostProcessingConfigDto {
    seriesTitle: boolean,
    seriesTitleLanguage: string,
    orderBooks: boolean,
    alternativeSeriesTitles: boolean,
    alternativeSeriesTitleLanguages: string[],
    fallbackToAltTitle?: boolean,
    readingDirectionValue?: string,
    languageValue?: string,
    scoreTagName?: string | null,
    originalPublisherTagName?: string | null,
    publisherTagNames?: PublisherTagNameDto[],
    alternateTitleLabels?: AlternateTitleLabelsConfigDto,
    linksSkipEnabled?: boolean,
    linksMatchEnabled?: boolean
}

export interface MetadataProvidersConfigDto {
    malClientId: string,
    comicVineClientId?: string,
    bangumiToken?: string,
    comicVineSearchLimit?: number | null,
    comicVineIssueName?: string | null,
    comicVineIdFormat?: string | null,
    nameMatchingMode: string,
    defaultProviders: ProvidersConfigDto,
    libraryProviders: Record<string, ProvidersConfigDto>,
}

export interface ProvidersConfigDto {
    mangaUpdates: ProviderConfigDto,
    mal: ProviderConfigDto,
    nautiljon: ProviderConfigDto,
    aniList: ProviderConfigDto,
    yenPress: ProviderConfigDto,
    kodansha: ProviderConfigDto,
    viz: ProviderConfigDto,
    bookWalker: ProviderConfigDto,
    mangaDex: ProviderConfigDto,
    bangumi: ProviderConfigDto,
    comicVine: ProviderConfigDto,
    mangaBaka?: ProviderConfigDto,
    webtoons?: ProviderConfigDto,
    eHentai?: ProviderConfigDto,
}

export interface EHentaiArchiveConfigDto {
    enabled: boolean,
    url?: string | null,
    dbFile?: string | null,
    updateIntervalHours: number,
    idleReleaseSecs?: number | null,
    searchCategoryFilter?: string[],
    searchUploaderFilter?: string[],
}

export interface BangumiArchiveConfigDto {
    enabled: boolean,
    dir?: string | null,
    updateIntervalHours: number,
    idleReleaseSecs?: number | null,
}

export interface ProviderConfigDto {
    mediaType: string,
    nameMatchingMode?: string,
    authorRoles: string[],
    artistRoles: string[],
    priority: number,
    enabled: boolean,
    seriesMetadata: SeriesMetadataConfigDto,
    bookMetadata: BookMetadataConfigDto,
    preferredLanguages?: any,
    titlePriority?: string,
    translatorKeywords?: any,
    maleOnlyTagsFile?: string | null,
    titleTemplate?: string,
    tagTranslationEnabled?: boolean,
    tagTranslationUrl?: string,
    gidOnlyMatch?: boolean,
    searchDomain?: string,
    ipbMemberId?: string | null,
    ipbPassHash?: string | null,
    tagWhitelist?: any,
    tagWhitelistFile?: string | null,
    archive?: any,
    coverLanguages?: any,
    tagsScoreThreshold?: number,
    tagsSizeLimit?: number,
    mode?: string,
    links?: string[],
}

export interface SeriesMetadataConfigDto {
    status: boolean
    title: boolean
    summary: boolean
    publisher: boolean
    readingDirection: boolean
    ageRating: boolean
    language: boolean
    genres: boolean
    tags: boolean
    totalBookCount: boolean
    authors: boolean
    releaseDate: boolean
    thumbnail: boolean
    links: boolean
    books: boolean
    useOriginalPublisher: boolean

    originalPublisherTagName?: string
    englishPublisherTagName?: string
    frenchPublisherTagName?: string
}

export interface BookMetadataConfigDto {
    title: boolean,
    summary: boolean,
    number: boolean,
    releaseDate: boolean,
    authors: boolean,
    tags: boolean,
    isbn: boolean,
    links: boolean,
    thumbnail: boolean,
}

export class DefaultSeriesMetadataConfig implements SeriesMetadataConfigDto {
    ageRating: boolean = true
    authors: boolean = true
    books: boolean = true
    genres: boolean = true
    language: boolean = true
    links: boolean = true
    publisher: boolean = true
    readingDirection: boolean = true
    releaseDate: boolean = true
    status: boolean = true
    summary: boolean = true
    tags: boolean = true
    thumbnail: boolean = true
    title: boolean = true
    totalBookCount: boolean = true
    useOriginalPublisher: boolean = false
}

export class DefaultBookMetadataConfig implements BookMetadataConfigDto {
    authors: boolean = true
    isbn: boolean = true
    links: boolean = true
    number: boolean = true
    releaseDate: boolean = true
    summary: boolean = true
    tags: boolean = true
    thumbnail: boolean = true
    title: boolean = true
}

export class DefaultProviderConfig implements ProviderConfigDto {
    enabled: boolean = false
    priority: number = 10
    authorRoles: string[] = ['WRITER']
    artistRoles: string[] = ['PENCILLER', 'INKER', 'COLORIST', 'LETTERER', 'COVER']
    mediaType: string = 'MANGA'
    seriesMetadata: SeriesMetadataConfigDto = new DefaultSeriesMetadataConfig()
    bookMetadata: BookMetadataConfigDto = new DefaultBookMetadataConfig()
}

export class DefaultProvidersConfig implements ProvidersConfigDto {
    aniList: ProviderConfigDto = {
        ...new DefaultProviderConfig(),
        tagsScoreThreshold: 60,
        tagsSizeLimit: 15
    }
    bookWalker: ProviderConfigDto = new DefaultProviderConfig()
    kodansha: ProviderConfigDto = new DefaultProviderConfig()
    mal: ProviderConfigDto = new DefaultProviderConfig
    mangaUpdates: ProviderConfigDto = new DefaultProviderConfig
    mangaBaka: ProviderConfigDto = new DefaultProviderConfig()
    nautiljon: ProviderConfigDto = new DefaultProviderConfig
    viz: ProviderConfigDto = new DefaultProviderConfig
    yenPress: ProviderConfigDto = new DefaultProviderConfig
    mangaDex: ProviderConfigDto = {
        ...new DefaultProviderConfig(),
        coverLanguages: ['en', 'ja']
    }
    bangumi: ProviderConfigDto = {
        ...new DefaultProviderConfig(),
        tagWhitelist: [],
        tagWhitelistFile: null
    }
    comicVine: ProviderConfigDto = new DefaultProviderConfig()
    webtoons: ProviderConfigDto = new DefaultProviderConfig()
    eHentai: ProviderConfigDto = {
        ...new DefaultProviderConfig(),
        preferredLanguages: ['en', 'ja'],
        titlePriority: 'jpn',
        translatorKeywords: [],
        maleOnlyTagsFile: null,
        titleTemplate: '',
        searchDomain: 'e-hentai',
        ipbMemberId: null,
        ipbPassHash: null
    }
}
