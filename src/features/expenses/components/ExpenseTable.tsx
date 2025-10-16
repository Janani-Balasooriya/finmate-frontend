import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { ExpenseItem } from "../types";

type Props = {
  rows: ExpenseItem[];
  onEdit: (row: ExpenseItem) => void;
  onDelete: (row: ExpenseItem) => void;
};

export function ExpenseTable({ rows, onEdit, onDelete }: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Item</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Account</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.id}>
            <TableCell className="font-medium">{row.date}</TableCell>
            <TableCell>
              <Badge style={{ backgroundColor: row.categoryColor }}>
                {row.category}
              </Badge>
            </TableCell>
            <TableCell className="text-muted-foreground">{row.categoryItem}</TableCell>
            <TableCell className="font-semibold text-destructive">{row.amountDisplay}</TableCell>
            <TableCell>{row.account}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-success hover:text-success hover:bg-success/10"
                        onClick={() => onEdit(row)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => onDelete(row)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}