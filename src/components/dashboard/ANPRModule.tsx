import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Camera, Search, Filter, AlertTriangle, Clock, MapPin } from "lucide-react";

interface PlateDetection {
  id: string;
  plateNumber: string;
  confidence: number;
  timestamp: Date;
  location: string;
  cameraId: string;
  vehicleType: 'car' | 'truck' | 'motorcycle' | 'bus';
  flagged: boolean;
  reason?: string;
}

const ANPRModule = () => {
  const [detections, setDetections] = useState<PlateDetection[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [showFlaggedOnly, setShowFlaggedOnly] = useState(false);

  // Initialize with sample data
  useEffect(() => {
    const sampleDetections: PlateDetection[] = [
      {
        id: "DET001",
        plateNumber: "ABC123",
        confidence: 0.95,
        timestamp: new Date(Date.now() - 30000),
        location: "Main St & 1st Ave",
        cameraId: "CAM001",
        vehicleType: 'car',
        flagged: true,
        reason: "Stolen Vehicle"
      },
      {
        id: "DET002", 
        plateNumber: "XYZ789",
        confidence: 0.87,
        timestamp: new Date(Date.now() - 120000),
        location: "Broadway & 42nd St",
        cameraId: "CAM002", 
        vehicleType: 'truck',
        flagged: false
      },
      {
        id: "DET003",
        plateNumber: "DEF456",
        confidence: 0.92,
        timestamp: new Date(Date.now() - 180000), 
        location: "5th Ave & Central Park",
        cameraId: "CAM003",
        vehicleType: 'car',
        flagged: true,
        reason: "Outstanding Warrant"
      },
      {
        id: "DET004",
        plateNumber: "GHI012",
        confidence: 0.78,
        timestamp: new Date(Date.now() - 300000),
        location: "Wall St & Water St", 
        cameraId: "CAM004",
        vehicleType: 'motorcycle',
        flagged: false
      }
    ];
    
    setDetections(sampleDetections);
  }, []);

  // Simulate real-time plate detections
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.6) { // 40% chance every 3 seconds
        const plateNumbers = [
          "JKL345", "MNO678", "PQR901", "STU234", "VWX567", 
          "YZA890", "BCD123", "EFG456", "HIJ789", "KLM012"
        ];
        const locations = [
          "Main St & 1st Ave", "Broadway & 42nd St", 
          "5th Ave & Central Park", "Wall St & Water St"
        ];
        const vehicleTypes = ['car', 'truck', 'motorcycle', 'bus'] as const;
        
        const newDetection: PlateDetection = {
          id: `DET${Date.now()}`,
          plateNumber: plateNumbers[Math.floor(Math.random() * plateNumbers.length)],
          confidence: Math.random() * 0.3 + 0.7, // 0.7 to 1.0
          timestamp: new Date(),
          location: locations[Math.floor(Math.random() * locations.length)],
          cameraId: `CAM00${Math.floor(Math.random() * 4) + 1}`,
          vehicleType: vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)],
          flagged: Math.random() > 0.85, // 15% chance of being flagged
          reason: Math.random() > 0.5 ? "Watchlist Match" : "Traffic Violation"
        };

        setDetections(prev => [newDetection, ...prev.slice(0, 49)]); // Keep last 50 detections
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Filter detections based on search and filters
  const filteredDetections = detections.filter(detection => {
    const matchesSearch = detection.plateNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || detection.vehicleType === filterType;
    const matchesFlagged = !showFlaggedOnly || detection.flagged;
    
    return matchesSearch && matchesType && matchesFlagged;
  });

  const getVehicleTypeIcon = (type: string) => {
    switch (type) {
      case 'car': return '🚗';
      case 'truck': return '🚛';
      case 'motorcycle': return '🏍️';
      case 'bus': return '🚌';
      default: return '🚗';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-success';
    if (confidence >= 0.8) return 'text-warning';
    return 'text-destructive';
  };

  const flaggedCount = detections.filter(d => d.flagged).length;
  const recentDetections = detections.filter(d => 
    new Date().getTime() - d.timestamp.getTime() < 300000 // Last 5 minutes
  ).length;

  return (
    <Card className="bg-dashboard-panel panel-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Camera className="w-5 h-5 text-primary" />
            <span>ANPR Detection System</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            {flaggedCount > 0 && (
              <Badge variant="destructive" className="animate-pulse">
                <AlertTriangle className="w-3 h-3 mr-1" />
                {flaggedCount} Flagged
              </Badge>
            )}
            <Badge variant="secondary">
              <Clock className="w-3 h-3 mr-1" />
              {recentDetections} Recent
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search plate numbers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background"
            />
          </div>
          
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-40 bg-background">
              <SelectValue placeholder="Vehicle type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="car">Cars</SelectItem>
              <SelectItem value="truck">Trucks</SelectItem>
              <SelectItem value="motorcycle">Motorcycles</SelectItem>
              <SelectItem value="bus">Buses</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant={showFlaggedOnly ? "default" : "outline"}
            onClick={() => setShowFlaggedOnly(!showFlaggedOnly)}
            className="flex items-center space-x-2"
          >
            <Filter className="w-4 h-4" />
            <span>Flagged Only</span>
          </Button>
        </div>

        {/* Detection Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-secondary/20 rounded-lg">
            <div className="text-2xl font-bold text-foreground">{detections.length}</div>
            <div className="text-sm text-muted-foreground">Total Detections</div>
          </div>
          <div className="text-center p-3 bg-secondary/20 rounded-lg">
            <div className="text-2xl font-bold text-primary">{recentDetections}</div>
            <div className="text-sm text-muted-foreground">Last 5 mins</div>
          </div>
          <div className="text-center p-3 bg-secondary/20 rounded-lg">
            <div className="text-2xl font-bold text-destructive">{flaggedCount}</div>
            <div className="text-sm text-muted-foreground">Flagged</div>
          </div>
          <div className="text-center p-3 bg-secondary/20 rounded-lg">
            <div className="text-2xl font-bold text-success">
              {Math.round((detections.filter(d => d.confidence >= 0.9).length / detections.length) * 100)}%
            </div>
            <div className="text-sm text-muted-foreground">High Confidence</div>
          </div>
        </div>

        {/* Detections Table */}
        <ScrollArea className="h-96">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plate</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDetections.map((detection) => (
                <TableRow 
                  key={detection.id}
                  className={detection.flagged ? 'bg-destructive/10 border-destructive/20' : ''}
                >
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold">
                        {detection.plateNumber}
                      </span>
                      {detection.flagged && (
                        <AlertTriangle className="w-4 h-4 text-destructive" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <span>{getVehicleTypeIcon(detection.vehicleType)}</span>
                      <span className="capitalize text-sm">
                        {detection.vehicleType}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`font-medium ${getConfidenceColor(detection.confidence)}`}>
                      {Math.round(detection.confidence * 100)}%
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1 text-sm">
                      <MapPin className="w-3 h-3 text-muted-foreground" />
                      <span>{detection.location}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {detection.timestamp.toLocaleTimeString()}
                  </TableCell>
                  <TableCell>
                    {detection.flagged ? (
                      <Badge variant="destructive" className="text-xs">
                        {detection.reason}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs">
                        Clear
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredDetections.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Camera className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No detections match current filters</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ANPRModule;