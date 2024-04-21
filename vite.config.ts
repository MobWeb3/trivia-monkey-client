import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import checker from 'vite-plugin-checker';
import { VitePWA } from 'vite-plugin-pwa'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

let faviconURL = '/favicon.ico'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
    const env = loadEnv(mode, process.cwd(), '')
    return {
        base: './',
        plugins: [
            react(),
            checker({
                overlay: { initialIsOpen: false },
                typescript: true,
                eslint: {
                    lintCommand: 'eslint "./src/**/*.{ts,tsx}"',
                },
            }),
            VitePWA({
                includeAssets: ['favicon.ico'],
                manifest: {
                    name: 'Monkey Trivia',
                    short_name: 'mt',
                    description: 'A fun game to play with your friends using your crypto wallet, AI, trivia questions and monkeys!',
                    theme_color: '#212928',
                    background_color: '#212928',
                    display: 'standalone',
                    icons: [
                        {
                            src: 'logo200.png',
                            sizes: '200x200',
                            type: 'image/png',
                            purpose: 'any maskable',
                        },
                        {
                            src: faviconURL,
                            sizes: '200x200',
                            type: 'image/png',
                        }
                    ],
                },
            }),
            nodePolyfills(),
        ],
        define: {
            VITE_PUBLIC_URL: JSON.stringify(env.VITE_PUBLIC_URL),
            'process.env': process.env,
            'global.setTimeout': 'window.setTimeout'
        },
        resolve: {
            alias: {
                // This Rollup aliases are extracted from @esbuild-plugins/node-modules-polyfill, 
                // see https://github.com/remorses/esbuild-plugins/blob/master/node-modules-polyfill/src/polyfills.ts
                util: 'rollup-plugin-node-polyfills/polyfills/util',
                sys: 'util',
                events: 'rollup-plugin-node-polyfills/polyfills/events',
                path: 'rollup-plugin-node-polyfills/polyfills/path',
                querystring: 'rollup-plugin-node-polyfills/polyfills/qs',
                punycode: 'rollup-plugin-node-polyfills/polyfills/punycode',
                constants: 'rollup-plugin-node-polyfills/polyfills/constants',
                // crypto: "empty-module",
                assert: "empty-module",
                http: "rollup-plugin-node-polyfills/polyfills/http",
                https: "rollup-plugin-node-polyfills/polyfills/http",
                os: "empty-module",
                url: "rollup-plugin-node-polyfills/polyfills/url",
                zlib: "empty-module",
                stream: "rollup-plugin-node-polyfills/polyfills/stream",
                _stream_duplex: "empty-module",
                _stream_passthrough: "empty-module",
                _stream_readable: "empty-module",
                _stream_writable: "empty-module",
                _stream_transform: "empty-module",
                timers: 'rollup-plugin-node-polyfills/polyfills/timers',
                console: 'rollup-plugin-node-polyfills/polyfills/console',
                vm: 'rollup-plugin-node-polyfills/polyfills/vm',
                tty: 'rollup-plugin-node-polyfills/polyfills/tty',
                domain: 'rollup-plugin-node-polyfills/polyfills/domain',
                // buffer: 'rollup-plugin-node-polyfills/polyfills/buffer-es6',
            }
        },
        optimizeDeps: {
            esbuildOptions: {
                // Node.js global to browser globalThis
                define: {
                    global: 'globalThis'
                },
                // Enable esbuild polyfill plugins
                plugins: [
                    NodeGlobalsPolyfillPlugin({
                        buffer: true
                    })
                ]
            }
        },
        build: {
            commonjsOptions: {
                transformMixedEsModules: true
            },
            minify: false,
            sourcemap: false, // uncomment this line to debug source maps
        },
        test: {
            globals: true,
            environment: 'jsdom',
            setupFiles: 'src/test/utils/setup.ts',
            // you might want to disable it, if you don't have tests that rely on CSS
            // since parsing CSS is slow
            css: true,
          }
    }

})