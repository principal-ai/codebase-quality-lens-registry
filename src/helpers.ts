import type { LensMetadata, LensCategory, Language, CategoryConfig, LanguageConfig, ColorMode, LensColorMode, ColorModeConfig, ColorScheme } from './types.js';
import { LENS_REGISTRY, CATEGORY_CONFIGS, LANGUAGE_CONFIGS } from './registry.js';

// ============================================================
// Lens Lookups
// ============================================================

/**
 * Get lens metadata by ID
 */
export function getLensById(id: string): LensMetadata | undefined {
  return LENS_REGISTRY.find((lens) => lens.id === id);
}

/**
 * Get all lenses in a category
 */
export function getLensesByCategory(category: LensCategory): LensMetadata[] {
  return LENS_REGISTRY.filter((lens) => lens.category === category);
}

/**
 * Get all lenses that support a language
 */
export function getLensesByLanguage(language: Language): LensMetadata[] {
  return LENS_REGISTRY.filter((lens) => lens.languages.includes(language));
}

/**
 * Get lenses that support a category for a specific language
 */
export function getLensesByCategoryAndLanguage(
  category: LensCategory,
  language: Language
): LensMetadata[] {
  return LENS_REGISTRY.filter(
    (lens) => lens.category === category && lens.languages.includes(language)
  );
}

/**
 * Get the category for a lens ID
 */
export function getCategoryForLens(lensId: string): LensCategory | undefined {
  return getLensById(lensId)?.category;
}

/**
 * Get alternative lenses for a given lens ID
 */
export function getAlternatives(lensId: string): LensMetadata[] {
  const lens = getLensById(lensId);
  if (!lens) return [];

  // Find lenses that list this one as an alternative
  const listedAsAlternative = LENS_REGISTRY.filter(
    (other) => other.alternativeTo?.includes(lensId)
  );

  // Find lenses that this one lists as alternatives
  const thisListsAsAlternative = lens.alternativeTo
    ? LENS_REGISTRY.filter((other) => lens.alternativeTo!.includes(other.id))
    : [];

  // Combine and dedupe
  const all = [...listedAsAlternative, ...thisListsAsAlternative];
  return Array.from(new Map(all.map((l) => [l.id, l])).values());
}

/**
 * Check if two lenses are alternatives to each other
 */
export function areLensesAlternatives(lensId1: string, lensId2: string): boolean {
  const lens1 = getLensById(lensId1);
  const lens2 = getLensById(lensId2);

  if (!lens1 || !lens2) return false;
  if (lens1.category !== lens2.category) return false;

  return (
    lens1.alternativeTo?.includes(lensId2) ||
    lens2.alternativeTo?.includes(lensId1) ||
    false
  );
}

/**
 * Get all lenses that output file metrics (for File City visualization)
 */
export function getLensesWithFileMetrics(): LensMetadata[] {
  return LENS_REGISTRY.filter((lens) => lens.outputsFileMetrics);
}

/**
 * Get all lenses that output aggregate scores (for Quality Hexagon)
 */
export function getLensesWithAggregates(): LensMetadata[] {
  return LENS_REGISTRY.filter((lens) => lens.outputsAggregate);
}

// ============================================================
// Color Mode Helpers (for File City)
// ============================================================

/**
 * Get the appropriate color mode (lens ID) for a category based on which lenses ran
 * Returns the first lens that ran for the category, preferring alternatives in order
 */
export function getColorModeForCategory(
  category: LensCategory,
  lensesRan: string[]
): string | null {
  const lensesInCategory = getLensesByCategory(category);

  // Find the first lens that ran
  for (const lensId of lensesRan) {
    if (lensesInCategory.some((lens) => lens.id === lensId)) {
      return lensId;
    }
  }

  return null;
}

/**
 * Get display name for a lens (for UI labels)
 */
export function getLensDisplayName(lensId: string): string {
  return getLensById(lensId)?.name ?? lensId;
}

/**
 * Get color scheme for a lens (for File City layer rendering)
 */
export function getLensColorScheme(lensId: string): 'issues' | 'coverage' | 'binary' {
  return getLensById(lensId)?.colorScheme ?? 'issues';
}

// ============================================================
// Category Helpers
// ============================================================

/**
 * Get category configuration
 */
export function getCategoryConfig(category: LensCategory): CategoryConfig | undefined {
  return CATEGORY_CONFIGS.find((c) => c.id === category);
}

/**
 * Get category display name
 */
export function getCategoryDisplayName(category: LensCategory): string {
  return getCategoryConfig(category)?.name ?? category;
}

/**
 * Check if a category uses inverted scale (lower is better)
 */
export function isCategoryInverted(category: LensCategory): boolean {
  return getCategoryConfig(category)?.invertedScale ?? false;
}

// ============================================================
// Language Helpers
// ============================================================

/**
 * Get language configuration
 */
export function getLanguageConfig(language: Language): LanguageConfig | undefined {
  return LANGUAGE_CONFIGS.find((l) => l.id === language);
}

/**
 * Detect language from file extension
 */
