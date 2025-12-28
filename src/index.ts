/**
 * @principal-ai/quality-lens-registry
 *
 * Centralized registry of quality lens metadata for the Principal AI quality toolchain.
 *
 * This package provides a single source of truth for:
 * - Lens metadata (what lenses exist, what they do)
 * - Category definitions (linting, formatting, types, etc.)
 * - Language support (which lenses work with which languages)
 * - Helper functions for lookups and validation
 *
 * When adding a new lens:
 * 1. Add it to LENS_REGISTRY in src/registry.ts
 * 2. Implement the lens in @principal-ai/codebase-quality-lenses
 * 3. The UI packages will automatically discover and support it
 *
 * @example
 * ```typescript
 * import {
 *   getLensById,
 *   getLensesByCategory,
 *   getColorModeForCategory,
 *   LENS_REGISTRY
 * } from '@principal-ai/quality-lens-registry';
 *
 * // Get metadata for a specific lens
 * const eslint = getLensById('eslint');
 *
 * // Get all linting tools
 * const linters = getLensesByCategory('linting');
 *
 * // Determine which color mode to use based on lenses that ran
 * const colorMode = getColorModeForCategory('linting', ['biome-lint', 'typescript']);
 * // Returns 'biome-lint'
 * ```
 */

// Export types
export type {
  Language,
  LensCategory,
  ColorScheme,
  LensMetadata,
  CategoryConfig,
  LanguageConfig,
} from './types.js';

// Export registry data
export {
  LENS_REGISTRY,
  CATEGORY_CONFIGS,
  LANGUAGE_CONFIGS,
} from './registry.js';

// Export helper functions
export {
  // Lens lookups
  getLensById,
  getLensesByCategory,
  getLensesByLanguage,
  getLensesByCategoryAndLanguage,
  getCategoryForLens,
  getAlternatives,
  areLensesAlternatives,
  getLensesWithFileMetrics,
  getLensesWithAggregates,

  // Color mode helpers
  getColorModeForCategory,
  getLensDisplayName,
  getLensColorScheme,

  // Category helpers
  getCategoryConfig,
  getCategoryDisplayName,
  isCategoryInverted,

  // Language helpers
  getLanguageConfig,
  detectLanguageFromExtension,
  getLanguagesForCategory,

  // Validation helpers
  isValidLensId,
  findCategoryConflicts,
  validateLensOutputs,
} from './helpers.js';
