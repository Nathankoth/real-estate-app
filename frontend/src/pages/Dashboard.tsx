import { Routes, Route, Navigate } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import Overview from '@/components/dashboard/Overview';
import Guide from '@/components/dashboard/Guide';
import AIGuide from '@/components/dashboard/AIGuide';
import ROICalculator from '@/components/dashboard/ROICalculator';
import ImageGenerator from '@/components/dashboard/ImageGenerator';
import { ThreeDGenerator } from '@/components/dashboard/ThreeDGenerator';
import Projects from '@/components/dashboard/Projects';
import MarketAnalytics from '@/components/dashboard/MarketAnalytics';
import DesignTools from '@/components/dashboard/DesignTools';
import AIVisualization from '@/components/dashboard/AIVisualization';
import Security from '@/components/dashboard/Security';
import FastAPIRoiCalculator from '@/components/dashboard/FastAPIRoiCalculator';
import FastAPIDesignGenerator from '@/components/dashboard/FastAPIDesignGenerator';

const Dashboard = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar />
        
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          
          <main className="flex-1 p-6 bg-muted/20">
            <Routes>
              <Route path="/" element={<Overview />} />
              <Route path="/guide" element={<Guide />} />
              <Route path="/ai-guide" element={<AIGuide />} />
              <Route path="/roi" element={<ROICalculator />} />
              <Route path="/2d-generator" element={<ImageGenerator />} />
              <Route path="/3d-generator" element={<ThreeDGenerator />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/market-analytics" element={<MarketAnalytics />} />
              <Route path="/design-tools" element={<DesignTools />} />
              <Route path="/ai-visualization" element={<AIVisualization />} />
              <Route path="/security" element={<Security />} />
              <Route path="/fastapi-roi" element={<FastAPIRoiCalculator />} />
              <Route path="/fastapi-design" element={<FastAPIDesignGenerator />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;