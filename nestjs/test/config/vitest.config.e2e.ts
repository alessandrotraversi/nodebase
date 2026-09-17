import path from 'node:path';
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

// Config lives in test/config, e2e specs live in test/e2e — root points
// back at the project root so both resolve correctly regardless of cwd.
const projectRoot = path.resolve(import.meta.dirname, '../..');

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    root: projectRoot,
    include: ['test/e2e/**/*.e2e-spec.ts'],
  },
});
