import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  Calculator, 
  BarChart3, 
  Settings, 
  Plus,
  Search,
  Filter,
  Download,
  Share2
} from 'lucide-react';
import PropertyRenderer from '../components/PropertyRenderer';
import ROICalculator from '../components/ROICalculator';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'roi' | 'analytics'>('visualizer');

  const samplePropertyData = {
    type: '3d' as const,
    style: 'modern',
    rooms: [
      {
        name: 'Living Room',
        width: 5,
        height: 3,
        depth: 4,
        position: [0, 0, 0] as [number, number, number]
      },
      {
        name: 'Kitchen',
        width: 3,
        height: 3,
        depth: 3,
        position: [6, 0, 0] as [number, number, number]
      },
      {
        name: 'Bedroom',
        width: 4,
        height: 3,
        depth: 3,
        position: [0, 0, 5] as [number, number, number]
      }
    ],
    materials: {
      floor: '#8B4513',
      walls: '#F5F5DC',
      ceiling: '#FFFFFF'
    }
  };

  const handleRenderComplete = (imageData: string) => {
    console.log('Render completed:', imageData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="w-4 h-4 mr-2 inline" />
                New Project
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'visualizer', label: 'Property Visualizer', icon: Home },
              { id: 'roi', label: 'ROI Calculator', icon: Calculator },
              { id: 'analytics', label: 'Market Analytics', icon: BarChart3 }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'visualizer' && (
            <div className="space-y-6">
              {/* Property Visualizer */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Property Visualizer</h2>
                  <div className="flex space-x-2">
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <Search className="w-4 h-4 mr-2 inline" />
                      Search
                    </button>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <Filter className="w-4 h-4 mr-2 inline" />
                      Filter
                    </button>
                  </div>
                </div>
                
                <PropertyRenderer 
                  propertyData={samplePropertyData} 
                  onRenderComplete={handleRenderComplete}
                />
                
                <div className="mt-6 flex justify-end space-x-2">
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Download className="w-4 h-4 mr-2 inline" />
                    Download
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Share2 className="w-4 h-4 mr-2 inline" />
                    Share
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'roi' && (
            <ROICalculator />
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Market Analytics</h2>
                <div className="text-center py-12">
                  <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Market Analytics Coming Soon</h3>
                  <p className="text-gray-600">Advanced market analysis and insights will be available here.</p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
