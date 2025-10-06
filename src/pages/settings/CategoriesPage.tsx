import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2, Tag } from "lucide-react";
import { categoriesApi, ExpenseCategoryDto, CategoryItemDto } from "@/lib/categories";
import { useToast } from "@/hooks/use-toast";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<ExpenseCategoryDto[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategoryDto | null>(null);
  const [categoryItems, setCategoryItems] = useState<CategoryItemDto[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states for categories
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState(false);
  const [isDeleteCategoryModalOpen, setIsDeleteCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ExpenseCategoryDto | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<ExpenseCategoryDto | null>(null);

  // Modal states for category items
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isEditItemModalOpen, setIsEditItemModalOpen] = useState(false);
  const [isDeleteItemModalOpen, setIsDeleteItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CategoryItemDto | null>(null);
  const [deletingItem, setDeletingItem] = useState<CategoryItemDto | null>(null);

  // Form states
  const [categoryFormData, setCategoryFormData] = useState({
    name: "",
    icon: "",
    color: "",
    budgetAmount: 0
  });

  const [itemFormData, setItemFormData] = useState({
    name: ""
  });

  const { toast } = useToast();

  const fetchCategories = async () => {
    try {
      const categoriesData = await categoriesApi.getCategories();
      setCategories(categoriesData);
      if (categoriesData.length > 0 && !selectedCategory) {
        setSelectedCategory(categoriesData[0]);
      }
    } catch (error) {
      toast({
        title: "Failed to load categories",
        description: "Could not load category data",
        variant: "destructive"
      });
    }
  };

  const fetchCategoryItems = async (categoryId: number) => {
    try {
      const itemsData = await categoriesApi.getCategoryItems(categoryId);
      setCategoryItems(itemsData);
    } catch (error) {
      toast({
        title: "Failed to load category items",
        description: "Could not load category items",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchCategories().finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchCategoryItems(selectedCategory.id);
    }
  }, [selectedCategory]);

  // Category CRUD operations
  const handleAddCategory = async () => {
    try {
      const createdCategory = await categoriesApi.createCategory(categoryFormData);
      setCategories(prev => [...prev, createdCategory]);
      setIsAddCategoryModalOpen(false);
      resetCategoryForm();
      toast({
        title: "Category created",
        description: "New category has been created successfully"
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Could not create category";
      toast({
        title: "Failed to create category",
        description: message,
        variant: "destructive"
      });
    }
  };

  const handleEditCategory = async () => {
    if (!editingCategory) return;

    try {
      const updatedCategory = await categoriesApi.updateCategory(editingCategory.id, categoryFormData);
      setCategories(prev => prev.map(cat => cat.id === editingCategory.id ? updatedCategory : cat));
      if (selectedCategory?.id === editingCategory.id) {
        setSelectedCategory(updatedCategory);
      }
      setIsEditCategoryModalOpen(false);
      setEditingCategory(null);
      resetCategoryForm();
      toast({
        title: "Category updated",
        description: "Category has been updated successfully"
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Could not update category";
      toast({
        title: "Failed to update category",
        description: message,
        variant: "destructive"
      });
    }
  };

  const handleDeleteCategory = async () => {
    if (!deletingCategory) return;

    try {
      await categoriesApi.deleteCategory(deletingCategory.id);
      setCategories(prev => prev.filter(cat => cat.id !== deletingCategory.id));
      if (selectedCategory?.id === deletingCategory.id) {
        setSelectedCategory(categories.find(cat => cat.id !== deletingCategory.id) || null);
      }
      setIsDeleteCategoryModalOpen(false);
      setDeletingCategory(null);
      toast({
        title: "Category deleted",
        description: "Category has been deleted successfully"
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Could not delete category";
      toast({
        title: "Failed to delete category",
        description: message,
        variant: "destructive"
      });
    }
  };

  // Category Item CRUD operations
  const handleAddCategoryItem = async () => {
    if (!selectedCategory) return;

    try {
      const createdItem = await categoriesApi.createCategoryItem(selectedCategory.id, itemFormData);
      setCategoryItems(prev => [...prev, createdItem]);
      setIsAddItemModalOpen(false);
      resetItemForm();
      toast({
        title: "Category item created",
        description: "New category item has been created successfully"
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Could not create category item";
      toast({
        title: "Failed to create category item",
        description: message,
        variant: "destructive"
      });
    }
  };

  const handleEditCategoryItem = async () => {
    if (!selectedCategory || !editingItem) return;

    try {
      const updatedItem = await categoriesApi.updateCategoryItem(selectedCategory.id, editingItem.id, itemFormData);
      setCategoryItems(prev => prev.map(item => item.id === editingItem.id ? updatedItem : item));
      setIsEditItemModalOpen(false);
      setEditingItem(null);
      resetItemForm();
      toast({
        title: "Category item updated",
        description: "Category item has been updated successfully"
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Could not update category item";
      toast({
        title: "Failed to update category item",
        description: message,
        variant: "destructive"
      });
    }
  };

  const handleDeleteCategoryItem = async () => {
    if (!selectedCategory || !deletingItem) return;

    try {
      await categoriesApi.deleteCategoryItem(selectedCategory.id, deletingItem.id);
      setCategoryItems(prev => prev.filter(item => item.id !== deletingItem.id));
      setIsDeleteItemModalOpen(false);
      setDeletingItem(null);
      toast({
        title: "Category item deleted",
        description: "Category item has been deleted successfully"
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Could not delete category item";
      toast({
        title: "Failed to delete category item",
        description: message,
        variant: "destructive"
      });
    }
  };

  const resetCategoryForm = () => {
    setCategoryFormData({
      name: "",
      icon: "",
      color: "",
      budgetAmount: 0
    });
  };

  const resetItemForm = () => {
    setItemFormData({
      name: ""
    });
  };

  const openEditCategoryModal = (category: ExpenseCategoryDto) => {
    setEditingCategory(category);
    setCategoryFormData({
      name: category.name,
      icon: category.icon,
      color: category.color,
      budgetAmount: category.budgetAmount
    });
    setIsEditCategoryModalOpen(true);
  };

  const openDeleteCategoryModal = (category: ExpenseCategoryDto) => {
    setDeletingCategory(category);
    setIsDeleteCategoryModalOpen(true);
  };

  const openEditItemModal = (item: CategoryItemDto) => {
    setEditingItem(item);
    setItemFormData({
      name: item.name
    });
    setIsEditItemModalOpen(true);
  };

  const openDeleteItemModal = (item: CategoryItemDto) => {
    setDeletingItem(item);
    setIsDeleteItemModalOpen(true);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Category Management</h2>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">Loading categories...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Category Management</h2>
        <Button onClick={() => setIsAddCategoryModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div> */}

      <ResizablePanelGroup direction="horizontal" className="min-h-[600px] rounded-lg border">
        {/* Left Panel - Categories */}
        <ResizablePanel defaultSize={40} minSize={30}>
          <Card className="h-full rounded-none border-0 border-r">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {categories.map(category => (
                <div
                  key={category.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedCategory?.id === category.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditCategoryModal(category);
                        }}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-destructive hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeleteCategoryModal(category);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {categories.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  No categories found. Create your first category.
                </div>
              )}
            </CardContent>
          </Card>
        </ResizablePanel>

        <ResizableHandle />

        {/* Right Panel - Category Items */}
        <ResizablePanel defaultSize={60} minSize={40}>
          <Card className="h-full rounded-none border-0">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">
                  {selectedCategory ? `${selectedCategory.name} Items` : "Category Items"}
                </CardTitle>
                {selectedCategory && (
                  <Button
                    size="sm"
                    onClick={() => setIsAddItemModalOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {selectedCategory ? (
                <div className="space-y-2">
                  {categoryItems.map(item => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <span>{item.name}</span>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => openEditItemModal(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => openDeleteItemModal(item)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {categoryItems.length === 0 && (
                    <div className="text-center text-muted-foreground py-8">
                      No items in this category. Add your first item.
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  Select a category to view its items.
                </div>
              )}
            </CardContent>
          </Card>
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* Category Modals */}
      <Dialog open={isAddCategoryModalOpen} onOpenChange={setIsAddCategoryModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>
              Create a new expense category to organize your spending.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="add-category-name">Category Name</Label>
              <Input
                id="add-category-name"
                placeholder="e.g. Food & Dining"
                value={categoryFormData.name}
                onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="add-category-icon">Icon</Label>
              <Input
                id="add-category-icon"
                placeholder="e.g. 🍽️"
                value={categoryFormData.icon}
                onChange={(e) => setCategoryFormData({ ...categoryFormData, icon: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="add-category-color">Color</Label>
              <Input
                id="add-category-color"
                placeholder="e.g. #FF6B6B"
                value={categoryFormData.color}
                onChange={(e) => setCategoryFormData({ ...categoryFormData, color: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="add-category-budget">Budget Amount</Label>
              <Input
                id="add-category-budget"
                type="number"
                placeholder="0.00"
                value={categoryFormData.budgetAmount}
                onChange={(e) => setCategoryFormData({ ...categoryFormData, budgetAmount: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddCategoryModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddCategory}
              disabled={!categoryFormData.name}
            >
              Add Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Category Modal */}
      <Dialog open={isEditCategoryModalOpen} onOpenChange={setIsEditCategoryModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Update your category information.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-category-name">Category Name</Label>
              <Input
                id="edit-category-name"
                placeholder="e.g. Food & Dining"
                value={categoryFormData.name}
                onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-category-icon">Icon</Label>
              <Input
                id="edit-category-icon"
                placeholder="e.g. 🍽️"
                value={categoryFormData.icon}
                onChange={(e) => setCategoryFormData({ ...categoryFormData, icon: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-category-color">Color</Label>
              <Input
                id="edit-category-color"
                placeholder="e.g. #FF6B6B"
                value={categoryFormData.color}
                onChange={(e) => setCategoryFormData({ ...categoryFormData, color: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-category-budget">Budget Amount</Label>
              <Input
                id="edit-category-budget"
                type="number"
                placeholder="0.00"
                value={categoryFormData.budgetAmount}
                onChange={(e) => setCategoryFormData({ ...categoryFormData, budgetAmount: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditCategoryModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleEditCategory}
              disabled={!categoryFormData.name}
            >
              Update Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Category Modal */}
      <AlertDialog open={isDeleteCategoryModalOpen} onOpenChange={setIsDeleteCategoryModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingCategory?.name}"? This will also delete all items in this category. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              onClick={handleDeleteCategory}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Category Item Modals */}
      <Dialog open={isAddItemModalOpen} onOpenChange={setIsAddItemModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Category Item</DialogTitle>
            <DialogDescription>
              Add a new item to the "{selectedCategory?.name}" category.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="add-item-name">Item Name</Label>
              <Input
                id="add-item-name"
                placeholder="e.g. Groceries"
                value={itemFormData.name}
                onChange={(e) => setItemFormData({ ...itemFormData, name: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddItemModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddCategoryItem}
              disabled={!itemFormData.name}
            >
              Add Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Category Item Modal */}
      <Dialog open={isEditItemModalOpen} onOpenChange={setIsEditItemModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Category Item</DialogTitle>
            <DialogDescription>
              Update the category item information.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-item-name">Item Name</Label>
              <Input
                id="edit-item-name"
                placeholder="e.g. Groceries"
                value={itemFormData.name}
                onChange={(e) => setItemFormData({ ...itemFormData, name: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditItemModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleEditCategoryItem}
              disabled={!itemFormData.name}
            >
              Update Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Category Item Modal */}
      <AlertDialog open={isDeleteItemModalOpen} onOpenChange={setIsDeleteItemModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingItem?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              onClick={handleDeleteCategoryItem}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}