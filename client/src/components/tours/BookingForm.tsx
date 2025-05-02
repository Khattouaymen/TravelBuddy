import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Tour } from "@shared/schema";
import { addDays, format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const formSchema = z.object({
  startDate: z.date({
    required_error: "Veuillez sélectionner une date de départ",
  }),
  persons: z
    .string()
    .min(1, "Veuillez sélectionner le nombre de personnes"),
  fullName: z.string().min(3, "Nom complet requis"),
  email: z.string().email("Adresse email invalide"),
  phone: z.string().min(8, "Numéro de téléphone requis"),
});

type FormValues = z.infer<typeof formSchema>;

interface BookingFormProps {
  tour: Tour;
}

const BookingForm = ({ tour }: BookingFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPersons, setSelectedPersons] = useState<string>("2");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startDate: addDays(new Date(), 14), // Default to 2 weeks from now
      persons: "2",
      fullName: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      // Calculate total price based on number of persons
      const totalPrice = tour.price * parseInt(values.persons);
      
      // Format date as string for API
      const formattedDate = format(values.startDate, "yyyy-MM-dd");
      
      await apiRequest("POST", "/api/bookings", {
        tourId: tour.id,
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        startDate: formattedDate,
        persons: parseInt(values.persons),
        totalPrice,
      });
      
      toast({
        title: "Réservation réussie",
        description: "Votre demande a été envoyée avec succès. Nous vous contacterons bientôt pour confirmer votre réservation.",
      });
      form.reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la réservation. Veuillez réessayer.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate total price based on number of persons
  const calculateTotalPrice = () => {
    const persons = parseInt(selectedPersons || "2");
    return tour.price * persons;
  };

  return (
    <Card className="sticky top-20">
      <CardContent className="p-6">
        <h3 className="text-xl font-heading font-semibold mb-6">Réserver ce circuit</h3>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date de départ</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP", { locale: fr })
                          ) : (
                            <span>Choisissez une date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="persons"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de personnes</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedPersons(value);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez le nombre" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">1 personne</SelectItem>
                      <SelectItem value="2">2 personnes</SelectItem>
                      <SelectItem value="3">3 personnes</SelectItem>
                      <SelectItem value="4">4 personnes</SelectItem>
                      <SelectItem value="5">5 personnes</SelectItem>
                      <SelectItem value="6">6 personnes</SelectItem>
                      <SelectItem value="7">7+ personnes</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700">Prix par personne:</span>
                <span className="font-semibold">{tour.price} MAD</span>
              </div>
              <div className="flex justify-between items-center text-primary">
                <span className="font-semibold">Prix total:</span>
                <span className="font-bold text-lg">{calculateTotalPrice()} MAD</span>
              </div>
            </div>

            <FormField
              control={form.control}
              name="fullName"
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
                    <Input placeholder="Votre adresse email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Traitement en cours..." : "Réserver maintenant"}
            </Button>
          </form>
        </Form>
      </CardContent>
      
      <CardFooter className="bg-gray-50 p-4 text-xs text-gray-500 rounded-b-xl">
        <p>
          En soumettant ce formulaire, vous acceptez nos{" "}
          <a href="/terms" className="text-primary hover:underline">
            conditions générales
          </a>{" "}
          et notre{" "}
          <a href="/privacy" className="text-primary hover:underline">
            politique de confidentialité
          </a>
          .
        </p>
      </CardFooter>
    </Card>
  );
};

export default BookingForm;
