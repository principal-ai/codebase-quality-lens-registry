/**
 * Supported programming languages for quality lenses
 */
export type Language =
  | 'typescript'
  | 'javascript'
  | 'python'
  | 'go'
  | 'rust'
  | 'java'
  | 'csharp'
  | 'ruby'
  | 'php';

/**
 * Quality metric categories
 * Each category represents a dimension of code quality
 */
export type LensCategory =
  | 'linting'       // Code style and bug detection (ESLint, Biome, Ruff)
  | 'formatting'    // Code formatting (Prettier, Biome, Black)
  | 'types'         // Type checking (TypeScript, MyPy, Pyright)
  | 'tests'         // Test coverage and results (Jest, Pytest, Vitest)
  | 'dead-code'     // Unused code detection (Knip, Vulture)
  | 'documentation' // Documentation coverage (TypeDoc, Alexandria)
  | 'security'      // Security scanning (npm audit, Bandit)
  | 'complexity';   // Code complexity metrics (future)

/**
 * How the lens results should be visualized in File City
 */
export type ColorScheme =
  | 'issues'    // Issue count gradient (0=green, many=red)
  | 'coverage'  // Percentage gradient (100%=green, 0%=red)
  | 'binary';   // Has issues or not (green/red)

/**
 * Requirements for a lens to produce complete file metrics
 * Used by the CLI diagnose command to help users configure lenses correctly
 */
export interface FileMetricsRequirements {
  /**
   * The complete command that produces full file metrics
   * This is the "known good" configuration for quality-lens.yaml
   */
  completeCommand: string;

  /**
   * Required flags that must be present for complete file metrics
   * e.g., ['--listFiles'] for TypeScript, ['--coverage'] for Jest
   */
  requiredFlags?: string[];

  /**
   * Output format flag required for parsing (if any)
   * e.g., '--format json' for ESLint, '--reporter=json' for Biome
   */
  formatFlag?: string;

  /**
   * What happens without the required configuration
   * Shown to users to explain why their setup is incomplete
   */
  withoutConfig: string;

  /**
   * Strategy used when complete file metrics are unavailable
   * - 'source-file-count': Count source files as fallback
   * - 'issues-only': Only files with issues are reported
   * - 'coverage-only': Only coverage data, no source metrics
   * - 'none': No fallback available
   */
  fallbackStrategy: 'source-file-count' | 'issues-only' | 'coverage-only' | 'none';

  /**
   * Whether this lens natively produces complete file metrics
   * (i.e., reports ALL analyzed files, not just those with issues)
   */
  nativelyComplete: boolean;

  /**
   * Additional notes about file metrics for this lens
   */
  notes?: string;
}

/**
 * Metadata for a quality lens
 */
export interface LensMetadata {
  /** Unique identifier for the lens (e.g., 'biome-lint', 'eslint', 'ruff') */
  id: string;

  /** Human-readable display name (e.g., 'Biome Lint', 'ESLint', 'Ruff') */
  name: string;

  /** Quality category this lens belongs to */
  category: LensCategory;

  /** Programming languages this lens supports */
  languages: Language[];

  /**
   * Other lens IDs that this lens is an alternative to
   * Used to avoid running multiple lenses for the same purpose
   * e.g., biome-lint is an alternative to eslint
   */
  alternativeTo?: string[];

  /** Whether this lens outputs per-file metrics (for File City visualization) */
  outputsFileMetrics: boolean;

  /** Whether this lens outputs aggregate scores (for Quality Hexagon) */
  outputsAggregate: boolean;

  /** How to visualize the metrics in File City */
  colorScheme: ColorScheme;

  /** Optional description of what this lens checks */
  description?: string;

  /**
   * The CLI command/binary used to run this lens
   * Useful for documentation and debugging
   */
  command?: string;

  /**
   * Requirements for producing complete file metrics
   * Used by CLI diagnose command to help users configure correctly
   */
  fileMetricsRequirements?: FileMetricsRequirements;
}

/**
 * Category display configuration for UI
 */
export interface CategoryConfig {
  id: LensCategory;
  name: string;
  description: string;
  /** Icon name (for lucide-react or similar) */
  icon?: string;
  /** Whether lower values are better (e.g., dead-code) */
  invertedScale?: boolean;
}

/**
 * Language display configuration for UI
 */
export interface LanguageConfig {
  id: Language;
  name: string;
  /** File extensions associated with this language */
  extensions: string[];
  /** Icon or emoji for the language */
  icon?: string;
}

// ============================================================
// File Metrics Types (per-file quality data from lenses)
// ============================================================

/**
 * Per-file metric data from quality lenses
 * This is the standard structure produced by all lenses that output file metrics
 */
