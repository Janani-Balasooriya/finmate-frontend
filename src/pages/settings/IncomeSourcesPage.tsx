import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2 } from "lucide-react";
import { incomeSourceApi, IncomeSourceItemDto } from "@/lib/incomeSource";
import { useToast } from "@/hooks/use-toast";
import { colorOptions } from "@/features/income/constants/colorOptions";
import { cn } from "@/lib/utils";

export default function IncomeSourcesPage() {
  const [incomeSources, setIncomeSources] = useState<IncomeSourceItemDto[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingSource, setEditingSource] = useState<IncomeSourceItemDto | null>(null);
  const [deletingSource, setDeletingSource] = useState<IncomeSourceItemDto | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    color: ""
  });

  const { toast } = useToast();

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await incomeSourceApi.getActive();
      setIncomeSources(data);
    } catch (error) {
      toast({
        title: "Failed to load income sources",
        description: "Could not load income source data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddSource = async () => {
    try {
      const createdSource = await incomeSourceApi.create({
        name: formData.name,
        color: formData.color
      });
      setIncomeSources(prev => [...prev, createdSource]);
      setIsAddModalOpen(false);
      resetForm();
      toast({
        title: "Income source created",
        description: "New income source has been created successfully"
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Could not create income source";
      toast({
        title: "Failed to create income source",
        description: message,
        variant: "destructive"
      });
    }
  };

  const handleEditSource = async () => {
    if (!editingSource) return;

    try {
      const updatedSource = await incomeSourceApi.update(editingSource.id, {
        name: formData.name,
        color: formData.color,
        active: true
      });
      setIncomeSources(prev => prev.map(src => src.id === editingSource.id ? updatedSource : src));
      setIsEditModalOpen(false);
      setEditingSource(null);
      resetForm();
      toast({
        title: "Income source updated",
        description: "Income source has been updated successfully"
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Could not update income source";
      toast({
        title: "Failed to update income source",
        description: message,
        variant: "destructive"
      });
    }
  };

  const handleDeleteSource = async () => {
    if (!deletingSource) return;

    try {
      await incomeSourceApi.archive(deletingSource.id);
      setIncomeSources(prev => prev.filter(src => src.id !== deletingSource.id));
      setIsDeleteModalOpen(false);
      setDeletingSource(null);
      toast({
        title: "Income source archived",
        description: "Income source has been archived successfully"
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Could not archive income source";
      toast({
        title: "Failed to archive income source",
        description: message,
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      color: ""
    });
  };

  const openEditModal = (source: IncomeSourceItemDto) => {
    setEditingSource(source);
    setFormData({
      name: source.name,
      color: source.color
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (source: IncomeSourceItemDto) => {
    setDeletingSource(source);
    setIsDeleteModalOpen(true);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Income Source Management</h2>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">Loading income sources...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Income Source Management</h2>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Income Source
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Income Sources</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Color</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {incomeSources.map(source => (
                <TableRow key={source.id}>
                  <TableCell className="font-medium">{source.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={cn("h-4 w-4 rounded-full", source.color)} />
                      {source.color}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      Active
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openEditModal(source)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => openDeleteModal(source)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Income Source Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Income Source</DialogTitle>
            <DialogDescription>
              Create a new income source to categorize your income.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="add-name">Income Source Name</Label>
              <Input
                id="add-name"
                placeholder="e.g. Salary, Freelance, Business"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Source Color</Label>
              <div className="grid grid-cols-9 gap-2">
                {colorOptions.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setFormData({ ...formData, color: c })}
                    className={cn(
                      "h-8 w-8 rounded-full border",
                      c,
                      formData.color === c ? "ring-2 ring-offset-2 ring-primary" : ""
                    )}
                    aria-label={c}
                  />
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddSource}
              disabled={!formData.name || !formData.color}
            >
              Add Income Source
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Income Source Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Income Source</DialogTitle>
            <DialogDescription>
              Update your income source information.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Income Source Name</Label>
              <Input
                id="edit-name"
                placeholder="e.g. Salary, Freelance, Business"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Source Color</Label>
              <div className="grid grid-cols-9 gap-2">
                {colorOptions.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setFormData({ ...formData, color: c })}
                    className={cn(
                      "h-8 w-8 rounded-full border",
                      c,
                      formData.color === c ? "ring-2 ring-offset-2 ring-primary" : ""
                    )}
                    aria-label={c}
                  />
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleEditSource}
              disabled={!formData.name || !formData.color}
            >
              Update Income Source
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive Income Source</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to archive "{deletingSource?.name}"? This will make it inactive and remove it from active income source lists. This action can be undone by editing the income source.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              onClick={handleDeleteSource}
            >
              Archive
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}