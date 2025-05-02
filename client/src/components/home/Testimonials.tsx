import { useQuery } from "@tanstack/react-query";
import { Testimonial } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { StarIcon } from "lucide-react";

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
          <img
            src={testimonial.avatar}
            alt={testimonial.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h3 className="font-heading font-semibold">{testimonial.name}</h3>
          <p className="text-sm text-gray-600">{testimonial.country}</p>
        </div>
      </div>
      <div className="flex text-accent mb-3">
        {[...Array(5)].map((_, i) => (
          <StarIcon
            key={i}
            className={`w-4 h-4 ${
              i < testimonial.rating ? "fill-current" : "stroke-current fill-none"
            }`}
          />
        ))}
      </div>
      <p className="text-gray-600">{testimonial.comment}</p>
    </div>
  );
};

const TestimonialSkeleton = () => (
  <div className="bg-white p-6 rounded-xl shadow-md">
    <div className="flex items-center mb-4">
      <Skeleton className="w-12 h-12 rounded-full mr-4" />
      <div>
        <Skeleton className="h-5 w-24 mb-1" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
    <Skeleton className="h-4 w-24 mb-3" />
    <Skeleton className="h-4 w-full mb-2" />
    <Skeleton className="h-4 w-full mb-2" />
    <Skeleton className="h-4 w-4/5" />
  </div>
);

const Testimonials = () => {
  const { data: testimonials, isLoading } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials"],
  });

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-heading font-bold text-center mb-4">
          Ce que disent nos voyageurs
        </h2>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
          Découvrez les expériences authentiques vécues par nos clients lors de
          leurs voyages au Maroc.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? Array(3)
                .fill(0)
                .map((_, index) => <TestimonialSkeleton key={index} />)
            : testimonials?.map((testimonial) => (
                <TestimonialCard
                  key={testimonial.id}
                  testimonial={testimonial}
                />
              ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
