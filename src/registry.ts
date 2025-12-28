import type { LensMetadata, CategoryConfig, LanguageConfig } from './types.js';

/**
 * Central registry of all quality lenses
 *
 * When adding a new lens:
 * 1. Add it to this registry with complete metadata
 * 2. Implement the lens in @principal-ai/codebase-quality-lenses
 * 3. The UI packages will automatically discover and support it
 */
export const LENS_REGISTRY: LensMetadata[] = [
  // ============================================================
  // LINTING - Code style and bug detection
  // ============================================================

  // TypeScript/JavaScript linting
  {
    id: 'eslint',
    name: 'ESLint',
    category: 'linting',
    languages: ['typescript', 'javascript'],
    outputsFileMetrics: true,
    outputsAggregate: true,
    colorScheme: 'issues',
    description: 'Pluggable linting utility for JavaScript and TypeScript',
    command: 'eslint',
  },
  {
    id: 'biome-lint',
    name: 'Biome Lint',
    category: 'linting',
    languages: ['typescript', 'javascript'],
    alternativeTo: ['eslint'],
    outputsFileMetrics: true,
    outputsAggregate: true,
    colorScheme: 'issues',
    description: 'Fast linter for JavaScript and TypeScript',
    command: 'biome lint',
  },
  {
    id: 'oxlint',
    name: 'OxLint',
    category: 'linting',
    languages: ['typescript', 'javascript'],
    alternativeTo: ['eslint', 'biome-lint'],
    outputsFileMetrics: true,
    outputsAggregate: true,
    colorScheme: 'issues',
    description: 'Blazing fast JavaScript/TypeScript linter',
    command: 'oxlint',
  },

  // Python linting
  {
    id: 'ruff',
    name: 'Ruff',
    category: 'linting',
    languages: ['python'],
    alternativeTo: ['pylint', 'flake8'],
    outputsFileMetrics: true,
    outputsAggregate: true,
    colorScheme: 'issues',
    description: 'Extremely fast Python linter',
    command: 'ruff check',
  },
  {
    id: 'pylint',
    name: 'Pylint',
    category: 'linting',
    languages: ['python'],
    outputsFileMetrics: true,
    outputsAggregate: true,
    colorScheme: 'issues',
    description: 'Python static code analyzer',
    command: 'pylint',
  },

  // Go linting
  {
    id: 'golangci-lint',
    name: 'golangci-lint',
    category: 'linting',
    languages: ['go'],
    outputsFileMetrics: true,
    outputsAggregate: true,
    colorScheme: 'issues',
    description: 'Fast linters runner for Go',
    command: 'golangci-lint run',
  },

  // Rust linting
  {
    id: 'clippy',
    name: 'Clippy',
    category: 'linting',
    languages: ['rust'],
    outputsFileMetrics: true,
    outputsAggregate: true,
    colorScheme: 'issues',
    description: 'Rust linter',
    command: 'cargo clippy',
  },

  // ============================================================
  // FORMATTING - Code formatting
  // ============================================================

  // TypeScript/JavaScript formatting
  {
    id: 'prettier',
    name: 'Prettier',
    category: 'formatting',
    languages: ['typescript', 'javascript'],
    outputsFileMetrics: true,
    outputsAggregate: true,
    colorScheme: 'binary',
    description: 'Opinionated code formatter',
    command: 'prettier --check',
  },
  {
    id: 'biome-format',
    name: 'Biome Format',
    category: 'formatting',
    languages: ['typescript', 'javascript'],
    alternativeTo: ['prettier'],
    outputsFileMetrics: true,
    outputsAggregate: true,
    colorScheme: 'binary',
    description: 'Fast code formatter for JavaScript and TypeScript',
    command: 'biome format',
  },

  // Python formatting
  {
    id: 'black',
    name: 'Black',
    category: 'formatting',
    languages: ['python'],
    outputsFileMetrics: true,
    outputsAggregate: true,
    colorScheme: 'binary',
    description: 'The uncompromising Python code formatter',
    command: 'black --check',
  },
  {
    id: 'ruff-format',
    name: 'Ruff Format',
    category: 'formatting',
    languages: ['python'],
    alternativeTo: ['black'],
    outputsFileMetrics: true,
    outputsAggregate: true,
    colorScheme: 'binary',
    description: 'Fast Python formatter (Ruff)',
    command: 'ruff format --check',
  },

  // Go formatting
  {
    id: 'gofmt',
    name: 'gofmt',
    category: 'formatting',
    languages: ['go'],
    outputsFileMetrics: true,
    outputsAggregate: true,
    colorScheme: 'binary',
    description: 'Go code formatter',
    command: 'gofmt -l',
  },

  // Rust formatting
  {
    id: 'rustfmt',
    name: 'rustfmt',
    category: 'formatting',
    languages: ['rust'],
    outputsFileMetrics: true,
    outputsAggregate: true,
    colorScheme: 'binary',
    description: 'Rust code formatter',
    command: 'cargo fmt --check',
  },

  // ============================================================
  // TYPES - Type checking
  // ============================================================

  // TypeScript
  {
    id: 'typescript',
    name: 'TypeScript',
    category: 'types',
    languages: ['typescript'],
    outputsFileMetrics: true,
    outputsAggregate: true,
    colorScheme: 'issues',
    description: 'TypeScript type checker',
    command: 'tsc --noEmit',
  },

  // Python type checking
  {
    id: 'mypy',
    name: 'MyPy',
    category: 'types',
    languages: ['python'],
    outputsFileMetrics: true,
    outputsAggregate: true,
    colorScheme: 'issues',
    description: 'Static type checker for Python',
    command: 'mypy',
  },
  {
    id: 'pyright',
    name: 'Pyright',
    category: 'types',
    languages: ['python'],
    alternativeTo: ['mypy'],
    outputsFileMetrics: true,
    outputsAggregate: true,
    colorScheme: 'issues',
    description: 'Static type checker for Python',
    command: 'pyright',
  },

  // Go type checking (built into compiler)
  {
    id: 'go-vet',
    name: 'Go Vet',
    category: 'types',
    languages: ['go'],
    outputsFileMetrics: true,
    outputsAggregate: true,
    colorScheme: 'issues',
    description: 'Go static analyzer',
    command: 'go vet',
  },

  // ============================================================
  // TESTS - Test coverage and results
  // ============================================================

  // JavaScript/TypeScript testing
  {
    id: 'jest',
    name: 'Jest',
    category: 'tests',
    languages: ['typescript', 'javascript'],
    outputsFileMetrics: true,
    outputsAggregate: true,
    colorScheme: 'coverage',
    description: 'JavaScript testing framework',
    command: 'jest --coverage',
  },
  {
    id: 'vitest',
    name: 'Vitest',
    category: 'tests',
    languages: ['typescript', 'javascript'],
    alternativeTo: ['jest'],
    outputsFileMetrics: true,
    outputsAggregate: true,
    colorScheme: 'coverage',
    description: 'Vite-native testing framework',
    command: 'vitest run --coverage',
  },
  {
    id: 'bun-test',
    name: 'Bun Test',
    category: 'tests',
    languages: ['typescript', 'javascript'],
    alternativeTo: ['jest', 'vitest'],
    outputsFileMetrics: true,
    outputsAggregate: true,
    colorScheme: 'coverage',
    description: 'Bun native test runner',
    command: 'bun test',
  },

  // Python testing
  {
    id: 'pytest',
    name: 'Pytest',
    category: 'tests',
    languages: ['python'],
    outputsFileMetrics: true,
    outputsAggregate: true,
    colorScheme: 'coverage',
    description: 'Python testing framework',
    command: 'pytest --cov',
  },

  // Go testing
  {
    id: 'go-test',
    name: 'Go Test',
    category: 'tests',
    languages: ['go'],
    outputsFileMetrics: true,
    outputsAggregate: true,
    colorScheme: 'coverage',
    description: 'Go test runner',
    command: 'go test -cover',
  },

  // Rust testing
  {
    id: 'cargo-test',
    name: 'Cargo Test',
    category: 'tests',
    languages: ['rust'],
    outputsFileMetrics: true,
    outputsAggregate: true,
    colorScheme: 'coverage',
    description: 'Rust test runner',
    command: 'cargo test',
  },

  // ============================================================
  // DEAD CODE - Unused code detection
  // ============================================================

  // TypeScript/JavaScript
  {
    id: 'knip',
    name: 'Knip',
    category: 'dead-code',
    languages: ['typescript', 'javascript'],
    outputsFileMetrics: true,
    outputsAggregate: true,
    colorScheme: 'issues',
    description: 'Find unused files, dependencies and exports',
    command: 'knip',
  },

  // Python
  {
    id: 'vulture',
    name: 'Vulture',
    category: 'dead-code',
    languages: ['python'],
    outputsFileMetrics: true,
    outputsAggregate: true,
    colorScheme: 'issues',
    description: 'Find dead Python code',
    command: 'vulture',
  },

  // ============================================================
  // DOCUMENTATION - Documentation coverage
  // ============================================================

  {
    id: 'alexandria',
    name: 'Alexandria',
    category: 'documentation',
    languages: ['typescript', 'javascript'],
    outputsFileMetrics: true,
    outputsAggregate: true,
    colorScheme: 'binary',
    description: 'Documentation coverage checker',
    command: 'alexandria lint',
  },
  {
    id: 'typedoc',
    name: 'TypeDoc',
    category: 'documentation',
    languages: ['typescript'],
    outputsFileMetrics: false,
    outputsAggregate: true,
    colorScheme: 'coverage',
    description: 'TypeScript documentation generator',
    command: 'typedoc',
  },

  // ============================================================
  // SECURITY - Security scanning
  // ============================================================

  {
    id: 'npm-audit',
    name: 'npm audit',
    category: 'security',
    languages: ['typescript', 'javascript'],
    outputsFileMetrics: false,
    outputsAggregate: true,
    colorScheme: 'issues',
    description: 'Check for known vulnerabilities in dependencies',
    command: 'npm audit',
  },
  {
    id: 'bandit',
    name: 'Bandit',
    category: 'security',
    languages: ['python'],
    outputsFileMetrics: true,
    outputsAggregate: true,
    colorScheme: 'issues',
    description: 'Python security linter',
    command: 'bandit -r',
  },
];

