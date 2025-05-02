import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Axis3d, ShoppingCart, Search, Menu, X } from "lucide-react";

// Create a mock cart hook to use if the real one is not available
const useCartMock = () => ({ items: [] });

// Track if we're in browser or server environment
const isBrowser = typeof window !== 'undefined';

// Safety utility to get cart items
const getCartItems = () => {
  try {
    if (!isBrowser) return [];
    // Try to get cart from localStorage directly
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      return JSON.parse(savedCart);
    }
  } catch (e) {
    console.error('Error reading cart from localStorage', e);
  }
  return [];
};

const Header = () => {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { toast } = useToast();
  // Get cart items safely
  const [cartItems, setCartItems] = useState([]);
  
  useEffect(() => {
    setCartItems(getCartItems());
    
    // Set up an interval to check for cart changes
    const interval = setInterval(() => {
      setCartItems(getCartItems());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  const { data: session } = useQuery({
    queryKey: ["/api/auth/session"],
    refetchOnWindowFocus: true,
  });
  
  const isAuthenticated = session?.isAuthenticated;
  
  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/auth/logout", {});
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès.",
      });
      window.location.href = "/";
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de vous déconnecter. Veuillez réessayer.",
      });
    }
  };
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);
  
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Axis3d className="h-8 w-8 text-primary mr-2" />
              <span className="font-heading font-bold text-xl text-secondary">
                Maroc<span className="text-primary">Voyages</span>
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/">
              <a className={`font-medium hover:text-primary transition-colors ${location === "/" ? "text-primary" : ""}`}>
                Accueil
              </a>
            </Link>
            <Link href="/tours" className={`font-medium hover:text-primary transition-colors ${location === "/tours" ? "text-primary" : ""}`}>
                Destinations
            </Link>
            <Link href="/store" className={`font-medium hover:text-primary transition-colors ${location === "/store" ? "text-primary" : ""}`}>
                Boutique
            </Link>
            <Link href="/blog" className={`font-medium hover:text-primary transition-colors ${location === "/blog" ? "text-primary" : ""}`}>
                Blog
            </Link>
            <Link href="/custom-request" className={`font-medium hover:text-primary transition-colors ${location === "/custom-request" ? "text-primary" : ""}`}>
                Sur Mesure
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Link href="/search" className="hidden md:block hover:text-primary transition-colors">
              <Search size={20} />
            </Link>
            <Link href="/store/cart" className="hidden md:block hover:text-primary transition-colors relative">
              <ShoppingCart size={20} />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartItems.length}
                </span>
              )}
            </Link>
            
            {isAuthenticated ? (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleLogout}
              >
                Déconnexion
              </Button>
            ) : (
              <Link href="/login">
                <Button variant="default" size="sm">
                  Connexion
                </Button>
              </Link>
            )}
            
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
        
        {/* Mobile Navigation (toggle visibility) */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-1 border-t pt-2">
            <Link href="/" className="block px-3 py-2 hover:bg-primary hover:text-white rounded-md">
                Accueil
            </Link>
            <Link href="/tours" className="block px-3 py-2 hover:bg-primary hover:text-white rounded-md">
                Destinations
            </Link>
            <Link href="/store" className="block px-3 py-2 hover:bg-primary hover:text-white rounded-md">
                Boutique
            </Link>
            <Link href="/blog" className="block px-3 py-2 hover:bg-primary hover:text-white rounded-md">
                Blog
            </Link>
            <Link href="/custom-request" className="block px-3 py-2 hover:bg-primary hover:text-white rounded-md">
                Sur Mesure
            </Link>
            <Link href="/store/cart">
              <a className="block px-3 py-2 hover:bg-primary hover:text-white rounded-md">
                Panier ({cartItems.length})
              </a>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
