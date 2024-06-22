import type { Config } from 'jest';
import { pathsToModuleNameMapper } from 'ts-jest';

import { compilerOptions } from './tsconfig.json';

export default {
  projects: [
    {
      displayName: 'Unit',
      moduleDirectories: ['node_modules', __dirname],
      moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
      preset: 'ts-jest',
      rootDir: 'src',
      setupFilesAfterEnv: ['dotenv/config'],
      testEnvironment: 'node',
      testRegex: '\\.spec\\.ts$',
    },
    {
      displayName: 'E2E',
      moduleDirectories: ['node_modules', __dirname],
      moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
      preset: 'ts-jest',
      rootDir: 'test',
      setupFilesAfterEnv: ['dotenv/config'],
      testEnvironment: 'node',
      testRegex: '\\.e2e.spec\\.ts$',
    },
  ],
} satisfies Config;
