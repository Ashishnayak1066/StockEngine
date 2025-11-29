import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ComposedChart,
  Line
} from "recharts";
import { StockPoint } from "@/lib/mockData";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface StockChartProps {
  data: StockPoint[];
  predictions: StockPoint[];
  ticker: string;
}

export function StockChart({ data, predictions, ticker }: StockChartProps) {
  const [timeRange, setTimeRange] = useState("1Y");

  // Combine data for the chart
  const allData = [
    ...data,
    ...predictions.map(p => ({
      ...p,
    }))
  ];

  // Filter based on time range
  const filteredData = allData.filter(point => {
    const date = new Date(point.date);
    const now = new Date();
    // Use the last data point as "now" for better simulation context if available,
    // but for filtering relative to "view", standard Date is fine.
    // Actually, mock data generates up to "today" (subDays from now), so using real Date is correct.
    
    const cutoff = new Date();
    if (timeRange === "1M") {
      cutoff.setMonth(now.getMonth() - 1);
    } else if (timeRange === "6M") {
      cutoff.setMonth(now.getMonth() - 6);
    } else {
      cutoff.setFullYear(now.getFullYear() - 1);
    }
    return date >= cutoff;
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const point = payload[0].payload;
      return (
        <div className="bg-card/95 backdrop-blur border border-border p-4 rounded-lg shadow-xl font-mono text-sm">
          <p className="text-muted-foreground mb-2">{format(new Date(label), "MMM dd, yyyy")}</p>
          {point.price > 0 && (
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span className="text-muted-foreground">Price:</span>
              <span className="font-bold text-foreground">${point.price.toFixed(2)}</span>
            </div>
          )}
          {point.predicted && (
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              <span className="text-muted-foreground">Forecast:</span>
              <span className="font-bold text-purple-400">${point.predicted.toFixed(2)}</span>
            </div>
          )}
          {point.lower_bound && (
            <div className="text-xs text-muted-foreground mt-2 pt-2 border-t border-border/50">
              Range: ${point.lower_bound.toFixed(2)} - ${point.upper_bound.toFixed(2)}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="border-border bg-card/50 backdrop-blur-sm shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-medium text-foreground">Price History & Forecast</CardTitle>
        <Tabs defaultValue="1Y" onValueChange={setTimeRange} className="w-[200px]">
          <TabsList className="grid w-full grid-cols-3 bg-muted/50">
            <TabsTrigger value="1M">1M</TabsTrigger>
            <TabsTrigger value="6M">6M</TabsTrigger>
            <TabsTrigger value="1Y">1Y</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={filteredData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(217 91% 60%)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(217 91% 60%)" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPred" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(280 65% 60%)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(280 65% 60%)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke="hsl(var(--muted-foreground))" 
                tick={{fontSize: 12}}
                tickFormatter={(str) => format(new Date(str), "MMM dd")}
                minTickGap={50}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))" 
                tick={{fontSize: 12}}
                domain={['auto', 'auto']}
                tickFormatter={(val) => `$${val}`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1, strokeDasharray: '5 5' }} />
              
              {/* Historical Price Area */}
              <Area 
                type="monotone" 
                dataKey="price" 
                stroke="hsl(var(--primary))" 
                fillOpacity={1} 
                fill="url(#colorPrice)" 
                strokeWidth={2}
              />

              {/* Prediction Line */}
              <Line 
                type="monotone" 
                dataKey="predicted" 
                stroke="hsl(280 65% 60%)" 
                strokeWidth={2} 
                strokeDasharray="5 5"
                dot={false}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />

              {/* Confidence Interval (using Area but referencing upper/lower bounds? Recharts makes this tricky with simple area. 
                  Simpler approach: just visualize the prediction line for now to keep it clean, 
                  or use a stacked area trick which is complex for this prototype.) 
                  
                  Let's stick to the Prediction Line for clarity in this mockup.
              */}
              
              <ReferenceLine x={data[data.length - 1]?.date} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" label={{ value: "TODAY", position: 'insideTopRight', fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
