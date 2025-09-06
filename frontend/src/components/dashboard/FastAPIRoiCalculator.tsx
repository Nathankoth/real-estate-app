import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calculator, TrendingUp, TrendingDown, DollarSign, Loader2 } from 'lucide-react';
import { financeApi } from '@/lib/api';
import { toast } from 'sonner';

const FastAPIRoiCalculator = () => {
  const [purchasePrice, setPurchasePrice] = useState('');
  const [monthlyRent, setMonthlyRent] = useState('');
  const [monthlyExpenses, setMonthlyExpenses] = useState('');
  const [loading, setLoading] = useState(false);
  const [roiData, setRoiData] = useState<any>(null);

  const handleCalculateROI = async () => {
    if (!purchasePrice || !monthlyRent || !monthlyExpenses) {
      toast.error('Please fill in all fields');
      return;
    }

    const purchasePriceNum = parseFloat(purchasePrice);
    const monthlyRentNum = parseFloat(monthlyRent);
    const monthlyExpensesNum = parseFloat(monthlyExpenses);

    if (isNaN(purchasePriceNum) || isNaN(monthlyRentNum) || isNaN(monthlyExpensesNum)) {
      toast.error('Please enter valid numbers');
      return;
    }

    setLoading(true);
    try {
      const response = await financeApi.calculateROI({
        purchase_price: purchasePriceNum,
        monthly_rent: monthlyRentNum,
        monthly_expenses: monthlyExpensesNum,
      });

      setRoiData(response);
      toast.success('ROI calculated successfully!');
    } catch (error) {
      console.error('ROI calculation error:', error);
      toast.error('Failed to calculate ROI. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Calculator className="h-8 w-8" />
          ROI Calculator (FastAPI)
        </h1>
        <p className="text-muted-foreground">
          Calculate return on investment for your real estate properties using AI-powered analysis
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle>Property Investment Details</CardTitle>
            <CardDescription>
              Enter your property details to calculate ROI and get investment insights
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="purchase-price">Purchase Price</Label>
              <Input
                id="purchase-price"
                type="number"
                placeholder="500000"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthly-rent">Monthly Rent</Label>
              <Input
                id="monthly-rent"
                type="number"
                placeholder="3000"
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthly-expenses">Monthly Expenses</Label>
              <Input
                id="monthly-expenses"
                type="number"
                placeholder="800"
                value={monthlyExpenses}
                onChange={(e) => setMonthlyExpenses(e.target.value)}
              />
            </div>

            <Button 
              onClick={handleCalculateROI} 
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Calculating...
                </>
              ) : (
                <>
                  <Calculator className="h-4 w-4 mr-2" />
                  Calculate ROI
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-6">
          {roiData ? (
            <>
              {/* ROI Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    ROI Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">Cap Rate</p>
                      <p className="text-2xl font-bold text-primary">
                        {(roiData.metrics.cap_rate * 100).toFixed(2)}%
                      </p>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">Cash on Cash</p>
                      <p className="text-2xl font-bold text-primary">
                        {(roiData.metrics.cash_on_cash * 100).toFixed(2)}%
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">Net Operating Income</p>
                      <p className="text-xl font-bold text-green-600">
                        {formatCurrency(roiData.metrics.NOI)}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">Annual Cash Flow</p>
                      <p className="text-xl font-bold text-green-600">
                        {formatCurrency(roiData.metrics.annual_cash_flow)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Investment Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Investment Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Purchase Price:</span>
                      <span className="font-medium">{formatCurrency(parseFloat(purchasePrice))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Monthly Rent:</span>
                      <span className="font-medium">{formatCurrency(parseFloat(monthlyRent))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Monthly Expenses:</span>
                      <span className="font-medium">{formatCurrency(parseFloat(monthlyExpenses))}</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Net Operating Income:</span>
                        <span className="font-bold text-green-600">
                          {formatCurrency(roiData.metrics.NOI)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* AI Investment Analysis */}
              {roiData.summary && (
                <Card>
                  <CardHeader>
                    <CardTitle>AI Investment Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      <p className="text-muted-foreground whitespace-pre-wrap">
                        {roiData.summary}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calculator className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Calculate Your ROI</h3>
                <p className="text-muted-foreground text-center">
                  Enter your property details to get AI-powered ROI analysis and investment insights
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default FastAPIRoiCalculator;
