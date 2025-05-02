import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { BlogPost } from "@shared/schema";
import BlogCard from "@/components/blog/BlogCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";

const blogCategories = [
  { value: "all", label: "Toutes les catégories" },
  { value: "Destinations", label: "Destinations" },
  { value: "Gastronomie", label: "Gastronomie" },
  { value: "Aventure", label: "Aventure" },
  { value: "Culture", label: "Culture" },
  { value: "Conseils", label: "Conseils" },
  { value: "Histoire", label: "Histoire" },
];

const Blog = () => {
  const [filters, setFilters] = useState({
    query: "",
    category: "all",
  });
  
  const { data: posts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
  });
  
  // Filter posts based on search and category
  const filteredPosts = posts?.filter((post) => {
    // Filter by search query
    if (
      filters.query &&
      !post.title.toLowerCase().includes(filters.query.toLowerCase()) &&
      !post.content.toLowerCase().includes(filters.query.toLowerCase()) &&
      !post.excerpt?.toLowerCase().includes(filters.query.toLowerCase())
    ) {
      return false;
    }
    
    // Filter by category
    if (filters.category !== "all" && post.category !== filters.category) {
      return false;
    }
    
    return true;
  });
  
  return (
    <>
      <Helmet>
        <title>Blog Voyage Maroc | Conseils et Inspirations</title>
        <meta
          name="description"
          content="Découvrez nos articles sur les destinations, la culture et la gastronomie marocaines. Des conseils d'experts pour préparer votre voyage au Maroc."
        />
      </Helmet>
      
      <div className="bg-secondary">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-4xl font-heading font-bold mb-4">
              Blog Voyage Maroc
            </h1>
            <p className="text-gray-200">
              Inspirations, conseils et histoires pour votre prochain voyage au Maroc.
              Découvrez la richesse culturelle et les trésors cachés de ce pays fascinant.
            </p>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        {/* Search and filter */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Rechercher un article..."
                  className="pl-10"
                  value={filters.query}
                  onChange={(e) => setFilters({ ...filters, query: e.target.value })}
                />
              </div>
              
              <Select
                value={filters.category}
                onValueChange={(value) => setFilters({ ...filters, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filtrer par catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {blogCategories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {/* Blog posts grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            // Skeleton loading state
            Array(6)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="bg-white rounded-xl overflow-hidden shadow-md">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-5">
                    <div className="flex items-center mb-3">
                      <Skeleton className="h-6 w-20 rounded" />
                      <Skeleton className="h-4 w-24 ml-3" />
                    </div>
                    <Skeleton className="h-6 w-4/5 mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              ))
          ) : filteredPosts && filteredPosts.length > 0 ? (
            filteredPosts.map((post) => <BlogCard key={post.id} post={post} />)
          ) : (
            <div className="col-span-full text-center py-12">
              <h3 className="text-lg font-medium mb-2">Aucun article ne correspond à votre recherche</h3>
              <p className="text-gray-500">Essayez d'autres termes ou filtres, ou parcourez toutes nos catégories.</p>
            </div>
          )}
        </div>
        
        {/* Categories sidebar (on mobile: horizontal scroll) */}
        <div className="mt-12 md:mt-16">
          <h2 className="text-2xl font-heading font-semibold mb-6">Catégories</h2>
          <div className="flex overflow-x-auto md:flex-wrap gap-3 pb-2">
            {blogCategories.filter(c => c.value !== "all").map((category) => (
              <button
                key={category.value}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                  filters.category === category.value
                    ? "bg-primary text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
                onClick={() => setFilters({ ...filters, category: category.value })}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Blog;
