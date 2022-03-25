import react from '@vitejs/plugin-react';
import { defineConfig, PluginOption } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

const commonPlugins: (PluginOption | PluginOption[])[] = [tsconfigPaths()];

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: mode === 'development' ? [react(), ...commonPlugins] : [...commonPlugins],
  esbuild: mode === 'development' ? undefined : { jsxInject: `import * as React from 'react'` },
}));
