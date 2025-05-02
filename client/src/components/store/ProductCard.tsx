import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/use-cart";
import { Link } from "wouter";
import { Product } from "@shared/schema";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { toast } = useToast();
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.discountPrice || product.price,
      image: product.imageUrl,
      quantity: 1
    });

    toast({
      title: "Produit ajouté",
      description: `${product.name} a été ajouté à votre panier`,
    });
  };

  return (
    <Link href={`/store/${product.id}`}>
      <a className="bg-white rounded-xl overflow-hidden shadow-md group">
        <div className="relative h-48 overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          {product.isNew && (
            <div className="absolute top-0 right-0 bg-accent m-2 px-2 py-1 rounded text-xs font-semibold">
              Nouveau
            </div>
          )}
          {product.discountPrice && (
            <div className="absolute top-0 right-0 bg-primary m-2 px-2 py-1 rounded text-xs font-semibold text-white">
              {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% off
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-heading font-semibold mb-1">{product.name}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold">{product.discountPrice || product.price} MAD</p>
              {product.discountPrice && (
                <p className="text-gray-500 text-xs line-through">{product.price} MAD</p>
              )}
            </div>
            <Button
              size="sm"
              onClick={handleAddToCart}
              className="text-xs"
              disabled={!product.inStock}
            >
              {product.inStock ? "Ajouter au panier" : "Indisponible"}
            </Button>
          </div>
        </div>
      </a>
    </Link>
  );
};

export default ProductCard;
