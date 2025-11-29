import React, { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { Layout } from "@/components/Layout";
import { CompanySelector } from "@/components/CompanySelector";
import { StockChart } from "@/components/StockChart";
import { PredictionPanel } from "@/components/PredictionPanel";
import { COMPANIES, generateStockData, generatePredictions, Company, StockPoint } from "@/lib/mockData";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, DollarSign, Activity, BarChart3, Info, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ArticleModal } from "@/components/ArticleModal";
import { Button } from "@/components/ui/button";

export default function StockDetails() {
  const [match, params] = useRoute("/stock/:ticker");
  const [location, setLocation] = useLocation();
  
  const ticker = params?.ticker || "AAPL";
  const company = COMPANIES.find(c => c.ticker === ticker) || COMPANIES[0];

  const [selectedCompany, setSelectedCompany] = useState<Company>(company);
  const [stockData, setStockData] = useState<StockPoint[]>([]);
  const [predictions, setPredictions] = useState<StockPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<{title: string, date: string, summary: string} | null>(null);

  useEffect(() => {
    // Update selected company if URL changes
    const newCompany = COMPANIES.find(c => c.ticker === ticker);
    if (newCompany) {
      setSelectedCompany(newCompany);
    }
  }, [ticker]);

  useEffect(() => {
    setIsLoading(true);
    // Simulate API latency
    setTimeout(() => {
      const history = generateStockData(selectedCompany.ticker);
      const lastPoint = history[history.length - 1];
      const preds = generatePredictions(lastPoint.price, lastPoint.date);
      
      setStockData(history);
      setPredictions(preds);
      setIsLoading(false);
    }, 600);
  }, [selectedCompany]);

  const handleCompanySelect = (company: Company) => {
    setLocation(`/stock/${company.ticker}`);
  };

  const currentPrice = stockData.length > 0 ? stockData[stockData.length - 1].price : 0;
  const isPositive = selectedCompany.change_percent >= 0;

  const mockArticles = [
    {
      id: 1,
      title: `${selectedCompany.name} Q3 Earnings Report Exceeds Expectations`,
      date: "2h ago",
      summary: "Analysts are upgrading targets following a strong performance in the cloud sector, with revenue up 15% year-over-year."
    },
    {
      id: 2,
      title: "Tech Sector Rally Continues Amidst Rate Cut Hopes",
      date: "5h ago",
      summary: "Market sentiment remains bullish as the Federal Reserve signals potential rate cuts in the coming quarter."
    }
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="pl-0 hover:pl-2 transition-all text-muted-foreground hover:text-primary"
          onClick={() => setLocation("/")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Market
        </Button>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              {selectedCompany.name}
              <Badge variant="outline" className="text-lg py-1 px-3 font-mono bg-accent/50 border-accent-foreground/20">
                {selectedCompany.ticker}
              </Badge>
            </h2>
            <p className="text-muted-foreground mt-1">{selectedCompany.sector} • Market Cap: {selectedCompany.market_cap}</p>
          </div>
          <CompanySelector 
            companies={COMPANIES} 
            selectedCompany={selectedCompany} 
            onSelect={handleCompanySelect} 
          />
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-card/50 border-border shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <p className="text-sm font-medium text-muted-foreground">Current Price</p>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-mono font-bold">${currentPrice.toFixed(2)}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 border-border shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <p className="text-sm font-medium text-muted-foreground">Daily Change</p>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className={cn(
                "text-2xl font-mono font-bold flex items-center gap-1",
                isPositive ? "text-green-500" : "text-red-500"
              )}>
                {isPositive ? "+" : ""}{selectedCompany.change_percent}%
                {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 border-border shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <p className="text-sm font-medium text-muted-foreground">Volume</p>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-mono font-bold">{selectedCompany.volume}</div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border shadow-sm">
             <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <p className="text-sm font-medium text-muted-foreground">Signal</p>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex items-center gap-2">
                <span className={cn(
                  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border",
                  selectedCompany.signal.includes("BUY")
                    ? "bg-green-500/10 text-green-500 border-green-500/20" 
                    : selectedCompany.signal.includes("SELL")
                      ? "bg-red-500/10 text-red-500 border-red-500/20"
                      : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                )}>
                  {selectedCompany.signal}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Chart (Takes up 2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {isLoading ? (
              <div className="h-[400px] w-full bg-card/30 animate-pulse rounded-xl" />
            ) : (
              <StockChart 
                data={stockData} 
                predictions={predictions} 
                ticker={selectedCompany.ticker} 
              />
            )}
            
            {/* News / Analysis Placeholder */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                Recent Analysis
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-4 h-4 text-muted-foreground/50 hover:text-primary cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[200px] text-xs">
                    Aggregated insights from major financial analysts and AI sentiment analysis of recent news.
                  </TooltipContent>
                </Tooltip>
              </h3>
              <div className="grid gap-4">
                {mockArticles.map((article) => (
                  <div 
                    key={article.id} 
                    onClick={() => setSelectedArticle(article)}
                    className="p-4 rounded-lg border border-border bg-card/30 hover:bg-card/50 transition-all cursor-pointer hover:border-primary/50 group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-primary group-hover:underline decoration-primary/50 underline-offset-4 transition-all">
                        {article.title}
                      </h4>
                      <span className="text-xs text-muted-foreground shrink-0 ml-2">{article.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {article.summary}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Prediction Panel (Takes up 1 col) */}
          <div className="space-y-6">
            {isLoading ? (
              <div className="h-[300px] w-full bg-card/30 animate-pulse rounded-xl" />
            ) : (
              <PredictionPanel 
                predictions={predictions} 
                currentPrice={currentPrice} 
              />
            )}
            
            {/* Comparison Table */}
            <Card className="border-border bg-card/30">
              <CardHeader>
                <CardTitle className="text-base">Sector Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {COMPANIES.slice(0, 5).map(c => (
                    <div key={c.ticker} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold w-12">{c.ticker}</span>
                        <span className="text-muted-foreground truncate w-24">{c.name}</span>
                      </div>
                      <span className={cn(
                        "font-mono",
                        c.change_percent >= 0 ? "text-green-500" : "text-red-500"
                      )}>
                        {c.change_percent > 0 ? "+" : ""}{c.change_percent}%
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <ArticleModal 
          isOpen={!!selectedArticle} 
          onClose={() => setSelectedArticle(null)} 
          article={selectedArticle} 
        />
      </div>
    </Layout>
  );
}
