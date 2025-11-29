import React from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings as SettingsIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export default function Settings() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <SettingsIcon className="w-8 h-8 text-primary" />
            Settings
          </h2>
          <p className="text-muted-foreground">
            Manage your preferences and notifications.
          </p>
        </div>

        <div className="grid gap-6 max-w-2xl">
          <Card className="bg-card/50">
             <CardHeader>
               <CardTitle>Notifications</CardTitle>
             </CardHeader>
             <CardContent className="space-y-4">
               <div className="flex items-center justify-between">
                 <Label htmlFor="price-alerts">Price Alerts</Label>
                 <Switch id="price-alerts" defaultChecked />
               </div>
               <div className="flex items-center justify-between">
                 <Label htmlFor="prediction-updates">Prediction Updates</Label>
                 <Switch id="prediction-updates" defaultChecked />
               </div>
             </CardContent>
          </Card>

          <Card className="bg-card/50">
             <CardHeader>
               <CardTitle>Appearance</CardTitle>
             </CardHeader>
             <CardContent className="space-y-4">
               <div className="flex items-center justify-between">
                 <Label htmlFor="dark-mode">Dark Mode</Label>
                 <Switch id="dark-mode" defaultChecked disabled />
               </div>
                <p className="text-xs text-muted-foreground">Theme is currently locked to System Default (Dark).</p>
             </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
