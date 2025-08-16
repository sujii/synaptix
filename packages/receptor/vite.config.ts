import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es', 'cjs'],
      fileName: format => (format === 'es' ? 'index.js' : 'index.cjs'),
    },
    rollupOptions: {
      // Externalize deps/peerDeps in package.json
      external: [
        /^node:/,
        ...Object.keys(require('./package.json').dependencies || {}),
        ...Object.keys(require('./package.json').peerDependencies || {}),
      ],
    },
  },
  // test: {
  //   environment: "node",
  //   coverage: { provider: "v8", reporter: ["text", "html"] },
  // },
});
