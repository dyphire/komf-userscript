# [Komf](https://github.com/dyphire/komf) user script for Komga and Kavita

Adds komf integration to Komga, Kavita and [kmrs](https://github.com/kmworks/kmrs)
(kmweb) ui.

---

### New menus in ui:

- Config dialog in main view
- Menu in library toolbar with option to automatically identify all series inside
- Menu in series toolbar with options to manually or automatically match current series

### Installation

Requires tampermonkey or any other supported userscript manager.

- Build or download the latest version from release page
- Import the file into script manager
- Set `@include`  to your komga, kavita or kmrs (kmweb) server url (or both)
- Set `komf url` in Komf settings from the UI

### kmrs / kmweb

Detected automatically by the `KMReader` page title. The script reuses the
Komga API endpoints (`/api/v1/series/...`), which kmrs implements. Komf actions
appear next to the series detail "More actions" button (or the hero button
group on oneshots), library actions in the browse page header, and a
"Komf Settings" entry at the bottom of the sidebar.
