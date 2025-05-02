import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Tour } from "@shared/schema";
import TourDetails from "@/components/tours/TourDetails";

const TourPage = () => {
  const [match, params] = useRoute<{ id: string }>("/tours/:id");
  const tourId = parseInt(params?.id || "0");
  
  const { data: tour, isLoading, isError } = useQuery<Tour>({
    queryKey: [`/api/tours/${tourId}`],
    enabled: !!tourId,
  });
  
  if (!match) {
    return null;
  }
  
  if (isError) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-heading font-bold mb-4">Circuit non trouvé</h1>
        <p className="text-gray-600 mb-8">
          Le circuit que vous recherchez n'existe pas ou n'est plus disponible.
        </p>
      </div>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>
          {isLoading
            ? "Chargement du circuit..."
            : tour
            ? `${tour.title} | Maroc Voyages`
            : "Circuit non trouvé | Maroc Voyages"}
        </title>
        <meta
          name="description"
          content={
            tour?.shortDescription ||
            "Découvrez ce circuit unique au Maroc et réservez votre voyage dès maintenant."
          }
        />
      </Helmet>
      
      <TourDetails tourId={tourId} />
    </>
  );
};

export default TourPage;
