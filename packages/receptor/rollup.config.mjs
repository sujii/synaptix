import { defineConfig } from 'rollup';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import { readFileSync } from 'node:fs';

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf-8'));
const external = [/^node:/, ...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})];

export default defineConfig([
  // JS bundles (ESM + CJS)
  {
    input: 'src/index.ts',
    external,
    output: [
      { file: 'dist/index.js', format: 'esm', sourcemap: true },
      {
        file: 'dist/index.cjs',
        format: 'cjs',
        sourcemap: true,
        exports: 'named',
      },
    ],
    plugins: [
      nodeResolve({ preferBuiltins: true }),
      commonjs(),
      json(),
      typescript({
        tsconfig: '../../tsconfig.build.json',
        declaration: false, // d.ts is generated collectively in the dts task below
        sourceMap: true,
      }),
    ],
  },
  // Types bundle
  {
    input: 'src/index.ts',
    external,
    output: [{ file: 'dist/index.d.ts', format: 'es' }],
    plugins: [dts()],
  },
]);
