import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import {quasar, transformAssetUrls} from '@quasar/vite-plugin'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

const purgecss = require('@fullhuman/postcss-purgecss')

export default defineConfig({
    plugins: [
        vue({
            template: {transformAssetUrls},
        }),
        quasar({
            sassVariables: 'src/quasar-variables.sass',
        }),
        cssInjectedByJsPlugin(),
    ],
    css: {
        postcss: {
            plugins: [
                purgecss({
                    safelist: [/^(?!h[1-6]).*$/, /^q-/],
                })
            ],

        }
    },
    build: {
        minify: false,
        // inline font assets (mdi webfont) into the single-file userscript
        assetsInlineLimit: 100000000,
        rollupOptions: {
            output: {
                manualChunks: undefined,
            },
        },
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            // @quasar/extras' "exports" map hides the css file; alias it directly
            'mdi-v6.css': fileURLToPath(new URL('./node_modules/@quasar/extras/mdi-v6/mdi-v6.css', import.meta.url)),
        },
    },
})
