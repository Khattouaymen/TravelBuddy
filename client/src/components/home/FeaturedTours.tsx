import { useState } from "react";
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
  
  const { data: tours, isLoading } = useQuery<Tour[]>({
    queryKey: ["/api/tours", { featured: true, limit: 6 }],
  });
  
  const filteredTours = tours
    ? activeCategory === "all"
      ? tours
      : tours.filter((tour) => {
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
            : filteredTours.map((tour) => <TourCard key={tour.id} tour={tour} />)}
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
