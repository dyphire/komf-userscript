import type { Ref } from 'vue'
import { onBeforeUnmount } from 'vue'

export type InjectOp =
  | { insert: 'beforebegin' | 'afterend'; ref: Element }
  | { insert: 'append' | 'prepend'; ref: Element }

export interface InjectionPoint {
  /** unique id; must match a key in the `elements` map passed to useInjection */
  id: string
  /**
   * Return the insertion op when the host DOM is ready, or null to retry on
   * the next mutation. `ref` is the anchor the Teleport container is mounted
   * next to / into.
   */
  locate: () => InjectOp | null
  /**
   * Override for hosts that do not insert the element but repoint the Teleport
   * target instead (Kavita's library actions). Default implementation handles
   * the four InsertAdjacent positions.
   */
  attach?: (op: InjectOp, el: HTMLElement, retarget: (target: HTMLElement) => void) => void
}

/**
 * Shared MutationObserver driver for injecting Teleport containers into host
 * DOM. Replaces the three hand-rolled observers (KomgaView / KavitaView /
 * KmwebView) with one runner that:
 *   - scans all injection points on each mutation (and once on mount),
 *   - mounts each point exactly once (isConnected / mounted-set guard),
 *   - disconnects + clears on unmount.
 *
 * Each View still supplies its own `locate` closures (host structure differs
 * too much to abstract further — Komga uses DOM indices, Kavita matches
 * element tags/ids, kmweb uses selectors).
 */
export function useInjection(
  points: InjectionPoint[],
  elements: Record<string, Ref<HTMLElement | undefined>>,
) {
  const mounted = new Set<string>()

  const mountOne = (p: InjectionPoint) => {
    const el = elements[p.id]?.value
    if (!el) return
    // SPA navigation tears the host DOM down and rebuilds it: when our
    // container is no longer connected (removed with the old route), forget
    // the mount so the next mutation re-injects it — locate() re-resolves
    // against the fresh DOM. Without this the entry vanishes until reload.
    if (!el.isConnected) mounted.delete(p.id)
    if (mounted.has(p.id)) return
    const op = p.locate()
    if (!op) return
    if (p.attach) {
      p.attach(op, el, (target) => {
        elements[p.id].value = target
      })
    } else {
      op.ref.insertAdjacentElement(op.insert === 'append' ? 'beforeend' : op.insert === 'prepend' ? 'afterbegin' : op.insert, el)
    }
    mounted.add(p.id)
  }

  const scan = () => points.forEach(mountOne)

  const observer = new MutationObserver(scan)
  observer.observe(document, { childList: true, subtree: true })
  scan()

  onBeforeUnmount(() => {
    observer.disconnect()
    mounted.clear()
  })
}
