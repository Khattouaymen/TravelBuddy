import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Category } from "@shared/schema";

const CategoryCard = ({ category }: { category: Category }) => {
  return (
    <Link href={`/tours?categoryId=${category.id}`}>
      <a className="group block">
        <div className="relative rounded-lg overflow-hidden h-48 shadow-md transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
          <img
            src={category.imageUrl || 'https://images.unsplash.com/photo-1619111551766-4bd6d4371090?q=80&w=500&auto=format&fit=crop'}
            alt={`Catégorie de voyage: ${category.name}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-80 group-hover:opacity-70 transition-opacity"></div>
          <div className="absolute bottom-0 left-0 p-4 w-full">
            <h3 className="text-white font-heading font-semibold text-lg mb-1">{category.name}</h3>
            {category.tourCount && (
              <p className="text-white/80 text-sm">
                {category.tourCount} circuit{category.tourCount > 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>
      </a>
    </Link>
  );
};

const CategorySkeleton = () => {
  return (
    <div className="relative rounded-lg overflow-hidden h-40">
      <Skeleton className="h-full w-full" />
    </div>
  );
};

const Categories = () => {
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });
  
  return (
    <section className="py-12 container mx-auto px-4">
      <h2 className="text-3xl font-heading font-bold text-center mb-8">
        Explorez par catégorie
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {isLoading
          ? Array(4)
              .fill(0)
              .map((_, index) => <CategorySkeleton key={index} />)
          : categories?.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
      </div>
    </section>
  );
};

export default Categories;
