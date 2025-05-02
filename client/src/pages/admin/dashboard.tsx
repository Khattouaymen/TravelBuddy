import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Package, ShoppingBag, MessageSquare, LineChart, Mail } from "lucide-react";

const AdminDashboard = () => {
  // This would typically fetch data from the backend
  const stats = {
    totalBookings: 28,
    totalProducts: 45,
    totalRequests: 12,
    totalOrders: 19,
    totalRevenue: 24500,
    totalNewsletterSubscribers: 350
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-heading font-bold mb-8">Tableau de bord</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <StatCard 
            title="Réservations" 
            value={stats.totalBookings} 
            icon={<Activity className="h-8 w-8 text-primary" />} 
          />
          <StatCard 
            title="Produits" 
            value={stats.totalProducts} 
            icon={<Package className="h-8 w-8 text-primary" />} 
          />
          <StatCard 
            title="Demandes personnalisées" 
            value={stats.totalRequests} 
            icon={<MessageSquare className="h-8 w-8 text-primary" />} 
          />
          <StatCard 
            title="Commandes" 
            value={stats.totalOrders} 
            icon={<ShoppingBag className="h-8 w-8 text-primary" />} 
          />
          <StatCard 
            title="Revenus" 
            value={`${stats.totalRevenue} MAD`} 
            icon={<LineChart className="h-8 w-8 text-primary" />} 
          />
          <StatCard 
            title="Abonnés newsletter" 
            value={stats.totalNewsletterSubscribers} 
            icon={<Mail className="h-8 w-8 text-primary" />} 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Réservations récentes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 text-center py-8">
                Les données des réservations seront affichées ici
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Commandes récentes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 text-center py-8">
                Les données des commandes seront affichées ici
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

const StatCard = ({ title, value, icon }: { title: string; value: string | number; icon: React.ReactNode }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
          </div>
          {icon}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminDashboard;