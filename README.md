# @principal-ai/quality-lens-registry

Centralized registry of quality lens metadata for the Principal AI quality toolchain.

## Purpose

This package provides a **single source of truth** for quality lens metadata across the entire quality toolchain:

- **CLI** (`@principal-ai/quality-lens-cli`) - Uses registry to validate lens outputs
- **Lens implementations** (`@principal-ai/codebase-quality-lenses`) - References registry for lens IDs
- **Quality Hexagon** (`@principal-ade/code-quality-panels`) - Uses registry for category→lens mapping
- **File City** (`@industry-theme/file-city-panel`) - Uses registry for lens display names

## Installation

```bash
npm install @principal-ai/quality-lens-registry
```

## Usage

### Get Lens Metadata

```typescript
import { getLensById, getLensesByCategory } from '@principal-ai/quality-lens-registry';

// Get metadata for a specific lens
const eslint = getLensById('eslint');
// { id: 'eslint', name: 'ESLint', category: 'linting', languages: ['typescript', 'javascript'], ... }

// Get all linting tools
const linters = getLensesByCategory('linting');
// [{ id: 'eslint', ... }, { id: 'biome-lint', ... }, { id: 'ruff', ... }]
```

### Color Mode Selection (for File City)

```typescript
import { getColorModeForCategory } from '@principal-ai/quality-lens-registry';

// Determine which color mode to use based on lenses that ran
const lensesRan = ['biome-lint', 'biome-format', 'typescript'];

const lintingMode = getColorModeForCategory('linting', lensesRan);
// Returns 'biome-lint' (not 'eslint' because it didn't run)

const formattingMode = getColorModeForCategory('formatting', lensesRan);
// Returns 'biome-format' (not 'prettier' because it didn't run)
```

### Language Support

```typescript
import { getLensesByLanguage, detectLanguageFromExtension } from '@principal-ai/quality-lens-registry';

// Get all lenses that support Python
const pythonLenses = getLensesByLanguage('python');
// [{ id: 'ruff', ... }, { id: 'mypy', ... }, { id: 'pytest', ... }]

// Detect language from file extension
const lang = detectLanguageFromExtension('.py');
// 'python'
```

### Validation

```typescript
import { isValidLensId, findCategoryConflicts, validateLensOutputs } from '@principal-ai/quality-lens-registry';

// Check if a lens ID is valid
isValidLensId('biome-lint'); // true
isValidLensId('unknown'); // false

// Find potential conflicts (multiple lenses for same category)
const conflicts = findCategoryConflicts(['eslint', 'biome-lint', 'typescript']);
// [{ category: 'linting', lenses: ['eslint', 'biome-lint'] }]

// Validate that lenses produced expected outputs
const issues = validateLensOutputs(
  ['eslint', 'typescript'],
  ['typescript'], // fileMetrics produced
  ['eslint', 'typescript'] // aggregates produced
);
// [{ lensId: 'eslint', missing: ['fileMetrics'] }]
```

## Adding a New Lens

1. **Add to registry** (`src/registry.ts`):

```typescript
{
  id: 'my-lens',
  name: 'My Lens',
  category: 'linting',
  languages: ['typescript', 'javascript'],
  alternativeTo: ['eslint'],  // Optional: if it's an alternative
  outputsFileMetrics: true,
  outputsAggregate: true,
  colorScheme: 'issues',
  description: 'My custom linting tool',
  command: 'my-lens check',
}
```

2. **Implement lens** in `@principal-ai/codebase-quality-lenses`

3. **Done!** - UI packages automatically discover and support it

## Available Lenses

### Linting
- `eslint` - ESLint (TypeScript/JavaScript)
- `biome-lint` - Biome Lint (TypeScript/JavaScript)
- `oxlint` - OxLint (TypeScript/JavaScript)
- `ruff` - Ruff (Python)
- `pylint` - Pylint (Python)
- `golangci-lint` - golangci-lint (Go)
- `clippy` - Clippy (Rust)

### Formatting
- `prettier` - Prettier (TypeScript/JavaScript)
- `biome-format` - Biome Format (TypeScript/JavaScript)
- `black` - Black (Python)
- `ruff-format` - Ruff Format (Python)
- `gofmt` - gofmt (Go)
- `rustfmt` - rustfmt (Rust)

### Types
- `typescript` - TypeScript
- `mypy` - MyPy (Python)
- `pyright` - Pyright (Python)
- `go-vet` - Go Vet (Go)

### Tests
- `jest` - Jest (TypeScript/JavaScript)
- `vitest` - Vitest (TypeScript/JavaScript)
- `bun-test` - Bun Test (TypeScript/JavaScript)
- `pytest` - Pytest (Python)
- `go-test` - Go Test (Go)
- `cargo-test` - Cargo Test (Rust)

### Dead Code
- `knip` - Knip (TypeScript/JavaScript)
- `vulture` - Vulture (Python)

### Documentation
- `alexandria` - Alexandria (TypeScript/JavaScript)
- `typedoc` - TypeDoc (TypeScript)

### Security
- `npm-audit` - npm audit (TypeScript/JavaScript)
- `bandit` - Bandit (Python)

## License

MIT
