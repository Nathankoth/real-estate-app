import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp, DollarSign, Home, BarChart3 } from 'lucide-react';
import toast from 'react-hot-toast';

interface ROIData {
  cash_flow_analysis: {
    monthly: {
      cash_flow: number;
      gross_rent: number;
      total_expenses: number;
    };
    annual: {
      cash_flow: number;
    };
  };
  roi_metrics: {
    cash_on_cash_return: number;
    cap_rate: number;
    total_roi: number;
    internal_rate_of_return: number;
  };
  projections: {
    year_1: any;
    year_5: any;
    year_10: any;
  };
  recommendations: string[];
  risk_assessment: {
    risk_level: string;
    risk_score: number;
    risk_factors: string[];
  };
}

const ROICalculator: React.FC = () => {
  const [formData, setFormData] = useState({
    purchase_price: 450000,
    monthly_rent: 2500,
    down_payment: 90000,
    interest_rate: 6.5,
    loan_term_years: 30,
    property_tax_rate: 1.2,
    insurance_rate: 0.5,
    maintenance_rate: 1.0,
    vacancy_rate: 5,
    appreciation_rate: 3,
    hold_period_years: 5,
    location: 'San Francisco, CA',
    property_type: 'residential'
  });

  const [roiData, setRoiData] = useState<ROIData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'projections' | 'risk'>('overview');

  const calculateROI = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/roi/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to calculate ROI');
      }

      const data = await response.json();
      setRoiData(data);
      toast.success('ROI analysis completed!');
    } catch (error) {
      console.error('ROI calculation error:', error);
      toast.error('Failed to calculate ROI. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: number | string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const MetricCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
    subtitle?: string;
  }> = ({ title, value, icon, color, subtitle }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg p-6 shadow-lg border border-gray-100"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">{value}</div>
          {subtitle && <div className="text-sm text-gray-500">{subtitle}</div>}
        </div>
      </div>
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
    </motion.div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">ROI Calculator</h1>
        <p className="text-gray-600">Analyze your real estate investment potential</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Input Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <Calculator className="w-5 h-5 mr-2" />
              Property Details
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Purchase Price
                </label>
                <input
                  type="number"
                  value={formData.purchase_price}
                  onChange={(e) => handleInputChange('purchase_price', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monthly Rent
                </label>
                <input
                  type="number"
                  value={formData.monthly_rent}
                  onChange={(e) => handleInputChange('monthly_rent', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Down Payment
                </label>
                <input
                  type="number"
                  value={formData.down_payment}
                  onChange={(e) => handleInputChange('down_payment', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Interest Rate (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.interest_rate}
                  onChange={(e) => handleInputChange('interest_rate', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={calculateROI}
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Calculating...' : 'Calculate ROI'}
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2">
          {roiData ? (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid md:grid-cols-2 gap-6">
                <MetricCard
                  title="Cash-on-Cash Return"
                  value={`${roiData.roi_metrics.cash_on_cash_return}%`}
                  icon={<TrendingUp className="w-6 h-6 text-white" />}
                  color="bg-green-500"
                  subtitle="Annual return on cash invested"
                />
                <MetricCard
                  title="Cap Rate"
                  value={`${roiData.roi_metrics.cap_rate}%`}
                  icon={<BarChart3 className="w-6 h-6 text-white" />}
                  color="bg-blue-500"
                  subtitle="Net operating income / property value"
                />
                <MetricCard
                  title="Monthly Cash Flow"
                  value={`$${roiData.cash_flow_analysis.monthly.cash_flow.toLocaleString()}`}
                  icon={<DollarSign className="w-6 h-6 text-white" />}
                  color="bg-purple-500"
                  subtitle="Net monthly income"
                />
                <MetricCard
                  title="Total ROI (5 years)"
                  value={`${roiData.roi_metrics.total_roi}%`}
                  icon={<Home className="w-6 h-6 text-white" />}
                  color="bg-orange-500"
                  subtitle="Total return including appreciation"
                />
              </div>

              {/* Tabs */}
              <div className="bg-white rounded-lg shadow-lg">
                <div className="border-b border-gray-200">
                  <nav className="flex space-x-8 px-6">
                    {[
                      { id: 'overview', label: 'Overview' },
                      { id: 'projections', label: 'Projections' },
                      { id: 'risk', label: 'Risk Analysis' }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                          activeTab === tab.id
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </nav>
                </div>

                <div className="p-6">
                  {activeTab === 'overview' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Investment Overview</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Annual Cash Flow</p>
                          <p className="text-xl font-semibold">
                            ${roiData.cash_flow_analysis.annual.cash_flow.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Internal Rate of Return</p>
                          <p className="text-xl font-semibold">
                            {roiData.roi_metrics.internal_rate_of_return}%
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'projections' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Future Projections</h3>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">Year 1</p>
                          <p className="text-lg font-semibold">
                            ${roiData.projections.year_1.projected_value.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">Year 5</p>
                          <p className="text-lg font-semibold">
                            ${roiData.projections.year_5.projected_value.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">Year 10</p>
                          <p className="text-lg font-semibold">
                            ${roiData.projections.year_10.projected_value.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'risk' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Risk Assessment</h3>
                      <div className="flex items-center gap-4">
                        <div className={`px-4 py-2 rounded-lg text-white font-semibold ${
                          roiData.risk_assessment.risk_level === 'Low' ? 'bg-green-500' :
                          roiData.risk_assessment.risk_level === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}>
                          {roiData.risk_assessment.risk_level} Risk
                        </div>
                        <div className="text-sm text-gray-600">
                          Score: {roiData.risk_assessment.risk_score}/100
                        </div>
                      </div>
                      {roiData.risk_assessment.risk_factors.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">Risk Factors:</p>
                          <ul className="list-disc list-inside space-y-1">
                            {roiData.risk_assessment.risk_factors.map((factor, index) => (
                              <li key={index} className="text-sm text-gray-600">{factor}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Recommendations */}
              {roiData.recommendations.length > 0 && (
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">Recommendations</h3>
                  <ul className="space-y-2">
                    {roiData.recommendations.map((recommendation, index) => (
                      <li key={index} className="text-blue-800 flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        {recommendation}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-12 text-center">
              <Calculator className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Ready to Calculate ROI?</h3>
              <p className="text-gray-600">Enter your property details and click "Calculate ROI" to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ROICalculator;
