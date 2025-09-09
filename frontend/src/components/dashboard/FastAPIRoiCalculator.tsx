import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Calculator, TrendingUp, TrendingDown, DollarSign, Loader2, PlusCircle, Calendar } from 'lucide-react';
import { financeApi } from '@/lib/api';
import { useROIEntries } from '@/hooks/useROIEntries';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { toast } from 'sonner';
// Removed old AI explanation hook - using new integrated APIb 

const ROICalculator = () => {
  // FastAPI ROI Calculator state
  const [purchasePrice, setPurchasePrice] = useState('');
  const [monthlyRent, setMonthlyRent] = useState('');
  const [monthlyExpenses, setMonthlyExpenses] = useState('');
  const [loading, setLoading] = useState(false);
  const [roiData, setRoiData] = useState<any>(null);

  // ROI Tracker state
  const [propertyName, setPropertyName] = useState('');
  const [month, setMonth] = useState('');
  const [income, setIncome] = useState('');
  const [expenses, setExpenses] = useState('');
  const { entries, loading: entriesLoading, addEntry } = useROIEntries();
  const { toast: toastHook } = useToast();

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
        occupancy_rate: 0.9,
        hold_years: 5,
        annual_appreciation: 0.03,
        region: "USA",
        currency: "$",
        mode: "simple"
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

  const handleAddEntry = async () => {
    if (!propertyName || !month || !income || !expenses) {
      toastHook({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    const incomeNum = parseFloat(income);
    const expensesNum = parseFloat(expenses);
    const roi = ((incomeNum - expensesNum) / expensesNum) * 100;

    const result = await addEntry({
      property_name: propertyName,
      month,
      income: incomeNum,
      expenses: expensesNum,
      roi
    });

    if (result.success) {
      toastHook({
        title: "Entry Added",
        description: "ROI entry has been saved successfully"
      });
      setPropertyName('');
      setMonth('');
      setIncome('');
      setExpenses('');
    } else {
      toastHook({
        title: "Error",
        description: result.error || "Failed to add entry",
        variant: "destructive"
      });
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

  // Prepare chart data for ROI tracker
  const chartData = entries
    .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
    .map(entry => ({
      month: format(new Date(entry.month), 'MMM yyyy'),
      roi: entry.roi,
      income: entry.income,
      expenses: entry.expenses,
      profit: entry.income - entry.expenses
    }));

  const totalProperties = new Set(entries.map(e => e.property_name)).size;
  const avgROI = entries.length > 0 ? entries.reduce((sum, e) => sum + e.roi, 0) / entries.length : 0;
  const totalProfit = entries.reduce((sum, e) => sum + (e.income - e.expenses), 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Calculator className="h-8 w-8" />
          ROI Calculator & Tracker
        </h1>
        <p className="text-muted-foreground">
          Calculate return on investment for your real estate properties and track performance over time
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Properties Tracked</p>
                <p className="text-2xl font-bold">{totalProperties}</p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average ROI</p>
                <p className="text-2xl font-bold">{avgROI.toFixed(1)}%</p>
              </div>
              <div className="flex items-center">
                {avgROI >= 0 ? (
                  <TrendingUp className="h-5 w-5 text-green-500" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-500" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Profit</p>
                <p className="text-2xl font-bold">${totalProfit.toLocaleString()}</p>
              </div>
              <Calculator className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="calculator" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="calculator">ROI Calculator</TabsTrigger>
          <TabsTrigger value="add-entry">Add Entry</TabsTrigger>
          <TabsTrigger value="trends">ROI Trends</TabsTrigger>
          <TabsTrigger value="entries">All Entries</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <Card>
              <CardHeader>
                <CardTitle>Property Investment Details</CardTitle>
                <CardDescription>
                  Enter your property details to calculate ROI and get AI-powered investment insights
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
                            {((roiData as any).capRate * 100).toFixed(2)}%
                          </p>
                        </div>
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <p className="text-sm text-muted-foreground">Net Operating Income</p>
                          <p className="text-xl font-bold text-green-600">
                            {formatCurrency((roiData as any).NOI)}
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
                              {formatCurrency((roiData as any).NOI)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* AI Investment Analysis */}
                  {(roiData as any).analysis && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <TrendingUp className="h-5 w-5" />
                          <span>AI Investment Analysis</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                            {(roiData as any).analysis}
                          </div>
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
        </TabsContent>

        <TabsContent value="add-entry">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PlusCircle className="h-5 w-5" />
                <span>Add Monthly ROI Entry</span>
              </CardTitle>
              <CardDescription>
                Record monthly income and expenses to track property performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="property-name">Property Name</Label>
                    <Input
                      id="property-name"
                      placeholder="e.g., Main Street Rental"
                      value={propertyName}
                      onChange={(e) => setPropertyName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="month">Month</Label>
                    <Input
                      id="month"
                      type="month"
                      value={month}
                      onChange={(e) => setMonth(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="income">Monthly Income</Label>
                    <Input
                      id="income"
                      type="number"
                      placeholder="2500"
                      value={income}
                      onChange={(e) => setIncome(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expenses">Monthly Expenses</Label>
                    <Input
                      id="expenses"
                      type="number"
                      placeholder="1200"
                      value={expenses}
                      onChange={(e) => setExpenses(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <Button onClick={handleAddEntry} className="w-full">
                  Add ROI Entry
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>ROI Performance Trends</CardTitle>
              <CardDescription>
                Visualize your property performance over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <div className="space-y-8">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value, name) => [
                          name === 'roi' ? `${value}%` : `$${value}`,
                          name === 'roi' ? 'ROI' : name === 'income' ? 'Income' : 'Expenses'
                        ]} />
                        <Line type="monotone" dataKey="roi" stroke="hsl(var(--primary))" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                        <Bar dataKey="income" fill="hsl(var(--primary))" name="Income" />
                        <Bar dataKey="expenses" fill="hsl(var(--muted))" name="Expenses" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Data Yet</h3>
                  <p className="text-muted-foreground">Add some ROI entries to see trends</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="entries">
          <Card>
            <CardHeader>
              <CardTitle>All ROI Entries</CardTitle>
              <CardDescription>
                Complete history of your property performance records
              </CardDescription>
            </CardHeader>
            <CardContent>
              {entriesLoading ? (
                <div className="text-center py-8">Loading entries...</div>
              ) : entries.length > 0 ? (
                <div className="space-y-4">
                  {entries.map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <h4 className="font-medium">{entry.property_name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(entry.month), 'MMMM yyyy')}
                        </p>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="flex items-center space-x-4">
                          <div className="text-sm">
                            <span className="text-muted-foreground">Income:</span> ${entry.income}
                          </div>
                          <div className="text-sm">
                            <span className="text-muted-foreground">Expenses:</span> ${entry.expenses}
                          </div>
                        </div>
                        <Badge variant={entry.roi >= 0 ? 'default' : 'secondary'}>
                          {entry.roi.toFixed(1)}% ROI
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calculator className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Entries Yet</h3>
                  <p className="text-muted-foreground">Start tracking your property performance</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ROICalculator;