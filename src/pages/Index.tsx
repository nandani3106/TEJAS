import { useState, useEffect } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import TrafficMap from "@/components/dashboard/TrafficMap";
import LiveMetrics from "@/components/dashboard/LiveMetrics";
import CameraFeeds from "@/components/dashboard/CameraFeeds";
import AlertsPanel from "@/components/dashboard/AlertsPanel";
import ManualControls from "@/components/dashboard/ManualControls";
import ANPRModule from "@/components/dashboard/ANPRModule";

const Index = () => {
  const [activeAlerts, setActiveAlerts] = useState(0);
  const [selectedIntersection, setSelectedIntersection] = useState<string | null>(null);

  // Simulate real-time alert updates
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveAlerts(prev => Math.max(0, prev + (Math.random() > 0.7 ? 1 : -1)));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader activeAlerts={activeAlerts} />
      
      <main className="container mx-auto p-6 space-y-6">
        {/* Top Row - Map and Live Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TrafficMap 
              selectedIntersection={selectedIntersection}
              onIntersectionSelect={setSelectedIntersection}
            />
          </div>
          <div>
            <LiveMetrics />
          </div>
        </div>

        {/* Middle Row - Camera Feeds and Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CameraFeeds selectedIntersection={selectedIntersection} />
          <AlertsPanel />
        </div>

        {/* Bottom Row - Manual Controls and ANPR */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ManualControls selectedIntersection={selectedIntersection} />
          <ANPRModule />
        </div>
      </main>
    </div>
  );
};

export default Index;