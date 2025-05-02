import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/use-cart";
import { Link } from "wouter";
import { Product } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { MinusIcon, PlusIcon, ShoppingCart, Package, Tag, CheckCircle } from "lucide-react";

interface ProductDetailsProps {
  productId: number;
}

const ProductDetails = ({ productId }: ProductDetailsProps) => {
  const { toast } = useToast();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: [`/api/products/${productId}`],
  });

  const { data: relatedProducts, isLoading: isLoadingRelated } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const handleAddToCart = () => {
    if (!product) return;
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.discountPrice || product.price,
      image: product.imageUrl,
      quantity,
    });

    toast({
      title: "Produit ajouté",
      description: `${product.name} a été ajouté à votre panier`,
    });
  };

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="h-96 w-full rounded-xl" />
          <div>
            <Skeleton className="h-10 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/4 mb-6" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-6" />
            <Skeleton className="h-10 w-full mb-4" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-heading font-semibold mb-4">Produit non trouvé</h2>
        <p className="text-gray-600 mb-8">Le produit que vous recherchez n'existe pas ou a été supprimé.</p>
        <Link href="/store">
          <Button>Retour à la boutique</Button>
        </Link>
      </div>
    );
  }

  // Get 4 related products from the same category, excluding current product
  const filteredRelatedProducts = relatedProducts
    ?.filter(
      (p) => p.category === product.category && p.id !== product.id
    )
    .slice(0, 4);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-auto object-contain rounded-lg"
          />
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2">
            {product.name}
          </h1>
          
          <div className="flex items-center mb-6">
            <span className="text-2xl font-semibold text-primary mr-3">
              {product.discountPrice || product.price} MAD
            </span>
            {product.discountPrice && (
              <span className="text-gray-500 text-lg line-through">
                {product.price} MAD
              </span>
            )}
          </div>
          
          <p className="text-gray-700 mb-6">{product.description}</p>
          
          <div className="flex items-center mb-6">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              product.inStock 
                ? "bg-green-100 text-green-800" 
                : "bg-red-100 text-red-800"
            }`}>
              {product.inStock ? "En stock" : "Rupture de stock"}
            </span>
            
            {product.isNew && (
              <span className="ml-3 px-3 py-1 bg-accent text-white rounded-full text-sm font-medium">
                Nouveau
              </span>
            )}
            
            <span className="ml-3 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
              {product.category}
            </span>
          </div>
          
          {product.inStock && (
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">Quantité</p>
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                >
                  <MinusIcon className="h-4 w-4" />
                </Button>
                <span className="mx-4 font-medium text-lg">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={incrementQuantity}
                >
                  <PlusIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
          
          <Button
            size="lg"
            className="w-full mb-4"
            disabled={!product.inStock}
            onClick={handleAddToCart}
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            Ajouter au panier
          </Button>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-heading font-semibold mb-3">Informations</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <Package className="h-5 w-5 text-primary mr-2 mt-0.5" />
                <span className="text-gray-700">
                  Livraison dans tout le Maroc sous 3-5 jours ouvrables
                </span>
              </li>
              <li className="flex items-start">
                <Tag className="h-5 w-5 text-primary mr-2 mt-0.5" />
                <span className="text-gray-700">
                  Produit artisanal authentique fait à la main
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
                <span className="text-gray-700">
                  Satisfait ou remboursé sous 14 jours
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {filteredRelatedProducts && filteredRelatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-heading font-semibold mb-6">
            Produits similaires
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoadingRelated
              ? Array(4)
                  .fill(0)
                  .map((_, index) => (
                    <Skeleton key={index} className="h-64 w-full rounded-xl" />
                  ))
              : filteredRelatedProducts.map((relatedProduct) => (
                  <Link key={relatedProduct.id} href={`/store/${relatedProduct.id}`}>
                    <a className="bg-white rounded-xl overflow-hidden shadow-md group">
                      <div className="h-40 overflow-hidden">
                        <img
                          src={relatedProduct.imageUrl}
                          alt={relatedProduct.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-heading font-semibold mb-1 truncate">
                          {relatedProduct.name}
                        </h3>
                        <p className="font-medium text-primary">
                          {relatedProduct.discountPrice || relatedProduct.price} MAD
                        </p>
                      </div>
                    </a>
                  </Link>
                ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
