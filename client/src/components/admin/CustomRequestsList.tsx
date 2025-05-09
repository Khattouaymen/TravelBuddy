import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { CustomRequest } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { 
  Eye, 
  Check, 
  Clock, 
  CheckCheck, 
  RefreshCw, 
  Phone, 
  Mail, 
  Calendar, 
  MapPin, 
  Users, 
  Wallet, 
  Clock4,
  Filter,
  MoreHorizontal,
  MessageSquare,
  ClipboardList
} from "lucide-react";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

const CustomRequestsList = () => {
  const { toast } = useToast();
  const [selectedRequest, setSelectedRequest] = useState<CustomRequest | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const {
    data: requests,
    isLoading,
    isError,
    refetch
  } = useQuery<CustomRequest[]>({
    queryKey: ["/api/custom-requests"],
    refetchOnWindowFocus: false,
  });

  const sortedAndFilteredRequests = useMemo(() => {
    if (!requests) return [];
    let result = [...requests].sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    if (statusFilter) {
      result = result.filter(request => request.status === statusFilter);
    }
    return result;
  }, [requests, statusFilter]);

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      setIsUpdating(true);
      await apiRequest("PUT", `/api/custom-requests/${id}/status`, { status });
      
      toast({
        title: "Statut mis à jour",
        description: "Le statut de la demande a été mis à jour avec succès.",
      });
      
      queryClient.invalidateQueries({ queryKey: ["/api/custom-requests"] });
      if (status === "completed") {
        setSelectedRequest(null);
      } else {
        const updatedRequest = { ...selectedRequest, status } as CustomRequest;
        setSelectedRequest(updatedRequest);
      }
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

  const handleContactClient = (method: 'email' | 'phone') => {
    if (!selectedRequest) return;
    if (method === 'email' && selectedRequest.email) {
      window.location.href = `mailto:${selectedRequest.email}?subject=Votre demande de voyage sur mesure #${selectedRequest.id}`;
    } else if (method === 'phone' && selectedRequest.phone) {
      window.location.href = `tel:${selectedRequest.phone}`;
    }
  };

  const formatDateSafely = (dateString: string, formatStr: string = "d MMMM yyyy") => {
    try {
      const date = parseISO(dateString);
      return format(date, formatStr, { locale: fr });
    } catch (error) {
      return "Format de date invalide";
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
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Demandes de voyages personnalisés</CardTitle>
              <CardDescription>
                Gérez les demandes de voyages sur mesure soumises par vos clients.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div>
                <Select
                  value={statusFilter || "all"}
                  onValueChange={(value) => setStatusFilter(value === "all" ? null : value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filtrer par statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="new">Nouvelles demandes</SelectItem>
                    <SelectItem value="in-progress">En cours</SelectItem>
                    <SelectItem value="completed">Terminées</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  refetch();
                  toast({
                    title: "Actualisation",
                    description: "Les données sont en cours d'actualisation...",
                  });
                }}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Actualiser
              </Button>
            </div>
          </div>
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
                    <TableHead className="w-[70px]">ID</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead className="hidden md:table-cell">Voyageurs</TableHead>
                    <TableHead className="hidden md:table-cell">Date départ</TableHead>
                    <TableHead className="text-center">Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedAndFilteredRequests.length > 0 ? (
                    sortedAndFilteredRequests.map((request) => (
                      <TableRow key={request.id} className="group">
                        <TableCell className="font-medium">{request.id}</TableCell>
                        <TableCell>
                          <div className="font-medium">{request.fullName || "Non spécifié"}</div>
                          <div className="text-xs text-muted-foreground truncate max-w-[150px]">
                            {request.email || "Email non fourni"}
                          </div>
                        </TableCell>
                        <TableCell>{request.destination || "Non spécifiée"}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {typeof request.persons === 'number' ? (
                            `${request.persons} ${request.persons > 1 ? 'pers.' : 'pers.'}`
                          ) : "N/A"}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {request.departureDate ? formatDateSafely(request.departureDate, "dd/MM/yyyy") : "Non spécifiée"}
                        </TableCell>
                        <TableCell className="text-center">{getStatusBadge(request.status)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setSelectedRequest(request)}>
                                <Eye className="h-4 w-4 mr-2" /> Voir les détails
                              </DropdownMenuItem>
                              {request.status === "new" && (
                                <DropdownMenuItem onClick={() => handleUpdateStatus(request.id, "in-progress")}>
                                  <Check className="h-4 w-4 mr-2" /> Marquer en cours
                                </DropdownMenuItem>
                              )}
                              {request.status !== "completed" && (
                                <DropdownMenuItem onClick={() => handleUpdateStatus(request.id, "completed")}>
                                  <CheckCheck className="h-4 w-4 mr-2" /> Marquer terminée
                                </DropdownMenuItem>
                              )}
                              {request.email && (
                                <DropdownMenuItem onClick={() => handleContactClient('email')}>
                                  <Mail className="h-4 w-4 mr-2" /> Envoyer un email
                                </DropdownMenuItem>
                              )}
                              {request.phone && (
                                <DropdownMenuItem onClick={() => handleContactClient('phone')}>
                                  <Phone className="h-4 w-4 mr-2" /> Appeler le client
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                        {statusFilter 
                          ? `Aucune demande avec le statut "${statusFilter}" trouvée` 
                          : "Aucune demande trouvée"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedRequest} onOpenChange={(open) => !open && setSelectedRequest(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <div className="flex justify-between items-center">
              <div>
                <DialogTitle>Demande #{selectedRequest?.id}</DialogTitle>
                <DialogDescription>
                  Reçue le {selectedRequest?.createdAt && formatDateSafely(selectedRequest.createdAt, "d MMMM yyyy 'à' HH:mm")}
                </DialogDescription>
              </div>
              <div className="flex items-center gap-2">
                {selectedRequest && selectedRequest.email && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleContactClient('email')}
                  >
                    <Mail className="h-4 w-4 mr-2" /> Email
                  </Button>
                )}
                {selectedRequest && selectedRequest.phone && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleContactClient('phone')}
                  >
                    <Phone className="h-4 w-4 mr-2" /> Appeler
                  </Button>
                )}
              </div>
            </div>
          </DialogHeader>

          {selectedRequest && (
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="info">
                  <ClipboardList className="h-4 w-4 mr-2" /> Informations
                </TabsTrigger>
                <TabsTrigger value="details">
                  <MessageSquare className="h-4 w-4 mr-2" /> Détails & Préférences
                </TabsTrigger>
              </TabsList>
              
              <ScrollArea className="max-h-[calc(90vh-200px)]">
                <TabsContent value="info" className="space-y-4 p-1">
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Statut de la demande</CardTitle>
                        {getStatusBadge(selectedRequest.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Mettre à jour le statut de cette demande
                          </p>
                        </div>
                        <Select
                          defaultValue={selectedRequest.status}
                          onValueChange={(value) => handleUpdateStatus(selectedRequest.id, value)}
                          disabled={isUpdating}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue placeholder="Changer" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">Nouvelle</SelectItem>
                            <SelectItem value="in-progress">En cours</SelectItem>
                            <SelectItem value="completed">Terminée</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Informations client</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center">
                        <div className="w-8">
                          <Users className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {selectedRequest.fullName || <span className="text-gray-500">Non spécifié</span>}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="w-8">
                          <Mail className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p>
                            {selectedRequest.email || <span className="text-gray-500">Email non fourni</span>}
                          </p>
                        </div>
                      </div>
                      
                      {selectedRequest.phone && (
                        <div className="flex items-center">
                          <div className="w-8">
                            <Phone className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <p>{selectedRequest.phone}</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Détails du voyage</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <div className="flex items-center">
                            <div className="w-8">
                              <MapPin className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Destination</p>
                              <p className="font-medium">
                                {selectedRequest.destination || <span className="text-gray-500">Non spécifiée</span>}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <div className="w-8">
                              <Calendar className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Date de départ</p>
                              <p className="font-medium">
                                {selectedRequest.departureDate ? (
                                  formatDateSafely(selectedRequest.departureDate)
                                ) : (
                                  <span className="text-gray-500">Non spécifiée</span>
                                )}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <div className="w-8">
                              <Users className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Nombre de voyageurs</p>
                              <p className="font-medium">
                                {typeof selectedRequest.persons === 'number' ? (
                                  `${selectedRequest.persons} ${selectedRequest.persons > 1 ? 'personnes' : 'personne'}`
                                ) : (
                                  <span className="text-gray-500">Non spécifié</span>
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center">
                            <div className="w-8">
                              <Wallet className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Budget</p>
                              <p className="font-medium">
                                {selectedRequest.budget || <span className="text-gray-500">Non spécifié</span>}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <div className="w-8">
                              <Clock4 className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Durée du voyage</p>
                              <p className="font-medium">
                                {selectedRequest.durationDays !== null && selectedRequest.durationDays !== undefined ? (
                                  `${selectedRequest.durationDays} jours`
                                ) : (
                                  <span className="text-gray-500">Non spécifiée</span>
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="details" className="space-y-4 p-1">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Centres d'intérêt</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {selectedRequest.interests && selectedRequest.interests.trim() ? (
                          selectedRequest.interests.split(',').map((interest, idx) => (
                            interest.trim() ? <Badge key={idx} variant="outline">{interest.trim()}</Badge> : null
                          ))
                        ) : (
                          <p className="text-gray-500">Aucun centre d'intérêt spécifié</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Message du client</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <p className="whitespace-pre-line text-sm">
                          {selectedRequest.additionalDetails && selectedRequest.additionalDetails.trim() 
                            ? selectedRequest.additionalDetails 
                            : <span className="text-gray-500">Aucun détail supplémentaire fourni</span>}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Notes internes</CardTitle>
                      <CardDescription>
                        Ces notes sont visibles uniquement par l'équipe administrative
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <textarea 
                        className="w-full min-h-[100px] p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Ajoutez des notes internes concernant cette demande..."
                      />
                      <div className="mt-2 flex justify-end">
                        <Button size="sm">
                          Enregistrer les notes
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </ScrollArea>
              
              <Separator className="my-4" />
              
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedRequest(null)}
                >
                  Fermer
                </Button>
                
                <div className="space-x-2">
                  {selectedRequest.status === "new" && (
                    <Button
                      variant="secondary"
                      onClick={() => handleUpdateStatus(selectedRequest.id, "in-progress")}
                      disabled={isUpdating}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Marquer en cours
                    </Button>
                  )}
                  
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
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomRequestsList;
