import { useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";

const ShoppingCart = () => {
  const { items, updateItemQuantity, removeItem, clearCart, cartTotal } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateQuantity = (
    id: number,
    currentQuantity: number,
    action: "increment" | "decrement"
  ) => {
    setIsUpdating(true);
    
    const newQuantity =
      action === "increment" ? currentQuantity + 1 : currentQuantity - 1;
    
    if (newQuantity < 1) {
      removeItem(id);
    } else {
      updateItemQuantity(id, newQuantity);
    }
    
    setTimeout(() => setIsUpdating(false), 300);
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="bg-gray-100 rounded-full p-6 inline-block mb-6">
            <ShoppingBag className="h-12 w-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-heading font-semibold mb-4">Votre panier est vide</h2>
          <p className="text-gray-600 mb-8">
            Explorez notre boutique pour découvrir notre sélection d'artisanat marocain authentique.
          </p>
          <Link href="/store">
            <Button>Visiter la boutique</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-heading font-bold mb-8">Votre panier</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="md:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex items-center p-4">
                  <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="ml-4 flex-1">
                    <Link href={`/store/${item.id}`}>
                      <a className="font-heading font-semibold hover:text-primary transition-colors">
                        {item.name}
                      </a>
                    </Link>
                    <p className="text-gray-500 text-sm">Prix unitaire: {item.price} MAD</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleUpdateQuantity(item.id, item.quantity, "decrement")}
                      disabled={isUpdating}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleUpdateQuantity(item.id, item.quantity, "increment")}
                      disabled={isUpdating}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  <div className="ml-6 text-right">
                    <p className="font-semibold">{item.price * item.quantity} MAD</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                      className="h-8 w-8 text-gray-500 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={clearCart}>
              Vider le panier
            </Button>
            <Link href="/store">
              <Button variant="link" className="text-primary">
                Continuer les achats
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Order Summary */}
        <div>
          <Card className="sticky top-20">
            <CardContent className="pt-6">
              <h3 className="text-xl font-heading font-semibold mb-4">Récapitulatif</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sous-total</span>
                  <span>{cartTotal} MAD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Frais de livraison</span>
                  <span>50 MAD</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-primary">{cartTotal + 50} MAD</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/store/checkout">
                <Button className="w-full">
                  Procéder au paiement <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
          
          <div className="mt-4 bg-gray-50 p-4 rounded-lg text-sm text-gray-600">
            <p className="mb-2">Méthodes de paiement acceptées:</p>
            <div className="flex space-x-2">
              <span className="px-2 py-1 bg-white border rounded">Visa</span>
              <span className="px-2 py-1 bg-white border rounded">MasterCard</span>
              <span className="px-2 py-1 bg-white border rounded">PayPal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
