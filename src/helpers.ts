import type { LensMetadata, LensCategory, Language, CategoryConfig, LanguageConfig } from './types.js';
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