export interface FileMetricData {
  /** File path relative to repository root */
  file: string;
  /** Overall score (0-100, higher is better) */
  score: number;
  /** Total number of issues found */
  issueCount: number;
  /** Number of errors (highest severity) */
  errorCount: number;
  /** Number of warnings */
  warningCount: number;
  /** Number of info-level diagnostics */
  infoCount: number;
  /** Number of hints (lowest severity) */
  hintCount: number;
  /** Number of auto-fixable issues (optional) */
  fixableCount?: number;
  /** Issue counts by category (optional, for detailed breakdown) */
  categories?: Record<string, number>;
}

/**
 * Quality data slice structure for File City visualization
 * Contains per-file metrics keyed by lens ID
 */
export interface QualitySliceData {
  /** Per-file coverage percentages from test runners (path -> coverage %) */
  fileCoverage?: Record<string, number>;
  /** Per-file metrics keyed by lens ID (e.g., 'eslint', 'typescript', 'biome-lint') */
  fileMetrics?: Record<string, FileMetricData[]>;
}

// ============================================================
// Color Mode Types (for File City visualization)
// ============================================================

/**
 * Built-in color modes that don't come from quality lenses
 * - fileTypes: Color by file extension
 * - git: Color by git status (modified, added, deleted)
 * - coverage: Color by test coverage percentage (derived from test lens data)
 */
export type BuiltInColorMode = 'fileTypes' | 'git' | 'coverage';

/**
 * Lens-based color modes derived from LENS_REGISTRY
 * These are lens IDs that output file metrics
 */
export type LensColorMode =
  // Linting
  | 'eslint'
  | 'biome-lint'
  | 'oxlint'
  | 'ruff'
  | 'pylint'
  | 'golangci-lint'
  | 'clippy'
  // Formatting
  | 'prettier'
  | 'biome-format'
  | 'black'
  | 'ruff-format'
  | 'gofmt'
  | 'rustfmt'
  // Types
  | 'typescript'
  | 'mypy'
  | 'pyright'
  | 'go-vet'
  // Tests (coverage)
  | 'jest'
  | 'vitest'
  | 'bun-test'
  | 'pytest'
  | 'go-test'
  | 'cargo-test'
  | 'cargo-nextest'
  // Dead code
  | 'knip'
  | 'vulture'
  // Documentation
  | 'alexandria'
  // Security
  | 'bandit';

/**
 * All available color modes for File City visualization
 */
export type ColorMode = BuiltInColorMode | LensColorMode;

/**
 * Configuration for a color mode (for UI display)
 */
export interface ColorModeConfig {
  id: ColorMode;
  name: string;
  description: string;
  /** Icon name (for lucide-react or similar) */
  icon?: string;
  /** The color scheme to use for visualization */
  colorScheme: ColorScheme | 'categorical';
  /** Whether this is a built-in mode (not from a lens) */
  isBuiltIn: boolean;
  /** The lens category this mode belongs to (if lens-based) */
  category?: LensCategory;
}

// ============================================================
// Quality Lens Config Types (quality-lens.yaml)
// ============================================================

/**
 * Configuration for a single lens command
 * Can be a simple string (the command) or a detailed config object
 */
export interface LensCommandConfig {
  /** The command to run (e.g., "npm test", "go test ./...") */
  command: string;
  /** Additional arguments to pass to the command */
  args?: string[];
  /** Working directory relative to package root */
  cwd?: string;
  /** Environment variables to set */
  env?: Record<string, string>;
  /** Timeout in milliseconds */
  timeout?: number;
}

/**
 * Quality Lens configuration file structure (quality-lens.yaml)
 *
 * @example
 * ```yaml
 * # Simple string commands
 * lenses:
 *   jest: npm test
 *   typescript: npx tsc --noEmit
 *
 * # Detailed config
 * lenses:
 *   eslint:
 *     command: npm run lint
 *     timeout: 60000
 *
 * # Exclude patterns
 * exclude:
 *   - "fixtures/"
 * ```
 */
export interface QualityLensConfig {
  /**
   * Lens commands mapping: lens ID → command (string or config)
   * Only lenses defined here will run for this package
   */
  lenses?: Record<string, string | LensCommandConfig>;

  /**
   * Whether to inherit lenses from parent config (git root)
   * @default true
   */
  inherit?: boolean;

  /**
   * Glob patterns for files/directories to exclude from analysis
   */
  exclude?: string[];

  /**
   * Package-specific overrides in monorepos
   * Maps package name/path to package-specific config
   */
  packages?: Record<string, Omit<QualityLensConfig, 'packages'>>;
}

/**
 * Resolved lens command after config parsing
 * Always has the full command details
 */
export interface ResolvedLensCommand {
  /** Lens ID (e.g., 'jest', 'eslint', 'typescript') */
  lensId: string;
  /** Full command to execute */
  command: string;
  /** Additional arguments */
  args: string[];
  /** Working directory */
  cwd?: string;
  /** Environment variables */
  env?: Record<string, string>;
  /** Timeout in milliseconds */
  timeout?: number;
  /** Source of this command ('config' | 'default' | 'heuristic') */
  source: 'config' | 'default' | 'heuristic';
}
