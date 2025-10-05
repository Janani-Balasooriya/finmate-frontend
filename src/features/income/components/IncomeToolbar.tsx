import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "../types";
import { formatDateRange } from "../utils/formatDateRange";
import { useState } from "react";
import { IncomeSourceItemDto } from "@/lib/incomeSource";

type Props = {
  dateRange: DateRange;
  onDateRangeChange: (r: DateRange) => void;
  onClearRange: () => void;
  amountSortOrder: string;
  onAmountSortChange: (v: string) => void;
  incomeSources: IncomeSourceItemDto[];
  sourceFilter: string;
  onSourceFilterChange: (v: string) => void;
};

export function IncomeToolbar({
  dateRange,
  onDateRangeChange,
  onClearRange,
  amountSortOrder,
  onAmountSortChange,
  incomeSources,
  sourceFilter,
  onSourceFilterChange,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center gap-4 mt-4">
      <Select value={sourceFilter} onValueChange={onSourceFilterChange}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="All Sources" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Sources</SelectItem>
          {incomeSources.map((source) => (
            <SelectItem key={source.id} value={String(source.id)}>
              {source.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-80 justify-start text-left font-normal">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formatDateRange(dateRange)}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            defaultMonth={dateRange.from}
            selected={dateRange}
            onSelect={(range) => onDateRangeChange(range || {})}
            numberOfMonths={2}
            className="rounded-md border"
          />
          <div className="flex justify-end gap-2 p-3 border-t">
            <Button variant="outline" size="sm" onClick={onClearRange}>
              Clear
            </Button>
            <Button size="sm" onClick={() => setOpen(false)}>
              Apply
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <Select value={amountSortOrder} onValueChange={onAmountSortChange}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Sort by Amount" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="recent">Recent</SelectItem>
          <SelectItem value="high-to-low">Amount: High to Low</SelectItem>
          <SelectItem value="low-to-high">Amount: Low to High</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
