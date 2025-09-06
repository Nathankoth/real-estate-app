import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Calculator, TrendingUp, TrendingDown, DollarSign, PlusCircle, Calendar } from 'lucide-react';
import { useROIEntries } from '@/hooks/useROIEntries';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const ROICalculator = () => {
  const [propertyName, setPropertyName] = useState('');
  const [month, setMonth] = useState('');
  const [income, setIncome] = useState('');
  const [expenses, setExpenses] = useState('');
  const { entries, loading, addEntry } = useROIEntries();
  const { toast } = useToast();

  const handleAddEntry = async () => {
    if (!propertyName || !month || !income || !expenses) {
      toast({
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
      toast({
        title: "Entry Added",
        description: "ROI entry has been saved successfully"
      });
      setPropertyName('');
      setMonth('');
      setIncome('');
      setExpenses('');
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to add entry",
        variant: "destructive"
      });
    }
  };

  // Prepare chart data
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
      <div>
        <h1 className="text-3xl font-bold">ROI Calculator & Tracker</h1>
        <p className="text-muted-foreground">
          Track monthly property performance and visualize ROI trends over time
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

      <Tabs defaultValue="add-entry" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="add-entry">Add Entry</TabsTrigger>
          <TabsTrigger value="trends">ROI Trends</TabsTrigger>
          <TabsTrigger value="entries">All Entries</TabsTrigger>
        </TabsList>

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
              {loading ? (
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