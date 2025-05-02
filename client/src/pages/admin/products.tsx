import { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Edit, Trash2 } from "lucide-react";

const AdminProducts = () => {
  const [showForm, setShowForm] = useState(false);
  
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-heading font-bold">Gestion des produits</h1>
          
          <Button 
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> Ajouter un produit
          </Button>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <div className="rounded-md border overflow-hidden">
              <div className="grid grid-cols-7 gap-4 p-4 bg-gray-50 font-semibold border-b">
                <div className="col-span-2">Nom</div>
                <div>Catégorie</div>
                <div>Prix</div>
                <div>Prix réduit</div>
                <div>En stock</div>
                <div className="text-right">Actions</div>
              </div>
              
              <div className="p-8 text-center text-gray-500">
                Aucun produit trouvé. Ajoutez votre premier produit!
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminProducts;