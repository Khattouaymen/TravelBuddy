import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Category, InsertTour, Tour } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { PlusCircle, X, Save, Trash2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Define a schema for TourPlan day
const tourPlanDaySchema = z.object({
  day: z.number().min(1, "Le jour est requis"),
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().min(1, "La description est requise"),
});

// Define a schema for MapPoint
const mapPointSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  title: z.string().min(1, "Le titre est requis"),
});

// Extended schema for tour form
const tourFormSchema = z.object({
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
  shortDescription: z.string().min(10, "La description courte doit contenir au moins 10 caractères"),
  imageUrl: z.string().url("URL d'image invalide"),
  duration: z.number().min(1, "La durée doit être d'au moins 1 jour"),
  price: z.number().min(1, "Le prix doit être d'au moins 1 MAD"),
  discountPrice: z.number().nullable().default(null),
  locations: z.string().min(3, "Les lieux doivent être spécifiés"),
  featured: z.boolean().default(false),
  categoryId: z.number().nullable().default(null),
});

interface TourFormProps {
  tour?: Tour;
  onSuccess: () => void;
}

const TourForm = ({ tour, onSuccess }: TourFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tourPlan, setTourPlan] = useState<{ day: number; title: string; description: string }[]>(
    tour?.tourPlan ? (tour.tourPlan as any) : []
  );
  const [mapPoints, setMapPoints] = useState<{ lat: number; lng: number; title: string }[]>(
    tour?.mapPoints ? (tour.mapPoints as any) : []
  );

  // Fetch categories for the select input
  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const form = useForm<z.infer<typeof tourFormSchema>>({
    resolver: zodResolver(tourFormSchema),
    defaultValues: {
      title: tour?.title || "",
      description: tour?.description || "",
      shortDescription: tour?.shortDescription || "",
      imageUrl: tour?.imageUrl || "",
      duration: tour?.duration || 1,
      price: tour?.price || 1000,
      discountPrice: tour?.discountPrice || null,
      locations: tour?.locations || "",
      featured: tour?.featured || false,
      categoryId: tour?.categoryId || null,
    },
  });

  // Add a day to tour plan
  const addTourPlanDay = () => {
    const newDay = {
      day: tourPlan.length + 1,
      title: "",
      description: "",
    };
    setTourPlan([...tourPlan, newDay]);
  };

  // Remove a day from tour plan
  const removeTourPlanDay = (index: number) => {
    const updatedPlan = [...tourPlan];
    updatedPlan.splice(index, 1);
    // Reorder days
    updatedPlan.forEach((day, idx) => {
      day.day = idx + 1;
    });
    setTourPlan(updatedPlan);
  };

  // Update a day in tour plan
  const updateTourPlanDay = (
    index: number,
    field: keyof typeof tourPlanDaySchema.shape,
    value: any
  ) => {
    const updatedPlan = [...tourPlan];
    updatedPlan[index][field] = value;
    setTourPlan(updatedPlan);
  };

  // Add a map point
  const addMapPoint = () => {
    const newPoint = {
      lat: 31.7917, // Default to Morocco
      lng: -7.0926, // Default to Morocco
      title: "",
    };
    setMapPoints([...mapPoints, newPoint]);
  };

  // Remove a map point
  const removeMapPoint = (index: number) => {
    const updatedPoints = [...mapPoints];
    updatedPoints.splice(index, 1);
    setMapPoints(updatedPoints);
  };

  // Update a map point
  const updateMapPoint = (
    index: number,
    field: keyof typeof mapPointSchema.shape,
    value: any
  ) => {
    const updatedPoints = [...mapPoints];
    updatedPoints[index][field] = field === "lat" || field === "lng" ? parseFloat(value) : value;
    setMapPoints(updatedPoints);
  };

  const onSubmit = async (values: z.infer<typeof tourFormSchema>) => {
    try {
      setIsSubmitting(true);

      // Validate tour plan days
      let isValid = true;
      tourPlan.forEach((day) => {
        try {
          tourPlanDaySchema.parse(day);
        } catch (error) {
          isValid = false;
          toast({
            variant: "destructive",
            title: "Validation échouée",
            description: `Jour ${day.day}: Titre et description requis`,
          });
        }
      });

      // Validate map points
      mapPoints.forEach((point) => {
        try {
          mapPointSchema.parse(point);
        } catch (error) {
          isValid = false;
          toast({
            variant: "destructive",
            title: "Validation échouée",
            description: `Point de carte "${point.title}": Coordonnées et titre requis`,
          });
        }
      });

      if (!isValid) {
        setIsSubmitting(false);
        return;
      }

      // Create the full tour object with explicit boolean conversion for featured
      const tourData = {
        ...values,
        featured: values.featured === true, // Conversion explicite en booléen
        tourPlan,
        mapPoints,
      };

      console.log("Tour data being sent:", JSON.stringify(tourData, null, 2)); // Log pour débogage

      if (tour) {
        // Update existing tour
        await apiRequest("PUT", `/api/tours/${tour.id}`, tourData);
        toast({
          title: "Circuit mis à jour",
          description: "Le circuit a été mis à jour avec succès.",
        });
      } else {
        // Create new tour
        await apiRequest("POST", "/api/tours", tourData);
        toast({
          title: "Circuit créé",
          description: "Le nouveau circuit a été créé avec succès.",
        });
      }

      // Invalidate tours query to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/tours"] });
      onSuccess();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement du circuit.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Titre</FormLabel>
                <FormControl>
                  <Input placeholder="Titre du circuit" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Catégorie</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(value ? parseInt(value) : null)}
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="no-category">Aucune catégorie</SelectItem>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="shortDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description courte</FormLabel>
                <FormControl>
                  <Input placeholder="Description courte du circuit" {...field} />
                </FormControl>
                <FormDescription>
                  Cette description sera affichée sur les cartes de circuit.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL de l'image</FormLabel>
                <FormControl>
                  <Input placeholder="https://exemple.com/image.jpg" {...field} />
                </FormControl>
                <FormDescription>
                  URL d'une image représentative du circuit.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Durée (jours)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    placeholder="Nombre de jours"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prix normal (MAD)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    placeholder="Prix par personne"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="discountPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prix réduit (MAD)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    placeholder="Prix promotionnel (optionnel)"
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                  />
                </FormControl>
                <FormDescription>
                  Laissez vide s'il n'y a pas de promotion.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="locations"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lieux</FormLabel>
                <FormControl>
                  <Input placeholder="Marrakech, Essaouira, etc." {...field} />
                </FormControl>
                <FormDescription>
                  Séparés par des virgules.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="featured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Mettre en avant</FormLabel>
                  <FormDescription>
                    Ce circuit sera affiché dans la section "En vedette" sur la page d'accueil.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description détaillée</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Description détaillée du circuit..."
                  className="min-h-[200px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />

        {/* Tour Plan Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Plan du circuit</h3>
            <Button type="button" variant="outline" onClick={addTourPlanDay}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Ajouter un jour
            </Button>
          </div>

          {tourPlan.length === 0 ? (
            <p className="text-sm text-gray-500">Aucun jour défini pour ce circuit. Ajoutez des jours pour créer un itinéraire.</p>
          ) : (
            <div className="space-y-4">
              {tourPlan.map((day, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium">Jour {day.day}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTourPlanDay(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <FormLabel>Titre</FormLabel>
                        <Input
                          value={day.title}
                          onChange={(e) => updateTourPlanDay(index, "title", e.target.value)}
                          placeholder="Titre pour ce jour"
                        />
                      </div>
                      <div>
                        <FormLabel>Description</FormLabel>
                        <Textarea
                          value={day.description}
                          onChange={(e) => updateTourPlanDay(index, "description", e.target.value)}
                          placeholder="Description des activités"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <Separator />

        {/* Map Points Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Points sur la carte</h3>
            <Button type="button" variant="outline" onClick={addMapPoint}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Ajouter un point
            </Button>
          </div>

          {mapPoints.length === 0 ? (
            <p className="text-sm text-gray-500">Aucun point défini sur la carte. Ajoutez des points pour créer un trajet.</p>
          ) : (
            <div className="space-y-4">
              {mapPoints.map((point, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium">Point {index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMapPoint(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <FormLabel>Latitude</FormLabel>
                        <Input
                          type="number"
                          step="0.0001"
                          value={point.lat}
                          onChange={(e) => updateMapPoint(index, "lat", e.target.value)}
                          placeholder="Latitude"
                        />
                      </div>
                      <div>
                        <FormLabel>Longitude</FormLabel>
                        <Input
                          type="number"
                          step="0.0001"
                          value={point.lng}
                          onChange={(e) => updateMapPoint(index, "lng", e.target.value)}
                          placeholder="Longitude"
                        />
                      </div>
                      <div>
                        <FormLabel>Titre</FormLabel>
                        <Input
                          value={point.title}
                          onChange={(e) => updateMapPoint(index, "title", e.target.value)}
                          placeholder="Nom du lieu"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" type="button" onClick={onSuccess}>
            Annuler
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              "Enregistrement..."
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {tour ? "Mettre à jour" : "Créer"}
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TourForm;
