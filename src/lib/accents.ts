// Soft palettes for light/dark mode compatible accent colors
// Each palette includes icon chip background/text and progress bar colors
export const ACCENT_PALETTES = [
  { icon: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300", bar: "bg-emerald-400" },
  { icon: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300", bar: "bg-sky-400" },
  { icon: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300", bar: "bg-violet-400" },
  { icon: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300", bar: "bg-amber-400" },
  { icon: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300", bar: "bg-rose-400" },
  { icon: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300", bar: "bg-indigo-400" },
  { icon: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300", bar: "bg-teal-400" },
];

// Deterministic hash function - stable across renders
// Converts string to consistent numeric value for color assignment
export const hash = (s: string) => {
  const str = String(s || "");
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
};

// Assign distinct accents to a visible list of budgets
// Ensures no two cards use the same color until palette is exhausted
export function assignDistinctAccents<T extends { id?: string | number; name?: string }>(items: T[]) {
  const n = ACCENT_PALETTES.length;
  
  // Seed by combined hash to vary ordering across different datasets
  const seed = items.reduce((a,i)=>a+hash(String(i.id ?? i.name ?? "unknown")),0);
  
  // Shuffle palette order based on seed for visual variety
  const order = [...ACCENT_PALETTES]
    .map((p,i)=>[i,(i*3+seed)%n] as const)
    .sort((a,b)=>a[1]-b[1])
    .map(([i])=>ACCENT_PALETTES[i]);

  // Create map of item keys to their assigned accent colors
  const map = new Map<string, {icon:string;bar:string}>();
  items.forEach((it, idx) => {
    const key = String(it.id ?? it.name ?? String(idx));
    const palette = order[idx % n]; // Cycle through palette, no duplicates until exhausted
    map.set(key, palette);
  });
  
  return map;
}