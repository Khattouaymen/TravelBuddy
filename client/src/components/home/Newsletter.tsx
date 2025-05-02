import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { RectangleEllipsis } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  email: z.string().email("Veuillez entrer un email valide"),
});

type FormValues = z.infer<typeof formSchema>;

export const Newsletter = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      await apiRequest("POST", "/api/newsletter", values);
      toast({
        title: "Inscription réussie",
        description: "Vous êtes maintenant inscrit à notre newsletter.",
      });
      form.reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de votre inscription.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-8 bg-primary bg-opacity-10 mt-8 rounded-lg">
      <div className="container mx-auto px-4 text-center">
        <RectangleEllipsis className="h-8 w-8 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-heading font-bold mb-4">
          Restez informé de nos offres spéciales
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
          Inscrivez-vous à notre newsletter pour recevoir des offres exclusives, des conseils de voyage et les dernières nouvelles du Maroc.
        </p>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-md mx-auto flex">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      placeholder="Votre adresse email"
                      className="rounded-r-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              className="rounded-l-none"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Inscription..." : "S'inscrire"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Newsletter;
