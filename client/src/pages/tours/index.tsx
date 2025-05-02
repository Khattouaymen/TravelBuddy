import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { Tour, Category } from "@shared/schema";
import TourCard from "@/components/tours/TourCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, MapPin, Calendar } from "lucide-react";

const Tours = () => {
  const [location] = useLocation();
  const [searchParams, setSearchParams] = useState({
    query: "",
    category: "",
    duration: "",
    priceRange: "",
  });
  
  // Parse URL query parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const categoryId = params.get("categoryId");
    const destination = params.get("destination");
    const date = params.get("date");
    const travelers = params.get("travelers");
    
    if (categoryId) {
      setSearchParams(prev => ({ ...prev, category: categoryId }));
    }
    
    if (destination) {
      setSearchParams(prev => ({ ...prev, query: destination }));
    }
  }, [location]);
  
  // Fetch all tours
  const { data: tours, isLoading: isLoadingTours } = useQuery<Tour[]>({
    queryKey: ["/api/tours"],
  });
  
  // Fetch categories for filter
  const { data: categories, isLoading: isLoadingCategories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });
  
  const handleSearchChange = (field: string, value: string) => {
    setSearchParams(prev => ({ ...prev, [field]: value }));
  };
  
  // Filter tours based on search parameters
  const filteredTours = tours?.filter(tour => {
    // Filter by search query
    if (searchParams.query && !tour.title.toLowerCase().includes(searchParams.query.toLowerCase()) && 
        !tour.locations.toLowerCase().includes(searchParams.query.toLowerCase()) &&
        !tour.description.toLowerCase().includes(searchParams.query.toLowerCase())) {
      return false;
    }
    
    // Filter by category
    if (searchParams.category && tour.categoryId !== parseInt(searchParams.category)) {
      return false;
    }
    
    // Filter by duration
    if (searchParams.duration) {
      const [min, max] = searchParams.duration.split('-').map(Number);
      if (min && max && (tour.duration < min || tour.duration > max)) {
        return false;
      } else if (min && !max && tour.duration < min) {
        return false;
      }
    }
    
    // Filter by price range
    if (searchParams.priceRange) {
      const [min, max] = searchParams.priceRange.split('-').map(Number);
      if (min && max && (tour.price < min || tour.price > max)) {
        return false;
      } else if (min && !max && tour.price < min) {
        return false;
      }
    }
    
    return true;
  });
  
  return (
    <>
      <Helmet>
        <title>Circuits et Voyages au Maroc | Maroc Voyages</title>
        <meta
          name="description"
          content="Découvrez notre sélection de circuits et voyages organisés au Maroc. Des expériences authentiques pour explorer les merveilles du Maroc."
        />
      </Helmet>
      
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl font-heading font-bold mb-4">
              Circuits et Voyages au Maroc
            </h1>
            <p className="text-gray-600">
              Explorez nos circuits organisés pour découvrir les merveilles du Maroc. Des expériences authentiques, des paysages à couper le souffle et une immersion culturelle unique.
            </p>
          </div>
          
          {/* Search and filters */}
          <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="col-span-1 md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Rechercher une destination..."
                    className="pl-10"
                    value={searchParams.query}
                    onChange={(e) => handleSearchChange("query", e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <Select
                  value={searchParams.category}
                  onValueChange={(value) => handleSearchChange("category", value)}
                >
                  <SelectTrigger>
                    <div className="flex items-center">
                      <MapPin className="mr-2 h-4 w-4 text-gray-400" />
                      <SelectValue placeholder="Catégorie" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Toutes les catégories</SelectItem>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Select
                  value={searchParams.duration}
                  onValueChange={(value) => handleSearchChange("duration", value)}
                >
                  <SelectTrigger>
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                      <SelectValue placeholder="Durée" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Toutes les durées</SelectItem>
                    <SelectItem value="1-3">1-3 jours</SelectItem>
                    <SelectItem value="4-7">4-7 jours</SelectItem>
                    <SelectItem value="8-14">8-14 jours</SelectItem>
                    <SelectItem value="15">15+ jours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <Select
                  value={searchParams.priceRange}
                  onValueChange={(value) => handleSearchChange("priceRange", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Budget" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tous les budgets</SelectItem>
                    <SelectItem value="0-3000">Moins de 3 000 MAD</SelectItem>
                    <SelectItem value="3000-5000">3 000 - 5 000 MAD</SelectItem>
                    <SelectItem value="5000-8000">5 000 - 8 000 MAD</SelectItem>
                    <SelectItem value="8000">Plus de 8 000 MAD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button
                onClick={() => setSearchParams({
                  query: "",
                  category: "",
                  duration: "",
                  priceRange: "",
                })}
                variant="outline"
              >
                Réinitialiser les filtres
              </Button>
            </div>
          </div>
          
          {/* Tours grid */}
          <div>
            <h2 className="text-2xl font-heading font-semibold mb-6">
              {filteredTours?.length || 0} résultat{filteredTours?.length !== 1 ? 's' : ''}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoadingTours ? (
                // Skeleton loading state
                Array(6)
                  .fill(0)
                  .map((_, index) => (
                    <div key={index} className="bg-white rounded-xl overflow-hidden shadow-md">
                      <Skeleton className="h-48 w-full" />
                      <div className="p-5">
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-full mb-4" />
                        <Skeleton className="h-4 w-1/2 mb-4" />
                        <div className="flex justify-between items-center">
                          <Skeleton className="h-6 w-1/4" />
                          <Skeleton className="h-8 w-1/3" />
                        </div>
                      </div>
                    </div>
                  ))
              ) : filteredTours && filteredTours.length > 0 ? (
                filteredTours.map((tour) => <TourCard key={tour.id} tour={tour} />)
              ) : (
                <div className="col-span-full text-center py-12">
                  <h3 className="text-lg font-medium mb-2">Aucun circuit ne correspond à vos critères</h3>
                  <p className="text-gray-500 mb-4">Veuillez modifier vos filtres ou nous contacter pour un voyage personnalisé.</p>
                  <Button asChild>
                    <a href="/custom-request">Demander un voyage sur mesure</a>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Tours;
