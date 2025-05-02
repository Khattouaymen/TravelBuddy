import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";

interface TourPlanDay {
  day: number;
  title: string;
  description: string;
}

interface TourPlanProps {
  tourPlan: TourPlanDay[] | null;
}

const TourPlan = ({ tourPlan }: TourPlanProps) => {
  if (!tourPlan || tourPlan.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Aucun itinéraire disponible pour ce circuit.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-heading font-semibold mb-4">Plan du circuit</h3>
      
      <div className="space-y-4">
        {tourPlan.map((day) => (
          <Card key={day.day} className="border-l-4 border-primary">
            <CardContent className="p-4">
              <div className="flex items-center mb-2">
                <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
                  <Calendar className="h-4 w-4" />
                </div>
                <h4 className="font-heading font-semibold">
                  Jour {day.day}: {day.title}
                </h4>
              </div>
              <p className="text-gray-600 pl-11">{day.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TourPlan;
