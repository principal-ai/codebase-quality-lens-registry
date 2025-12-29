/**
 * Supported programming languages for quality lenses
 */
type Language = 'typescript' | 'javascript' | 'python' | 'go' | 'rust' | 'java' | 'csharp' | 'ruby' | 'php';
/**
 * Quality metric categories
 * Each category represents a dimension of code quality
 */
type LensCategory = 'linting' | 'formatting' | 'types' | 'tests' | 'dead-code' | 'documentation' | 'security' | 'complexity';
/**
 * How the lens results should be visualized in File City
 */
type ColorScheme = 'issues' | 'coverage' | 'binary';
/**
 * Metadata for a quality lens
 */
interface LensMetadata {
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
interface CategoryConfig {
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
interface LanguageConfig {
    id: Language;
    name: string;
    /** File extensions associated with this language */
    extensions: string[];
    /** Icon or emoji for the language */
    icon?: string;
}
/**
 * Per-file metric data from quality lenses
 * This is the standard structure produced by all lenses that output file metrics
 */
interface FileMetricData {
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
interface QualitySliceData {
    /** Per-file coverage percentages from test runners (path -> coverage %) */
    fileCoverage?: Record<string, number>;
    /** Per-file metrics keyed by lens ID (e.g., 'eslint', 'typescript', 'biome-lint') */
    fileMetrics?: Record<string, FileMetricData[]>;
}
/**
 * Built-in color modes that don't come from quality lenses
 * - fileTypes: Color by file extension
 * - git: Color by git status (modified, added, deleted)
 * - coverage: Color by test coverage percentage (derived from test lens data)
 */
type BuiltInColorMode = 'fileTypes' | 'git' | 'coverage';
/**
 * Lens-based color modes derived from LENS_REGISTRY
 * These are lens IDs that output file metrics
 */
type LensColorMode = 'eslint' | 'biome-lint' | 'oxlint' | 'ruff' | 'pylint' | 'golangci-lint' | 'clippy' | 'prettier' | 'biome-format' | 'black' | 'ruff-format' | 'gofmt' | 'rustfmt' | 'typescript' | 'mypy' | 'pyright' | 'go-vet' | 'jest' | 'vitest' | 'bun-test' | 'pytest' | 'go-test' | 'cargo-test' | 'knip' | 'vulture' | 'alexandria' | 'bandit';
/**
 * All available color modes for File City visualization
 */
type ColorMode = BuiltInColorMode | LensColorMode;
/**
 * Configuration for a color mode (for UI display)
 */
interface ColorModeConfig {
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
/**
 * Configuration for a single lens command
 * Can be a simple string (the command) or a detailed config object
 */
interface LensCommandConfig {
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
interface QualityLensConfig {
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
interface ResolvedLensCommand {
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

/**
 * Central registry of all quality lenses
 *
 * When adding a new lens:
 * 1. Add it to this registry with complete metadata
 * 2. Implement the lens in @principal-ai/codebase-quality-lenses
 * 3. The UI packages will automatically discover and support it
 */
declare const LENS_REGISTRY: LensMetadata[];
/**
 * Category configurations for UI display
 */
declare const CATEGORY_CONFIGS: CategoryConfig[];
/**
 * Language configurations for UI display
 */
declare const LANGUAGE_CONFIGS: LanguageConfig[];

/**
 * Get lens metadata by ID
 */
declare function getLensById(id: string): LensMetadata | undefined;
/**
 * Get all lenses in a category
 */
declare function getLensesByCategory(category: LensCategory): LensMetadata[];
/**
 * Get all lenses that support a language
 */
declare function getLensesByLanguage(language: Language): LensMetadata[];
/**
 * Get lenses that support a category for a specific language
 */
declare function getLensesByCategoryAndLanguage(category: LensCategory, language: Language): LensMetadata[];
/**
 * Get the category for a lens ID
 */
declare function getCategoryForLens(lensId: string): LensCategory | undefined;
/**
 * Get alternative lenses for a given lens ID
 */
declare function getAlternatives(lensId: string): LensMetadata[];
/**
 * Check if two lenses are alternatives to each other
 */
declare function areLensesAlternatives(lensId1: string, lensId2: string): boolean;
/**
 * Get all lenses that output file metrics (for File City visualization)
 */
declare function getLensesWithFileMetrics(): LensMetadata[];
/**
 * Get all lenses that output aggregate scores (for Quality Hexagon)
 */
declare function getLensesWithAggregates(): LensMetadata[];
/**
 * Get the appropriate color mode (lens ID) for a category based on which lenses ran
 * Returns the first lens that ran for the category, preferring alternatives in order
 */
declare function getColorModeForCategory(category: LensCategory, lensesRan: string[]): string | null;
/**
 * Get display name for a lens (for UI labels)
 */
declare function getLensDisplayName(lensId: string): string;
/**
 * Get color scheme for a lens (for File City layer rendering)
 */
declare function getLensColorScheme(lensId: string): 'issues' | 'coverage' | 'binary';
/**
 * Get category configuration
 */
declare function getCategoryConfig(category: LensCategory): CategoryConfig | undefined;
/**
 * Get category display name
 */
declare function getCategoryDisplayName(category: LensCategory): string;
/**
 * Check if a category uses inverted scale (lower is better)
 */
declare function isCategoryInverted(category: LensCategory): boolean;
/**
 * Get language configuration
 */
declare function getLanguageConfig(language: Language): LanguageConfig | undefined;
/**
 * Detect language from file extension
 */
declare function detectLanguageFromExtension(extension: string): Language | undefined;
/**
 * Get all languages that have lenses in a category
 */
declare function getLanguagesForCategory(category: LensCategory): Language[];
/**
 * Hexagon metric keys use camelCase (from QualityMetrics interface)
 * These map to LensCategory which uses kebab-case
 */
type HexagonMetricKey = 'linting' | 'formatting' | 'types' | 'tests' | 'deadCode' | 'documentation';
/**
 * Get the LensCategory for a hexagon metric key
 */
declare function getCategoryForHexagonMetric(metric: HexagonMetricKey): LensCategory;
/**
 * Get the hexagon metric key for a LensCategory
 */
declare function getHexagonMetricForCategory(category: LensCategory): HexagonMetricKey | undefined;
/**
 * Check if a lens ID belongs to a hexagon metric
 */
declare function isLensInHexagonMetric(lensId: string, metric: HexagonMetricKey): boolean;
/**
 * Get the color mode for a hexagon metric based on which lenses ran.
 * This is the main entry point for the QualityHexagon panel.
 */
declare function getColorModeForHexagonMetric(metric: HexagonMetricKey, lensesRan: string[]): string | null;
/**
 * Check if a hexagon metric is configured (has at least one lens that ran)
 */
declare function isHexagonMetricConfigured(metric: HexagonMetricKey, lensesRan: string[] | undefined): boolean;
/**
 * Get all hexagon metric keys
 */
declare function getHexagonMetricKeys(): HexagonMetricKey[];
/**
 * Validate that a lens ID exists in the registry
 */
declare function isValidLensId(lensId: string): boolean;
/**
 * Find lenses that ran for the same category (potential conflicts)
 */
declare function findCategoryConflicts(lensesRan: string[]): Array<{
    category: LensCategory;
    lenses: string[];
}>;
/**
 * Check if all required lenses produced expected outputs
 */
declare function validateLensOutputs(lensesRan: string[], fileMetricsProduced: string[], aggregatesProduced: string[]): Array<{
    lensId: string;
    missing: ('fileMetrics' | 'aggregate')[];
}>;
/**
 * Get all available color modes (built-in + lens-based)
 */
declare function getAvailableColorModes(): ColorMode[];
/**
 * Get all lens-based color modes (lenses that output file metrics)
 */
declare function getLensColorModes(): LensColorMode[];
/**
 * Check if a string is a valid color mode
 */
declare function isValidColorMode(mode: string): mode is ColorMode;
/**
 * Check if a color mode is lens-based (not built-in)
 */
declare function isLensColorMode(mode: string): mode is LensColorMode;
/**
 * Get configuration for a color mode
 */
declare function getColorModeConfig(mode: ColorMode): ColorModeConfig | undefined;
/**
 * Get all color mode configurations (for building UI dropdowns/lists)
 */
declare function getAllColorModeConfigs(): ColorModeConfig[];
/**
 * Get color modes available for a specific language
 * (built-in modes + lens modes that support the language)
 */
declare function getColorModesForLanguage(language: Language): ColorMode[];
/**
 * Get color modes available based on which lenses ran
 * (built-in modes + lens modes from lensesRan list)
 */
declare function getAvailableColorModesFromLenses(lensesRan: string[]): ColorMode[];
/**
 * Check if a color mode is available based on which lenses ran
 */
declare function isColorModeAvailable(mode: ColorMode, lensesRan: string[]): boolean;

/**
 * Default lens commands per language
 *
 * These are used when no quality-lens.yaml config is found.
 * The CLI will try these commands in order of preference.
 */

/**
 * Default command configuration for a lens
 */
interface DefaultLensCommand {
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
declare const JAVASCRIPT_DEFAULTS: DefaultLensCommand[];
/**
 * Default lens commands for Python projects
 */
declare const PYTHON_DEFAULTS: DefaultLensCommand[];
/**
 * Default lens commands for Go projects
 */
declare const GO_DEFAULTS: DefaultLensCommand[];
/**
 * Default lens commands for Rust projects
 */
declare const RUST_DEFAULTS: DefaultLensCommand[];
/**
 * All default commands by language
 */
declare const DEFAULT_COMMANDS: Record<Language, DefaultLensCommand[]>;
/**
 * Get default commands for a language
 */
declare function getDefaultCommands(language: Language): DefaultLensCommand[];
/**
 * Get default command for a specific lens
 */
declare function getDefaultCommand(lensId: string, language?: Language): DefaultLensCommand | undefined;
/**
 * Get all unique lens IDs that have default commands
 */
declare function getAllDefaultLensIds(): string[];

export { type BuiltInColorMode, CATEGORY_CONFIGS, type CategoryConfig, type ColorMode, type ColorModeConfig, type ColorScheme, DEFAULT_COMMANDS, type DefaultLensCommand, type FileMetricData, GO_DEFAULTS, type HexagonMetricKey, JAVASCRIPT_DEFAULTS, LANGUAGE_CONFIGS, LENS_REGISTRY, type Language, type LanguageConfig, type LensCategory, type LensColorMode, type LensCommandConfig, type LensMetadata, PYTHON_DEFAULTS, type QualityLensConfig, type QualitySliceData, RUST_DEFAULTS, type ResolvedLensCommand, areLensesAlternatives, detectLanguageFromExtension, findCategoryConflicts, getAllColorModeConfigs, getAllDefaultLensIds, getAlternatives, getAvailableColorModes, getAvailableColorModesFromLenses, getCategoryConfig, getCategoryDisplayName, getCategoryForHexagonMetric, getCategoryForLens, getColorModeConfig, getColorModeForCategory, getColorModeForHexagonMetric, getColorModesForLanguage, getDefaultCommand, getDefaultCommands, getHexagonMetricForCategory, getHexagonMetricKeys, getLanguageConfig, getLanguagesForCategory, getLensById, getLensColorModes, getLensColorScheme, getLensDisplayName, getLensesByCategory, getLensesByCategoryAndLanguage, getLensesByLanguage, getLensesWithAggregates, getLensesWithFileMetrics, isCategoryInverted, isColorModeAvailable, isHexagonMetricConfigured, isLensColorMode, isLensInHexagonMetric, isValidColorMode, isValidLensId, validateLensOutputs };
