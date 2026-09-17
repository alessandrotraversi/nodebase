import path from 'node:path';
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

// Config lives in test/config, but unit specs stay colocated with their
// source files under src/, so root points back at the project root.
const projectRoot = path.resolve(import.meta.dirname, '../..');

export default defineConfig({
  // Resolves the path aliases declared in tsconfig.json, including the ones
  // added by `nest g library`.
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    root: projectRoot,
    include: ['src/**/*.spec.ts'],
  },
});
