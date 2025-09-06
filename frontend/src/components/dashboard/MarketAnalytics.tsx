import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TrendingUp, TrendingDown, BarChart3, MapPin, DollarSign, Home, Users, Search, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const MarketAnalytics = () => {
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [marketData, setMarketData] = useState<any>(null);
  const { toast } = useToast();

  const analyzeMarket = async () => {
    if (!location.trim()) {
      toast({
        title: "Location Required",
        description: "Please enter a location to analyze",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('market-analytics', {
        body: { address: location }
      });

      if (error) throw error;
      
      setMarketData(data);
      toast({
        title: "Analysis Complete",
        description: "Market data has been retrieved successfully"
      });
    } catch (error) {
      console.error('Market analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: "Unable to retrieve market data. Please try again.",
        variant: "destructive"
      });
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
      <div className="flex flex-col space-y-4">
        <div>
          <h1 className="text-3xl font-bold">Market Analytics</h1>
          <p className="text-muted-foreground">
            Real-time market data and insights for informed investment decisions
          </p>
        </div>
        
        {/* Search Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Market Search</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <div className="flex-1 space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="Enter address, city, or ZIP code"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && analyzeMarket()}
                />
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={analyzeMarket} 
                  disabled={loading}
                  className="min-w-[140px]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Analyze Market
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Market Data Results */}
      {marketData && (
        <>
          {/* Market Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Market Price</p>
                    <p className="text-2xl font-bold">{formatCurrency(marketData.marketPrice)}</p>
                    <p className="text-xs text-muted-foreground">Estimated value</p>
                  </div>
                  <DollarSign className="h-6 w-6 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Estimated Rent</p>
                    <p className="text-2xl font-bold">{formatCurrency(marketData.estimatedRent)}</p>
                    <p className="text-xs text-muted-foreground">Per month</p>
                  </div>
                  <Home className="h-6 w-6 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Market Growth</p>
                    <p className="text-2xl font-bold">{marketData.growthRate}</p>
                    <p className="text-xs text-muted-foreground">Annual rate</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={marketData.marketTrend === 'up' ? 'default' : 'secondary'}>
                      {marketData.marketTrend === 'up' ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {marketData.growthRate}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Days on Market</p>
                    <p className="text-2xl font-bold">{marketData.daysOnMarket}</p>
                    <p className="text-xs text-muted-foreground">Average time</p>
                  </div>
                  <BarChart3 className="h-6 w-6 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Neighborhood Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Neighborhood Analysis</span>
              </CardTitle>
              <CardDescription>
                Local market insights for {marketData.address}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Market Overview</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Neighborhood:</span>
                      <span className="font-medium">{marketData.neighborhood.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Comparable Properties:</span>
                      <span className="font-medium">{marketData.comparableProperties}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Area Average:</span>
                      <span className="font-medium">{formatCurrency(marketData.neighborhood.averagePrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Market Inventory:</span>
                      <span className="font-medium">{marketData.neighborhood.inventory} properties</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium">Investment Metrics</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="font-medium">Monthly Cash Flow</div>
                      <div className="text-sm text-muted-foreground">
                        Estimated: {formatCurrency(marketData.estimatedRent - (marketData.marketPrice * 0.004))}
                      </div>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="font-medium">Cap Rate</div>
                      <div className="text-sm text-muted-foreground">
                        Estimated: {((marketData.estimatedRent * 12) / marketData.marketPrice * 100).toFixed(2)}%
                      </div>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="font-medium">Market Activity</div>
                      <div className="text-sm text-muted-foreground">
                        {marketData.daysOnMarket < 30 ? 'High' : marketData.daysOnMarket < 60 ? 'Moderate' : 'Low'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Market Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>AI Market Insights</span>
              </CardTitle>
              <CardDescription>
                Automated analysis of current market conditions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Key Findings</h4>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        marketData.marketTrend === 'up' ? 'bg-green-500' : 'bg-yellow-500'
                      }`}></div>
                      <div>
                        <p className="font-medium">Market Trend</p>
                        <p className="text-sm text-muted-foreground">
                          {marketData.marketTrend === 'up' 
                            ? `Property values are appreciating at ${marketData.growthRate} annually`
                            : `Market is experiencing slower growth at ${marketData.growthRate}`
                          }
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        marketData.daysOnMarket < 30 ? 'bg-green-500' : 'bg-yellow-500'
                      }`}></div>
                      <div>
                        <p className="font-medium">Market Liquidity</p>
                        <p className="text-sm text-muted-foreground">
                          Properties sell in {marketData.daysOnMarket} days on average
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium">Investment Potential</p>
                        <p className="text-sm text-muted-foreground">
                          {((marketData.estimatedRent * 12) / marketData.marketPrice * 100) > 6 
                            ? 'Strong rental yield potential for investors'
                            : 'Moderate rental yield, focus on appreciation'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium">Recommendations</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="font-medium">For Buyers</p>
                      <p className="text-sm text-muted-foreground">
                        {marketData.marketTrend === 'up' 
                          ? 'Act quickly in this appreciating market'
                          : 'Good opportunity to negotiate on price'
                        }
                      </p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="font-medium">For Investors</p>
                      <p className="text-sm text-muted-foreground">
                        Expected monthly rental income: {formatCurrency(marketData.estimatedRent)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* No Data State */}
      {!marketData && !loading && (
        <Card>
          <CardContent className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Ready to Analyze</h3>
            <p className="text-muted-foreground">
              Enter a location above to get comprehensive market insights
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MarketAnalytics;