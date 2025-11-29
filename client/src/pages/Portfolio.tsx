import React from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Wallet } from "lucide-react";

export default function Portfolio() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Wallet className="w-8 h-8 text-primary" />
            Portfolio
          </h2>
          <p className="text-muted-foreground">
            Track your holdings and performance.
          </p>
        </div>

        <Card className="bg-card/50 border-dashed border-2 flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <PieChart className="w-12 h-12 text-muted-foreground mx-auto" />
            <h3 className="text-xl font-medium">No Holdings Connected</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Connect your brokerage account or manually add stocks to track your portfolio performance against our AI predictions.
            </p>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
