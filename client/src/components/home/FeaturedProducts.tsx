import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Product } from "@shared/schema";
import ProductCard from "@/components/store/ProductCard";

const FeaturedProducts = () => {
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  // Get the first 4 products for the featured section
  const featuredProducts = products?.slice(0, 4);

  return (
    <section className="py-16 container mx-auto px-4">
      <h2 className="text-3xl font-heading font-bold text-center mb-4">
        Boutique d'artisanat marocain
      </h2>
      <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
        Rapportez un morceau authentique du Maroc chez vous avec notre sélection d'artisanat traditionnel.
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          // Skeleton loading state
          Array(4)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-md">
                <Skeleton className="h-48 w-full" />
                <div className="p-4">
                  <Skeleton className="h-5 w-3/4 mb-1" />
                  <Skeleton className="h-4 w-full mb-3" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-8 w-32" />
                  </div>
                </div>
              </div>
            ))
        ) : (
          // Render actual products
          featuredProducts?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
      
      <div className="text-center mt-8">
        <Link href="/store">
          <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
            Visiter la boutique
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default FeaturedProducts;
