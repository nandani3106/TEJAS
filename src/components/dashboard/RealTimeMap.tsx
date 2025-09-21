import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, Zap } from "lucide-react";
import cityMapImage from "@/assets/city-map.jpg";

interface Intersection {
  id: string;
  name: string;
  position: { x: number; y: number }; // Percentage position on the image
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
  const [intersections, setIntersections] = useState<Intersection[]>([
    {
      id: "INT001",
      name: "Main St & 1st Ave",
      position: { x: 25, y: 30 },
      currentLight: 'green',
      vehicleCount: 12,
      waitingTime: 45,
      queueLength: 8,
      status: 'online'
    },
    {
      id: "INT002", 
      name: "Broadway & 42nd St",
      position: { x: 60, y: 40 },
      currentLight: 'red',
      vehicleCount: 28,
      waitingTime: 120,
      queueLength: 15,
      status: 'online'
    },
    {
      id: "INT003",
      name: "5th Ave & Central Park",
      position: { x: 75, y: 25 },
      currentLight: 'yellow',
      vehicleCount: 19,
      waitingTime: 78,
      queueLength: 11,
      status: 'warning'
    },
    {
      id: "INT004",
      name: "Wall St & Water St", 
      position: { x: 40, y: 70 },
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
      case 'red': return 'bg-red-500';
      case 'yellow': return 'bg-yellow-500';
      case 'green': return 'bg-green-500';
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
    <Card className="bg-card border">
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
          <img 
            src={cityMapImage} 
            alt="City Traffic Map"
            className="w-full h-full object-cover"
          />
          
          {/* Traffic Intersection Markers */}
          {intersections.map((intersection) => (
            <button
              key={intersection.id}
              onClick={() => onIntersectionSelect(intersection.id)}
              className={`absolute w-6 h-6 rounded-full border-2 border-white shadow-lg transition-all hover:scale-110 ${getLightColorClass(intersection.currentLight)} ${selectedIntersection === intersection.id ? 'ring-2 ring-primary' : ''}`}
              style={{
                left: `${intersection.position.x}%`,
                top: `${intersection.position.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
              title={intersection.name}
            />
          ))}
        </div>

        {/* Selected Intersection Details */}
        {selectedIntersection && (
          <div className="mt-4 p-4 bg-muted/50 rounded-lg border">
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