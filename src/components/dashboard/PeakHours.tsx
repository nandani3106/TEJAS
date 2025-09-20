import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Clock, BarChart3 } from "lucide-react";

interface PeakHoursData {
  hour: string;
  avgVehicles: number;
  avgWaitTime: number;
  congestionLevel: 'low' | 'medium' | 'high';
  isCurrentHour: boolean;
}

const PeakHours = () => {
  const [peakData, setPeakData] = useState<PeakHoursData[]>([
    { hour: "06:00", avgVehicles: 45, avgWaitTime: 35, congestionLevel: 'medium', isCurrentHour: false },
    { hour: "07:00", avgVehicles: 78, avgWaitTime: 65, congestionLevel: 'high', isCurrentHour: false },
    { hour: "08:00", avgVehicles: 92, avgWaitTime: 85, congestionLevel: 'high', isCurrentHour: false },
    { hour: "09:00", avgVehicles: 65, avgWaitTime: 45, congestionLevel: 'medium', isCurrentHour: true },
    { hour: "10:00", avgVehicles: 42, avgWaitTime: 28, congestionLevel: 'low', isCurrentHour: false },
    { hour: "11:00", avgVehicles: 38, avgWaitTime: 25, congestionLevel: 'low', isCurrentHour: false },
    { hour: "12:00", avgVehicles: 55, avgWaitTime: 40, congestionLevel: 'medium', isCurrentHour: false },
    { hour: "13:00", avgVehicles: 48, avgWaitTime: 35, congestionLevel: 'medium', isCurrentHour: false },
    { hour: "17:00", avgVehicles: 85, avgWaitTime: 75, congestionLevel: 'high', isCurrentHour: false },
    { hour: "18:00", avgVehicles: 95, avgWaitTime: 90, congestionLevel: 'high', isCurrentHour: false },
    { hour: "19:00", avgVehicles: 72, avgWaitTime: 55, congestionLevel: 'medium', isCurrentHour: false },
    { hour: "20:00", avgVehicles: 45, avgWaitTime: 32, congestionLevel: 'low', isCurrentHour: false },
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPeakData(prev => prev.map(data => {
        if (data.isCurrentHour) {
          const variation = Math.floor(Math.random() * 10) - 5;
          return {
            ...data,
            avgVehicles: Math.max(0, data.avgVehicles + variation),
            avgWaitTime: Math.max(0, data.avgWaitTime + Math.floor(variation * 0.8))
          };
        }
        return data;
      }));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const getCongestionColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-success';
      case 'medium': return 'text-warning';
      case 'high': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getCongestionBadge = (level: string) => {
    switch (level) {
      case 'low': return 'default';
      case 'medium': return 'secondary';
      case 'high': return 'destructive';
      default: return 'secondary';
    }
  };

  const getBarHeight = (vehicles: number) => {
    const maxVehicles = Math.max(...peakData.map(d => d.avgVehicles));
    return `${(vehicles / maxVehicles) * 100}%`;
  };

  return (
    <Card className="bg-dashboard-panel panel-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            <span>Peak Hours Analytics</span>
          </CardTitle>
          <Badge variant="secondary" className="flex items-center space-x-1">
            <TrendingUp className="w-3 h-3" />
            <span>24h Pattern</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Hour Highlight */}
        <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
          {(() => {
            const currentHour = peakData.find(d => d.isCurrentHour);
            if (!currentHour) return null;
            
            return (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-semibold text-foreground">Current Hour ({currentHour.hour})</div>
                    <div className="text-sm text-muted-foreground">Live traffic analysis</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-foreground">{currentHour.avgVehicles}</div>
                  <div className="text-sm text-muted-foreground">avg vehicles</div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Peak Hours Chart */}
        <div className="space-y-2">
          <h4 className="font-medium text-foreground">Traffic Volume by Hour</h4>
          <div className="flex items-end justify-between h-32 bg-secondary/20 p-4 rounded-lg">
            {peakData.map((data, index) => (
              <div key={data.hour} className="flex flex-col items-center space-y-1 flex-1">
                <div 
                  className={`w-6 rounded-t transition-all duration-500 ${
                    data.isCurrentHour 
                      ? 'bg-primary' 
                      : data.congestionLevel === 'high' 
                        ? 'bg-destructive' 
                        : data.congestionLevel === 'medium'
                          ? 'bg-warning'
                          : 'bg-success'
                  }`}
                  style={{ height: getBarHeight(data.avgVehicles) }}
                ></div>
                <div className="text-xs text-muted-foreground transform -rotate-45 origin-bottom-left">
                  {data.hour}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Peak Hours List */}
        <div className="space-y-2">
          <h4 className="font-medium text-foreground">Today's Peak Hours</h4>
          <div className="grid gap-2">
            {peakData
              .filter(d => d.congestionLevel === 'high')
              .map(data => (
                <div 
                  key={data.hour} 
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    data.isCurrentHour ? 'bg-primary/5 border-primary/20' : 'bg-secondary/10 border-border'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-sm font-medium text-foreground">{data.hour}</div>
                    <Badge variant={getCongestionBadge(data.congestionLevel)} className="text-xs">
                      {data.congestionLevel.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="text-center">
                      <div className="font-medium text-foreground">{data.avgVehicles}</div>
                      <div className="text-muted-foreground text-xs">vehicles</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-foreground">{data.avgWaitTime}s</div>
                      <div className="text-muted-foreground text-xs">wait time</div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PeakHours;