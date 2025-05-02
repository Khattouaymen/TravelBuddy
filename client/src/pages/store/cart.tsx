import { Helmet } from "react-helmet";
import ShoppingCart from "@/components/store/ShoppingCart";

const CartPage = () => {
  return (
    <>
      <Helmet>
        <title>Votre Panier | Boutique Maroc Voyages</title>
        <meta
          name="description"
          content="Consultez les articles dans votre panier et procédez au paiement pour recevoir vos produits artisanaux marocains."
        />
      </Helmet>
      
      <div className="bg-gray-50 py-8">
        <ShoppingCart />
      </div>
    </>
  );
};

export default CartPage;
