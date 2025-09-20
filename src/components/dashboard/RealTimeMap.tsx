import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, Zap } from "lucide-react";
import { Loader } from "@googlemaps/js-api-loader";

interface Intersection {
  id: string;
  name: string;
  coordinates: { lat: number; lng: number };
  currentLight: 'red' | 'yellow' | 'green';
  vehicleCount: number;
  waitingTime: number;
  queueLength: number;
  status: 'online' | 'offline' | 'warning';
}

interface RealTimeMapProps {
  selectedIntersection: string | null;
  onIntersectionSelect: (id: string) => void;
}

const RealTimeMap = ({ selectedIntersection, onIntersectionSelect }: RealTimeMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<{ [key: string]: google.maps.Marker }>({});
  
  const [intersections, setIntersections] = useState<Intersection[]>([
    {
      id: "INT001",
      name: "Main St & 1st Ave",
      coordinates: { lat: 40.7128, lng: -74.0060 },
      currentLight: 'green',
      vehicleCount: 12,
      waitingTime: 45,
      queueLength: 8,
      status: 'online'
    },
    {
      id: "INT002", 
      name: "Broadway & 42nd St",
      coordinates: { lat: 40.7589, lng: -73.9851 },
      currentLight: 'red',
      vehicleCount: 28,
      waitingTime: 120,
      queueLength: 15,
      status: 'online'
    },
    {
      id: "INT003",
      name: "5th Ave & Central Park",
      coordinates: { lat: 40.7831, lng: -73.9712 },
      currentLight: 'yellow',
      vehicleCount: 19,
      waitingTime: 78,
      queueLength: 11,
      status: 'warning'
    },
    {
      id: "INT004",
      name: "Wall St & Water St", 
      coordinates: { lat: 40.7074, lng: -74.0113 },
      currentLight: 'green',
      vehicleCount: 7,
      waitingTime: 30,
      queueLength: 4,
      status: 'offline'
    }
  ]);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    const loader = new Loader({
      apiKey: "AIzaSyBDVT7M3_ELUeQmQdL7QfJx_1H8kVw4-kU", // Demo key - replace with your own
      version: "weekly",
      libraries: ["places"]
    });

    loader.load().then(() => {
      if (!mapContainer.current) return;
      
      map.current = new google.maps.Map(mapContainer.current, {
        center: { lat: 40.7128, lng: -74.0060 }, // NYC coordinates
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: [
          {
            featureType: "all",
            elementType: "geometry.fill",
            stylers: [{ color: "#f5f5f5" }]
          },
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#c9c9c9" }]
          }
        ]
      });
    }).catch(e => {
      console.error("Error loading Google Maps:", e);
      // Fallback: show static map image
      if (mapContainer.current) {
        mapContainer.current.innerHTML = `
          <div class="w-full h-full bg-muted rounded-lg flex items-center justify-center">
            <div class="text-center">
              <MapPin class="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
              <p class="text-muted-foreground">Map unavailable</p>
              <p class="text-xs text-muted-foreground">Please add your Google Maps API key</p>
            </div>
          </div>
        `;
      }
    });

    return () => {
      // Google Maps cleanup is handled automatically
    };
  }, []);

  // Add/update markers
  useEffect(() => {
    if (!map.current || typeof google === 'undefined') return;

    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => marker.setMap(null));
    markersRef.current = {};

    intersections.forEach((intersection) => {
      const lightColor = intersection.currentLight === 'red' ? '#ef4444' : 
                        intersection.currentLight === 'yellow' ? '#f59e0b' : '#22c55e';
      
      // Create custom marker icon
      const markerIcon = {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: lightColor,
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 2,
        scale: 12,
      };

      const marker = new google.maps.Marker({
        position: { lat: intersection.coordinates.lat, lng: intersection.coordinates.lng },
        map: map.current,
        icon: markerIcon,
        title: intersection.name
      });

      // Add click event
      marker.addListener('click', () => {
        onIntersectionSelect(intersection.id);
      });

      // Add info window
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div class="p-2">
            <h3 class="font-semibold text-gray-900">${intersection.name}</h3>
            <p class="text-sm text-gray-600">Vehicles: ${intersection.vehicleCount}</p>
            <p class="text-sm text-gray-600">Wait Time: ${intersection.waitingTime}s</p>
            <p class="text-sm text-gray-600">Queue: ${intersection.queueLength}</p>
            <div class="mt-1">
              <span class="inline-block w-3 h-3 rounded-full" style="background-color: ${lightColor}"></span>
              <span class="text-xs text-gray-500 ml-1">${intersection.currentLight.toUpperCase()}</span>
            </div>
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(map.current, marker);
      });

      markersRef.current[intersection.id] = marker;
    });
  }, [intersections, onIntersectionSelect]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setIntersections(prev => prev.map(intersection => {
        const lightCycle = ['green', 'yellow', 'red'] as const;
        const currentIndex = lightCycle.indexOf(intersection.currentLight);
        const shouldChangeLight = Math.random() > 0.85;
        
        return {
          ...intersection,
          currentLight: shouldChangeLight 
            ? lightCycle[(currentIndex + 1) % lightCycle.length]
            : intersection.currentLight,
          vehicleCount: Math.max(0, intersection.vehicleCount + Math.floor(Math.random() * 6) - 3),
          waitingTime: Math.max(0, intersection.waitingTime + Math.floor(Math.random() * 20) - 10),
          queueLength: Math.max(0, intersection.queueLength + Math.floor(Math.random() * 4) - 2)
        };
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getLightColorClass = (light: string) => {
    switch (light) {
      case 'red': return 'traffic-light-red';
      case 'yellow': return 'traffic-light-yellow';
      case 'green': return 'traffic-light-green';
      default: return 'bg-muted';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'default';
      case 'warning': return 'secondary';
      case 'offline': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <Card className="bg-dashboard-panel panel-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Navigation className="w-5 h-5 text-primary" />
            <span>Real-Time Traffic Control Map</span>
          </CardTitle>
          <Badge variant="secondary" className="flex items-center space-x-1">
            <Zap className="w-3 h-3" />
            <span>Live</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* Map Container */}
        <div className="rounded-lg overflow-hidden h-96 relative">
          <div ref={mapContainer} className="w-full h-full" />
        </div>

        {/* Selected Intersection Details */}
        {selectedIntersection && (
          <div className="mt-4 p-4 bg-secondary/20 rounded-lg border">
            {(() => {
              const selected = intersections.find(i => i.id === selectedIntersection);
              if (!selected) return null;
              
              return (
                <div>
                  <h4 className="font-semibold mb-3 text-foreground">{selected.name}</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Current Signal</div>
                      <div className={`inline-block w-4 h-4 rounded-full ${getLightColorClass(selected.currentLight)} mt-1`}></div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Vehicles</div>
                      <div className="text-lg font-bold text-foreground">{selected.vehicleCount}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Wait Time</div>
                      <div className="text-lg font-bold text-foreground">{selected.waitingTime}s</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Queue Length</div>
                      <div className="text-lg font-bold text-foreground">{selected.queueLength}</div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RealTimeMap;