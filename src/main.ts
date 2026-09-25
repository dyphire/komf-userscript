import { createApp } from 'vue'
import { createPinia } from 'pinia'
import axios, { type AxiosRequestConfig } from 'axios'
import KomfMetadataService from '@/services/komf-metadata.service'
import { httpKey, komfConfigKey, komfMetadataKey } from '@/injection-keys'
import { Dialog, Notify, Quasar } from 'quasar'
import quasarCss from 'quasar/src/css/index.sass?inline'
import svgMdiV6 from 'quasar/icon-set/svg-mdi-v6.mjs'
import { mdiSvgPaths } from '@/mdi-svg-paths'
import { CSS_HOSTS, detectHost } from '@/host'

import App from './App.vue'
import KomfConfigService from '@/services/komf-config.service'

// Quasar's global CSS is unlayered and leaks onto ANY page the userscript
// runs on (unknown hosts get Roboto bodies, recolored buttons, flex chaos).
// Inject it only when a supported host is detected; unknown hosts (e.g.
// Stump) stay completely untouched until proper support lands.
const host = detectHost(document.title)
if (host && CSS_HOSTS.includes(host)) {
  // Quasar's unlayered utility classes leak onto the host page. Worst case:
  // .hidden { display: none !important } permanently beats Tailwind's
  // responsive display utilities (aside "hidden lg:block" sidebar, toolbar
  // buttons using hidden md:inline-flex), because unlayered rules outrank
  // @layer utilities. Scope the generic utilities to the Komf UI roots
  // (#komf + Quasar portals) so they only apply inside the injected UI.
  const ROOTS = ['#komf', '[id^="q-portal--"]']
  const scope = (sel: string) => ROOTS.map((r) => `${r} ${sel}`).join(', ')
  let css = quasarCss
  css = css.replace(/(^|[}\n])\s*\.hidden\b/g, `$1 ${scope('.hidden')}`)
  css = css.replace(/(^|[}\n])\s*\.invisible\b/g, `$1 ${scope('.invisible')}`)
  css = css.replace(/(^|[}\n])\s*\.row\b(?![\w-])/g, `$1 ${scope('.row')}`)
  css = css.replace(/(^|[}\n])\s*\.column\b(?![\w-])/g, `$1 ${scope('.column')}`)
  css = css.replace(/(^|[}\n])\s*\.flex\b(?![\w-])/g, `$1 ${scope('.flex')}`)
  css = css.replace(/(^|[}\n])\s*\.col\b(?![\w-])/g, `$1 ${scope('.col')}`)
  const style = document.createElement('style')
  style.textContent = css
  document.head.appendChild(style)
}

const mountElement = document.createElement('div')
mountElement.id = 'komf'
document.body.appendChild(mountElement)

let app = createApp(App)
app.use(Quasar, {
  plugins: { Notify, Dialog },
  // Quasar's internal component icons (dropdowns, checks, …) render as inline
  // SVG instead of relying on an mdi webfont that the host page may not ship.
  iconSet: svgMdiV6,
  config: {
    // Komf template icons: map `mdi-xxx` to their SVG path so QIcon renders
    // them inline as well. No font, no 370KB css, no webfont base64 blob.
    // NOTE: iconMapFn is read from $q.config.iconMapFn (quasar/src/icon-set.js),
    // it must live inside `config`. The Quasar 2.15 TS types do not list it,
    // hence the cast.
    iconMapFn: (icon: string) => {
      if (icon.startsWith('mdi-') === true) {
        const path = mdiSvgPaths[icon.slice(4)]
        if (path !== void 0) {
          return { icon: path }
        }
      }
      return void 0
    },
  } as any,
})
app.use(createPinia())

const http = axios.create({ headers: { 'X-Requested-With': 'XMLHttpRequest' } } as AxiosRequestConfig)
const komfMetadata = new KomfMetadataService(http)
const komfConfig = new KomfConfigService(http)

app.provide(httpKey, http)
app.provide(komfMetadataKey, komfMetadata)
app.provide(komfConfigKey, komfConfig)

app.mount(mountElement)
