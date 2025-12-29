/**
 * Quality data extraction utilities
 *
 * Provides centralized logic for extracting fileCoverage and fileMetrics
 * from lens results. Used by both electron-app and web-ade.
 */

import type { FileMetricData, QualitySliceData } from './types.js';
import { getCategoryForLens } from './helpers.js';

/**
 * Input format for lens results (matches CLI output structure)
 */
export interface LensResultInput {
  /** Package info */
  package?: {
    name: string;
    path?: string;
  };
  /** Lens info */
  lens?: {
    id: string;
    command?: string;
  };
  /** Coverage data from test lenses (jest, vitest, pytest, etc.) */
  coverage?: {
    line?: number;
    branch?: number;
    function?: number;
    statement?: number;
    files?: Array<{
      file: string;
      lines: number;
      branches?: number;
      functions?: number;
      statements?: number;
    }>;
  };
  /** Per-file metrics from the lens */
  fileMetrics?: FileMetricData[];
}

/**
 * Normalize a lens ID to its canonical form
 *
 * Maps aliases to their primary lens ID:
 * - 'lint' -> 'eslint'
 * - 'typecheck'/'tsc' -> 'typescript'
 * - 'format' -> 'prettier'
 * - 'test' -> 'jest'
 */
export function normalizeLensId(lensId: string): string {
  const id = lensId.toLowerCase();

  // Linting aliases
  if (id === 'lint') return 'eslint';

  // Type checking aliases
  if (id === 'typecheck' || id === 'tsc') return 'typescript';

  // Formatting aliases
  if (id === 'format') return 'prettier';

  // Test aliases
  if (id === 'test') return 'jest';

  return id;
}

/**
 * Get the fileMetrics key for a lens
 *
 * Groups related lenses under the same key:
 * - biome-lint -> 'biome-lint' (not 'eslint', they're alternatives)
 * - biome-format -> 'biome-format' (not 'prettier')
 */
export function getFileMetricsKey(lensId: string): string {
  return normalizeLensId(lensId);
}

/**
 * Check if a lens produces coverage data
 */
export function lensProducesCoverage(lensId: string): boolean {
  return getCategoryForLens(lensId) === 'tests';
}

/**
 * Extract quality data (fileCoverage and fileMetrics) from lens results
 *
 * This is the main function used by both electron-app and web-ade to
 * process lens results from GitHub artifacts.
 *
 * @param results - Array of lens results from the CLI output
 * @returns Extracted quality data with fileCoverage and fileMetrics
 *
 * @example
 * ```typescript
 * const results = JSON.parse(artifactContents);
 * const { fileCoverage, fileMetrics } = extractQualityDataFromResults(results.results);
 * ```
 */
export function extractQualityDataFromResults(
  results: LensResultInput[]
): QualitySliceData {
  const fileCoverage: Record<string, number> = {};
  const fileMetrics: Record<string, FileMetricData[]> = {};

  for (const result of results) {
    const lensId = result.lens?.id?.toLowerCase() || 'unknown';

    // Extract coverage data from test lenses
    // Coverage comes from result.coverage.files (populated by jest, vitest, pytest, etc.)
    if (result.coverage?.files) {
      for (const file of result.coverage.files) {
        // Use lines as the primary coverage metric
        fileCoverage[file.file] = file.lines;
      }
    }

    // Extract file metrics
    if (result.fileMetrics && result.fileMetrics.length > 0) {
      const key = getFileMetricsKey(lensId);

      // Concatenate with existing metrics (for monorepos with multiple packages)
      fileMetrics[key] = [...(fileMetrics[key] || []), ...result.fileMetrics];
    }
  }

  return {
    fileCoverage: Object.keys(fileCoverage).length > 0 ? fileCoverage : undefined,
    fileMetrics: Object.keys(fileMetrics).length > 0 ? fileMetrics : undefined,
  };
}

/**
 * Extract quality data with package path prefixing
 *
 * Similar to extractQualityDataFromResults but prefixes file paths with
 * the package path. Useful when you need repo-relative paths.
 *
 * @param results - Array of lens results
 * @param prefixPaths - Whether to prefix paths with package path (default: false)
 */
export function extractQualityDataWithPaths(
  results: LensResultInput[],
  prefixPaths = false
): QualitySliceData {
  if (!prefixPaths) {
    return extractQualityDataFromResults(results);
  }

  const fileCoverage: Record<string, number> = {};
  const fileMetrics: Record<string, FileMetricData[]> = {};

  for (const result of results) {
    const lensId = result.lens?.id?.toLowerCase() || 'unknown';
    const packagePath = result.package?.path || '';

    // Helper to build full path
    const toFullPath = (filePath: string): string => {
      if (!packagePath || filePath.startsWith(packagePath)) {
        return filePath;
      }
      return `${packagePath}/${filePath}`;
    };

    // Extract coverage data
    if (result.coverage?.files) {
      for (const file of result.coverage.files) {
        const fullPath = toFullPath(file.file);
        fileCoverage[fullPath] = file.lines;
      }
    }

    // Extract file metrics with prefixed paths
    if (result.fileMetrics && result.fileMetrics.length > 0) {
      const key = getFileMetricsKey(lensId);
      const prefixedMetrics = result.fileMetrics.map((fm) => ({
        ...fm,
        file: toFullPath(fm.file),
      }));

      fileMetrics[key] = [...(fileMetrics[key] || []), ...prefixedMetrics];
    }
  }

  return {
    fileCoverage: Object.keys(fileCoverage).length > 0 ? fileCoverage : undefined,
    fileMetrics: Object.keys(fileMetrics).length > 0 ? fileMetrics : undefined,
  };
}
