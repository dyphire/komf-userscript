/** Host detection shared by main.ts (Quasar CSS injection) and App.vue
 *  (View selection + data-komf-host marker). Stump is recognized for the
 *  marker only — no View renders until proper support lands. */
export type KomfHost = 'komga' | 'kavita' | 'kmweb' | 'stump' | ''

export function detectHost(title: string): KomfHost {
  if (title == 'Komga') return 'komga'
  if (title == 'Kavita') return 'kavita'
  if (title.includes('KMReader')) return 'kmweb'
  if (title == 'Stump') return 'stump'
  return ''
}

/** Hosts that render Komf UI (Quasar dialog etc.). Unknown/not-yet-supported
 *  hosts (Stump) must NOT get Quasar's global CSS. */
export const CSS_HOSTS: readonly KomfHost[] = ['komga', 'kavita', 'kmweb']

/**
 * Single per-host "is the host page dark right now?" probe, shared by the
 * three Views' useHostTheme and App.vue's dialog-open refresh. Each host has
 * its own signal: Komga stamps theme--dark on <html> or .v-application (with
 * a Vuex localStorage fallback), Kavita is always dark, kmweb toggles
 * <html class="dark|light">.
 */
export function hostDarkProbe(host: KomfHost | null, fallbackDark = false): () => boolean {
  switch (host) {
    case 'kavita':
      return () => true
    case 'kmweb':
      return () => document.documentElement.classList.contains('dark')
    case 'komga':
      return () => {
        // Vuetify 2 stamps theme--dark on <html> or .v-application; Vuetify 3
        // uses v-theme--dark / v-theme--light. Probe every possible root.
        const roots: Element[] = [document.documentElement, document.body]
        const app = document.querySelector('.v-application')
        if (app) roots.push(app)
        for (const el of roots) {
          if (el.classList.contains('theme--dark') || el.classList.contains('v-theme--dark') || el.classList.contains('dark')) return true
          if (el.classList.contains('theme--light') || el.classList.contains('v-theme--light') || el.classList.contains('light')) return false
        }
        // Vuetify 3 CSS-variable theme signal on <html>
        try {
          const cs = getComputedStyle(document.documentElement)
          const darkBg = cs.getPropertyValue('--v-theme-dark-background').trim()
          const lightBg = cs.getPropertyValue('--v-theme-light-background').trim()
          const activeBg = cs.getPropertyValue('--v-theme-background').trim()
          if (activeBg) {
            if (darkBg && activeBg === darkBg) return true
            if (lightBg && activeBg === lightBg) return false
          }
        } catch {
          /* ignore */
        }
        // Komga's own persisted Vuex theme preference
        let theme: string | undefined
        try {
          const storage = localStorage.getItem('vuex')
          if (storage) {
            const state = JSON.parse(storage)
            if ('persistedState' in state) theme = state.persistedState.theme
          }
        } catch {
          /* ignore malformed storage */
        }
        if (theme) {
          const t = theme.toLowerCase()
          if (t.includes('dark')) return true
          if (t.includes('light')) return false
          if (t.includes('system')) return window.matchMedia('(prefers-color-scheme: dark)').matches
        }
        // last resort: background luminance of html/body
        for (const el of roots) {
          const bg = getComputedStyle(el).backgroundColor
          const m = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
          if (m) {
            const lum = (0.299 * +m[1] + 0.587 * +m[2] + 0.114 * +m[3]) / 255
            if (lum < 0.4) return true
            if (lum > 0.7) return false
          }
        }
        return false
      }
    default:
      return () => fallbackDark
  }
}