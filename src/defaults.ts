/**
 * Default lens commands per language
 *
 * These are used when no quality-lens.yaml config is found.
 * The CLI will try these commands in order of preference.
 */

import type { Language } from './types.js';

/**
 * Default command configuration for a lens
 */
export interface DefaultLensCommand {
  /** Lens ID */
  lensId: string;
  /** Default command to run */
  command: string;
  /** Additional args the CLI should add (e.g., --json for parseable output) */
  cliArgs?: string[];
  /** Description for init command / documentation */
  description?: string;
}

/**
 * Default lens commands for JavaScript/TypeScript projects
 */
export const JAVASCRIPT_DEFAULTS: DefaultLensCommand[] = [
  // Testing
  {
    lensId: 'jest',
    command: 'npx jest',
    cliArgs: ['--json', '--coverage', '--passWithNoTests'],
    description: 'Run Jest tests with coverage',
  },
  {
    lensId: 'vitest',
    command: 'npx vitest run',
    cliArgs: ['--reporter=json', '--coverage'],
    description: 'Run Vitest tests with coverage',
  },
  {
    lensId: 'bun-test',
    command: 'bun test',
    cliArgs: ['--coverage'],
    description: 'Run Bun tests with coverage',
  },
  // Linting
  {
    lensId: 'eslint',
    command: 'npx eslint .',
    cliArgs: ['--format=json'],
    description: 'Run ESLint',
  },
  {
    lensId: 'biome-lint',
    command: 'npx @biomejs/biome lint .',
    cliArgs: ['--reporter=json'],
    description: 'Run Biome linter',
  },
  {
    lensId: 'oxlint',
    command: 'npx oxlint',
    cliArgs: ['--format=json'],
    description: 'Run oxlint',
  },
  // Formatting
  {
    lensId: 'prettier',
    command: 'npx prettier --check .',
    cliArgs: [],
    description: 'Check Prettier formatting',
  },
  {
    lensId: 'biome-format',
    command: 'npx @biomejs/biome format .',
    cliArgs: ['--reporter=json'],
    description: 'Check Biome formatting',
  },
  // Types
  {
    lensId: 'typescript',
    command: 'npx tsc --noEmit',
    cliArgs: [],
    description: 'Run TypeScript type checking',
  },
  // Dead code
  {
    lensId: 'knip',
    command: 'npx knip',
    cliArgs: ['--reporter=json'],
    description: 'Find unused code with Knip',
  },
  // Documentation
  {
    lensId: 'alexandria',
    command: 'npx @anthropic-ai/alexandria lint',
    cliArgs: [],
    description: 'Check documentation coverage',
  },
];

/**
 * Default lens commands for Python projects
 */
export const PYTHON_DEFAULTS: DefaultLensCommand[] = [
  // Testing
  {
    lensId: 'pytest',
    command: 'pytest',
    cliArgs: ['--json-report', '--cov', '--cov-report=json'],
    description: 'Run pytest with coverage',
  },
  // Linting
  {
    lensId: 'ruff',
    command: 'ruff check .',
    cliArgs: ['--output-format=json'],
    description: 'Run Ruff linter',
  },
  {
    lensId: 'pylint',
    command: 'pylint',
    cliArgs: ['--output-format=json'],
    description: 'Run Pylint',
  },
  // Formatting
  {
    lensId: 'black',
    command: 'black --check .',
    cliArgs: [],
    description: 'Check Black formatting',
  },
  {
    lensId: 'ruff-format',
    command: 'ruff format --check .',
    cliArgs: [],
    description: 'Check Ruff formatting',
  },
  // Types
  {
    lensId: 'mypy',
    command: 'mypy .',
    cliArgs: ['--output=json'],
    description: 'Run MyPy type checking',
  },
  {
    lensId: 'pyright',
    command: 'pyright',
    cliArgs: ['--outputjson'],
    description: 'Run Pyright type checking',
  },
  // Dead code
  {
    lensId: 'vulture',
    command: 'vulture .',
    cliArgs: [],
    description: 'Find dead code with Vulture',
  },
  // Security
  {
    lensId: 'bandit',
    command: 'bandit -r .',
    cliArgs: ['--format=json'],
    description: 'Security scan with Bandit',
  },
];

/**
 * Default lens commands for Go projects
 */
export const GO_DEFAULTS: DefaultLensCommand[] = [
  // Testing
  {
    lensId: 'go-test',
    command: 'go test ./...',
    cliArgs: ['-json', '-cover'],
    description: 'Run Go tests with coverage',
  },
  // Linting
  {
    lensId: 'golangci-lint',
    command: 'golangci-lint run',
    cliArgs: ['--out-format=json'],
    description: 'Run golangci-lint',
  },
  // Formatting
  {
    lensId: 'gofmt',
    command: 'gofmt -l .',
    cliArgs: [],
    description: 'Check Go formatting',
  },
  // Types / Vet
  {
    lensId: 'go-vet',
    command: 'go vet ./...',
    cliArgs: ['-json'],
    description: 'Run go vet',
  },
];

/**
 * Default lens commands for Rust projects
 */
export const RUST_DEFAULTS: DefaultLensCommand[] = [
  // Testing
  {
    lensId: 'cargo-test',
    command: 'cargo test',
    cliArgs: ['--', '--format=json'],
    description: 'Run Cargo tests',
  },
  // Linting
  {
    lensId: 'clippy',
    command: 'cargo clippy',
    cliArgs: ['--message-format=json'],
    description: 'Run Clippy linter',
  },
  // Formatting
  {
    lensId: 'rustfmt',
    command: 'cargo fmt --check',
    cliArgs: [],
    description: 'Check Rust formatting',
  },
];

/**
 * All default commands by language
 */
export const DEFAULT_COMMANDS: Record<Language, DefaultLensCommand[]> = {
  typescript: JAVASCRIPT_DEFAULTS,
  javascript: JAVASCRIPT_DEFAULTS,
  python: PYTHON_DEFAULTS,
  go: GO_DEFAULTS,
  rust: RUST_DEFAULTS,
  // Placeholder for future languages
  java: [],
  csharp: [],
  ruby: [],
  php: [],
};

/**
 * Get default commands for a language
 */
export function getDefaultCommands(language: Language): DefaultLensCommand[] {
  return DEFAULT_COMMANDS[language] || [];
}

/**
 * Get default command for a specific lens
 */
export function getDefaultCommand(
  lensId: string,
  language?: Language
): DefaultLensCommand | undefined {
  if (language) {
    return DEFAULT_COMMANDS[language]?.find((cmd) => cmd.lensId === lensId);
  }

  // Search all languages
  for (const commands of Object.values(DEFAULT_COMMANDS)) {
    const found = commands.find((cmd) => cmd.lensId === lensId);
    if (found) return found;
  }

  return undefined;
}

/**
 * Get all unique lens IDs that have default commands
 */
export function getAllDefaultLensIds(): string[] {
  const ids = new Set<string>();
  for (const commands of Object.values(DEFAULT_COMMANDS)) {
    for (const cmd of commands) {
      ids.add(cmd.lensId);
    }
  }
  return Array.from(ids);
}
