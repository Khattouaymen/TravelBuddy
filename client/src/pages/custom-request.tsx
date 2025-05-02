import { Helmet } from "react-helmet";
import CustomTravelRequest from "@/components/home/CustomTravelRequest";

const CustomRequestPage = () => {
  return (
    <>
      <Helmet>
        <title>Créez votre voyage sur mesure | Maroc Voyages</title>
        <meta
          name="description"
          content="Demandez un voyage personnalisé selon vos préférences. Nos experts vous proposeront un itinéraire adapté à vos envies pour découvrir le Maroc."
        />
      </Helmet>
      
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl font-heading font-bold mb-4">
              Créez votre voyage sur mesure
            </h1>
            <p className="text-gray-600">
              Vous avez une idée de voyage qui vous tient à cœur ? Nos experts en destination
              vous aideront à concevoir l'itinéraire parfait qui correspond à vos attentes.
            </p>
          </div>
        </div>
      </div>
      
      <CustomTravelRequest />
      
      <div className="py-16 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="text-primary w-8 h-8"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>
            <h3 className="font-heading font-semibold text-xl mb-2">Expertise locale</h3>
            <p className="text-gray-600">Nos conseillers sont des experts du Maroc et connaissent parfaitement les meilleures expériences selon vos envies.</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="text-primary w-8 h-8"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <h3 className="font-heading font-semibold text-xl mb-2">Disponibilité garantie</h3>
            <p className="text-gray-600">Nous vérifions la disponibilité en temps réel pour assurer que votre voyage se déroule comme prévu.</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="text-primary w-8 h-8"
              >
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <h3 className="font-heading font-semibold text-xl mb-2">Expériences uniques</h3>
            <p className="text-gray-600">Nous intégrons à votre voyage des moments exceptionnels et authentiques hors des sentiers battus.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomRequestPage;
