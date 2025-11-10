import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        port: 3000,
        // Removed 'open: true' to prevent automatic browser opening which might trigger antivirus
        host: 'localhost',
        strictPort: false,
    },
    build: {
        outDir: 'dist',
        sourcemap: false, // Disabled sourcemaps for production builds
        minify: 'esbuild',
        target: 'es2015',
    },
    // Security settings
    preview: {
        port: 3000,
        strictPort: false,
    },
});
