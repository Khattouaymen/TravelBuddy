import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapPoint {
  lat: number;
  lng: number;
  title: string;
}

interface TourMapProps {
  mapPoints: MapPoint[] | null;
}

const TourMap = ({ mapPoints }: TourMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapPoints || mapPoints.length === 0 || !mapRef.current) {
      return;
    }

    // If the map instance doesn't exist, create it
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView([31.7917, -7.0926], 6);
      
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstanceRef.current);
    } else {
      // Clear existing markers
      mapInstanceRef.current.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          mapInstanceRef.current?.removeLayer(layer);
        }
      });
    }

    // Add markers for each point
    const markers: L.Marker[] = [];
    mapPoints.forEach((point) => {
      const marker = L.marker([point.lat, point.lng])
        .addTo(mapInstanceRef.current!)
        .bindPopup(point.title);
      markers.push(marker);
    });

    // Create a polyline connecting the points if there are multiple points
    if (mapPoints.length > 1) {
      const points = mapPoints.map((point) => [point.lat, point.lng] as [number, number]);
      L.polyline(points, { color: "#E56B6F", weight: 3 }).addTo(mapInstanceRef.current);
    }

    // Fit the map to show all markers
    if (markers.length > 0) {
      const group = L.featureGroup(markers);
      mapInstanceRef.current.fitBounds(group.getBounds(), {
        padding: [30, 30],
      });
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mapPoints]);

  if (!mapPoints || mapPoints.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Aucune carte disponible pour ce circuit.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-heading font-semibold">Carte du circuit</h3>
      <div
        ref={mapRef}
        className="h-[400px] w-full rounded-xl border"
        aria-label="Carte du circuit"
      />
      <div className="space-y-2 mt-4">
        <h4 className="font-heading font-medium">Points d'intérêt:</h4>
        <ul className="list-disc list-inside">
          {mapPoints.map((point, index) => (
            <li key={index} className="text-gray-700">{point.title}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TourMap;
