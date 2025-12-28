"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  CATEGORY_CONFIGS: () => CATEGORY_CONFIGS,
  LANGUAGE_CONFIGS: () => LANGUAGE_CONFIGS,
  LENS_REGISTRY: () => LENS_REGISTRY,
  areLensesAlternatives: () => areLensesAlternatives,
  detectLanguageFromExtension: () => detectLanguageFromExtension,
  findCategoryConflicts: () => findCategoryConflicts,
  getAlternatives: () => getAlternatives,
  getCategoryConfig: () => getCategoryConfig,
  getCategoryDisplayName: () => getCategoryDisplayName,
  getCategoryForHexagonMetric: () => getCategoryForHexagonMetric,
  getCategoryForLens: () => getCategoryForLens,
  getColorModeForCategory: () => getColorModeForCategory,
  getColorModeForHexagonMetric: () => getColorModeForHexagonMetric,
  getHexagonMetricForCategory: () => getHexagonMetricForCategory,
  getHexagonMetricKeys: () => getHexagonMetricKeys,
  getLanguageConfig: () => getLanguageConfig,
  getLanguagesForCategory: () => getLanguagesForCategory,
  getLensById: () => getLensById,
  getLensColorScheme: () => getLensColorScheme,
  getLensDisplayName: () => getLensDisplayName,
  getLensesByCategory: () => getLensesByCategory,
  getLensesByCategoryAndLanguage: () => getLensesByCategoryAndLanguage,
  getLensesByLanguage: () => getLensesByLanguage,
  getLensesWithAggregates: () => getLensesWithAggregates,
  getLensesWithFileMetrics: () => getLensesWithFileMetrics,
  isCategoryInverted: () => isCategoryInverted,
  isHexagonMetricConfigured: () => isHexagonMetricConfigured,
  isLensInHexagonMetric: () => isLensInHexagonMetric,
  isValidLensId: () => isValidLensId,
  validateLensOutputs: () => validateLensOutputs
});
module.exports = __toCommonJS(index_exports);

