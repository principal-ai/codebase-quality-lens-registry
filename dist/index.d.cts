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

export { CATEGORY_CONFIGS, type CategoryConfig, type ColorScheme, type HexagonMetricKey, LANGUAGE_CONFIGS, LENS_REGISTRY, type Language, type LanguageConfig, type LensCategory, type LensMetadata, areLensesAlternatives, detectLanguageFromExtension, findCategoryConflicts, getAlternatives, getCategoryConfig, getCategoryDisplayName, getCategoryForHexagonMetric, getCategoryForLens, getColorModeForCategory, getColorModeForHexagonMetric, getHexagonMetricForCategory, getHexagonMetricKeys, getLanguageConfig, getLanguagesForCategory, getLensById, getLensColorScheme, getLensDisplayName, getLensesByCategory, getLensesByCategoryAndLanguage, getLensesByLanguage, getLensesWithAggregates, getLensesWithFileMetrics, isCategoryInverted, isHexagonMetricConfigured, isLensInHexagonMetric, isValidLensId, validateLensOutputs };
