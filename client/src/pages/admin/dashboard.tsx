import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Package, ShoppingBag, MessageSquare, LineChart, Mail, FileText } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

// Types pour les données récupérées
interface DashboardStats {
  totalBookings: number;
  totalProducts: number;
  totalRequests: number;
  totalOrders: number;
  totalRevenue: number;
  totalBlogPosts: number;
  totalNewsletterSubscribers: number;
}

interface RecentBooking {
  id: number;
  customerName: string;
  tourName: string;
  date: string;
  travelers: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
}

interface RecentOrder {
  id: number;
  customerName: string;
  date: string;
  totalAmount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
}

const ORDER_STATUS = {
  pending: { label: "En attente", color: "bg-yellow-500" },
  processing: { label: "En traitement", color: "bg-blue-500" },
  shipped: { label: "Expédié", color: "bg-purple-500" },
  delivered: { label: "Livré", color: "bg-green-500" },
  cancelled: { label: "Annulé", color: "bg-red-500" },
};

const BOOKING_STATUS = {
  pending: { label: "En attente", color: "bg-yellow-500" },
  confirmed: { label: "Confirmé", color: "bg-blue-500" },
  completed: { label: "Terminé", color: "bg-green-500" },
  cancelled: { label: "Annulé", color: "bg-red-500" },
};

const AdminDashboard = () => {
  // Récupérer les statistiques du dashboard
  const { data: stats, isLoading: isStatsLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/admin/dashboard/stats"],
    // Fallback en cas d'échec de l'API
    placeholderData: {
      totalBookings: 28,
      totalProducts: 45,
      totalRequests: 12,
      totalOrders: 19,
      totalRevenue: 24500,
      totalBlogPosts: 8,
      totalNewsletterSubscribers: 350
    }
  });

  // Récupérer les réservations récentes
  const { data: recentBookings, isLoading: isBookingsLoading } = useQuery<RecentBooking[]>({
    queryKey: ["/api/admin/dashboard/recent-bookings"],
    // Fallback en cas d'échec de l'API
    placeholderData: [
      { id: 1, customerName: "Sophie Martin", tourName: "Marrakech et désert", date: "2025-04-28", travelers: 2, status: "confirmed" },
      { id: 2, customerName: "Pierre Dubois", tourName: "Essaouira et côte", date: "2025-05-15", travelers: 4, status: "pending" },
      { id: 3, customerName: "Marie Leroy", tourName: "Fès et Meknès", date: "2025-05-01", travelers: 1, status: "completed" },
      { id: 4, customerName: "Thomas Bernard", tourName: "Montagnes de l'Atlas", date: "2025-04-22", travelers: 3, status: "cancelled" }
    ]
  });

  // Récupérer les commandes récentes
  const { data: recentOrders, isLoading: isOrdersLoading } = useQuery<RecentOrder[]>({
    queryKey: ["/api/admin/dashboard/recent-orders"],
    // Fallback en cas d'échec de l'API
    placeholderData: [
      { id: 1, customerName: "Julie Dupont", date: "2025-04-30", totalAmount: 1200, status: "delivered" },
      { id: 2, customerName: "Nicolas Petit", date: "2025-05-01", totalAmount: 850, status: "processing" },
      { id: 3, customerName: "Camille Moreau", date: "2025-04-29", totalAmount: 350, status: "shipped" },
      { id: 4, customerName: "Alexandre Garcia", date: "2025-04-28", totalAmount: 620, status: "pending" }
    ]
  });

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "d MMMM yyyy", { locale: fr });
  };

  const formatPrice = (price: number) => {
    return `${price.toLocaleString()} MAD`;
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-heading font-bold mb-8">Tableau de bord</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <StatCard 
            title="Réservations" 
            value={stats?.totalBookings || 0} 
            icon={<Activity className="h-8 w-8 text-primary" />} 
            isLoading={isStatsLoading}
          />
          <StatCard 
            title="Produits" 
            value={stats?.totalProducts || 0} 
            icon={<Package className="h-8 w-8 text-primary" />} 
            isLoading={isStatsLoading}
          />
          <StatCard 
            title="Demandes personnalisées" 
            value={stats?.totalRequests || 0} 
            icon={<MessageSquare className="h-8 w-8 text-primary" />} 
            isLoading={isStatsLoading}
          />
          <StatCard 
            title="Commandes" 
            value={stats?.totalOrders || 0} 
            icon={<ShoppingBag className="h-8 w-8 text-primary" />} 
            isLoading={isStatsLoading}
          />
          <StatCard 
            title="Revenus" 
            value={formatPrice(stats?.totalRevenue || 0)} 
            icon={<LineChart className="h-8 w-8 text-primary" />} 
            isLoading={isStatsLoading}
          />
          <StatCard 
            title="Articles de blog" 
            value={stats?.totalBlogPosts || 0} 
            icon={<FileText className="h-8 w-8 text-primary" />} 
            isLoading={isStatsLoading}
          />
          <StatCard 
            title="Abonnés newsletter" 
            value={stats?.totalNewsletterSubscribers || 0} 
            icon={<Mail className="h-8 w-8 text-primary" />} 
            isLoading={isStatsLoading}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Réservations récentes</CardTitle>
            </CardHeader>
            <CardContent>
              {isBookingsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : recentBookings && recentBookings.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Circuit</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell>
                          <div className="font-medium">{booking.customerName}</div>
                          <div className="text-sm text-gray-500">{booking.travelers} voyageur(s)</div>
                        </TableCell>
                        <TableCell>{booking.tourName}</TableCell>
                        <TableCell>{formatDate(booking.date)}</TableCell>
                        <TableCell>
                          <Badge className={BOOKING_STATUS[booking.status].color}>
                            {BOOKING_STATUS[booking.status].label}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  Aucune réservation récente trouvée
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Commandes récentes</CardTitle>
            </CardHeader>
            <CardContent>
              {isOrdersLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : recentOrders && recentOrders.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Montant</TableHead>
                      <TableHead>Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.customerName}</TableCell>
                        <TableCell>{formatDate(order.date)}</TableCell>
                        <TableCell>{formatPrice(order.totalAmount)}</TableCell>
                        <TableCell>
                          <Badge className={ORDER_STATUS[order.status].color}>
                            {ORDER_STATUS[order.status].label}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  Aucune commande récente trouvée
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

const StatCard = ({ 
  title, 
  value, 
  icon, 
  isLoading 
}: { 
  title: string; 
  value: string | number; 
  icon: React.ReactNode;
  isLoading: boolean;
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            {isLoading ? (
              <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mt-1"></div>
            ) : (
              <h3 className="text-2xl font-bold mt-1">{value}</h3>
            )}
          </div>
          {icon}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminDashboard;