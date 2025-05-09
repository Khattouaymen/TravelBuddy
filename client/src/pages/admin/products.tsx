import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import AdminLayout from "@/components/layout/AdminLayout";
import ProductForm from "@/components/admin/ProductForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Pencil, Plus, Trash } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const AdminProducts = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  // Récupérer la liste des produits
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedProduct) {
      try {
        await apiRequest("DELETE", `/api/products/${selectedProduct.id}`, {});
        queryClient.invalidateQueries({ queryKey: ["/api/products"] });
        toast({
          title: "Produit supprimé",
          description: "Le produit a été supprimé avec succès.",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Une erreur est survenue lors de la suppression du produit.",
        });
      } finally {
        setIsDeleteDialogOpen(false);
        setSelectedProduct(null);
      }
    }
  };

  const onFormSuccess = () => {
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    setSelectedProduct(null);
  };

  const formatPrice = (price: number) => {
    return `${price.toLocaleString()} MAD`;
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-heading font-bold">Gestion des produits</h1>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Ajouter un produit
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Produits disponibles</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : products && products.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Image</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Prix</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>État</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.id}</TableCell>
                      <TableCell>
                        <div className="h-10 w-10 rounded overflow-hidden">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>
                        {product.discountPrice ? (
                          <div>
                            <span className="line-through text-gray-500 text-sm mr-2">
                              {formatPrice(product.price)}
                            </span>
                            <span className="font-medium">
                              {formatPrice(product.discountPrice)}
                            </span>
                          </div>
                        ) : (
                          formatPrice(product.price)
                        )}
                      </TableCell>
                      <TableCell>{product.inStock ? "En stock" : "Épuisé"}</TableCell>
                      <TableCell>
                        {product.featured && (
                          <Badge className="bg-primary">En vedette</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEdit(product)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDelete(product)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Aucun produit trouvé.</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setIsAddDialogOpen(true)}
                >
                  Ajouter un produit
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modal d'ajout de produit */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Ajouter un nouveau produit</DialogTitle>
            </DialogHeader>
            <ProductForm onSuccess={onFormSuccess} />
          </DialogContent>
        </Dialog>

        {/* Modal d'édition de produit */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Modifier le produit</DialogTitle>
            </DialogHeader>
            {selectedProduct && <ProductForm product={selectedProduct} onSuccess={onFormSuccess} />}
          </DialogContent>
        </Dialog>

        {/* Confirmation de suppression */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Êtes-vous sûr?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action ne peut pas être annulée. Le produit sera définitivement supprimé de la base de données.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
};

export default AdminProducts;