/**
 * Category configurations for UI display
 */
export const CATEGORY_CONFIGS: CategoryConfig[] = [
  {
    id: 'linting',
    name: 'Linting',
    description: 'Code style and bug detection',
    icon: 'AlertCircle',
  },
  {
    id: 'formatting',
    name: 'Formatting',
    description: 'Code formatting consistency',
    icon: 'AlignLeft',
  },
  {
    id: 'types',
    name: 'Types',
    description: 'Type safety and checking',
    icon: 'FileType',
  },
  {
    id: 'tests',
    name: 'Tests',
    description: 'Test coverage and results',
    icon: 'TestTube',
  },
  {
    id: 'dead-code',
    name: 'Dead Code',
    description: 'Unused code detection',
    icon: 'Trash2',
    invertedScale: true,
  },
  {
    id: 'documentation',
    name: 'Documentation',
    description: 'Documentation coverage',
    icon: 'FileText',
  },
  {
    id: 'security',
    name: 'Security',
    description: 'Security vulnerability scanning',
    icon: 'Shield',
  },
  {
    id: 'complexity',
    name: 'Complexity',
    description: 'Code complexity metrics',
    icon: 'GitBranch',
  },
];

/**
 * Language configurations for UI display
 */
export const LANGUAGE_CONFIGS: LanguageConfig[] = [
  {
    id: 'typescript',
    name: 'TypeScript',
    extensions: ['.ts', '.tsx', '.mts', '.cts'],
    icon: 'TS',
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    extensions: ['.js', '.jsx', '.mjs', '.cjs'],
    icon: 'JS',
  },
  {
    id: 'python',
    name: 'Python',
    extensions: ['.py', '.pyi'],
    icon: 'PY',
  },
  {
    id: 'go',
    name: 'Go',
    extensions: ['.go'],
    icon: 'GO',
  },
  {
    id: 'rust',
    name: 'Rust',
    extensions: ['.rs'],
    icon: 'RS',
  },
  {
    id: 'java',
    name: 'Java',
    extensions: ['.java'],
    icon: 'JV',
  },
  {
    id: 'csharp',
    name: 'C#',
    extensions: ['.cs'],
    icon: 'C#',
  },
  {
    id: 'ruby',
    name: 'Ruby',
    extensions: ['.rb'],
    icon: 'RB',
  },
  {
    id: 'php',
    name: 'PHP',
    extensions: ['.php'],
    icon: 'PHP',
  },
];
