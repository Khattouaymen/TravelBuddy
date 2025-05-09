import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tour } from "@shared/schema";
import TourCard from "@/components/tours/TourCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";

const categories = [
  { id: "all", name: "Tous" },
  { id: "popular", name: "Populaires" },
  { id: "desert", name: "Désert" },
  { id: "culture", name: "Culture" },
  { id: "plages", name: "Plages" },
];

const FeaturedTours = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [featuredTours, setFeaturedTours] = useState<Tour[]>([]);
  
  // Récupérer tous les circuits (sans filtrer par featured dans la requête)
  const { data: tours, isLoading } = useQuery<Tour[]>({
    queryKey: ["/api/tours"],
  });
  
  // Filtrer les circuits en vedette côté client
  useEffect(() => {
    if (tours) {
      // Filtrer strictement les circuits où featured est exactement true
      const filtered = tours.filter(tour => tour.featured === true);
      console.log('Circuits filtrés par featured===true:', filtered.length);
      setFeaturedTours(filtered.slice(0, 6)); // Limiter à 6 circuits
    }
  }, [tours]);
  
  const filteredTours = featuredTours
    ? activeCategory === "all"
      ? featuredTours
      : featuredTours.filter((tour) => {
          switch (activeCategory) {
            case "desert":
              return tour.locations.toLowerCase().includes("desert") || 
                    tour.locations.toLowerCase().includes("merzouga") ||
                    tour.categoryId === 3;
            case "popular":
              return tour.rating >= 4.5;
            case "culture":
              return tour.locations.toLowerCase().includes("fes") || 
                    tour.locations.toLowerCase().includes("marrakech") ||
                    tour.categoryId === 4;
            case "plages":
              return tour.locations.toLowerCase().includes("essaouira") || 
                    tour.locations.toLowerCase().includes("agadir") ||
                    tour.categoryId === 1;
            default:
              return true;
          }
        })
    : [];
  
  // Ajouter un log de débogage pour voir quels circuits sont réellement en vedette
  useEffect(() => {
    if (tours) {
      console.log('Tous les circuits:', tours.map(t => ({id: t.id, title: t.title, featured: t.featured})));
    }
  }, [tours]);
  
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <h2 className="text-3xl font-heading font-bold">Circuits en vedette</h2>
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`category-pill px-4 py-1 rounded-full text-sm whitespace-nowrap transition-colors ${
                  activeCategory === category.id
                    ? "bg-primary text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? Array(3)
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
            : filteredTours.length > 0 ? (
                filteredTours.map((tour) => <TourCard key={tour.id} tour={tour} />)
              ) : (
                <div className="col-span-3 text-center py-8">
                  <p className="text-gray-500">Aucun circuit en vedette disponible pour le moment.</p>
                </div>
              )}
        </div>
        
        <div className="text-center mt-8">
          <Link href="/tours">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
              Voir tous les circuits
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedTours;
