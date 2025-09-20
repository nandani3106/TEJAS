import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, Maximize2, Play, Pause, RotateCcw } from "lucide-react";

interface CameraFeed {
  id: string;
  name: string;
  intersectionId: string;
  status: 'live' | 'offline' | 'recording';
  quality: string;
  fps: number;
}

interface CameraFeedsProps {
  selectedIntersection: string | null;
}

const CameraFeeds = ({ selectedIntersection }: CameraFeedsProps) => {
  const [feeds, setFeeds] = useState<CameraFeed[]>([
    {
      id: "CAM001",
      name: "Main St North View",
      intersectionId: "INT001",
      status: 'live',
      quality: '1080p',
      fps: 30
    },
    {
      id: "CAM002",
      name: "Broadway South View", 
      intersectionId: "INT002",
      status: 'live',
      quality: '720p',
      fps: 25
    },
    {
      id: "CAM003",
      name: "5th Ave East View",
      intersectionId: "INT003", 
      status: 'offline',
      quality: '1080p',
      fps: 0
    },
    {
      id: "CAM004",
      name: "Wall St West View",
      intersectionId: "INT004",
      status: 'recording',
      quality: '4K',
      fps: 60
    }
  ]);

  const [expandedFeed, setExpandedFeed] = useState<string | null>(null);

  // Filter feeds based on selected intersection
  const visibleFeeds = selectedIntersection 
    ? feeds.filter(feed => feed.intersectionId === selectedIntersection)
    : feeds.slice(0, 4);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'default';
      case 'recording': return 'secondary';  
      case 'offline': return 'destructive';
      default: return 'secondary';
    }
  };

  const generateCameraPlaceholder = (feedId: string) => {
    // Generate a unique pattern for each camera based on ID
    const hash = feedId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const pattern = hash % 4;
    
    return (
      <div className="w-full h-full bg-secondary/20 relative overflow-hidden">
        {/* Simulated camera feed with animated elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/30 to-secondary/10"></div>
        
        {/* Grid overlay to simulate video feed */}
        <div className="absolute inset-0 opacity-20">
          <div className="grid grid-cols-8 grid-rows-6 h-full w-full">
            {Array.from({ length: 48 }).map((_, i) => (
              <div 
                key={i} 
                className={`border border-primary/20 ${
                  (i + pattern) % 3 === 0 ? 'bg-primary/5' : ''
                }`}
              ></div>
            ))}
          </div>
        </div>

        {/* Animated "vehicles" */}
        <div className="absolute bottom-1/4 left-1/4 w-4 h-2 bg-primary/60 rounded animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-3 h-2 bg-accent/60 rounded animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-1/2 left-1/2 w-5 h-2 bg-warning/60 rounded animate-pulse" style={{ animationDelay: '1s' }}></div>

        {/* Timestamp overlay */}
        <div className="absolute top-2 left-2 bg-background/80 text-foreground text-xs px-2 py-1 rounded font-mono">
          {new Date().toLocaleTimeString()}
        </div>

        {/* Quality indicator */}
        <div className="absolute top-2 right-2 bg-background/80 text-foreground text-xs px-2 py-1 rounded">
          LIVE
        </div>
      </div>
    );
  };

  return (
    <Card className="bg-dashboard-panel panel-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Camera className="w-5 h-5 text-primary" />
            <span>Live Camera Feeds</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="animate-pulse">
              {visibleFeeds.filter(f => f.status === 'live').length} Live
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {visibleFeeds.map((feed) => (
            <div key={feed.id} className="space-y-2">
              {/* Camera Feed Container */}
              <div 
                className={`relative aspect-video bg-black rounded-lg overflow-hidden transition-all duration-300 ${
                  expandedFeed === feed.id ? 'fixed inset-4 z-50 aspect-auto' : ''
                }`}
              >
                {feed.status === 'offline' ? (
                  <div className="w-full h-full bg-muted/20 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Camera Offline</p>
                    </div>
                  </div>
                ) : (
                  generateCameraPlaceholder(feed.id)
                )}

                {/* Camera Controls Overlay */}
                {feed.status !== 'offline' && (
                  <div className="absolute bottom-2 right-2 flex space-x-1">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="bg-background/80 hover:bg-background p-1 h-auto"
                      onClick={() => setExpandedFeed(expandedFeed === feed.id ? null : feed.id)}
                    >
                      <Maximize2 className="w-3 h-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="bg-background/80 hover:bg-background p-1 h-auto"
                    >
                      {feed.status === 'live' ? 
                        <Pause className="w-3 h-3" /> : 
                        <Play className="w-3 h-3" />
                      }
                    </Button>
                  </div>
                )}
              </div>

              {/* Feed Info */}
              <div className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium text-foreground">{feed.name}</p>
                  <p className="text-muted-foreground">{feed.quality} • {feed.fps} FPS</p>
                </div>
                <Badge variant={getStatusColor(feed.status)}>
                  {feed.status.toUpperCase()}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state when no feeds available */}
        {visibleFeeds.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Camera className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No camera feeds available for selected intersection</p>
          </div>
        )}

        {/* Controls */}
        <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            {selectedIntersection ? `Showing feeds for selected intersection` : 'Showing all available feeds'}
          </div>
          <Button variant="ghost" size="sm">
            <RotateCcw className="w-4 h-4 mr-2" />
            Refresh All
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CameraFeeds;