export function detectLanguageFromExtension(extension: string): Language | undefined {
  const normalizedExt = extension.startsWith('.') ? extension : `.${extension}`;
  const config = LANGUAGE_CONFIGS.find((l) =>
    l.extensions.includes(normalizedExt.toLowerCase())
  );
  return config?.id;
}

/**
 * Get all languages that have lenses in a category
 */
export function getLanguagesForCategory(category: LensCategory): Language[] {
  const lenses = getLensesByCategory(category);
  const languages = new Set<Language>();
  for (const lens of lenses) {
    for (const lang of lens.languages) {
      languages.add(lang);
    }
  }
  return Array.from(languages);
}

// ============================================================
// Hexagon Metric Helpers (for Quality Hexagon UI)
// ============================================================

/**
 * Hexagon metric keys use camelCase (from QualityMetrics interface)
 * These map to LensCategory which uses kebab-case
 */
export type HexagonMetricKey =
  | 'linting'
  | 'formatting'
  | 'types'
  | 'tests'
  | 'deadCode'
  | 'documentation';

/**
 * Map hexagon metric keys to registry LensCategory
 */
const HEXAGON_METRIC_TO_CATEGORY: Record<HexagonMetricKey, LensCategory> = {
  linting: 'linting',
  formatting: 'formatting',
  types: 'types',
  tests: 'tests',
  deadCode: 'dead-code',
  documentation: 'documentation',
};

/**
 * Map LensCategory back to hexagon metric keys
 */
const CATEGORY_TO_HEXAGON_METRIC: Partial<Record<LensCategory, HexagonMetricKey>> = {
  'linting': 'linting',
  'formatting': 'formatting',
  'types': 'types',
  'tests': 'tests',
  'dead-code': 'deadCode',
  'documentation': 'documentation',
};

/**
 * Get the LensCategory for a hexagon metric key
 */
export function getCategoryForHexagonMetric(metric: HexagonMetricKey): LensCategory {
  return HEXAGON_METRIC_TO_CATEGORY[metric];
}

/**
 * Get the hexagon metric key for a LensCategory
 */
export function getHexagonMetricForCategory(category: LensCategory): HexagonMetricKey | undefined {
  return CATEGORY_TO_HEXAGON_METRIC[category];
}

/**
 * Check if a lens ID belongs to a hexagon metric
 */
export function isLensInHexagonMetric(lensId: string, metric: HexagonMetricKey): boolean {
  const lensCategory = getCategoryForLens(lensId);
  if (!lensCategory) return false;
  return HEXAGON_METRIC_TO_CATEGORY[metric] === lensCategory;
}

/**
 * Get the color mode for a hexagon metric based on which lenses ran.
 * This is the main entry point for the QualityHexagon panel.
 */
export function getColorModeForHexagonMetric(
  metric: HexagonMetricKey,
  lensesRan: string[]
): string | null {
  const category = HEXAGON_METRIC_TO_CATEGORY[metric];
  return getColorModeForCategory(category, lensesRan);
}

/**
 * Check if a hexagon metric is configured (has at least one lens that ran)
 */
export function isHexagonMetricConfigured(
  metric: HexagonMetricKey,
  lensesRan: string[] | undefined
): boolean {
  // undefined = old data without lensesRan tracking, assume all configured (backwards compatibility)
  if (lensesRan === undefined) {
    return true;
  }
  // Empty array = new data, explicitly no lenses ran for this package
  if (lensesRan.length === 0) {
    return false;
  }
  return lensesRan.some((lensId) => isLensInHexagonMetric(lensId, metric));
}

/**
 * Get all hexagon metric keys
 */
export function getHexagonMetricKeys(): HexagonMetricKey[] {
  return Object.keys(HEXAGON_METRIC_TO_CATEGORY) as HexagonMetricKey[];
}

// ============================================================
// Validation Helpers
// ============================================================

/**
 * Validate that a lens ID exists in the registry
 */
export function isValidLensId(lensId: string): boolean {
  return getLensById(lensId) !== undefined;
}

/**
 * Find lenses that ran for the same category (potential conflicts)
 */
export function findCategoryConflicts(
  lensesRan: string[]
): Array<{ category: LensCategory; lenses: string[] }> {
  const byCategory = new Map<LensCategory, string[]>();

  for (const lensId of lensesRan) {
    const category = getCategoryForLens(lensId);
    if (category) {
      const existing = byCategory.get(category) || [];
      existing.push(lensId);
      byCategory.set(category, existing);
    }
  }

  const conflicts: Array<{ category: LensCategory; lenses: string[] }> = [];
  for (const [category, lenses] of byCategory) {
    if (lenses.length > 1) {
      conflicts.push({ category, lenses });
    }
  }

  return conflicts;
}

/**
 * Check if all required lenses produced expected outputs
 */
