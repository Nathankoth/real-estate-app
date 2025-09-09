import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Calculator, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Loader2, 
  Info,
  Building2,
  Home,
  Percent,
  Calendar,
  Target,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3
} from 'lucide-react';
import { toast } from 'sonner';

interface ROIInputs {
  purchase_price: number;
  rental_income: number;
  expenses: number;
  loan_amount: number;
  cap_rate?: number;
  vacancy_rate: number;
  appreciation_rate: number;
}

interface ROIResults {
  net_income: number;
  roi_percentage: number;
  cash_flow: number;
  payback_period: number;
  adjusted_roi?: number;
  cap_rate_analysis?: string;
}

const FastAPIRoiCalculator: React.FC = () => {
  // Form state
  const [inputs, setInputs] = useState<ROIInputs>({
    purchase_price: 0,
    rental_income: 0,
    expenses: 0,
    loan_amount: 0,
    cap_rate: undefined,
    vacancy_rate: 10,
    appreciation_rate: 3
  });

  const [results, setResults] = useState<ROIResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'beginner' | 'advanced'>('beginner');

  // Handle input changes
  const handleInputChange = (field: keyof ROIInputs, value: string) => {
    const numValue = parseFloat(value) || 0;
    setInputs(prev => ({
      ...prev,
      [field]: numValue
    }));
  };

  // Calculate ROI
  const calculateROI = async () => {
    // Validation
    if (!inputs.purchase_price || !inputs.rental_income || !inputs.expenses) {
      toast.error('Please fill in Purchase Price, Rental Income, and Expenses');
      return;
    }

    if (inputs.purchase_price <= 0) {
      toast.error('Purchase price must be greater than 0');
      return;
    }

    if (inputs.rental_income < 0 || inputs.expenses < 0) {
      toast.error('Rental income and expenses cannot be negative');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/calculate-roi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputs),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to calculate ROI');
      }

      const data = await response.json();
      setResults(data);
      toast.success('ROI calculated successfully!');
    } catch (error) {
      console.error('Error calculating ROI:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to calculate ROI');
    } finally {
      setLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Format percentage
  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  // Get performance indicator
  const getPerformanceIndicator = (value: number, type: 'roi' | 'cash_flow' | 'payback') => {
    if (type === 'roi') {
      if (value >= 12) return { icon: CheckCircle, color: 'text-green-600', text: 'Excellent' };
      if (value >= 8) return { icon: CheckCircle, color: 'text-green-500', text: 'Good' };
      if (value >= 5) return { icon: AlertCircle, color: 'text-yellow-500', text: 'Fair' };
      return { icon: XCircle, color: 'text-red-500', text: 'Poor' };
    }
    
    if (type === 'cash_flow') {
      if (value > 0) return { icon: CheckCircle, color: 'text-green-600', text: 'Positive' };
      return { icon: XCircle, color: 'text-red-500', text: 'Negative' };
    }
    
    if (type === 'payback') {
      if (value <= 5) return { icon: CheckCircle, color: 'text-green-600', text: 'Fast' };
      if (value <= 10) return { icon: AlertCircle, color: 'text-yellow-500', text: 'Moderate' };
      return { icon: XCircle, color: 'text-red-500', text: 'Slow' };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Calculator className="h-10 w-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">ROI Calculator</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Calculate your real estate investment returns with our comprehensive ROI calculator
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex justify-center">
          <div className="bg-white rounded-2xl shadow p-1">
            <Button
              variant={mode === 'beginner' ? 'default' : 'ghost'}
              onClick={() => setMode('beginner')}
              className="px-6 py-2"
            >
              <Home className="h-4 w-4 mr-2" />
              Beginner Mode
            </Button>
            <Button
              variant={mode === 'advanced' ? 'default' : 'ghost'}
              onClick={() => setMode('advanced')}
              className="px-6 py-2"
            >
              <Building2 className="h-4 w-4 mr-2" />
              Advanced Mode
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card className="rounded-2xl shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-2xl">
              <CardTitle className="flex items-center space-x-2 text-xl">
                <Calculator className="h-6 w-6" />
                <span>Investment Details</span>
              </CardTitle>
              <CardDescription className="text-blue-100">
                {mode === 'beginner' 
                  ? 'Enter basic property information for quick ROI calculation'
                  : 'Enter detailed property information for comprehensive analysis'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Basic Fields */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="purchase_price" className="text-lg font-semibold">
                    Purchase Price (₦)
                  </Label>
                  <Input
                    id="purchase_price"
                    type="number"
                    placeholder="50,000,000"
                    value={inputs.purchase_price || ''}
                    onChange={(e) => handleInputChange('purchase_price', e.target.value)}
                    className="border-2 p-3 rounded-lg text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rental_income" className="text-lg font-semibold">
                    Annual Rental Income (₦)
                  </Label>
                  <Input
                    id="rental_income"
                    type="number"
                    placeholder="3,000,000"
                    value={inputs.rental_income || ''}
                    onChange={(e) => handleInputChange('rental_income', e.target.value)}
                    className="border-2 p-3 rounded-lg text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expenses" className="text-lg font-semibold">
                    Annual Expenses (₦)
                  </Label>
                  <Input
                    id="expenses"
                    type="number"
                    placeholder="600,000"
                    value={inputs.expenses || ''}
                    onChange={(e) => handleInputChange('expenses', e.target.value)}
                    className="border-2 p-3 rounded-lg text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="loan_amount" className="text-lg font-semibold">
                    Annual Loan Payment (₦)
                  </Label>
                  <Input
                    id="loan_amount"
                    type="number"
                    placeholder="1,800,000"
                    value={inputs.loan_amount || ''}
                    onChange={(e) => handleInputChange('loan_amount', e.target.value)}
                    className="border-2 p-3 rounded-lg text-lg"
                  />
                </div>
              </div>

              {/* Advanced Fields */}
              {mode === 'advanced' && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center space-x-2">
                      <Target className="h-5 w-5" />
                      <span>Advanced Parameters</span>
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cap_rate" className="text-sm font-medium">
                          Target Cap Rate (%)
                        </Label>
                        <Input
                          id="cap_rate"
                          type="number"
                          placeholder="8"
                          value={inputs.cap_rate || ''}
                          onChange={(e) => handleInputChange('cap_rate', e.target.value)}
                          className="border-2 p-2 rounded-lg"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="vacancy_rate" className="text-sm font-medium">
                          Vacancy Rate (%)
                        </Label>
                        <Input
                          id="vacancy_rate"
                          type="number"
                          placeholder="10"
                          value={inputs.vacancy_rate || ''}
                          onChange={(e) => handleInputChange('vacancy_rate', e.target.value)}
                          className="border-2 p-2 rounded-lg"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="appreciation_rate" className="text-sm font-medium">
                        Expected Appreciation Rate (%)
                      </Label>
                      <Input
                        id="appreciation_rate"
                        type="number"
                        placeholder="3"
                        value={inputs.appreciation_rate || ''}
                        onChange={(e) => handleInputChange('appreciation_rate', e.target.value)}
                        className="border-2 p-2 rounded-lg"
                      />
                    </div>
                  </div>
                </>
              )}

              <Button
                onClick={calculateROI}
                disabled={loading}
                className="w-full bg-blue-600 text-white rounded-lg p-3 hover:bg-blue-700 text-lg font-semibold"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Calculating...
                  </>
                ) : (
                  <>
                    <Calculator className="mr-2 h-5 w-5" />
                    Calculate ROI
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results Panel */}
          <Card className="rounded-2xl shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-2xl">
              <CardTitle className="flex items-center space-x-2 text-xl">
                <BarChart3 className="h-6 w-6" />
                <span>ROI Results</span>
              </CardTitle>
              <CardDescription className="text-green-100">
                Your investment performance analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {results ? (
                <div className="space-y-6">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-lg font-semibold text-gray-700">ROI Percentage</span>
                        {(() => {
                          const indicator = getPerformanceIndicator(results.roi_percentage, 'roi');
                          const Icon = indicator.icon;
                          return (
                            <Badge variant="outline" className={`${indicator.color} border-current`}>
                              <Icon className="w-3 h-3 mr-1" />
                              {indicator.text}
                            </Badge>
                          );
                        })()}
                      </div>
                      <div className="text-3xl font-bold text-green-600">
                        {formatPercentage(results.roi_percentage)}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Your expected ROI is {formatPercentage(results.roi_percentage)}, which means you will recover your investment in {results.payback_period.toFixed(1)} years.
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-lg font-semibold text-gray-700">Cash Flow</span>
                        {(() => {
                          const indicator = getPerformanceIndicator(results.cash_flow, 'cash_flow');
                          const Icon = indicator.icon;
                          return (
                            <Badge variant="outline" className={`${indicator.color} border-current`}>
                              <Icon className="w-3 h-3 mr-1" />
                              {indicator.text}
                            </Badge>
                          );
                        })()}
                      </div>
                      <div className="text-3xl font-bold text-blue-600">
                        {formatCurrency(results.cash_flow)}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Annual cash flow after all expenses and loan payments.
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-lg font-semibold text-gray-700">Payback Period</span>
                        {(() => {
                          const indicator = getPerformanceIndicator(results.payback_period, 'payback');
                          const Icon = indicator.icon;
                          return (
                            <Badge variant="outline" className={`${indicator.color} border-current`}>
                              <Icon className="w-3 h-3 mr-1" />
                              {indicator.text}
                            </Badge>
                          );
                        })()}
                      </div>
                      <div className="text-3xl font-bold text-purple-600">
                        {results.payback_period.toFixed(1)} years
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Time to recover your initial investment.
                      </p>
                    </div>
                  </div>

                  {/* Additional Metrics */}
                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-gray-800">Additional Metrics</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Net Income:</span>
                        <span className="font-semibold">{formatCurrency(results.net_income)}</span>
                      </div>
                      {results.adjusted_roi && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Adjusted ROI:</span>
                          <span className="font-semibold">{formatPercentage(results.adjusted_roi)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Cap Rate Analysis */}
                  {results.cap_rate_analysis && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <h4 className="text-lg font-semibold text-blue-800 mb-2 flex items-center space-x-2">
                        <Info className="h-5 w-5" />
                        <span>Cap Rate Analysis</span>
                      </h4>
                      <p className="text-blue-700">{results.cap_rate_analysis}</p>
                    </div>
                  )}

                  {/* Investment Summary */}
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <h4 className="text-lg font-semibold text-green-800 mb-2">Investment Summary</h4>
                    <p className="text-green-700">
                      Based on your inputs, this property shows a {formatPercentage(results.roi_percentage)} return on investment. 
                      {results.cash_flow > 0 
                        ? ` You'll generate positive cash flow of ${formatCurrency(results.cash_flow)} annually.`
                        : ` Note: This property has negative cash flow of ${formatCurrency(Math.abs(results.cash_flow))} annually.`
                      }
                      {results.payback_period <= 10 
                        ? ` The payback period of ${results.payback_period.toFixed(1)} years is reasonable for real estate investment.`
                        : ` The payback period of ${results.payback_period.toFixed(1)} years is quite long - consider if this aligns with your investment goals.`
                      }
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Calculator className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Enter your property details and click "Calculate ROI" to see results</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FastAPIRoiCalculator;
