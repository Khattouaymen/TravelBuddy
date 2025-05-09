import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { CheckCircle } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  fullName: z.string().min(3, "Le nom complet est requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(8, "Le numéro de téléphone est requis"), // Nouveau champ pour le téléphone
  destination: z.string().min(1, "La destination est requise"),
  budget: z.string().min(1, "Le budget est requis"),
  departureDate: z.string().min(1, "La date de départ est requise"),
  persons: z.string().min(1, "Le nombre de voyageurs est requis"),
  durationDays: z.string().min(1, "La durée du voyage est requise"), // Nouveau champ
  interests: z.string().optional(),
  additionalDetails: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const CustomTravelRequest = () => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [interestsArray, setInterestsArray] = useState<string[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "", // Nouvelle valeur par défaut
      destination: "",
      budget: "",
      departureDate: "",
      persons: "",
      durationDays: "", // Nouvelle valeur par défaut
      interests: "",
      additionalDetails: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setSubmitting(true);
    try {
      // Set interests as comma-separated string
      data.interests = interestsArray.join(",");
      
      // Convertir les valeurs en formats appropriés pour le serveur
      let durationValue = 0;
      switch(data.durationDays) {
        case "1-3": durationValue = 3; break;
        case "4-7": durationValue = 7; break; 
        case "8-14": durationValue = 14; break;
        case "15-21": durationValue = 21; break;
        case "22+": durationValue = 30; break;
        default: durationValue = 7; // Valeur par défaut
      }
      
      // Créer l'objet de données à envoyer avec tous les champs, y compris durationDays
      const dataToSend = {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone, // Inclure le champ téléphone
        destination: data.destination,
        budget: data.budget,
        departureDate: data.departureDate,
        persons: parseInt(data.persons) || 5, // Si '5+' ou non numérique, utiliser 5
        durationDays: durationValue, // Maintenant nous incluons durationDays
        interests: data.interests,
        additionalDetails: data.additionalDetails
      };

      console.log("Données envoyées:", dataToSend);
      await apiRequest("POST", "/api/custom-requests", dataToSend);
      toast({
        title: "Demande envoyée",
        description: "Nous vous contacterons bientôt avec une proposition personnalisée.",
      });
      form.reset();
      setInterestsArray([]);
    } catch (error) {
      console.error("Erreur de soumission:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de votre demande.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const toggleInterest = (value: string) => {
    setInterestsArray((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  return (
    <section className="py-16 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-heading font-bold text-white mb-4">
              Créez votre voyage sur mesure
            </h2>
            <p className="text-gray-200 mb-6">
              Vous avez une idée spécifique en tête ? Dites-nous ce que vous recherchez,
              et nos experts vous prépareront un circuit personnalisé qui correspond
              exactement à vos envies.
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center text-gray-200">
                <CheckCircle className="h-5 w-5 text-accent mr-2" />
                <span>Itinéraires personnalisés selon vos centres d'intérêt</span>
              </li>
              <li className="flex items-center text-gray-200">
                <CheckCircle className="h-5 w-5 text-accent mr-2" />
                <span>Adaptation à votre budget et à vos contraintes de temps</span>
              </li>
              <li className="flex items-center text-gray-200">
                <CheckCircle className="h-5 w-5 text-accent mr-2" />
                <span>Conseils d'experts locaux pour des expériences authentiques</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-heading font-semibold text-xl mb-4">
              Demande de voyage personnalisé
            </h3>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom complet</FormLabel>
                        <FormControl>
                          <Input placeholder="Votre nom" {...field} />
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
                          <Input placeholder="Votre email" {...field} />
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="destination"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Destination souhaitée</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Marrakech, Désert..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="budget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Budget par personne (MAD)</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez votre budget" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Moins de 1000 MAD">Moins de 1000 MAD</SelectItem>
                            <SelectItem value="1000 - 2000 MAD">1000 - 2000 MAD</SelectItem>
                            <SelectItem value="2000 - 3000 MAD">2000 - 3000 MAD</SelectItem>
                            <SelectItem value="Plus de 3000 MAD">Plus de 3000 MAD</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="departureDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date de départ</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="persons"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre de voyageurs</FormLabel>
                        <Select
                          onValueChange={field.onChange}
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
                            <SelectItem value="5+">5+ personnes</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="durationDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Durée souhaitée du voyage</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez le nombre de jours" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1-3">Week-end (1-3 jours)</SelectItem>
                          <SelectItem value="4-7">Court séjour (4-7 jours)</SelectItem>
                          <SelectItem value="8-14">1-2 semaines</SelectItem>
                          <SelectItem value="15-21">2-3 semaines</SelectItem>
                          <SelectItem value="22+">Plus de 3 semaines</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormItem>
                  <FormLabel>Centres d'intérêt</FormLabel>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="culture" 
                        checked={interestsArray.includes("Culture")}
                        onCheckedChange={() => toggleInterest("Culture")}
                      />
                      <label htmlFor="culture" className="text-sm">Culture</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="aventure" 
                        checked={interestsArray.includes("Aventure")}
                        onCheckedChange={() => toggleInterest("Aventure")}
                      />
                      <label htmlFor="aventure" className="text-sm">Aventure</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="gastronomie" 
                        checked={interestsArray.includes("Gastronomie")}
                        onCheckedChange={() => toggleInterest("Gastronomie")}
                      />
                      <label htmlFor="gastronomie" className="text-sm">Gastronomie</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="detente" 
                        checked={interestsArray.includes("Détente")}
                        onCheckedChange={() => toggleInterest("Détente")}
                      />
                      <label htmlFor="detente" className="text-sm">Détente</label>
                    </div>
                  </div>
                </FormItem>

                <FormField
                  control={form.control}
                  name="additionalDetails"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Détails supplémentaires</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Précisez vos attentes, préférences, etc."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? "Envoi en cours..." : "Envoyer ma demande"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomTravelRequest;
