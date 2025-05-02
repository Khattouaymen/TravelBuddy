import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Product } from "@shared/schema";
import ProductDetails from "@/components/store/ProductDetails";

const ProductPage = () => {
  const [match, params] = useRoute<{ id: string }>("/store/:id");
  const productId = parseInt(params?.id || "0");
  
  const { data: product, isLoading, isError } = useQuery<Product>({
    queryKey: [`/api/products/${productId}`],
    enabled: !!productId,
  });
  
  if (!match) {
    return null;
  }
  
  if (isError) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-heading font-bold mb-4">Produit non trouvé</h1>
        <p className="text-gray-600 mb-8">
          Le produit que vous recherchez n'existe pas ou n'est plus disponible.
        </p>
      </div>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>
          {isLoading
            ? "Chargement du produit..."
            : product
            ? `${product.name} | Boutique Maroc Voyages`
            : "Produit non trouvé | Boutique Maroc Voyages"}
        </title>
        <meta
          name="description"
          content={
            product?.description ||
            "Découvrez ce produit artisanal authentique du Maroc et ajoutez-le à votre collection."
          }
        />
      </Helmet>
      
      <div className="bg-gray-50 py-8">
        <ProductDetails productId={productId} />
      </div>
    </>
  );
};

export default ProductPage;
