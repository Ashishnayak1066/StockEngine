import React from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PredictionPanel } from "@/components/PredictionPanel";
import { generatePredictions } from "@/lib/mockData";
import { BrainCircuit } from "lucide-react";

export default function Predictions() {
  // Mock data for the view
  const predictions = generatePredictions(150, new Date().toISOString());

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <BrainCircuit className="w-8 h-8 text-primary" />
            AI Predictions
          </h2>
          <p className="text-muted-foreground">
            Advanced forecasting models for top 100 companies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <PredictionPanel predictions={predictions} currentPrice={150} />
           
           <Card className="bg-card/50 backdrop-blur">
             <CardHeader>
               <CardTitle>Model Confidence</CardTitle>
             </CardHeader>
             <CardContent>
               <p className="text-muted-foreground">
                 Our Prophet-V2 model is currently performing with 87.4% accuracy across the tech sector.
                 Confidence intervals are calculated using Monte Carlo simulations.
               </p>
             </CardContent>
           </Card>
        </div>
      </div>
    </Layout>
  );
}
