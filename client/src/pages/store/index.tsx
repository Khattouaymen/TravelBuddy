import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Product } from "@shared/schema";
import ProductCard from "@/components/store/ProductCard";
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
import { Search, Package } from "lucide-react";

const categoryOptions = [
  { value: "all", label: "Toutes les catégories" },
  { value: "artisanat", label: "Artisanat" },
  { value: "décoration", label: "Décoration" },
  { value: "ustensiles", label: "Ustensiles" },
  { value: "bijoux", label: "Bijoux" },
  { value: "textile", label: "Textile" },
  { value: "souvenirs", label: "Souvenirs" },
];

const sortOptions = [
  { value: "newest", label: "Plus récents" },
  { value: "price-asc", label: "Prix: croissant" },
  { value: "price-desc", label: "Prix: décroissant" },
  { value: "name-asc", label: "Nom: A-Z" },
  { value: "name-desc", label: "Nom: Z-A" },
];

const Store = () => {
  const [filters, setFilters] = useState({
    query: "",
    category: "all",
    sort: "newest",
    priceRange: "",
    inStockOnly: false,
  });
  
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });
  
  const handleFilterChange = (field: string, value: any) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };
  
  // Filter and sort products
  const filteredProducts = products
    ?.filter(product => {
      // Filter by search query
      if (
        filters.query &&
        !product.name.toLowerCase().includes(filters.query.toLowerCase()) &&
        !product.description.toLowerCase().includes(filters.query.toLowerCase())
      ) {
        return false;
      }
      
      // Filter by category
      if (filters.category !== "all" && product.category !== filters.category) {
        return false;
      }
      
      // Filter by price range
      if (filters.priceRange) {
        const [min, max] = filters.priceRange.split("-").map(Number);
        const price = product.discountPrice || product.price;
        
        if (min && max && (price < min || price > max)) {
          return false;
        } else if (min && !max && price < min) {
          return false;
        }
      }
      
      // Filter by stock status
      if (filters.inStockOnly && !product.inStock) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      // Sort products
      switch (filters.sort) {
        case "price-asc":
          return (a.discountPrice || a.price) - (b.discountPrice || b.price);
        case "price-desc":
          return (b.discountPrice || b.price) - (a.discountPrice || a.price);
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "newest":
        default:
          // Assuming newer products have higher IDs
          return b.id - a.id;
      }
    });
  
  return (
    <>
      <Helmet>
        <title>Boutique d'Artisanat Marocain | Maroc Voyages</title>
        <meta
          name="description"
          content="Découvrez notre collection d'artisanat marocain authentique. Des pièces uniques fabriquées par des artisans locaux."
        />
      </Helmet>
      
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl font-heading font-bold mb-4">
              Boutique d'Artisanat Marocain
            </h1>
            <p className="text-gray-600">
              Découvrez notre sélection de produits artisanaux authentiques du Maroc. Chaque pièce raconte une histoire et représente le savoir-faire traditionnel des artisans locaux.
            </p>
          </div>
          
          {/* Filters */}
          <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Rechercher un produit..."
                  className="pl-10"
                  value={filters.query}
                  onChange={(e) => handleFilterChange("query", e.target.value)}
                />
              </div>
              
              <div>
                <Select
                  value={filters.category}
                  onValueChange={(value) => handleFilterChange("category", value)}
                >
                  <SelectTrigger>
                    <div className="flex items-center">
                      <Package className="mr-2 h-4 w-4 text-gray-400" />
                      <SelectValue placeholder="Catégorie" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Select
                  value={filters.sort}
                  onValueChange={(value) => handleFilterChange("sort", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Trier par" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <Select
                  value={filters.priceRange}
                  onValueChange={(value) => handleFilterChange("priceRange", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Fourchette de prix" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-prices">Tous les prix</SelectItem>
                    <SelectItem value="0-300">Moins de 300 MAD</SelectItem>
                    <SelectItem value="300-500">300 - 500 MAD</SelectItem>
                    <SelectItem value="500-1000">500 - 1000 MAD</SelectItem>
                    <SelectItem value="1000">Plus de 1000 MAD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="inStockOnly"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  checked={filters.inStockOnly}
                  onChange={(e) => handleFilterChange("inStockOnly", e.target.checked)}
                />
                <label htmlFor="inStockOnly" className="text-sm font-medium text-gray-700">
                  Produits en stock uniquement
                </label>
                
                <Button
                  className="ml-auto"
                  variant="outline"
                  onClick={() =>
                    setFilters({
                      query: "",
                      category: "all",
                      sort: "newest",
                      priceRange: "",
                      inStockOnly: false,
                    })
                  }
                >
                  Réinitialiser
                </Button>
              </div>
            </div>
          </div>
          
          {/* Products grid */}
          <div>
            <h2 className="text-2xl font-heading font-semibold mb-6">
              {filteredProducts?.length || 0} produit{filteredProducts?.length !== 1 ? 's' : ''}
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {isLoading ? (
                // Skeleton loading state
                Array(8)
                  .fill(0)
                  .map((_, index) => (
                    <div key={index} className="bg-white rounded-xl overflow-hidden shadow-md">
                      <Skeleton className="h-48 w-full" />
                      <div className="p-5">
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-full mb-4" />
                        <div className="flex justify-between items-center">
                          <Skeleton className="h-6 w-1/4" />
                          <Skeleton className="h-8 w-1/3" />
                        </div>
                      </div>
                    </div>
                  ))
              ) : filteredProducts && filteredProducts.length > 0 ? (
                filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)
              ) : (
                <div className="col-span-full text-center py-12">
                  <h3 className="text-lg font-medium mb-2">Aucun produit ne correspond à vos critères</h3>
                  <p className="text-gray-500">Veuillez modifier vos filtres ou revenir plus tard pour découvrir nos nouveaux produits.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Store;
