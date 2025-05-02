import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Category } from "@shared/schema";

const CategoryCard = ({ category }: { category: Category }) => {
  return (
    <Link href={`/tours?categoryId=${category.id}`}>
      <a className="group">
        <div className="relative rounded-lg overflow-hidden h-40">
          <img
            src={category.imageUrl}
            alt={category.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
          <div className="absolute bottom-0 left-0 p-4">
            <h3 className="text-white font-heading font-semibold">{category.name}</h3>
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
