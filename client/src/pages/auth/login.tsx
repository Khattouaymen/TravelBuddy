import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

const formSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

type FormValues = z.infer<typeof formSchema>;

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      // Vérification supplémentaire que l'email contient bien un @
      if (!values.email.includes('@')) {
        toast({
          variant: "destructive",
          title: "Erreur de validation",
          description: "L'email doit contenir un symbole @.",
        });
        setIsLoading(false);
        return;
      }
      
      // Pour la démo, nous utilisons username=admin peu importe l'email
      // Dans un environnement de production, vous devriez vérifier l'email correctement
      const response = await apiRequest("POST", "/api/auth/login", {
        username: "admin", // hardcoded pour la démo
        password: values.password
      });
      
      const data = await response.json();
      
      // Pas besoin de stocker de token puisque nous utilisons des cookies de session
      // Stockons juste les infos utilisateur pour l'interface
      localStorage.setItem("adminUser", JSON.stringify({
        name: data.user.username || "Administrateur",
        email: values.email,
        role: data.user.isAdmin ? "admin" : "user"
      }));
      
      toast({
        title: "Connexion réussie",
        description: "Bienvenue dans l'interface d'administration.",
      });
      
      navigate("/admin");
    } catch (error) {
      console.error("Erreur de connexion:", error);
      toast({
        variant: "destructive",
        title: "Échec de la connexion",
        description: "Email ou mot de passe incorrect.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 flex flex-col items-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-center text-2xl font-heading font-bold">
            Administration
          </CardTitle>
          <p className="text-center text-sm text-gray-500">
            Connectez-vous pour accéder au panneau d'administration
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="votre.email@exemple.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mot de passe</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="********" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Connexion en cours..." : "Se connecter"}
              </Button>
            </form>
          </Form>
          
          <div className="mt-6 text-center text-sm">
            <p className="text-gray-500">
              Pour la démonstration, utilisez:
            </p>
            <p className="text-gray-700 mt-1">
              Email: admin@marocvoyages.com
              <br />
              Mot de passe: admin123
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
