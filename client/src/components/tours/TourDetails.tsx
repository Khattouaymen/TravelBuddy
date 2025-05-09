import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tour } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { StarIcon, Calendar, Users, MapPin, Clock } from "lucide-react";
import TourPlan from "./TourPlan";
import TourMap from "./TourMap";
import BookingForm from "./BookingForm";
import RelatedTours from "./RelatedTours";

interface TourDetailsProps {
  tourId: number;
}

const TourDetails = ({ tourId }: TourDetailsProps) => {
  const [activeTab, setActiveTab] = useState("description");

  const { data: tour, isLoading } = useQuery<Tour>({
    queryKey: [`/api/tours/${tourId}`],
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Skeleton className="h-80 w-full rounded-xl mb-6" />
            <Skeleton className="h-10 w-48 mb-4" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-3/4 mb-6" />
            
            <Skeleton className="h-10 w-full mb-6" />
            
            <Skeleton className="h-80 w-full" />
          </div>
          
          <div>
            <Skeleton className="h-[500px] w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-heading font-semibold mb-4">Circuit non trouvé</h2>
        <p className="text-gray-600 mb-8">Le circuit que vous recherchez n'existe pas ou a été supprimé.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Tour image and basic info */}
          <div className="relative rounded-xl overflow-hidden mb-6">
            <img
              src={tour.imageUrl}
              alt={tour.title}
              className="w-full h-[400px] object-cover"
            />
            <div className="absolute top-4 right-4 bg-white rounded-full px-4 py-2 text-primary font-semibold">
              {tour.duration} jours
            </div>
          </div>

          {/* Tour title and rating */}
          <div className="mb-6">
            <div className="flex justify-between items-start mb-2 flex-wrap gap-4">
              <h1 className="text-3xl font-heading font-bold">{tour.title}</h1>
              <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                <StarIcon className="h-5 w-5 text-accent fill-current" />
                <span className="ml-1 font-medium">
                  {tour.rating.toFixed(1)} ({tour.reviewCount} avis)
                </span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 text-gray-600 mb-4">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-primary mr-1" />
                <span>{tour.locations}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-primary mr-1" />
                <span>{tour.duration} jours</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-primary mr-1" />
                <span>Disponible toute l'année</span>
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 text-primary mr-1" />
                <span>Min. 2 personnes</span>
              </div>
            </div>
            
            <p className="text-2xl font-semibold text-primary">
              {tour.discountPrice ? (
                <>
                  <span className="text-2xl font-semibold text-primary">{tour.discountPrice} MAD</span>
                  <span className="text-lg line-through text-gray-500 ml-2">{tour.price} MAD</span>
                </>
              ) : (
                <>{tour.price} MAD</>
              )}
              <span className="text-sm text-gray-500"> / personne</span>
            </p>
          </div>

          {/* Tabs for tour details */}
          <Tabs defaultValue="description" value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="itinerary">Itinéraire</TabsTrigger>
              <TabsTrigger value="map">Carte</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-6">
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-line">{tour.description}</p>
              </div>
            </TabsContent>
            
            <TabsContent value="itinerary" className="mt-6">
              <TourPlan tourPlan={tour.tourPlan} />
            </TabsContent>
            
            <TabsContent value="map" className="mt-6">
              <TourMap mapPoints={tour.mapPoints} />
            </TabsContent>
          </Tabs>

          {/* Related tours */}
          <RelatedTours currentTourId={tour.id} />
        </div>

        {/* Booking form sidebar */}
        <div>
          <BookingForm tour={tour} />
        </div>
      </div>
    </div>
  );
};

export default TourDetails;
