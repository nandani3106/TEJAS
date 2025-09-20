import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Clock, Car, AlertTriangle } from "lucide-react";

interface MetricData {
  time: string;
  vehicles: number;
  speed: number;
  congestion: number;
  incidents: number;
}

const LiveMetrics = () => {
  const [metrics, setMetrics] = useState<MetricData[]>([]);
  const [currentMetrics, setCurrentMetrics] = useState({
    totalVehicles: 0,
    avgSpeed: 0,
    congestionLevel: 0,
    activeIncidents: 0
  });

  // Initialize with sample data
  useEffect(() => {
    const initialData: MetricData[] = [];
    const now = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60000);
      initialData.push({
        time: time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
        vehicles: Math.floor(Math.random() * 100) + 50,
        speed: Math.floor(Math.random() * 30) + 25,
        congestion: Math.floor(Math.random() * 80) + 10,
        incidents: Math.floor(Math.random() * 5)
      });
    }
    
    setMetrics(initialData);
  }, []);

  // Real-time updates every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const newData: MetricData = {
        time: now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
        vehicles: Math.floor(Math.random() * 100) + 50,
        speed: Math.floor(Math.random() * 30) + 25,
        congestion: Math.floor(Math.random() * 80) + 10,
        incidents: Math.floor(Math.random() * 5)
      };

      setMetrics(prev => [...prev.slice(1), newData]);
      
      // Update current metrics
      setCurrentMetrics({
        totalVehicles: newData.vehicles * 4, // Simulate city-wide total
        avgSpeed: newData.speed,
        congestionLevel: newData.congestion,
        activeIncidents: newData.incidents
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getCongestionColor = (level: number) => {
    if (level < 30) return 'text-success';
    if (level < 60) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <div className="space-y-6">
      {/* Current Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="bg-dashboard-panel panel-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Vehicles</p>
                <p className="text-2xl font-bold text-foreground">{currentMetrics.totalVehicles}</p>
              </div>
              <Car className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-dashboard-panel panel-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Speed</p>
                <p className="text-2xl font-bold text-foreground">{currentMetrics.avgSpeed} km/h</p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-dashboard-panel panel-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Congestion</p>
                <p className={`text-2xl font-bold ${getCongestionColor(currentMetrics.congestionLevel)}`}>
                  {currentMetrics.congestionLevel}%
                </p>
              </div>
              <Clock className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-dashboard-panel panel-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Incidents</p>
                <p className="text-2xl font-bold text-destructive">{currentMetrics.activeIncidents}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Charts */}
      <Card className="bg-dashboard-panel panel-shadow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Vehicle Flow</CardTitle>
            <Badge variant="secondary" className="animate-pulse">Live</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={metrics}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="time" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="vehicles" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-dashboard-panel panel-shadow">
        <CardHeader>
          <CardTitle className="text-lg">Traffic Speed & Congestion</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={metrics}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="time" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="speed" 
                stackId="1"
                stroke="hsl(var(--success))" 
                fill="hsl(var(--success) / 0.3)"
              />
              <Area 
                type="monotone" 
                dataKey="congestion" 
                stackId="2"
                stroke="hsl(var(--warning))" 
                fill="hsl(var(--warning) / 0.3)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default LiveMetrics;