// src/registry.ts
var LENS_REGISTRY = [
  // ============================================================
  // LINTING - Code style and bug detection
  // ============================================================
  // TypeScript/JavaScript linting
  {
    id: "eslint",
    name: "ESLint",
    category: "linting",
    languages: ["typescript", "javascript"],
    outputsFileMetrics: true,
    outputsAggregate: true,
    colorScheme: "issues",
    description: "Pluggable linting utility for JavaScript and TypeScript",
    command: "eslint"
  },
  {
    id: "biome-lint",
    name: "Biome Lint",
    category: "linting",
    languages: ["typescript", "javascript"],
    alternativeTo: ["eslint"],
    outputsFileMetrics: true,
    outputsAggregate: true,
    colorScheme: "issues",
    description: "Fast linter for JavaScript and TypeScript",
    command: "biome lint"
  },
  {
    id: "oxlint",
    name: "OxLint",
    category: "linting",
    languages: ["typescript", "javascript"],
    alternativeTo: ["eslint", "biome-lint"],
    outputsFileMetrics: true,
    outputsAggregate: true,
    colorScheme: "issues",
    description: "Blazing fast JavaScript/TypeScript linter",
    command: "oxlint"
  },
  // Python linting
  {
    id: "ruff",
    name: "Ruff",
    category: "linting",
    languages: ["python"],
    alternativeTo: ["pylint", "flake8"],
    outputsFileMetrics: true,
    outputsAggregate: true,
    colorScheme: "issues",
    description: "Extremely fast Python linter",
    command: "ruff check"
  },
  {
    id: "pylint",
    name: "Pylint",
    category: "linting",
    languages: ["python"],
    outputsFileMetrics: true,
    outputsAggregate: true,
    colorScheme: "issues",
    description: "Python static code analyzer",
    command: "pylint"
  },
  // Go linting
  {
    id: "golangci-lint",
    name: "golangci-lint",
    category: "linting",
    languages: ["go"],
    outputsFileMetrics: true,
    outputsAggregate: true,
    colorScheme: "issues",
    description: "Fast linters runner for Go",
    command: "golangci-lint run"
  },
  // Rust linting
  {
    id: "clippy",
    name: "Clippy",
    category: "linting",
    languages: ["rust"],
    outputsFileMetrics: true,
    outputsAggregate: true,
    colorScheme: "issues",
    description: "Rust linter",
    command: "cargo clippy"
  },
  // ============================================================
  // FORMATTING - Code formatting
  // ============================================================
  // TypeScript/JavaScript formatting
  {
    id: "prettier",
    name: "Prettier",
    category: "formatting",
    languages: ["typescript", "javascript"],
    outputsFileMetrics: true,
    outputsAggregate: true,
    colorScheme: "binary",
    description: "Opinionated code formatter",
    command: "prettier --check"
  },
  {
    id: "biome-format",
    name: "Biome Format",
    category: "formatting",
    languages: ["typescript", "javascript"],
    alternativeTo: ["prettier"],
    outputsFileMetrics: true,
    outputsAggregate: true,
    colorScheme: "binary",
    description: "Fast code formatter for JavaScript and TypeScript",
    command: "biome format"
  },
  // Python formatting
  {
    id: "black",
    name: "Black",
    category: "formatting",
    languages: ["python"],
    outputsFileMetrics: true,
    outputsAggregate: true,
    colorScheme: "binary",
    description: "The uncompromising Python code formatter",
    command: "black --check"
  },
  {
    id: "ruff-format",
    name: "Ruff Format",
    category: "formatting",
    languages: ["python"],
    alternativeTo: ["black"],
    outputsFileMetrics: true,
    outputsAggregate: true,
    colorScheme: "binary",
    description: "Fast Python formatter (Ruff)",
    command: "ruff format --check"
  },
  // Go formatting
  {
    id: "gofmt",
    name: "gofmt",
    category: "formatting",
    languages: ["go"],
    outputsFileMetrics: true,
    outputsAggregate: true,
    colorScheme: "binary",
    description: "Go code formatter",
    command: "gofmt -l"
  },
  // Rust formatting
  {
    id: "rustfmt",
    name: "rustfmt",
    category: "formatting",
    languages: ["rust"],
    outputsFileMetrics: true,
    outputsAggregate: true,
    colorScheme: "binary",
    description: "Rust code formatter",
    command: "cargo fmt --check"
  },
  // ============================================================
  // TYPES - Type checking
  // ============================================================
  // TypeScript
  {
    id: "typescript",
    name: "TypeScript",
    category: "types",
    languages: ["typescript"],
    outputsFileMetrics: true,
    outputsAggregate: true,
    colorScheme: "issues",
    description: "TypeScript type checker",
    command: "tsc --noEmit"
  },
  // Python type checking
  {
    id: "mypy",
    name: "MyPy",
    category: "types",
    languages: ["python"],
    outputsFileMetrics: true,
    outputsAggregate: true,
    colorScheme: "issues",
    description: "Static type checker for Python",
    command: "mypy"
  },
  {
    id: "pyright",
    name: "Pyright",
    category: "types",
    languages: ["python"],
    alternativeTo: ["mypy"],
    outputsFileMetrics: true,
    outputsAggregate: true,
    colorScheme: "issues",
    description: "Static type checker for Python",
    command: "pyright"
  },
  // Go type checking (built into compiler)
  {
    id: "go-vet",
    name: "Go Vet",
    category: "types",
    languages: ["go"],
    outputsFileMetrics: true,
    outputsAggregate: true,
    colorScheme: "issues",
    description: "Go static analyzer",
    command: "go vet"
  },
  // ============================================================
  // TESTS - Test coverage and results
  // ============================================================
  // JavaScript/TypeScript testing
  {
    id: "jest",
    name: "Jest",
    category: "tests",
    languages: ["typescript", "javascript"],
    outputsFileMetrics: true,
    outputsAggregate: true,
    colorScheme: "coverage",
    description: "JavaScript testing framework",
    command: "jest --coverage"
  },
  {
    id: "vitest",
    name: "Vitest",
    category: "tests",
    languages: ["typescript", "javascript"],
    alternativeTo: ["jest"],
    outputsFileMetrics: true,
    outputsAggregate: true,
    colorScheme: "coverage",
    description: "Vite-native testing framework",
    command: "vitest run --coverage"
  },
  {
    id: "bun-test",
    name: "Bun Test",
    category: "tests",
    languages: ["typescript", "javascript"],
    alternativeTo: ["jest", "vitest"],
    outputsFileMetrics: true,
    outputsAggregate: true,
    colorScheme: "coverage",
    description: "Bun native test runner",
    command: "bun test"
  },
  // Python testing
  {
    id: "pytest",
    name: "Pytest",
    category: "tests",
    languages: ["python"],
    outputsFileMetrics: true,
    outputsAggregate: true,
    colorScheme: "coverage",
    description: "Python testing framework",
    command: "pytest --cov"
  },
  // Go testing
  {
    id: "go-test",
    name: "Go Test",
    category: "tests",
    languages: ["go"],
    outputsFileMetrics: true,
    outputsAggregate: true,
    colorScheme: "coverage",
    description: "Go test runner",
    command: "go test -cover"
  },
  // Rust testing
  {
    id: "cargo-test",
    name: "Cargo Test",
    category: "tests",
    languages: ["rust"],
    outputsFileMetrics: true,
    outputsAggregate: true,
    colorScheme: "coverage",
    description: "Rust test runner",
    command: "cargo test"
  },
  // ============================================================
  // DEAD CODE - Unused code detection
  // ============================================================
  // TypeScript/JavaScript
  {
    id: "knip",
    name: "Knip",
    category: "dead-code",
    languages: ["typescript", "javascript"],
    outputsFileMetrics: true,
    outputsAggregate: true,
    colorScheme: "issues",
    description: "Find unused files, dependencies and exports",
    command: "knip"
  },
  // Python
  {
    id: "vulture",
    name: "Vulture",
    category: "dead-code",
    languages: ["python"],
    outputsFileMetrics: true,
    outputsAggregate: true,
    colorScheme: "issues",
    description: "Find dead Python code",
    command: "vulture"
  },
  // ============================================================
  // DOCUMENTATION - Documentation coverage
  // ============================================================
  {
    id: "alexandria",
    name: "Alexandria",
    category: "documentation",
    languages: ["typescript", "javascript"],
    outputsFileMetrics: true,
    outputsAggregate: true,
    colorScheme: "binary",
    description: "Documentation coverage checker",
    command: "alexandria lint"
  },
  {
    id: "typedoc",
    name: "TypeDoc",
    category: "documentation",
    languages: ["typescript"],
    outputsFileMetrics: false,
    outputsAggregate: true,
    colorScheme: "coverage",
    description: "TypeScript documentation generator",
    command: "typedoc"
  },
  // ============================================================
  // SECURITY - Security scanning
  // ============================================================
  {
    id: "npm-audit",
    name: "npm audit",
    category: "security",
    languages: ["typescript", "javascript"],
    outputsFileMetrics: false,
    outputsAggregate: true,
    colorScheme: "issues",
    description: "Check for known vulnerabilities in dependencies",
    command: "npm audit"
  },
  {
    id: "bandit",
    name: "Bandit",
    category: "security",
    languages: ["python"],
    outputsFileMetrics: true,
    outputsAggregate: true,
    colorScheme: "issues",
    description: "Python security linter",
    command: "bandit -r"
  }
];
var CATEGORY_CONFIGS = [
  {
    id: "linting",
    name: "Linting",
    description: "Code style and bug detection",
    icon: "AlertCircle"
  },
  {
    id: "formatting",
    name: "Formatting",
    description: "Code formatting consistency",
    icon: "AlignLeft"
  },
  {
    id: "types",
    name: "Types",
    description: "Type safety and checking",
    icon: "FileType"
  },
  {
    id: "tests",
    name: "Tests",
    description: "Test coverage and results",
    icon: "TestTube"
  },
  {
    id: "dead-code",
    name: "Dead Code",
    description: "Unused code detection",
    icon: "Trash2",
    invertedScale: true
  },
  {
    id: "documentation",
    name: "Documentation",
    description: "Documentation coverage",
    icon: "FileText"
  },
  {
    id: "security",
    name: "Security",
    description: "Security vulnerability scanning",
    icon: "Shield"
  },
  {
    id: "complexity",
    name: "Complexity",
    description: "Code complexity metrics",
    icon: "GitBranch"
  }
];
var LANGUAGE_CONFIGS = [
  {
    id: "typescript",
    name: "TypeScript",
    extensions: [".ts", ".tsx", ".mts", ".cts"],
    icon: "TS"
  },
  {
    id: "javascript",
    name: "JavaScript",
    extensions: [".js", ".jsx", ".mjs", ".cjs"],
    icon: "JS"
  },
  {
    id: "python",
    name: "Python",
    extensions: [".py", ".pyi"],
    icon: "PY"
  },
  {
    id: "go",
    name: "Go",
    extensions: [".go"],
    icon: "GO"
  },
  {
    id: "rust",
    name: "Rust",
    extensions: [".rs"],
    icon: "RS"
  },
  {
    id: "java",
    name: "Java",
    extensions: [".java"],
    icon: "JV"
  },
  {
    id: "csharp",
    name: "C#",
    extensions: [".cs"],
    icon: "C#"
  },
  {
    id: "ruby",
    name: "Ruby",
    extensions: [".rb"],
    icon: "RB"
  },
  {
    id: "php",
    name: "PHP",
    extensions: [".php"],
    icon: "PHP"
  }
];

