import { Link } from "wouter";
import { Tour } from "@shared/schema";
import { StarIcon, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TourCardProps {
  tour: Tour;
}

const TourCard = ({ tour }: TourCardProps) => {
  return (
    <Link href={`/tours/${tour.id}`}>
      <a className="tour-card bg-white rounded-xl overflow-hidden shadow-md transition-all duration-300 block">
        <div className="relative">
          <img
            src={tour.imageUrl}
            alt={tour.title}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 text-sm font-semibold text-primary">
            {tour.duration} jours
          </div>
        </div>
        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-heading font-semibold text-lg">{tour.title}</h3>
            <div className="flex items-center">
              <StarIcon className="h-4 w-4 text-accent fill-current" />
              <span className="ml-1 text-sm">
                {tour.rating.toFixed(1)} ({tour.reviewCount})
              </span>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-4">{tour.shortDescription}</p>
          <div className="flex items-center mb-4">
            <MapPin className="h-4 w-4 text-primary mr-2" />
            <span className="text-sm text-gray-600">{tour.locations}</span>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <span className="text-xs text-gray-500">À partir de</span>
              <p className="text-lg font-semibold">{tour.price} MAD</p>
            </div>
            <Button
              variant="default"
              size="sm"
              className="text-sm"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = `/tours/${tour.id}`;
              }}
            >
              En savoir plus
            </Button>
          </div>
        </div>
      </a>
    </Link>
  );
};

export default TourCard;
