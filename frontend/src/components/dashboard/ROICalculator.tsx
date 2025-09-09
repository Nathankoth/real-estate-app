import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import CurrencyInput from '@/components/ui/CurrencyInput';
import ExplanationBox from '@/components/ui/ExplanationBox';
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
  XCircle
} from 'lucide-react';
import { toast } from 'sonner';
// Removed old AI explanation hook - using new integrated API

interface SimpleROIResult {
  cap_rate: number;
  noi: number;
  analysis?: string;
}

interface AdvancedROIResult {
  cap_rate: number;
  cash_on_cash: number;
  noi: number;
  dscr: number;
  npv: number;
  irr: number;
  explanation: string[];
  cash_flows: number[];
  terminal_value: number;
  egi: number;
  gross_yield: number;
  pre_tax_cash_flow: number;
}

const ROICalculator = () => {
  // Input states
  const [purchasePrice, setPurchasePrice] = useState('');
  const [grossRentAnnual, setGrossRentAnnual] = useState('');
  const [vacancyRate, setVacancyRate] = useState('10');
  const [operatingExpenses, setOperatingExpenses] = useState('');
  const [annualMortgagePayment, setAnnualMortgagePayment] = useState('');
  const [equity, setEquity] = useState('');
  const [holdYears, setHoldYears] = useState('5');
  const [renovationCost, setRenovationCost] = useState('0');
  
  // Currency state
  const [currency, setCurrency] = useState('$');
  
  // Advanced settings
  const [capLow, setCapLow] = useState('3');
  const [capHigh, setCapHigh] = useState('8');
  const [cocTarget, setCocTarget] = useState('8');
  const [dscrMin, setDscrMin] = useState('1.2');
  const [discountRate, setDiscountRate] = useState('10');
  
  // Advanced inputs
  const [taxRate, setTaxRate] = useState('25');
  const [appreciationRate, setAppreciationRate] = useState('3');
  
  // Results and UI state
  const [loading, setLoading] = useState(false);
  const [simpleResult, setSimpleResult] = useState<SimpleROIResult | null>(null);
  const [advancedResult, setAdvancedResult] = useState<AdvancedROIResult | null>(null);
  const [activeTab, setActiveTab] = useState('simple');
  
  // AI Explanation hook
  // Removed old AI explanation hook - using new integrated API

  // Auto-calculate equity if not provided
  useEffect(() => {
    if (purchasePrice && !equity) {
      const price = parseFloat(purchasePrice);
      if (!isNaN(price)) {
        setEquity((price * 0.2).toString());
      }
    }
  }, [purchasePrice, equity]);

  // Auto-calculate operating expenses if not provided
  useEffect(() => {
    if (grossRentAnnual && !operatingExpenses) {
      const rent = parseFloat(grossRentAnnual);
      if (!isNaN(rent)) {
        setOperatingExpenses((rent * 0.2).toString());
      }
    }
  }, [grossRentAnnual, operatingExpenses]);

  // Clear results when currency changes
  useEffect(() => {
    setSimpleResult(null);
    setAdvancedResult(null);
  }, [currency]);

  // Utility function to clean formatted numbers
  const cleanNumber = (value: string): number => {
    const cleaned = value.replace(/,/g, "").replace(/[^\d.]/g, "");
    return parseFloat(cleaned) || 0;
  };

  const calculateSimpleROI = async () => {
    if (!purchasePrice || !grossRentAnnual) {
      toast.error('Please fill in purchase price and annual rent');
      return;
    }

    setLoading(true);
    try {
      const purchasePriceNum = cleanNumber(purchasePrice);
      const annualRentNum = cleanNumber(grossRentAnnual);
      const operatingExpensesEstimate = annualRentNum * 0.2; // Estimate 20% of rent as expenses
      
      // Call the new unified ROI analysis endpoint
      const response = await fetch('http://localhost:8000/api/roi-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          purchase_price: purchasePriceNum,
          monthly_rent: annualRentNum / 12, // Convert annual to monthly
          monthly_expenses: operatingExpensesEstimate / 12, // Convert annual to monthly
          occupancy_rate: 1 - (parseFloat(vacancyRate) / 100), // Convert vacancy rate to occupancy rate
          hold_years: 5,
          annual_appreciation: 0.03,
          region: currency === '$' ? "USA" : currency === '₦' ? "Nigeria" : currency === '£' ? "UK" : currency === 'C$' ? "Canada" : currency === 'A$' ? "Australia" : "USA",
          currency: currency,
          mode: "simple"
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to calculate simple ROI');
      }

      const data = await response.json();
      
      // Transform the new API response to match the expected format
      const result: SimpleROIResult = {
        cap_rate: data.capRate,
        noi: data.NOI,
        analysis: data.analysis
      };
      
      setSimpleResult(result);
      setAdvancedResult(null); // Clear advanced results
      toast.success('Simple ROI calculated successfully!');
      
    } catch (error) {
      console.error('Error calculating simple ROI:', error);
      toast.error('Failed to calculate ROI. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateAdvancedROI = async () => {
    if (!purchasePrice || !grossRentAnnual) {
      toast.error('Please fill in purchase price and annual rent');
      return;
    }

    setLoading(true);
    try {
      const inputs = {
        purchase_price: cleanNumber(purchasePrice),
        gross_rent_annual: cleanNumber(grossRentAnnual),
        vacancy_rate: parseFloat(vacancyRate) / 100,
        operating_expenses: cleanNumber(operatingExpenses),
        annual_mortgage_payment: cleanNumber(annualMortgagePayment),
        equity: cleanNumber(equity) || cleanNumber(purchasePrice) * 0.2,
        hold_years: parseInt(holdYears),
        renovation_cost: cleanNumber(renovationCost),
        tax_rate: parseFloat(taxRate) / 100,
        appreciation_rate: parseFloat(appreciationRate) / 100
      };

      // Call the new unified ROI analysis endpoint
      const response = await fetch('http://localhost:8000/api/roi-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          purchase_price: inputs.purchase_price,
          monthly_rent: inputs.gross_rent_annual / 12, // Convert annual to monthly
          monthly_expenses: inputs.operating_expenses / 12, // Convert annual to monthly
          occupancy_rate: 1 - inputs.vacancy_rate, // Convert vacancy rate to occupancy rate
          hold_years: inputs.hold_years,
          annual_appreciation: inputs.appreciation_rate,
          region: currency === '$' ? "USA" : currency === '₦' ? "Nigeria" : currency === '£' ? "UK" : currency === 'C$' ? "Canada" : currency === 'A$' ? "Australia" : "USA",
          currency: currency,
          mode: "advanced"
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to calculate advanced ROI');
      }

      const data = await response.json();
      
      // Transform the new API response to match the expected format
      const transformedData = {
        cap_rate: data.capRate,
        cash_on_cash: data.cashOnCash || 0,
        noi: data.NOI,
        dscr: data.dscr || 0,
        npv: 0, // Not provided in new API
        irr: 0, // Not provided in new API
        explanation: [data.analysis], // Convert string to array format
        cash_flows: [], // Not provided in new API
        terminal_value: data.terminalValue || 0,
        egi: data.NOI + (inputs.operating_expenses || 0), // Calculate EGI
        gross_yield: (inputs.gross_rent_annual / inputs.purchase_price) || 0,
        pre_tax_cash_flow: data.NOI - (inputs.annual_mortgage_payment || 0)
      };
      
      setAdvancedResult(transformedData);
      setSimpleResult(null); // Clear simple results
      toast.success('Advanced ROI calculated successfully!');
      
      // Fetch AI explanation
      // AI explanation now integrated into the API response
    } catch (error) {
      console.error('Error calculating advanced ROI:', error);
      toast.error('Failed to calculate ROI. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    const currencyMap = {
      '$': { locale: 'en-US', currency: 'USD' },
      '₦': { locale: 'en-NG', currency: 'NGN' },
      '£': { locale: 'en-GB', currency: 'GBP' },
      'C$': { locale: 'en-CA', currency: 'CAD' },
      'A$': { locale: 'en-AU', currency: 'AUD' }
    };
    
    const config = currencyMap[currency as keyof typeof currencyMap] || currencyMap['$'];
    
    return new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: config.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(2)}%`;
  };

  const getPerformanceBadge = (value: number, threshold: number, type: 'higher' | 'lower' = 'higher') => {
    const isGood = type === 'higher' ? value >= threshold : value <= threshold;
    return (
      <Badge variant={isGood ? 'default' : 'destructive'} className="ml-2">
        {isGood ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
        {isGood ? 'Good' : 'Needs Attention'}
      </Badge>
    );
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">ROI Calculator</h1>
          <p className="text-muted-foreground">
            Calculate property investment returns with advanced metrics
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {/* Global Currency Selector */}
          <div className="flex items-center space-x-2">
            <Label htmlFor="global-currency" className="text-sm font-medium">Currency:</Label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="₦">₦ (Naira)</SelectItem>
                <SelectItem value="$">$ (USD)</SelectItem>
                <SelectItem value="€">€ (Euro)</SelectItem>
                <SelectItem value="£">£ (GBP)</SelectItem>
                <SelectItem value="R">R (Rand)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Calculator className="h-8 w-8 text-primary" />
            <Badge variant="outline" className="text-sm">
              Professional Grade
            </Badge>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="simple" className="flex items-center space-x-2">
            <Home className="h-4 w-4" />
            <span>Simple (Beginner)</span>
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center space-x-2">
            <Building2 className="h-4 w-4" />
            <span>Advanced (Pro)</span>
          </TabsTrigger>
        </TabsList>

        {/* Simple Calculator */}
        <TabsContent value="simple" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calculator className="h-5 w-5" />
                  <span>Property Details</span>
                </CardTitle>
                <CardDescription>
                  Perfect for beginners - just enter the basics for quick math and essential metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="currency-select">Currency</Label>
                  <select
                    id="currency-select"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="$">USD ($)</option>
                    <option value="₦">NGN (₦)</option>
                    <option value="£">GBP (£)</option>
                    <option value="C$">CAD (C$)</option>
                    <option value="A$">AUD (A$)</option>
                  </select>
                </div>
                
                <CurrencyInput
                  label="Purchase Price"
                  value={purchasePrice}
                  onChange={setPurchasePrice}
                  placeholder="50,000,000"
                  currency={currency}
                  className="text-lg"
                />

                <CurrencyInput
                  label="Annual Rent"
                  value={grossRentAnnual}
                  onChange={setGrossRentAnnual}
                  placeholder="3,000,000"
                  currency={currency}
                />

                <div className="space-y-2">
                  <Label htmlFor="vacancy-rate">Vacancy Rate (%)</Label>
                  <Input
                    id="vacancy-rate"
                    type="number"
                    placeholder="10"
                    value={vacancyRate}
                    onChange={(e) => setVacancyRate(e.target.value)}
                    className="p-3"
                  />
                </div>

                <Button 
                  onClick={calculateSimpleROI} 
                  disabled={loading}
                  className="w-full h-12 text-lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Calculating...
                    </>
                  ) : (
                    <>
                      <Calculator className="mr-2 h-4 w-4" />
                      Calculate Simple ROI
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Results Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>ROI Results</span>
                </CardTitle>
                <CardDescription>
                  Key performance metrics for your investment
                </CardDescription>
              </CardHeader>
              <CardContent>
                {simpleResult ? (
                  <div className="space-y-6">
                    {/* Key Metrics - Simple (Only Cap Rate and NOI) */}
                    <div className="grid grid-cols-1 gap-6">
                      <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                        <div className="flex items-center justify-center space-x-2 mb-2">
                          <span className="text-sm font-medium text-blue-700">Cap Rate</span>
                          {getPerformanceBadge(simpleResult.cap_rate, 0.05, 'higher')}
                        </div>
                        <div className="text-4xl font-bold text-blue-900">
                          {formatPercentage(simpleResult.cap_rate)}
                        </div>
                        <p className="text-xs text-blue-600 mt-1">Annual return on property value</p>
                      </div>
                      
                      <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                        <div className="flex items-center justify-center space-x-2 mb-2">
                          <span className="text-sm font-medium text-green-700">Net Operating Income (NOI)</span>
                        </div>
                        <div className="text-4xl font-bold text-green-900">
                          {formatCurrency(simpleResult.noi)}
                        </div>
                        <p className="text-xs text-green-600 mt-1">Annual income after expenses</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Enter property details and click "Calculate Simple ROI" to see results</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* AI Investment Analysis - Full Width */}
          {simpleResult?.analysis && (
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>AI Investment Analysis</span>
                </CardTitle>
                <CardDescription>
                  Professional market analysis and investment insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
                  <div className="text-sm text-blue-800 whitespace-pre-line leading-relaxed">
                    {simpleResult.analysis}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Advanced Calculator */}
        <TabsContent value="advanced" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Input Panel */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building2 className="h-5 w-5" />
                  <span>Advanced Property Analysis</span>
                </CardTitle>
                <CardDescription>
                  Professional-grade inputs for detailed financial modeling and comprehensive ROI analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-2">
                  <Label htmlFor="currency-select-advanced">Currency</Label>
                  <select
                    id="currency-select-advanced"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="$">USD ($)</option>
                    <option value="₦">NGN (₦)</option>
                    <option value="£">GBP (£)</option>
                    <option value="C$">CAD (C$)</option>
                    <option value="A$">AUD (A$)</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <CurrencyInput
                    label="Purchase Price"
                    value={purchasePrice}
                    onChange={setPurchasePrice}
                    placeholder="50,000,000"
                    currency={currency}
                  />
                  <CurrencyInput
                    label="Annual Rent"
                    value={grossRentAnnual}
                    onChange={setGrossRentAnnual}
                    placeholder="3,000,000"
                    currency={currency}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="adv-vacancy-rate">Vacancy Rate (%)</Label>
                    <Input
                      id="adv-vacancy-rate"
                      type="number"
                      placeholder="10"
                      value={vacancyRate}
                      onChange={(e) => setVacancyRate(e.target.value)}
                    />
                  </div>
                  <CurrencyInput
                    label="Operating Expenses"
                    value={operatingExpenses}
                    onChange={setOperatingExpenses}
                    placeholder="600,000"
                    currency={currency}
                  />
                  <CurrencyInput
                    label="Mortgage Payment"
                    value={annualMortgagePayment}
                    onChange={setAnnualMortgagePayment}
                    placeholder="1,800,000"
                    currency={currency}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <CurrencyInput
                    label="Equity"
                    value={equity}
                    onChange={setEquity}
                    placeholder="10,000,000"
                    currency={currency}
                  />
                  <div className="space-y-2">
                    <Label htmlFor="adv-hold-years">Hold Period (Years)</Label>
                    <Input
                      id="adv-hold-years"
                      type="number"
                      placeholder="5"
                      value={holdYears}
                      onChange={(e) => setHoldYears(e.target.value)}
                    />
                  </div>
                  <CurrencyInput
                    label="Renovation Cost"
                    value={renovationCost}
                    onChange={setRenovationCost}
                    placeholder="0"
                    currency={currency}
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium flex items-center space-x-2">
                    <Target className="h-4 w-4" />
                    <span>Tax & Appreciation Assumptions</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tax-rate">Tax Rate (%)</Label>
                      <Input
                        id="tax-rate"
                        type="number"
                        placeholder="25"
                        value={taxRate}
                        onChange={(e) => setTaxRate(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="appreciation-rate">Appreciation Rate (%)</Label>
                      <Input
                        id="appreciation-rate"
                        type="number"
                        placeholder="3"
                        value={appreciationRate}
                        onChange={(e) => setAppreciationRate(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium flex items-center space-x-2">
                    <Target className="h-4 w-4" />
                    <span>Market Parameters</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cap-low">Cap Rate Low (%)</Label>
                      <Input
                        id="cap-low"
                        type="number"
                        placeholder="3"
                        value={capLow}
                        onChange={(e) => setCapLow(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cap-high">Cap Rate High (%)</Label>
                      <Input
                        id="cap-high"
                        type="number"
                        placeholder="8"
                        value={capHigh}
                        onChange={(e) => setCapHigh(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="coc-target">Cash-on-Cash Target (%)</Label>
                      <Input
                        id="coc-target"
                        type="number"
                        placeholder="8"
                        value={cocTarget}
                        onChange={(e) => setCocTarget(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dscr-min">DSCR Minimum</Label>
                      <Input
                        id="dscr-min"
                        type="number"
                        placeholder="1.2"
                        value={dscrMin}
                        onChange={(e) => setDscrMin(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={calculateAdvancedROI} 
                  disabled={loading}
                  className="w-full h-12 text-lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Calculating...
                    </>
                  ) : (
                    <>
                      <Calculator className="mr-2 h-4 w-4" />
                      Calculate Advanced ROI
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Results Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Advanced Results</span>
                </CardTitle>
                <CardDescription>
                  Comprehensive investment analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                {advancedResult ? (
                  <div className="space-y-6">
                    {/* Primary Metrics - Professional Grade */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                        <div className="flex items-center justify-center space-x-2 mb-2">
                          <span className="text-sm font-medium text-blue-700">Cap Rate</span>
                          {getPerformanceBadge(advancedResult.cap_rate, 0.05, 'higher')}
                        </div>
                        <div className="text-2xl font-bold text-blue-900">
                          {formatPercentage(advancedResult.cap_rate)}
                        </div>
                      </div>
                      
                      <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                        <div className="flex items-center justify-center space-x-2 mb-2">
                          <span className="text-sm font-medium text-green-700">NOI</span>
                        </div>
                        <div className="text-2xl font-bold text-green-900">
                          {formatCurrency(advancedResult.noi)}
                        </div>
                      </div>
                    </div>

                    {/* Advanced Financial Metrics */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg border border-purple-200">
                        <div className="flex items-center justify-center space-x-2 mb-2">
                          <span className="text-sm font-medium text-purple-700">DSCR</span>
                          {getPerformanceBadge(advancedResult.dscr, 1.2, 'higher')}
                        </div>
                        <div className="text-2xl font-bold text-purple-900">
                          {advancedResult.dscr.toFixed(2)}
                        </div>
                      </div>
                      
                      <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg border border-orange-200">
                        <div className="flex items-center justify-center space-x-2 mb-2">
                          <span className="text-sm font-medium text-orange-700">Cash-on-Cash</span>
                          {getPerformanceBadge(advancedResult.cash_on_cash, 0.08, 'higher')}
                        </div>
                        <div className="text-2xl font-bold text-orange-900">
                          {formatPercentage(advancedResult.cash_on_cash)}
                        </div>
                      </div>
                    </div>

                    {/* Professional Metrics */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-gradient-to-br from-red-50 to-rose-50 rounded-lg border border-red-200">
                        <div className="flex items-center justify-center space-x-2 mb-2">
                          <span className="text-sm font-medium text-red-700">IRR</span>
                        </div>
                        <div className="text-2xl font-bold text-red-900">
                          {formatPercentage(advancedResult.irr)}
                        </div>
                        <p className="text-xs text-red-600 mt-1">Internal Rate of Return</p>
                      </div>
                      
                      <div className="text-center p-4 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg border border-teal-200">
                        <div className="flex items-center justify-center space-x-2 mb-2">
                          <span className="text-sm font-medium text-teal-700">Terminal Value</span>
                        </div>
                        <div className="text-2xl font-bold text-teal-900">
                          {formatCurrency(advancedResult.terminal_value)}
                        </div>
                        <p className="text-xs text-teal-600 mt-1">Future property value</p>
                      </div>
                    </div>

                    <Separator />

                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Enter property details and click "Calculate Advanced ROI" to see comprehensive results</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* AI Investment Analysis - Full Width */}
          {advancedResult?.explanation && (
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>AI Investment Analysis</span>
                </CardTitle>
                <CardDescription>
                  Professional market analysis and comprehensive investment insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
                  <div className="text-sm text-blue-800 whitespace-pre-line leading-relaxed">
                    {advancedResult.explanation[0]}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Explanation Box */}
      <ExplanationBox />
    </div>
  );
};

export default ROICalculator;
