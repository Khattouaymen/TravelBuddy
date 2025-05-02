import { useQuery } from "@tanstack/react-query";
import { Tour } from "@shared/schema";
import TourCard from "./TourCard";
import { Skeleton } from "@/components/ui/skeleton";

interface RelatedToursProps {
  currentTourId: number;
}

const RelatedTours = ({ currentTourId }: RelatedToursProps) => {
  const { data: tours, isLoading } = useQuery<Tour[]>({
    queryKey: ["/api/tours"],
  });

  if (isLoading) {
    return (
      <div className="mt-12">
        <h3 className="text-2xl font-heading font-semibold mb-6">Vous pourriez aussi aimer</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[0, 1].map((index) => (
            <div key={index} className="bg-white rounded-xl overflow-hidden shadow-md">
              <Skeleton className="h-48 w-full" />
              <div className="p-5">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-6 w-1/4" />
                  <Skeleton className="h-8 w-1/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!tours || tours.length <= 1) {
    return null;
  }

  // Filter out the current tour and get up to 2 other tours
  const relatedTours = tours
    .filter((tour) => tour.id !== currentTourId)
    .slice(0, 2);

  if (relatedTours.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-heading font-semibold mb-6">Vous pourriez aussi aimer</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {relatedTours.map((tour) => (
          <TourCard key={tour.id} tour={tour} />
        ))}
      </div>
    </div>
  );
};

export default RelatedTours;
