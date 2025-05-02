import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CustomRequest } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Eye, Check, Clock, CheckCheck } from "lucide-react";
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

const CustomRequestsList = () => {
  const { toast } = useToast();
  const [selectedRequest, setSelectedRequest] = useState<CustomRequest | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const {
    data: requests,
    isLoading,
    isError,
  } = useQuery<CustomRequest[]>({
    queryKey: ["/api/custom-requests"],
  });

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      setIsUpdating(true);
      await apiRequest("PUT", `/api/custom-requests/${id}/status`, { status });
      
      toast({
        title: "Statut mis à jour",
        description: "Le statut de la demande a été mis à jour avec succès.",
      });
      
      queryClient.invalidateQueries({ queryKey: ["/api/custom-requests"] });
      setSelectedRequest(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du statut.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            <Clock className="mr-1 h-3 w-3" /> Nouvelle
          </Badge>
        );
      case "in-progress":
        return (
          <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
            <Check className="mr-1 h-3 w-3" /> En cours
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCheck className="mr-1 h-3 w-3" /> Terminée
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Erreur</CardTitle>
          <CardDescription>
            Une erreur est survenue lors du chargement des demandes.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button
            onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/custom-requests"] })}
          >
            Réessayer
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Demandes de voyages personnalisés</CardTitle>
          <CardDescription>
            Gérez les demandes de voyages sur mesure soumises par vos clients.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Date départ</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests && requests.length > 0 ? (
                    requests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.id}</TableCell>
                        <TableCell>{request.fullName}</TableCell>
                        <TableCell>{request.destination}</TableCell>
                        <TableCell>
                          {format(new Date(request.departureDate), "dd/MM/yyyy")}
                        </TableCell>
                        <TableCell>{getStatusBadge(request.status)}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedRequest(request)}
                          >
                            <Eye className="h-4 w-4 mr-1" /> Voir
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                        Aucune demande trouvée
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Request Details Dialog */}
      <Dialog open={!!selectedRequest} onOpenChange={(open) => !open && setSelectedRequest(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Détails de la demande #{selectedRequest?.id}</DialogTitle>
            <DialogDescription>
              Demande soumise le{" "}
              {selectedRequest?.createdAt &&
                format(new Date(selectedRequest.createdAt), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Statut</h3>
                  <div className="flex items-center justify-between mt-1">
                    <div>{getStatusBadge(selectedRequest.status)}</div>
                    <Select
                      defaultValue={selectedRequest.status}
                      onValueChange={(value) => handleUpdateStatus(selectedRequest.id, value)}
                      disabled={isUpdating}
                    >
                      <SelectTrigger className="w-36">
                        <SelectValue placeholder="Changer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">Nouvelle</SelectItem>
                        <SelectItem value="in-progress">En cours</SelectItem>
                        <SelectItem value="completed">Terminée</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Client</h3>
                  <p className="mt-1 font-medium">{selectedRequest.fullName}</p>
                  <p className="text-sm text-gray-500">{selectedRequest.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Destination</h3>
                  <p className="mt-1">{selectedRequest.destination}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Date de départ</h3>
                  <p className="mt-1">{format(new Date(selectedRequest.departureDate), "d MMMM yyyy", { locale: fr })}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Personnes</h3>
                  <p className="mt-1">{selectedRequest.persons}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Budget</h3>
                <p className="mt-1">{selectedRequest.budget}</p>
              </div>

              {selectedRequest.interests && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Centres d'intérêt</h3>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {selectedRequest.interests.split(',').map((interest) => (
                      <Badge key={interest} variant="outline">{interest.trim()}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedRequest.additionalDetails && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Détails supplémentaires</h3>
                  <p className="mt-1 whitespace-pre-line text-sm">{selectedRequest.additionalDetails}</p>
                </div>
              )}

              <div className="pt-4 flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedRequest(null)}
                >
                  Fermer
                </Button>
                {selectedRequest.status !== "completed" && (
                  <Button
                    onClick={() => handleUpdateStatus(selectedRequest.id, "completed")}
                    disabled={isUpdating}
                  >
                    <CheckCheck className="mr-2 h-4 w-4" />
                    Marquer comme terminée
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomRequestsList;
