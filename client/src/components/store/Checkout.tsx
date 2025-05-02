import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/use-cart";
import { apiRequest } from "@/lib/queryClient";
import { Link, useLocation } from "wouter";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, CreditCard, MapPin, User } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const formSchema = z.object({
  customerName: z.string().min(3, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(8, "Le téléphone est requis"),
  address: z.string().min(5, "L'adresse est requise"),
  city: z.string().min(2, "La ville est requise"),
  zipCode: z.string().optional(),
  // Payment info - we'd normally do more validation here
  cardNumber: z.string().min(16, "Numéro de carte invalide"),
  cardName: z.string().min(3, "Nom sur la carte requis"),
  expiryDate: z.string().min(5, "Date d'expiration requise"),
  cvv: z.string().min(3, "CVV requis"),
});

type FormValues = z.infer<typeof formSchema>;

const Checkout = () => {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const { items, cartTotal, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [activeTab, setActiveTab] = useState("shipping");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      zipCode: "",
      cardNumber: "",
      cardName: "",
      expiryDate: "",
      cvv: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (items.length === 0) {
      toast({
        variant: "destructive",
        title: "Panier vide",
        description: "Votre panier est vide. Ajoutez des produits avant de passer commande.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Prepare order items in the format expected by the API
      const orderItems = items.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
      }));

      const orderData = {
        customerName: values.customerName,
        email: values.email,
        phone: values.phone,
        address: values.address,
        city: values.city,
        zipCode: values.zipCode || "",
        items: orderItems,
        totalAmount: cartTotal + 50, // Including shipping cost
      };

      await apiRequest("POST", "/api/orders", orderData);
      
      setOrderComplete(true);
      clearCart();
      
      // We don't reset the form since we're showing the success page
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors du traitement de votre commande.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // If order is complete, show success page
  if (orderComplete) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="bg-green-100 rounded-full p-6 inline-block mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-heading font-semibold mb-4">Commande réussie!</h2>
          <p className="text-gray-600 mb-8">
            Merci pour votre commande. Vous recevrez bientôt un email de confirmation avec les détails de livraison.
          </p>
          <div className="space-y-4">
            <Link href="/store">
              <Button className="w-full">Continuer les achats</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Check if cart is empty
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-heading font-semibold mb-4">Votre panier est vide</h2>
        <p className="text-gray-600 mb-8">
          Vous ne pouvez pas procéder au paiement avec un panier vide.
        </p>
        <Link href="/store">
          <Button>Visiter la boutique</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-heading font-bold mb-8">Finaliser votre commande</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="shipping" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Livraison
              </TabsTrigger>
              <TabsTrigger value="payment" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" /> Paiement
              </TabsTrigger>
            </TabsList>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <TabsContent value="shipping" className="mt-6 space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-heading font-semibold flex items-center gap-2">
                      <User className="h-5 w-5" /> Informations personnelles
                    </h3>
                    <p className="text-sm text-gray-500">
                      Ces informations seront utilisées pour la livraison et la communication.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="customerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom complet</FormLabel>
                          <FormControl>
                            <Input placeholder="Votre nom complet" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="votre.email@exemple.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Téléphone</FormLabel>
                        <FormControl>
                          <Input placeholder="Votre numéro de téléphone" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-heading font-semibold flex items-center gap-2">
                      <MapPin className="h-5 w-5" /> Adresse de livraison
                    </h3>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Adresse</FormLabel>
                        <FormControl>
                          <Input placeholder="Votre adresse" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ville</FormLabel>
                          <FormControl>
                            <Input placeholder="Votre ville" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Code postal (optionnel)</FormLabel>
                          <FormControl>
                            <Input placeholder="Code postal" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="pt-4 flex justify-end">
                    <Button
                      type="button"
                      onClick={() => setActiveTab("payment")}
                    >
                      Continuer vers le paiement
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="payment" className="mt-6 space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-heading font-semibold flex items-center gap-2">
                      <CreditCard className="h-5 w-5" /> Informations de paiement
                    </h3>
                    <p className="text-sm text-gray-500">
                      Toutes les transactions sont sécurisées et chiffrées.
                    </p>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="cardNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Numéro de carte</FormLabel>
                        <FormControl>
                          <Input placeholder="1234 5678 9012 3456" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="cardName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom sur la carte</FormLabel>
                        <FormControl>
                          <Input placeholder="NOM PRÉNOM" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="expiryDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date d'expiration</FormLabel>
                          <FormControl>
                            <Input placeholder="MM/AA" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="cvv"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CVV</FormLabel>
                          <FormControl>
                            <Input placeholder="123" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="pt-4 flex items-center justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setActiveTab("shipping")}
                    >
                      Retour
                    </Button>
                    <Button 
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Traitement..." : "Finaliser la commande"}
                    </Button>
                  </div>
                </TabsContent>
              </form>
            </Form>
          </Tabs>
        </div>
        
        {/* Order Summary */}
        <div>
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-heading font-semibold mb-4">Résumé de la commande</h3>
              
              <ul className="divide-y">
                {items.map((item) => (
                  <li key={item.id} className="py-3 flex justify-between">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        Quantité: {item.quantity} x {item.price} MAD
                      </p>
                    </div>
                    <p className="font-semibold">{item.price * item.quantity} MAD</p>
                  </li>
                ))}
              </ul>
              
              <Separator className="my-4" />
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sous-total</span>
                  <span>{cartTotal} MAD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Frais de livraison</span>
                  <span>50 MAD</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-primary">{cartTotal + 50} MAD</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-4 bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Besoin d'aide?</h4>
            <p className="text-sm text-gray-600 mb-3">
              Si vous avez des questions, n'hésitez pas à nous contacter.
            </p>
            <p className="text-sm font-medium">Téléphone: +212 524 123 456</p>
            <p className="text-sm font-medium">Email: support@marocvoyages.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
