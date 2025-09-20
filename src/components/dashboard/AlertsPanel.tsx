import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, CheckCircle, Clock, X, Volume2, VolumeX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Alert {
  id: string;
  type: 'accident' | 'congestion' | 'parade' | 'system' | 'weather';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  location: string;
  timestamp: Date;
  acknowledged: boolean;
  resolved: boolean;
}

const AlertsPanel = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const { toast } = useToast();

  // Initialize with sample alerts
  useEffect(() => {
    const initialAlerts: Alert[] = [
      {
        id: "ALT001",
        type: 'accident',
        severity: 'high',
        title: 'Vehicle Collision',
        description: 'Multi-vehicle accident blocking 2 lanes',
        location: 'Main St & 1st Ave',
        timestamp: new Date(Date.now() - 300000), // 5 minutes ago
        acknowledged: false,
        resolved: false
      },
      {
        id: "ALT002", 
        type: 'congestion',
        severity: 'medium',
        title: 'Heavy Traffic',
        description: 'Queue length exceeding threshold',
        location: 'Broadway & 42nd St',
        timestamp: new Date(Date.now() - 600000), // 10 minutes ago
        acknowledged: true,
        resolved: false
      },
      {
        id: "ALT003",
        type: 'system',
        severity: 'critical',
        title: 'Signal Malfunction',
        description: 'Traffic light system offline',
        location: 'Wall St & Water St',
        timestamp: new Date(Date.now() - 1200000), // 20 minutes ago
        acknowledged: true,
        resolved: true
      }
    ];
    
    setAlerts(initialAlerts);
  }, []);

  // Simulate new alerts
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.85) { // 15% chance every 10 seconds
        const alertTypes = ['accident', 'congestion', 'parade', 'system', 'weather'] as const;
        const severities = ['low', 'medium', 'high', 'critical'] as const;
        
        const newAlert: Alert = {
          id: `ALT${Date.now()}`,
          type: alertTypes[Math.floor(Math.random() * alertTypes.length)],
          severity: severities[Math.floor(Math.random() * severities.length)],
          title: getAlertTitle(alertTypes[Math.floor(Math.random() * alertTypes.length)]),
          description: 'System detected anomaly requiring attention',
          location: ['Main St & 1st Ave', 'Broadway & 42nd St', '5th Ave & Central Park'][Math.floor(Math.random() * 3)],
          timestamp: new Date(),
          acknowledged: false,
          resolved: false
        };

        setAlerts(prev => [newAlert, ...prev]);
        
        // Show toast and play sound for new alerts
        if (soundEnabled && newAlert.severity === 'critical') {
          toast({
            title: "Critical Alert",
            description: `${newAlert.title} at ${newAlert.location}`,
            variant: "destructive",
          });
        }
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [soundEnabled, toast]);

  const getAlertTitle = (type: Alert['type']) => {
    switch (type) {
      case 'accident': return 'Traffic Incident';
      case 'congestion': return 'Heavy Congestion';
      case 'parade': return 'Special Event';
      case 'system': return 'System Alert';
      case 'weather': return 'Weather Advisory';
      default: return 'Alert';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'secondary';
    }
  };

  const getTypeIcon = (type: Alert['type']) => {
    switch (type) {
      case 'accident':
      case 'system':
        return <AlertTriangle className="w-4 h-4" />;
      case 'congestion':
        return <Clock className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, acknowledged: true }
        : alert
    ));
  };

  const resolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert =>
      alert.id === alertId
        ? { ...alert, resolved: true, acknowledged: true }
        : alert
    ));
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const activeAlerts = alerts.filter(alert => !alert.resolved);
  const criticalAlerts = activeAlerts.filter(alert => alert.severity === 'critical');

  return (
    <Card className="bg-dashboard-panel panel-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-primary" />
            <span>Active Alerts</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setSoundEnabled(!soundEnabled)}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>
            {criticalAlerts.length > 0 && (
              <Badge variant="destructive" className="animate-pulse">
                {criticalAlerts.length} Critical
              </Badge>
            )}
            <Badge variant="secondary">
              {activeAlerts.length} Active
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div 
                key={alert.id}
                className={`p-4 rounded-lg border transition-all duration-300 ${
                  alert.resolved 
                    ? 'bg-muted/20 border-muted opacity-60' 
                    : alert.acknowledged
                    ? 'bg-secondary/20 border-secondary'
                    : alert.severity === 'critical'
                    ? 'bg-destructive/10 border-destructive animate-pulse-slow'
                    : 'bg-background border-border'
                }`}
              >
                <div className="flex items-start justify-between space-x-3">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className={`mt-0.5 ${
                      alert.resolved ? 'text-success' : 
                      alert.severity === 'critical' ? 'text-destructive' : 'text-primary'
                    }`}>
                      {alert.resolved ? <CheckCircle className="w-4 h-4" /> : getTypeIcon(alert.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-foreground">{alert.title}</h4>
                        <Badge variant={getSeverityColor(alert.severity)} className="text-xs">
                          {alert.severity.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">
                        {alert.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{alert.location}</span>
                        <span>{alert.timestamp.toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Alert Actions */}
                  <div className="flex items-center space-x-1">
                    {!alert.resolved && !alert.acknowledged && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => acknowledgeAlert(alert.id)}
                        className="h-6 px-2 text-xs"
                      >
                        ACK
                      </Button>
                    )}
                    
                    {alert.acknowledged && !alert.resolved && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => resolveAlert(alert.id)}
                        className="h-6 px-2 text-xs"
                      >
                        Resolve
                      </Button>
                    )}
                    
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => dismissAlert(alert.id)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {alerts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No active alerts</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default AlertsPanel;