// src/helpers.ts
function getLensById(id) {
  return LENS_REGISTRY.find((lens) => lens.id === id);
}
function getLensesByCategory(category) {
  return LENS_REGISTRY.filter((lens) => lens.category === category);
}
function getLensesByLanguage(language) {
  return LENS_REGISTRY.filter((lens) => lens.languages.includes(language));
}
function getLensesByCategoryAndLanguage(category, language) {
  return LENS_REGISTRY.filter(
    (lens) => lens.category === category && lens.languages.includes(language)
  );
}
function getCategoryForLens(lensId) {
  return getLensById(lensId)?.category;
}
function getAlternatives(lensId) {
  const lens = getLensById(lensId);
  if (!lens) return [];
  const listedAsAlternative = LENS_REGISTRY.filter(
    (other) => other.alternativeTo?.includes(lensId)
  );
  const thisListsAsAlternative = lens.alternativeTo ? LENS_REGISTRY.filter((other) => lens.alternativeTo.includes(other.id)) : [];
  const all = [...listedAsAlternative, ...thisListsAsAlternative];
  return Array.from(new Map(all.map((l) => [l.id, l])).values());
}
function areLensesAlternatives(lensId1, lensId2) {
  const lens1 = getLensById(lensId1);
  const lens2 = getLensById(lensId2);
  if (!lens1 || !lens2) return false;
  if (lens1.category !== lens2.category) return false;
  return lens1.alternativeTo?.includes(lensId2) || lens2.alternativeTo?.includes(lensId1) || false;
}
function getLensesWithFileMetrics() {
  return LENS_REGISTRY.filter((lens) => lens.outputsFileMetrics);
}
function getLensesWithAggregates() {
  return LENS_REGISTRY.filter((lens) => lens.outputsAggregate);
}
function getColorModeForCategory(category, lensesRan) {
  const lensesInCategory = getLensesByCategory(category);
  for (const lensId of lensesRan) {
    if (lensesInCategory.some((lens) => lens.id === lensId)) {
      return lensId;
    }
  }
  return null;
}
function getLensDisplayName(lensId) {
  return getLensById(lensId)?.name ?? lensId;
}
function getLensColorScheme(lensId) {
  return getLensById(lensId)?.colorScheme ?? "issues";
}
function getCategoryConfig(category) {
  return CATEGORY_CONFIGS.find((c) => c.id === category);
}
function getCategoryDisplayName(category) {
  return getCategoryConfig(category)?.name ?? category;
}
function isCategoryInverted(category) {
  return getCategoryConfig(category)?.invertedScale ?? false;
}
function getLanguageConfig(language) {
  return LANGUAGE_CONFIGS.find((l) => l.id === language);
}
function detectLanguageFromExtension(extension) {
  const normalizedExt = extension.startsWith(".") ? extension : `.${extension}`;
  const config = LANGUAGE_CONFIGS.find(
    (l) => l.extensions.includes(normalizedExt.toLowerCase())
  );
  return config?.id;
}
function getLanguagesForCategory(category) {
  const lenses = getLensesByCategory(category);
  const languages = /* @__PURE__ */ new Set();
  for (const lens of lenses) {
    for (const lang of lens.languages) {
      languages.add(lang);
    }
  }
  return Array.from(languages);
}
var HEXAGON_METRIC_TO_CATEGORY = {
  linting: "linting",
  formatting: "formatting",
  types: "types",
  tests: "tests",
  deadCode: "dead-code",
  documentation: "documentation"
};
var CATEGORY_TO_HEXAGON_METRIC = {
  "linting": "linting",
  "formatting": "formatting",
  "types": "types",
  "tests": "tests",
  "dead-code": "deadCode",
  "documentation": "documentation"
};
function getCategoryForHexagonMetric(metric) {
  return HEXAGON_METRIC_TO_CATEGORY[metric];
}
function getHexagonMetricForCategory(category) {
  return CATEGORY_TO_HEXAGON_METRIC[category];
}
function isLensInHexagonMetric(lensId, metric) {
  const lensCategory = getCategoryForLens(lensId);
  if (!lensCategory) return false;
  return HEXAGON_METRIC_TO_CATEGORY[metric] === lensCategory;
}
function getColorModeForHexagonMetric(metric, lensesRan) {
  const category = HEXAGON_METRIC_TO_CATEGORY[metric];
  return getColorModeForCategory(category, lensesRan);
}
function isHexagonMetricConfigured(metric, lensesRan) {
  if (lensesRan === void 0) {
    return true;
  }
  if (lensesRan.length === 0) {
    return false;
  }
  return lensesRan.some((lensId) => isLensInHexagonMetric(lensId, metric));
}
function getHexagonMetricKeys() {
  return Object.keys(HEXAGON_METRIC_TO_CATEGORY);
}
function isValidLensId(lensId) {
  return getLensById(lensId) !== void 0;
}
function findCategoryConflicts(lensesRan) {
  const byCategory = /* @__PURE__ */ new Map();
  for (const lensId of lensesRan) {
    const category = getCategoryForLens(lensId);
    if (category) {
      const existing = byCategory.get(category) || [];
      existing.push(lensId);
      byCategory.set(category, existing);
    }
  }
  const conflicts = [];
  for (const [category, lenses] of byCategory) {
    if (lenses.length > 1) {
      conflicts.push({ category, lenses });
    }
  }
  return conflicts;
}
function validateLensOutputs(lensesRan, fileMetricsProduced, aggregatesProduced) {
  const issues = [];
  for (const lensId of lensesRan) {
    const lens = getLensById(lensId);
    if (!lens) continue;
    const missing = [];
    if (lens.outputsFileMetrics && !fileMetricsProduced.includes(lensId)) {
      missing.push("fileMetrics");
    }
    if (lens.outputsAggregate && !aggregatesProduced.includes(lensId)) {
      missing.push("aggregate");
    }
    if (missing.length > 0) {
      issues.push({ lensId, missing });
    }
  }
  return issues;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CATEGORY_CONFIGS,
  LANGUAGE_CONFIGS,
  LENS_REGISTRY,
  areLensesAlternatives,
  detectLanguageFromExtension,
  findCategoryConflicts,
  getAlternatives,
  getCategoryConfig,
  getCategoryDisplayName,
  getCategoryForHexagonMetric,
  getCategoryForLens,
  getColorModeForCategory,
  getColorModeForHexagonMetric,
  getHexagonMetricForCategory,
  getHexagonMetricKeys,
  getLanguageConfig,
  getLanguagesForCategory,
  getLensById,
  getLensColorScheme,
  getLensDisplayName,
  getLensesByCategory,
  getLensesByCategoryAndLanguage,
  getLensesByLanguage,
  getLensesWithAggregates,
  getLensesWithFileMetrics,
  isCategoryInverted,
  isHexagonMetricConfigured,
  isLensInHexagonMetric,
  isValidLensId,
  validateLensOutputs
});
//# sourceMappingURL=index.cjs.map