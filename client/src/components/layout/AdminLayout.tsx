import { ReactNode, useEffect, useState } from "react";
import { Link, useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  Axis3d, 
  LayoutDashboard, 
  Map, 
  ShoppingBag, 
  FileEdit, 
  MessageSquare, 
  ShoppingCart, 
  LogOut,
  Users
} from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
}

interface AdminUser {
  name: string;
  email: string;
  role: string;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [location, setLocation] = useLocation();
  const [isDashboard] = useRoute("/admin");
  const [isTours] = useRoute("/admin/tours");
  const [isProducts] = useRoute("/admin/products");
  const [isBlog] = useRoute("/admin/blog");
  const [isCustomRequests] = useRoute("/admin/custom-requests");
  const [isOrders] = useRoute("/admin/orders");
  
  const { toast } = useToast();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Vérifier l'authentification depuis localStorage
    // Note: Nous stockons toujours les infos utilisateur dans localStorage 
    // pour l'affichage, mais l'authentification repose sur les cookies de session
    const userData = localStorage.getItem("adminUser");
    
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Erreur lors du parsing des données utilisateur", error);
      }
    }
    
    // Vérifier l'état de la session côté serveur
    const checkSession = async () => {
      try {
        const response = await fetch("/api/auth/session", {
          credentials: "include" // Important pour inclure les cookies
        });
        const data = await response.json();
        
        if (!data.isAuthenticated) {
          // Si la session n'est pas valide, rediriger vers la page de connexion
          localStorage.removeItem("adminUser");
          setUser(null);
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de la session:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();
  }, []);
  
  useEffect(() => {
    // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié et que le chargement est terminé
    if (!isLoading && !user) {
      setLocation("/login");
    }
  }, [user, isLoading, setLocation]);
  
  const handleLogout = async () => {
    try {
      // Appeler l'API de déconnexion pour détruire la session côté serveur
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include"
      });
      
      // Supprimer les informations d'authentification
      localStorage.removeItem("adminUser");
      
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès.",
      });
      
      setUser(null);
      setLocation("/login");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la déconnexion.",
      });
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!user) {
    return null; // Le useEffect déplacé plus haut s'occupera de la redirection
  }
  
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="hidden md:flex md:w-64 flex-col bg-white shadow-lg">
        <div className="p-4 flex items-center border-b">
          <Axis3d className="h-8 w-8 text-primary mr-2" />
          <span className="font-heading font-semibold text-lg">Administration</span>
        </div>
        
        <div className="flex flex-col gap-1 p-4 flex-1">
          <Link href="/admin">
            <a
              className={`flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 ${
                isDashboard ? "bg-gray-100 text-primary font-medium" : ""
              }`}
            >
              <LayoutDashboard size={18} />
              <span>Tableau de bord</span>
            </a>
          </Link>
          
          <Link href="/admin/tours">
            <a
              className={`flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 ${
                isTours ? "bg-gray-100 text-primary font-medium" : ""
              }`}
            >
              <Map size={18} />
              <span>Circuits</span>
            </a>
          </Link>
          
          <Link href="/admin/products">
            <a
              className={`flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 ${
                isProducts ? "bg-gray-100 text-primary font-medium" : ""
              }`}
            >
              <ShoppingBag size={18} />
              <span>Produits</span>
            </a>
          </Link>
          
          <Link href="/admin/blog">
            <a
              className={`flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 ${
                isBlog ? "bg-gray-100 text-primary font-medium" : ""
              }`}
            >
              <FileEdit size={18} />
              <span>Blog</span>
            </a>
          </Link>
          
          <Link href="/admin/custom-requests">
            <a
              className={`flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 ${
                isCustomRequests ? "bg-gray-100 text-primary font-medium" : ""
              }`}
            >
              <MessageSquare size={18} />
              <span>Demandes sur mesure</span>
            </a>
          </Link>
          
          <Link href="/admin/orders">
            <a
              className={`flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 ${
                isOrders ? "bg-gray-100 text-primary font-medium" : ""
              }`}
            >
              <ShoppingCart size={18} />
              <span>Commandes</span>
            </a>
          </Link>
        </div>
        
        <div className="p-4 border-t">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <Users size={18} />
            </div>
            <div>
              <p className="font-medium text-sm">{user.name}</p>
              <p className="text-xs text-gray-500">{user.role}</p>
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            className="w-full flex items-center gap-2"
            onClick={handleLogout}
          >
            <LogOut size={16} />
            <span>Déconnexion</span>
          </Button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow p-4 flex items-center justify-between md:hidden">
          <div className="flex items-center gap-2">
            <Axis3d className="h-6 w-6 text-primary" />
            <span className="font-heading font-semibold">Admin</span>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut size={16} />
          </Button>
        </header>
        
        <main>{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
