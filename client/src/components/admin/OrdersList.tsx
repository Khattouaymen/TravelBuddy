import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Order, Product } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Eye, Package, TruckIcon, XCircle } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";

const OrdersList = () => {
  const { toast } = useToast();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const {
    data: orders,
    isLoading,
    isError,
  } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
  });

  const { data: products } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    enabled: !!selectedOrder,
  });

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      setIsUpdating(true);
      await apiRequest("PUT", `/api/orders/${id}/status`, { status });
      
      toast({
        title: "Statut mis à jour",
        description: "Le statut de la commande a été mis à jour avec succès.",
      });
      
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      setSelectedOrder(null);
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
      case "pending":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            <Package className="mr-1 h-3 w-3" /> En attente
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">
            <TruckIcon className="mr-1 h-3 w-3" /> Expédiée
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800 hover:bg-red-100">
            <XCircle className="mr-1 h-3 w-3" /> Annulée
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Function to get product details by ID from the products array
  const getProductDetails = (productId: number) => {
    return products?.find((product) => product.id === productId);
  };

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Erreur</CardTitle>
          <CardDescription>
            Une erreur est survenue lors du chargement des commandes.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button
            onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/orders"] })}
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
          <CardTitle>Commandes de la boutique</CardTitle>
          <CardDescription>
            Gérez les commandes de produits artisanaux.
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
                    <TableHead>Date</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders && orders.length > 0 ? (
                    orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.customerName}</TableCell>
                        <TableCell>
                          {format(new Date(order.createdAt), "dd/MM/yyyy")}
                        </TableCell>
                        <TableCell>{order.totalAmount} MAD</TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye className="h-4 w-4 mr-1" /> Voir
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                        Aucune commande trouvée
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Détails de la commande #{selectedOrder?.id}</DialogTitle>
            <DialogDescription>
              Commande passée le{" "}
              {selectedOrder?.createdAt &&
                format(new Date(selectedOrder.createdAt), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Statut</h3>
                  <div className="flex items-center justify-between mt-1">
                    <div>{getStatusBadge(selectedOrder.status)}</div>
                    <Select
                      defaultValue={selectedOrder.status}
                      onValueChange={(value) => handleUpdateStatus(selectedOrder.id, value)}
                      disabled={isUpdating}
                    >
                      <SelectTrigger className="w-36">
                        <SelectValue placeholder="Changer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">En attente</SelectItem>
                        <SelectItem value="completed">Expédiée</SelectItem>
                        <SelectItem value="cancelled">Annulée</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Client</h3>
                  <p className="mt-1 font-medium">{selectedOrder.customerName}</p>
                  <p className="text-sm text-gray-500">{selectedOrder.email}</p>
                  <p className="text-sm text-gray-500">{selectedOrder.phone}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Adresse de livraison</h3>
                <p className="mt-1">{selectedOrder.address}</p>
                <p>{selectedOrder.city}{selectedOrder.zipCode ? `, ${selectedOrder.zipCode}` : ""}</p>
              </div>

              <Separator />

              <div>
                <h3 className="text-base font-medium mb-3">Articles commandés</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item: any, index: number) => {
                    const productDetails = getProductDetails(item.productId);
                    return (
                      <div key={index} className="flex items-center justify-between py-2 border-b">
                        <div className="flex items-center">
                          {productDetails?.imageUrl && (
                            <div className="w-12 h-12 rounded overflow-hidden mr-3">
                              <img 
                                src={productDetails.imageUrl} 
                                alt={productDetails.name} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div>
                            <p className="font-medium">
                              {productDetails ? productDetails.name : `Produit #${item.productId}`}
                            </p>
                            <p className="text-sm text-gray-500">
                              Quantité: {item.quantity} x {item.price} MAD
                            </p>
                          </div>
                        </div>
                        <p className="font-semibold">{item.quantity * item.price} MAD</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span>Sous-total</span>
                  <span>{selectedOrder.totalAmount - 50} MAD</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Frais de livraison</span>
                  <span>50 MAD</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>{selectedOrder.totalAmount} MAD</span>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedOrder(null)}
                >
                  Fermer
                </Button>
                {selectedOrder.status === "pending" && (
                  <>
                    <Button
                      variant="destructive"
                      onClick={() => handleUpdateStatus(selectedOrder.id, "cancelled")}
                      disabled={isUpdating}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Annuler
                    </Button>
                    <Button
                      onClick={() => handleUpdateStatus(selectedOrder.id, "completed")}
                      disabled={isUpdating}
                    >
                      <TruckIcon className="mr-2 h-4 w-4" />
                      Marquer comme expédiée
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdersList;
