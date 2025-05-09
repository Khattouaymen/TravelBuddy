import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Category } from "@shared/schema";
import './hero.css';

const Hero = () => {
  const [searchParams, setSearchParams] = useState({
    destination: "",
    date: "",
    travelers: "1",
  });

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const backgroundImages = [
    "https://darkgray-falcon-959539.hostingersite.com/wp-content/uploads/2025/02/pexels-al-creation-studio-188975817-11344766-scaled.jpg",
    "https://darkgray-falcon-959539.hostingersite.com/wp-content/uploads/2025/02/pexels-naimbic-2610819-scaled.jpg",
    "https://darkgray-falcon-959539.hostingersite.com/wp-content/uploads/2025/02/hans-jurgen-weinhardt-xijil3cOsis-unsplash-scaled.jpg",
    "https://darkgray-falcon-959539.hostingersite.com/wp-content/uploads/2025/02/selina-bubendorfer-FP9g9fNk9zA-unsplash-scaled.jpg"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 8000); // Change image every 8 seconds

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    const queryParams = new URLSearchParams();

    if (searchParams.destination) {
      queryParams.append("destination", searchParams.destination);
    }

    if (searchParams.date) {
      queryParams.append("date", searchParams.date);
    }

    if (searchParams.travelers) {
      queryParams.append("travelers", searchParams.travelers);
    }

    window.location.href = `/tours?${queryParams.toString()}`;
  };

  return (
    <section className="relative bg-secondary overflow-hidden h-screen max-h-[800px]">
      <div className="absolute inset-0">
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className={`slideshow-image ${currentImageIndex === index ? "active" : ""}`}
            style={{ backgroundImage: `url('${image}')` }}
          ></div>
        ))}
      </div>

      <div className="absolute inset-0 bg-black bg-opacity-35"></div>

      <div className="relative container mx-auto px-4 py-24">
        <div className="max-w-xl">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4 drop-shadow-lg">
            Découvrez les trésors cachés du Maroc
          </h1>
          <p className="text-lg text-white mb-8 drop-shadow-lg">
            Voyages sur mesure, expériences authentiques et souvenirs inoubliables
          </p>
          <Card className="p-6 rounded-lg shadow-xl backdrop-blur-sm bg-white/95">
            <CardContent className="p-0">
              <h2 className="text-xl font-heading font-semibold mb-4">
                Trouvez votre prochaine aventure
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="destination" className="block text-sm font-medium mb-1">
                    Destination
                  </Label>
                  <Select
                    value={searchParams.destination}
                    onValueChange={(value) => handleSelectChange("destination", value)}
                  >
                    <SelectTrigger id="destination">
                      <SelectValue placeholder="Toutes les destinations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-destinations">Toutes les destinations</SelectItem>
                      {categories?.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="date" className="block text-sm font-medium mb-1">
                    Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    name="date"
                    value={searchParams.date}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="travelers" className="block text-sm font-medium mb-1">
                    Voyageurs
                  </Label>
                  <Select
                    value={searchParams.travelers}
                    onValueChange={(value) => handleSelectChange("travelers", value)}
                  >
                    <SelectTrigger id="travelers">
                      <SelectValue placeholder="Nombre de voyageurs" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Personne</SelectItem>
                      <SelectItem value="2">2 Personnes</SelectItem>
                      <SelectItem value="3">3 Personnes</SelectItem>
                      <SelectItem value="4">4 Personnes</SelectItem>
                      <SelectItem value="5+">5+ Personnes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button
                className="w-full mt-4"
                onClick={handleSearch}
              >
                Rechercher
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Hero;
