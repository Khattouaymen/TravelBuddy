import { Search, Calendar, Briefcase } from "lucide-react";

const steps = [
  {
    icon: <Search className="text-primary text-xl" />,
    title: "Choisissez votre destination",
    description:
      "Explorez notre sélection de circuits organisés ou créez votre voyage personnalisé.",
  },
  {
    icon: <Calendar className="text-primary text-xl" />,
    title: "Réservez vos dates",
    description:
      "Sélectionnez vos dates préférées et le nombre de voyageurs pour obtenir un devis instantané.",
  },
  {
    icon: <Briefcase className="text-primary text-xl" />,
    title: "Préparez-vous à l'aventure",
    description:
      "Recevez votre itinéraire détaillé et préparez-vous pour une expérience inoubliable.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-16 container mx-auto px-4">
      <h2 className="text-3xl font-heading font-bold text-center mb-4">
        Comment ça marche
      </h2>
      <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
        Planifier votre voyage au Maroc n'a jamais été aussi simple. Suivez ces
        étapes pour créer votre aventure parfaite.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step, index) => (
          <div key={index} className="text-center">
            <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
              {step.icon}
            </div>
            <h3 className="font-heading font-semibold text-xl mb-2">{step.title}</h3>
            <p className="text-gray-600">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
