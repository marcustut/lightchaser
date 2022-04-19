import react from '@vitejs/plugin-react';
import { defineConfig, PluginOption } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import tsconfigPaths from 'vite-tsconfig-paths';

const commonPlugins: (PluginOption | PluginOption[])[] = [
  tsconfigPaths(),
  VitePWA({
    registerType: 'autoUpdate',
    includeAssets: ['favicon.ico', 'apple-icon.png'],
    manifest: {
      name: 'LightChaser',
      short_name: 'LightChaser',
      description: 'The main application for LightChaser camp.',
      theme_color: '#0dcb21',
      icons: [
        {
          src: 'apple-icon-180x180.png',
          sizes: '180x180',
          type: 'image/png',
        },
        {
          src: 'android-icon-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: 'favicon-96x96.png',
          sizes: '96x96',
          type: 'image/png',
        },
        {
          src: 'ms-icon-70x70.png',
          sizes: '70x70',
          type: 'image/png',
        },
      ],
    },
  }),
];

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: mode === 'development' ? [react(), ...commonPlugins] : [...commonPlugins],
  esbuild: mode === 'development' ? undefined : { jsxInject: `import * as React from 'react'` },
}));
