import React, { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  LineChart, 
  TrendingUp, 
  TrendingDown, 
  Activity,
  PieChart,
  Zap,
  Target,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { COMPANIES } from "@/lib/mockData";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
} from "recharts";

// Generate historical volatility data
const getVolatilityData = () => {
  const data = [];
  let vix = 18;
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    vix += (Math.random() - 0.5) * 3;
    vix = Math.max(10, Math.min(35, vix));
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      vix: Number(vix.toFixed(1)),
    });
  }
  return data;
};

// Market breadth data
const getMarketBreadth = () => {
  const advancing = COMPANIES.filter(c => c.change_percent > 0).length;
  const declining = COMPANIES.filter(c => c.change_percent < 0).length;
  const unchanged = COMPANIES.filter(c => c.change_percent === 0).length;
  
  return { advancing, declining, unchanged, total: COMPANIES.length };
};

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

export default function Analytics() {
  const [activeTab, setActiveTab] = useState("overview");
  
  const volatilityData = useMemo(() => getVolatilityData(), []);
  const marketBreadth = useMemo(() => getMarketBreadth(), []);
  
  const topGainers = useMemo(() => 
    [...COMPANIES].sort((a, b) => b.change_percent - a.change_percent).slice(0, 5), 
  []);
  
  const topLosers = useMemo(() => 
    [...COMPANIES].sort((a, b) => a.change_percent - b.change_percent).slice(0, 5), 
  []);

  const signalDistribution = useMemo(() => {
    const signals: { [key: string]: number } = {};
    COMPANIES.forEach(c => {
      signals[c.signal] = (signals[c.signal] || 0) + 1;
    });
    return Object.entries(signals).map(([name, value]) => ({ name, value }));
  }, []);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <LineChart className="w-8 h-8 text-primary" />
            Market Analytics
          </h2>
          <p className="text-muted-foreground">
            Deep dive into market trends, sector performance, and trading signals.
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-card/50 border-border" data-testid="card-volume">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono">
                {(COMPANIES.reduce((acc, c) => acc + parseFloat(c.volume.replace('M', '')), 0)).toFixed(1)}M
              </div>
              <p className="text-xs text-green-500 flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3" /> +12.4% from yesterday
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 border-border" data-testid="card-volatility">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">VIX Index</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono">
                {volatilityData[volatilityData.length - 1]?.vix}
              </div>
              <p className="text-xs text-muted-foreground">
                Fear & Greed: <span className="text-yellow-500 font-medium">Neutral</span>
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border" data-testid="card-breadth">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Market Breadth</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono flex items-center gap-2">
                <span className="text-green-500">{marketBreadth.advancing}</span>
                <span className="text-muted-foreground">/</span>
                <span className="text-red-500">{marketBreadth.declining}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Advancing vs Declining
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border" data-testid="card-signals">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Buy Signals</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono text-green-500">
                {COMPANIES.filter(c => c.signal.includes('BUY')).length}
              </div>
              <p className="text-xs text-muted-foreground">
                of {COMPANIES.length} stocks analyzed
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different views */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-card/50">
            <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
            <TabsTrigger value="movers" data-testid="tab-movers">Top Movers</TabsTrigger>
            <TabsTrigger value="signals" data-testid="tab-signals">Signals</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            {/* Volatility Chart */}
            <Card className="bg-card/50 border-border">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  30-Day Volatility Index
                </CardTitle>
                <CardDescription>Market volatility trend over the past month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={volatilityData}>
                      <defs>
                        <linearGradient id="vixGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#666"
                        tick={{ fill: '#888', fontSize: 11 }}
                        tickLine={false}
                      />
                      <YAxis 
                        stroke="#666"
                        tick={{ fill: '#888', fontSize: 11 }}
                        tickLine={false}
                        domain={['dataMin - 2', 'dataMax + 2']}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1a1a2e', 
                          border: '1px solid #333',
                          borderRadius: '8px'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="vix" 
                        stroke="#3b82f6" 
                        fill="url(#vixGradient)" 
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Market Breadth Visual */}
            <Card className="bg-card/50 border-border">
              <CardHeader>
                <CardTitle className="text-lg">Market Breadth Indicator</CardTitle>
                <CardDescription>Distribution of advancing vs declining stocks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-green-500 font-medium">
                      {marketBreadth.advancing} Advancing ({((marketBreadth.advancing / marketBreadth.total) * 100).toFixed(0)}%)
                    </span>
                    <span className="text-red-500 font-medium">
                      {marketBreadth.declining} Declining ({((marketBreadth.declining / marketBreadth.total) * 100).toFixed(0)}%)
                    </span>
                  </div>
                  <div className="h-4 rounded-full overflow-hidden bg-red-500/20 flex">
                    <div 
                      className="h-full bg-green-500 transition-all duration-500"
                      style={{ width: `${(marketBreadth.advancing / marketBreadth.total) * 100}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Top Movers Tab */}
          <TabsContent value="movers" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Top Gainers */}
              <Card className="bg-card/50 border-border">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-green-500">
                    <TrendingUp className="h-5 w-5" />
                    Top Gainers
                  </CardTitle>
                  <CardDescription>Best performing stocks today</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {topGainers.map((stock, index) => (
                      <div 
                        key={stock.ticker} 
                        className="flex items-center justify-between p-3 rounded-lg bg-green-500/5 border border-green-500/20"
                        data-testid={`gainer-${stock.ticker}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-green-500">#{index + 1}</span>
                          <div>
                            <p className="font-mono font-bold">{stock.ticker}</p>
                            <p className="text-xs text-muted-foreground">{stock.name}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-mono font-bold text-green-500 flex items-center gap-1">
                            <ArrowUpRight className="h-4 w-4" />
                            +{stock.change_percent}%
                          </p>
                          <p className="text-xs text-muted-foreground">{stock.volume} vol</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Losers */}
              <Card className="bg-card/50 border-border">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-red-500">
                    <TrendingDown className="h-5 w-5" />
                    Top Losers
                  </CardTitle>
                  <CardDescription>Worst performing stocks today</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {topLosers.map((stock, index) => (
                      <div 
                        key={stock.ticker} 
                        className="flex items-center justify-between p-3 rounded-lg bg-red-500/5 border border-red-500/20"
                        data-testid={`loser-${stock.ticker}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-red-500">#{index + 1}</span>
                          <div>
                            <p className="font-mono font-bold">{stock.ticker}</p>
                            <p className="text-xs text-muted-foreground">{stock.name}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-mono font-bold text-red-500 flex items-center gap-1">
                            <ArrowDownRight className="h-4 w-4" />
                            {stock.change_percent}%
                          </p>
                          <p className="text-xs text-muted-foreground">{stock.volume} vol</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Signals Tab */}
          <TabsContent value="signals" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="bg-card/50 border-border">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    Signal Distribution
                  </CardTitle>
                  <CardDescription>AI-generated trading signals breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={signalDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={2}
                          dataKey="value"
                          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                          labelLine={false}
                        >
                          {signalDistribution.map((entry, index) => {
                            const colorMap: { [key: string]: string } = {
                              'STRONG BUY': '#22c55e',
                              'BUY': '#4ade80',
                              'HOLD': '#f59e0b',
                              'SELL': '#f87171',
                              'STRONG SELL': '#ef4444',
                            };
                            return (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={colorMap[entry.name] || COLORS[index % COLORS.length]} 
                              />
                            );
                          })}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1a1a2e', 
                            border: '1px solid #333',
                            borderRadius: '8px'
                          }}
                        />
                      </RePieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Signal Breakdown</CardTitle>
                  <CardDescription>Stocks grouped by trading signal</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['STRONG BUY', 'BUY', 'HOLD', 'SELL', 'STRONG SELL'].map(signal => {
                      const stocks = COMPANIES.filter(c => c.signal === signal);
                      const colorClass = signal.includes('BUY') 
                        ? 'text-green-500 bg-green-500/10 border-green-500/20' 
                        : signal === 'HOLD' 
                          ? 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20'
                          : 'text-red-500 bg-red-500/10 border-red-500/20';
                      
                      return (
                        <div key={signal} className={`p-3 rounded-lg border ${colorClass}`}>
                          <div className="flex justify-between items-center mb-2">
                            <Badge variant="outline" className={colorClass}>
                              {signal}
                            </Badge>
                            <span className="text-sm font-mono">{stocks.length} stocks</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {stocks.map(s => (
                              <span 
                                key={s.ticker} 
                                className="text-xs font-mono bg-background/50 px-2 py-1 rounded"
                              >
                                {s.ticker}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
