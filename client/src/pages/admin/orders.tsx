import AdminLayout from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";

const AdminOrders = () => {
  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-heading font-bold mb-8">Commandes</h1>
        
        <Card>
          <CardContent className="p-6">
            <div className="rounded-md border overflow-hidden">
              <div className="grid grid-cols-6 gap-4 p-4 bg-gray-50 font-semibold border-b">
                <div>Numéro</div>
                <div>Client</div>
                <div>Date</div>
                <div>Montant</div>
                <div>Statut</div>
                <div className="text-right">Actions</div>
              </div>
              
              <div className="p-8 text-center text-gray-500">
                Aucune commande trouvée pour le moment.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;