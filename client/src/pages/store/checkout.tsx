import { Helmet } from "react-helmet";
import { useCart } from "@/hooks/use-cart";
import { useLocation } from "wouter";
import { useEffect } from "react";
import Checkout from "@/components/store/Checkout";

const CheckoutPage = () => {
  const { items } = useCart();
  const [, navigate] = useLocation();
  
  // Redirect to cart if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      navigate("/store/cart");
    }
  }, [items, navigate]);
  
  if (items.length === 0) {
    return null;
  }
  
  return (
    <>
      <Helmet>
        <title>Finaliser votre commande | Boutique Maroc Voyages</title>
        <meta
          name="description"
          content="Complétez votre commande d'artisanat marocain en toute sécurité."
        />
      </Helmet>
      
      <div className="bg-gray-50 py-8">
        <Checkout />
      </div>
    </>
  );
};

export default CheckoutPage;