export function validateLensOutputs(
  lensesRan: string[],
  fileMetricsProduced: string[],
  aggregatesProduced: string[]
): Array<{ lensId: string; missing: ('fileMetrics' | 'aggregate')[] }> {
  const issues: Array<{ lensId: string; missing: ('fileMetrics' | 'aggregate')[] }> = [];

  for (const lensId of lensesRan) {
    const lens = getLensById(lensId);
    if (!lens) continue;

    const missing: ('fileMetrics' | 'aggregate')[] = [];

    if (lens.outputsFileMetrics && !fileMetricsProduced.includes(lensId)) {
      missing.push('fileMetrics');
    }
    if (lens.outputsAggregate && !aggregatesProduced.includes(lensId)) {
      missing.push('aggregate');
    }

    if (missing.length > 0) {
      issues.push({ lensId, missing });
    }
  }

  return issues;
}

// ============================================================
// Color Mode Helpers (for File City visualization)
// ============================================================

/**
 * Built-in color modes that don't come from quality lenses
 */
const BUILT_IN_COLOR_MODES: ColorModeConfig[] = [
  {
    id: 'fileTypes',
    name: 'File Types',
    description: 'Color by file extension/type',
    icon: 'FileCode',
    colorScheme: 'categorical',
    isBuiltIn: true,
  },
  {
    id: 'git',
    name: 'Git Status',
    description: 'Color by git status (modified, added, etc.)',
    icon: 'GitBranch',
    colorScheme: 'categorical',
    isBuiltIn: true,
  },
  {
    id: 'coverage',
    name: 'Test Coverage',
    description: 'Color by test coverage percentage',
    icon: 'TestTube',
    colorScheme: 'coverage',
    isBuiltIn: true,
    category: 'tests',
  },
];

/**
 * Get all available color modes (built-in + lens-based)
 */
export function getAvailableColorModes(): ColorMode[] {
  const builtIn: ColorMode[] = ['fileTypes', 'git', 'coverage'];
  const lensColorModes = getLensColorModes();
  return [...builtIn, ...lensColorModes];
}

/**
 * Get all lens-based color modes (lenses that output file metrics)
 */
export function getLensColorModes(): LensColorMode[] {
  return LENS_REGISTRY
    .filter((lens) => lens.outputsFileMetrics)
    .map((lens) => lens.id as LensColorMode);
}

/**
 * Check if a string is a valid color mode
 */
export function isValidColorMode(mode: string): mode is ColorMode {
  return getAvailableColorModes().includes(mode as ColorMode);
}

/**
 * Check if a color mode is lens-based (not built-in)
 */
export function isLensColorMode(mode: string): mode is LensColorMode {
  return getLensColorModes().includes(mode as LensColorMode);
}

/**
 * Get configuration for a color mode
 */
export function getColorModeConfig(mode: ColorMode): ColorModeConfig | undefined {
  // Check built-in modes first
  const builtIn = BUILT_IN_COLOR_MODES.find((m) => m.id === mode);
  if (builtIn) return builtIn;

  // Check lens-based modes
  const lens = getLensById(mode);
  if (lens && lens.outputsFileMetrics) {
    const category = getCategoryConfig(lens.category);
    return {
      id: mode,
      name: lens.name,
      description: lens.description ?? `${lens.name} analysis`,
      icon: category?.icon,
      colorScheme: lens.colorScheme,
      isBuiltIn: false,
      category: lens.category,
    };
  }

  return undefined;
}

/**
 * Get all color mode configurations (for building UI dropdowns/lists)
 */
export function getAllColorModeConfigs(): ColorModeConfig[] {
  const configs: ColorModeConfig[] = [...BUILT_IN_COLOR_MODES];

  for (const lens of LENS_REGISTRY) {
    if (lens.outputsFileMetrics) {
      const category = getCategoryConfig(lens.category);
      configs.push({
        id: lens.id as ColorMode,
        name: lens.name,
        description: lens.description ?? `${lens.name} analysis`,
        icon: category?.icon,
        colorScheme: lens.colorScheme,
        isBuiltIn: false,
        category: lens.category,
      });
    }
  }

  return configs;
}

/**
 * Get color modes available for a specific language
 * (built-in modes + lens modes that support the language)
 */
export function getColorModesForLanguage(language: Language): ColorMode[] {
  const builtIn: ColorMode[] = ['fileTypes', 'git'];

  const lensColorModes = LENS_REGISTRY
    .filter((lens) => lens.outputsFileMetrics && lens.languages.includes(language))
    .map((lens) => lens.id as LensColorMode);

  return [...builtIn, ...lensColorModes];
}

/**
 * Get color modes available based on which lenses ran
 * (built-in modes + lens modes from lensesRan list)
 */
export function getAvailableColorModesFromLenses(lensesRan: string[]): ColorMode[] {
  const builtIn: ColorMode[] = ['fileTypes', 'git', 'coverage'];

  const lensColorModes = lensesRan.filter((lensId) => {
    const lens = getLensById(lensId);
    return lens?.outputsFileMetrics;
  }) as LensColorMode[];

  return [...builtIn, ...lensColorModes];
}

/**
 * Check if a color mode is available based on which lenses ran
 */
export function isColorModeAvailable(mode: ColorMode, lensesRan: string[]): boolean {
  // Built-in modes are always available
  if (mode === 'fileTypes' || mode === 'git' || mode === 'coverage') {
    return true;
  }

  // Lens-based modes are available if the lens ran
  return lensesRan.includes(mode);
}
