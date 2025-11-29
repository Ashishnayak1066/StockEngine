import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StockPoint } from "@/lib/mockData";
import { ArrowUpRight, ArrowDownRight, BrainCircuit, Target, TrendingUp, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface PredictionPanelProps {
  predictions: StockPoint[];
  currentPrice: number;
}

export function PredictionPanel({ predictions, currentPrice }: PredictionPanelProps) {
  const nextMonth = predictions[29]; // 30 days out
  if (!nextMonth) return null;

  const predictedPrice = nextMonth.predicted || 0;
  const percentChange = ((predictedPrice - currentPrice) / currentPrice) * 100;
  const isPositive = percentChange >= 0;

  return (
    <div className="space-y-4">
      <Card className="border-border bg-card/50 backdrop-blur-sm shadow-lg overflow-hidden relative">
        <div className={cn(
          "absolute top-0 left-0 w-1 h-full", 
          isPositive ? "bg-green-500" : "bg-red-500"
        )} />
        
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-primary" />
              AI Forecast (30 Days)
            </CardTitle>
            <Badge variant="outline" className="font-mono text-xs bg-primary/10 text-primary border-primary/20">
              Model: PROPHET-V2
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Target Price</p>
              <div className="text-3xl font-mono font-bold tracking-tighter">
                ${predictedPrice.toFixed(2)}
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Expected Return</p>
              <div className={cn(
                "text-3xl font-mono font-bold tracking-tighter flex items-center gap-1",
                isPositive ? "text-green-500" : "text-red-500"
              )}>
                {isPositive ? <ArrowUpRight className="w-6 h-6" /> : <ArrowDownRight className="w-6 h-6" />}
                {Math.abs(percentChange).toFixed(2)}%
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-2">
                <Target className="w-4 h-4" /> Confidence Interval (95%)
              </span>
            </div>
            
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden relative">
              {/* Visualizing the range relative to price */}
              <div className="absolute left-[20%] right-[20%] h-full bg-primary/30 rounded-full" />
              <div className="absolute left-[48%] w-1 h-full bg-primary" /> {/* Center mark */}
            </div>
            
            <div className="flex justify-between font-mono text-xs text-muted-foreground">
              <span>${nextMonth.lower_bound?.toFixed(2)}</span>
              <span>${nextMonth.upper_bound?.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Model Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="border-border bg-card/30">
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
              RMSE Score
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-3 h-3 text-muted-foreground/50 hover:text-primary cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-[200px] text-xs">
                  Root Mean Square Error: Measures the average deviation of the model's predictions from actual values. Lower is better.
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="text-xl font-mono font-bold">0.42</div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card/30">
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground mb-1">Accuracy</div>
            <div className="text-xl font-mono font-bold text-green-500">87.4%</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
