import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/layout/AdminLayout";
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
import { Eye, Package, FileText } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Type pour les commandes
interface OrderItem {
  productId: number;
  quantity: number;
  price: number;
  name: string;
  imageUrl?: string;
}

interface Order {
  id: number;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode?: string;
  items: OrderItem[];
  totalAmount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

const ORDER_STATUS = {
  pending: { label: "En attente", color: "bg-yellow-500" },
  processing: { label: "En traitement", color: "bg-blue-500" },
  shipped: { label: "Expédié", color: "bg-purple-500" },
  delivered: { label: "Livré", color: "bg-green-500" },
  cancelled: { label: "Annulé", color: "bg-red-500" },
};

const AdminOrders = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const { toast } = useToast();

  // Récupérer la liste des commandes
  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
  });

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsViewDialogOpen(true);
  };

  const updateOrderStatus = async (orderId: number, status: Order["status"]) => {
    try {
      await apiRequest("PATCH", `/api/orders/${orderId}`, { status });
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({
        title: "Statut mis à jour",
        description: `La commande a été mise à jour avec le statut : ${ORDER_STATUS[status].label}`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du statut.",
      });
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("fr-FR", options);
  };

  const formatPrice = (price: number) => {
    return `${price.toLocaleString()} MAD`;
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-heading font-bold">Gestion des commandes</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Commandes reçues</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : orders && orders.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">#{order.id}</TableCell>
                      <TableCell>{formatDate(order.createdAt)}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.customerName}</p>
                          <p className="text-sm text-gray-500">{order.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{formatPrice(order.totalAmount)}</TableCell>
                      <TableCell>
                        <Badge className={ORDER_STATUS[order.status].color}>
                          {ORDER_STATUS[order.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewOrder(order)}
                          >
                            <Eye className="h-4 w-4 mr-1" /> Voir
                          </Button>
                          <Select
                            value={order.status}
                            onValueChange={(value) => 
                              updateOrderStatus(order.id, value as Order["status"])
                            }
                          >
                            <SelectTrigger className="h-8 w-[130px]">
                              <SelectValue placeholder="Changer" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(ORDER_STATUS).map(([key, { label }]) => (
                                <SelectItem key={key} value={key}>
                                  {label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">Aucune commande trouvée.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modal détails commande */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Détails de la commande #{selectedOrder?.id}
              </DialogTitle>
            </DialogHeader>
            
            {selectedOrder && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Informations client</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p><span className="font-medium">Nom:</span> {selectedOrder.customerName}</p>
                      <p><span className="font-medium">Email:</span> {selectedOrder.email}</p>
                      <p><span className="font-medium">Téléphone:</span> {selectedOrder.phone}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Adresse de livraison</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p>{selectedOrder.address}</p>
                      <p>{selectedOrder.city} {selectedOrder.zipCode}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Statut de la commande</h3>
                  <div className="flex items-center gap-3">
                    <Badge className={ORDER_STATUS[selectedOrder.status].color}>
                      {ORDER_STATUS[selectedOrder.status].label}
                    </Badge>
                    
                    <Select
                      value={selectedOrder.status}
                      onValueChange={(value) => 
                        updateOrderStatus(selectedOrder.id, value as Order["status"])
                      }
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Changer le statut" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(ORDER_STATUS).map(([key, { label }]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Produits commandés</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produit</TableHead>
                        <TableHead>Prix unitaire</TableHead>
                        <TableHead>Quantité</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {item.imageUrl && (
                                <div className="h-10 w-10 rounded overflow-hidden">
                                  <img
                                    src={item.imageUrl}
                                    alt={item.name}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                              )}
                              <span>{item.name || `Produit #${item.productId}`}</span>
                            </div>
                          </TableCell>
                          <TableCell>{formatPrice(item.price)}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell className="text-right font-medium">
                            {formatPrice(item.price * item.quantity)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="flex justify-end">
                  <div className="bg-gray-50 p-4 rounded-lg w-full md:w-80">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Sous-total</span>
                      <span>{formatPrice(selectedOrder.totalAmount - 50)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Frais de livraison</span>
                      <span>{formatPrice(50)}</span>
                    </div>
                    <div className="flex justify-between font-medium text-lg pt-2 border-t">
                      <span>Total</span>
                      <span>{formatPrice(selectedOrder.totalAmount)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsViewDialogOpen(false)}
                  >
                    Fermer
                  </Button>
                  <Button>
                    Imprimer la facture
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;