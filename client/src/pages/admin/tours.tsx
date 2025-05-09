import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tour } from "@shared/schema";
import AdminLayout from "@/components/layout/AdminLayout";
import TourForm from "@/components/admin/TourForm";
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
import { Pencil, Plus, Trash } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const AdminTours = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const { toast } = useToast();

  // Récupérer la liste des circuits
  const { data: tours, isLoading } = useQuery<Tour[]>({
    queryKey: ["/api/tours"],
  });

  const handleEdit = (tour: Tour) => {
    setSelectedTour(tour);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (tour: Tour) => {
    setSelectedTour(tour);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedTour) {
      try {
        await apiRequest("DELETE", `/api/tours/${selectedTour.id}`, {});
        queryClient.invalidateQueries({ queryKey: ["/api/tours"] });
        toast({
          title: "Circuit supprimé",
          description: "Le circuit a été supprimé avec succès.",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Une erreur est survenue lors de la suppression du circuit.",
        });
      } finally {
        setIsDeleteDialogOpen(false);
        setSelectedTour(null);
      }
    }
  };

  const onFormSuccess = () => {
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    setSelectedTour(null);
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-heading font-bold">Gestion des circuits</h1>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Ajouter un circuit
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Circuits disponibles</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : tours && tours.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Titre</TableHead>
                    <TableHead>Durée</TableHead>
                    <TableHead>Prix</TableHead>
                    <TableHead>Destinations</TableHead>
                    <TableHead>En vedette</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tours.map((tour) => (
                    <TableRow key={tour.id}>
                      <TableCell className="font-medium">{tour.id}</TableCell>
                      <TableCell>{tour.title}</TableCell>
                      <TableCell>{tour.duration} jours</TableCell>
                      <TableCell>{tour.price} MAD</TableCell>
                      <TableCell>{tour.locations}</TableCell>
                      <TableCell>{tour.featured ? "Oui" : "Non"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEdit(tour)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDelete(tour)}
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
                <p className="text-gray-500">Aucun circuit trouvé.</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setIsAddDialogOpen(true)}
                >
                  Ajouter un circuit
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modal d'ajout de circuit */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Ajouter un nouveau circuit</DialogTitle>
            </DialogHeader>
            <TourForm onSuccess={onFormSuccess} />
          </DialogContent>
        </Dialog>

        {/* Modal d'édition de circuit */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Modifier le circuit</DialogTitle>
            </DialogHeader>
            {selectedTour && <TourForm tour={selectedTour} onSuccess={onFormSuccess} />}
          </DialogContent>
        </Dialog>

        {/* Confirmation de suppression */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Êtes-vous sûr?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action ne peut pas être annulée. Le circuit sera définitivement supprimé de la base de données.
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

export default AdminTours;