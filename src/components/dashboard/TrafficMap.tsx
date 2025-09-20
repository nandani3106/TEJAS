import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, Zap } from "lucide-react";

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

interface TrafficMapProps {
  selectedIntersection: string | null;
  onIntersectionSelect: (id: string) => void;
}

const TrafficMap = ({ selectedIntersection, onIntersectionSelect }: TrafficMapProps) => {
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

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setIntersections(prev => prev.map(intersection => {
        const lightCycle = ['green', 'yellow', 'red'] as const;
        const currentIndex = lightCycle.indexOf(intersection.currentLight);
        const shouldChangeLight = Math.random() > 0.7;
        
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
    }, 2000);

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
            <span>Real-Time Intersection Map</span>
          </CardTitle>
          <Badge variant="secondary" className="flex items-center space-x-1">
            <Zap className="w-3 h-3" />
            <span>Live</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* Map Container - Simulated with grid layout */}
        <div className="bg-secondary/20 rounded-lg p-6 h-96 relative overflow-hidden">
          {/* Background grid pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="grid grid-cols-8 grid-rows-6 h-full w-full">
              {Array.from({ length: 48 }).map((_, i) => (
                <div key={i} className="border border-muted"></div>
              ))}
            </div>
          </div>

          {/* Intersection Points */}
          {intersections.map((intersection, index) => (
            <Button
              key={intersection.id}
              variant={selectedIntersection === intersection.id ? "default" : "ghost"}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 p-3 h-auto flex-col space-y-1 ${
                selectedIntersection === intersection.id ? 'glow-shadow' : ''
              }`}
              style={{
                left: `${20 + index * 20}%`,
                top: `${30 + (index % 2) * 25}%`
              }}
              onClick={() => onIntersectionSelect(intersection.id)}
            >
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${getLightColorClass(intersection.currentLight)} animate-pulse-slow`}></div>
                <MapPin className="w-4 h-4" />
              </div>
              <div className="text-xs font-medium">{intersection.name}</div>
              <div className="flex space-x-2 text-xs">
                <Badge variant={getStatusColor(intersection.status)} className="text-xs px-1">
                  {intersection.vehicleCount}
                </Badge>
                <span className="text-muted-foreground">{intersection.waitingTime}s</span>
              </div>
            </Button>
          ))}
        </div>

        {/* Selected Intersection Details */}
        {selectedIntersection && (
          <div className="mt-4 p-4 bg-secondary/20 rounded-lg">
            {(() => {
              const selected = intersections.find(i => i.id === selectedIntersection);
              if (!selected) return null;
              
              return (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Current Light</div>
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
              );
            })()}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TrafficMap;