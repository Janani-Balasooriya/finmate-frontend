import { useMemo, useState } from "react";
import * as Icons from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type IconPickerProps = {
  value?: string;
  onChange: (iconKey: string) => void;
  className?: string;
  icons?: string[]; // optional curated list of icon export names
};

// Curated, lightweight list of lucide icons to keep bundle size reasonable
const DEFAULT_ICON_KEYS: string[] = [
  "Utensils",
  "Car",
  "Gamepad2",
  "ShoppingBag",
  "Zap",
  "PiggyBank",
  "Heart",
  "BookOpen",
  "Home",
  "Bus",
  "Coffee",
  "Gift",
  "Wallet",
  "Bike",
  "Briefcase",
  "Calculator",
  "Camera",
  "Cloud",
  "Dumbbell",
  "Sofa",
];

export default function IconPicker({ value, onChange, className, icons }: IconPickerProps) {
  const [query, setQuery] = useState("");

  const iconKeys = useMemo(() => (icons && icons.length > 0 ? icons : DEFAULT_ICON_KEYS), [icons]);

  const filtered = useMemo(
    () =>
      iconKeys.filter((key) => key.toLowerCase().includes(query.toLowerCase())),
    [iconKeys, query]
  );

  return (
    <div className={cn("space-y-3", className)}>
      <Input
        placeholder="Search icons..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="grid grid-cols-6 gap-2 max-h-48 overflow-auto">
        {filtered.map((key) => {
          const IconComp = (Icons as any)[key] as React.ComponentType<{ className?: string }>;
          if (!IconComp) return null;
          const isSelected = value === key;
          return (
            <button
              type="button"
              key={key}
              className={cn(
                "flex items-center justify-center h-10 w-10 rounded-md border",
                isSelected ? "bg-primary/10 border-primary" : "hover:bg-muted"
              )}
              title={key}
              onClick={() => onChange(key)}
            >
              <IconComp className="h-5 w-5" />
            </button>
          );
        })}
      </div>
    </div>
  );
}


