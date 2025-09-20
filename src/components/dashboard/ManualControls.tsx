import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { Settings, StopCircle, Play, RotateCcw, Shield, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ManualControlsProps {
  selectedIntersection: string | null;
}

const ManualControls = ({ selectedIntersection }: ManualControlsProps) => {
  const [activeOverride, setActiveOverride] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<{
    type: 'hold_red' | 'force_green' | 'emergency_flash' | 'reset';
    intersection: string;
  } | null>(null);
  const { toast } = useToast();

  const intersections = [
    { id: "INT001", name: "Main St & 1st Ave" },
    { id: "INT002", name: "Broadway & 42nd St" },
    { id: "INT003", name: "5th Ave & Central Park" },
    { id: "INT004", name: "Wall St & Water St" }
  ];

  const executeAction = () => {
    if (!pendingAction) return;

    const intersectionName = intersections.find(i => i.id === pendingAction.intersection)?.name || 'Unknown';
    
    // Simulate action execution
    switch (pendingAction.type) {
      case 'hold_red':
        setActiveOverride(`${pendingAction.intersection}_red`);
        toast({
          title: "Override Activated",
          description: `Traffic signals at ${intersectionName} held on RED`,
        });
        break;
      case 'force_green':
        setActiveOverride(`${pendingAction.intersection}_green`);
        toast({
          title: "Override Activated", 
          description: `Traffic signals at ${intersectionName} forced to GREEN`,
        });
        break;
      case 'emergency_flash':
        setActiveOverride(`${pendingAction.intersection}_flash`);
        toast({
          title: "Emergency Mode",
          description: `Emergency flashing mode activated at ${intersectionName}`,
        });
        break;
      case 'reset':
        setActiveOverride(null);
        toast({
          title: "System Reset",
          description: `Traffic signals at ${intersectionName} returned to automatic control`,
        });
        break;
    }

    // Auto-reset override after 5 minutes (simulate)
    if (pendingAction.type !== 'reset') {
      setTimeout(() => {
        setActiveOverride(null);
        toast({
          title: "Override Expired",
          description: `Manual override at ${intersectionName} automatically reset`,
        });
      }, 300000); // 5 minutes
    }

    setPendingAction(null);
  };

  const getOverrideStatus = (intersectionId: string) => {
    if (activeOverride?.startsWith(intersectionId)) {
      const type = activeOverride.split('_')[1];
      switch (type) {
        case 'red': return { status: 'Hold Red', color: 'destructive' };
        case 'green': return { status: 'Force Green', color: 'default' };
        case 'flash': return { status: 'Emergency Flash', color: 'secondary' };
        default: return null;
      }
    }
    return null;
  };

  const targetIntersection = selectedIntersection || "INT001";
  const targetName = intersections.find(i => i.id === targetIntersection)?.name || 'Select Intersection';
  const currentOverride = getOverrideStatus(targetIntersection);

  return (
    <>
      <Card className="bg-dashboard-panel panel-shadow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5 text-primary" />
              <span>Manual Signal Override</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-warning" />
              <span className="text-sm text-warning font-medium">OPERATOR CONTROL</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Intersection Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Target Intersection</label>
            <Select value={targetIntersection}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Select intersection..." />
              </SelectTrigger>
              <SelectContent>
                {intersections.map((intersection) => (
                  <SelectItem key={intersection.id} value={intersection.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{intersection.name}</span>
                      {getOverrideStatus(intersection.id) && (
                        <Badge 
                          variant={getOverrideStatus(intersection.id)?.color as any}
                          className="ml-2"
                        >
                          Active
                        </Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Current Status */}
          <div className="p-4 bg-secondary/20 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-foreground">Current Status</h4>
              {currentOverride && (
                <Badge variant={currentOverride.color as any} className="animate-pulse">
                  {currentOverride.status}
                </Badge>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Mode:</span>
                <span className="ml-2 text-foreground">
                  {currentOverride ? 'Manual Override' : 'Automatic'}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Operator:</span>
                <span className="ml-2 text-foreground">Traffic Control</span>
              </div>
            </div>
          </div>

          {/* Control Actions */}
          <div className="space-y-3">
            <h4 className="font-medium text-foreground">Emergency Actions</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                variant="destructive"
                className="flex items-center space-x-2 h-12"
                onClick={() => setPendingAction({ 
                  type: 'hold_red', 
                  intersection: targetIntersection 
                })}
                disabled={!!currentOverride}
              >
                <StopCircle className="w-4 h-4" />
                <span>Hold Red</span>
              </Button>

              <Button
                variant="default"
                className="flex items-center space-x-2 h-12"
                onClick={() => setPendingAction({ 
                  type: 'force_green', 
                  intersection: targetIntersection 
                })}
                disabled={!!currentOverride}
              >
                <Play className="w-4 h-4" />
                <span>Force Green</span>
              </Button>

              <Button
                variant="secondary"
                className="flex items-center space-x-2 h-12"
                onClick={() => setPendingAction({ 
                  type: 'emergency_flash', 
                  intersection: targetIntersection 
                })}
                disabled={!!currentOverride}
              >
                <Clock className="w-4 h-4" />
                <span>Emergency Flash</span>
              </Button>

              <Button
                variant="outline"
                className="flex items-center space-x-2 h-12"
                onClick={() => setPendingAction({ 
                  type: 'reset', 
                  intersection: targetIntersection 
                })}
                disabled={!currentOverride}
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset to Auto</span>
              </Button>
            </div>
          </div>

          {/* Override History */}
          <div className="space-y-2">
            <h4 className="font-medium text-foreground">Recent Actions</h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              <div className="p-2 bg-background rounded text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">15:23:14</span>
                  <span className="text-foreground">Manual override activated - Hold Red</span>
                </div>
              </div>
              <div className="p-2 bg-background rounded text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">15:18:32</span>
                  <span className="text-foreground">System reset to automatic control</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <AlertDialog open={!!pendingAction} onOpenChange={() => setPendingAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Manual Override</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to execute this action on {targetName}?
              <br />
              <strong className="text-warning">
                This will override automatic traffic control systems.
              </strong>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={executeAction}>
              Confirm Override
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ManualControls;