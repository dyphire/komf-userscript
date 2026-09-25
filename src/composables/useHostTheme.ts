import { onBeforeUnmount } from 'vue'
import { useQuasar } from 'quasar'

export interface ThemeWatch {
  /** element(s) whose attribute carries the theme — a function form lets the
   *  element (e.g. Vuetify's .v-application) resolve after mounting, and an
   *  array observes several roots. Observe ONLY the element's own attribute:
   *  subtree watching on <html> turns Vuetify's frequent class churn into a
   *  reflow storm and can loop when Quasar stamps body--dark itself. */
  element: Element | (() => Element | null) | Array<Element | (() => Element | null)>
  /** attribute name to observe, e.g. 'class' */
  attribute: string
  /** observe the whole subtree too. Keep false unless the theme signal really
   *  lives on a descendant that renders late and has no stable parent. */
  subtree?: boolean
}

/**
 * Single entry point for keeping Quasar's dark mode in sync with the host.
 *
 * Each host has its own theme signal (Komga reads its Vuex localStorage,
 * Kavita is always dark, kmweb toggles <html class="dark|light">). Previously
 * every View hand-rolled this — KomgaView parsed localStorage, KavitaView
 * hard-coded `$q.dark.set(true)`, KmwebView ran a second MutationObserver.
 *
 * Usage:
 *   useHostTheme(() => document.documentElement.classList.contains('dark'),
 *                { element: document.documentElement, attribute: 'class' })
 */
export function useHostTheme(readDark: () => boolean, watch?: ThemeWatch) {
  const $q = useQuasar()
  const apply = () => {
    const dark = readDark()
    const marker = dark ? 'dark' : 'light'
    // Short-circuit: nothing to update when the state is already in sync.
    // This keeps the MutationObserver from looping on the host class that
    // Quasar itself stamps (body--dark) when the value did not change.
    if ($q.dark.isActive === dark && document.documentElement.dataset.komfTheme === marker) return
    $q.dark.set(dark)
    // theme marker consumed by the unified style sheet
    // ([data-komf-theme='dark'|'light'] prefixes) on every host
    document.documentElement.dataset.komfTheme = marker
  }

  apply()

  let observer: MutationObserver | undefined
  if (watch) {
    const targets = Array.isArray(watch.element) ? watch.element : [watch.element]
    observer = new MutationObserver(apply)
    for (const t of targets) {
      const el = typeof t === 'function' ? t() : t
      if (el) observer.observe(el, { attributes: true, attributeFilter: [watch.attribute], subtree: watch.subtree })
    }
  }
  onBeforeUnmount(() => observer?.disconnect())

  // refresh(): re-read the host theme right now. Dialogs are opened with
  // this so the panel always matches the page even when a MutationObserver
  // could not attach (e.g. .v-application rendered after setup).
  return { refresh: apply }
}
