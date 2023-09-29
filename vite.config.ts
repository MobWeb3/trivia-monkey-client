import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import checker from 'vite-plugin-checker';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";
import rollupNodePolyFill from "rollup-plugin-node-polyfills";
import builtins from "rollup-plugin-node-builtins";
import polyfillNode from 'rollup-plugin-polyfill-node'
import { VitePWA } from 'vite-plugin-pwa'
import commonjs from '@rollup/plugin-commonjs';
import svgr from "vite-plugin-svgr";
import { fileURLToPath, URL } from 'node:url'


// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {

    const env = loadEnv(mode, process.cwd(), '')

    const externals = ['end-of-stream', 'pump', 'lodash.merge', 'lodash', 'react', 'react/jsx-runtime', 'lodash.clonedeep', 'react-dom/client',
        'borsh', 'bigint-buffer', 'rpc-websockets/dist/lib/client', '@zerodevapp/sdk', 'ably', 'react-dom', 'prop-types', 'phaser', 'lodash.isequal']

    return {
        base: './',
        plugins: [
            svgr(),
            react(),
            commonjs(),
            checker({
                overlay: { initialIsOpen: false },
                typescript: true,
                eslint: {
                    lintCommand: 'eslint "./src/**/*.{ts,tsx}"',
                },
            }),
            viteTsconfigPaths(),
            svgrPlugin(),
            polyfillNode(),
            VitePWA({
                manifest: {
                    icons: [
                        {
                            src: 'assets/monkeys_avatars/astronaut-monkey1-200x200.png',
                            sizes: '192x192',
                            type: 'image/png',
                            purpose: 'any maskable',
                        },
                    ],
                },
                injectRegister: 'auto',
                registerType: 'autoUpdate',
                workbox: {
                    clientsClaim: true,
                    skipWaiting: true
                },
                devOptions: {
                    enabled: true
                }
            })
        ],
        define: {
            VITE_PUBLIC_URL: JSON.stringify(env.VITE_PUBLIC_URL),
            'process.env': {}
        },
        resolve: {
            alias: {
                // This Rollup aliases are extracted from @esbuild-plugins/node-modules-polyfill, 
                // see https://github.com/remorses/esbuild-plugins/blob/master/node-modules-polyfill/src/polyfills.ts
                util: 'rollup-plugin-node-polyfills/polyfills/util',
                sys: 'util',
                events: 'rollup-plugin-node-polyfills/polyfills/events',
                stream: 'rollup-plugin-node-polyfills/polyfills/stream',
                path: 'rollup-plugin-node-polyfills/polyfills/path',
                querystring: 'rollup-plugin-node-polyfills/polyfills/qs',
                punycode: 'rollup-plugin-node-polyfills/polyfills/punycode',
                url: 'rollup-plugin-node-polyfills/polyfills/url',
                http: 'rollup-plugin-node-polyfills/polyfills/http',
                https: 'rollup-plugin-node-polyfills/polyfills/http',
                os: 'rollup-plugin-node-polyfills/polyfills/os',
                assert: 'rollup-plugin-node-polyfills/polyfills/assert',
                constants: 'rollup-plugin-node-polyfills/polyfills/constants',
                _stream_duplex: 'rollup-plugin-node-polyfills/polyfills/readable-stream/duplex',
                _stream_passthrough: 'rollup-plugin-node-polyfills/polyfills/readable-stream/passthrough',
                _stream_readable: 'rollup-plugin-node-polyfills/polyfills/readable-stream/readable',
                _stream_writable: 'rollup-plugin-node-polyfills/polyfills/readable-stream/writable',
                _stream_transform: 'rollup-plugin-node-polyfills/polyfills/readable-stream/transform',
                timers: 'rollup-plugin-node-polyfills/polyfills/timers',
                console: 'rollup-plugin-node-polyfills/polyfills/console',
                vm: 'rollup-plugin-node-polyfills/polyfills/vm',
                zlib: 'rollup-plugin-node-polyfills/polyfills/zlib',
                tty: 'rollup-plugin-node-polyfills/polyfills/tty',
                domain: 'rollup-plugin-node-polyfills/polyfills/domain',
                buffer: 'rollup-plugin-node-polyfills/polyfills/buffer-es6',
                '@': fileURLToPath(new URL('./src', import.meta.url))
            }
        },
        optimizeDeps: {
            include: ['end-of-stream'],
            // exclude: externals,
            esbuildOptions: {
                target: "es2020",
                supported: { bigint: true },
                plugins: [
                    NodeGlobalsPolyfillPlugin({
                        buffer: true,
                    }),
                    NodeModulesPolyfillPlugin(),
                ],
            },
        },
        build: {
            // sourcemap: true, uncomment this line to debug source maps
            target: "es2020",
            rollupOptions: {
                plugins: [
                    // Enable rollup polyfills plugin
                    // used during production bundling
                    builtins(),
                    rollupNodePolyFill(),
                    commonjs(),
                ],
                output: {
                    manualChunks: {
                        'scenes': ['src/scenes/SpinWheelScene.ts', 'src/scenes/AIGameScene.ts'],
                        'handlers': ['src/game-domain/GenerateQuestionsHandler.ts', /* other handlers */],
                        'utilities': ['src/utils/MessageListener.ts', /* other utilities */],
                        'phaser': ['phaser'],
                        '@zerodevapp': ['@zerodevapp/sdk'],
                        '@web3auth/solana-provider': ['@web3auth/solana-provider'],
                        '@web3auth/modal': ['@web3auth/modal'],
                        '@web3auth/base': ['@web3auth/base'],
                        // '@ethersproject': ['@ethersproject'],
                        // '@account-abstraction': ['@account-abstraction'],
                        // '@solana': ['solana'],
                        // 'assets': ['public/assets/Screens/in-game-bg-seagreen-1920x1080.png', 'public/assets/Screens/in-game-bg-green-1920x1080.png']
                    }
                }
            },
        },

    }

})