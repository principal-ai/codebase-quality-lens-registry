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
