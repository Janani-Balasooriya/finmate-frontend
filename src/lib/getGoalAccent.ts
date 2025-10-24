// Goal accent color system for consistent theming
// Maps categories to color themes with light/dark mode support

interface AccentColors {
  bar: string;
  badge: string;
  ring: string;
}

const categoryColorMap: Record<string, AccentColors> = {
  food: {
    bar: "bg-orange-500",
    badge: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
    ring: "ring-orange-300/40"
  },
  transportation: {
    bar: "bg-sky-500", 
    badge: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
    ring: "ring-sky-300/40"
  },
  entertainment: {
    bar: "bg-violet-500",
    badge: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300", 
    ring: "ring-violet-300/40"
  },
  utilities: {
    bar: "bg-amber-500",
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    ring: "ring-amber-300/40"
  },
  savings: {
    bar: "bg-emerald-500",
    badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    ring: "ring-emerald-300/40"
  },
  emergency: {
    bar: "bg-emerald-500",
    badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    ring: "ring-emerald-300/40"
  },
  travel: {
    bar: "bg-rose-500",
    badge: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
    ring: "ring-rose-300/40"
  }
};

const defaultColors: AccentColors = {
  bar: "bg-stone-500",
  badge: "bg-stone-100 text-stone-700 dark:bg-stone-900/40 dark:text-stone-300",
  ring: "ring-stone-300/40"
};

// Simple hash function to consistently map IDs to colors
function hashStringToIndex(str: string, max: number): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash) % max;
}

// Get accent colors for a goal based on category or stable hash of ID
export function getGoalAccent(categoryOrId: string): AccentColors {
  const category = categoryOrId.toLowerCase();
  
  // Try category mapping first
  if (categoryColorMap[category]) {
    return categoryColorMap[category];
  }
  
  // Fall back to hash-based selection for consistency
  const colorKeys = Object.keys(categoryColorMap);
  const index = hashStringToIndex(categoryOrId, colorKeys.length);
  const selectedKey = colorKeys[index];
  
  return categoryColorMap[selectedKey] || defaultColors;
}

// Detect category from goal title for better color assignment
export function detectGoalCategory(title: string | undefined): string {
  if (!title) return 'savings';
  const titleLower = title.toLowerCase();
  
  if (titleLower.includes('vacation') || titleLower.includes('trip') || titleLower.includes('travel') || titleLower.includes('bali')) {
    return 'travel';
  }
  if (titleLower.includes('emergency') || titleLower.includes('fund')) {
    return 'emergency';
  }
  if (titleLower.includes('car') || titleLower.includes('vehicle') || titleLower.includes('transportation')) {
    return 'transportation';
  }
  if (titleLower.includes('save') || titleLower.includes('saving')) {
    return 'savings';
  }
  
  // Default to using the ID for consistent coloring
  return title;
}