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

const Hero = () => {
  const [searchParams, setSearchParams] = useState({
    destination: "",
    date: "",
    travelers: "1",
  });
  
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
    <section className="relative bg-secondary">
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1597214815475-3e9d92689ee0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')", 
          filter: "brightness(0.6)" 
        }}
      ></div>
      <div className="relative container mx-auto px-4 py-24">
        <div className="max-w-xl">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">
            Découvrez les trésors cachés du Maroc
          </h1>
          <p className="text-lg text-white mb-8">
            Voyages sur mesure, expériences authentiques et souvenirs inoubliables
          </p>
          <Card className="p-6 rounded-lg shadow-lg">
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
                      <SelectItem value="">Toutes les destinations</SelectItem>
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
